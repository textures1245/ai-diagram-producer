import "@adapter/http/controller/index";
import * as dotenv from "dotenv";
dotenv.config();

import "reflect-metadata";
import type { IEventBus } from "@ai-ctx/core";
import config from "@src/config";
import { infraInitialize } from "@src/startup";
import { TYPES } from "@src/types";
import type { Consumer } from "kafkajs";

(async () => {
  const container = await infraInitialize();
  const kafkaConsumer = container.get<Consumer>(TYPES.KafkaConsumer);
  kafkaConsumer.connect();

  for (const topic of config.KAFKA_TOPICS_TO_SUBSCRIBE.split(",")) {
    await kafkaConsumer.subscribe({ topic, fromBeginning: true });
  }

  const baseEventHandler = container.get<IEventBus>(TYPES.EventBus);
  await baseEventHandler.subscribeEvents();
})();
