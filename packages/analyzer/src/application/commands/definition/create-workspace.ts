import { Command } from "@ai-ctx/core";

export class CreateWorkspaceCommand extends Command {
  public userGuid: string;
  public title: string

  constructor(userGuid: string, title: string, guid?: string) {
    super(guid);
    this.title = title;
    this.userGuid = userGuid;
  }
}
