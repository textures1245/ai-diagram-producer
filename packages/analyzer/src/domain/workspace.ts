import { AggregateRoot } from "@ai-ctx/core";
import { WorkspaceCreated } from "./event/workspace-created";

export class Workspace extends AggregateRoot {
  private user_guid!: string;
  private title!: string;
  private updated_at!: Date;
  private readonly created_at!: Date;

  constructor();

  constructor(guid: string, user_guid: string, title: string);

  constructor(guid?: string, user_guid?: string, title?: string) {
    super(guid);

    if (guid && user_guid && title) {
      this.applyChange(new WorkspaceCreated(guid, user_guid, title));
    }
  }

  applyWorkspaceCreated(event: WorkspaceCreated): void {
    this.guid = event.guid;
    this.user_guid = event.user_guid;
    this.title = event.title;
  }
}
