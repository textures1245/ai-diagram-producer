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
import type { ICommandBus } from "@ai-ctx/core/src/interface/ICommandBus";
import { UserPrivateController } from "./adapter/private/controller/user.controller";
import {  InversifyExpressServer } from "inversify-express-utils";
import { urlencoded, json, type Application } from "express";
import { errorHandler } from "./adapter/http/middleware/error-handler";
import type { ValidateCredentialQuery } from "./application/query/definition/validate-credential-query";
import { ValidateCredentialQueryHandler } from "./application/query/handler/validate-credential-query-handler";
import type { GetUserByIdQuery } from "./application/query/definition/get-user-by-id-query";
import { GetUserByIdQueryHandler } from "./application/query/handler/get-user-by-id-query-handler";
import type { GetAllUsersQuery } from "./application/query/definition/get-all-users-query";
import { GetAllUsersQueryHandler } from "./application/query/handler/get-all-users-query-handler";
import {  LogRequestMiddleware } from "./adapter/http/middleware/host-info-request";

export const infraInitialize = async () => {
  const container = new Container();
  const logger = createPinoLogger("ai-ctx-presenter-backend");
  const logRequest = new LogRequestMiddleware(createPinoLogger("ai-ctx-presenter-backend-host-request"));

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

  container
    .bind<IQueryHandler<ValidateCredentialQuery>>(TYPES.QueryHandler)
    .to(ValidateCredentialQueryHandler);
  container
    .bind<IQueryHandler<GetUserByIdQuery>>(TYPES.QueryHandler)
    .to(GetUserByIdQueryHandler);
  container
    .bind<IQueryHandler<GetAllUsersQuery>>(TYPES.QueryHandler)
    .to(GetAllUsersQueryHandler);

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

  const server = new InversifyExpressServer(container);

  server.setConfig((app: Application) => {
    app.use(json());
    app.use(urlencoded({ extended: true }));
    // app.use(logRequest.domainInfoRequest.bind(logRequest));
  });

  server.setErrorConfig((app: Application) => {
    app.use(errorHandler);
  });

  const apiServer = server.build();
  container.bind<Application>(TYPES.ApiServer).toConstantValue(apiServer);

  return container;
};
