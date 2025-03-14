import { storage } from "wxt/storage";
import { get } from "svelte/store";
import { authStore } from "$service/store/authStore";
import { config, configType } from "$config";
import * as jwt from "jose";
import { UserSession } from "$domain/userSession";
import { push } from "svelte-spa-router";

export async function guard(redirectUrl?: string) {
  const user = get(authStore).user;

  if (!user) {
    const token = await storage.getItem<configType["token"]>(
      `local:${config.auth.cookies.token}`
    );
    if (!token) return false;
    // Decode the JWT token to get user information
    const { payload } = await jwt.jwtVerify(
      token.value,
      new TextEncoder().encode(config.key.jwtToken)
    );

    console.log(payload)

    const user = new UserSession(
      payload["email"] as string,
      payload.userId as string
    );

    console.log(user);

    authStore.setAuth({
      user,
    });

    if (redirectUrl) {
      push(redirectUrl);
    }

    return true;
  } else {
    return true;
  }
}
