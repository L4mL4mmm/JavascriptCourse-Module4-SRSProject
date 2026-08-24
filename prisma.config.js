// nap bien moi truong cho file config
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// dinh nghia cau hinh prisma CLI cho prisma 7
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL")
  },
  migrations: {
    path: "prisma/migrations"
  }
});

