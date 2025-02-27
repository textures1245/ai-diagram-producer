import { EventStore, type IEventBus } from "@ai-ctx/core";
import type { IWorkspaceEventStore } from "@src/domain/workspace-event-store.interface";
import { TYPES } from "@src/types";
import { injectable, inject } from "inversify";
import { Db } from "mongodb";

@injectable()
export class WorkspaceEventStore extends EventStore implements IWorkspaceEventStore {
  constructor(
    @inject(TYPES.Db) private readonly db: Db,
    @inject(TYPES.EventBus) private readonly eventBus: IEventBus
  ) {
    super(db.collection("workspace-events"), eventBus);
  }
}
