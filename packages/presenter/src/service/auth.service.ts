import { UserSession } from "@/domain/userSession";
import jwt, { SignOptions } from "jsonwebtoken";

import { TYPES } from "@/types";
import { inject, injectable } from "inversify";
import { password } from "bun";

@injectable()
export class AuthService {
  constructor(
    @inject(TYPES.JwtSecret) private readonly jwtSecret: string,
    @inject(TYPES.GoogleToken) private readonly googleToken: string
  ) {}

  private verifyJWT(token: string) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (err) {
      return null;
    }
  }

  private generateJWT(payload: object, expiresIn: any = "1h"): string {
    const signOptions: SignOptions = { expiresIn };
    return jwt.sign(payload, this.jwtSecret, signOptions);
  }

  // Login method accepts credentials and returns a JWT upon successful authentication.
  public async login(credentials: { email: string; password: string }) {
    // ...validate credentials (dummy implementation)...
    // Assume validation is successful and create user session info

    const user = new UserSession(credentials.email);

    // Use user info to generate payload, not raw credentials.
    const payload = {
      id: user.id,
      email: credentials.email,
      password: credentials.password,
    };

    const token = this.generateJWT(payload);
    return this.verifyJWT(token);
  }

  // Register method accepts registration data and returns a JWT upon successful registration.
  public async register(credentials: {
    email: string;
    password: string;
    username?: string;
  }): Promise<string> {
    // ...perform registration (dummy implementation)...
    // Create new user session
    const user = new UserSession(credentials.email);
    // Use new user info to generate payload
    const payload = {
      id: user.id,
      email: credentials.email,
    };
    return this.generateJWT(payload);
  }

  // Verifies Google token and returns user data.
  public async signInWithGoogle(): Promise<UserSession> {
    try {
      const googleApiUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${this.googleToken}`;
      const response = await fetch(googleApiUrl);
      if (!response.ok) {
        throw new Error("Invalid Google token");
      }
      const userData = await response.json();
      // ...map userData to your internal user model as needed...
      return userData;
    } catch (error) {
      throw new Error("Google authentication failed");
    }
  }
}
