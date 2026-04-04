import React, { useState } from "react";
import { User, Mail, Lock, Building2, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function ManagerForm({ arenas, onSubmit, loading, initialData = {} }) {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    email: initialData.email || "",
    password: initialData.password || "",
    futsal_id: initialData.futsal_id || "",
    role: "manager"
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!initialData.id && !formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.futsal_id) newErrors.futsal_id = "Please select a futsal arena";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">
            Full Name
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-zinc-600 group-focus-within:text-amber-500 transition-colors" />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full bg-zinc-900/50 border ${errors.name ? 'border-red-500/50' : 'border-zinc-800'} text-white text-sm rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all`}
            />
          </div>
          {errors.name && <p className="text-xs text-red-500 ml-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">
            Email Address
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-zinc-600 group-focus-within:text-amber-500 transition-colors" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={`w-full bg-zinc-900/50 border ${errors.email ? 'border-red-500/50' : 'border-zinc-800'} text-white text-sm rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all`}
            />
          </div>
          {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">
            Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-zinc-600 group-focus-within:text-amber-500 transition-colors" />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full bg-zinc-900/50 border ${errors.password ? 'border-red-500/50' : 'border-zinc-800'} text-white text-sm rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all`}
            />
          </div>
          {errors.password && <p className="text-xs text-red-500 ml-1">{errors.password}</p>}
        </div>

        {/* Futsal Arena Dropdown */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">
            Assigned Futsal Arena
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Building2 className="h-5 w-5 text-zinc-600 group-focus-within:text-amber-500 transition-colors" />
            </div>
            <select
              name="futsal_id"
              value={formData.futsal_id}
              onChange={handleChange}
              className={`w-full bg-zinc-900/50 border ${errors.futsal_id ? 'border-red-500/50' : 'border-zinc-800'} text-white text-sm rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all appearance-none`}
            >
              <option value="" disabled className="bg-zinc-950">Select an Arena</option>
              {arenas.map((arena) => (
                <option key={arena.id} value={arena.id} className="bg-zinc-950">
                  {arena.name || arena.futsal_name}
                </option>
              ))}
            </select>
          </div>
          {errors.futsal_id && <p className="text-xs text-red-500 ml-1">{errors.futsal_id}</p>}
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold rounded-2xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              {initialData.id ? "Update Manager" : "Create Manager"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
