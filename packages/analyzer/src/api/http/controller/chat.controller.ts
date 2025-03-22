import { TYPES } from "@src/types";
import {
  controller,
  httpGet,
  httpPatch,
  httpPost,
  queryParam,
  request,
  response,
} from "inversify-express-utils";
import { inject } from "inversify";
import type { Request, Response } from "express";
import type { ICommandBus, IQueryBus } from "@ai-ctx/core";

import type { Logger } from "pino";
import { CreateChatCommand } from "@src/application/commands/definition/create-chat";
import { msg, ok } from "../processor/resp";
import { UpdateChatCommand } from "@src/application/commands/definition/update-chat";
import { GetAllChatsQuery } from "@src/application/query/definition/get-all-chats-query";
import type { ChatRole } from "@src/domain/role";
import { GetChatsByWorkspaceIdQuery } from "@src/application/query/definition/get-chats-by-workspaceId-query";

@controller("/api/v1/chat")
export class ChatController {
  constructor(
    @inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus,
    @inject(TYPES.QueryBus) private readonly _queryBus: IQueryBus,
    @inject(TYPES.Logger) private readonly _logger: Logger
  ) {}

  @httpGet("")
  async getAllChats(@request() _req: Request, @response() resp: Response) {
    const chats = await this._queryBus.execute(new GetAllChatsQuery());
    this._logger.info(`get all chats request ${JSON.stringify(chats)}`);
    return resp.status(200).json(ok("Chats fetched successfully", chats));
  }
  @httpGet("/qry")
  async getChatsByQueryParams(
    @queryParam("workspace_id") workspace_id: string,
    @response() resp: Response
  ) {
    let data: any;

    if (!workspace_id) {
      return resp.status(400).json(msg("query param is required", "400"));
    }

    if (workspace_id) {
      const chats = await this._queryBus.execute(
        new GetChatsByWorkspaceIdQuery(workspace_id)
      );
      data = chats;
    }

    return resp.status(200).json(ok("Chats fetched successfully", data));
  }

  @httpPost("")
  async createChat(@request() req: Request, @response() resp: Response) {
    const { workspace_id, user_id, content, role, images, tool_calls } =
      req.body;

    this._logger.info(
      `received create chat request: ${JSON.stringify({
        workspace_id,
        user_id,
        content,
        role,
        images,
        tool_calls,
      })}`
    );

    const cmdRes = await this._commandBus.send(
      new CreateChatCommand(
        user_id,
        workspace_id,
        content,
        role,
        images,
        tool_calls
      )
    );
    return resp.status(201).json(ok("Chat created successfully", cmdRes));
  }

  @httpPatch("/:id")
  async updateChat(@request() req: Request, @response() resp: Response) {
    const { content, role, images, tool_calls, version } = req.body as {
      content: string;
      role: ChatRole;
      version: number;
      images?: string[];
      tool_calls?: string[];
    };
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
      new UpdateChatCommand(id, content, role, version, images, tool_calls)
    );
    return resp.status(204).json(ok("Chat updated successfully", undefined));
  }
}
