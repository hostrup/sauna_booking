'use client'

import { useRef } from "react";
import { createBooking } from "@/actions/bookingActions";

export default function BookingForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        try {
          await createBooking(formData);
          formRef.current?.reset(); // Tømmer felterne ved succes
        } catch (error) {
          console.error(error);
          alert("Der skete en fejl under bookingen! Tjek terminal-loggen for detaljer.");
        }
      }}
      className="flex flex-col space-y-4"
    >
      <div className="flex flex-col">
        <label htmlFor="email" className="text-sm text-zinc-400 mb-1">Email</label>
        <input type="email" id="email" name="email" required className="p-2 rounded bg-zinc-900 border border-zinc-600 focus:outline-none focus:border-blue-500" placeholder="din@email.dk" />
      </div>

      <div className="flex flex-col">
        <label htmlFor="date" className="text-sm text-zinc-400 mb-1">Dato</label>
        <input type="date" id="date" name="date" required className="p-2 rounded bg-zinc-900 border border-zinc-600 focus:outline-none focus:border-blue-500 [color-scheme:dark]" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label htmlFor="startTime" className="text-sm text-zinc-400 mb-1">Start tid</label>
          <input type="time" id="startTime" name="startTime" required className="p-2 rounded bg-zinc-900 border border-zinc-600 focus:outline-none focus:border-blue-500 [color-scheme:dark]" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="endTime" className="text-sm text-zinc-400 mb-1">Slut tid</label>
          <input type="time" id="endTime" name="endTime" required className="p-2 rounded bg-zinc-900 border border-zinc-600 focus:outline-none focus:border-blue-500 [color-scheme:dark]" />
        </div>
      </div>

      <button type="submit" className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
        Bekræft Booking
      </button>
    </form>
  );
}