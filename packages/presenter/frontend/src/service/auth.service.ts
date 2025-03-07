import * as jose from "jose";
import { inject, injectable, unmanaged } from "inversify";

import { TYPES } from "../types";
import { AuthController } from "./adapter/http/controller/auth.controller";

@injectable()
export class AuthService {
  constructor(
    @unmanaged() private readonly jwtSecret: string,
    @inject(TYPES.AuthController)
    private readonly authController: AuthController
  ) {}

  /**
   * Authenticate a user with email and password
   */
  async authenticate({ email, password }: { email: string; password: string }) {
    console.info(`Authenticating user with email: ${email}`);

    const user = await this.authController.validateCredentials({
      email,
      password,
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Create JWT with jose
    const secretKey = new TextEncoder().encode(this.jwtSecret);

    const token = await new jose.SignJWT({ userId: user.id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(secretKey);

    const refreshToken = await new jose.SignJWT({
      userId: user.id,
      tokenType: "refresh",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secretKey);

    return {
      user,
      token,
      refreshToken,
    };
  }

  /**
   * Validate a JWT token
   */
  async validateToken(token: string) {
    try {
      const secretKey = new TextEncoder().encode(this.jwtSecret);
      const { payload } = await jose.jwtVerify(token, secretKey);

      const userId = payload.userId as string;
      const user = await this.authController.getUserById(userId);

      return {
        isValid: true,
        user,
      };
    } catch (error) {
      console.error("Token validation failed", error);
      return {
        isValid: false,
        user: null,
      };
    }
  }

  /**
   * Refresh an expired token using a refresh token
   */
  async refreshToken(refreshToken: string) {
    try {
      const secretKey = new TextEncoder().encode(this.jwtSecret);
      const { payload } = await jose.jwtVerify(refreshToken, secretKey);

      if (payload.tokenType !== "refresh") {
        throw new Error("Invalid refresh token");
      }

      const userId = payload.userId as string;
      const user = await this.authController.getUserById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      // Generate new JWT token
      const newToken = await new jose.SignJWT({
        userId: user.id,
        email: user.email,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("24h")
        .sign(secretKey);

      return {
        token: newToken,
      };
    } catch (error) {
      throw new Error("Failed to refresh token");
    }
  }

  /**
   * Authenticate with Google
   */
  async authenticateWithGoogle(idToken: string) {
    // Use browser-based verification instead of OAuth2Client
    // This requires the token to be verified on the client-side
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Invalid Google token");
    }

    const payload = await response.json();

    if (!payload) {
      throw new Error("Invalid Google token");
    }

    const { email, sub: googleId, name } = payload;

    if (!email) throw new Error("Email is required");

    // Find or create user
    let user = await this.authController.validateCredentials({
      email,
      password: googleId,
    });

    if (!user) {
      // Create new user if doesn't exist
      user = await this.authController.registerUser({
        email,
        password: googleId,
      });
    } else {
      console.info(`User authenticated with email: ${email}`);
    }

    const secretKey = new TextEncoder().encode(this.jwtSecret);

    const token = await new jose.SignJWT({
      userId: user.id,
      email: user.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(secretKey);

    const refreshToken = await new jose.SignJWT({
      userId: user.id,
      tokenType: "refresh",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secretKey);

    console.info(`User authenticated with Google: ${user.email}`);

    return {
      user,
      token,
      refreshToken,
    };
  }

  /**
   * Logout user (can be used to invalidate tokens if needed)
   */
  async logout() {
    // If you want to invalidate tokens or perform cleanup
    return { success: true };
  }
}
