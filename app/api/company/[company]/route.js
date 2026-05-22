import { NextResponse } from "next/server";
//import { PrismaClient } from "@prisma/client";

//const prisma = new PrismaClient();
import prisma from "../../../../lib/prisma";

function median(arr) {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export async function GET(request, { params }) {
  console.log("API hit, prams:", params);
  const company = decodeURIComponent(params.company).toLowerCase().trim();

  const salaries = await prisma.salary.findMany({
    where: { company },
    orderBy: { total_compensation: "desc" },
  });

  if (!salaries.length) {
    return NextResponse.json(
      { error: `No data for company: ${company}` },
      { status: 404 },
    );
  }

  const medianTc = median(salaries.map((s) => s.total_compensation));
  const avgBase =
    salaries.reduce((s, r) => s + r.base_salary, 0) / salaries.length;
  const avgBonus = salaries.reduce((s, r) => s + r.bonus, 0) / salaries.length;
  const avgStock = salaries.reduce((s, r) => s + r.stock, 0) / salaries.length;

  const levelMap = {};
  for (const s of salaries) {
    if (!levelMap[s.level]) levelMap[s.level] = [];
    levelMap[s.level].push(s.total_compensation);
  }

  const level_distribution = ["L3", "L4", "L5", "L6", "L7"]
    .filter((l) => levelMap[l])
    .map((l) => ({
      level: l,
      count: levelMap[l].length,
      median_tc: median(levelMap[l]),
    }));

  return NextResponse.json({
    company,
    total_entries: salaries.length,
    median_compensation: medianTc,
    avg_base: avgBase,
    avg_bonus: avgBonus,
    avg_stock: avgStock,
    level_distribution,
    salaries,
  });
}
