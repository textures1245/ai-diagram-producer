import type { ICommand } from "./ICommand";

export interface ICommandHandler<TCommand extends ICommand = any> {
    cmdToHandler: string;
    handle(cmd: TCommand): any;
}