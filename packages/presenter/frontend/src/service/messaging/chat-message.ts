import { Chat, ChatDTO } from "$domain/chat";
import msg from "$entrypoints/messaging";
import { WorkspaceService } from "$service/workspace.service";
import { ChatMessagingMethods } from "./chat-message.interface";

import { authStore } from "$service/store/authStore";
import { get } from "svelte/store";
import { createMsgError } from "$service/lib/apperror";
import { createMsgSuccess } from "./response-processor";
import { workspaceStore } from "$service/store/workspaceStore";
import { ChatController } from "$service/adapter/http/controller/chat.controller";

export function chatMessagingInitialize(
  m: typeof msg,
  wksService: WorkspaceService
) {
  m.onMessage(
    ChatMessagingMethods.updateChat,
    async (msg: { data: { userId: string; wksId: string; data: ChatDTO } }) => {
      const { userId, wksId, data: message } = msg.data;

      try {
        const response = await wksService.updateChat({
          ...message,
          id: message.id,
          userId,
          workspaceId: wksId,
        });

        workspaceStore.updateChat(wksId, {
          ...message,
          id: message.id,
          userId,
          workspaceId: wksId,
        });

        return createMsgSuccess(response);
      } catch (error: any) {
        console.error("Error sending chat message", error);
        return createMsgError(error.message);
      }
    }
  );

  m.onMessage(
    ChatMessagingMethods.addNewChat,
    async (msg: { data: { userId: string; wksId: string; data: ChatDTO } }) => {
      const { userId, wksId, data: message } = msg.data;

      try {
        const response = await wksService.newChatToWorkspace(
          userId,
          wksId,
          message
        );

        workspaceStore.addChatToWorkspaceId(wksId, message);
        return createMsgSuccess(response);
      } catch (error: any) {
        console.error("Error sending chat message", error);
        return createMsgError(error.message);
      }
    }
  );

  m.onMessage(
    ChatMessagingMethods.getChats,
    async (msg: { data: { userId: string; wksId: string } }) => {
      const { userId, wksId } = msg.data;
      try {
        const response = await wksService.fetchChatsByQuery({
          workspace_id: wksId,
        });

        workspaceStore.setChatsToWorkspaceId(wksId, response);
        return createMsgSuccess();
      } catch (error: any) {
        console.error("Error fetching chats", error);
        return createMsgError(error.message);
      }
    }
  );
}
