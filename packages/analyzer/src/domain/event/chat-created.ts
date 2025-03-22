import { Event } from "@ai-ctx/core";
import type { ChatRole } from "../role";

export class ChatCreated extends Event {
  type = ChatCreated.name; // convert class name to string for typeof checking on `AggregateRoot.ts`
  aggregateName = "chat";

  constructor(
    public guid: string,
    public user_guid: string,
    public workspace_guid: string,
    public content: string,
    public role: ChatRole,
    public images?: string[],
    public tool_calls?: string[],
    public created_at: Date = new Date(),
    public updated_at: Date = new Date()
  ) {
    super(guid);
  }
}
