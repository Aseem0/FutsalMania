import React, { useState, useEffect } from "react";
import { MapPin, Clock, Info, ShieldCheck, Star, Activity } from "lucide-react";
import api from "../../services/api";

export default function ArenaOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArena = async () => {
      try {
        const response = await api.get("/manager/arena");
        setData(response.data);
      } catch (err) {
        console.error("Error fetching arena overview:", err);
        setError("Failed to load arena details.");
      } finally {
        setLoading(false);
      }
    };
    fetchArena();
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Activity className="animate-spin text-amber-500 w-8 h-8" /></div>;
  if (error) return <div className="p-8 text-red-500 bg-red-500/10 border border-red-500/20 rounded-2xl">{error}</div>;

  const { arena, stats } = data;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-outfit-bold text-white tracking-tight">Arena Overview</h1>
        <p className="text-zinc-500 font-medium tracking-tight">Manage and view your assigned futsal arena details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-zinc-950 border border-zinc-900 rounded-[32px] overflow-hidden shadow-2xl">
            <div className="aspect-video w-full bg-zinc-900 relative">
              {arena.image ? (
                <img src={arena.image} alt={arena.name} className="w-full h-full object-cover opacity-60" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-800">
                  <MapPin className="w-20 h-20" />
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-zinc-950 to-transparent">
                <div className="flex items-center gap-3 mb-2">
                  <div className="px-3 py-1 bg-amber-500 text-black text-[10px] font-bold uppercase tracking-widest rounded-full">
                    {arena.rating} Stars
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < Math.floor(arena.rating) ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                </div>
                <h2 className="text-4xl font-outfit-bold text-white">{arena.name}</h2>
              </div>
            </div>

            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-zinc-900 rounded-2xl text-amber-500">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Location</p>
                    <p className="text-zinc-300 font-medium leading-relaxed">{arena.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-zinc-900 rounded-2xl text-blue-500">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Operating Hours</p>
                    <p className="text-zinc-300 font-medium">06:00 AM - 10:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-zinc-900 rounded-2xl text-green-500">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Status</p>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                      <p className="text-green-500 font-bold uppercase tracking-widest text-xs">Active & Verified</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-zinc-900 rounded-2xl text-purple-500">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Infrastructure</p>
                    <p className="text-zinc-400 text-sm font-medium">Turf Pitch, LED Lighting, Changing Rooms, Parking</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <div className="bg-zinc-950 border border-zinc-900 rounded-[32px] p-8 space-y-6 shadow-xl">
             <h3 className="text-lg font-outfit-bold text-white border-b border-zinc-900 pb-4">Performance Summary</h3>
             
             <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Revenue (NPR)</span>
                    <span className="text-xl font-outfit-bold text-amber-500">रू {stats.revenue.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[70%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Total Bookings</span>
                    <span className="text-xl font-outfit-bold text-white">{stats.totalBookings}</span>
                  </div>
                  <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[45%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Pending Confirmation</span>
                    <span className="text-xl font-outfit-bold text-red-500">{stats.pendingBookings}</span>
                  </div>
                  <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 w-[20%]" />
                  </div>
                </div>
             </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-[32px] p-8">
            <h4 className="text-amber-500 font-bold mb-2">Quick Action</h4>
            <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-4">
              Need to update your arena's operational hours or pitch details? Contact support for changes.
            </p>
            <button className="w-full bg-amber-500 text-black py-3 rounded-2xl font-bold text-sm shadow-lg shadow-amber-500/20">
              Update Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
