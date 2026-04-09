'use client'

import { useState, useTransition } from "react";
import { createBooking, deleteBooking, toggleLockSlot, updateServiceMessage } from "@/actions/bookingActions";
import { signOut } from "next-auth/react";
import { ChevronLeft, ChevronRight, Lock, LogOut, Trash2, Flame, ShieldAlert, CheckCircle2 } from "lucide-react";

type User = { id: string; username: string; role: string };
type Booking = { id: string; date: string; startTime: number; userId: string; user: { username: string } };
type LockedSlot = { id: string; date: string; startTime: number; reason: string };
type SystemSetting = { id: string; key: string; value: string; isActive: boolean };

interface Props {
  currentUser: User;
  initialBookings: Booking[];
  lockedSlots: LockedSlot[];
  serviceMessage: SystemSetting | null;
  allUsers: { id: string; username: string }[];
}

export default function DashboardClient({ currentUser, initialBookings, lockedSlots, serviceMessage, allUsers }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isPending, startTransition] = useTransition();
  
  // Admin states
  const [adminSelectedUser, setAdminSelectedUser] = useState<string>("");
  const [msgText, setMsgText] = useState(serviceMessage?.value || "");
  const [msgActive, setMsgActive] = useState(serviceMessage?.isActive || false);

  const isAdmin = currentUser.role === 'ADMIN';
  const hours = Array.from({ length: 14 }, (_, i) => i + 9); // Tider fra kl. 09 til 22

  const dateIso = currentDate.toISOString().split('T')[0];
  const displayDate = currentDate.toLocaleDateString('da-DK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  
  const nextDay = () => { const d = new Date(currentDate); d.setDate(d.getDate() + 1); setCurrentDate(d); };
  const prevDay = () => { const d = new Date(currentDate); d.setDate(d.getDate() - 1); setCurrentDate(d); };
  const today = () => setCurrentDate(new Date());

  const handleBook = (hour: number) => {
    startTransition(async () => {
      try {
        await createBooking(dateIso, hour, adminSelectedUser || undefined);
      } catch (e: any) { alert(e.message); }
    });
  }

  const handleDelete = (id: string) => {
    if(!confirm("Er du sikker på, at du vil slette denne booking?")) return;
    startTransition(async () => {
      try { await deleteBooking(id); } catch (e: any) { alert(e.message); }
    });
  }

  const handleLock = (hour: number, existingLock: LockedSlot | undefined) => {
    let reason = "Service vindue";
    if (!existingLock) {
      const userReason = prompt("Angiv årsag til låsning:", "Service vindue");
      if(userReason === null) return;
      reason = userReason;
    }
    
    startTransition(async () => {
      try { await toggleLockSlot(dateIso, hour, reason); } catch (e: any) { alert(e.message); }
    });
  }

  const handleSaveMessage = () => {
    startTransition(async () => {
      try { 
        await updateServiceMessage(msgText, msgActive); 
        alert("Systembesked er opdateret!"); 
      } catch (e: any) { alert(e.message); }
    });
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-orange-500/30">
      {/* Top Navigation */}
      <nav className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10 border border-orange-500/20 shadow-[0_0_15px_-3px_rgba(249,115,22,0.4)]">
              <Flame className="h-5 w-5 text-orange-500" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Sauna 2026</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400 hidden sm:inline-block">
              Logget ind som <strong className="text-white">{currentUser.username}</strong>
              {isAdmin && <span className="ml-2 text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full border border-orange-500/30">ADMIN</span>}
            </span>
            <button onClick={() => signOut()} className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white" title="Log ud">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        
        {/* Service Message Banner */}
        {serviceMessage?.isActive && !isAdmin && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-start gap-3 backdrop-blur-sm">
            <ShieldAlert className="h-6 w-6 text-blue-400 shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-100">Besked fra Administratoren</h3>
              <p className="text-blue-200/80 text-sm mt-1">{serviceMessage.value}</p>
            </div>
          </div>
        )}

        {/* Admin Panel */}
        {isAdmin && (
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-orange-500" />
              Administrator Kontrol
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm text-zinc-400">Book på vegne af bruger</label>
                <select 
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-orange-500 focus:outline-none"
                  value={adminSelectedUser}
                  onChange={(e) => setAdminSelectedUser(e.target.value)}
                >
                  <option value="">-- Book til dig selv --</option>
                  {allUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.username}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-sm text-zinc-400">Global Servicebesked</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-orange-500 focus:outline-none"
                    placeholder="F.eks. Saunaen er under ombygning..."
                    value={msgText}
                    onChange={(e) => setMsgText(e.target.value)}
                  />
                  <button 
                    onClick={() => setMsgActive(!msgActive)}
                    className={`px-4 rounded-xl border transition-all ${msgActive ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}
                  >
                    {msgActive ? 'Aktiv' : 'Skjult'}
                  </button>
                  <button onClick={handleSaveMessage} className="bg-zinc-100 text-zinc-900 px-4 rounded-xl font-medium hover:bg-white transition-colors">Gem</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calendar / Date Selector */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-900/30 border border-zinc-800/50 p-4 rounded-3xl">
          <button onClick={today} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-zinc-800">
            I dag
          </button>
          <div className="flex items-center gap-6">
            <button onClick={prevDay} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full transition-all border border-zinc-700">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-medium capitalize min-w-[220px] text-center">{displayDate}</h2>
            <button onClick={nextDay} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full transition-all border border-zinc-700">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="w-[68px] hidden sm:block"></div> {/* Spacer for centering */}
        </div>

        {/* Time Slots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hours.map(hour => {
            const booking = initialBookings.find(b => b.date.startsWith(dateIso) && b.startTime === hour);
            const locked = lockedSlots.find(l => l.date.startsWith(dateIso) && l.startTime === hour);
            
            let status: 'free' | 'booked_me' | 'booked_other' | 'locked' = 'free';
            if (locked) status = 'locked';
            else if (booking) {
              status = booking.userId === currentUser.id ? 'booked_me' : 'booked_other';
            }

            return (
              <div 
                key={hour} 
                className={`relative flex flex-col p-5 rounded-2xl border transition-all duration-300 ${
                  status === 'free' ? 'bg-zinc-900/50 border-zinc-800 hover:border-orange-500/50 hover:bg-zinc-800/50' : 
                  status === 'booked_me' ? 'bg-orange-500/10 border-orange-500/30 shadow-[0_0_30px_-10px_rgba(249,115,22,0.15)]' : 
                  status === 'locked' ? 'bg-zinc-950 border-zinc-900 opacity-60' : 
                  'bg-zinc-900 border-zinc-800'
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-2xl font-light font-mono tracking-tighter">{hour}:00</span>
                  
                  {status === 'free' && <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Ledig</span>}
                  {status === 'booked_me' && <span className="text-xs font-medium px-2 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1"><CheckCircle2 className="h-3 w-3"/> Din tid</span>}
                  {status === 'booked_other' && <span className="text-xs font-medium px-2 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">Optaget</span>}
                  {status === 'locked' && <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1"><Lock className="h-3 w-3"/> Låst</span>}
                </div>

                <div className="flex-1 flex items-center mb-4">
                  {status === 'booked_other' && <p className="text-sm text-zinc-500 flex items-center gap-2"><Lock className="h-4 w-4"/> Booket af {booking?.user.username}</p>}
                  {status === 'locked' && <p className="text-sm text-zinc-600 line-clamp-1">{locked?.reason}</p>}
                  {status === 'free' && <p className="text-sm text-zinc-600">Saunaen er klar.</p>}
                  {status === 'booked_me' && <p className="text-sm text-orange-300/80">Du har reserveret saunaen.</p>}
                </div>

                <div className="flex gap-2 mt-auto">
                  {status === 'free' && (
                    <button disabled={isPending} onClick={() => handleBook(hour)} className="flex-1 bg-white text-zinc-950 font-medium py-2.5 rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50">
                      Book tid
                    </button>
                  )}
                  {status === 'booked_me' && (
                    <button disabled={isPending} onClick={() => handleDelete(booking!.id)} className="flex-1 flex justify-center items-center gap-2 bg-red-500/10 text-red-400 font-medium py-2.5 rounded-xl hover:bg-red-500/20 transition-colors border border-red-500/20 disabled:opacity-50">
                      <Trash2 className="h-4 w-4" /> Annuller
                    </button>
                  )}
                  {(status === 'booked_other' && isAdmin) && (
                    <button disabled={isPending} onClick={() => handleDelete(booking!.id)} className="flex-1 flex justify-center items-center gap-2 bg-zinc-800 text-red-400 font-medium py-2.5 rounded-xl hover:bg-zinc-700 transition-colors border border-zinc-700 disabled:opacity-50">
                      <Trash2 className="h-4 w-4" /> Tving sletning
                    </button>
                  )}
                  {isAdmin && (
                    <button 
                      disabled={isPending} 
                      onClick={() => handleLock(hour, locked)} 
                      className={`p-2.5 rounded-xl border transition-colors flex items-center justify-center ${locked ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
                      title={locked ? "Lås op" : "Lås tid (Service vindue)"}
                    >
                      <Lock className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}