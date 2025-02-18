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
  Logger: Symbol("Logger"),

  // analyzer package
  ChatRepository: Symbol("ChatRepository"),
  ChatEventStore: Symbol("ChatEventStore"),
  GetAllChatsQueryHandler: Symbol("GetAllChatsQueryHandler"),
  GetChatsByWorkspaceIdQueryHandler: Symbol("GetChatsByWorkspaceIdQueryHandler"),

  WorkspaceRepository: Symbol("WorkspaceRepository"),
  WorkspaceEventStore: Symbol("WorkspaceEventStore"),
  GetWorkspacesByUserIdQueryHandler: Symbol(
    "GetWorkspacesByUserIdQueryHandler"
  ),
};
