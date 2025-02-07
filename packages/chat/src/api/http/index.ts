import config from "@src/config";
import { infraInitialize } from "@src/startup";
import { TYPES } from "@src/types";
import type { Application } from "express";

(async () => {
  const container = await infraInitialize();
  const api: Application = container.get<Application>(TYPES.ApiServer);

  api.listen(config.API_PORT, () =>
    console.log(`the application is running on port ${config.API_PORT}`)
  );
})();
