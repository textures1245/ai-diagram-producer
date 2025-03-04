import { injectable } from "inversify";
import { storage } from "wxt/storage";
import { config } from "$config/index";

export interface HttpClient {
  get<T>(url: string, headers?: Record<string, string>): Promise<T>;
  post<T>(url: string, data: any, headers?: Record<string, string>): Promise<T>;
  patch<T>(
    url: string,
    data: any,
    headers?: Record<string, string>
  ): Promise<T>;
  delete<T>(url: string, headers?: Record<string, string>): Promise<T>;
}

@injectable()
export class FetchClient implements HttpClient {
  constructor(private readonly baseUrl: string) {}

  private async request<T>(
    url: string,
    method: string,
    data?: any,
    headers: Record<string, string> = {}
  ): Promise<T> {
    const token = storage.getItem(`local:${config.auth.cookies.token}`);
    const requestHeaders: HeadersInit = {
      "Content-Type": "application/json",
      ...headers,
    };

    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }

    const options: RequestInit = {
      method,
      headers: { ...requestHeaders, ...headers },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${this.baseUrl}${url}`, options);

      // Log request details
      console.debug({
        request: {
          url: `${this.baseUrl}${url}`,
          method,
          headers: requestHeaders,
        },
        response: {
          status: response.status,
          statusText: response.statusText,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `Request failed with status ${response.status}`
        );
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("HTTP request failed:", error);
      throw error;
    }
  }

  get<T>(url: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(url, "GET", undefined, headers);
  }

  post<T>(
    url: string,
    data: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(url, "POST", data, headers);
  }

  patch<T>(
    url: string,
    data: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(url, "PUT", data, headers);
  }

  delete<T>(url: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(url, "DELETE", undefined, headers);
  }
}
