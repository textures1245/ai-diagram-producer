import type { IQueryHandler } from "@ai-ctx/core";
import { GetAllUsersQuery } from "../definition/get-all-users-query";
import type { UserResponse } from "../definition/user-response";
import { Client } from 'cassandra-driver';
import { inject } from 'inversify';
import { TYPES } from "@src/types";

export class GetAllUsersQueryHandler
  implements IQueryHandler<GetAllUsersQuery, UserResponse[]>
{
  queryToHandler = GetAllUsersQuery.name;

  constructor(
    @inject(TYPES.CassandraDb) private readonly _cassandraCli: Client
  ) {}

  async execute(_: GetAllUsersQuery): Promise<UserResponse[]> {
    const tsql = `SELECT guid, email FROM users`;

    const results = (await this._cassandraCli.execute(tsql)).rows;

    if (results.length === 0) {
     return [];
    }

    let users: UserResponse[] = results.map(result => ({
      id: result["guid"],
      email: result["email"],
    }));

    return users;
  }
}