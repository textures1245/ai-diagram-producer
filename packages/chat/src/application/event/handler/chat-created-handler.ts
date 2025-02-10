import type { IEventHandler } from "@ai-ctx/core";
import { ChatCreated } from "@src/domain/event/chat-created";
import { TYPES } from "@src/types";
import type { Client } from "cassandra-driver";
import { inject } from "inversify";
import { Logger } from "winston";

export class ChatCreatedEventHandler implements IEventHandler<ChatCreated> {
  public event = ChatCreated.name;

  constructor(
    @inject(TYPES.CassandraDb) private readonly _cassandraCli: Client,
    @inject(TYPES.Logger) private readonly _logger: Logger
  ) {}

  async handle(event: ChatCreated): Promise<void> {
    const query = `INSERT INTO chats (guid, content, role, images, tool_calls, version) VALUES (?, ?, ?, ?, ?, ?)`;

    await this._cassandraCli.execute(
      query,
      [
        event.guid,
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
