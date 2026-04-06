import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  Users,
  MapPin,
  Trophy,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Calendar,
} from "lucide-react";

const StatsCard = ({ title, value, icon: Icon, trend, color }) => (
  <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl shadow-sm hover:border-zinc-800 transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-4 rounded-2xl ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace("bg-", "text-")}`} />
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
      <span className="text-3xl font-outfit-bold text-white mt-1 tracking-tight">
        {value}
      </span>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    grounds: 0,
    matches: 0,
    tournaments: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [arenasRes, matchesRes, tournamentsRes, usersRes] =
          await Promise.all([
            api.get("/arenas"),
            api.get("/matches"),
            api.get("/tournaments"),
            api.get("/users/count").catch(() => ({ data: { count: 0 } })),
          ]);

        setStats({
          users: usersRes.data.count,
          grounds: arenasRes.data.length,
          matches: matchesRes.data.length,
          tournaments: tournamentsRes.data.length,
        });

        // Get the 5 most recent matches for the activity feed
        setRecentActivities(matchesRes.data.slice(0, 5));
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
        <h1 className="text-4xl font-outfit-bold text-white tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-zinc-500 font-medium">
          Welcome back, Admin. Here's what's happening today.
        </p>
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

      <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-outfit-bold text-white flex items-center gap-3">
            <Activity className="w-5 h-5 text-amber-500" />
            Recent Activity
          </h3>
          <button className="text-sm text-amber-500 font-medium hover:underline">
            View all
          </button>
        </div>

        <div className="space-y-6">
          {recentActivities.length > 0 ? (
            recentActivities.map((match) => (
              <div key={match.id} className="flex items-center gap-4 group">
                <div className="h-12 w-12 rounded-2xl bg-zinc-900 flex items-center justify-center p-3 border border-zinc-800 transition-colors group-hover:border-zinc-700">
                  <Calendar className="w-full h-full text-zinc-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">
                    New Match Hosted by {match.host?.username || "Unknown"}
                  </p>
                  <p className="text-xs text-zinc-600 mt-1 font-medium">
                    {formatRelativeTime(match.createdAt)} • Venue {match.arena?.name || "Unknown"}
                  </p>
                </div>
                <div className="text-xs font-bold text-zinc-700 bg-zinc-900/50 px-2 py-1 rounded-lg">
                  {match.format.toUpperCase()} Match
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-zinc-500 font-medium">
              No recent match activity found.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
