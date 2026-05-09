"use client";
import { useState, useEffect } from "react";

function fmt(n) {
  if (!n) return "₹0";
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

function pct(a, b) {
  if (!b) return "";
  const diff = ((a - b) / b) * 100;
  const sign = diff > 0 ? "+" : "";
  return `${sign}${diff.toFixed(0)}%`;
}

export default function ComparePage() {
  const [allSalaries, setAllSalaries] = useState([]);
  const [idA, setIdA] = useState("");
  const [idB, setIdB] = useState("");
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/salaries?limit=200")
      .then((r) => r.json())
      .then((d) => setAllSalaries(d.salaries || []));
  }, []);

  async function compare() {
    if (!idA || !idB) return;
    setLoading(true);
    const res = await fetch(`/api/compare?a=${idA}&b=${idB}`);
    const data = await res.json();
    setComparison(data);
    setLoading(false);
  }

  function SalaryLabel(s) {
    if (!s) return "Select...";
    return `${s.company.charAt(0).toUpperCase() + s.company.slice(1)} · ${s.role} · ${s.level} · ${s.location}`;
  }

  const salA = allSalaries.find((s) => s.id === parseInt(idA));
  const salB = allSalaries.find((s) => s.id === parseInt(idB));

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "6px" }}
        >
          Compare Salaries
        </h1>
        <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
          Select 2 entries to compare base, bonus, stock and total compensation
          side-by-side.
        </p>
      </div>

      {/* Selectors */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        {[
          { id: idA, setId: setIdA, label: "Entry A" },
          { id: idB, setId: setIdB, label: "Entry B" },
        ].map(({ id, setId, label }) => (
          <div
            key={label}
            style={{
              background: "#111",
              border: "1px solid #1a1a1a",
              borderRadius: "10px",
              padding: "16px",
            }}
          >
            <p
              style={{
                fontSize: "0.7rem",
                color: "#6b7280",
                fontFamily: "JetBrains Mono, monospace",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "10px",
              }}
            >
              {label}
            </p>
            <select
              value={id}
              onChange={(e) => setId(e.target.value)}
              style={{
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                color: "#f5f5f5",
                borderRadius: "6px",
                padding: "10px 12px",
                fontSize: "0.8rem",
                width: "100%",
                outline: "none",
              }}
            >
              <option value="">Select a salary entry...</option>
              {allSalaries.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.company.charAt(0).toUpperCase() + s.company.slice(1)} ·{" "}
                  {s.role} · {s.level} · {fmt(s.total_compensation)} TC
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <button
        onClick={compare}
        disabled={!idA || !idB || idA === idB || loading}
        style={{
          background: idA && idB && idA !== idB ? "#22c55e" : "#1a1a1a",
          color: idA && idB && idA !== idB ? "#000" : "#6b7280",
          border: "none",
          borderRadius: "8px",
          padding: "12px 28px",
          fontWeight: 700,
          fontSize: "0.9rem",
          cursor: idA && idB ? "pointer" : "not-allowed",
          marginBottom: "32px",
          transition: "all 0.15s",
        }}
      >
        {loading ? "Comparing..." : "Compare →"}
      </button>

      {/* Comparison Result */}
      {comparison && !comparison.error && (
        <div>
          {/* Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "140px 1fr 1fr",
              gap: "2px",
              marginBottom: "2px",
            }}
          >
            <div />
            {[comparison.a, comparison.b].map((s, i) => (
              <div
                key={i}
                style={{
                  background: i === 0 ? "#0d1f0d" : "#111",
                  border: `1px solid ${i === 0 ? "#16a34a44" : "#1a1a1a"}`,
                  borderRadius: "10px 10px 0 0",
                  padding: "16px 20px",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    marginBottom: "4px",
                    fontSize: "0.95rem",
                  }}
                >
                  {s.company.charAt(0).toUpperCase() + s.company.slice(1)}
                </div>
                <div style={{ fontSize: "0.78rem", color: "#6b7280" }}>
                  {s.role}
                </div>
                <span
                  className={`badge badge-${s.level}`}
                  style={{ marginTop: "6px", display: "inline-block" }}
                >
                  {s.level}
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#6b7280",
                    marginLeft: "8px",
                  }}
                >
                  {s.location}
                </span>
              </div>
            ))}
          </div>

          {/* Rows */}
          {[
            { label: "Base Salary", keyA: "base_salary", keyB: "base_salary" },
            { label: "Annual Bonus", keyA: "bonus", keyB: "bonus" },
            { label: "Stock (annual)", keyA: "stock", keyB: "stock" },
            {
              label: "Total TC",
              keyA: "total_compensation",
              keyB: "total_compensation",
              highlight: true,
            },
            {
              label: "Experience",
              keyA: "experience_years",
              keyB: "experience_years",
              raw: true,
              suffix: "y",
            },
            { label: "Level", keyA: "level", keyB: "level", raw: true },
            { label: "Level Diff", special: "level_diff" },
          ].map((row, idx) => {
            const valA = row.special
              ? comparison[row.special]
              : comparison.a[row.keyA];
            const valB = row.special ? null : comparison.b[row.keyB];
            const isHigher = !row.raw && !row.special && valA > valB;
            const isLower = !row.raw && !row.special && valA < valB;

            return (
              <div
                key={idx}
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr 1fr",
                  gap: "2px",
                  marginBottom: "2px",
                }}
              >
                <div
                  style={{
                    background: "#111",
                    border: "1px solid #1a1a1a",
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "0.75rem",
                    color: "#6b7280",
                    fontFamily: "JetBrains Mono, monospace",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {row.label}
                </div>
                {row.special ? (
                  <div
                    style={{
                      gridColumn: "span 2",
                      background: "#111",
                      border: "1px solid #1a1a1a",
                      padding: "14px 16px",
                      color: "#9ca3af",
                      fontSize: "0.875rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {valA === 0
                      ? "Same level"
                      : `${Math.abs(valA)} level${Math.abs(valA) !== 1 ? "s" : ""} difference`}
                  </div>
                ) : (
                  [
                    {
                      val: valA,
                      isHigher,
                      isLower: isLower,
                      other: valB,
                      side: "a",
                    },
                    {
                      val: valB,
                      isHigher: isLower,
                      isLower: isHigher,
                      other: valA,
                      side: "b",
                    },
                  ].map((cell) => (
                    <div
                      key={cell.side}
                      style={{
                        background: cell.isHigher ? "#0d1f0d" : "#111",
                        border: `1px solid ${cell.isHigher ? "#16a34a44" : "#1a1a1a"}`,
                        padding: "14px 16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: row.raw
                            ? "inherit"
                            : "JetBrains Mono, monospace",
                          fontWeight: row.highlight ? 700 : 500,
                          fontSize: row.highlight ? "1rem" : "0.875rem",
                          color: row.highlight
                            ? "#22c55e"
                            : cell.isHigher
                              ? "#4ade80"
                              : "#f5f5f5",
                        }}
                      >
                        {row.raw
                          ? `${cell.val}${row.suffix || ""}`
                          : fmt(cell.val)}
                      </span>
                      {!row.raw && !row.special && cell.side === "b" && (
                        <span
                          style={{
                            fontSize: "0.72rem",
                            fontFamily: "JetBrains Mono, monospace",
                            color: isLower
                              ? "#22c55e"
                              : isHigher
                                ? "#f87171"
                                : "#6b7280",
                            background: isLower
                              ? "#0d1f0d"
                              : isHigher
                                ? "#1f0d0d"
                                : "#1a1a1a",
                            padding: "2px 6px",
                            borderRadius: "4px",
                          }}
                        >
                          {pct(valB, valA)}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      )}

      {comparison?.error && (
        <div
          style={{
            padding: "20px",
            background: "#1f0d0d",
            border: "1px solid #ef444433",
            borderRadius: "8px",
            color: "#f87171",
          }}
        >
          {comparison.error}
        </div>
      )}
    </div>
  );
}
