/*
  Warnings:

  - You are about to drop the column `title` on the `BingoCard` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BingoCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "bondId" TEXT NOT NULL,
    CONSTRAINT "BingoCard_bondId_fkey" FOREIGN KEY ("bondId") REFERENCES "Bond" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BingoCard" ("bondId", "createdAt", "id", "updatedAt") SELECT "bondId", "createdAt", "id", "updatedAt" FROM "BingoCard";
DROP TABLE "BingoCard";
ALTER TABLE "new_BingoCard" RENAME TO "BingoCard";
CREATE UNIQUE INDEX "BingoCard_bondId_key" ON "BingoCard"("bondId");
CREATE INDEX "BingoCard_bondId_idx" ON "BingoCard"("bondId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
