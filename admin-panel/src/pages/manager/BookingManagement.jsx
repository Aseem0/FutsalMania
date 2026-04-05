import React, { useState, useEffect } from "react";
import { Search, Filter, Calendar, Clock, CheckCircle2, XCircle, MoreVertical, Loader2, User, UserCheck, AlertCircle } from "lucide-react";
import api from "../../services/api";

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get("/manager/bookings", { params: { status: filter !== "all" ? filter : undefined } });
      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/manager/bookings/${id}`, { status });
      setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
      // Re-fetch to be safe on filters
      fetchBookings();
    } catch (err) {
      console.error("Error updating booking status:", err);
      alert("Failed to update status.");
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.id.toString().includes(searchQuery)
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-outfit-bold text-white tracking-tight">Booking Management</h1>
          <p className="text-zinc-500 font-medium tracking-tight">Manage all reservations and confirm upcoming matches.</p>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[32px] overflow-hidden shadow-2xl">
        {/* Filters */}
        <div className="px-8 py-6 border-b border-zinc-900 bg-zinc-900/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search by customer name or ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-900/50 border border-zinc-800 text-white text-sm rounded-xl pl-12 pr-6 py-4 w-full focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium placeholder:text-zinc-600 outline-none"
            />
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
             {["all", "pending", "confirmed", "completed", "cancelled"].map((status) => (
               <button 
                 key={status}
                 onClick={() => setFilter(status)}
                 className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${filter === status ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-zinc-900 text-zinc-500 hover:text-white border border-zinc-800'}`}
               >
                 {status}
               </button>
             ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
              <p className="text-zinc-500 text-sm font-medium">Fetching bookings list...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 px-8 text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-red-500 opacity-50" />
              <p className="text-red-400 font-medium">{error}</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-8 text-center space-y-4">
              <Calendar className="w-12 h-12 text-zinc-800" />
              <p className="text-zinc-500 font-medium">No bookings found matching your request.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-900 bg-zinc-900/10">
                  <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">Customer</th>
                  <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">Date & Time</th>
                  <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest text-center">Status</th>
                  <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right pr-12">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/50">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-zinc-900/10 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-zinc-900 flex items-center justify-center border border-zinc-900 text-zinc-500">
                           <User className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white mb-0.5">{booking.user?.username}</p>
                          <p className="text-xs text-zinc-600 font-medium tracking-tight">ID: #{booking.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-zinc-300 font-bold text-sm mb-1">
                          <Calendar className="w-4 h-4 text-amber-500" />
                          {booking.date}
                        </div>
                        <div className="flex items-center gap-2 text-zinc-500 font-medium text-xs">
                          <Clock className="w-3.5 h-3.5" />
                          {booking.startTime} - {booking.endTime}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-white tracking-widest">रू {booking.totalPrice}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-900/50 bg-zinc-900/30 text-xs font-bold uppercase tracking-widest
                        ${booking.status === 'pending' ? 'text-amber-500' : ''}
                        ${booking.status === 'confirmed' ? 'text-green-500' : ''}
                        ${booking.status === 'completed' ? 'text-blue-500' : ''}
                        ${booking.status === 'cancelled' ? 'text-red-500' : ''}
                       `}>
                          {booking.status === 'confirmed' && <UserCheck className="w-3.5 h-3.5" />}
                          {booking.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                          {booking.status}
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right pr-12">
                       <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {booking.status === 'pending' && (
                            <button 
                              onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                              className="h-10 w-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center hover:bg-green-500/10 hover:text-green-500 text-zinc-500 transition-all shadow-lg"
                              title="Confirm Booking"
                            >
                              <CheckCircle2 className="w-5 h-5" />
                            </button>
                          )}
                          {(booking.status === 'pending' || booking.status === 'confirmed') && (
                            <button 
                              onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                              className="h-10 w-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 text-zinc-500 transition-all shadow-lg"
                              title="Cancel Booking"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          )}
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
