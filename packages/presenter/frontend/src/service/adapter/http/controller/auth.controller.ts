import { inject, injectable } from "inversify";
import { TYPES } from "../../../../types";
import { FetchClient } from "../processor/fetch-client";
import { ApiResponse } from "../processor/resp";
import { ServerError } from "$service/lib/apperror";

// Request interfaces
type CreateUserRequest = {
  email: string;
  password: string;
};

type UpdatePasswordRequest = {
  email: string;
  currentPassword: string;
  newPassword: string;
  version: number;
};
type LoginRequest = {
  email: string;
  password: string;
};

// User interface
type User = {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
};

@injectable()
export class AuthController {
  private httpClient: FetchClient;

  constructor(@inject(TYPES.ApiBaseUrl) private readonly baseUrl: string) {
    this.httpClient = new FetchClient(`${this.baseUrl}/api/v1/user`);
  }

  async getUserById(userId: string): Promise<User> {
    try {
      const response = await this.httpClient.get<ApiResponse<User>>(
        `/${userId}`
      );
      console.info(`User fetched successfully: ${userId}`);
      return response.data as User;
    } catch (error) {
      console.error(`Failed to fetch user: ${userId}`);
      throw error;
    }
  }

  async registerUser(userData: CreateUserRequest): Promise<User> {
    try {
      const response = await this.httpClient.post<ApiResponse<User>>(
        "/",
        userData
      );
      console.info(`User registered successfully: ${userData.email}`);
      return response.data as User;
    } catch (error) {
      console.error(`Failed to register user: ${userData.email}`);
      throw error;
    }
  }

  async updatePassword(passwordData: UpdatePasswordRequest): Promise<void> {
    try {
      await this.httpClient.patch<ApiResponse<void>>("/password", passwordData);
      console.info(`Password updated successfully for: ${passwordData.email}`);
    } catch (error) {
      console.error(`Failed to update password for: ${passwordData.email}`);
      throw error;
    }
  }

  async validateCredentials(
    credentials: LoginRequest
  ): Promise<User | undefined> {
    try {
      const response = await this.httpClient.post<ApiResponse<User>>(
        "/validate-credential",
        credentials
      );
      return response.data as User;
    } catch (err: any) {
      if ((err as ServerError).httpCode === 404) {
        return undefined;
      }
      console.error(
        `Error authenticating user with email: ${credentials.email}`,
        err
      );
      throw err;
    }
  }
}
