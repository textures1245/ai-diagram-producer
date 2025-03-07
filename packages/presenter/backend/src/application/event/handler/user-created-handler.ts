import type { IEventHandler } from "@ai-ctx/core";
import { UserCreated } from "../../../domain/event/user-created";

import type { Client } from "cassandra-driver";
import { inject } from "inversify";
import type { Logger } from "pino";

import { TYPES } from "@src/types";

export class UserCreatedEventHandler implements IEventHandler<UserCreated> {
  public event = UserCreated.name;

  constructor(
    @inject(TYPES.CassandraDb) private readonly _cassandraCli: Client,
    @inject(TYPES.Logger) private readonly _logger: Logger
  ) {}

  async handle(event: UserCreated): Promise<void> {
    const query = `INSERT INTO users (guid, email, password, created_at, updated_at) VALUES (?, ?, ?, toTimestamp(now()), toTimestamp(now()))`;
    await this._cassandraCli.execute(
      query,
      [event.guid, event.email, event.password],
      { prepare: true }
    );
    this._logger.info(
      `created read model for user - UserCreatedEventHandler: ${JSON.stringify(
        event
      )}`
    );
  }
}
