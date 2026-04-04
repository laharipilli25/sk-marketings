import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("data")) || [];
    setData(stored);
  }, []);

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("role");
    navigate("/admin-login");
  };

  return (
    <div className="min-h-screen mt-24 relative overflow-hidden">
      {/* ─── BACKGROUND LAYER ─── */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2669&auto=format&fit=crop')` 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/80 via-white/90 to-white" />
      </div>

      {/* ─── CONTENT ─── */}
      <div className="max-w-7xl mx-auto p-8 relative z-10">
        
        {/* HEADER */}
        <header className="mb-12 flex justify-between items-start">
          <div>
            <div className="inline-block bg-orange-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest mb-4 shadow-lg shadow-orange-200">
              Internal Portal
            </div>

            <h2 className="text-6xl font-black text-gray-900 tracking-tight leading-tight">
              Admin <span className="text-orange-600">Dashboard</span>
            </h2>

            <p className="text-gray-700 mt-4 text-lg font-medium max-w-2xl">
              Overview of all user submissions and recent activity for SK Marketings.
            </p>

            <div className="h-1.5 w-24 bg-orange-600 mt-6 rounded-full" />
          </div>

          {/* LOGOUT */}
          <button 
            onClick={handleLogout}
            className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95"
          >
            Logout
          </button>
        </header>

        {/* DATA GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.length > 0 ? (
            data.map((item, index) => (
              <div 
                key={index} 
                className="group bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-xl shadow-orange-900/10 border border-white hover:border-orange-500 transition-all duration-500 transform hover:-translate-y-2"
              >
                {/* TOP */}
                <div className="flex justify-between items-center mb-8">
                  <div className="px-3 py-1 bg-orange-50 text-orange-600 border border-orange-100 rounded-lg text-[10px] font-black uppercase">
                    ID: #10{index + 1}
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                </div>

                {/* NAME */}
                <h4 className="text-3xl font-extrabold text-gray-900 mb-3">
                  {item.name}
                </h4>

                {/* LOCATION */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-orange-600 text-lg">📍</span>
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">
                    {item.village}
                  </span>
                </div>

                {/* ✅ PHONE */}
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-orange-600 text-lg">📞</span>
                  <span className="text-sm font-bold text-slate-900 tracking-wide">
                    {item.phone}
                  </span>
                </div>

                {/* DESCRIPTION */}
                <div className="p-5 bg-white/70 rounded-2xl border border-orange-100 text-slate-800 leading-relaxed font-medium">
                  "{item.description}"
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white/40 backdrop-blur-sm p-10 rounded-[2.5rem] border-2 border-dashed border-orange-200 text-center col-span-full">
              <p className="text-orange-600 font-bold uppercase tracking-tighter">
                No entries found
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}