import type { IQueryHandler } from "@ai-ctx/core";
import { GetAllChatsQuery } from "../definition/get-all-chats-query";
import type { ChatQueryResponseModel } from "../definition/chat-response";
import { TYPES } from "@src/types";
import type { Client } from "cassandra-driver";
import type { ChatRole } from "@src/domain/role";
import { inject } from "inversify";

export class GetAllChatsQueryHandler
  implements IQueryHandler<GetAllChatsQuery, ChatQueryResponseModel[]>
{
  queryToHandler = GetAllChatsQuery.name;

  constructor(
    @inject(TYPES.CassandraDb) private readonly _cassandraCli: Client
  ) {}

  async execute(_: GetAllChatsQuery) {
    const query = `SELECT guid, content, role, images, tool_calls, version FROM chats`;
    const queryResult = await this._cassandraCli.execute(query);
    const resp: ChatQueryResponseModel[] = queryResult.rows.map((row) => ({
      id: row["id"] as string,
      content: row["content"] as string,
      role: row["role"] as ChatRole,
      images: row["images"] as string,
      tool_calls: row["tool_calls"] as string,
      version: row["version"] as number,
    }));
    return resp;
  }
}
