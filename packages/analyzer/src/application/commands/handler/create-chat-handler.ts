import type { ICommandHandler } from "@ai-ctx/core";
import { CreateChatCommand } from "../definition/create-chat";
import { Chat } from "@src/domain/chat";
import { inject } from "inversify";
import { TYPES } from "@src/types";
import type { ChatRepository } from "@src/infrastructure/repository/chat-repository";

export class CreateChatCommandHandler
  implements ICommandHandler<CreateChatCommand>
{
  cmdToHandler = CreateChatCommand.name;

  constructor(
    @inject(TYPES.ChatRepository) private readonly _repo: ChatRepository
  ) {}

  async handle(cmd: CreateChatCommand): Promise<{ guid: string }> {
    const chat: Chat = new Chat(
      cmd.guid,
      cmd.userGuid,
      cmd.workspaceGuid,
      cmd.content,
      cmd.role,
      cmd.images,
      cmd.tool_calls,
      cmd.created_at,
      cmd.updated_at
    );
    await this._repo.save(chat, -1);
    return { guid: cmd.guid };
  }
}
