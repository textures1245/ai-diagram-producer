import msg from "$entrypoints/messaging";
import { WorkspaceService } from "$service/workspace.service";
import { WorkspaceMessagingMethods } from "./workspace-message.interface";
import { workspaceStore } from "../store/workspaceStore";
import { ChatDTO } from "$domain/chat";
import { createMsgError } from "$service/lib/apperror";
import { createMsgSuccess } from "./response-processor";
import { WorkspaceDTO } from "$domain/workspace";
import { get } from "svelte/store";

export function wksMessagingInitialize(
  m: typeof msg,
  wksService: WorkspaceService
) {
  m.onMessage(
    WorkspaceMessagingMethods.getWkses,
    async (msg: { data: { userId: string } }) => {
      try {
        const response = await wksService.fetchWorkspaceByQuery({
          user_id: msg.data.userId,
        });
        return createMsgSuccess(response);
      } catch (error: any) {
        console.error("Error fetching workspaces", error);
        return createMsgError(error.message);
      }
    }
  );

  m.onMessage(
    WorkspaceMessagingMethods.initWksSession,
    async (msg: {
      data: { userId: string; wks: WorkspaceDTO; chat: ChatDTO };
    }) => {
      try {
        const response = await wksService.initWorkspaceSession(
          msg.data.userId,
          msg.data.wks.title,
          msg.data.chat
        );

        return createMsgSuccess(response);
      } catch (error: any) {
        console.error("Error initializing workspace session", error);
        return createMsgError(error.message);
      }
    }
  );
}
