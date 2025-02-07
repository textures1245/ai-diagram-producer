import { Command } from "@ai-ctx/core";
import type { ChatRole } from "@src/domain/role";

export class UpdateChatCommand extends Command {
  public content: string;
  public role: ChatRole;
  public readonly originalVersion: number;
  public images?: string;
  public tool_calls?: string;

  constructor(
    guid: string,
    content: string,
    role: ChatRole,
    originalVersion: number,
    images?: string,
    tool_calls?: string
  ) {
    super(guid);
    this.content = content;
    this.role = role;
    this.originalVersion = originalVersion;
    this.images = images;
    this.tool_calls = tool_calls;
  }
}
