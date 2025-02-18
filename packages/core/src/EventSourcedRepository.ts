import type { AggregateRoot } from "AggregateRoot";
import type { IEvent } from "interface/IEvent";
import type { IEventStore } from "interface/IEventStore";
import type { IRepository } from "interface/IRepository";
import { injectable, unmanaged } from "inversify";

@injectable()
export class EventSourcedRepository<T extends AggregateRoot>
  implements IRepository<T>
{
  constructor(
    @unmanaged() private _eventStore: IEventStore,
    @unmanaged() private _Type: { new (): T }
  ) {}
  async save(aggregateRoot: T, expectedVersion: number) {
    await this._eventStore.saveEvents(
      aggregateRoot.guid,
      aggregateRoot.getUncommittedEvents(),
      expectedVersion
    );
    aggregateRoot.markChangesAsCommitted();
  }
  async getById(aggregateId: string): Promise<T> {
    const aggregateRoot = new this._Type() as T;
    const history = await this._eventStore.getEventsForAggregate(aggregateId);
    aggregateRoot.loadFromHistory(history);
    return aggregateRoot;
  }

  async getManyByDynamicQuery(field: string, value: string): Promise<T[]> {
    const eventDocs = await this._eventStore.getEventsByDynamicQuery(
      field,
      value
    );
    if (eventDocs.length === 0) return [];

    // Group events by aggregateGuid
    const grouped = eventDocs.reduce(
      (acc: { [key: string]: IEvent[] }, doc) => {
        const guid = doc.aggregateId;
        if (!acc[guid]) {
          acc[guid] = [];
        }
        acc[guid].push(doc);
        return acc;
      },
      {}
    );

    return Object.values(grouped).map((eventHistory) => {
      const aggregate = new this._Type() as T;
      aggregate.loadFromHistory(eventHistory);
      return aggregate;
    });
  }
}
