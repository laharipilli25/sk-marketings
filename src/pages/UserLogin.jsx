import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaLock, FaUserAlt, FaArrowRight } from "react-icons/fa";
import bgUser from "../assets/bguser.jpg"; 

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "user@gmail.com" && password === "123456") {
      localStorage.setItem("role", "user");
      localStorage.setItem("userEmail", email); 
      navigate("/user-dashboard");
    } else {
      alert("Invalid User Credentials");
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
            User <span className="text-orange-500">Login</span>
          </h2>
          <p className="text-[11px] font-bold text-slate-400 uppercase mt-2 tracking-tight">
            Enter your credentials to access your dashboard
          </p>
        </div>

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
            className="w-full mt-4 py-5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-200 flex items-center justify-center gap-3 text-[10px] tracking-[0.2em] uppercase"
          >
            Sign In <FaArrowRight />
          </motion.button>

          <div className="text-center mt-6">
            <button 
              type="button"
              className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-orange-500 transition-colors"
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}