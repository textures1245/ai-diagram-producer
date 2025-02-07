import type { ICommandHandler } from "@ai-ctx/core";
import { UpdateChatCommand } from "../definition/update-chat";
import { inject } from "inversify";
import { TYPES } from "@src/types";
import type { ChatRepository } from "@src/infrastructure/repository/chat-repository";

export class UpdateChatCommandHandler
  implements ICommandHandler<UpdateChatCommand>
{
  cmdToHandler = UpdateChatCommand.name;

  constructor(
    @inject(TYPES.ChatRepository) private readonly _repo: ChatRepository
  ) {}

  async handle(cmd: UpdateChatCommand): Promise<void> {
    const chat = await this._repo.getById(cmd.guid);
    chat.updateInfo(cmd.content, cmd.role, cmd.images, cmd.tool_calls);
    await this._repo.save(chat, cmd.originalVersion);
  }
}
