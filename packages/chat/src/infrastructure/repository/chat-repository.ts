import { EventSourcedRepository, type IEventStore } from "@ai-ctx/core";
import { Chat } from "@src/domain/chat";
import type { IChatRepository } from "@src/domain/chat-repository.interface";
import { TYPES } from "@src/types";
import { injectable, inject } from "inversify";

@injectable()
export class ChatRepository
  extends EventSourcedRepository<Chat>
  implements IChatRepository
{
  constructor(
    @inject(TYPES.ChatEventStore) private readonly eventStore: IEventStore
  ) {
    super(eventStore, Chat);
  }
}
