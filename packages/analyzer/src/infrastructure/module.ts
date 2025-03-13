import { AsyncContainerModule, type interfaces } from "inversify";
import { Db } from "mongodb";
import type { Client } from "cassandra-driver";
import { Kafka, type Consumer, type Producer } from "kafkajs";
// import RedisClient, { Redis } from "ioredis";

import type { ICommandBus, IEventBus, IQuery, IQueryBus } from "@ai-ctx/core";
import { TYPES } from "@src/types";
import config from "@src/config";
import type { IChatEventStore } from "@src/domain/chat-event-store.interface";
import type { IChatRepository } from "@src/domain/chat-repository.interface";
import { createCassandraClient } from "@infrastructure/db/cassandra";
import { createMongodbConn } from "@infrastructure/db/mongodb";
import { KafkaEventBus } from "@infrastructure/event-bus/kafka";
import { ChatEventStore } from "@infrastructure/event-store/chat-event-store";
import { ChatRepository } from "@infrastructure/repository/chat-repository";
import { CommandBus } from "@infrastructure/command-bus";
import { QueryBus } from "@infrastructure/query-bus";
import type { IWorkspaceEventStore } from "@src/domain/workspace-event-store.interface";
import { WorkspaceEventStore } from "./event-store/workspace-event-store";
import { WorkspaceRepository } from "./repository/workspace-repository";
import type { IWorkspaceRepository } from "@src/domain/workspace-repository.interface";

export const infrastructureModules = new AsyncContainerModule(
  async (bind: interfaces.Bind) => {
    const db: Db = await createMongodbConn(config.MONGODB_URI);
    const cassandra: Client = createCassandraClient(
      config.CASSANDRA_HOSTS,
      config.CASSANDRA_DC,
      config.CASSANDRA_KEYSPACE
    );

    const kafka = new Kafka({ brokers: config.KAFKA_BROKER_LIST.split(",") });
    const kafkaProducer = kafka.producer();
    const kafkaConsumer = kafka.consumer({
      groupId: config.KAFKA_CONSUMER_GROUP_ID,
    });
    kafkaProducer.connect();

    bind<Db>(TYPES.Db).toConstantValue(db);
    bind<Client>(TYPES.CassandraDb).toConstantValue(cassandra);
    bind<Producer>(TYPES.KafkaProducer).toConstantValue(kafkaProducer);
    bind<Consumer>(TYPES.KafkaConsumer).toConstantValue(kafkaConsumer);
    // bind<Redis>(TYPES.Redis).toConstantValue(new RedisClient(config.REDIS_URI));
    bind<IEventBus>(TYPES.EventBus).to(KafkaEventBus);

    bind<IChatEventStore>(TYPES.ChatEventStore)
      .to(ChatEventStore)
      .inSingletonScope();
    bind<IChatRepository>(TYPES.ChatRepository)
      .to(ChatRepository)
      .inSingletonScope();

    bind<IWorkspaceEventStore>(TYPES.WorkspaceEventStore)
      .to(WorkspaceEventStore)
      .inSingletonScope();
    bind<IWorkspaceRepository>(TYPES.WorkspaceRepository)
      .to(WorkspaceRepository)
      .inSingletonScope();

    bind<ICommandBus>(TYPES.CommandBus).toConstantValue(new CommandBus());
    bind<IQueryBus<IQuery>>(TYPES.QueryBus).toConstantValue(new QueryBus());
  }
);
