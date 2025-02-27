import type { IEventStore } from "@ai-ctx/core";
import type { User } from "./user";

export interface IUserEventStore extends IEventStore<User> {
    
}