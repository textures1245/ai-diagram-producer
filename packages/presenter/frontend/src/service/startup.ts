import { Container } from "inversify";

import { TYPES } from "../types";
import { config } from "$config/index";
import { AuthController } from "./adapter/http/controller/auth.controller";
import {
  FetchClient,
  type HttpClient,
} from "./adapter/http/processor/fetch-client";
import { AuthService } from "./auth.service";
import { WorkspaceController } from "./adapter/http/controller/workspace.controller";
import { ChatController } from "./adapter/http/controller/chat.controller";
import { WorkspaceService } from "./workspace.service";

export const serviceModules = async () => {
  const container = new Container();

  if (!config.key.jwtToken || !config.key.googleToken) {
    throw new Error(
      "Missing environment variables: JWT_SECRET and/or GOOGLE_TOKEN"
    );
  }

  container
    .bind<string>(TYPES.JwtTokenKey)
    .toConstantValue(config.key.jwtToken);
  container
    .bind<string>(TYPES.GoogleClientIdKey)
    .toConstantValue(config.key.googleToken);

  container
    .bind<AuthController>(TYPES.AuthController)
    .toConstantValue(new AuthController(config.api.presenterBackend));
  container
    .bind<WorkspaceController>(TYPES.WorkspaceController)
    .toConstantValue(new WorkspaceController(config.api.analyzer));
  container
    .bind<ChatController>(TYPES.ChatController)
    .toConstantValue(new ChatController(config.api.analyzer));

  container.bind<AuthService>(TYPES.AuthService).toDynamicValue((context) => {
    return new AuthService(
      config.key.jwtToken,
      context.container.get<AuthController>(TYPES.AuthController)
    );
  });
  container.bind<WorkspaceService>(TYPES.WorkspaceService).to(WorkspaceService);

  return container;
};
