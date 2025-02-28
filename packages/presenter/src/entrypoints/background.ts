import { serviceModules } from "../service/startup";
import { TYPES } from "../types";
import type { AuthService } from "../service/auth.service";
import type { Logger } from "pino";
import msg from "./messaging";
import { authStore } from "../service/store/authStore";
import { localExtStorage } from "@webext-core/storage";
import { UserSession } from "../domain/userSession";

export default defineBackground(async () => {
  console.log("Initializing LLM Diagram Producer background...");

  try {
    // Initialize IoC container
    const container = await serviceModules();
    const logger = container.get<Logger>(TYPES.Logger);
    const authService = container.get<AuthService>(TYPES.AuthService);

    logger.info("Background initialized, setting up messaging...");

    // Register message handlers
    msg.onMessage(
      "authenticateUser",
      async (msg: { data: { email: string; password: string } }) => {
        const { email, password } = msg.data;
        logger.info("Authentication request received", { email });
        try {
          const { user, ...result } = await authService.authenticate({
            email,
            password,
          });
          logger.info("Authentication successful");

          authStore.setAuth({
            user: new UserSession(user.email, user.id),
          });
          localExtStorage.setItem("token", { value: result.token });
          localExtStorage.setItem("refreshToken", {
            value: result.refreshToken,
          });

          return { success: true, user: result };
        } catch (error: any) {
          logger.error("Authentication failed", error);
          return { success: false, error: error.message };
        }
      }
    );

    msg.onMessage("validateToken", async () => {
      const token = await localExtStorage.getItem("token");

      logger.info("Token validation request received");
      try {
        const result = await authService.validateToken(token);
        return { success: true, isValid: result.isValid, user: result.user };
      } catch (error: any) {
        logger.error("Token validation failed", error);
        return { success: false, isValid: false, error: error.message };
      }
    });

    msg.onMessage("refreshToken", async () => {
      const refreshToken = await localExtStorage.getItem("refreshToken");
      logger.info("Token refresh request received");
      try {
        const result = await authService.refreshToken(refreshToken);
        await localExtStorage.setItem("token", { value: result.token });

        return { success: true, token: result.token };
      } catch (error: any) {
        logger.error("Token refresh failed", error);
        return { success: false, error: error.message };
      }
    });

    msg.onMessage(
      "googleSignIn",
      async (msg: { data: { idToken: string } }) => {
        const { idToken } = msg.data;
        logger.info("Google sign-in request received");
        try {
          const { user, ...result } = await authService.authenticateWithGoogle(
            idToken
          );

          authStore.setAuth({
            user: new UserSession(user.email, user.id),
          });
          await localExtStorage.setItem("token", { value: result.token });
          await localExtStorage.setItem("refreshToken", {
            value: result.refreshToken,
          });

          return { success: true, user: result };
        } catch (error: any) {
          logger.error("Google sign-in failed", error);
          return { success: false, error: error.message };
        }
      }
    );

    msg.onMessage("logoutUser", async () => {
      logger.info("Logout request received");
      try {
        await authService.logout();

        authStore.clearAuth();

        await localExtStorage.removeItem("token");
        await localExtStorage.removeItem("refreshToken");
        return { success: true };
      } catch (error: any) {
        logger.error("Logout failed", error);
        return { success: false, error: error.message };
      }
    });

    logger.info("All messaging handlers registered successfully");
  } catch (error) {
    console.error("Failed to initialize background service:", error);
  }
});
