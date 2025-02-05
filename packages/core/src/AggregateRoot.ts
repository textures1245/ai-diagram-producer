import type { IEvent } from "interface/IEvent";
import { nanoid } from "nanoid";

export abstract class AggregateRoot {
  public guid: string;
  private _version: number = 0;
  private _changes: IEvent[] = [];

  get version(): number {
    return this._version;
  }

  constructor(guid?: string) {
    this.guid = guid || nanoid();
  }

  public getUncommittedEvents(): IEvent[] {
    return this._changes;
  }

  public markChangesAsCommitted(): void {
    this._changes = [];
  }

  public loadFromHistory(events: IEvent[]): void {
    for (const event of events) {
      this.applyEvent(event);
      this._version++;
    }
  }

  protected applyChange(event: IEvent): void {
    this.applyEvent(event, true);
  }

  private applyEvent(event: IEvent, isNew = false): void {
    const handler = `apply${event.type}`;

    if (typeof (this as any)[handler] === "function") {
      (this as any)[handler](event);
    } else {
      throw new Error(`Handler method named ${event.type} not implemented`);
    }

    if (isNew) {
      this._changes.push(event);
    }
  }
}
