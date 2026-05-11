import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaLock, FaUserAlt, FaArrowRight, FaSpinner } from "react-icons/fa";
import bgUser from "../assets/bguser.jpg";

const API_URL = "http://localhost:3000/api"; // SK Marketings Backend

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect based on role
      if (data.user.role === "ADMIN") {
        navigate("/admin-dashboard");
      } else if (data.user.role === "AGENT") {
        if (data.user.status === "PENDING") {
          setError("Your account is pending approval. Please wait for admin approval.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } else if (data.user.status === "REJECTED") {
          setError("Your account has been rejected. Please contact admin.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } else if (data.user.status === "INACTIVE") {
          setError("Your account is inactive. Please contact admin.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } else {
          navigate("/agent-dashboard");
        }
      }
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${bgUser})` }}
    >
      {/* VIBRANT ORANGE OVERLAY - Matches Hero sections */}
      <div className="absolute inset-0 bg-orange-500/40 backdrop-blur-sm"></div>

      {/* LOGIN BOX */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md mx-4 p-8 md:p-12 bg-white rounded-[3rem] shadow-2xl shadow-orange-900/20 border-2 border-orange-50"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-500 text-[10px] font-black px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            🔐 Secure Access
          </div>
          <h2 className="text-4xl font-heading font-black text-slate-900 uppercase tracking-tighter">
            Agent / Admin <span className="text-orange-500">Login</span>
          </h2>
          <p className="text-[11px] font-bold text-slate-400 uppercase mt-2 tracking-tight">
            Enter your credentials to access your dashboard
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest ml-2">
              Email Address
            </label>
            <div className="relative">
              <FaUserAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-300 size-3.5" />
              <input 
                type="email"
                required
                className="w-full pl-12 pr-5 py-4 rounded-2xl bg-orange-50/30 border-2 border-orange-50 focus:border-orange-500 focus:bg-white focus:outline-none transition-all font-bold text-sm text-slate-800 placeholder:text-slate-300"
                placeholder="user@gmail.com" 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest ml-2">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-300 size-3.5" />
              <input 
                type="password" 
                required
                className="w-full pl-12 pr-5 py-4 rounded-2xl bg-orange-50/30 border-2 border-orange-50 focus:border-orange-500 focus:bg-white focus:outline-none transition-all font-bold text-sm text-slate-800 placeholder:text-slate-300"
                placeholder="••••••••" 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-200 flex items-center justify-center gap-3 text-[10px] tracking-[0.2em] uppercase disabled:opacity-70"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <>Sign In <FaArrowRight /></>}
          </motion.button>

          <div className="text-center mt-6 space-y-3">
            <button
              type="button"
              className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-orange-500 transition-colors block w-full"
            >
              Forgot Password?
            </button>

            <Link
              to="/user-signup"
              className="text-[10px] font-black text-orange-500 uppercase tracking-widest hover:text-orange-600 transition-colors block w-full"
            >
              New Agent? Create Account
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}