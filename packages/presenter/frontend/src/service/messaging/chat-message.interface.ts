import { Chat, ChatDTO } from "$domain/chat";
import type { MessageResponse } from "./response-processor";

export interface IChatMessaging {
  getChats(userId: string, wksId: string): MessageResponse<ChatDTO[]>;
  addNewChat(userId: string, wksId: string, data: ChatDTO): MessageResponse<string>;
  updateChat(data: ChatDTO): MessageResponse<string>;
}

type ChatMessagingMethod = keyof IChatMessaging;

export const ChatMessagingMethods = {
  getChats: "getChats",
  addNewChat: "addNewChat",
  updateChat: "updateChat",
} as const satisfies Record<ChatMessagingMethod, keyof IChatMessaging>;
