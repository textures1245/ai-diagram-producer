import { inject, injectable } from "inversify";
import { FetchClient } from "../processor/fetch-client";
import { Workspace, WorkspaceDTO } from "$domain/workspace";
import { ApiResponse } from "../processor/resp";
import { Chat } from "$domain/chat";
import { TYPES } from "@/types";

export type FetchWorkspacesByQuery = {
  user_id: string;
};

@injectable()
export class WorkspaceController {
  private httpClient: FetchClient;

  constructor(private readonly baseUrl: string) {
    this.httpClient = new FetchClient(`${this.baseUrl}/api/v1/workspace`);
  }

  async fetchWorkspacesByQuery(
    qry: FetchWorkspacesByQuery
  ): Promise<WorkspaceDTO[]> {
    const queryStr = Object.entries(qry)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    const response = await this.httpClient.get<ApiResponse<WorkspaceDTO[]>>(
      `/qry?${queryStr}`
    );
    return response.data;
  }

  async createWorkspace(userId: string): Promise<{ guid: string }> {
    const response = await this.httpClient.post<ApiResponse<{ guid: string }>>(
      `/`,
      {
        userId,
      }
    );

    return response.data;
  }
}
