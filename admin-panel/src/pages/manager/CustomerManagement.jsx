import React, { useState, useEffect } from "react";
import { User, Users, Search, Mail, MessageSquare, ExternalLink, Loader2, AlertCircle, Calendar } from "lucide-react";
import api from "../../services/api";

export default function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/manager/customers");
      setCustomers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError("Failed to load customer list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.username?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-outfit-bold text-white tracking-tight">Customer Management</h1>
          <p className="text-zinc-500 font-medium tracking-tight">View and manage players who have made reservations at your arena.</p>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[32px] overflow-hidden shadow-2xl">
        {/* Search */}
        <div className="px-8 py-6 border-b border-zinc-900 bg-zinc-900/10 flex items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search by customer name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-900/50 border border-zinc-800 text-white text-sm rounded-xl pl-12 pr-6 py-4 w-full focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
             <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest bg-zinc-900/50 px-3 py-2 rounded-lg">Unique Customers: {filteredCustomers.length}</span>
          </div>
        </div>

        {/* Grid or Table */}
        <div className="p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
              <p className="text-zinc-500 text-sm font-medium">Loading customer directory...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 px-8 text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-red-500 opacity-50" />
              <p className="text-red-400 font-medium">{error}</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-8 text-center space-y-4">
              <Users className="w-12 h-12 text-zinc-800" />
              <p className="text-zinc-500 font-medium">No customers found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCustomers.map((customer) => (
                <div key={customer.id} className="bg-zinc-900/30 border border-zinc-900 rounded-[2rem] p-6 hover:border-amber-500/20 transition-all group">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden">
                        {customer.profilePicture ? (
                           <img src={customer.profilePicture} alt={customer.username} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-8 h-8 text-zinc-700" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-lg font-outfit-bold text-white tracking-tight">{customer.username}</h4>
                        <p className="text-xs text-zinc-500 font-medium tracking-tight">Customer since 2026</p>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="flex items-center gap-3 text-zinc-400 text-sm">
                         <Mail className="w-4 h-4 text-amber-500" />
                         <span className="truncate">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-zinc-400 text-sm">
                         <Calendar className="w-4 h-4 text-blue-500" />
                         <span>Multiple bookings recorded</span>
                      </div>
                   </div>

                   <div className="mt-8 flex items-center gap-2">
                       <button className="flex-1 bg-zinc-900 border border-zinc-800 text-white py-3 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-amber-500/10 hover:text-amber-500 hover:border-amber-500/20 transition-all">
                          <MessageSquare className="w-4 h-4" />
                          Chat
                       </button>
                       <button className="h-12 w-12 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-2xl flex items-center justify-center hover:bg-zinc-800 transition-all">
                          <ExternalLink className="w-4 h-4" />
                       </button>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
