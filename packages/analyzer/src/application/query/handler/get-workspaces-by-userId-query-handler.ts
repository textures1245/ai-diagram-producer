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
    const query = `SELECT guid, user_guid, version FROM workspaces WHERE user_guid = ?`;
    const queryResult = await this._cassandraCli.execute(query, [q.userId]);
    const resp: WorkspaceResponseModel[] = queryResult.rows.map((row) => ({
      id: row["guid"] as string,
      userId: row["user_guid"] as string,
      version: row["version"] as number,
      chats: [],
    }));
    return resp;
  }
}
