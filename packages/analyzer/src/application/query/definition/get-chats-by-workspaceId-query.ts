import type { IQuery } from "@ai-ctx/core";

export class GetChatsByWorkspaceIdQuery implements IQuery {
  constructor(public workspaceId: string) {
    this.workspaceId = workspaceId;
  }
}
