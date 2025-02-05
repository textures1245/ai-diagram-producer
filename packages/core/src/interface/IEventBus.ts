import type { EventDescriptor } from "EventDescriptor";

export interface IEventBus {
    publish(chan: string, event: EventDescriptor): Promise<void>;
    subscribeEvents(): Promise<void>;
}