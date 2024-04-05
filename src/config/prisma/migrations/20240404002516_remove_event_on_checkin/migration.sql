/*
  Warnings:

  - You are about to drop the column `event_id` on the `check_ins` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_check_ins" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "attendee_id" INTEGER NOT NULL,
    CONSTRAINT "check_ins_attendee_id_fkey" FOREIGN KEY ("attendee_id") REFERENCES "attendees" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_check_ins" ("attendee_id", "id") SELECT "attendee_id", "id" FROM "check_ins";
DROP TABLE "check_ins";
ALTER TABLE "new_check_ins" RENAME TO "check_ins";
CREATE UNIQUE INDEX "check_ins_attendee_id_key" ON "check_ins"("attendee_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
