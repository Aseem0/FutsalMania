import React from "react";
import { 
  Users as UsersIcon, 
  Trash2, 
  Search,
  CheckCircle,
  XCircle,
  MoreVertical,
  ShieldAlert,
  ShieldCheck,
  UserPlus
} from "lucide-react";

export default function Users() {
  const mockUsers = [
    { id: 1, username: "Ram Bahadur", email: "ram@example.com", role: "admin", status: "active", joined: "2026-01-15" },
    { id: 2, username: "Shyam Thapa", email: "shyam@example.com", role: "user", status: "active", joined: "2026-02-10" },
    { id: 3, username: "Gita Rai", email: "gita@example.com", role: "user", status: "suspended", joined: "2026-03-05" },
    { id: 4, username: "Sita Gurung", email: "sita@example.com", role: "user", status: "active", joined: "2026-03-20" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-outfit-bold text-white tracking-tight">User Management</h1>
          <p className="text-zinc-500 font-medium">Manage and audit all player and admin accounts.</p>
        </div>
        
        <button className="bg-amber-500 text-black px-6 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-transform w-full md:w-auto">
          <UserPlus className="w-5 h-5" />
          Create User
        </button>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[32px] overflow-hidden">
        <div className="px-8 py-6 border-b border-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="bg-zinc-900/50 border border-zinc-800 text-white text-sm rounded-xl pl-12 pr-6 py-3 w-full focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest mr-2">Filter:</span>
            <select className="bg-zinc-900 border border-zinc-800 text-white text-xs rounded-xl px-4 py-2 focus:ring-1 focus:ring-amber-500 outline-none transition-all">
              <option>All Roles</option>
              <option>Admin</option>
              <option>User</option>
            </select>
            <select className="bg-zinc-900 border border-zinc-800 text-white text-xs rounded-xl px-4 py-2 focus:ring-1 focus:ring-amber-500 outline-none transition-all">
              <option>Any Status</option>
              <option>Active</option>
              <option>Suspended</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-900 bg-zinc-900/10">
                <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">User Details</th>
                <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">Role</th>
                <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">Joined On</th>
                <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/50">
              {mockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-900/20 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 text-zinc-500 font-bold">
                        {user.username.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white mb-0.5">{user.username}</p>
                        <p className="text-xs text-zinc-600 font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm">
                    <div className="flex items-center gap-2">
                      {user.role === 'admin' ? (
                        <ShieldCheck className="w-4 h-4 text-amber-500" />
                      ) : (
                        <UsersIcon className="w-4 h-4 text-zinc-500" />
                      )}
                      <span className={user.role === 'admin' ? 'text-amber-500 font-bold' : 'text-zinc-500'}>
                        {user.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       {user.status === 'active' ? (
                         <CheckCircle className="w-4 h-4 text-green-500" />
                       ) : (
                         <XCircle className="w-4 h-4 text-red-500" />
                       )}
                       <span className={user.status === 'active' ? 'text-green-500 font-medium' : 'text-red-500 font-medium'}>
                         {user.status}
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-zinc-600 font-medium font-inter">
                    {user.joined}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="h-9 w-9 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center hover:bg-zinc-800 text-zinc-500 transition-all">
                        <ShieldAlert className="w-4 h-4" />
                      </button>
                      <button className="h-9 w-9 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-8 py-6 border-t border-zinc-900 flex items-center justify-between text-zinc-500 text-xs font-bold uppercase tracking-widest">
            <span>Showing 1-4 of 128 users</span>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-zinc-900 rounded-lg hover:text-white transition-colors disabled:opacity-30" disabled>Previous</button>
              <button className="px-4 py-2 bg-zinc-900 rounded-lg hover:text-white transition-colors">Next</button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-6 flex items-start gap-4">
        <ShieldAlert className="w-6 h-6 text-amber-500 mt-1" />
        <div>
          <h4 className="text-amber-500 font-bold mb-1">Developer Note</h4>
          <p className="text-zinc-500 text-sm font-medium leading-relaxed">
            The data above is currently mocked. To make this functional, a <code className="text-amber-400">GET /api/users</code> endpoint needs to be implemented in the backend that supports Admin-only requests.
          </p>
        </div>
      </div>
    </div>
  );
}
