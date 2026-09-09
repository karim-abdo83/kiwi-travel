import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    UPLOADTHING_HOST: z.string(),
    EMAIL_SENDING_ADDRESS: z.string(),
    EMAIL_ADMIN_ADDRESS: z.string(),
    EMAIL_SENDING_PASSWORD: z.string(),
    EMAIL_SENDING_HOST: z.string(),
    EMAIL_SENDING_PORT: z.string()  ,
    TELEGRAM_BOT_TOKEN: z.string(),
    TELEGRAM_ADMIN_CHAT_ID: z.string(),
    TELEGRAM_ENGLISH_BOOKINGS_CHAT_ID: z.string().optional(),

  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    UPLOADTHING_HOST: process.env.UPLOADTHING_HOST,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    EMAIL_SENDING_ADDRESS: process.env.EMAIL_SENDING_ADDRESS,
    EMAIL_ADMIN_ADDRESS: process.env.EMAIL_ADMIN_ADDRESS,
    EMAIL_SENDING_PASSWORD: process.env.EMAIL_SENDING_PASSWORD,
    EMAIL_SENDING_HOST: process.env.EMAIL_SENDING_HOST,
    EMAIL_SENDING_PORT: process.env.EMAIL_SENDING_PORT,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_ADMIN_CHAT_ID: process.env.TELEGRAM_ADMIN_CHAT_ID,
    TELEGRAM_ENGLISH_BOOKINGS_CHAT_ID:
      process.env.TELEGRAM_ENGLISH_BOOKINGS_CHAT_ID,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
