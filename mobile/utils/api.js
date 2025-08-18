import { logger } from "./logger";

const BASE_URL = "http://localhost:5000";

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const startTime = Date.now();

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === "object") {
    config.body = JSON.stringify(config.body);
  }

  logger.info(`${config.method || "GET"} ${endpoint}`, {
    url,
    headers: config.headers,
    body: config.body ? JSON.parse(config.body) : undefined,
  });

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    const duration = Date.now() - startTime;

    if (!response.ok) {
      logger.error(
        `${config.method || "GET"} ${endpoint} - ${response.status}`,
        {
          status: response.status,
          error: data.message,
          duration: `${duration}ms`,
        }
      );
      throw new Error(data.message || "API request failed");
    }

    logger.info(`${config.method || "GET"} ${endpoint} - ${response.status}`, {
      status: response.status,
      duration: `${duration}ms`,
      response: data,
    });

    return data;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`${config.method || "GET"} ${endpoint} - FAILED`, {
      error: error.message,
      duration: `${duration}ms`,
    });
    throw error;
  }
};

export const authAPI = {
  login: (credentials) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: credentials,
    }),

  logout: (tokens) =>
    apiRequest("/auth/logout", {
      method: "POST",
      body: tokens,
    }),

  refresh: (refreshToken) =>
    apiRequest("/auth/refresh", {
      method: "POST",
      body: { refreshToken },
    }),
};
