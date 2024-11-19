-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Plan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "emoji" TEXT NOT NULL DEFAULT '🎉',
    "cellId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "planDate" DATETIME NOT NULL,
    "planDescription" TEXT NOT NULL,
    "memoryId" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "remindersSent" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Plan_cellId_fkey" FOREIGN KEY ("cellId") REFERENCES "BingoCell" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Plan_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "BingoCard" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Plan_memoryId_fkey" FOREIGN KEY ("memoryId") REFERENCES "Memory" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Plan" ("cardId", "cellId", "completed", "createdAt", "emoji", "id", "memoryId", "planDate", "planDescription", "updatedAt") SELECT "cardId", "cellId", "completed", "createdAt", "emoji", "id", "memoryId", "planDate", "planDescription", "updatedAt" FROM "Plan";
DROP TABLE "Plan";
ALTER TABLE "new_Plan" RENAME TO "Plan";
CREATE UNIQUE INDEX "Plan_cellId_key" ON "Plan"("cellId");
CREATE UNIQUE INDEX "Plan_memoryId_key" ON "Plan"("memoryId");
CREATE INDEX "Plan_cellId_idx" ON "Plan"("cellId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
