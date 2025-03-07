import "@adapter/private/controller/index";
import { infraInitialize } from "../../startup";
import type { UserPrivateController } from "./controller/user.controller";
import { TYPES } from "../../types";

export async function adapterInitialize() {
  const container = await infraInitialize();
  const userController = container.get<UserPrivateController>(
    TYPES.UserPrivateController
  );
  return { userController };
};


