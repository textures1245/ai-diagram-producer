import type { UserSession } from "../../domain/userSession";
import type { MessageResponse } from "./response-processor";

export interface IAuthMessaging {
  authenticateUser(
    email: string,
    password: string
  ): MessageResponse<{ user: UserSession }>;
  validateToken(token: string): MessageResponse<void>;
  refreshToken(): MessageResponse<{ newAccessToken: string }>;
  googleSignIn(idToken: string): MessageResponse<{ user: UserSession }>;
  logoutUser(): MessageResponse<void>;
}

type AuthMessagingMethod = keyof IAuthMessaging;

export const AuthMessagingMethods = {
  authenticateUser: "authenticateUser",
  validateToken: "validateToken",
  refreshToken: "refreshToken",
  googleSignIn: "googleSignIn",
  logoutUser: "logoutUser",
} as const satisfies Record<AuthMessagingMethod, keyof IAuthMessaging>;
