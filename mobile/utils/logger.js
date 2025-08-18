const isDev = __DEV__;

export const logger = {
  info: (message, data) => {
    if (isDev) {
      console.log(`[API] ${message}`, data || '');
    }
  },
  error: (message, error) => {
    if (isDev) {
      console.error(`[API ERROR] ${message}`, error);
    }
  },
};