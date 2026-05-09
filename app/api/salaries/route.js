// app/api/salaries/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ALLOWED_SORT = [
  "company",
  "role",
  "level",
  "location",
  "experience_years",
  "base_salary",
  "bonus",
  "stock",
  "total_compensation",
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const company = searchParams.get("company")?.toLowerCase().trim();
  const role = searchParams.get("role")?.trim();
  const level = searchParams.get("level")?.trim();
  const location = searchParams.get("location")?.trim();
  const sort = searchParams.get("sort") || "total_compensation";
  const dir = searchParams.get("dir") === "asc" ? "asc" : "desc";
  const limit = Math.min(parseInt(searchParams.get("limit") || "500"), 1000);

  // Validate sort field to prevent injection
  const sortBy = ALLOWED_SORT.includes(sort) ? sort : "total_compensation";

  const where = {};
  if (company) where.company = { contains: company };
  if (role) where.role = { contains: role };
  if (level) where.level = level;
  if (location) where.location = { contains: location };

  try {
    const salaries = await prisma.salary.findMany({
      where,
      orderBy: { [sortBy]: dir },
      take: limit,
    });

    return NextResponse.json({ salaries, count: salaries.length });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
