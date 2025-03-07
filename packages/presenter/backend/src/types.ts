export const TYPES = {
  Db: Symbol("Db"),
  CassandraDb: Symbol("CassandraDb"),
  KafkaProducer: Symbol("KafkaProducer"),
  KafkaConsumer: Symbol("KafkaConsumer"),
  RedisSubscriber: Symbol("RedisSubscriber"),
  Redis: Symbol("Redis"),
  EventBus: Symbol("EventBus"),
  CommandBus: Symbol("CommandBus"),
  QueryBus: Symbol("QueryBus"),
  CommandHandler: Symbol("CommandHandler"),
  QueryHandler: Symbol("QueryHandler"),
  Event: Symbol("Event"),
  EventHandler: Symbol("EventHandler"),
  EventStore: Symbol("EventStore"),

  ApiServer: Symbol("ApiServer"),

  UserPrivateController: Symbol("UserPrivateController"),

  Logger: Symbol("Logger"),
  RequestLoggerMiddleware: Symbol("RequestLoggerMiddleware"),

  UserEventStore: Symbol("UserEventStore"),
  UserRepository: Symbol("UserRepository"),
};
