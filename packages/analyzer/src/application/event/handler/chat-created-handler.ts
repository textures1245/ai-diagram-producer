import type { IEventHandler } from "@ai-ctx/core";
import { ChatCreated } from "@src/domain/event/chat-created";
import { TYPES } from "@src/types";
import type { Client } from "cassandra-driver";
import { inject } from "inversify";
import type { Logger } from "pino";

export class ChatCreatedEventHandler implements IEventHandler<ChatCreated> {
  public event = ChatCreated.name;

  constructor(
    @inject(TYPES.CassandraDb) private readonly _cassandraCli: Client,
    @inject(TYPES.Logger) private readonly _logger: Logger
  ) {}

  async handle(event: ChatCreated): Promise<void> {
    const query = `INSERT INTO chats (guid, user_guid, workspace_guid, content, role, images, tool_calls, version, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, toTimestamp(now()), toTimestamp(now()))`;

    await this._cassandraCli.execute(
      query,
      [
        event.guid,
        event.user_guid,
        event.workspace_guid,
        event.content,
        event.role,
        event.images,
        event.tool_calls,
        event.version,
      ],
      { prepare: true }
    );

    this._logger.info(
      `created read model for chat - ChatCreatedEventHandler: ${JSON.stringify(
        event
      )}`
    );
  }
}
