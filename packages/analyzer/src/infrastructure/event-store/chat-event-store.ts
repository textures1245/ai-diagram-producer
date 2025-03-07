import { EventStore, type IEventBus } from "@ai-ctx/core";
import type { IChatEventStore } from "@src/domain/chat-event-store.interface";
import { TYPES } from "@src/types";
import { injectable, inject } from "inversify";
import { Db } from "mongodb";

@injectable()
export class ChatEventStore extends EventStore implements IChatEventStore {
  constructor(
    @inject(TYPES.Db) private readonly db: Db,
    @inject(TYPES.EventBus) private readonly eventBus: IEventBus
  ) {
    // Cast the collection to any to bypass the type incompatibility between different MongoDB versions
    super(db.collection("chat-events"), eventBus);
  }
}
