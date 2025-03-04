import { EventStore, type IEventBus } from "@ai-ctx/core";
import { inject, injectable } from "inversify";
import type { IUserEventStore } from "../../domain/user-event-store.interface";
import { TYPES } from "../../types";
import { Db } from "mongodb";

@injectable()
export class UserEventStore extends EventStore implements IUserEventStore {
  constructor(
    @inject(TYPES.Db) private readonly db: Db,
    @inject(TYPES.EventBus) private readonly eventBus: IEventBus
  ) {
    super(db.collection("user-events"), eventBus);
  }
}
