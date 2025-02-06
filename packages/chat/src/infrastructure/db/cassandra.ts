import { Client } from "cassandra-driver";

export const createCassandraClient = (
  host: string[],
  dc: string,
  keySpace: string
): Client => {
  const cli: Client = new Client({
    contactPoints: host,
    localDataCenter: dc,
    keyspace: keySpace,
  });
  return cli;
};
