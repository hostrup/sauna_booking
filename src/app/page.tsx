import { prisma } from "@/lib/prisma";

export default async function Home() {
  // Hent alle brugere fra databasen via Prisma
  const users = await prisma.user.findMany();

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-zinc-900 text-white font-sans">
      <h1 className="text-4xl font-bold mb-8 mt-12">Sauna Booking Prototype</h1>

      <div className="bg-zinc-800 p-6 rounded-lg shadow-lg w-full max-w-md border border-zinc-700">
        <h2 className="text-2xl font-semibold mb-4">Registrerede Brugere</h2>
        
        {users.length === 0 ? (
          <div className="p-4 bg-zinc-900 rounded border border-dashed border-zinc-600 text-center">
            <p className="text-zinc-400">Ingen brugere fundet i databasen endnu.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {users.map((user) => (
              <li key={user.id} className="bg-zinc-700 p-3 rounded flex justify-between items-center">
                <span className="font-medium">{user.email}</span>
                {user.name && <span className="text-sm text-zinc-300">{user.name}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}