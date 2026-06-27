# CompLevel — Compensation Intelligence Platform

> Real compensation data for Indian tech professionals, tied to levels — not just titles.

---

## What is CompLevel?

CompLevel is a salary transparency platform built for Indian tech professionals. It provides real, level-based compensation data across top tech companies like Google, Meta, Amazon, Microsoft, Atlassian, and more.

Think of it as India's version of **levels.fyi**.

---

## Features

- **Salary Table** — Browse and filter all salary entries by company, role, level, and location
- **Company Pages** — View detailed compensation stats per company including median TC, avg base, bonus, stock, and level distribution
- **Compare** — Side-by-side compensation comparison between two companies
- **Level-based Data** — Compensation tied to standardized levels (L3–L7), not just job titles

---

## Tech Stack

| Layer                 | Technology              |
| --------------------- | ----------------------- |
| Frontend              | Next.js 14 (App Router) |
| Backend               | Next.js API Routes      |
| Database (Local)      | SQLite via Prisma       |
| Database (Production) | Neon PostgreSQL         |
| ORM                   | Prisma                  |
| Styling               | Tailwind CSS            |
| Deployment            | Vercel                  |

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Ishwarya-1234/comp-intel.git
cd comp-intel

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Set up the database
npx prisma migrate dev --name init

# Seed sample data
node prisma/seed.js

# Start the development server
npm run dev
```

Visit `http://localhost:3000`

---

## Environment Variables

Create a `.env` file in the root directory:

```env
# For local development (SQLite)
DATABASE_URL="file:./dev.db"
```

For production (Neon PostgreSQL), set `DATABASE_URL` in your Vercel environment variables.

---

## Project Structure

```
comp-intel/
├── app/
│   ├── api/
│   │   ├── company/[company]/   # Company data API
│   │   ├── salaries/            # Salaries API
│   │   └── compare/             # Compare API
│   ├── company/[name]/          # Company page
│   ├── salaries/                # Salary table page
│   ├── compare/                 # Compare page
│   └── page.js                  # Home page
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.js                  # Sample data seeder
├── lib/
│   └── prisma.js                # Prisma client
└── components/                  # Reusable components
```

---

## Deployment

This project is deployed on **Vercel** with **Neon PostgreSQL** as the production database.

Live URL: [[comp-intel.vercel.app](https://comp-intel.vercel.app)](https://comp-intel-kta4.vercel.app/)

---

## Why CompLevel?

Salary transparency is low in the Indian tech industry. Most professionals don't know:

- Am I being underpaid for my level?
- What does Google pay an L5 vs Microsoft?
- How does stock compensation compare across companies?

CompLevel solves this by providing structured, level-based compensation data — empowering professionals to make informed career decisions.

---

## Author

**Ishwarya RK**  
GitHub: [@Ishwarya-1234](https://github.com/Ishwarya-1234)

---

## License

MIT
