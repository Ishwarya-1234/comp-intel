-- CreateTable
CREATE TABLE "Salary" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "experience_years" INTEGER NOT NULL,
    "base_salary" REAL NOT NULL,
    "bonus" REAL NOT NULL DEFAULT 0,
    "stock" REAL NOT NULL DEFAULT 0,
    "total_compensation" REAL NOT NULL,
    "confidence_score" REAL NOT NULL DEFAULT 1.0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "Salary_company_idx" ON "Salary"("company");

-- CreateIndex
CREATE INDEX "Salary_level_idx" ON "Salary"("level");

-- CreateIndex
CREATE INDEX "Salary_role_idx" ON "Salary"("role");

-- CreateIndex
CREATE INDEX "Salary_location_idx" ON "Salary"("location");
