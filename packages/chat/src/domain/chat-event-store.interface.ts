import type { IEventStore } from "@ai-ctx/core";
import type { Chat } from "./chat";

export interface IChatEventStore extends IEventStore<Chat> {}
