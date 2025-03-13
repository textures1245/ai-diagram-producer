import { Event } from "@ai-ctx/core";
import type { ChatRole } from "../role";

export class ChatUpdated extends Event {
  type = ChatUpdated.name;
  aggregateName = "chat";
  constructor(
    public guid: string,
    public content: string,
    public role: ChatRole,
    public images?: string,
    public tool_calls?: string,
    public updated_at = new Date()
  ) {
    super(guid);
  }
}
