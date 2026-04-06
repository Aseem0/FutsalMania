import React, { useState, useEffect } from "react";
import api from "../services/api";
import { 
  CalendarCheck, 
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  TrendingDown,
  ChevronRight,
  ShieldAlert
} from "lucide-react";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/bookings");
        // Handle both array and { data: [] } response shapes
        const data = Array.isArray(response.data) ? response.data : response.data?.data ?? [];
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        const msg = err.response?.data?.message || err.message || "Failed to load bookings.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const totalRevenue = bookings.reduce((sum, b) => {
    if (b.status === 'confirmed' || b.status === 'completed') {
      return sum + parseFloat(b.totalPrice || 0);
    }
    return sum;
  }, 0);

  const avgValue = bookings.length > 0 ? (totalRevenue / bookings.length).toFixed(0) : 0;

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-outfit-bold text-white tracking-tight">Booking History</h1>
          <p className="text-zinc-500 font-medium">Analyze and manage all transactions and reservations.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Booking ID..." 
              className="bg-zinc-950 border border-zinc-900 text-white text-sm rounded-xl pl-12 pr-6 py-4 w-full focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium"
            />
          </div>
          <button className="bg-zinc-900 border border-zinc-800 text-zinc-400 p-4 rounded-xl hover:text-white transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-950 border border-zinc-900 px-8 py-6 rounded-3xl group transition-all hover:bg-zinc-900/50">
          <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest block mb-1 font-inter">Total Revenue</span>
          <div className="flex items-end gap-3 translate-y-1">
             <span className="text-4xl font-outfit-bold text-white tracking-tight">NPR {totalRevenue.toLocaleString()}</span>
             <span className="text-green-500 text-xs font-bold bg-green-500/10 px-2 py-1 rounded-lg flex items-center mb-1">
               LIVE
             </span>
          </div>
        </div>
        <div className="bg-zinc-950 border border-zinc-900 px-8 py-6 rounded-3xl group transition-all hover:bg-zinc-900/50">
          <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest block mb-1 font-inter">Avg Ticket Value</span>
          <div className="flex items-end gap-3 translate-y-1">
             <span className="text-4xl font-outfit-bold text-white tracking-tight">NPR {parseFloat(avgValue).toLocaleString()}</span>
             <span className="text-amber-500 text-xs font-bold bg-amber-500/10 px-2 py-1 rounded-lg flex items-center mb-1">
               Overall
             </span>
          </div>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[32px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-900 bg-zinc-900/10">
                <th className="px-8 py-6 text-xs font-bold text-zinc-500 uppercase tracking-widest">Transaction ID</th>
                <th className="px-8 py-6 text-xs font-bold text-zinc-500 uppercase tracking-widest">Customer / Venue</th>
                <th className="px-8 py-6 text-xs font-bold text-zinc-500 uppercase tracking-widest">Schedule</th>
                <th className="px-8 py-6 text-xs font-bold text-zinc-500 uppercase tracking-widest">Total NPR</th>
                <th className="px-8 py-6 text-xs font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/50">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-zinc-900/20 transition-colors group">
                    <td className="px-8 py-6 text-sm font-bold text-white font-inter tracking-tight">
                      BK-{booking.id.toString().padStart(5, '0')}
                    </td>
                    <td className="px-8 py-6">
                      <div>
                        <p className="text-sm font-bold text-white mb-0.5">{booking.user?.username || 'Guest'}</p>
                        <p className="text-xs text-zinc-600 font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {booking.arena?.name || 'Unknown Venue'}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs text-zinc-100 font-bold">
                          {booking.date}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          {booking.startTime} - {booking.endTime}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-outfit-bold text-white">
                      {parseFloat(booking.totalPrice).toLocaleString()}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        {booking.status === 'confirmed' || booking.status === 'completed' ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Clock className="w-4 h-4 text-amber-500" />
                        )}
                        <span className={
                          (booking.status === 'confirmed' || booking.status === 'completed') 
                            ? 'text-green-500 font-medium text-xs uppercase tracking-widest font-bold' 
                            : 'text-amber-500 font-medium text-xs uppercase tracking-widest font-bold'
                        }>
                          {booking.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="h-9 w-9 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center hover:bg-amber-500 hover:text-black transition-all group-hover:scale-110">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-8 py-12 text-center font-medium">
                    {loading ? (
                      <span className="text-zinc-500">Loading bookings...</span>
                    ) : error ? (
                      <span className="text-red-400">⚠ {error}</span>
                    ) : (
                      <span className="text-zinc-500">No booking history found.</span>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
