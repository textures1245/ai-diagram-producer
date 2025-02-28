import * as dotenv from "dotenv";
dotenv.config();

import { Container } from "inversify";
import { createPinoLogger } from "@ai-ctx/core";
import type { Logger } from "pino";
import { TYPES } from "../types";
import { AuthService } from "./auth.service";
import { config } from "../lib/config";
import { controller } from "../backend/adapter";

export const serviceModules = async () => {
  const container = new Container();
  const logger = createPinoLogger("ai-ctx-presenter-service");

  const { userController } = await controller();

  container.bind<Logger>(TYPES.Logger).toConstantValue(logger);

  if (!config.JWT_SECRET || !config.GOOGLE_TOKEN) {
    throw new Error(
      "Missing environment variables: JWT_SECRET and/or GOOGLE_TOKEN"
    );
  }

  container
    .bind<AuthService>(TYPES.AuthService)
    .toDynamicValue(
      (ctx) =>
        new AuthService(
          config.JWT_SECRET!,
          config.GOOGLE_TOKEN!,
          userController,
          ctx.container.get<Logger>(TYPES.Logger)
        )
    );

  return container;
};
