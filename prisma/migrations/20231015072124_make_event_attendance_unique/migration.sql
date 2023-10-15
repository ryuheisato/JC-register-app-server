/*
  Warnings:

  - A unique constraint covering the columns `[eventId,memberId]` on the table `EventAttendance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EventAttendance_eventId_memberId_key" ON "EventAttendance"("eventId", "memberId");
