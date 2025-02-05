import { instanceToPlain, plainToInstance } from "class-transformer";
import { type EVENT_METADATA_TYPES, EVENT_METADATA_KEYS } from "../Event";
import { EventDescriptor } from "../EventDescriptor";
import type { IEvent } from "interface/IEvent";

export type StorageEvent = Omit<IEvent, EVENT_METADATA_TYPES>;
export class RehydratedEvent {}

export function createEventDescriptor<T extends IEvent = IEvent>(
  event: T
): EventDescriptor {
  const JSONEvent = instanceToPlain(event);

  for (const attribute of EVENT_METADATA_KEYS) {
    delete JSONEvent[attribute];
  }

  return new EventDescriptor(
    event.aggregateId,
    event.aggregateName,
    event.type,
    JSONEvent,
    event.version
  );
}

export function rehydrateEventFromDescriptor(
  storeEvent: EventDescriptor
): IEvent {
  const event: any = plainToInstance(RehydratedEvent, storeEvent);
  return {
      type: storeEvent.type,
      aggregateName: storeEvent.aggregateName,
      aggregateId: storeEvent.aggregateGuid,
      version: storeEvent.version,
      ...event.payload
  }
}
