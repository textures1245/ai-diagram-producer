import { Command } from "@ai-ctx/core";
import type { ChatRole } from "@src/domain/role";

export class CreateChatCommand extends Command {
  public content: string;
  public role: ChatRole;
  public images?: string;
  public tool_calls?: string;

  constructor(
    content: string,
    role: ChatRole,
    guid?: string,
    images?: string,
    tool_calls?: string
  ) {
    super(guid);
    this.content = content;
    this.role = role;
    this.images = images;
    this.tool_calls = tool_calls;
  }
}
