'use client'

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Flame } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("🔥 LoginPage er mountet og JavaScript kører!");
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Udfyld venligst både brugernavn og adgangskode.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(`Login afvist. Tjek dit kodeord.`);
        setIsLoading(false);
      } else if (res?.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError("Ukendt fejl: Ingen respons fra serveren.");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Kritisk systemfejl fanget:", err);
      setError(`Systemfejl: ${err}`);
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLogin();
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-sm">
        
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10">
            <Flame className="h-8 w-8 text-orange-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Sauna Booking</h1>
          <p className="mt-2 text-sm text-zinc-400">Log ind for at reservere din tid</p>
        </div>

        <div className="mt-8 space-y-6">
          {error && (
            <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500 text-center border border-red-500/20">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">Brugernavn</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
                placeholder="Brugernavn"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Adgangskode</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
                placeholder="Adgangskode"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            disabled={isLoading}
            className="flex w-full justify-center rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logger ind..." : "Log ind"}
          </button>
        </div>
      </div>
    </main>
  );
}