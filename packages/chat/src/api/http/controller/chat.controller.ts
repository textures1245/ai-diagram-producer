import { TYPES } from "@src/types";
import {
  controller,
  httpGet,
  httpPost,
  request,
  response,
} from "inversify-express-utils";
import { inject } from "inversify";
import type { Request, Response } from "express";
import type { ICommandBus, IQueryBus } from "@ai-ctx/core";
import { Logger } from "winston";
import { CreateChatCommand } from "@src/application/commands/definition/create-chat";
import { ok } from "../processor/resp";
import { UpdateChatCommand } from "@src/application/commands/definition/update-chat";
import { GetAllChatsQuery } from "@src/application/query/definition/get-all-chats-query";

@controller("/api/v1/chat")
export class ChatController {
  constructor(
    @inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus,
    @inject(TYPES.QueryBus) private readonly _queryBus: IQueryBus,
    @inject(TYPES.Logger) private readonly _logger: Logger
  ) {}

  @httpGet("")
  async getAllChats(@request() _req: Request, @response() resp: Response) {
    this._logger.info("get all chats request");
    const chats = await this._queryBus.execute(new GetAllChatsQuery());
    return resp.json(ok("Chats fetched successfully", chats));
  }

  @httpPost("")
  async createChat(@request() req: Request, @response() resp: Response) {
    const { content, role, images, tool_calls } = req.body;

    this._logger.info(
      `received create chat request: ${JSON.stringify({
        content,
        role,
        images,
        tool_calls,
      })}`
    );

    const cmdRes = await this._commandBus.send(
      new CreateChatCommand(content, role, images, tool_calls)
    );
    return resp.json(ok("Chat created successfully", cmdRes));
  }

  @httpPost("/:id")
  async updateChat(@request() req: Request, @response() resp: Response) {
    const { content, role, images, tool_calls } = req.body;
    const { id } = req.params;

    this._logger.info(
      `received update chat request: ${JSON.stringify({
        id,
        content,
        role,
        images,
        tool_calls,
      })}`
    );

    await this._commandBus.send(
      new UpdateChatCommand(id, content, role, images, tool_calls)
    );
    return resp.json(ok("Chat updated successfully", undefined));
  }
}
