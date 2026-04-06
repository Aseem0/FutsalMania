import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Trophy, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Image as ImageIcon,
  Type
} from "lucide-react";
import api from "../../../services/api";

export default function CreateTournament() {
  const [arenas, setArenas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingArenas, setFetchingArenas] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    arenaId: "",
    entryFee: "",
    prizePool: "",
    maxTeams: "16",
    image: ""
  });

  React.useEffect(() => {
    const fetchArenas = async () => {
      try {
        const res = await api.get("/arenas");
        setArenas(res.data);
      } catch (err) {
        console.error("Error fetching arenas:", err);
      } finally {
        setFetchingArenas(false);
      }
    };
    fetchArenas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || success) return;
    setLoading(true);
    setError("");
    try {
      await api.post("/tournaments", formData);
      setSuccess(true);
      setTimeout(() => {
        navigate("/tournaments");
      }, 2000);
    } catch (err) {
      console.error("Error creating tournament:", err);
      const message =
        err.response?.data?.message ||
        "Failed to create tournament. Please check your details and try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <Link
          to="/tournaments"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors w-fit text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tournaments
        </Link>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500 rounded-2xl shadow-lg shadow-amber-500/20">
            <Trophy className="w-8 h-8 text-black" />
          </div>
          <div>
            <h1 className="text-4xl font-outfit-bold text-white tracking-tight">
              Host New Tournament
            </h1>
            <p className="text-zinc-500 font-medium mt-1">
              Configure competition details and reach out to thousands.
            </p>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <p className="text-sm text-red-400 font-medium leading-relaxed">
            {error}
          </p>
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
          <p className="text-sm text-green-400 font-medium leading-relaxed">
            Tournament launched successfully! Redirecting to tournament list...
          </p>
        </div>
      )}

      {/* Form Container */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-[32px] p-10 shadow-2xl relative overflow-hidden">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tournament Name */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Type className="w-3.5 h-3.5" /> Tournament Name
              </label>
              <input 
                required
                type="text" 
                className="w-full bg-zinc-900/50 border border-zinc-900 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium placeholder:text-zinc-700"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            {/* Event Date */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" /> Event Date
              </label>
              <input 
                required
                type="date"
                className="w-full bg-zinc-900/50 border border-zinc-900 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium appearance-none"
                style={{ colorScheme: 'dark' }}
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>

            {/* Venue Location (Dropdown) */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> Futsal Arena
              </label>
              <div className="relative">
                <select 
                  required
                  className="w-full bg-zinc-900/50 border border-zinc-900 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium appearance-none cursor-pointer"
                  value={formData.arenaId}
                  onChange={(e) => setFormData({...formData, arenaId: e.target.value})}
                  disabled={fetchingArenas}
                >
                  <option value="" disabled>Select an Arena</option>
                  {arenas.map(arena => (
                    <option key={arena.id} value={arena.id}>{arena.name}</option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                  {fetchingArenas ? (
                    <div className="w-4 h-4 border-2 border-zinc-700 border-t-amber-500 rounded-full animate-spin"></div>
                  ) : (
                    <MapPin className="w-4 h-4" />
                  )}
                </div>
              </div>
            </div>

            {/* Max Teams */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Users className="w-3.5 h-3.5" /> Max Teams
              </label>
              <select 
                className="w-full bg-zinc-900/50 border border-zinc-900 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium cursor-pointer appearance-none"
                value={formData.maxTeams}
                onChange={(e) => setFormData({...formData, maxTeams: e.target.value})}
              >
                <option value="8">8 Teams</option>
                <option value="16">16 Teams</option>
                <option value="32">32 Teams</option>
              </select>
            </div>

            {/* Entry Fee */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <DollarSign className="w-3.5 h-3.5" /> Entry Fee (NPR)
              </label>
              <input 
                required
                type="number" 
                className="w-full bg-zinc-900/50 border border-zinc-900 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium placeholder:text-zinc-700"
                value={formData.entryFee}
                onChange={(e) => setFormData({...formData, entryFee: e.target.value})}
              />
            </div>

            {/* Prize Pool */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Trophy className="w-3.5 h-3.5" /> Prize Pool (NPR)
              </label>
              <input 
                required
                type="number" 
                className="w-full bg-zinc-900/50 border border-zinc-900 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium placeholder:text-zinc-700"
                value={formData.prizePool}
                onChange={(e) => setFormData({...formData, prizePool: e.target.value})}
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
              <ImageIcon className="w-3.5 h-3.5" /> Image URL (Optional)
            </label>
            <input 
              type="url" 
              className="w-full bg-zinc-900/50 border border-zinc-900 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium placeholder:text-zinc-700"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
            />
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5" /> Description
            </label>
            <textarea 
              rows={4}
              className="w-full bg-zinc-900/50 border border-zinc-900 rounded-3xl px-6 py-4 text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium resize-none placeholder:text-zinc-700"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-zinc-900 flex items-center gap-4">
            <button 
              disabled={loading}
              type="submit"
              className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black py-4 rounded-2xl font-bold transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <Trophy className="w-5 h-5 fill-current" />
                  Launch Tournament
                </>
              )}
            </button>
            <button
               type="button"
               onClick={() => navigate("/tournaments")}
               className="px-8 py-4 bg-zinc-900 border border-zinc-900 rounded-2xl text-white font-bold hover:bg-zinc-800 transition-all"
            >
               Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
