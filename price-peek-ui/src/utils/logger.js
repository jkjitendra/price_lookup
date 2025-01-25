// utils/logger.js
const isDebugMode = process.env.NODE_ENV === 'development'; // Only enable logs in development mode

export const logger = {
  log: (...args) => {
    if (isDebugMode) {
      console.log('[DEBUG]:', ...args);
    }
  },
  warn: (...args) => {
    if (isDebugMode) {
      console.warn('[DEBUG WARNING]:', ...args);
    }
  },
  error: (...args) => {
    if (isDebugMode) {
      console.error('[DEBUG ERROR]:', ...args);
    }
  },
};