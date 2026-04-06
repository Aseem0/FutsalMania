import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { 
  Trophy, 
  Plus, 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign,
  TrendingUp,
  Search,
  MoreVertical,
  X,
  Loader2,
  Trash2,
  Edit
} from "lucide-react";

export default function Tournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tournaments");
      setTournaments(res.data);
    } catch (err) {
      console.error("Error fetching tournaments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tournament? This action cannot be undone.")) {
      return;
    }

    try {
      await api.delete(`/tournaments/${id}`);
      setTournaments(tournaments.filter(t => t.id !== id));
    } catch (err) {
      console.error("Error deleting tournament:", err);
      alert("Failed to delete tournament. Please try again.");
    }
  };

  const filteredTournaments = tournaments.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.arena?.name || t.location || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-zinc-950 p-8 rounded-[32px] border border-zinc-900 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-amber-500/10 rounded-lg">
                <Trophy className="w-5 h-5 text-amber-500" />
             </div>
             <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Competition Hub</span>
          </div>
          <h1 className="text-4xl font-outfit-bold text-white tracking-tight leading-tight">Tournament Management</h1>
          <p className="text-zinc-500 mt-2 font-medium">Host official events, manage prize pools, and track registrations.</p>
        </div>
        <button 
          onClick={() => navigate("/tournaments/create")}
          className="relative z-10 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-black px-8 py-4 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-5 h-5" />
          Host New Tournament
        </button>
        <Trophy className="absolute -right-10 -bottom-10 w-64 h-64 text-white/[0.02] -rotate-12" />
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-4 bg-zinc-950 p-2 rounded-2xl border border-zinc-900 sticky top-4 z-20 shadow-xl shadow-black/40">
         <div className="flex-1 flex items-center gap-3 px-4">
            <Search className="w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Filter by name or venue..."
              className="bg-transparent border-none text-sm focus:ring-0 text-white w-full placeholder:text-zinc-600 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-zinc-500 text-sm font-medium">Syncing tournaments from server...</p>
        </div>
      ) : filteredTournaments.length === 0 ? (
        <div className="bg-zinc-950/50 border border-zinc-900/50 rounded-[48px] p-24 text-center italic">
           <Trophy className="w-16 h-16 text-zinc-800/40 mx-auto mb-6" />
           <p className="text-zinc-600 font-medium tracking-tight text-lg">No tournaments found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament) => (
            <div key={tournament.id} className="group bg-zinc-950 border border-zinc-900 rounded-[32px] overflow-hidden hover:border-zinc-800 transition-all duration-500 shadow-lg hover:shadow-amber-500/5">
              <div className="p-1">
                 <div className="w-full h-40 rounded-[22px] overflow-hidden relative">
                    <img 
                      src={tournament.image || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop"} 
                      alt={tournament.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-end justify-between">
                       <span className="bg-amber-500 text-black text-[8px] font-black uppercase px-2 py-0.5 rounded-md tracking-widest shadow-lg shadow-amber-500/20">LIVE</span>
                       <div className="bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-lg">
                          <p className="text-white text-[9px] font-black tracking-tight">Rs. {tournament.entryFee} Entry</p>
                       </div>
                    </div>
                 </div>
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <h3 className="text-base font-outfit-bold text-white tracking-tight leading-none truncate">{tournament.name}</h3>
                    <div className="flex flex-col gap-1.5 pt-2">
                       <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-amber-500/60" />
                          <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-tight">
                            {new Date(tournament.date).toLocaleDateString()}
                          </span>
                       </div>
                       <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-amber-500/60" />
                          <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-tight truncate max-w-full">
                            {tournament.arena?.name || tournament.location || 'Location TBD'}
                          </span>
                       </div>
                    </div>
                  </div>
                  <div className="bg-zinc-900/50 px-2.5 py-2 rounded-lg border border-zinc-900 group-hover:border-zinc-800 transition-colors shrink-0 text-right shadow-sm shadow-black/20">
                     <p className="text-amber-500 text-sm font-outfit-bold leading-none tracking-tight">Rs. {tournament.prizePool}</p>
                     <p className="text-[7px] text-zinc-600 font-black uppercase tracking-widest mt-1">Prize pool</p>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-zinc-900 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="flex -space-x-1.5">
                         {[1,2,3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-950 flex items-center justify-center text-[8px] text-white/40 font-black shadow-inner">
                               T{i}
                            </div>
                         ))}
                      </div>
                      <div>
                         <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest block">Teams Joined</span>
                         <span className="text-[10px] text-white font-bold tracking-tight leading-none">7 / {tournament.maxTeams}</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => navigate(`/tournaments/edit/${tournament.id}`)}
                        className="h-10 w-10 flex items-center justify-center text-zinc-600 hover:text-amber-500 hover:bg-amber-500/10 rounded-xl transition-all border border-transparent hover:border-amber-500/20 active:scale-95 group/edit"
                      >
                         <Edit className="w-4 h-4 group-hover/edit:scale-110 transition-transform" />
                      </button>
                      <button 
                        onClick={() => handleDelete(tournament.id)}
                        className="h-10 w-10 flex items-center justify-center text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20 active:scale-95 group/del"
                      >
                         <Trash2 className="w-4 h-4 group-hover/del:scale-110 transition-transform" />
                      </button>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
