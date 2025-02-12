import type { IEventHandler } from "@ai-ctx/core";
import { ChatUpdated } from '../../../domain/event/chat-updated';
import { TYPES } from "@src/types";

import type { Client } from "cassandra-driver";
import { inject } from "inversify";
export class ChatUpdatedEventHandler implements IEventHandler<ChatUpdated> {
    public event = ChatUpdated.name;

    constructor(
        @inject(TYPES.CassandraDb) private readonly _cassandraCli: Client,
    ) {}
    
    async handle(event: ChatUpdated): Promise<void> {
        const query = `UPDATE chats SET content = ?, role = ?, images = ?, tool_calls = ? WHERE guid = ?`;
 
        await this._cassandraCli.execute(
            query,
            [
                event.content,
                event.role,
                event.images,
                event.tool_calls,
                event.guid,
            ],
            { prepare: true }
        )
    }
    public cmdToHandler = "chat.updated";
    
}