// app/api/compare/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const LEVEL_ORDER = ["L3", "L4", "L5", "L6", "L7"];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const rawA = searchParams.get("a");
  const rawB = searchParams.get("b");

  if (!rawA || !rawB) {
    return NextResponse.json(
      { error: "Both ?a= and ?b= salary IDs are required" },
      { status: 400 },
    );
  }

  const idA = parseInt(rawA);
  const idB = parseInt(rawB);

  if (isNaN(idA) || isNaN(idB)) {
    return NextResponse.json(
      { error: "IDs must be integers" },
      { status: 400 },
    );
  }

  if (idA === idB) {
    return NextResponse.json(
      { error: "Please select two different salary entries to compare" },
      { status: 400 },
    );
  }

  try {
    const [salaryA, salaryB] = await Promise.all([
      prisma.salary.findUnique({ where: { id: idA } }),
      prisma.salary.findUnique({ where: { id: idB } }),
    ]);

    if (!salaryA)
      return NextResponse.json(
        { error: `Salary entry with id=${idA} not found` },
        { status: 404 },
      );
    if (!salaryB)
      return NextResponse.json(
        { error: `Salary entry with id=${idB} not found` },
        { status: 404 },
      );

    const levelIdxA = LEVEL_ORDER.indexOf(salaryA.level);
    const levelIdxB = LEVEL_ORDER.indexOf(salaryB.level);
    const levelDiff =
      levelIdxA !== -1 && levelIdxB !== -1 ? levelIdxA - levelIdxB : null;

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
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
