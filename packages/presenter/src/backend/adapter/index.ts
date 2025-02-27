import * as dotenv from "dotenv";
dotenv.config();

import "reflect-metadata";
import { infraInitialize } from "../startup";
import type { UserPrivateController } from "./private/controller/user.controller";
import { TYPES } from "../types";

export const controller = async () => {
  const container = await infraInitialize();
  const userController = container.get<UserPrivateController>(
    TYPES.UserPrivateController
  );
  return { userController };
};


