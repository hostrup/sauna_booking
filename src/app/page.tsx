import { prisma } from "@/lib/prisma";
import BookingForm from "@/components/BookingForm"; // <-- NY IMPORT

export default async function Home() {
  const bookings = await prisma.booking.findMany({
    include: { user: true },
    orderBy: { startTime: 'asc' }
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-zinc-900 text-white font-sans">
      <h1 className="text-4xl font-bold mb-8 mt-12">Sauna Booking</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        
        {/* FORMULAR SEKTION */}
        <div className="bg-zinc-800 p-6 rounded-lg shadow-lg border border-zinc-700">
          <h2 className="text-2xl font-semibold mb-4">Book en tid</h2>
          <BookingForm /> {/* <-- KOMPONENTEN ER INDSAT HER */}
        </div>

        {/* OVERSIGT SEKTION */}
        <div className="bg-zinc-800 p-6 rounded-lg shadow-lg border border-zinc-700">
          <h2 className="text-2xl font-semibold mb-4">Kommende Bookinger</h2>
          
          {bookings.length === 0 ? (
            <div className="p-4 bg-zinc-900 rounded border border-dashed border-zinc-600 text-center">
              <p className="text-zinc-400">Ingen bookinger i kalenderen endnu.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {bookings.map((booking) => (
                <li key={booking.id} className="bg-zinc-700 p-3 rounded flex flex-col">
                  <span className="font-medium text-blue-400">{booking.user.email}</span>
                  <div className="text-sm text-zinc-300 flex justify-between mt-1">
                    <span>Dato: {booking.startTime.toLocaleDateString('da-DK')}</span>
                    <span>Tid: {booking.startTime.toLocaleTimeString('da-DK', {hour: '2-digit', minute:'2-digit'})} - {booking.endTime.toLocaleTimeString('da-DK', {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </main>
  );
}