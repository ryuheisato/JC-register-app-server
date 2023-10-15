/*
  Warnings:

  - Made the column `studentID` on table `Member` required. This step will fail if there are existing NULL values in that column.
  - Made the column `studentID` on table `SemesterMember` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Member" ALTER COLUMN "studentID" SET NOT NULL;

-- AlterTable
ALTER TABLE "SemesterMember" ALTER COLUMN "studentID" SET NOT NULL;
