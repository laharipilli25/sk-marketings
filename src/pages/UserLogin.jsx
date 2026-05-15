import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaLock, FaUserAlt, FaArrowRight, FaSpinner, FaPlus, FaHome } from "react-icons/fa";
import bgUser from "../assets/bguser.jpg";
import skLogo from "../assets/sklogo.png";

const API_URL = import.meta.env.VITE_API_URL; // SK Marketings Backend

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
        window.location.href = "/admin-dashboard";
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
          window.location.href = "/agent-dashboard";
        }
      }
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white font-body overflow-hidden">
      {/* LEFT SIDE - BRAND HIGHLIGHTS (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden bg-slate-900">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 scale-105 animate-pulse-slow"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600')`,
          }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-orange-500/10 via-orange-500/10 to-slate-900/95" />

        {/* Animated Background Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-400/20 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-[100px] animate-blob animation-delay-2000" />

        <div className="relative z-20 w-full p-12 flex flex-col justify-between">
          {/* Logo/Brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-between"
          >
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-2 shadow-xl group transition-transform duration-500">
                <img src={skLogo} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="block text-2xl font-black text-white tracking-tighter uppercase leading-none">Marketings</span>
                <span className="text-[10px] font-black text-orange-200 uppercase tracking-[0.3em]">Business Consultancy</span>
              </div>
            </Link>

            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10"
            >
              <FaHome /> Home
            </Link>
          </motion.div>

          {/* Main Content */}
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <h1 className="text-5xl font-black text-white leading-[1.1] mb-4 tracking-tighter">
                Empowering <span className="text-orange-200">Enterprises,</span><br />
                Elevating <span className="underline decoration-white/30 decoration-8 underline-offset-4">India.</span>
              </h1>
              <p className="text-orange-50 text-base font-bold opacity-90 leading-relaxed mb-6">
                Join our network of 500+ successful enterprises. Access expert MSME Registration and premium Digital Strategies to dominate the market.
              </p>
            </motion.div>

            {/* Feature Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { title: "MSME Services", desc: "Expert Registration" },
                { title: "Financial Advisory", desc: "Strategic Planning" },
                { title: "Digital Marketing", desc: "Global Reach" },
                { title: "Business Growth", desc: "Proven Results" }
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 hover:bg-white/20 transition-all cursor-default group">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                    <FaArrowRight className="-rotate-45" size={10} />
                  </div>
                  <div>
                    <div className="text-sm font-black text-white uppercase tracking-tight">{feature.title}</div>
                    <div className="text-[10px] text-orange-200 font-bold uppercase tracking-widest">{feature.desc}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Bottom Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="flex gap-12"
          >
            <div>
              <div className="text-4xl font-black text-white">500+</div>
              <div className="text-[10px] font-black text-orange-200 uppercase tracking-[0.2em]">Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl font-black text-white">5+</div>
              <div className="text-[10px] font-black text-orange-200 uppercase tracking-[0.2em]">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-black text-white">🇮🇳</div>
              <div className="text-[10px] font-black text-orange-200 uppercase tracking-[0.2em]">Made in India</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <div className="w-full lg:w-[40%] flex flex-col items-center justify-center p-8 pt-28 md:p-12 bg-slate-50 relative overflow-y-auto">
        {/* Mobile Header (Visible only on small screens) */}
        <div className="lg:hidden absolute top-6 left-6 right-6 flex items-center justify-between z-30 bg-slate-50/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/50 shadow-sm">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1 shadow-md">
              <img src={skLogo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-sm font-black text-slate-900 tracking-tighter uppercase leading-none">Marketings</span>
          </Link>
          <Link
            to="/"
            className="p-2 bg-white text-orange-500 rounded-lg shadow-sm border border-orange-50"
          >
            <FaHome size={16} />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md my-auto"
        >
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 text-[10px] font-black px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
              🔐 Secure Portal
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-1">
              Welcome <span className="text-orange-500">Back.</span>
            </h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-tight">
              Enter your professional credentials to continue.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-4 bg-red-50 border-2 border-red-100 rounded-2xl text-red-600 text-xs font-black uppercase text-center tracking-widest shadow-lg shadow-red-100"
            >
              ⚠️ {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                Professional Email
              </label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors">
                  <FaUserAlt size={14} />
                </div>
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white border-2 border-slate-100 focus:border-orange-500 focus:outline-none transition-all font-bold text-sm text-slate-800 placeholder:text-slate-300 shadow-sm"
                  placeholder="name@company.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[10px] font-black text-orange-500 uppercase tracking-widest hover:text-orange-600 transition-colors"
                >
                  Reset?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors">
                  <FaLock size={14} />
                </div>
                <input
                  type="password"
                  required
                  className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white border-2 border-slate-100 focus:border-orange-500 focus:outline-none transition-all font-bold text-sm text-slate-800 placeholder:text-slate-300 shadow-sm"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-200 flex items-center justify-center gap-4 text-[11px] tracking-[0.3em] uppercase disabled:opacity-70"
            >
              {loading ? (
                <FaSpinner className="animate-spin text-lg" />
              ) : (
                <>
                  Access Dashboard <FaArrowRight className="text-sm" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="text-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tight mb-4">
                New to SK Marketings?
              </p>
              <Link
                to="/user-signup"
                className="inline-flex items-center justify-center w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl transition-all text-[10px] tracking-widest uppercase gap-2"
              >
                Join as Agent <FaPlus size={10} />
              </Link>
            </div>
          </div>

          <p className="mt-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            © 2026 SK Marketings. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
}