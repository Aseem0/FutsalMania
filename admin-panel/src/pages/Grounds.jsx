import React, { useEffect, useState } from "react";
import api from "../services/api";
import { 
  MapPin, 
  Trash2, 
  Plus, 
  Search,
  ChevronRight,
  Loader2,
  AlertCircle,
  Edit2,
  X,
  Star,
  Banknote
} from "lucide-react";

export default function Grounds() {
  const [arenas, setArenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArena, setSelectedArena] = useState(null);

  const fetchArenas = async () => {
    try {
      setLoading(true);
      const response = await api.get("/arenas");
      setArenas(response.data);
    } catch (err) {
      console.error("Error fetching arenas:", err);
      setError("Failed to load grounds data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArenas();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;
    
    try {
      await api.delete(`/arenas/${id}`);
      setArenas(arenas.filter(a => a.id !== id));
    } catch (err) {
      console.error("Error deleting arena:", err);
      alert("Failed to delete arena.");
    }
  };

  const handleOpenModal = (arena = null) => {
    setSelectedArena(arena);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedArena(null);
    setIsModalOpen(false);
  };

  if (loading && arenas.length === 0) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
      <span className="text-zinc-500 font-medium tracking-tight">Loading arenas...</span>
    </div>
  );

  return (
    <div className="space-y-10 relative pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-outfit-bold text-white tracking-tight">Manage Futsal Arenas</h1>
          <p className="text-zinc-500 font-medium">View and manage all available futsal arenas.</p>
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          className="bg-amber-500 text-black px-6 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-transform w-full md:w-auto active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add New Futsal
        </button>
      </div>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 flex flex-col items-center gap-4 text-center">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <p className="text-red-400 font-medium">{error}</p>
          <button onClick={fetchArenas} className="text-amber-500 underline text-sm font-bold">Try Again</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {arenas.map((arena) => (
            <div key={arena.id} className="bg-zinc-950 border border-zinc-900 rounded-[28px] overflow-hidden hover:border-zinc-800 transition-all duration-500 group shadow-lg hover:shadow-amber-500/5">
              <div className="h-44 bg-zinc-900 flex items-center justify-center relative overflow-hidden">
                {arena.image ? (
                  <img 
                    src={arena.image} 
                    alt={arena.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
                  />
                ) : (
                  <MapPin className="w-10 h-10 text-zinc-700" />
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                   <div className="h-8 w-8 flex items-center justify-center bg-black/60 backdrop-blur-md rounded-lg text-amber-500 border border-white/10 font-bold text-[10px] uppercase tracking-tighter">
                     {arena.rating || '4.5'}
                   </div>
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-0.5">
                    <h3 className="text-lg font-outfit-bold text-white tracking-tight leading-tight">{arena.name}</h3>
                    <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-medium">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      {arena.location}
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button 
                      onClick={() => handleOpenModal(arena)}
                      className="text-zinc-500 hover:text-blue-500 transition-all p-2 bg-zinc-900 rounded-xl hover:bg-blue-500/10 border border-zinc-800 shadow-sm"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(arena.id, arena.name)}
                      className="text-zinc-500 hover:text-red-500 transition-all p-2 bg-zinc-900 rounded-xl hover:bg-red-500/10 border border-zinc-800 shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-5">
                  <div className="bg-zinc-900/40 p-4 rounded-2xl border border-zinc-900/50 backdrop-blur-sm group-hover:border-zinc-800 transition-colors flex items-center justify-between">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-zinc-600 tracking-widest block mb-1">Price / Hour</span>
                      <span className="text-lg font-outfit-bold text-white">NPR {arena.price || '0'}</span>
                    </div>
                    <div className="p-3 bg-amber-500/10 rounded-xl">
                      <Banknote className="w-5 h-5 text-amber-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <ArenaModal 
          arena={selectedArena} 
          onClose={handleCloseModal} 
          onSuccess={() => {
            fetchArenas();
            handleCloseModal();
          }} 
        />
      )}
    </div>
  );
}

function ArenaModal({ arena, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: arena?.name || "",
    location: arena?.location || "",
    image: arena?.image || "",
    rating: arena?.rating || "",
    price: arena?.price || ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (arena) {
        await api.put(`/arenas/${arena.id}`, formData);
      } else {
        await api.post("/arenas", formData);
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving arena:", err);
      alert("Failed to save ground details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="bg-zinc-950 border border-zinc-900 w-full max-w-lg rounded-[48px] p-10 relative shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-outfit-bold text-white tracking-tight">
              {arena ? "Update Ground" : "Add New Ground"}
            </h2>
            <p className="text-zinc-500 text-sm mt-1 font-medium italic">Configure arena details carefully.</p>
          </div>
          <button onClick={onClose} className="p-3 bg-zinc-900 rounded-2xl hover:bg-zinc-800 transition-colors text-zinc-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 col-span-2">
              <label className="text-xs font-bold text-zinc-600 uppercase tracking-widest px-1">Arena Name</label>
              <input
                required
                className="bg-zinc-900/50 border border-zinc-800 text-white rounded-[20px] px-6 py-4 w-full focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2 col-span-2">
              <label className="text-xs font-bold text-zinc-600 uppercase tracking-widest px-1">Location Address</label>
              <div className="relative">
                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                <input
                  required
                  className="bg-zinc-900/50 border border-zinc-800 text-white rounded-[20px] pl-14 pr-6 py-4 w-full focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-600 uppercase tracking-widest px-1">Rating</label>
              <div className="relative">
                <Star className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                <input
                  type="number"
                  step="0.1"
                  max="5"
                  className="bg-zinc-900/50 border border-zinc-800 text-white rounded-[20px] pl-14 pr-6 py-4 w-full focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-600 uppercase tracking-widest px-1">Price per Hour</label>
              <div className="relative">
                <Banknote className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                <input
                  type="number"
                  className="bg-zinc-900/50 border border-zinc-800 text-white rounded-[20px] pl-14 pr-6 py-4 w-full focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2 col-span-2">
              <label className="text-xs font-bold text-zinc-600 uppercase tracking-widest px-1">Image URL</label>
              <input
                className="bg-zinc-900/50 border border-zinc-800 text-white rounded-[20px] px-6 py-4 w-full focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium"
                
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-black py-5 rounded-[24px] font-outfit-bold text-xl transition-all shadow-xl shadow-amber-500/20 mt-4 disabled:opacity-50 active:scale-95 flex items-center justify-center gap-3"
          >
            {loading && <Loader2 className="w-6 h-6 animate-spin" />}
            {arena ? "Save Changes" : "Create Arena"}
          </button>
        </form>
      </div>
    </div>
  );
}
