"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function fmt(n) {
  if (!n) return "₹0";
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

const LEVELS = ["L3", "L4", "L5", "L6", "L7"];
const ROLES = [
  "Software Engineer",
  "Data Scientist",
  "Product Manager",
  "DevOps Engineer",
  "ML Engineer",
];
const LOCATIONS = [
  "Bangalore",
  "Hyderabad",
  "Gurgaon",
  "Mumbai",
  "Pune",
  "Noida",
  "Chennai",
];

function SalariesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("total_compensation");
  const [sortDir, setSortDir] = useState("desc");
  const [filters, setFilters] = useState({
    company: searchParams.get("company") || "",
    role: searchParams.get("role") || "",
    level: searchParams.get("level") || "",
    location: searchParams.get("location") || "",
  });

  const fetchSalaries = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.company) params.set("company", filters.company);
    if (filters.role) params.set("role", filters.role);
    if (filters.level) params.set("level", filters.level);
    if (filters.location) params.set("location", filters.location);
    params.set("sort", sortBy);
    params.set("dir", sortDir);

    const res = await fetch(`/api/salaries?${params.toString()}`);
    const data = await res.json();
    setSalaries(data.salaries || []);
    setLoading(false);
  }, [filters, sortBy, sortDir]);

  useEffect(() => {
    fetchSalaries();
  }, [fetchSalaries]);

  function handleSort(col) {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(col);
      setSortDir("desc");
    }
  }

  function SortIcon({ col }) {
    if (sortBy !== col) return <span style={{ color: "#333" }}> ↕</span>;
    return (
      <span style={{ color: "#22c55e" }}> {sortDir === "asc" ? "↑" : "↓"}</span>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1
          style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "6px" }}
        >
          Salary Table
        </h1>
        <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
          {loading ? "Loading..." : `${salaries.length} entries`} · sorted by
          total compensation
        </p>
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "20px",
          padding: "16px",
          background: "#111",
          borderRadius: "10px",
          border: "1px solid #1a1a1a",
        }}
      >
        {[{ key: "company", placeholder: "Company", type: "text" }].map((f) => (
          <input
            key={f.key}
            type="text"
            placeholder={f.placeholder}
            value={filters[f.key]}
            onChange={(e) =>
              setFilters({ ...filters, [f.key]: e.target.value })
            }
            style={{
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              color: "#f5f5f5",
              borderRadius: "6px",
              padding: "8px 12px",
              fontSize: "0.8rem",
              outline: "none",
              width: "140px",
            }}
          />
        ))}

        {[
          { key: "role", options: ["All Roles", ...ROLES] },
          { key: "level", options: ["All Levels", ...LEVELS] },
          { key: "location", options: ["All Locations", ...LOCATIONS] },
        ].map((f) => (
          <select
            key={f.key}
            value={filters[f.key]}
            onChange={(e) =>
              setFilters({
                ...filters,
                [f.key]:
                  e.target.value ===
                  `All ${f.key.charAt(0).toUpperCase() + f.key.slice(1)}s`
                    ? ""
                    : e.target.value,
              })
            }
            style={{
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              color: "#f5f5f5",
              borderRadius: "6px",
              padding: "8px 12px",
              fontSize: "0.8rem",
              outline: "none",
            }}
          >
            {f.options.map((o) => (
              <option key={o} value={o.startsWith("All") ? "" : o}>
                {o}
              </option>
            ))}
          </select>
        ))}

        <button
          onClick={() =>
            setFilters({ company: "", role: "", level: "", location: "" })
          }
          style={{
            background: "transparent",
            border: "1px solid #2a2a2a",
            color: "#6b7280",
            borderRadius: "6px",
            padding: "8px 14px",
            fontSize: "0.8rem",
            cursor: "pointer",
          }}
        >
          Clear
        </button>
      </div>

      {/* Table */}
      <div
        style={{
          overflowX: "auto",
          borderRadius: "10px",
          border: "1px solid #1a1a1a",
        }}
      >
        <table className="salary-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("company")}>
                Company
                <SortIcon col="company" />
              </th>
              <th onClick={() => handleSort("role")}>
                Role
                <SortIcon col="role" />
              </th>
              <th onClick={() => handleSort("level")}>
                Level
                <SortIcon col="level" />
              </th>
              <th onClick={() => handleSort("location")}>
                Location
                <SortIcon col="location" />
              </th>
              <th onClick={() => handleSort("experience_years")}>
                Exp
                <SortIcon col="experience_years" />
              </th>
              <th onClick={() => handleSort("base_salary")}>
                Base
                <SortIcon col="base_salary" />
              </th>
              <th onClick={() => handleSort("bonus")}>
                Bonus
                <SortIcon col="bonus" />
              </th>
              <th onClick={() => handleSort("stock")}>
                Stock
                <SortIcon col="stock" />
              </th>
              <th onClick={() => handleSort("total_compensation")}>
                Total TC
                <SortIcon col="total_compensation" />
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={9}
                  style={{
                    textAlign: "center",
                    padding: "60px",
                    color: "#6b7280",
                  }}
                >
                  Loading...
                </td>
              </tr>
            ) : salaries.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  style={{
                    textAlign: "center",
                    padding: "60px",
                    color: "#6b7280",
                  }}
                >
                  No results found. Try different filters.
                </td>
              </tr>
            ) : (
              salaries.map((s) => (
                <tr key={s.id}>
                  <td>
                    <a
                      href={`/company/${s.company}`}
                      style={{
                        color: "#f5f5f5",
                        textDecoration: "none",
                        fontWeight: 500,
                      }}
                      onMouseEnter={(e) => (e.target.style.color = "#22c55e")}
                      onMouseLeave={(e) => (e.target.style.color = "#f5f5f5")}
                    >
                      {s.company.charAt(0).toUpperCase() + s.company.slice(1)}
                    </a>
                  </td>
                  <td style={{ color: "#d1d5db" }}>{s.role}</td>
                  <td>
                    <span className={`badge badge-${s.level}`}>{s.level}</span>
                  </td>
                  <td style={{ color: "#9ca3af", fontSize: "0.82rem" }}>
                    {s.location}
                  </td>
                  <td
                    style={{
                      color: "#6b7280",
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "0.8rem",
                    }}
                  >
                    {s.experience_years}y
                  </td>
                  <td
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "0.82rem",
                      color: "#d1d5db",
                    }}
                  >
                    {fmt(s.base_salary)}
                  </td>
                  <td
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "0.82rem",
                      color: "#9ca3af",
                    }}
                  >
                    {fmt(s.bonus)}
                  </td>
                  <td
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "0.82rem",
                      color: "#9ca3af",
                    }}
                  >
                    {fmt(s.stock)}
                  </td>
                  <td
                    className="comp-value"
                    style={{ fontSize: "0.9rem", fontWeight: 600 }}
                  >
                    {fmt(s.total_compensation)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SalariesPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: "40px", color: "#6b7280" }}>Loading...</div>
      }
    >
      <SalariesContent />
    </Suspense>
  );
}
