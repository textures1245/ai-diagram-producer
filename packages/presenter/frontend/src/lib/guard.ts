import { storage } from "wxt/storage";
import { get } from "svelte/store";
import { authStore } from "$service/store/authStore";
import { config } from "$config";
import jwt from "jose";
import { UserSession } from "$domain/userSession";
import { navigateTo } from "svelte-spa-router";

export async function guard(redirectUrl?: string) {
  const user = get(authStore).user;

  if (!user) {
    const token = await storage.getItem<string>(
      `local:${config.auth.cookies.token}`
    );
    if (!token) return false;
    // Decode the JWT token to get user information
    const { payload } = await jwt.jwtVerify(
      token,
      new TextEncoder().encode(config.key.jwtToken)
    );

    const user = new UserSession(
      payload["email"] as string,
      payload.userId as string
    );

    authStore.setAuth({
      user,
    });

    if (redirectUrl) {
      navigateTo(redirectUrl);
    }

    return true;
  } else {
    return true;
  }
}
