// app/layout.js

import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "CompLevel — Compensation Intelligence",
  description: "Levels-based compensation intelligence for India tech roles",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main style={{ minHeight: "calc(100vh - 56px)" }}>{children}</main>
      </body>
    </html>
  );
}
