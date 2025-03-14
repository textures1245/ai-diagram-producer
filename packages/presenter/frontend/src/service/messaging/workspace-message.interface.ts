import { Chat, ChatDTO } from "$domain/chat";
import { WorkspaceDTO } from "$domain/workspace";
import type { MessageResponse } from "./response-processor";

export interface IWorkspaceMessaging {
  initWksSession(
    userId: string,
    wks: WorkspaceDTO,
    chat: ChatDTO
  ): MessageResponse<{
    workspaceId: string;
    chatId: string;
  }>;
  getWkses(userId: string): MessageResponse<WorkspaceDTO[]>;
}

type WorkspaceMessagingMethod = keyof IWorkspaceMessaging;

export const WorkspaceMessagingMethods = {
  initWksSession: "initWksSession",
  getWkses: "getWkses",
} as const satisfies Record<
  WorkspaceMessagingMethod,
  keyof IWorkspaceMessaging
>;
