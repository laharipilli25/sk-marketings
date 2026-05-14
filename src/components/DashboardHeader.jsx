import { useState, useEffect, memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaBell, FaUser, FaClock, FaCalendarAlt, FaMapMarkerAlt, FaSignOutAlt, FaBars } from "react-icons/fa";

function Clock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 md:gap-3 mt-0.5">
      <div className="flex items-center gap-1 text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest">
        <FaCalendarAlt className="text-orange-500" />
        <span className="hidden xs:inline">{currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      </div>
      <div className="flex items-center gap-1 text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest">
        <FaClock className="text-orange-500" />
        {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
}

const DashboardHeader = ({ title, onMenuClick }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/user-login");
  }, [navigate]);

  return (
    <header className="h-16 bg-white/70 backdrop-blur-md border-b border-gray-100 px-4 md:px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-2 md:gap-4">
        {/* Mobile Menu Toggle */}
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-orange-50 rounded-lg text-orange-600 transition-all lg:hidden"
        >
          <FaBars size={18} />
        </button>

        <div>
          <h1 className="text-sm md:text-lg font-black text-gray-900 tracking-tight capitalize truncate max-w-[150px] md:max-w-none">
            {title || "Dashboard Overview"}
          </h1>
          <Clock />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Search Bar - Hidden on small screens */}
        <div className="hidden lg:flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl w-64 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
          <FaSearch className="text-gray-400 text-xs" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none text-xs font-medium text-gray-600 w-full"
          />
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <button className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:text-orange-600 hover:border-orange-200 transition-all relative">
            <FaBell size={12} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-orange-600 rounded-full border border-white"></span>
          </button>
          
          <div className="h-8 w-[1px] bg-gray-100 mx-1 hidden xs:block"></div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-gray-900 leading-none">{user?.full_name}</p>
              <p className="text-[9px] font-black text-orange-600 uppercase tracking-widest mt-1">
                {user?.role === 'ADMIN' ? 'Admin' : user?.village || 'Agent'}
              </p>
            </div>
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 p-0.5 shadow-md shadow-orange-100 relative group">
               <div className="w-full h-full rounded-[0.55rem] md:rounded-[0.65rem] bg-white flex items-center justify-center overflow-hidden">
                 {user?.profile_photo ? (
                   <img 
                    src={`${import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "")}/${user.profile_photo}`} 
                    alt="P" 
                    className="w-full h-full object-cover"
                   />
                 ) : (
                   <FaUser size={12} className="text-orange-500" />
                 )}
               </div>
            </div>

            <div className="h-8 w-[1px] bg-gray-100 mx-0.5 hidden md:block"></div>

            <button 
              onClick={handleLogout}
              className="flex items-center gap-1 px-2 md:px-3 py-1.5 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-600 hover:text-white transition-all text-[9px] md:text-[10px] border border-red-100"
            >
              <FaSignOutAlt />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default memo(DashboardHeader);
