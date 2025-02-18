import type { IEventHandler } from "@ai-ctx/core";
import  { WorkspaceCreated } from "@src/domain/event/workspace-created";
import { TYPES } from "@src/types";
import type { Client } from "cassandra-driver";
import { inject } from 'inversify';
import type { Logger } from "pino";


export class WorkspaceCreatedEventHandler implements IEventHandler<WorkspaceCreated> {
    public event = WorkspaceCreated.name;

    constructor (
        @inject(TYPES.CassandraDb) private readonly _cassandraCli: Client,
        @inject(TYPES.Logger) private readonly _logger: Logger
    ) {}

    async handle(event: WorkspaceCreated): Promise<void> {
        const query = `INSERT INTO workspaces (guid, user_guid, version) VALUES (?, ?, ?)`;

        await this._cassandraCli.execute(
            query,
            [
                event.guid,
                event.user_guid,
                event.version,
            ],
            { prepare: true }
        );

        this._logger.info(
            `created read model for workspace - WorkspaceCreatedEventHandler: ${JSON.stringify(
                event
            )}`
        );
    }
}