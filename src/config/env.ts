import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required"),
  GEMINI_MODEL: z.string().default("gemini-2.0-flash"),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
});

function getServerEnv() {
  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    const formatted = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid server environment variables:\n${formatted}`);
  }

  return parsed.data;
}

function getClientEnv() {
  const parsed = clientEnvSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });

  if (!parsed.success) {
    const formatted = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid client environment variables:\n${formatted}`);
  }

  return parsed.data;
}

export const env = {
  ...getServerEnv(),
  ...getClientEnv(),
};

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;
