import jwt, { type SignOptions } from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

import { inject, injectable } from "inversify";
import { UserSession } from "../domain/userSession";
import { TYPES as B_TYPES } from "../backend/types";
import type { UserPrivateController } from "../backend/adapter/private/controller/user.controller";
import type pino from "pino";

@injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private readonly jwtSecret: string,
    private readonly googleClientId: string,
    @inject(B_TYPES.UserPrivateController)
    private readonly userPrivateController: UserPrivateController,
    @inject(B_TYPES.Logger) private readonly logger: pino.Logger
  ) {
    this.googleClient = new OAuth2Client(googleClientId);
  }

  private verifyJWT(token: string) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (err) {
      this.logger.error(err);
      return null;
    }
  }

  private generateJWT(payload: object, expiresIn: any = "1h"): string {
    const signOptions: SignOptions = { expiresIn };
    return jwt.sign(payload, this.jwtSecret, signOptions);
  }

  /**
   * Authenticate a user with email and password
   */
  async authenticate({ email, password }: { email: string; password: string }) {
    this.logger.info(`Authenticating user with email: ${email}`);

    // Call user controller to validate credentials
    const user = await this.userPrivateController.validateCredentials({
      email,
      password,
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      this.jwtSecret,
      { expiresIn: "24h" }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { userId: user.id, tokenType: "refresh" },
      this.jwtSecret,
      { expiresIn: "7d" }
    );

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
      const decoded = jwt.verify(token, this.jwtSecret) as {
        userId: string;
        email: string;
      };
      const user = await this.userPrivateController.getUserById(decoded.userId);

      return {
        isValid: true,
        user,
      };
    } catch (error) {
      this.logger.error("Token validation failed", error);
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
      const decoded = jwt.verify(refreshToken, this.jwtSecret) as {
        userId: string;
        tokenType: string;
      };

      if (decoded.tokenType !== "refresh") {
        throw new Error("Invalid refresh token");
      }

      const user = await this.userPrivateController.getUserById(decoded.userId);

      if (!user) {
        throw new Error("User not found");
      }

      // Generate new JWT token
      const newToken = jwt.sign(
        { userId: user.id, email: user.email },
        this.jwtSecret,
        { expiresIn: "24h" }
      );

      return {
        token: newToken,
      };
    } catch (error) {
      this.logger.error("Token refresh failed", error);
      throw new Error("Failed to refresh token");
    }
  }

  /**
   * Authenticate with Google
   */
  async authenticateWithGoogle(idToken: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.googleClientId,
      });

      const payload = ticket.getPayload();

      if (!payload) {
        throw new Error("Invalid Google token");
      }

      const { email, sub: googleId, name } = payload;

      // Find or create user
      let user = await this.userPrivateController.validateCredentials({
        email,
        password: "",
      });

      if (!user) {
        // Create new user if doesn't exist
        user = await this.userPrivateController.createUser({
          email: email!,
          googleId,
          name: name || "",
          // Other required fields
        });
      } else {
        this.logger.info(`User authenticated with email: ${email}`);
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        this.jwtSecret,
        { expiresIn: "24h" }
      );

      // Generate refresh token
      const refreshToken = jwt.sign(
        { userId: user.id, tokenType: "refresh" },
        this.jwtSecret,
        { expiresIn: "7d" }
      );

      this.logger.info(`User authenticated with Google: ${user.email}`);

      return {
        user,
        token,
        refreshToken,
      };
    } catch (error) {
      this.logger.error("Google authentication failed", error);
      throw new Error("Google authentication failed");
    }
  }

  /**
   * Logout user (can be used to invalidate tokens if needed)
   */
  async logout() {
    // If you want to invalidate tokens or perform cleanup
    return { success: true };
  }
}
