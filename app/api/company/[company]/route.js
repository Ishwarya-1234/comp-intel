// app/api/company/[company]/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function median(arr) {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export async function GET(request, { params }) {
  const company = decodeURIComponent(params.company).toLowerCase().trim();

  if (!company) {
    return NextResponse.json(
      { error: "Company name is required" },
      { status: 400 },
    );
  }

  try {
    const salaries = await prisma.salary.findMany({
      where: { company },
      orderBy: { total_compensation: "desc" },
    });

    if (!salaries.length) {
      return NextResponse.json(
        { error: `No data found for company: ${company}` },
        { status: 404 },
      );
    }

    // Compute stats
    const medianTc = median(salaries.map((s) => s.total_compensation));
    const avgBase =
      salaries.reduce((s, r) => s + r.base_salary, 0) / salaries.length;
    const avgBonus =
      salaries.reduce((s, r) => s + r.bonus, 0) / salaries.length;
    const avgStock =
      salaries.reduce((s, r) => s + r.stock, 0) / salaries.length;

    // Level distribution with median per level
    const levelMap = {};
    for (const s of salaries) {
      if (!levelMap[s.level]) levelMap[s.level] = [];
      levelMap[s.level].push(s.total_compensation);
    }

    const LEVEL_ORDER = ["L3", "L4", "L5", "L6", "L7"];
    const level_distribution = LEVEL_ORDER.filter((l) => levelMap[l]).map(
      (l) => ({
        level: l,
        count: levelMap[l].length,
        median_tc: median(levelMap[l]),
      }),
    );

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
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
