import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const LEVEL_ORDER = ["L3", "L4", "L5", "L6", "L7"];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const idA = parseInt(searchParams.get("a"));
  const idB = parseInt(searchParams.get("b"));

  if (isNaN(idA) || isNaN(idB)) {
    return NextResponse.json(
      { error: "Both ?a= and ?b= are required" },
      { status: 400 },
    );
  }
  if (idA === idB) {
    return NextResponse.json(
      { error: "Select two different entries" },
      { status: 400 },
    );
  }

  const [salaryA, salaryB] = await Promise.all([
    prisma.salary.findUnique({ where: { id: idA } }),
    prisma.salary.findUnique({ where: { id: idB } }),
  ]);

  if (!salaryA)
    return NextResponse.json({ error: `ID ${idA} not found` }, { status: 404 });
  if (!salaryB)
    return NextResponse.json({ error: `ID ${idB} not found` }, { status: 404 });

  const levelDiff =
    LEVEL_ORDER.indexOf(salaryA.level) - LEVEL_ORDER.indexOf(salaryB.level);

  return NextResponse.json({
    a: salaryA,
    b: salaryB,
    diff: {
      base_salary: salaryA.base_salary - salaryB.base_salary,
      bonus: salaryA.bonus - salaryB.bonus,
      stock: salaryA.stock - salaryB.stock,
      total_compensation:
        salaryA.total_compensation - salaryB.total_compensation,
    },
    level_diff: levelDiff,
    winner_tc:
      salaryA.total_compensation >= salaryB.total_compensation ? "a" : "b",
  });
}
