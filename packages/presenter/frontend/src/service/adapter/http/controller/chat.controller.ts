import { injectable } from "inversify";
import { FetchClient } from "../processor/fetch-client";
import { ApiResponse } from "../processor/resp";
import { Chat, ChatDTO } from "$domain/chat";

export type FetchChatsByQuery = {
  workspace_id: string;
};

@injectable()
export class ChatController {
  private httpClient: FetchClient;

  constructor(private readonly baseUrl: string) {
    this.httpClient = new FetchClient(`${this.baseUrl}/api/v1/chat`);
  }

  async fetchChatsByQuery(qry: FetchChatsByQuery) {
    const queryStr = Object.entries(qry)
      .map(([key, value]) =>
        value ? `${key}=${encodeURIComponent(value)}` : ""
      )
      .filter(Boolean)
      .join("&");

    const response = await this.httpClient.get<ApiResponse<ChatDTO[]>>(
      `/qry?${queryStr}`
    );

    return response.data;
  }

  async createChat(
    workspace_id: string,
    user_id: string,
    body: Partial<ChatDTO>
  ): Promise<{ guid: string }> {
    const response = await this.httpClient.post<ApiResponse<{ guid: string }>>(
      `/`,
      {
        workspace_id,
        user_id,
        content: body.content,
        role: body.role,
        images: JSON.stringify(body.images),
        tool_calls: JSON.stringify(body.toolCalls),
      }
    );
    return response.data;
  }

  async updateChat(
    chat_id: string,
    body: Partial<ChatDTO>
  ): Promise<{ guid: string }> {
    const response = await this.httpClient.patch<ApiResponse<{ guid: string }>>(
      `/${chat_id}`,
      {
        content: body.content,
        role: body.role,
        images: JSON.stringify(body.images),
        tool_calls: JSON.stringify(body.toolCalls),
        version: body.version,
      }
    );
    return response.data;
  }
}
