import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  Users as UsersIcon,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  MoreVertical,
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  Loader2,
  MapPin
} from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("Any Status");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${username}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
      alert("User deleted successfully.");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert(err.response?.data?.message || "Failed to delete user.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Reset to first page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status is hardcoded as 'active' for now as backend doesn't have status field yet
    const matchesStatus = 
      statusFilter === "Any Status" || 
      "active" === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-10 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-outfit-bold text-white tracking-tight">
            User Management
          </h1>
          <p className="text-zinc-500 font-medium">
            Manage and audit all player accounts across the platform.
          </p>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[32px] overflow-hidden">
        <div className="px-8 py-6 border-b border-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="bg-zinc-900/50 border border-zinc-800 text-white text-sm rounded-xl pl-12 pr-6 py-3 w-full focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest mr-2">
              Filter:
            </span>
            <select 
              className="bg-zinc-900 border border-zinc-800 text-white text-xs rounded-xl px-4 py-2 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>Any Status</option>
              <option>Active</option>
              <option>Suspended</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto text-inter">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
              <p className="text-zinc-500 text-sm font-medium italic">Fetching player list...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-900 bg-zinc-900/10">
                  <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                    Player Details
                  </th>
                  <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/50">
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-8 py-20 text-center text-zinc-600 italic">
                      No players found matching your current filters.
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-zinc-900/20 transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 text-zinc-500 font-bold uppercase overflow-hidden">
                            {user.profilePicture ? (
                              <img src={user.profilePicture} className="w-full h-full object-cover" />
                            ) : (
                              user.username.charAt(0)
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white mb-0.5">
                              {user.username}
                            </p>
                            <p className="text-xs text-zinc-600 font-medium font-inter">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                           <CheckCircle className="w-4 h-4 text-green-500" />
                           <span className="text-green-500 font-medium capitalize">
                             Active
                           </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="h-9 w-9 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center hover:bg-zinc-800 text-zinc-500 transition-all">
                            <ShieldAlert className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id, user.username)}
                            className="h-9 w-9 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
           <div className="px-8 py-6 border-t border-zinc-900 flex items-center justify-between text-zinc-500 text-xs font-bold uppercase tracking-widest">
            <span>
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
            </span>
            <div className="flex items-center gap-2">
              <button
                className="px-4 py-2 bg-zinc-900 rounded-lg hover:text-white transition-colors disabled:opacity-30 disabled:hover:text-zinc-500"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button 
                className="px-4 py-2 bg-zinc-900 rounded-lg hover:text-white transition-colors disabled:opacity-30 disabled:hover:text-zinc-500"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper for conditional classes
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
