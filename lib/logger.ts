const isProd = process.env.NODE_ENV === "production";

type LogArgs = (string | number | boolean | object | null | undefined)[];

export const logger = {
  debug: (message: string, ...args: LogArgs) => {
    if (!isProd) {
      console.debug(message, ...args);
    }
  },
  info: (message: string, ...args: LogArgs) => {
    if (!isProd) {
      console.info(message, ...args);
    }
  },
  warn: (message: string, ...args: LogArgs) => {
    console.warn(message, ...args);
  },
  error: (message: string, ...args: LogArgs) => {
    // In production, omit sensitive details from error messages
    if (isProd) {
      console.error(message);
    } else {
      console.error(message, ...args);
    }
  },
};
