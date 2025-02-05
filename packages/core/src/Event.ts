import type { IEvent } from "interface/IEvent";

export type EVENT_METADATA_TYPES =
  | "type"
  | "aggregateName"
  | "aggregateId"
  | "version";

export const EVENT_METADATA_KEYS = [
  "type",
  "aggregateName",
  "aggregateId",
  "version",
];

export abstract class Event implements IEvent {
  public abstract type: string;
  public abstract aggregateName: string;
  public aggregateId: string;
  public version?: number | undefined;

  constructor(aggregateId: string, version?: number) {
    this.aggregateId = aggregateId;
    this.version = version;
  }
}
