"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ROLES = [
  "Software Engineer",
  "Data Scientist",
  "Product Manager",
  "DevOps Engineer",
  "ML Engineer",
];
const LEVELS = ["L3", "L4", "L5", "L6", "L7"];
const COMPANIES = [
  "google",
  "microsoft",
  "amazon",
  "meta",
  "flipkart",
  "swiggy",
  "zomato",
  "razorpay",
  "atlassian",
  "adobe",
  "uber",
];

export default function Home() {
  const router = useRouter();
  const [filters, setFilters] = useState({ company: "", role: "", level: "" });

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filters.company) params.set("company", filters.company);
    if (filters.role) params.set("role", filters.role);
    if (filters.level) params.set("level", filters.level);
    router.push(`/salaries?${params.toString()}`);
  }

  return (
    <div
      style={{ maxWidth: "900px", margin: "0 auto", padding: "80px 24px 40px" }}
    >
      {/* Hero */}
      <div style={{ marginBottom: "60px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "#0d1f0d",
            border: "1px solid #16a34a33",
            borderRadius: "20px",
            padding: "4px 12px",
            marginBottom: "24px",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#22c55e",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontSize: "0.75rem",
              color: "#4ade80",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            Levels-based · Not title-based
          </span>
        </div>

        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: "16px",
            letterSpacing: "-0.02em",
          }}
        >
          Compensation intelligence
          <br />
          <span style={{ color: "#22c55e" }}>tied to levels, not titles.</span>
        </h1>

        <p
          style={{
            color: "#6b7280",
            fontSize: "1.05rem",
            maxWidth: "540px",
            lineHeight: 1.6,
          }}
        >
          L4 at Google ≠ SDE2 at Flipkart. Compare real compensation by
          standardized levels across India's top tech companies.
        </p>
      </div>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        style={{
          background: "#111",
          border: "1px solid #222",
          borderRadius: "12px",
          padding: "28px",
          marginBottom: "48px",
        }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            color: "#6b7280",
            marginBottom: "16px",
            fontFamily: "JetBrains Mono, monospace",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Search salaries
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <select
            value={filters.company}
            onChange={(e) =>
              setFilters({ ...filters, company: e.target.value })
            }
            style={selectStyle}
          >
            <option value="">All Companies</option>
            {COMPANIES.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            style={selectStyle}
          >
            <option value="">All Roles</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <select
            value={filters.level}
            onChange={(e) => setFilters({ ...filters, level: e.target.value })}
            style={selectStyle}
          >
            <option value="">All Levels</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          style={{
            background: "#22c55e",
            color: "#000",
            border: "none",
            borderRadius: "8px",
            padding: "12px 28px",
            fontWeight: 700,
            fontSize: "0.9rem",
            cursor: "pointer",
            fontFamily: "DM Sans, sans-serif",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#16a34a")}
          onMouseLeave={(e) => (e.target.style.background = "#22c55e")}
        >
          Search Salaries →
        </button>
      </form>

      {/* Quick Nav Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "16px",
          marginBottom: "48px",
        }}
      >
        {[
          {
            href: "/salaries",
            title: "Salary Table",
            desc: "Filter & sort all compensation data by company, role, level",
            icon: "📊",
          },
          {
            href: "/company/google",
            title: "Company Pages",
            desc: "Median comp, level distribution, salary breakdown",
            icon: "🏢",
          },
          {
            href: "/compare",
            title: "Compare",
            desc: "Side-by-side comparison of base, bonus, stock, total",
            icon: "⚖️",
          },
        ].map((card) => (
          <a
            key={card.href}
            href={card.href}
            style={{
              background: "#111",
              border: "1px solid #222",
              borderRadius: "10px",
              padding: "20px",
              textDecoration: "none",
              color: "inherit",
              display: "block",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "#22c55e44")
            }
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#222")}
          >
            <div style={{ fontSize: "1.4rem", marginBottom: "10px" }}>
              {card.icon}
            </div>
            <div style={{ fontWeight: 600, marginBottom: "6px" }}>
              {card.title}
            </div>
            <div
              style={{ fontSize: "0.82rem", color: "#6b7280", lineHeight: 1.5 }}
            >
              {card.desc}
            </div>
          </a>
        ))}
      </div>

      {/* Why Levels Matter */}
      <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: "40px" }}>
        <h2
          style={{
            fontSize: "0.75rem",
            color: "#6b7280",
            fontFamily: "JetBrains Mono, monospace",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "20px",
          }}
        >
          Why levels &gt; titles
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
          }}
        >
          {[
            {
              label: "L3 @ Google",
              comp: "₹30L",
              note: "vs SDE1 @ Startup ₹12L — same title, 2.5x gap",
            },
            {
              label: "L5 @ Amazon",
              comp: "₹62L",
              note: "vs L5 @ Meta ₹100L — same level, different TC",
            },
            {
              label: "L4 @ Flipkart",
              comp: "₹32L",
              note: "Stock-heavy packages vs cash-heavy differ wildly",
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "#0d1f0d",
                border: "1px solid #16a34a22",
                borderRadius: "8px",
                padding: "16px",
              }}
            >
              <div
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.8rem",
                  color: "#4ade80",
                  marginBottom: "4px",
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "#22c55e",
                  marginBottom: "6px",
                }}
              >
                {item.comp} TC
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#6b7280",
                  lineHeight: 1.4,
                }}
              >
                {item.note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const selectStyle = {
  background: "#1a1a1a",
  border: "1px solid #2a2a2a",
  color: "#f5f5f5",
  borderRadius: "8px",
  padding: "10px 14px",
  fontSize: "0.875rem",
  width: "100%",
  outline: "none",
  fontFamily: "DM Sans, sans-serif",
};
