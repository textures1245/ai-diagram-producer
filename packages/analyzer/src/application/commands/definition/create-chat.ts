import { Command } from "@ai-ctx/core";
import type { ChatRole } from "@src/domain/role";

export class CreateChatCommand extends Command {
  public userGuid: string;
  public workspaceGuid: string;
  public content: string;
  public role: ChatRole;
  public images?: string[];
  public tool_calls?: string[];
  public created_at?: Date;
  public updated_at?: Date;

  constructor(
    userGuid: string,
    workspaceGuid: string,
    content: string,
    role: ChatRole,
    images?: string[],
    tool_calls?: string[],
    created_at: Date = new Date(),
    updated_at: Date = new Date(),
    guid?: string,
  ) {
    super(guid);
    this.userGuid = userGuid;
    this.workspaceGuid = workspaceGuid;
    this.content = content;
    this.role = role;
    this.images = images;
    this.tool_calls = tool_calls;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}
