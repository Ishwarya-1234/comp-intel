import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const VALID_LEVELS = ["L3", "L4", "L5", "L6", "L7"];

function normalize(company) {
  return company.toLowerCase().trim();
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    company,
    role,
    level_standardized,
    base_salary,
    bonus,
    stock,
    confidence,
    location,
    experience_years,
  } = body;

  const errors = [];
  if (!company || typeof company !== "string") errors.push("company required");
  if (!role || typeof role !== "string") errors.push("role required");
  if (!VALID_LEVELS.includes(level_standardized))
    errors.push("level must be L3-L7");
  if (!base_salary || typeof base_salary !== "number" || base_salary <= 0)
    errors.push("base_salary must be positive number");
  if (!location || typeof location !== "string")
    errors.push("location required");
  if (experience_years === undefined || !Number.isInteger(experience_years))
    errors.push("experience_years must be integer");

  if (errors.length > 0) {
    return NextResponse.json(
      { error: "Validation failed", details: errors },
      { status: 422 },
    );
  }

  const companyNorm = normalize(company);
  const bonusVal = bonus ?? 0;
  const stockVal = stock ?? 0;
  const totalCompensation = base_salary + bonusVal + stockVal;

  const existing = await prisma.salary.findFirst({
    where: {
      company: companyNorm,
      role: role.trim(),
      level: level_standardized,
      location: location.trim(),
      experience_years,
      base_salary,
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Duplicate entry", existing_id: existing.id },
      { status: 409 },
    );
  }

  const salary = await prisma.salary.create({
    data: {
      company: companyNorm,
      role: role.trim(),
      level: level_standardized,
      location: location.trim(),
      experience_years,
      base_salary,
      bonus: bonusVal,
      stock: stockVal,
      total_compensation: totalCompensation,
      confidence_score: confidence ?? 1.0,
    },
  });

  return NextResponse.json({ success: true, salary }, { status: 201 });
}
