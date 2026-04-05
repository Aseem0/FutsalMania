import React, { useState, useEffect } from "react";
import { Clock, Calendar, CheckCircle2, XCircle, Edit, Save, Loader2, Info, Building2, AlertTriangle, Activity } from "lucide-react";
import api from "../../services/api";

export default function ScheduleManagement() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ isAvailable: true, price: 0 });

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const response = await api.get("/manager/schedule");
      setSchedule(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching schedule:", err);
      setError("Failed to load schedule.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const handleEdit = (slot) => {
    setEditingId(slot.id);
    setEditForm({ isAvailable: slot.isAvailable, price: slot.price });
  };

  const handleSave = async (id) => {
    try {
      await api.patch(`/manager/schedule/${id}`, editForm);
      setSchedule(schedule.map(s => s.id === id ? { ...s, ...editForm } : s));
      setEditingId(null);
    } catch (err) {
      console.error("Error updating slot:", err);
      alert("Failed to update slot.");
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Activity className="animate-spin text-amber-500 w-8 h-8" /></div>;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-outfit-bold text-white tracking-tight">Schedule Management</h1>
          <p className="text-zinc-500 font-medium tracking-tight">Define available time slots and dynamic pricing for your arena.</p>
        </div>
      </div>

      <div className="bg-amber-500/5 border border-amber-500/10 rounded-[32px] p-8 flex items-start gap-6 max-w-4xl shadow-xl">
        <div className="bg-amber-500/10 p-4 rounded-2xl">
          <Info className="w-8 h-8 text-amber-500" />
        </div>
        <div>
          <h4 className="text-amber-500 font-outfit-bold text-lg mb-2">Slot Management Notice</h4>
          <p className="text-zinc-500 text-sm font-medium leading-relaxed">
            Changing a slot's availability will prevent future bookings for that specific time. Existing confirmed bookings will remain unaffected. Ensure to update pricing during peak hours for maximum revenue.
          </p>
        </div>
      </div>

      {schedule.length === 0 ? (
        <div className="bg-zinc-950 border border-zinc-900 rounded-[32px] p-16 text-center space-y-4">
          <Building2 className="w-12 h-12 text-zinc-900 mx-auto" />
          <p className="text-zinc-500 font-medium">No schedule slots defined for this arena yet. Contact admin to initialize slots.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {schedule.map((slot) => (
             <div key={slot.id} className={`bg-zinc-950 border ${slot.isAvailable ? 'border-zinc-900' : 'border-red-500/10'} rounded-[32px] p-8 space-y-6 hover:border-amber-500/20 transition-all shadow-xl relative group`}>
               {!slot.isAvailable && <div className="absolute top-4 right-4 text-red-500"><AlertTriangle className="w-4 h-4" /></div>}
               
               <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${slot.isAvailable ? 'bg-zinc-900 text-amber-500' : 'bg-red-500/10 text-red-500'}`}>
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">{slot.dayOfWeek}</p>
                    <p className="text-sm font-outfit-bold text-white tracking-widest">{slot.startTime} - {slot.endTime}</p>
                  </div>
               </div>

               <div className="space-y-4 pt-2">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500 font-medium tracking-tight">Base Price</span>
                    {editingId === slot.id ? (
                      <input 
                        type="number"
                        value={editForm.price}
                        onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                        className="w-24 bg-zinc-900 border border-zinc-800 text-white rounded-lg px-2 py-1 text-right focus:ring-1 focus:ring-amber-500 outline-none"
                      />
                    ) : (
                      <span className="text-white font-outfit-bold tracking-widest">रू {slot.price}</span>
                    )}
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500 font-medium tracking-tight">Availability</span>
                    {editingId === slot.id ? (
                      <button 
                        onClick={() => setEditForm(prev => ({ ...prev, isAvailable: !prev.isAvailable }))}
                        className={`text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-widest ${editForm.isAvailable ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}
                      >
                        {editForm.isAvailable ? 'Available' : 'Closed'}
                      </button>
                    ) : (
                       <span className={`text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-widest ${slot.isAvailable ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {slot.isAvailable ? 'Available' : 'Closed'}
                       </span>
                    )}
                 </div>
               </div>

               <div className="pt-2">
                  {editingId === slot.id ? (
                    <button 
                      onClick={() => handleSave(slot.id)}
                      className="w-full bg-green-500 text-black py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-green-400 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleEdit(slot)}
                      className="w-full bg-zinc-900 text-zinc-400 hover:text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all border border-zinc-800"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Slot
                    </button>
                  )}
               </div>
             </div>
          ))}
        </div>
      )}
    </div>
  );
}
