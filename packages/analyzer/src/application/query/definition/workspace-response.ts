import type { Chat } from "@src/domain/chat";

export class WorkspaceResponseModel {
  constructor(
    public readonly id: string,
    public readonly user_id: string,
    public readonly created_at: Date,
    public readonly chats: Chat[]
  ) {}
}
