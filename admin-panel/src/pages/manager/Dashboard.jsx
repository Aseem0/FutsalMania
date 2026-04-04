import React from "react";
import { LayoutDashboard, Calendar, Users, Trophy, Settings, Bell, Search, User } from "lucide-react";

export default function ManagerDashboard() {
  const manager = JSON.parse(localStorage.getItem('adminUser')) || { username: 'Manager' };

  return (
    <div className="space-y-10 pb-12">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-outfit-bold text-white tracking-tight">Manager Dashboard</h1>
          <p className="text-zinc-500 font-medium mt-1">Welcome back, {manager.username}. Manage your futsal arena stats here.</p>
        </div>
        <div className="flex items-center gap-4">
           <button className="h-12 w-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-white transition-all shadow-lg">
             <Bell className="w-5 h-5" />
           </button>
           <button className="h-12 w-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-white transition-all shadow-lg">
             <Settings className="w-5 h-5" />
           </button>
        </div>
      </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Today's Bookings", value: "12", change: "+15%", icon: Calendar, color: "text-amber-500" },
          { label: "Total Matches", value: "84", change: "+8%", icon: Trophy, color: "text-blue-500" },
          { label: "Active Players", value: "450", change: "+24%", icon: Users, color: "text-green-500" },
          { label: "Revenue (NPR)", value: "45,000", change: "+12%", icon: LayoutDashboard, color: "text-purple-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-950 border border-zinc-900 rounded-[32px] p-8 space-y-4 hover:border-zinc-800 transition-all group">
            <div className="flex items-center justify-between">
              <div className={`p-3 bg-zinc-900 rounded-2xl ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">{stat.change}</span>
            </div>
            <div>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-3xl font-outfit-bold text-white mt-1 group-hover:scale-105 transition-transform origin-left">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Info Placeholder */}
      <div className="bg-amber-500/5 border border-amber-500/10 rounded-[32px] p-12 text-center space-y-4">
        <div className="bg-amber-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <LayoutDashboard className="w-10 h-10 text-amber-500" />
        </div>
        <h2 className="text-2xl font-outfit-bold text-white">Advanced Arena Management</h2>
        <p className="text-zinc-500 max-w-xl mx-auto font-medium">
          The arena management suite is currently under development. You will soon be able to manage slot bookings, player check-ins, and match reporting from this panel.
        </p>
        <button className="bg-amber-500 text-black px-8 py-4 rounded-2xl font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-amber-500/20 mt-4">
           Coming Soon
        </button>
      </div>
    </div>
  );
}
