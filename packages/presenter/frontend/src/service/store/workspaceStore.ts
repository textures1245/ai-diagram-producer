import { writable } from "svelte/store";
import type { UserSession } from "../../domain/userSession";
import { Workspace, WorkspaceDTO } from "$domain/workspace";
import { Chat, ChatDTO } from "$domain/chat";

// Define auth state type
export type WorkspaceStore = {
  workspaces: Workspace[];
};

let initialized = false;

// Create auth store with minimal functionality
function createAuthStore() {
  const { subscribe, set, update } = writable<WorkspaceStore>({
    workspaces: [],
  });

  return {
    setWorkspaces: (workspaces: WorkspaceDTO[]) => {
      if (!initialized) {
        const wks = workspaces.map((wks) => Workspace.fromWorkspaceJSON(wks));
        set({
          workspaces: wks,
        });
        initialized = true;
      }
    },
    addWorkspace: (wksDat: WorkspaceDTO, chatDat: ChatDTO) =>
      update((state) => {
        const workspaces = [
          ...state.workspaces,
          {
            ...Workspace.fromWorkspaceJSON(wksDat),
            chats: [Chat.fromChatDTO(chatDat)],
          } as Workspace,
        ];
        return { ...state, workspaces };
      }),

    addChatToWorkspaceId: (workspaceId: string, chat: ChatDTO) => {
      update((state) => {
        const workspaces = state.workspaces.map((workspace) => {
          if (workspace.id === workspaceId) {
            return {
              ...workspace,
              chats: [...(workspace.chats || []), Chat.fromChatDTO(chat)],
            } as Workspace;
          }
          return workspace;
        });
        return { ...state, workspaces };
      });
    },
    updateChat: (wksId: string, chat: ChatDTO) => {
      update((state) => {
        const workspaces = state.workspaces.map((workspace) => {
          if (workspace.id === wksId) {
            return {
              ...workspace,
              chats: workspace.chats?.map((c) =>
                c.id === chat.id ? Chat.fromChatDTO(chat) : c
              ),
            } as Workspace;
          }
          return workspace;
        });
        return { ...state, workspaces };
      });
    },

    setChatsToWorkspaceId: (workspaceId: string, chats: ChatDTO[]) => {
      update((state) => {
        if (!state.workspaces.find((wks) => wks.id === workspaceId)?.chats) {
          return state;
        }

        const workspaces = state.workspaces.map((workspace) => {
          if (workspace.id === workspaceId) {
            return {
              ...workspace,
              chats: chats.map(Chat.fromChatDTO),
            } as Workspace;
          }
          return workspace;
        });
        return { ...state, workspaces };
      });
    },

    subscribe,
    update,
  };
}

export const workspaceStore = createAuthStore();
