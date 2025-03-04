export const config = {
  key: {
    jwtToken: import.meta.env.WXT_JWT_SECRET,
    googleToken: import.meta.env.WXT_GOOGLE_TOKEN,
  },
  apiBaseUrl: import.meta.env.WXT_HTTP_BASE_URL_ADAPTER ?? "http://localhost:3000",
  auth: {
    cookies: {
      token: import.meta.env.WXT_AUTH_COOKIE_TOKEN ?? "token",
      refreshToken:
        import.meta.env.WXT_AUTH_COOKIE_REFRESH_TOKEN ?? "refresh_token", // corrected to use import.meta
    },
  },
  logger: {
    level: import.meta.env.WXT_LOG_LEVEL ?? "info",
  },

  featureFlags: {
    enableNewFeature: import.meta.env.WXT_ENABLE_NEW_FEATURE === "true",
  },
};
