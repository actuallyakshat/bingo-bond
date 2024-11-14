-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "cellId" TEXT NOT NULL,
    "planDate" DATETIME NOT NULL,
    "planDescription" TEXT NOT NULL,
    CONSTRAINT "Plan_cellId_fkey" FOREIGN KEY ("cellId") REFERENCES "BingoCell" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Memory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "planId" TEXT NOT NULL,
    "memoryDate" DATETIME NOT NULL,
    CONSTRAINT "Memory_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Picture" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "memoryId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    CONSTRAINT "Picture_memoryId_fkey" FOREIGN KEY ("memoryId") REFERENCES "Memory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Plan_cellId_key" ON "Plan"("cellId");

-- CreateIndex
CREATE INDEX "Plan_cellId_idx" ON "Plan"("cellId");

-- CreateIndex
CREATE UNIQUE INDEX "Memory_planId_key" ON "Memory"("planId");

-- CreateIndex
CREATE UNIQUE INDEX "Picture_memoryId_key" ON "Picture"("memoryId");
