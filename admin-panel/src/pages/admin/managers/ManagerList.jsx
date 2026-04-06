import React, { useState, useEffect } from "react";
import {
  Users as UsersIcon,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  ShieldCheck,
  UserPlus,
  Loader2,
  AlertCircle,
  ShieldAlert,
  Building2,
  Ban,
  Edit2,
  MapPin,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../../services/api";

export default function ManagerList() {
  const [managers, setManagers] = useState([]);
  const [arenas, setArenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [managerToEdit, setManagerToEdit] = useState(null);
  const [managerToDelete, setManagerToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchManagers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/managers");
      const managerData = response.data.data || response.data;
      setManagers(Array.isArray(managerData) ? managerData : []);
    } catch (err) {
      console.error("Error fetching managers:", err);
      setError("Failed to load managers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchArenas = async () => {
    try {
      const res = await api.get("/arenas");
      setArenas(res.data);
    } catch (err) {
      console.error("Error fetching arenas:", err);
    }
  };

  useEffect(() => {
    fetchManagers();
    fetchArenas();
  }, []);

  const handleDelete = async () => {
    if (!managerToDelete) return;

    try {
      await api.delete(`/managers/${managerToDelete.id}`);
      setManagers(managers.filter((m) => m.id !== managerToDelete.id));
      setShowDeleteModal(false);
      setManagerToDelete(null);
    } catch (err) {
      console.error("Error deleting manager:", err);
      alert("Failed to delete manager. Please try again.");
    }
  };

  const handleUpdateSuccess = (updatedManager) => {
    fetchManagers();
    setIsEditModalOpen(false);
    setManagerToEdit(null);
  };

  const filteredManagers = managers.filter(
    (m) =>
      m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-10 pb-12 relative">
      {isEditModalOpen && (
        <EditManagerModal 
          manager={managerToEdit}
          arenas={arenas}
          onClose={() => {
            setIsEditModalOpen(false);
            setManagerToEdit(null);
          }}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-outfit-bold text-white tracking-tight">
            Futsal Managers
          </h1>
          <p className="text-zinc-500 font-medium tracking-tight">
            Manage and oversee all futsal arena managers.
          </p>
        </div>

        <Link
          to="/managers/create"
          className="bg-amber-500 text-black px-6 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-transform w-full md:w-auto"
        >
          <UserPlus className="w-5 h-5 font-bold" />
          Create Manager
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-[32px] overflow-hidden shadow-2xl">
        {/* Search and Filters */}
        <div className="px-8 py-6 border-b border-zinc-900 bg-zinc-900/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-900/50 border border-zinc-800 text-white text-sm rounded-xl pl-12 pr-6 py-4 w-full focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium placeholder:text-zinc-600"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest bg-zinc-900/50 px-3 py-2 rounded-lg">
              Total Managers: {filteredManagers.length}
            </span>
          </div>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
              <p className="text-zinc-500 text-sm font-medium">
                Fetching managers data...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 px-8 text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-red-500 opacity-50" />
              <p className="text-red-400 font-medium">{error}</p>
              <button
                onClick={fetchManagers}
                className="text-amber-500 hover:text-amber-400 transition-colors font-bold text-sm underline underline-offset-4"
              >
                Try refreshing the data
              </button>
            </div>
          ) : filteredManagers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-8 text-center space-y-4">
              <UsersIcon className="w-12 h-12 text-zinc-800" />
              <p className="text-zinc-500 font-medium">
                No managers found matching your search.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-900 bg-zinc-900/10">
                  <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                    Assigned Arena
                  </th>
                  <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right pr-12">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/50">
                {filteredManagers.map((manager) => (
                  <tr
                    key={manager.id}
                    className="hover:bg-zinc-900/10 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-zinc-900 flex items-center justify-center border border-zinc-900 text-amber-500 font-outfit-bold shadow-sm">
                          {manager.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white mb-0.5">
                            {manager.name}
                          </p>
                          <p className="text-xs text-zinc-600 font-medium">
                            {manager.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-amber-500/10 rounded-lg">
                          <Building2 className="w-4 h-4 text-amber-500" />
                        </div>
                        <span className="text-sm font-semibold text-zinc-400">
                          {manager.futsal_name ||
                            manager.futsal_id ||
                            "Unassigned"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right pr-10">
                      <div className="flex items-center justify-end gap-3 transition-all">
                        <button
                          onClick={() => {
                            setManagerToEdit(manager);
                            setIsEditModalOpen(true);
                          }}
                          className="h-10 w-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center hover:bg-blue-500/10 hover:text-blue-500 text-zinc-500 transition-all shadow-lg"
                        >
                          <Edit2 className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => {
                            setManagerToDelete(manager);
                            setShowDeleteModal(true);
                          }}
                          className="h-10 w-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 text-zinc-500 transition-all shadow-lg"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="px-8 py-6 border-t border-zinc-900 flex items-center justify-between text-zinc-600 text-xs font-bold uppercase tracking-widest bg-zinc-900/5">
            <span>Platform Security Audit Log: Enabled</span>
            <div className="flex items-center gap-4">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>Admin Controlled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-950 border border-zinc-900 w-full max-w-md rounded-[40px] p-10 space-y-8 shadow-2xl animate-in zoom-in-95">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-20 w-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
                <Trash2 className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-2xl font-outfit-bold text-white">
                  Delete Manager?
                </h2>
                <p className="text-zinc-500 text-sm mt-1">
                  This action is permanent and will delete{" "}
                  <b>{managerToDelete?.name}</b>'s account and all associated
                  data.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleDelete}
                className="w-full bg-red-500 hover:bg-red-400 text-white font-bold py-4 rounded-2xl transition-colors shadow-lg shadow-red-500/20"
              >
                Delete Permanently
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-4 rounded-2xl transition-colors border border-zinc-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EditManagerModal({ manager, arenas, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: manager?.name || "",
    email: manager?.email || "",
    futsal_id: manager?.futsal_id || manager?.arenaId || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.put(`/managers/${manager.id}`, formData);
      onSuccess(response.data.data);
    } catch (err) {
      console.error("Error updating manager:", err);
      setError(err.response?.data?.message || "Failed to update manager details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="bg-zinc-950 border border-zinc-900 w-full max-w-md rounded-[40px] p-10 relative shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-outfit-bold text-white tracking-tight">Edit Manager</h2>
            <p className="text-xs text-zinc-500 font-medium">Update profile for {manager?.name}</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <XCircle className="w-7 h-7" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-medium">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Full Name</label>
            <input
              required
              type="text"
              placeholder="Full Name"
              className="bg-zinc-900/50 border border-zinc-800 text-white rounded-2xl px-6 py-4 w-full focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Email Address</label>
            <input
              required
              type="email"
              placeholder="manager@futsal.com"
              className="bg-zinc-900/50 border border-zinc-800 text-white rounded-2xl px-6 py-4 w-full focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Assigned Futsal Arena</label>
            <div className="relative">
               <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
               <select
                 required
                 className="bg-zinc-900/50 border border-zinc-800 text-white rounded-2xl pl-14 pr-6 py-4 w-full focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium appearance-none cursor-pointer"
                 value={formData.futsal_id}
                 onChange={(e) => setFormData({ ...formData, futsal_id: e.target.value })}
               >
                 <option value="" disabled>Choose an arena...</option>
                 {arenas.map((arena) => (
                   <option key={arena.id} value={arena.id}>
                     {arena.name}
                   </option>
                 ))}
               </select>
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-white text-black py-5 rounded-[24px] font-outfit-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl"
            >
              {loading ? "Saving Changes..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-zinc-900 text-white py-4 rounded-[20px] font-bold text-sm border border-zinc-800 hover:bg-zinc-800 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
