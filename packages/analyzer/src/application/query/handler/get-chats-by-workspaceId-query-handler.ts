import type { IQueryHandler } from "@ai-ctx/core";
import { inject } from "inversify";
import type { Client } from "cassandra-driver";
import { TYPES } from "@src/types";
import { GetChatsByWorkspaceIdQuery } from "../definition/get-chats-by-workspaceId-query";
import type { ChatQueryResponseModel } from "../definition/chat-response";
import type { ChatRole } from "@src/domain/role";

export class GetChatsByWorkspaceIdQueryHandler
  implements
    IQueryHandler<GetChatsByWorkspaceIdQuery, ChatQueryResponseModel[]>
{
  queryToHandler = GetChatsByWorkspaceIdQuery.name;

  constructor(
    @inject(TYPES.CassandraDb) private readonly _cassandraCli: Client
  ) {}

  async execute(
    q: GetChatsByWorkspaceIdQuery
  ): Promise<ChatQueryResponseModel[]> {
    const query = `SELECT guid, content, role, images, tool_calls, version FROM chats WHERE workspace_guid = ? ALLOW FILTERING`;
    const queryResult = await this._cassandraCli.execute(query, [
      q.workspaceId,
    ]);
    const resp: ChatQueryResponseModel[] = queryResult.rows.map((row) => ({
      id: row["id"] as string,
      content: row["content"] as string,
      role: row["role"] as ChatRole,
      images: row["images"] as string,
      tool_calls: row["tool_calls"] as string,
      version: row["version"] as number,
      created_at: row["created_at"] as Date,
      updated_at: row["updated_at"] as Date,
    }));
    return resp;
  }
}
