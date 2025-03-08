import { serviceModules } from "$service/startup";
import { TYPES } from "../types";
import type { AuthService } from "$service/auth.service";
import msg from "@/entrypoints/messaging";
import "reflect-metadata";
import { authMessageInitialize } from "$service/messaging/auth-message";

export default defineBackground(async () => {
  console.log("Extension redirect URI:", chrome.identity.getRedirectURL());
  console.log("Initializing LLM Diagram Producer background...");

  // Initialize IoC container
  const container = await serviceModules();
  const authService = container.get<AuthService>(TYPES.AuthService);

  console.info("Background initialized, setting up messaging...");

  authMessageInitialize(msg, authService);
});
