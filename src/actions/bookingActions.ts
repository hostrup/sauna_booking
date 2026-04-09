'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createBooking(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const date = formData.get('date') as string;
    const startTimeStr = formData.get('startTime') as string;
    const endTimeStr = formData.get('endTime') as string;

    if (!email || !date || !startTimeStr || !endTimeStr) {
      throw new Error("Udfyld venligst alle felter");
    }

    const startTime = new Date(`${date}T${startTimeStr}:00Z`);
    const endTime = new Date(`${date}T${endTimeStr}:00Z`);

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { 
        email, 
        name: email.split('@')[0]
      }
    });

    await prisma.booking.create({
      data: {
        startTime,
        endTime,
        userId: user.id
      }
    });

    // Opdaterer data på forsiden (uden at tvinge et hard-reload via redirect)
    revalidatePath('/');
    
  } catch (error) {
    // Logger den præcise fejl i din Docker-terminal
    console.error("Server Action Fejl:", error);
    throw new Error("Bookingen fejlede. Tjek loggen.");
  }
}