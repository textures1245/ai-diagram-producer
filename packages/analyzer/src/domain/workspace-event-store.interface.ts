import type { IEventStore } from "@ai-ctx/core";
import type { Workspace } from "./workspace";

export interface IWorkspaceEventStore extends IEventStore<Workspace> {}
