import { config, configType } from "$config";
import { UserSession } from "$domain/userSession";
import msg from "$entrypoints/messaging";
import { AuthService } from "$service/auth.service";
import { createMsgError } from "$service/lib/apperror";
import { authStore } from "$service/store/authStore";
import { AuthMessagingMethods } from "./auth-message.interface";

export function authMessageInitialize(m: typeof msg, authService: AuthService) {
  m.onMessage(
    AuthMessagingMethods.authenticateUser,
    async (msg: { data: { email: string; password: string } }) => {
      const { email, password } = msg.data;
      console.info("Authentication request received", { email });
      try {
        const { user, ...result } = await authService.authenticate({
          email,
          password,
        });
        console.info("Authentication successful");

        authStore.setAuth({
          user: new UserSession(user.email, user.id),
        });
        await storage.setItem(`local:${config.auth.cookies.token}`, {
          value: result.token,
        });
        await storage.setItem(`local:${config.auth.cookies.refreshToken}`, {
          value: result.refreshToken,
        });

        return { success: true, user: result };
      } catch (error: any) {
        console.error("Authentication failed", error);
        return createMsgError(error.message);
      }
    }
  );

  m.onMessage(AuthMessagingMethods.validateToken, async () => {
    const token = await storage.getItem<configType['token']>(
      `local:${config.auth.cookies.token}`
    );
    if (!token) return createMsgError("No token found");

    console.info("Token validation request received");
    try {
      const result = await authService.validateToken(token.value);
      return { success: true, isValid: result.isValid, user: result.user };
    } catch (error: any) {
      console.error("Token validation failed", error);
      return createMsgError(error.message);
    }
  });

  m.onMessage(AuthMessagingMethods.refreshToken, async () => {
    const refreshToken = await storage.getItem<configType['refreshToken']>(
      `local:${config.auth.cookies.refreshToken}`
    );

    if (!refreshToken) {
      return createMsgError("No refresh token found");
    }

    console.info("Token refresh request received");
    try {
      const result = await authService.refreshToken(refreshToken.value);
      await storage.setItem(`local:${config.auth.cookies.token}`, {
        value: result.token,
      });

      return { success: true, token: result.token };
    } catch (error: any) {
      console.error("Token refresh failed", error);
      return createMsgError(error.message);
    }
  });

  m.onMessage(
    AuthMessagingMethods.googleSignIn,
    async (msg: { data: { idToken: string } }) => {
      const { idToken } = msg.data;
      console.info("Google sign-in request received");
      try {
        const { user, ...result } = await authService.authenticateWithGoogle(
          idToken
        );

        authStore.setAuth({
          user: new UserSession(user.email, user.id),
        });
        await storage.setItem(`local:${config.auth.cookies.token}`, {
          value: result.token,
        });
        await storage.setItem(`local:${config.auth.cookies.refreshToken}`, {
          value: result.refreshToken,
        });

        return { success: true, user: result };
      } catch (error: any) {
        console.error("Google sign-in failed", error);
        return createMsgError(error.message);
      }
    }
  );

  m.onMessage(AuthMessagingMethods.logoutUser, async () => {
    console.info("Logout request received");
    try {
      await authService.logout();

      authStore.clearAuth();

      await storage.removeItem(`local:${config.auth.cookies.token}`);
      await storage.removeItem(`local:${config.auth.cookies.refreshToken}`);
      return { success: true };
    } catch (error: any) {
      console.error("Logout failed", error);
      return createMsgError(error.message);
    }
  });
}
