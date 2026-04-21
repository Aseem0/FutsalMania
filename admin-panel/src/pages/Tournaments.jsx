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
  Edit,
  Eye,
  Phone,
  User as UserIcon
} from "lucide-react";
import { fetchTournamentRegistrations, deleteTournamentRegistration } from "../services/api";

export default function Tournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [fetchingRegistrations, setFetchingRegistrations] = useState(false);
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

  const handleViewRegistrations = async (tournament) => {
    try {
      setSelectedTournament(tournament);
      setFetchingRegistrations(true);
      const res = await fetchTournamentRegistrations(tournament.id);
      setRegistrations(res.data);
    } catch (err) {
      console.error("Error fetching registrations:", err);
      alert("Failed to load registrations");
    } finally {
      setFetchingRegistrations(false);
    }
  };

  const handleDeleteRegistration = async (registrationId) => {
    if (!window.confirm("Are you sure you want to remove this team?")) return;

    try {
      await deleteTournamentRegistration(registrationId);
      
      // Update modal list
      setRegistrations(registrations.filter(r => r.id !== registrationId));
      
      // Update main list count
      setTournaments(tournaments.map(t => {
        if (t.id === selectedTournament.id) {
          return { ...t, registeredTeams: (t.registeredTeams || 1) - 1 };
        }
        return t;
      }));
    } catch (err) {
      console.error("Error removing registration:", err);
      alert("Failed to remove team");
    }
  };

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
                         <span className="text-[10px] text-white font-bold tracking-tight leading-none">
                            {tournament.registeredTeams || 0} / {tournament.maxTeams}
                         </span>
                      </div>
                   </div>
                    <div className="flex items-center gap-1.5">
                       <button 
                         onClick={() => handleViewRegistrations(tournament)}
                         className="h-10 w-10 flex items-center justify-center text-zinc-600 hover:text-amber-500 hover:bg-amber-500/10 rounded-xl transition-all border border-transparent hover:border-amber-500/20 active:scale-95 group/view"
                         title="View Registrations"
                       >
                          <Eye className="w-4 h-4 group-hover/view:scale-110 transition-transform" />
                       </button>
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

      {/* Registration Modal */}
      {selectedTournament && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedTournament(null)} />
          <div className="relative bg-zinc-950 border border-zinc-900 w-full max-w-2xl max-h-[85vh] rounded-[40px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-zinc-900 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-outfit-bold text-white tracking-tight">{selectedTournament.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <p className="text-zinc-500 text-sm font-medium">Registration List • {registrations.length} Teams Registered</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedTournament(null)}
                className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {fetchingRegistrations ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                  <p className="text-zinc-500 text-sm font-medium">Fetching team details...</p>
                </div>
              ) : registrations.length === 0 ? (
                <div className="text-center py-20 bg-zinc-900/10 rounded-[32px] border border-dashed border-zinc-800">
                  <Users className="w-12 h-12 text-zinc-900 mx-auto mb-4" />
                  <p className="text-zinc-600 font-medium">No teams have registered for this tournament yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {registrations.map((reg) => (
                    <div key={reg.id} className="bg-zinc-900/30 border border-zinc-900 rounded-[28px] p-6 hover:border-zinc-800 transition-all duration-300 group/reg">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] text-amber-500 font-black uppercase tracking-widest px-2 py-0.5 bg-amber-500/10 rounded-md">Team Entry</span>
                            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight">#{reg.id}</span>
                          </div>
                          <h4 className="text-xl font-outfit-bold text-white tracking-tight group-hover/reg:text-amber-500 transition-colors">{reg.teamName}</h4>
                          <div className="flex flex-wrap items-center gap-4 pt-3">
                             <div className="flex items-center gap-2 text-zinc-500 bg-black/30 px-3 py-1.5 rounded-xl border border-zinc-900">
                                <Phone className="w-3.5 h-3.5 text-amber-500/50" />
                                <span className="text-xs font-semibold tracking-tight">{reg.contactNumber}</span>
                             </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <div className="bg-amber-500/5 px-5 py-3 rounded-[20px] border border-amber-500/10 text-right min-w-[120px]">
                           <p className="text-[8px] text-amber-500/60 font-black uppercase tracking-widest leading-none mb-1.5">Registered On</p>
                           <p className="text-white text-[13px] font-bold tracking-tight">{new Date(reg.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</p>
                          </div>
                          <button 
                            onClick={() => handleDeleteRegistration(reg.id)}
                            className="p-3 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl border border-transparent hover:border-red-500/20 transition-all active:scale-95"
                            title="Remove Team"
                          >
                             <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      
                      {reg.playersList && (
                        <div className="mt-6 pt-6 border-t border-zinc-900/50">
                           <div className="flex items-center gap-2 mb-4">
                              <Users className="w-3.5 h-3.5 text-zinc-600" />
                              <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">Confirmed Player Roster</p>
                           </div>
                           <div className="flex flex-wrap gap-2">
                              {reg.playersList.split(',').map((player, idx) => (
                                <div key={idx} className="bg-zinc-950 px-4 py-2 rounded-xl border border-zinc-900 hover:border-zinc-800 transition-colors">
                                   <span className="text-xs text-zinc-400 font-medium tracking-tight">{player.trim()}</span>
                                </div>
                              ))}
                           </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
