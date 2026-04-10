import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Megaphone, 
  Plus, 
  Trash2, 
  Calendar, 
  User, 
  MapPin,
  Loader2,
  AlertCircle
} from 'lucide-react';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = JSON.parse(localStorage.getItem('adminUser'));
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/announcements');
      setAnnouncements(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError('Failed to load announcements. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const payload = {
        ...newAnnouncement,
        arenaId: user.role === 'manager' ? user.arenaId : null
      };

      await axios.post('http://localhost:5000/api/announcements', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowModal(false);
      setNewAnnouncement({ title: '', content: '' });
      fetchAnnouncements();
    } catch (err) {
      console.error('Error creating announcement:', err);
      alert('Failed to create announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/announcements/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAnnouncements();
    } catch (err) {
      console.error('Error deleting announcement:', err);
      alert('Failed to delete announcement');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-outfit-bold text-white mb-2">Announcements</h1>
          <p className="text-zinc-500 font-medium">Broadcast updates and news to all users</p>
        </div>
        
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl transition-all shadow-lg shadow-amber-500/10"
        >
          <Plus className="w-5 h-5" />
          New Announcement
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
          <p className="text-zinc-500 font-medium font-outfit">Loading broadcasts...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="p-4 bg-red-500/10 rounded-full mb-4">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <p className="text-white font-bold mb-2">{error}</p>
          <button onClick={fetchAnnouncements} className="text-amber-500 font-medium hover:underline">Try Again</button>
        </div>
      ) : announcements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-zinc-900/30 border border-zinc-800 rounded-3xl border-dashed">
          <Megaphone className="w-16 h-16 text-zinc-700 mb-6" />
          <h3 className="text-xl font-bold text-zinc-400 mb-2">No announcements yet</h3>
          <p className="text-zinc-600 mb-8 max-w-sm text-center">Start interacting with your community by creating your first global broadcast.</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all"
          >
            Create First
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements.map((item) => (
            <div 
              key={item.id}
              className="group relative bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 hover:border-amber-500/30 transition-all duration-300 backdrop-blur-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-amber-500/10 rounded-2xl">
                  <Megaphone className="w-6 h-6 text-amber-500" />
                </div>
                {(user.role === 'admin' || item.authorId === user.id) && (
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              <h3 className="text-xl font-outfit-bold text-white mb-2 leading-tight">
                {item.title}
              </h3>
              
              <p className="text-zinc-500 text-sm mb-6 line-clamp-4 leading-relaxed font-medium">
                {item.content}
              </p>

              <div className="space-y-3 pt-6 border-t border-zinc-800/50">
                <div className="flex items-center gap-2 text-[13px] text-zinc-500 font-medium">
                  <User className="w-4 h-4 text-amber-500/60" />
                  <span>Posted by <span className="text-zinc-300">{item.author?.username}</span></span>
                  <span className="px-1.5 py-0.5 rounded-md bg-zinc-800 text-[10px] uppercase tracking-wider text-zinc-400">{item.author?.role}</span>
                </div>
                
                {item.arena && (
                  <div className="flex items-center gap-2 text-[13px] text-zinc-500 font-medium">
                    <MapPin className="w-4 h-4 text-amber-500/60" />
                    <span className="text-zinc-300">{item.arena?.name}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-[13px] text-zinc-500 font-medium">
                  <Calendar className="w-4 h-4 text-amber-500/60" />
                  <span>{new Date(item.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-8 pt-8 pb-4">
              <h2 className="text-2xl font-outfit-bold text-white mb-1">Create Broadcast</h2>
              <p className="text-zinc-500 font-medium text-sm">Fill in the details for your announcement.</p>
            </div>

            <form onSubmit={handleCreate} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest ml-1">Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Tournament Update, Maintenance Notice"
                  className="w-full h-14 bg-zinc-900 border border-zinc-800 rounded-2xl px-6 text-white focus:outline-none focus:border-amber-500 transition-all font-medium"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest ml-1">Content</label>
                <textarea 
                  required
                  rows="5"
                  placeholder="Describe your announcement in detail..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-white focus:outline-none focus:border-amber-500 transition-all font-medium"
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 h-14 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-14 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Publish Now'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
