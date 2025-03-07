import { serviceModules } from "$service/startup";
import { TYPES } from "../types";
import type { AuthService } from "$service/auth.service";
import msg from "@/entrypoints/messaging";
import { authStore } from "$service/store/authStore";
import { UserSession } from "../domain/userSession";
import { AuthMessagingMethods } from "$service/messaging/auth-service.interface";
import { createAppError } from "$service/lib/apperror";
import { storage } from "wxt/storage";

import { config } from "../config/index";

import "reflect-metadata";

export default defineBackground(async () => {
  console.log("Extension redirect URI:", chrome.identity.getRedirectURL());
  console.log("Initializing LLM Diagram Producer background...");

  // Initialize IoC container
  const container = await serviceModules();
  const authService = container.get<AuthService>(TYPES.AuthService);

  console.info("Background initialized, setting up messaging...");

  // Register message handlers
  msg.onMessage(
    "authenticateUser",
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
        return createAppError(error.message);
      }
    }
  );

  msg.onMessage(AuthMessagingMethods.validateToken, async () => {
    const token = await storage.getItem<string>(
      `local:${config.auth.cookies.token}`
    );
    if (!token) return createAppError("No token found");

    console.info("Token validation request received");
    try {
      const result = await authService.validateToken(token);
      return { success: true, isValid: result.isValid, user: result.user };
    } catch (error: any) {
      console.error("Token validation failed", error);
      return createAppError(error.message);
    }
  });

  msg.onMessage(AuthMessagingMethods.refreshToken, async () => {
    const refreshToken = await storage.getItem<string>(
      `local:${config.auth.cookies.refreshToken}`
    );

    if (!refreshToken) {
      return createAppError("No refresh token found");
    }

    console.info("Token refresh request received");
    try {
      const result = await authService.refreshToken(refreshToken);
      await storage.setItem(`local:${config.auth.cookies.token}`, {
        value: result.token,
      });

      return { success: true, token: result.token };
    } catch (error: any) {
      console.error("Token refresh failed", error);
      return createAppError(error.message);
    }
  });

  msg.onMessage(
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
        return createAppError(error.message);
      }
    }
  );

  msg.onMessage(AuthMessagingMethods.logoutUser, async () => {
    console.info("Logout request received");
    try {
      await authService.logout();

      authStore.clearAuth();

      await storage.removeItem(`local:${config.auth.cookies.token}`);
      await storage.removeItem(`local:${config.auth.cookies.refreshToken}`);
      return { success: true };
    } catch (error: any) {
      console.error("Logout failed", error);
      return createAppError(error.message);
    }
  });

  console.info("All messaging handlers registered successfully");
});
