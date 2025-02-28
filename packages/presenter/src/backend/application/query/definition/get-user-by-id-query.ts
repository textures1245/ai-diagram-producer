import type { IQuery } from "@ai-ctx/core";

export class GetUserByIdQuery implements IQuery {
  public userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }
}
