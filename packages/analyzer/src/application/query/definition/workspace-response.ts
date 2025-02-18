import type { Chat } from "@src/domain/chat";

export class WorkspaceResponseModel {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly chats: Chat[]
  ) {}
}
