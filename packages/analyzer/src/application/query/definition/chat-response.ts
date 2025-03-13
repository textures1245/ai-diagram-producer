import type { ChatRole } from "@src/domain/role";

export class ChatQueryResponseModel {
  constructor(
    public readonly id: string,
    public readonly content: string,
    public readonly role: ChatRole,
    public readonly created_at: Date,
    public readonly updated_at: Date, 
    public readonly images?: string,
    public readonly tool_calls?: string,
  ) {}
}
