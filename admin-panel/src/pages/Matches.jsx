import React, { useEffect, useState } from "react";
import api from "../services/api";
import { 
  Trophy, 
  Trash2, 
  Calendar, 
  Clock, 
  Users as UsersIcon,
  Search,
  Loader2,
  AlertCircle,
  Tag
} from "lucide-react";

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await api.get("/matches");
        setMatches(response.data);
      } catch (err) {
        console.error("Error fetching matches:", err);
        setError("Failed to load matches data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
      <span className="text-zinc-500 font-medium">Loading matches...</span>
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-outfit-bold text-white tracking-tight">Match Management</h1>
          <p className="text-zinc-500 font-medium">Monitor all hosted matches and participants.</p>
        </div>
        
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search match ID..." 
            className="bg-zinc-950 border border-zinc-900 text-white text-sm rounded-2xl pl-12 pr-6 py-4 w-full focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[32px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-900">
                <th className="px-8 py-6 text-xs font-bold text-zinc-500 uppercase tracking-widest">Host / Venue</th>
                <th className="px-8 py-6 text-xs font-bold text-zinc-500 uppercase tracking-widest">Schedule</th>
                <th className="px-8 py-6 text-xs font-bold text-zinc-500 uppercase tracking-widest">Capacity</th>
                <th className="px-8 py-6 text-xs font-bold text-zinc-500 uppercase tracking-widest">Status / Price</th>
                <th className="px-8 py-6 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/50">
              {matches.map((match) => (
                <tr key={match.id} className="hover:bg-zinc-900/20 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-zinc-900 flex items-center justify-center p-3 border border-zinc-800">
                        <Trophy className="w-full h-full text-zinc-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white mb-1">{match.host?.username || 'Host'}</p>
                        <p className="text-xs text-zinc-500 font-medium">{match.arena?.name || 'Venue'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-zinc-100 font-medium">
                        <Calendar className="w-4 h-4 text-amber-500" />
                        {new Date(match.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                        <Clock className="w-4 h-4 text-zinc-700" />
                        {match.time}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-[100px] h-2 bg-zinc-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-500 transition-all duration-500" 
                          style={{ width: `${(match.currentPlayers / (match.maxPlayers || 10)) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-white">{match.currentPlayers}/{match.maxPlayers}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-2 items-start">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${match.status === 'open' ? 'text-green-500 bg-green-500/10' : 'text-zinc-500 bg-zinc-900'}`}>
                        {match.status}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400">
                        <Tag className="w-3.5 h-3.5" />
                        NPR {match.price || '500'}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="h-10 w-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 transition-all group-hover:scale-110">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {matches.length === 0 && !error && (
            <div className="p-20 text-center flex flex-col items-center gap-4">
              <Activity className="w-12 h-12 text-zinc-800 mb-2" />
              <p className="text-zinc-600 font-medium">No matches available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
