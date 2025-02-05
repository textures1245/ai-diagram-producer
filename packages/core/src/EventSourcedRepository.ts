import type { AggregateRoot } from "AggregateRoot";
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
}
