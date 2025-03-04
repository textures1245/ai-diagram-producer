import { writable } from "svelte/store";
import type { UserSession } from "../../domain/userSession";

// Define auth state type
export type AuthState = {
  user: UserSession | null;
  token: string | null;
  refreshToken: string | null;
};

// Create auth store with minimal functionality
function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>({
    user: null,
    token: null,
    refreshToken: null,
  });

  return {
    subscribe,

    // Update auth state with new values
    setAuth: (authState: Partial<AuthState>) =>
      update((state) => ({ ...state, ...authState })),

    // Clear auth state (for logout)
    clearAuth: () =>
      set({
        user: null,
        token: null,
        refreshToken: null,
      }),
  };
}

export const authStore = createAuthStore();
