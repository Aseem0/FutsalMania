import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Lock, Mail, User, AlertCircle, Loader2 } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/login", { username, password });
      const { userData } = response.data;

      if (userData.role !== "admin") {
        setError("Access denied. Admin privileges required.");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        setLoading(false);
        return;
      }

      localStorage.setItem("adminToken", userData.accessToken);
      localStorage.setItem("adminUser", JSON.stringify({
        username: userData.username,
        role: userData.role
      }));

      if (userData.role === "admin") {
        navigate("/dashboard");
      } else if (userData.role === "manager") {
        navigate("/manager/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      const message = err.response?.data?.message || err.response?.data || "Invalid credentials. Please try again.";
      setError(typeof message === "string" ? message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 font-inter">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex p-3 bg-amber-500 rounded-2xl mb-4">
            <User className="h-8 w-8 text-black" />
          </div>
          <h1 className="text-3xl font-outfit-bold text-white tracking-tight">Admin Console</h1>
          <p className="text-zinc-500 mt-2 text-sm font-medium">Please enter your credentials to continue</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 shadow-2xl shadow-amber-500/5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <p className="text-sm text-red-400 font-medium leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">
                Username / Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-zinc-600 transition-colors group-focus-within:text-amber-500" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-900 text-white text-sm rounded-2xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 block pl-12 p-4 transition-all placeholder:text-zinc-700"
                  placeholder="admin@futsal.com"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-600 transition-colors group-focus-within:text-amber-500" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-900 text-white text-sm rounded-2xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 block pl-12 p-4 transition-all placeholder:text-zinc-700"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-70 text-black font-inter-bold py-4 rounded-2xl shadow-lg shadow-amber-500/20 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Login to Dashboard"
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-zinc-600 text-sm">
          &copy; 2026 FutsalMania. All rights reserved.
        </p>
      </div>
    </div>
  );
}
