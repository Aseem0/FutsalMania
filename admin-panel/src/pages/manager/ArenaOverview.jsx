import React, { useState, useEffect } from "react";
import { MapPin, Clock, Info, ShieldCheck, Star, Activity, X } from "lucide-react";
import api, { updateManagerArena } from "../../services/api";

export default function ArenaOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: "",
    image: "",
    openingHours: "",
    infrastructure: ""
  });

  const fetchArena = async () => {
    try {
      setLoading(true);
      const response = await api.get("/manager/arena");
      setData(response.data);
      // Initialize form data
      setFormData({
        name: response.data.arena.name || "",
        location: response.data.arena.location || "",
        price: response.data.arena.price || "",
        image: response.data.arena.image || "",
        openingHours: response.data.arena.openingHours || "",
        infrastructure: response.data.arena.infrastructure || ""
      });
    } catch (err) {
      console.error("Error fetching arena overview:", err);
      setError("Failed to load arena details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArena();
  }, []);

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      await updateManagerArena(formData);
      await fetchArena(); // Refresh data
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Error updating arena info:", err);
      alert("Failed to update arena information.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Activity className="animate-spin text-amber-500 w-8 h-8" /></div>;
  if (error) return <div className="p-8 text-red-500 bg-red-500/10 border border-red-500/20 rounded-2xl">{error}</div>;

  const { arena, stats } = data;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-outfit-bold text-white tracking-tight">Arena Overview</h1>
        <p className="text-zinc-500 font-medium tracking-tight">Manage and view your assigned futsal arena details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-zinc-950 border border-zinc-900 rounded-[32px] overflow-hidden shadow-2xl">
            <div className="aspect-video w-full bg-zinc-900 relative">
              {arena.image ? (
                <img src={arena.image} alt={arena.name} className="w-full h-full object-cover opacity-60" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-800">
                  <MapPin className="w-20 h-20" />
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-zinc-950 to-transparent">
                <div className="flex items-center gap-3 mb-2">
                  <div className="px-3 py-1 bg-amber-500 text-black text-[10px] font-bold uppercase tracking-widest rounded-full">
                    {arena.rating} Stars
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < Math.floor(arena.rating) ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                </div>
                <h2 className="text-4xl font-outfit-bold text-white">{arena.name}</h2>
              </div>
            </div>

            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-zinc-900 rounded-2xl text-amber-500">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Location</p>
                    <p className="text-zinc-300 font-medium leading-relaxed">{arena.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-zinc-900 rounded-2xl text-blue-500">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Operating Hours</p>
                    <p className="text-zinc-300 font-medium">{arena.openingHours || "06:00 AM – 10:00 PM"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-zinc-900 rounded-2xl text-green-500">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Status</p>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${arena.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                      <p className={`${arena.status === 'active' ? 'text-green-500' : 'text-red-500'} font-bold uppercase tracking-widest text-xs`}>
                        {arena.status === 'active' ? 'Active & Verified' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-zinc-900 rounded-2xl text-purple-500">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Infrastructure</p>
                    <p className="text-zinc-400 text-sm font-medium">{arena.infrastructure || "Turf Pitch, LED Lighting, Changing Rooms, Parking"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <div className="bg-zinc-950 border border-zinc-900 rounded-[32px] p-8 space-y-6 shadow-xl">
             <h3 className="text-lg font-outfit-bold text-white border-b border-zinc-900 pb-4">Performance Summary</h3>
             
             <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Revenue (NPR)</span>
                    <span className="text-xl font-outfit-bold text-amber-500">रू {stats.revenue.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[70%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Total Bookings</span>
                    <span className="text-xl font-outfit-bold text-white">{stats.totalBookings}</span>
                  </div>
                  <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[45%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Pending Confirmation</span>
                    <span className="text-xl font-outfit-bold text-red-500">{stats.pendingBookings}</span>
                  </div>
                  <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 w-[20%]" />
                  </div>
                </div>
             </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-[32px] p-8">
            <h4 className="text-amber-500 font-bold mb-2">Quick Action</h4>
            <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-4">
              Need to update your arena's operational hours or pitch details? Update them instantly below.
            </p>
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="w-full bg-amber-500 text-black py-3 rounded-2xl font-bold text-sm shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-colors"
            >
              Update Info
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
          <div className="relative bg-zinc-950 border border-zinc-900 rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/50 backdrop-blur-xl">
              <div>
                <h2 className="text-2xl font-outfit-bold text-white tracking-tight">Update Arena Info</h2>
                <p className="text-zinc-500 text-sm font-medium">Modify basic details about your arena.</p>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 bg-zinc-900 rounded-xl text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateInfo} className="p-8 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Arena Name</label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="Enter arena name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Location</label>
                  <input 
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="City, State"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Price per Hour (NPR)</label>
                  <input 
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="e.g. 1500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Operating Hours</label>
                  <input 
                    type="text"
                    value={formData.openingHours}
                    onChange={(e) => setFormData({...formData, openingHours: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="e.g. 06:00 AM – 10:00 PM"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Infrastructure Details</label>
                <textarea 
                  value={formData.infrastructure}
                  onChange={(e) => setFormData({...formData, infrastructure: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors min-h-[100px]"
                  placeholder="e.g. Turf Pitch, LED Lighting, Changing Rooms, Parking"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Image URL</label>
                <input 
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 bg-zinc-900 text-white py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all border border-zinc-800"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isUpdating}
                  className="flex-[2] bg-amber-500 text-black py-4 rounded-2xl font-bold shadow-lg shadow-amber-500/20 hover:bg-amber-400 disabled:opacity-50 transition-all"
                >
                  {isUpdating ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
