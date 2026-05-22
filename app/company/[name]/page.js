// app/company/[name]/page.js

//async function getCompanyData(company) {
//  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
//const res = await fetch(`${baseUrl}/api/company/${company}`, {
//cache: "no-store",
//});
//if (!res.ok) return null;
//return res.json();
//}
async function getCompanyData(company) {
  try {
    const res = await fetch(`http://localhost:3000/api/company/${company}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function fmt(n) {
  if (!n) return "₹0";
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

const LEVEL_COLORS = {
  L3: "#4ade80",
  L4: "#22c55e",
  L5: "#86efac",
  L6: "#fbbf24",
  L7: "#f87171",
};

export default async function CompanyPage({ params }) {
  const { name } = await params;
  const company = decodeURIComponent(params.name).toLowerCase().trim();
  const data = await getCompanyData(company);

  if (!data || data.error) {
    return (
      <div style={{ padding: "60px 24px", textAlign: "center" }}>
        <h1 style={{ color: "#f5f5f5", marginBottom: "12px" }}>
          Company not found
        </h1>
        <p style={{ color: "#6b7280" }}>No data for "{company}"</p>
        <a
          href="/salaries"
          style={{
            color: "#22c55e",
            marginTop: "16px",
            display: "inline-block",
          }}
        >
          ← Back to salaries
        </a>
      </div>
    );
  }

  const displayName = company.charAt(0).toUpperCase() + company.slice(1);
  const maxCount = Math.max(...data.level_distribution.map((l) => l.count), 1);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <a
          href="/salaries"
          style={{
            color: "#6b7280",
            fontSize: "0.8rem",
            textDecoration: "none",
            display: "inline-block",
            marginBottom: "16px",
          }}
        >
          ← All salaries
        </a>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "8px" }}>
          {displayName}
        </h1>
        <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
          {data.total_entries} salary entries · compensation intelligence
        </p>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "40px",
        }}
      >
        {[
          {
            label: "Median TC",
            value: fmt(data.median_compensation),
            highlight: true,
          },
          { label: "Avg Base", value: fmt(data.avg_base) },
          { label: "Avg Bonus", value: fmt(data.avg_bonus) },
          { label: "Avg Stock", value: fmt(data.avg_stock) },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: stat.highlight ? "#0d1f0d" : "#111",
              border: `1px solid ${stat.highlight ? "#16a34a44" : "#1a1a1a"}`,
              borderRadius: "10px",
              padding: "20px",
            }}
          >
            <div
              style={{
                fontSize: "0.7rem",
                color: "#6b7280",
                fontFamily: "JetBrains Mono, monospace",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "8px",
              }}
            >
              {stat.label}
            </div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: stat.highlight ? "#22c55e" : "#f5f5f5",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Level Distribution */}
      <div
        style={{
          background: "#111",
          border: "1px solid #1a1a1a",
          borderRadius: "10px",
          padding: "24px",
          marginBottom: "32px",
        }}
      >
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
          Level Distribution
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {data.level_distribution.map((lvl) => (
            <div
              key={lvl.level}
              style={{ display: "flex", alignItems: "center", gap: "12px" }}
            >
              <span
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.75rem",
                  width: "28px",
                  color: LEVEL_COLORS[lvl.level] || "#6b7280",
                  fontWeight: 700,
                }}
              >
                {lvl.level}
              </span>
              <div
                style={{
                  flex: 1,
                  background: "#1a1a1a",
                  borderRadius: "4px",
                  height: "8px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    borderRadius: "4px",
                    background: LEVEL_COLORS[lvl.level] || "#22c55e",
                    width: `${(lvl.count / maxCount) * 100}%`,
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "#6b7280",
                  fontFamily: "JetBrains Mono, monospace",
                  width: "60px",
                  textAlign: "right",
                }}
              >
                {lvl.count} · {fmt(lvl.median_tc)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Salary List */}
      <div
        style={{
          background: "#111",
          border: "1px solid #1a1a1a",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{ padding: "20px 24px", borderBottom: "1px solid #1a1a1a" }}
        >
          <h2
            style={{
              fontSize: "0.75rem",
              color: "#6b7280",
              fontFamily: "JetBrains Mono, monospace",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            All Entries
          </h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="salary-table">
            <thead>
              <tr>
                <th>Role</th>
                <th>Level</th>
                <th>Location</th>
                <th>Exp</th>
                <th>Base</th>
                <th>Bonus</th>
                <th>Stock</th>
                <th>Total TC</th>
              </tr>
            </thead>
            <tbody>
              {data.salaries.map((s) => (
                <tr key={s.id}>
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
                  <td className="comp-value">{fmt(s.total_compensation)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
