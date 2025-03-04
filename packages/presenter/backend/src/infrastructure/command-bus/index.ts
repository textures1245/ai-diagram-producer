import type { ICommand, ICommandBus, ICommandHandler } from "@ai-ctx/core";
import { injectable } from "inversify";

@injectable()
export class CommandBus<BaseCommand extends ICommand = ICommand>
  implements ICommandBus<BaseCommand>
{
  public handlers: Map<string, ICommandHandler<BaseCommand>> = new Map();

  public registerHandler(handler: ICommandHandler<BaseCommand>) {
    const targetCommend: string = handler.cmdToHandler;
    if (this.handlers.has(targetCommend)) {
      return;
    }
    this.handlers.set(targetCommend, handler);
  }
  public async send<T extends BaseCommand>(cmd: T): Promise<void> {
    if (this.handlers.has(cmd.constructor.name)) {
      return (
        this.handlers.get(cmd.constructor.name) as ICommandHandler<BaseCommand>
      ).handle(cmd);
    }
  }
}
