export default {
  API_PORT: process.env["API_PORT"] || 3200,
  MONGODB_URI: process.env["MONGODB_URI"] || "mongodb://localhost:27017",
  DB_NAME: process.env["DB_NAME"] || "ai_ctx-dev",
  REDIS_URI: process.env["REDIS_URI"] || "redis://localhost:6379",
  KAFKA_BROKER_LIST: process.env["KAFKA_BROKER_LIST"] || "localhost:9092",
  KAFKA_CONSUMER_GROUP_ID:
    process.env["KAFKA_CONSUMER_GROUP_ID"] || "ai_ctx.analyzer.dev",
  KAFKA_TOPICS_TO_SUBSCRIBE: process.env["KAFKA_TOPICS_TO_SUBSCRIBE"] || "chat,workspace",
  CASSANDRA_HOSTS: process.env["CASSANDRA_HOSTS"]
    ? process.env["CASSANDRA_HOSTS"].split(",")
    : ["localhost:9042"],
  CASSANDRA_DC: process.env["CASSANDRA_DC"] || "datacenter1",
  CASSANDRA_KEYSPACE: process.env["CASSANDRA_KEYSPACE"] || "ai_ctx_dev",
};
