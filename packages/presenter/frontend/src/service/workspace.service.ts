import { inject, injectable } from "inversify";

import { TYPES } from "../types";
import { FetchWorkspacesByQuery, WorkspaceController } from "./adapter/http/controller/workspace.controller";
import { ChatController, FetchChatsByQuery } from './adapter/http/controller/chat.controller';
import { Chat, ChatDTO } from "$domain/chat";

@injectable()
export class WorkspaceService {
  constructor(
    @inject(TYPES.WorkspaceController)
    private readonly workspaceConn: WorkspaceController,
    @inject(TYPES.ChatController) private readonly chatConn: ChatController
  ) {}

  async fetchWorkspaceByQuery(qry: FetchWorkspacesByQuery) {
    return this.workspaceConn.fetchWorkspacesByQuery(qry);
}

  async fetchChatsByQuery(qry: FetchChatsByQuery) {
    const chats = await this.chatConn.fetchChatsByQuery (qry);

    return chats;
  }

  async newChatToWorkspace(userId: string, wksId: string, chat: ChatDTO) {
    const { guid } = await this.chatConn.createChat(wksId, userId, chat);

    return guid;
  }

  async updateChat(chat: ChatDTO) {
    const { guid } = await this.chatConn.updateChat(chat.id, chat);
    return guid;
  }

  async initWorkspaceSession(userId: string, chat: ChatDTO) {
    const wksRes = await this.workspaceConn.createWorkspace(userId);

    const chatId = await this.chatConn.createChat(wksRes.guid, userId, chat);

    return { workspaceId: wksRes.guid, chatId: chatId.guid };
  }
}
