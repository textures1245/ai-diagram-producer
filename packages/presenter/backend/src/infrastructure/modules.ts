import { AsyncContainerModule, type interfaces } from "inversify";
import { createMongodbConn } from "./db/mongodb";
import { createCassandraClient } from "./db/cassandra";
import config from "../config";
import type { Client } from "cassandra-driver";
import type { Db } from "mongodb";
import { Kafka, type Consumer, type Producer } from "kafkajs";
import { TYPES } from "../types";
import type { ICommandBus, IEventBus, IQuery, IQueryBus } from "@ai-ctx/core";
import { KafkaEventBus } from "./event-bus/kafka";
import type { IUserEventStore } from "../domain/user-event-store.interface";
import { UserEventStore } from "./event-store/user-event-store";
import type { IUserRepository } from "../domain/user-repository.interface";
import { UserRepository } from "./repository/user-repository";
import { CommandBus } from "./command-bus";
import { QueryBus } from "./query-bus";

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

    bind<IEventBus>(TYPES.EventBus).to(KafkaEventBus);
    bind<IUserEventStore>(TYPES.UserEventStore)
      .to(UserEventStore)
      .inSingletonScope();
    bind<IUserRepository>(TYPES.UserRepository)
      .to(UserRepository)
      .inSingletonScope();
    bind<ICommandBus>(TYPES.CommandBus).toConstantValue(new CommandBus());
    bind<IQueryBus<IQuery>>(TYPES.QueryBus).toConstantValue(new QueryBus());
  }
);
