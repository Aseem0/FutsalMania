import React, { useEffect, useState } from "react";
import api from "../services/api";
import { 
  MapPin, 
  Trash2, 
  Plus, 
  Search,
  ChevronRight,
  Loader2,
  AlertCircle
} from "lucide-react";

export default function Grounds() {
  const [arenas, setArenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArenas = async () => {
      try {
        const response = await api.get("/arenas");
        setArenas(response.data);
      } catch (err) {
        console.error("Error fetching arenas:", err);
        setError("Failed to load grounds data.");
      } finally {
        setLoading(false);
      }
    };

    fetchArenas();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
      <span className="text-zinc-500 font-medium">Loading arenas...</span>
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-outfit-bold text-white tracking-tight">Manage Grounds</h1>
          <p className="text-zinc-500 font-medium">View and manage all available futsal arenas.</p>
        </div>
        
        <button className="bg-amber-500 text-black px-6 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-transform w-full md:w-auto">
          <Plus className="w-5 h-5" />
          Add New Ground
        </button>
      </div>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 flex flex-col items-center gap-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <p className="text-red-400 font-medium">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {arenas.map((arena) => (
            <div key={arena.id} className="bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden hover:border-zinc-800 transition-all duration-300 group">
              <div className="h-48 bg-zinc-900 flex items-center justify-center relative">
                {arena.image ? (
                  <img src={arena.image} alt={arena.name} className="w-full h-full object-cover" />
                ) : (
                  <MapPin className="w-12 h-12 text-zinc-700" />
                )}
                <div className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center bg-black/60 backdrop-blur-md rounded-xl text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-outfit-bold text-white tracking-tight">{arena.name}</h3>
                    <div className="flex items-center gap-2 text-zinc-500 text-sm mt-1 font-medium">
                      <MapPin className="w-4 h-4 text-amber-500" />
                      {arena.location}
                    </div>
                  </div>
                  <button className="text-zinc-700 hover:text-red-500 transition-colors p-2 bg-zinc-900 rounded-xl hover:bg-red-500/10">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-900">
                    <span className="text-[10px] uppercase font-bold text-zinc-600 tracking-wider block mb-1">Price / Hour</span>
                    <span className="text-lg font-outfit-bold text-white">NPR {arena.price || '2500'}</span>
                  </div>
                  <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-900">
                    <span className="text-[10px] uppercase font-bold text-zinc-600 tracking-wider block mb-1">Status</span>
                    <span className="text-lg font-outfit-bold text-green-500">Active</span>
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
