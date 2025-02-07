import {
  createWinstonLogger,
  type ICommandHandler,
  type IEventHandler,
  type IQuery,
  type IQueryHandler,
} from "@ai-ctx/core";
import { Container } from "inversify";
import { infrastructureModules } from "@infrastructure/module";
import { TYPES } from "./types";
import winston from "winston";
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

export const infraInitialize = async () => {
  const container = new Container();
  const logger = createWinstonLogger("ai-ctx-chat");

  await container.loadAsync(infrastructureModules);

  container.bind<winston.Logger>(TYPES.Logger).toConstantValue(logger);
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

  const server = new InversifyExpressServer(container);

  server.setConfig((app) => {
    app.use(json());
    app.use(urlencoded({ extended: true }));
  });

  server.setErrorConfig((app) => {
    app.use;
  });

  const apiServer = server.build();
  container.bind<Application>(TYPES.ApiServer).toConstantValue(apiServer);

  return container;
};
