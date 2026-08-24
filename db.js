import { PrismaClient } from "./generated/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import dotenv from "dotenv";

dotenv.config();

const dbUrl = new URL(process.env.DATABASE_URL);

const adapter = new PrismaMariaDb({
  host: dbUrl.hostname || "localhost",
  port: parseInt(dbUrl.port) || 3306,
  user: dbUrl.username || "root",
  password: decodeURIComponent(dbUrl.password) || "",
  database: dbUrl.pathname.replace(/^\//, "")
});

const prisma = new PrismaClient({ adapter });

export default prisma;
