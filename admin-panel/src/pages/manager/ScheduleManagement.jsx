import React, { useState, useEffect, useRef } from "react";
import {
  Clock, XCircle, Loader2, Activity, Trophy, User,
  ChevronLeft, ChevronRight, Trash2, Plus, Calendar
} from "lucide-react";
import api, { deleteManagerBooking } from "../../services/api";

/* ─── helpers ─────────────────────────────────────────────────── */
const getLocalDate = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const shiftDate = (dateStr, days) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return getLocalDate(date);
};

const formatFull = (dateStr) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
};

const formatShort = (dateStr) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const DAY_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getWeek = (dateStr) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  const base = new Date(y, m - 1, d);
  const dow = base.getDay();
  const monday = new Date(base);
  monday.setDate(base.getDate() - ((dow + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    return getLocalDate(day);
  });
};

/* ─── component ───────────────────────────────────────────────── */
export default function ScheduleManagement() {
  const TODAY = getLocalDate();
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSlot, setActiveSlot] = useState(null);   // booked slot detail
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [targetSlot, setTargetSlot] = useState(null);
  const [bookingForm, setBookingForm] = useState({ customerName: "", totalPrice: "" });

  /* fetch */
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/manager/schedule", { params: { date: selectedDate } });
      setData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchData(); }, [selectedDate]);

  /* slots */
  const generateSlots = () => {
    if (!data) return [];
    const openingStr = data.arena?.openingHours || "06:00 AM – 10:00 PM";
    const [startPart, endPart] = openingStr.split("–").map((s) => s.trim());
    const parseHour = (t) => {
      const [time, mod] = t.split(" ");
      let [h] = time.split(":").map(Number);
      if (mod === "PM" && h < 12) h += 12;
      if (mod === "AM" && h === 12) h = 0;
      return h;
    };
    const start = parseHour(startPart);
    const end = parseHour(endPart);
    return Array.from({ length: end - start }, (_, i) => {
      const h = start + i;
      const timeVal = `${String(h).padStart(2, "0")}:00`;
      const timeLabel = `${h % 12 || 12}:00 ${h >= 12 ? "PM" : "AM"}`;
      const nextLabel = `${(h + 1) % 12 || 12}:00 ${h + 1 >= 12 ? "PM" : "AM"}`;
      const booking = data.bookings?.find((b) => b.startTime.startsWith(String(h).padStart(2, "0"))) || null;
      return { h, timeVal, timeLabel, nextLabel, booking };
    });
  };

  const slots = generateSlots();
  const week = getWeek(selectedDate);
  const booked = slots.filter((s) => s.booking).length;
  const free = slots.length - booked;
  const occupancy = slots.length ? Math.round((booked / slots.length) * 100) : 0;

  /* handlers */
  const openBook = (slot) => {
    setTargetSlot(slot);
    setBookingForm({ customerName: "", totalPrice: data?.arena?.price || "" });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking? This cannot be undone.")) return;
    try {
      await deleteManagerBooking(id);
      setActiveSlot(null);
      fetchData();
    } catch { alert("Failed to delete booking."); }
  };

  const handleManualBooking = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      await api.post("/manager/bookings", {
        date: selectedDate,
        startTime: targetSlot.timeVal,
        customerName: bookingForm.customerName || "Walk-in Customer",
        totalPrice: bookingForm.totalPrice,
      });
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create booking.");
    } finally {
      setModalLoading(false);
    }
  };

  /* loading splash */
  if (loading && !data) return (
    <div className="flex items-center justify-center min-h-[500px]">
      <Activity className="animate-spin text-amber-500 w-7 h-7" />
    </div>
  );

  return (
    <div className="min-h-screen pb-16">

      {/* ── PAGE HEADER ─────────────────────────────────────────── */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-amber-500 mb-1">Arena Schedule</p>
          <h1 className="text-3xl font-outfit-bold text-white leading-tight">{formatFull(selectedDate)}</h1>
        </div>

        {/* date nav */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedDate(TODAY)}
            className="px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 rounded-xl transition-all"
          >
            Today
          </button>
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <button onClick={() => setSelectedDate(shiftDate(selectedDate, -1))} className="px-3 py-2 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-white text-sm font-medium outline-none px-2 py-2 cursor-pointer w-36"
            />
            <button onClick={() => setSelectedDate(shiftDate(selectedDate, 1))} className="px-3 py-2 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── WEEK STRIP ──────────────────────────────────────────── */}
      <div className="flex gap-1.5 mb-8 overflow-x-auto pb-1">
        {week.map((d) => {
          const isSel = d === selectedDate;
          const isToday = d === TODAY;
          const [, , dd] = d.split("-").map(Number);
          const dayOfWeek = new Date(...d.split("-").map((n, i) => i === 1 ? +n - 1 : +n)).getDay();
          return (
            <button
              key={d}
              onClick={() => setSelectedDate(d)}
              className={`flex-1 min-w-[52px] flex flex-col items-center py-3 px-1 rounded-2xl transition-all duration-200 border
                ${isSel
                  ? "bg-white text-black border-transparent shadow-lg shadow-white/10"
                  : "bg-transparent border-zinc-800/60 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                }`}
            >
              <span className={`text-[9px] font-bold uppercase tracking-widest mb-1 ${isSel ? "text-zinc-600" : ""}`}>
                {DAY_ABBR[dayOfWeek]}
              </span>
              <span className={`text-base font-outfit-bold leading-none ${isSel ? "text-black" : isToday ? "text-amber-400" : ""}`}>
                {dd}
              </span>
              {isToday && !isSel && <span className="w-1 h-1 rounded-full bg-amber-400 mt-1" />}
            </button>
          );
        })}
      </div>

      {/* ── MAIN LAYOUT ─────────────────────────────────────────── */}
      <div className="flex gap-6">

        {/* ── TIME GRID ───────────────────────────────────────────── */}
        <div className="flex-1 relative">
          {loading && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] z-10 rounded-3xl flex items-center justify-center">
              <Loader2 className="animate-spin text-amber-500 w-6 h-6" />
            </div>
          )}

          <div className="rounded-3xl border border-zinc-800/60 overflow-hidden bg-[#0c0c0e]">
            {/* grid header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/60">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-500">Time Slots</span>
                <span className="text-[11px] font-bold text-zinc-600">·</span>
                <span className="text-[11px] font-medium text-zinc-600">{data?.arena?.openingHours}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm bg-zinc-700" />
                  <span className="text-[10px] text-zinc-600 font-medium">Free</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm bg-amber-500/60" />
                  <span className="text-[10px] text-zinc-600 font-medium">Online</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm bg-blue-500/60" />
                  <span className="text-[10px] text-zinc-600 font-medium">Walk-in</span>
                </div>
              </div>
            </div>

            {/* rows */}
            <div className="divide-y divide-zinc-800/40">
              {slots.map((slot, idx) => {
                const b = slot.booking;
                const isOnline = !!b?.matchId;
                const isWalkIn = b && !b.matchId;
                const isActive = activeSlot?.timeVal === slot.timeVal;

                return (
                  <div
                    key={idx}
                    onClick={() => b ? setActiveSlot(isActive ? null : slot) : openBook(slot)}
                    className={`
                      group flex items-center gap-4 px-5 py-3 cursor-pointer transition-all duration-150
                      ${b ? (isOnline ? "hover:bg-amber-500/5" : "hover:bg-blue-500/5") : "hover:bg-zinc-800/30"}
                      ${isActive ? (isOnline ? "bg-amber-500/8" : "bg-blue-500/8") : ""}
                    `}
                  >
                    {/* time */}
                    <div className="w-16 shrink-0 text-right">
                      <span className="text-[11px] font-bold text-zinc-500 tabular-nums">{slot.timeLabel}</span>
                    </div>

                    {/* slot bar */}
                    <div className="flex-1">
                      {b ? (
                        /* BOOKED */
                        <div className={`
                          flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all
                          ${isOnline
                            ? "bg-amber-500/10 border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.05)]"
                            : "bg-blue-500/10 border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.05)]"
                          }
                          ${isActive ? "scale-[1.005]" : ""}
                        `}>
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isOnline ? "bg-amber-500/20" : "bg-blue-500/20"}`}>
                            {isOnline
                              ? <Trophy className="w-3.5 h-3.5 text-amber-400" />
                              : <User className="w-3.5 h-3.5 text-blue-400" />
                            }
                          </div>
                          <div className="min-w-0">
                            <p className={`text-xs font-bold truncate ${isOnline ? "text-amber-300" : "text-blue-300"}`}>
                              {isOnline
                                ? (b.user?.username || "Verified Customer")
                                : (b.customerName || "Walk-in Customer")
                              }
                            </p>
                            <p className="text-[10px] text-zinc-600 font-medium">
                              {isOnline ? "Online booking" : "Walk-in"} · {slot.timeLabel} – {slot.nextLabel}
                            </p>
                          </div>
                          <div className={`ml-auto text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${isOnline ? "bg-amber-500/15 text-amber-500" : "bg-blue-500/15 text-blue-400"}`}>
                            Booked
                          </div>
                        </div>
                      ) : (
                        /* FREE */
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-transparent group-hover:border-zinc-700/50 transition-all">
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-green-500/60 transition-colors" />
                          <span className="text-[11px] text-zinc-700 group-hover:text-zinc-400 font-medium transition-colors">Available</span>
                          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                            <Plus className="w-3 h-3" />
                            Book
                          </div>
                        </div>
                      )}
                    </div>

                    {/* end time */}
                    <div className="w-16 shrink-0">
                      <span className="text-[11px] font-bold text-zinc-700 tabular-nums">{slot.nextLabel}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── SIDEBAR ─────────────────────────────────────────────── */}
        <div className="w-64 shrink-0 space-y-4">

          {/* Occupancy card */}
          <div className="rounded-2xl border border-zinc-800/60 bg-[#0c0c0e] p-5 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-600">Day Overview</p>

            {/* donut bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-zinc-500 font-medium">
                <span>Occupancy</span>
                <span className="text-white font-bold">{occupancy}%</span>
              </div>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-700"
                  style={{ width: `${occupancy}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { label: "Total", val: slots.length, color: "text-white" },
                { label: "Booked", val: booked, color: "text-amber-400" },
                { label: "Free", val: free, color: "text-green-400" },
              ].map(({ label, val, color }) => (
                <div key={label} className="bg-zinc-900/50 rounded-xl p-2.5 text-center">
                  <p className={`text-base font-outfit-bold ${color}`}>{val}</p>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-600 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hours card */}
          <div className="rounded-2xl border border-zinc-800/60 bg-[#0c0c0e] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-600 mb-3">Hours</p>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-xs font-bold text-zinc-300">{data?.arena?.openingHours}</span>
            </div>
            <p className="text-[10px] text-zinc-700 mt-3 leading-relaxed">1-hour fixed sessions.</p>
          </div>

          {/* Booking detail panel */}
          {activeSlot && (
            <div className="rounded-2xl border bg-[#0c0c0e] p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200
              border-zinc-800/60">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-600">Booking Detail</p>
                <button onClick={() => setActiveSlot(null)} className="text-zinc-700 hover:text-zinc-400 transition-colors">
                  <XCircle className="w-4 h-4" />
                </button>
              </div>

              {/* time range */}
              <div className={`rounded-xl px-4 py-3 border ${activeSlot.booking?.matchId ? "bg-amber-500/8 border-amber-500/20" : "bg-blue-500/8 border-blue-500/20"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${activeSlot.booking?.matchId ? "bg-amber-500/20" : "bg-blue-500/20"}`}>
                    {activeSlot.booking?.matchId
                      ? <Trophy className="w-3 h-3 text-amber-400" />
                      : <User className="w-3 h-3 text-blue-400" />
                    }
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${activeSlot.booking?.matchId ? "text-amber-500" : "text-blue-400"}`}>
                    {activeSlot.booking?.matchId ? "Online Booking" : "Walk-in"}
                  </span>
                </div>
                <p className="text-sm font-bold text-white leading-tight">
                  {activeSlot.booking?.matchId
                    ? (activeSlot.booking?.user?.username || "Verified Customer")
                    : (activeSlot.booking?.customerName || "Walk-in Customer")}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-600 font-medium">Time</span>
                  <span className="text-zinc-300 font-bold">{activeSlot.timeLabel} – {activeSlot.nextLabel}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-600 font-medium">Ref</span>
                  <span className="text-zinc-500 italic">#{activeSlot.booking?.id}</span>
                </div>
              </div>

              <button
                onClick={() => handleDelete(activeSlot.booking?.id)}
                className="w-full py-2.5 rounded-xl border border-red-900/40 bg-red-500/5 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Booking
              </button>
            </div>
          )}

          {/* hint */}
          <p className="text-[10px] text-zinc-700 text-center leading-relaxed px-2">
            Click an open slot to book · Click a booked slot for details
          </p>
        </div>
      </div>

      {/* ── MANUAL BOOKING MODAL ────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-md">
          <div className="bg-[#0f0f11] border border-zinc-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

            {/* modal header */}
            <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-zinc-800/60">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-500 mb-1">Walk-in Booking</p>
                <h2 className="text-xl font-outfit-bold text-white">{targetSlot?.timeLabel} – {targetSlot?.nextLabel}</h2>
                <p className="text-xs text-zinc-600 mt-0.5">{formatFull(selectedDate)}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-zinc-900 text-zinc-500 hover:text-white transition-colors"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleManualBooking} className="px-8 py-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Customer Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aseem Rai"
                    value={bookingForm.customerName}
                    onChange={(e) => setBookingForm((p) => ({ ...p, customerName: e.target.value }))}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl pl-10 pr-4 py-3 text-sm font-medium outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all placeholder:text-zinc-700"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Price <span className="text-zinc-700 normal-case font-normal">(optional override)</span></label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 text-sm font-bold">रू</span>
                  <input
                    type="number"
                    required
                    placeholder="Base price"
                    value={bookingForm.totalPrice}
                    onChange={(e) => setBookingForm((p) => ({ ...p, totalPrice: e.target.value }))}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl pl-9 pr-4 py-3 text-sm font-medium outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all placeholder:text-zinc-700"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={modalLoading}
                className="w-full mt-2 bg-white hover:bg-zinc-100 text-black py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-40"
              >
                {modalLoading
                  ? <Loader2 className="animate-spin w-4 h-4" />
                  : <>Confirm Booking <ChevronRight className="w-3.5 h-3.5" /></>
                }
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
