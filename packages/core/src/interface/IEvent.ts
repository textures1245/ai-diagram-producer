import type { IMessage } from "./IMessage";

export interface IEvent extends IMessage {
    type: string;
    aggregateName: string;
    aggregateId: string;
    version?: number;
}