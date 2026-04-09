'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createBooking(dateIso: string, startTime: number, userIdToBook?: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Du skal være logget ind");

  const currentUserRole = (session.user as any).role;
  const currentUserId = (session.user as any).id;

  // Hvis Admin har valgt en specifik bruger at booke for, bruger vi den ID. Ellers ens egen.
  const targetUserId = (currentUserRole === 'ADMIN' && userIdToBook) ? userIdToBook : currentUserId;

  await prisma.booking.create({
    data: {
      date: new Date(dateIso),
      startTime,
      userId: targetUserId
    }
  });

  revalidatePath('/');
}

export async function deleteBooking(bookingId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Du skal være logget ind");

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new Error("Bookingen findes ikke");

  const currentUserId = (session.user as any).id;
  const currentUserRole = (session.user as any).role;

  // Kun ejeren af bookingen ELLER en admin må slette
  if (booking.userId !== currentUserId && currentUserRole !== 'ADMIN') {
    throw new Error("Ingen adgang");
  }

  await prisma.booking.delete({ where: { id: bookingId } });
  revalidatePath('/');
}

export async function toggleLockSlot(dateIso: string, startTime: number, reason: string) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') throw new Error("Kun administratorer har adgang");

  const existing = await prisma.lockedSlot.findUnique({
    where: {
      date_startTime: {
        date: new Date(dateIso),
        startTime
      }
    }
  });

  if (existing) {
    await prisma.lockedSlot.delete({ where: { id: existing.id } });
  } else {
    await prisma.lockedSlot.create({
      data: {
        date: new Date(dateIso),
        startTime,
        reason
      }
    });
  }
  revalidatePath('/');
}

export async function updateServiceMessage(message: string, isActive: boolean) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') throw new Error("Kun administratorer har adgang");

  await prisma.systemSetting.upsert({
    where: { key: "SERVICE_MESSAGE" },
    update: { value: message, isActive },
    create: { key: "SERVICE_MESSAGE", value: message, isActive }
  });
  revalidatePath('/');
}