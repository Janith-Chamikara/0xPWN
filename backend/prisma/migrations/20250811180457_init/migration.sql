/*
  Warnings:

  - Added the required column `resources` to the `Challenge` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Challenge" (
    "challenge_id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'Medium',
    "points" INTEGER NOT NULL,
    "flag" TEXT NOT NULL,
    "resources" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    CONSTRAINT "Challenge_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category" ("category_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Challenge_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Challenge" ("category_id", "challenge_id", "created_at", "created_by", "description", "difficulty", "flag", "points", "title") SELECT "category_id", "challenge_id", "created_at", "created_by", "description", "difficulty", "flag", "points", "title" FROM "Challenge";
DROP TABLE "Challenge";
ALTER TABLE "new_Challenge" RENAME TO "Challenge";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
