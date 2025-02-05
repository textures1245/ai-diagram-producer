import { EventDescriptor } from "EventDescriptor";
import type { IEvent } from "interface/IEvent";
import type { IEventBus } from "interface/IEventBus";
import type { IEventStore } from "interface/IEventStore";
import { injectable, unmanaged } from "inversify";
import { Collection } from "mongodb";
import { ConcurrencyException, NotFoundException } from "utils/Error";
import {
  createEventDescriptor,
  rehydrateEventFromDescriptor,
} from "utils/EventProcessor";

@injectable()
export abstract class EventStore implements IEventStore {
  constructor(
    @unmanaged() private readonly _eventCollection: Collection,
    @unmanaged() private readonly _eventBus: IEventBus
  ) {}

  async saveEvents(
    aggregateGuid: string,
    eventHistory: IEvent[],
    expectedVersion: number
  ): Promise<void> {
    const ops: any[] = []; // Array to hold MongoDB operations

    // Get the latest event descriptor for the aggregate
    const latestEvent = await this.getLastEventDescriptor(aggregateGuid);

    // Check for concurrency issues
    if (
      latestEvent &&
      latestEvent.version !== expectedVersion &&
      expectedVersion !== -1
    ) {
      throw new ConcurrencyException(
        `Cannot perform the operation due to internal conflict`
      );
    }

    let i = expectedVersion;

    // Process each event in the event history
    for (const event of eventHistory) {
      i++;
      event.version = i; // Increment the version
      const eventDescriptor = createEventDescriptor(event); // Create event descriptor
      this._eventBus.publish(event.aggregateName, eventDescriptor); // Publish the event
      ops.push({ insertOne: eventDescriptor }); // Add insert operation to the ops array
    }

    // Perform bulk insert operation (not shown in the provided code)
    await this._eventCollection.bulkWrite(ops);
  }

  async getEventsForAggregate(aggregateGuid: string): Promise<IEvent[]> {
    const events: any[] = await this._eventCollection
      .find({ aggregateGuid })
      .toArray();
    if (!events.length) {
      throw new NotFoundException(
        `No events found for aggregate: ${aggregateGuid}`
      );
    }
    return events.map((eventDescriptor: EventDescriptor) =>
      rehydrateEventFromDescriptor(eventDescriptor)
    );
  }

  private async getLastEventDescriptor(aggregateGuid: string) {
    const [latestEvent] = await this._eventCollection
      .find({ aggregateGuid })
      .sort({ version: -1 })
      .limit(1)
      .toArray();
    return latestEvent as any;
  }
}
