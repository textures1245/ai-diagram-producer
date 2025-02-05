import type { IMessage } from "./IMessage";

export interface ICommand extends IMessage {
    guid: string;
}