import React, { useEffect, useState } from "react";
import api from "../services/api";
import { 
  Users, 
  MapPin, 
  Trophy, 
  TrendingUp, 
  Activity,
  ArrowUpRight,
  Calendar
} from "lucide-react";

const StatsCard = ({ title, value, icon: Icon, trend, color }) => (
  <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl shadow-sm hover:border-zinc-800 transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-4 rounded-2xl ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      {trend && (
        <span className="flex items-center text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">
          <ArrowUpRight className="w-3 h-3 mr-1" />
          {trend}
        </span>
      )}
    </div>
    <div className="flex flex-col">
      <span className="text-zinc-500 text-sm font-medium">{title}</span>
      <span className="text-3xl font-outfit-bold text-white mt-1 tracking-tight">{value}</span>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    grounds: 0,
    matches: 0,
    tournaments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [arenasRes, matchesRes, tournamentsRes] = await Promise.all([
          api.get("/arenas"),
          api.get("/matches"),
          api.get("/tournaments")
        ]);
        
        setStats({
          users: "128+", // Placeholder since no GET /users exists
          grounds: arenasRes.data.length,
          matches: matchesRes.data.length,
          tournaments: tournamentsRes.data.length
        });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-outfit-bold text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-zinc-500 font-medium">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Users" 
          value={stats.users} 
          icon={Users} 
          trend="+12%" 
          color="bg-blue-500" 
        />
        <StatsCard 
          title="Active Grounds" 
          value={stats.grounds} 
          icon={MapPin} 
          trend="+2" 
          color="bg-amber-500" 
        />
        <StatsCard 
          title="Open Matches" 
          value={stats.matches} 
          icon={Trophy} 
          trend="+14" 
          color="bg-green-500" 
        />
        <StatsCard 
          title="Tournaments" 
          value={stats.tournaments} 
          icon={TrendingUp} 
          trend="+1" 
          color="bg-purple-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-outfit-bold text-white flex items-center gap-3">
              <Activity className="w-5 h-5 text-amber-500" />
              Recent Activity
            </h3>
            <button className="text-sm text-amber-500 font-medium hover:underline">View all</button>
          </div>
          
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="h-12 w-12 rounded-2xl bg-zinc-900 flex items-center justify-center p-3 border border-zinc-800 transition-colors group-hover:border-zinc-700">
                  <Calendar className="w-full h-full text-zinc-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">New Match Hosted at Arena {i}</p>
                  <p className="text-xs text-zinc-600 mt-1 font-medium">35 minutes ago • Venue Arena X</p>
                </div>
                <div className="text-xs font-bold text-zinc-700 bg-zinc-900/50 px-2 py-1 rounded-lg">#MATCH-202{i}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-8 relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-2xl font-outfit-bold text-black mb-4">Admin Quick Links</h3>
            <p className="text-black/70 text-sm mb-8 font-medium italic">Manage your futsal network efficiently. Quick access to critical tools.</p>
            <div className="space-y-3">
              <button className="w-full bg-black text-white py-4 rounded-2xl font-bold text-sm hover:scale-[1.02] transition-transform">Create Tournament</button>
              <button className="w-full bg-white text-black py-4 rounded-2xl font-bold text-sm hover:scale-[1.02] transition-transform shadow-lg">Manage Arenas</button>
            </div>
          </div>
          <Activity className="absolute -right-8 -bottom-8 w-40 h-40 text-black/5 rotate-12 transition-transform group-hover:scale-110" />
        </div>
      </div>
    </div>
  );
}
