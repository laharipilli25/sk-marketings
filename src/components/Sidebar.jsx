import { useState, useEffect, memo, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChartPie,
  FaClipboardList,
  FaUsers,
  FaEnvelope,
  FaUserCircle,
  FaChevronLeft,
  FaChevronRight,
  FaChartBar,
  FaShieldAlt,
  FaPlus,
  FaTimes
} from "react-icons/fa";
import skLogo from "../assets/sklogo.png";

const ADMIN_MODULES = [
  { id: "dashboard", label: "Dashboard", icon: <FaChartPie /> },
  { id: "leads", label: "All Leads", icon: <FaClipboardList /> },
  { id: "agents", label: "Manage Agents", icon: <FaUsers /> },
  { id: "inquiries", label: "Inquiries", icon: <FaEnvelope /> },
  { id: "profile", label: "My Profile", icon: <FaUserCircle /> },
];

const AGENT_MODULES = [
  { id: "dashboard", label: "Dashboard", icon: <FaChartPie /> },
  { id: "leads", label: "My Leads", icon: <FaClipboardList /> },
  { id: "profile", label: "My Profile", icon: <FaUserCircle /> },
];

const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isAdmin = user?.role === "ADMIN";
  const modules = isAdmin ? ADMIN_MODULES : AGENT_MODULES;

  const handleTabClick = useCallback((id) => {
    setActiveTab(id);
    if (window.innerWidth < 1024) onClose();
  }, [setActiveTab, onClose]);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{
          width: isCollapsed ? "80px" : "280px",
          x: isOpen ? 0 : (window.innerWidth < 1024 ? -280 : 0)
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="h-screen bg-white flex flex-col fixed lg:sticky top-0 z-[70] shadow-2xl overflow-hidden border-r border-gray-100"
      >
        {/* Brand */}
        <div className="p-4 flex items-center justify-between border-b border-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-sm border border-orange-100 shrink-0">
              <img src={skLogo} alt="Logo" className="w-6 h-6 object-contain" />
            </div>
            {(!isCollapsed || isOpen) && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-black text-lg tracking-tight text-gray-800 whitespace-nowrap"
              >
                SK <span className="text-orange-600">Marketings</span>
              </motion.span>
            )}
          </div>

          {/* Desktop Toggle */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex p-1.5 hover:bg-orange-50 rounded-lg text-orange-600 transition-all"
          >
            {isCollapsed ? <FaChevronRight size={12} /> : <FaChevronLeft size={12} />}
          </button>

          {/* Mobile Close */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-gray-400 hover:text-orange-600 transition-all"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => handleTabClick(module.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative ${activeTab === module.id
                  ? "bg-orange-600 text-white shadow-md shadow-orange-100"
                  : "text-gray-500 hover:bg-orange-50 hover:text-orange-600"
                }`}
            >
              <div className={`text-lg transition-transform group-hover:scale-110 ${activeTab === module.id ? "text-white" : "text-gray-400"}`}>
                {module.icon}
              </div>
              {(!isCollapsed || isOpen) && (
                <span className="font-bold text-xs tracking-wide">{module.label}</span>
              )}

              {/* Tooltip for collapsed state (Desktop only) */}
              {isCollapsed && !isOpen && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-[100] hidden lg:block">
                  {module.label}
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* User Profile Info */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          {(!isCollapsed || isOpen) && user && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold overflow-hidden shrink-0">
                {user.profile_photo ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "")}/${user.profile_photo}`}
                    alt="P"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user.full_name?.charAt(0)
                )}
              </div>
              <div className="overflow-hidden">
                <p className="font-black text-xs text-gray-900 truncate">{user.full_name}</p>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{user.role}</p>
              </div>
            </div>
          )}
          {isCollapsed && !isOpen && (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold overflow-hidden">
                {user?.profile_photo ? (
                  <img src={`${import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "")}/${user.profile_photo}`} alt="P" className="w-full h-full object-cover" />
                ) : (
                  user?.full_name?.charAt(0)
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default memo(Sidebar);
