import {
  createPinoLogger,
  type ICommand,
  type ICommandHandler,
  type IEventHandler,
  type IQuery,
  type IQueryBus,
  type IQueryHandler,
} from "@ai-ctx/core";
import { Container } from "inversify";
import { infrastructureModules } from "./infrastructure/modules";
import type { pino } from "pino";
import { TYPES } from "./types";
import type { UserCreated } from "./domain/event/user-created";
import { UserCreatedEventHandler } from "./application/event/handler/user-created-handler";
import { UserPasswordUpdated } from "./domain/event/user-password-updated";
import { UserPasswordUpdatedEventHandler } from "./application/event/handler/user-password-updated-handler";
import type { CreateUserCommand } from "./application/commands/definition/create-user";
import { CreateUserCommandHandler } from "./application/commands/handler/create-user-handler";
import { UpdateUserPasswordCommand } from "./application/commands/definition/update-user-password";
import { UpdateUserPasswordCommandHandler } from "./application/commands/handler/update-user-password-handler";
import type { ICommandBus } from "../../../core/src/interface/ICommandBus";
import { UserPrivateController } from "./adapter/private/controller/user.controller";

export const infraInitialize = async () => {
  const container = new Container();
  const logger = createPinoLogger("ai-ctx-presenter-backend");

  await container.loadAsync(infrastructureModules);
  container.bind<pino.Logger>(TYPES.Logger).toConstantValue(logger);
  container
    .bind<IEventHandler<UserCreated>>(TYPES.Event)
    .to(UserCreatedEventHandler);

  container
    .bind<IEventHandler<UserCreated>>(TYPES.Event)
    .to(UserCreatedEventHandler);
  container
    .bind<IEventHandler<UserPasswordUpdated>>(TYPES.Event)
    .to(UserPasswordUpdatedEventHandler);
  container
    .bind<ICommandHandler<CreateUserCommand>>(TYPES.CommandHandler)
    .to(CreateUserCommandHandler);
  container
    .bind<ICommandHandler<UpdateUserPasswordCommand>>(TYPES.CommandHandler)
    .to(UpdateUserPasswordCommandHandler);

  const commandBus = container.get<ICommandBus>(TYPES.CommandBus);

  container
    .getAll<ICommandHandler<ICommand>>(TYPES.CommandHandler)
    .forEach((handler: ICommandHandler<ICommand>) => {
      commandBus.registerHandler(handler);
    });

  const queryBus = container.get<IQueryBus>(TYPES.QueryBus);

  container
    .getAll<IQueryHandler<IQuery>>(TYPES.QueryHandler)
    .forEach((handler: IQueryHandler<IQuery>) => {
      queryBus.registerHandler(handler);
    });

  container
    .bind<UserPrivateController>(TYPES.UserPrivateController)
    .to(UserPrivateController);

  return container;
};
