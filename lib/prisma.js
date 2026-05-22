// lib/prisma.js
import { PrismaClient } from "@prisma/client";

//const globalForPrisma = globalThis;

const globalForPrisma = global;

const prisma = globalForPrisma.prisma ?? new PrismaClient();
//export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
