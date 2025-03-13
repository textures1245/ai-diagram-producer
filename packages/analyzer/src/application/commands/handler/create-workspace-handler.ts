import type { ICommandHandler } from "@ai-ctx/core";
import { CreateWorkspaceCommand } from "@application/commands/definition/create-workspace";
import { Workspace } from "@src/domain/workspace";
import type { WorkspaceRepository } from "@src/infrastructure/repository/workspace-repository";
import { TYPES } from "@src/types";
import { inject } from "inversify";

export class CreateWorkspaceCommandHandler
  implements ICommandHandler<CreateWorkspaceCommand>
{
  cmdToHandler = CreateWorkspaceCommand.name;

  constructor(
    @inject(TYPES.WorkspaceRepository)
    private readonly _repo: WorkspaceRepository
  ) {}

  async handle(command: CreateWorkspaceCommand): Promise<{ guid: string }> {
    const workspace: Workspace = new Workspace(command.guid, command.userGuid, command.title);
    await this._repo.save(workspace, -1);
    return { guid: command.guid };
  }
}
