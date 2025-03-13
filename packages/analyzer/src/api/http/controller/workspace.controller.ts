import type { ICommandBus, IQueryBus } from "@ai-ctx/core";
import { TYPES } from "@src/types";
import { inject } from "inversify";
import {
  controller,
  httpGet,
  httpPost,
  queryParam,
  request,
  response,
} from "inversify-express-utils";
import type { Logger } from "pino";
import type { Request, Response } from "express";
import { msg, ok } from "../processor/resp";
import { GetWorkspacesByUserIdQuery } from "@src/application/query/definition/get-workspaces-by-userId-query";
import { CreateWorkspaceCommand } from "@src/application/commands/definition/create-workspace";

@controller("/api/v1/workspace")
export class WorkspaceController {
  constructor(
  @inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus,
    @inject(TYPES.QueryBus) private readonly _queryBus: IQueryBus,
    @inject(TYPES.Logger) private readonly _logger: Logger
  ) {}

  @httpGet("/qry")
  async getWorkspacesByQueryParams(
    @queryParam("user_id") user_id: string,
    @response() resp: Response
  ) {
    let data: any;

    if (!user_id) {
      return resp.status(400).json(msg("query param is required", "400"));
    }

    if (user_id) {
      const workspaces = await this._queryBus.execute(
        new GetWorkspacesByUserIdQuery(user_id)
      );
      data = workspaces;
    }

    return resp.status(200).json(ok("Workspaces fetched successfully", data));
  }

  @httpPost("")
  async createWorkspace(@request() req: Request, @response() resp: Response) {
    const { user_id, title }: { user_id: string; title: string } = req.body;

    this._logger.info(
      `received create workspace request: ${JSON.stringify({
        user_id,
        title,
      })}`
    );

    const workspaceResp = (await this._commandBus.send(
      new CreateWorkspaceCommand(user_id, title)
    )) as unknown as { guid: string };

    return resp
      .status(201)
      .json(ok("Workspace created successfully", workspaceResp.guid));
  }
}
