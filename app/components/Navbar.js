"use client";

export default function Navbar() {
  return (
    <nav style={{ background: "#16a34a", padding: "1rem" }}>
      <a href="/" style={{ color: "white", marginRight: "1rem" }}>
        Home
      </a>
      <a href="/salaries" style={{ color: "white", marginRight: "1rem" }}>
        Salaries
      </a>
      <a href="/compare" style={{ color: "white" }}>
        Compare
      </a>
    </nav>
  );
}
