import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardClient from "@/components/DashboardClient";

export default async function Home() {
  // 1. Beskyt ruten: Tjek om brugeren er logget ind
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  // 2. Hent den aktuelle bruger fra databasen
  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id }
  });

  if (!user) {
    redirect("/login");
  }

  // 3. Hent alle aktuelle bookinger, låste tider og servicebeskeden
  const bookings = await prisma.booking.findMany({
    include: { user: true },
  });

  const lockedSlots = await prisma.lockedSlot.findMany();

  const serviceMessage = await prisma.systemSetting.findUnique({
    where: { key: "SERVICE_MESSAGE" }
  });

  // 4. Hvis det er en admin, skal de have listen over alle brugere
  let allUsers: any[] = [];
  if (user.role === 'ADMIN') {
    allUsers = await prisma.user.findMany({
      select: { id: true, username: true },
      orderBy: { username: 'asc' }
    });
  }

  // Next.js sender data til klienten, så vi omdanner Date-objekter til ISO-strenge for at undgå fejl
  const safeBookings = bookings.map(b => ({
    id: b.id,
    date: b.date.toISOString(),
    startTime: b.startTime,
    userId: b.userId,
    user: { username: b.user.username }
  }));

  const safeLockedSlots = lockedSlots.map(l => ({
    id: l.id,
    date: l.date.toISOString(),
    startTime: l.startTime,
    reason: l.reason
  }));

  return (
    <DashboardClient 
      currentUser={{ id: user.id, username: user.username, role: user.role }}
      initialBookings={safeBookings}
      lockedSlots={safeLockedSlots}
      serviceMessage={serviceMessage}
      allUsers={allUsers}
    />
  );
}