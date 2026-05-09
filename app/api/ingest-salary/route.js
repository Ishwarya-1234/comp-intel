// app/api/ingest-salary/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_LEVELS = ["L3", "L4", "L5", "L6", "L7"];

function normalize(company) {
  return company.toLowerCase().trim();
}

function levelToNum(level) {
  const map = { L3: 3, L4: 4, L5: 5, L6: 6, L7: 7 };
  return map[level] ?? null;
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

  // --- Strict validation ---
  const errors = [];

  if (!company || typeof company !== "string" || company.trim().length < 1)
    errors.push("company is required (non-empty string)");

  if (!role || typeof role !== "string" || role.trim().length < 1)
    errors.push("role is required (non-empty string)");

  if (!level_standardized || !VALID_LEVELS.includes(level_standardized))
    errors.push(
      `level_standardized must be one of: ${VALID_LEVELS.join(", ")}`,
    );

  if (
    base_salary === undefined ||
    base_salary === null ||
    typeof base_salary !== "number" ||
    base_salary <= 0
  )
    errors.push("base_salary must be a positive number");

  if (
    bonus !== undefined &&
    bonus !== null &&
    (typeof bonus !== "number" || bonus < 0)
  )
    errors.push("bonus must be a non-negative number if provided");

  if (
    stock !== undefined &&
    stock !== null &&
    (typeof stock !== "number" || stock < 0)
  )
    errors.push("stock must be a non-negative number if provided");

  if (
    confidence !== undefined &&
    (typeof confidence !== "number" || confidence < 0 || confidence > 1)
  )
    errors.push("confidence must be a number between 0 and 1");

  if (!location || typeof location !== "string" || location.trim().length < 1)
    errors.push("location is required");

  if (
    experience_years === undefined ||
    typeof experience_years !== "number" ||
    experience_years < 0 ||
    !Number.isInteger(experience_years)
  )
    errors.push("experience_years must be a non-negative integer");

  if (errors.length > 0) {
    return NextResponse.json(
      { error: "Validation failed", details: errors },
      { status: 422 },
    );
  }

  // Normalize company name
  const companyNorm = normalize(company);

  // Compute total
  const bonusVal = bonus ?? 0;
  const stockVal = stock ?? 0;
  const totalCompensation = base_salary + bonusVal + stockVal;

  // Check for duplicate (same company+role+level+location+exp+base)
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
      { error: "Duplicate entry detected", existing_id: existing.id },
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
