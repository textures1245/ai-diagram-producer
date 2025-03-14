import { serviceModules } from "$service/startup";
import { TYPES } from "../types";
import type { AuthService } from "$service/auth.service";
import msg from "@/entrypoints/messaging";
import "reflect-metadata";
import { authMessageInitialize } from "$service/messaging/auth-message";
import { wksMessagingInitialize } from "$service/messaging/workspace-message";
import { WorkspaceService } from "$service/workspace.service";
import { chatMessagingInitialize } from "$service/messaging/chat-message";

export default defineBackground(async () => {
  // Initialize IoC container
  const container = await serviceModules();
  const authService = container.get<AuthService>(TYPES.AuthService);
  const workspaceService = container.get<WorkspaceService>(
    TYPES.WorkspaceService
  );

  console.info("Background initialized, setting up messaging...");

  authMessageInitialize(msg, authService);
  wksMessagingInitialize(msg, workspaceService);
  chatMessagingInitialize(msg, workspaceService);
});
