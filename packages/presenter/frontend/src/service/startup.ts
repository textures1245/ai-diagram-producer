import { Container } from "inversify";

import { TYPES } from "../types";
import { config } from "$config/index";
import { AuthController } from "./adapter/http/controller/auth.controller";
import {
  FetchClient,
  type HttpClient,
} from "./adapter/http/processor/fetch-client";
import { AuthService } from "./auth.service";

export const serviceModules = async () => {
  const container = new Container();

  if (!config.key.jwtToken || !config.key.googleToken) {
    throw new Error(
      "Missing environment variables: JWT_SECRET and/or GOOGLE_TOKEN"
    );
  }
  
  container.bind<string>(TYPES.ApiBaseUrl).toConstantValue(config.apiBaseUrl);
  // Bind the HTTP client
  container.bind<HttpClient>(TYPES.HttpClient).to(FetchClient);

  container
    .bind<string>(TYPES.JwtTokenKey)
    .toConstantValue(config.key.jwtToken);
  container
    .bind<string>(TYPES.GoogleClientIdKey)
    .toConstantValue(config.key.googleToken);

  container.bind<AuthController>(TYPES.AuthController).to(AuthController);
  container.bind<AuthService>(TYPES.AuthService).toDynamicValue((context) => {
    return new AuthService(
      config.key.jwtToken,
      config.key.googleToken,
      context.container.get<AuthController>(TYPES.AuthController)
    );
  });

  return container;
};
