import {
  createPinoLogger,
  type ICommand,
  type ICommandBus,
  type ICommandHandler,
  type IEventHandler,
  type IQuery,
  type IQueryBus,
  type IQueryHandler,
} from "@ai-ctx/core";
import { Container } from "inversify";
import { infrastructureModules } from "@infrastructure/module";
import { TYPES } from "./types";

import pino from "pino";
import type { ChatCreated } from "@domain/event/chat-created";
import type { ChatUpdated } from "@domain/event/chat-updated";
import { ChatCreatedEventHandler } from "@application/event/handler/chat-created-handler";
import { ChatUpdatedEventHandler } from "@application/event/handler/chat-updated-handler";
import { CreateChatCommand } from "./application/commands/definition/create-chat";
import { CreateChatCommandHandler } from "@application/commands/handler/create-chat-handler";
import { UpdateChatCommand } from "./application/commands/definition/update-chat";
import { UpdateChatCommandHandler } from "./application/commands/handler/update-chat-handler";
import { GetAllChatsQueryHandler } from "./application/query/handler/get-all-chats-query-handler";
import { InversifyExpressServer } from "inversify-express-utils";
import { urlencoded, json, type Application } from "express";
import { errorHandler } from "./api/http/middleware/error-handler";

export const infraInitialize = async () => {
  const container = new Container();
  const logger = createPinoLogger("ai-ctx-chat");

  await container.loadAsync(infrastructureModules);

  container.bind<pino.Logger>(TYPES.Logger).toConstantValue(logger);
  container
    .bind<IEventHandler<ChatCreated>>(TYPES.Event)
    .to(ChatCreatedEventHandler);
  container
    .bind<IEventHandler<ChatUpdated>>(TYPES.Event)
    .to(ChatUpdatedEventHandler);
  container
    .bind<ICommandHandler<CreateChatCommand>>(TYPES.CommandHandler)
    .to(CreateChatCommandHandler);
  container
    .bind<ICommandHandler<UpdateChatCommand>>(TYPES.CommandHandler)
    .to(UpdateChatCommandHandler);
  container
    .bind<IQueryHandler<IQuery>>(TYPES.QueryHandler)
    .to(GetAllChatsQueryHandler);

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

  const server = new InversifyExpressServer(container);

  server.setConfig((app: Application) => {
    app.use(json());
    app.use(urlencoded({ extended: true }));
  });

  server.setErrorConfig((app: Application) => {
    app.use(errorHandler);
  });

  const apiServer = server.build();
  container.bind<Application>(TYPES.ApiServer).toConstantValue(apiServer);

  return container;
};
