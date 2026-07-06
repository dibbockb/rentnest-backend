import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import envConfig from "../config/envConfig";
import { PrismaClient } from "../../generated/prisma/client";

const pool = new Pool({ connectionString: envConfig.db_url });

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export { prisma };