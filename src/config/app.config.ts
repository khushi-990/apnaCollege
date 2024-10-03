import { registerAs } from "@nestjs/config";

export default registerAs("express", () => ({
  env: process.env.APP_ENV,
  version: process.env.APP_VERSION,
  name: process.env.APP_NAME,
  description: `DSA sheet page `,
  url: process.env.APP_URL,
  port: process.env.APP_PORT || 3000,
  environment: process.env.APP_ENV || "development",
  enableCors: process.env.APP_ENABLE_CORS ? process.env.APP_ENABLE_CORS : false,
  throttler: {
    ttlTime: process.env.APP_THROTTLER_TTL_TIME
      ? process.env.APP_THROTTLER_TTL_TIME
      : 60,
    requestCount: process.env.APP_THROTTLER_REQUEST_COUNT
      ? process.env.APP_THROTTLER_REQUEST_COUNT
      : 10,
  },
}));
