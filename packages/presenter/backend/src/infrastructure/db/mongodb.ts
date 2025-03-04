import config from "@config/index";
import { type MongoClientOptions, MongoClient, Db } from "mongodb";

export const createMongodbConn = async (
  hostUrl: string,
  opts?: MongoClientOptions
): Promise<Db> => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(hostUrl, opts)
      .then((client) => resolve(client.db(config.DB_NAME)))
      .catch((err) => reject(err));
  });
};
