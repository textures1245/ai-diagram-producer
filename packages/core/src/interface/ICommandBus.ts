import type { ICommand } from "./ICommand";
import type { ICommandHandler } from "./ICommandHandler";

export interface ICommandBus<BaseCommand extends ICommand = ICommand> {
    registerHandler(handler: ICommandHandler<BaseCommand>): any;
    send<T extends BaseCommand>(cmd: T): Promise<void>;
}