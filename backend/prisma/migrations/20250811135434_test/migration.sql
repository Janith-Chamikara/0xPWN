/*
  Warnings:

  - You are about to drop the column `type` on the `RewardCatalog` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RewardCatalog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "rarity" TEXT NOT NULL
);
INSERT INTO "new_RewardCatalog" ("description", "id", "imageUrl", "name", "rarity") SELECT "description", "id", "imageUrl", "name", "rarity" FROM "RewardCatalog";
DROP TABLE "RewardCatalog";
ALTER TABLE "new_RewardCatalog" RENAME TO "RewardCatalog";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
