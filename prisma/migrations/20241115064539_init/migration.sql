-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "emailPreferences" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Invite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "bondId" TEXT NOT NULL,
    CONSTRAINT "Invite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Invite_bondId_fkey" FOREIGN KEY ("bondId") REFERENCES "Bond" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Bond" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT NOT NULL,
    CONSTRAINT "Bond_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "bondId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Member_bondId_fkey" FOREIGN KEY ("bondId") REFERENCES "Bond" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BingoCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "bondId" TEXT NOT NULL,
    CONSTRAINT "BingoCard_bondId_fkey" FOREIGN KEY ("bondId") REFERENCES "Bond" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BingoCell" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "position" INTEGER NOT NULL,
    "activity" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "cardId" TEXT NOT NULL,
    CONSTRAINT "BingoCell_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "BingoCard" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "cellId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "planDate" DATETIME NOT NULL,
    "planDescription" TEXT NOT NULL,
    CONSTRAINT "Plan_cellId_fkey" FOREIGN KEY ("cellId") REFERENCES "BingoCell" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Plan_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "BingoCard" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Memory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "planId" TEXT NOT NULL,
    "memoryDate" DATETIME NOT NULL,
    "bondId" TEXT NOT NULL,
    CONSTRAINT "Memory_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Memory_bondId_fkey" FOREIGN KEY ("bondId") REFERENCES "Bond" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Bond_createdById_idx" ON "Bond"("createdById");

-- CreateIndex
CREATE INDEX "Member_bondId_idx" ON "Member"("bondId");

-- CreateIndex
CREATE INDEX "Member_userId_idx" ON "Member"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Member_bondId_userId_key" ON "Member"("bondId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "BingoCard_bondId_key" ON "BingoCard"("bondId");

-- CreateIndex
CREATE INDEX "BingoCard_bondId_idx" ON "BingoCard"("bondId");

-- CreateIndex
CREATE INDEX "BingoCell_cardId_idx" ON "BingoCell"("cardId");

-- CreateIndex
CREATE UNIQUE INDEX "BingoCell_cardId_position_key" ON "BingoCell"("cardId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_cellId_key" ON "Plan"("cellId");

-- CreateIndex
CREATE INDEX "Plan_cellId_idx" ON "Plan"("cellId");

-- CreateIndex
CREATE UNIQUE INDEX "Memory_planId_key" ON "Memory"("planId");

-- CreateIndex
CREATE UNIQUE INDEX "Picture_memoryId_key" ON "Picture"("memoryId");
