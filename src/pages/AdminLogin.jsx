import toast from 'react-hot-toast';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgAdmin from "../assets/bgadmin.png";
import SEO from "../components/SEO";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("role", "admin");
      navigate("/admin-dashboard");
    } else {
      toast.error("Invalid Admin Credentials");
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgAdmin})` }}
    >
      <SEO 
        title="Admin Login" 
        description="Secure portal access for authorized administrators to manage SK Marketings business operations." 
      />
      {/* ✅ THICKER + STRONG ORANGE SHADE (BOTTOM ONLY) */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-orange-600/90 via-orange-400/60 to-transparent pointer-events-none" />

      {/* LOGIN CARD */}
      <div className="relative z-10 w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-orange-200">
        
        <h2 className="text-3xl font-bold text-center text-orange-600 mb-8">
          Admin Portal
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          
          <input 
            className="w-full px-4 py-3 rounded-lg bg-white border border-orange-300 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
            placeholder="Username" 
            onChange={(e) => setUsername(e.target.value)} 
          />

          <input 
            type="password" 
            className="w-full px-4 py-3 rounded-lg bg-white border border-orange-300 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
            placeholder="Password" 
            onChange={(e) => setPassword(e.target.value)} 
          />

          <button 
            type="submit" 
            className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-colors shadow-lg"
          >
            Login as Admin
          </button>

        </form>
      </div>
    </div>
  );
}