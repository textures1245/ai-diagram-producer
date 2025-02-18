import type { IQuery } from "@ai-ctx/core";

export class GetWorkspacesByUserIdQuery implements IQuery {
  constructor(public userId: string) {
    this.userId = userId;
  }
}
