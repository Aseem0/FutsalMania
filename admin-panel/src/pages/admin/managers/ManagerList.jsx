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
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../../services/api";

export default function ManagerList() {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

  useEffect(() => {
    fetchManagers();
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

  const toggleStatus = async (manager) => {
    const newStatus = manager.status === "active" ? "disabled" : "active";
    try {
      await api.patch(`/managers/${manager.id}`, { status: newStatus });
      setManagers(
        managers.map((m) =>
          m.id === manager.id ? { ...m, status: newStatus } : m,
        ),
      );
    } catch (err) {
      console.error("Error toggling manager status:", err);
      alert("Failed to update status.");
    }
  };

  const filteredManagers = managers.filter(
    (m) =>
      m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-10 pb-12">
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
                    Manager Details
                  </th>
                  <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                    Assigned Arena
                  </th>
                  <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest text-center">
                    Status
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
                    <td className="px-8 py-6 text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-900/50 bg-zinc-900/30">
                        {manager.status === "active" ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Ban className="w-4 h-4 text-red-500" />
                        )}
                        <span
                          className={
                            manager.status === "active"
                              ? "text-green-500 text-xs font-bold uppercase"
                              : "text-red-500 text-xs font-bold uppercase"
                          }
                        >
                          {manager.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right pr-10">
                      <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        <button
                          onClick={() => toggleStatus(manager)}
                          title={
                            manager.status === "active"
                              ? "Disable Manager"
                              : "Activate Manager"
                          }
                          className="h-10 w-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center hover:bg-amber-500/10 hover:text-amber-500 text-zinc-500 transition-all"
                        >
                          <Ban className="w-4.5 h-4.5" />
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
            <span>Platform Security Audit Log: Enbaled</span>
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
