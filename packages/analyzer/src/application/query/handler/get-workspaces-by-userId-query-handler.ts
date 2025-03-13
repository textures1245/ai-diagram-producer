import type { IQueryHandler } from "@ai-ctx/core";
import { GetWorkspacesByUserIdQuery } from "../definition/get-workspaces-by-userId-query";
import type { WorkspaceResponseModel } from "../definition/workspace-response";
import { inject } from "inversify";
import type { Client } from "cassandra-driver";
import { TYPES } from "@src/types";

export class GetWorkspacesByUserIdQueryHandler
  implements
    IQueryHandler<GetWorkspacesByUserIdQuery, WorkspaceResponseModel[]>
{
  queryToHandler = GetWorkspacesByUserIdQuery.name;

  constructor(
    @inject(TYPES.CassandraDb) private readonly _cassandraCli: Client
  ) {}

  async execute(
    q: GetWorkspacesByUserIdQuery
  ): Promise<WorkspaceResponseModel[]> {
    const query = `SELECT guid, user_guid, title, version, created_at FROM workspaces WHERE user_guid = ? ALLOW FILTERING`;
    const queryResult = await this._cassandraCli.execute(query, [q.userId]);
    const resp: WorkspaceResponseModel[] = queryResult.rows.map((row) => ({
      id: row["guid"] as string,
      title: row["title"] as string,
      user_id: row["user_guid"] as string,
      version: row["version"] as number,
      created_at: row["created_at"] as Date,
      chats: [],
    }));
    return resp;
  }
}
