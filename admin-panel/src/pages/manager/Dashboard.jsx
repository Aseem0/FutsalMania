import React, { useState, useEffect } from "react";
import { LayoutDashboard, Calendar, Users, Trophy, Settings, Bell, Search, User, MapPin, Clock, Activity, ArrowRight, CheckCircle2, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function ManagerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const manager = JSON.parse(localStorage.getItem('adminUser')) || { username: 'Manager' };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/manager/arena");
        setData(response.data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Activity className="animate-spin text-amber-500 w-8 h-8" /></div>;
  if (error) return <div className="p-8 text-red-500 bg-red-500/10 border border-red-500/20 rounded-2xl">{error}</div>;

  const { arena, stats } = data;

  return (
    <div className="space-y-10 pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 bg-amber-500 rounded-xl flex items-center justify-center text-black shadow-lg shadow-amber-500/20">
                <Trophy className="w-5 h-5" />
             </div>
             <h1 className="text-4xl font-outfit-bold text-white tracking-tight">Arena Console</h1>
          </div>
          <p className="text-zinc-500 font-medium tracking-tight">
            Welcome back, <span className="text-white font-bold">{manager.username}</span>. Currently managing <span className="text-zinc-300 font-bold underline decoration-amber-500 underline-offset-4">{arena.name}</span>.
          </p>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">System Health</span>
              <div className="flex items-center gap-2">
                 <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-sm font-bold text-green-500 uppercase tracking-widest">Stable</span>
              </div>
           </div>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-950 border border-zinc-900 rounded-[32px] p-8 space-y-6 hover:border-zinc-800 transition-all shadow-xl group">
           <div className="flex items-center justify-between">
              <div className="p-3 bg-zinc-900 rounded-2xl text-amber-500">
                 <LayoutDashboard className="w-6 h-6" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
           </div>
           <div>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Total Bookings</p>
              <h3 className="text-4xl font-outfit-bold text-white">{stats.totalBookings}</h3>
           </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 rounded-[32px] p-8 space-y-6 hover:border-zinc-800 transition-all shadow-xl group">
           <div className="flex items-center justify-between">
              <div className="p-3 bg-zinc-900 rounded-2xl text-blue-500">
                 <Calendar className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-3 py-1 rounded-lg">Pending: {stats.pendingBookings}</span>
           </div>
           <div>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Active Arena Status</p>
              <h3 className="text-4xl font-outfit-bold text-white uppercase tracking-tighter">Live</h3>
           </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 rounded-[32px] p-8 space-y-6 hover:border-zinc-800 transition-all shadow-xl group">
           <div className="flex items-center justify-between">
              <div className="p-3 bg-zinc-900 rounded-2xl text-green-500">
                 <Activity className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1 rounded-lg">+12% vs LY</span>
           </div>
           <div>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Total Revenue (NPR)</p>
              <h3 className="text-4xl font-outfit-bold text-white">रू {stats.revenue.toLocaleString()}</h3>
           </div>
        </div>
      </div>

      {/* Module Quick Nav */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="space-y-6">
            <h2 className="text-xl font-outfit-bold text-white flex items-center gap-3">
               <Settings className="w-5 h-5 text-zinc-500" />
               Management Modules
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/manager/bookings" className="bg-zinc-950 border border-zinc-900 rounded-[2rem] p-6 hover:border-amber-500/30 transition-all group shadow-lg">
                <div className="h-12 w-12 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6 text-amber-500" />
                </div>
                <h4 className="text-base font-bold text-white mb-1">Manage Bookings</h4>
                <p className="text-zinc-500 text-xs font-medium leading-relaxed mb-4 line-clamp-2">
                  Confirm pending reservations and manage match cancellations.
                </p>
                <div className="flex items-center gap-2 text-amber-500 text-[10px] font-bold uppercase tracking-widest">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              <Link to="/manager/schedule" className="bg-zinc-950 border border-zinc-900 rounded-[2rem] p-6 hover:border-blue-500/30 transition-all group shadow-lg">
                <div className="h-12 w-12 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6 text-blue-500" />
                </div>
                <h4 className="text-base font-bold text-white mb-1">Time Slots</h4>
                <p className="text-zinc-500 text-xs font-medium leading-relaxed mb-4 line-clamp-2">
                  Adjust availability and pricing for your arena schedule.
                </p>
                <div className="flex items-center gap-2 text-blue-500 text-[10px] font-bold uppercase tracking-widest">
                  Configure <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            </div>
         </div>

         {/* Recently Booked / Feed Placeholder */}
         <div className="bg-zinc-950 border border-zinc-900 rounded-[40px] p-10 flex flex-col items-center justify-center text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-500" />
            <div className="h-20 w-20 bg-zinc-900 rounded-3xl flex items-center justify-center mb-2">
               <MapPin className="w-10 h-10 text-amber-500" />
            </div>
            <div>
               <h3 className="text-2xl font-outfit-bold text-white">Need to update Arena Info?</h3>
               <p className="text-zinc-500 max-w-sm mx-auto text-sm font-medium mt-2">
                  Keep your arena details up to date to attract more players. Check your overview module for current listings.
               </p>
            </div>
            <Link 
              to="/manager/arena"
              className="bg-zinc-900 border border-zinc-800 text-white font-bold px-8 py-4 rounded-2xl hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all"
            >
              Go to Arena Overview
            </Link>
         </div>
      </div>

      {/* Global Activity Disclaimer */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-[32px] p-8 flex items-start gap-6 shadow-xl max-w-4xl">
        <div className="bg-green-500/10 p-3 rounded-2xl">
          <CheckCircle2 className="w-6 h-6 text-green-500" />
        </div>
        <div>
          <h4 className="text-green-500 font-outfit-bold text-lg mb-1">Verified Management Session</h4>
          <p className="text-zinc-600 text-xs font-semibold tracking-widest uppercase mb-2">Secure Portal Active</p>
          <p className="text-zinc-500 text-sm font-medium leading-relaxed">
            Your management session is fully isolated. No global administrative actions are permitted on this dashboard. All activity is logged per manager ID for platform security audit.
          </p>
        </div>
      </div>
    </div>
  );
}
