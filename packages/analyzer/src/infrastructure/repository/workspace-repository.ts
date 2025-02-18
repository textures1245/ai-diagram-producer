import { EventSourcedRepository, type IEventStore } from "@ai-ctx/core";
import { Workspace } from "@src/domain/workspace";
import type { IWorkspaceRepository } from "@src/domain/workspace-repository.interface";
import { TYPES } from "@src/types";
import { inject, injectable } from "inversify";

@injectable()
export class WorkspaceRepository
  extends EventSourcedRepository<Workspace>
  implements IWorkspaceRepository
{
  constructor(
    @inject(TYPES.WorkspaceEventStore) private readonly eventStore: IEventStore
  ) {
    super(eventStore, Workspace);
  }

  async findWorkspacesByUserGuid(userGuid: string): Promise<Workspace[]> {
    const workspaces = await this.getManyByDynamicQuery("user_guid", userGuid);
    return workspaces;
  }
}
