export const config = {
  key: {
    jwtToken: import.meta.env.WXT_JWT_SECRET,
    googleToken: import.meta.env.WXT_GOOGLE_TOKEN,
  },
  api: {
    presenterBackend:
      import.meta.env.WXT_HTTP_BASE_URL_PRESENTER_BACKEND ?? "http://localhost:3500",
    analyzer:
      import.meta.env.WXT_HTTP_BASE_URL_ANALYZER ?? "http://localhost:3200",
  },
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

export type configType = {
  token: { value: string };
  refreshToken: { value: string };
};
