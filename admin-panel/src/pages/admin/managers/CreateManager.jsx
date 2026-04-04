import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, PlusCircle, AlertCircle, CheckCircle2 } from "lucide-react";
import api from "../../../services/api";
import ManagerForm from "../../../components/forms/ManagerForm";

export default function CreateManager() {
  const [arenas, setArenas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingArenas, setFetchingArenas] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArenas = async () => {
      try {
        const response = await api.get("/arenas");
        // The API might return { data: [...] } or just [...]
        const arenaData = response.data.data || response.data;
        setArenas(Array.isArray(arenaData) ? arenaData : []);
      } catch (err) {
        console.error("Error fetching arenas:", err);
        setError("Failed to load futsal arenas. Please refresh the page.");
      } finally {
        setFetchingArenas(false);
      }
    };

    fetchArenas();
  }, []);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError("");
    try {
      await api.post("/managers", formData);
      setSuccess(true);
      setTimeout(() => {
        navigate("/managers");
      }, 2000);
    } catch (err) {
      console.error("Error creating manager:", err);
      const message =
        err.response?.data?.message ||
        "Failed to create manager. Please check your details and try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <Link
          to="/managers"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors w-fit text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Managers
        </Link>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500 rounded-2xl shadow-lg shadow-amber-500/20">
            <PlusCircle className="w-8 h-8 text-black" />
          </div>
          <div>
            <h1 className="text-4xl font-outfit-bold text-white tracking-tight">
              Create New Manager
            </h1>
            <p className="text-zinc-500 font-medium mt-1">
              Add a new futsal manager to the platform.
            </p>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <p className="text-sm text-red-400 font-medium leading-relaxed">
            {error}
          </p>
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
          <p className="text-sm text-green-400 font-medium leading-relaxed">
            Manager account created successfully! Redirecting to manager list...
          </p>
        </div>
      )}

      {/* Form Container */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-[32px] p-10 shadow-2xl relative overflow-hidden">
        {fetchingArenas ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
            <p className="text-zinc-500 text-sm font-medium">
              Loading futsal arenas...
            </p>
          </div>
        ) : (
          <ManagerForm
            arenas={arenas}
            onSubmit={handleSubmit}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
