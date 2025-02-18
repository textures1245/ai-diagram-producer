import { Command } from "@ai-ctx/core";

export class CreateWorkspaceCommand extends Command {
  public userGuid: string;

  constructor(userGuid: string, guid?: string) {
    super(guid);
    this.userGuid = userGuid;
  }
}
