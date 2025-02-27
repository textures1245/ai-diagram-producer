import type { IEventHandler } from "@ai-ctx/core";
import { inject } from "inversify";
import { UserPasswordUpdated } from "../../../domain/event/user-password-updated";
import { TYPES } from "../../../types";
import type pino from "pino";
import type { Client } from "cassandra-driver";

export class UserPasswordUpdatedEventHandler
  implements IEventHandler<UserPasswordUpdated>
{
  public event: string = UserPasswordUpdated.name;

  constructor(
    @inject(TYPES.CassandraDb) private readonly cassandraCli: Client,
    @inject(TYPES.Logger) private readonly logger: pino.Logger
  ) {}

  public handle(event: UserPasswordUpdated): void {
    const query = `UPDATE users SET password = ?, updated_at = toTimestamp(now()) WHERE guid = ?`;

    const params = [event.password, event.guid];
    this.cassandraCli
      .execute(query, params, { prepare: true })
      .then(() =>
        this.logger.info(
          `Password successfully updated for user: ${event.guid}`
        )
      )
      .catch((err) =>
        this.logger.error(
          `Failed to update password for user: ${event.guid}. Error: ${err.message}`
        )
      );
  }
}
