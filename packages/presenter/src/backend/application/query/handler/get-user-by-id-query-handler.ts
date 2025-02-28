import type { IQueryHandler } from "@ai-ctx/core";
import { GetUserByIdQuery } from "../definition/get-user-by-id-query";
import type { UserResponse } from "../definition/user-response";
import type { Client } from "cassandra-driver";
import { TYPES } from "../../../types";
import { inject } from "inversify";

export class GetUserByIdQueryHandler
  implements IQueryHandler<GetUserByIdQuery, UserResponse>
{
  queryToHandler = GetUserByIdQuery.name;

  constructor(
    @inject(TYPES.CassandraDb) private readonly _cassandraCli: Client
  ) {}

  async execute(query: GetUserByIdQuery): Promise<UserResponse> {
    const tsql = `SELECT guid, email FROM users WHERE guid = ?`;

    const [result] = (await this._cassandraCli.execute(tsql, [query.userId]))
      .rows;
    if (!result) {
      throw new Error("User not found");
    }
    
    let user: UserResponse = {
      id: result["guid"],
      email: result["email"],
    };

    return user;
  }
}
