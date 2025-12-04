export interface AppEnv {
  NODE_ENV: string;
  PORT: number;
}

export function loadEnv(): AppEnv {
  const port = Number(process.env.PORT || 4000);
  return {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: port
  };
}
