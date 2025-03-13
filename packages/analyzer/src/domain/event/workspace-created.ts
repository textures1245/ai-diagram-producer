import { Event } from "@ai-ctx/core";

export class WorkspaceCreated extends Event {
  type = WorkspaceCreated.name; // convert class name to string for typeof checking on `AggregateRoot.ts`
  aggregateName = "workspace";

  constructor(public guid: string, public user_guid: string, public title: string) {
    super(guid);
  }
}
