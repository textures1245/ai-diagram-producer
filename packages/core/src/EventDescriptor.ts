import type { StorageEvent } from "./utils/EventProcessor";

export class EventDescriptor {
  constructor(
    public readonly aggregateGuid: string,
    public readonly aggregateName: string,
    public readonly type: string,
    public readonly payload: StorageEvent,
    public readonly version?: number
  ) {}
}
