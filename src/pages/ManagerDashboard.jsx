import toast from 'react-hot-toast';
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  FaUsers,
  FaClipboardList,
  FaSignOutAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaCheck,
  FaUserPlus,
  FaEdit,
  FaEye,
  FaMapMarkerAlt,
  FaPhone,
  FaFilter,
  FaSearch,
  FaSpinner,
  FaUserCheck,
  FaUserTimes,
  FaIdCard,
  FaUser,
  FaTimes,
  FaFileExcel,
  FaFilePdf,
  FaMoneyBillWave,
  FaArrowUp,
  FaArrowDown
} from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import { exportToExcel, exportToPDF } from "../utils/exportUtils";
import SEO from "../components/SEO";
import Profile from "./Profile";

const API_URL = import.meta.env.VITE_API_URL;
const COLORS = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444"];

const StatCard = ({ icon, label, value, subtext, color, trend, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    onClick={onClick}
    className={`bg-white p-3 md:p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2 md:gap-3 group hover:shadow-xl hover:border-orange-200 transition-all cursor-pointer`}
  >
    <div className="flex justify-between items-start">
      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl ${color} flex items-center justify-center text-white shadow-lg shadow-gray-100 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-[9px] md:text-[10px] font-bold ${trend > 0 ? "text-green-600" : "text-red-600"}`}>
          {trend > 0 ? <FaArrowUp /> : <FaArrowDown />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div>
      <div className="text-lg md:text-xl font-black text-gray-900 mb-0.5">{value}</div>
      <div className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-tight">{label}</div>
      {subtext && <div className="text-[8px] md:text-[9px] text-gray-400 mt-1">{subtext}</div>}
    </div>
  </motion.div>
);

export default function ManagerDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, leads, agents
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Paginated Lists
  const [paginatedLeads, setPaginatedLeads] = useState([]);
  const [leadsCurrentPage, setLeadsCurrentPage] = useState(1);
  const [leadsTotalPages, setLeadsTotalPages] = useState(1);

  const [paginatedAgents, setPaginatedAgents] = useState([]);
  const [agentsCurrentPage, setAgentsCurrentPage] = useState(1);
  const [agentsTotalPages, setAgentsTotalPages] = useState(1);

  // Filters
  const [filterAgent, setFilterAgent] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [agentFilters, setAgentFilters] = useState({
    search: "",
    district_id: "",
    mandal: "",
    village: ""
  });

  // Modals
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [showEditAgent, setShowEditAgent] = useState(false);
  const [showViewAgent, setShowViewAgent] = useState(false);
  const [showViewLead, setShowViewLead] = useState(false);
  const [showAgentLeads, setShowAgentLeads] = useState(false);

  // Selected Entities
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [viewAgent, setViewAgent] = useState(null);
  const [viewLead, setViewLead] = useState(null);

  // Forms
  const [agentForm, setAgentForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    district_id: "",
    district: "",
    mandal_id: "",
    village: "",
    aadharNumber: "",
    alternatePhone: "",
  });

  const [editAgentForm, setEditAgentForm] = useState({
    id: "",
    fullName: "",
    email: "",
    phone: "",
    district_id: "",
    district: "",
    mandal_id: "",
    village: "",
    aadharNumber: "",
    alternatePhone: "",
    status: "",
    password: ""
  });

  // Location Data
  const [districts, setDistricts] = useState([]);
  const [mandals, setMandals] = useState([]);
  const [villages, setVillages] = useState([]);

  // Fetch initial profile
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!storedUser || !token) {
      navigate("/user-login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "MANAGER") {
      navigate("/user-login");
      return;
    }
    // Set from localStorage first for fast render
    setUser(parsedUser);

    // Then fetch fresh profile from server to ensure state_id and other fields are available
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const freshUser = await response.json();
          const mergedUser = { ...parsedUser, ...freshUser };
          setUser(mergedUser);
          localStorage.setItem("user", JSON.stringify(mergedUser));
        }
      } catch (error) {
        console.error("Error fetching fresh profile:", error);
      }
    };
    fetchProfile();
  }, [navigate]);

  // Load districts once user state_id is verified
  useEffect(() => {
    if (user?.state_id) {
      fetchDistricts(user.state_id);
      fetchDashboardData();
    }
  }, [user]);

  // Fetch agents / leads triggers on tab change
  useEffect(() => {
    if (user) {
      if (activeTab === "leads" || activeTab === "dashboard") fetchLeads();
      if (activeTab === "agents" || activeTab === "dashboard") fetchAgents();
    }
  }, [activeTab, user]);

  // Handle server-side pagination for Leads
  useEffect(() => {
    setLeadsCurrentPage(1);
  }, [filterAgent, filterStatus, searchQuery]);

  useEffect(() => {
    if (activeTab === "leads" && user) {
      const timer = setTimeout(() => {
        fetchPaginatedLeads(leadsCurrentPage);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeTab, filterAgent, filterStatus, searchQuery, leadsCurrentPage, user]);

  // Handle server-side pagination for Agents
  useEffect(() => {
    setAgentsCurrentPage(1);
  }, [agentFilters]);

  useEffect(() => {
    if (activeTab === "agents" && user) {
      const timer = setTimeout(() => {
        fetchPaginatedAgents(agentsCurrentPage);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeTab, agentFilters, agentsCurrentPage, user]);

  // Locations API
  const fetchDistricts = async (stateId) => {
    try {
      const response = await fetch(`${API_URL}/auth/districts/${stateId}`);
      if (response.ok) {
        const data = await response.json();
        setDistricts(data);
        setMandals([]);
        setVillages([]);
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchMandals = async (stateId, districtId) => {
    try {
      const response = await fetch(`${API_URL}/auth/mandals/${stateId}/${districtId}`);
      if (response.ok) {
        const data = await response.json();
        setMandals(data);
        setVillages([]);
      }
    } catch (error) {
      console.error("Error fetching mandals:", error);
    }
  };

  const fetchVillages = async (stateId, districtId, mandalName) => {
    try {
      const response = await fetch(`${API_URL}/auth/villages/${stateId}/${districtId}/${mandalName}`);
      if (response.ok) {
        const data = await response.json();
        setVillages(data);
      }
    } catch (error) {
      console.error("Error fetching villages:", error);
    }
  };

  // Dashboard Data Loading
  const fetchDashboardData = async () => {
    await Promise.all([fetchLeads(), fetchAgents()]);
  };

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/leads/manager-leads?limit=10000`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads || []);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const fetchPaginatedLeads = async (page = 1) => {
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        page,
        limit: 10,
      });
      if (filterAgent !== "all") queryParams.append("agentId", filterAgent);
      if (filterStatus !== "all") queryParams.append("status", filterStatus);
      if (searchQuery) queryParams.append("search", searchQuery);

      const response = await fetch(`${API_URL}/leads/manager-leads?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setPaginatedLeads(data.leads || []);
        setLeadsTotalPages(data.totalPages || 1);
        setLeadsCurrentPage(data.currentPage || 1);
      }
    } catch (error) {
      console.error("Error fetching paginated leads:", error);
    }
  };

  const fetchAgents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/auth/manager/agents?limit=10000`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setAgents(data.agents || []);
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  const fetchPaginatedAgents = async (page = 1) => {
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        page,
        limit: 10,
      });
      if (agentFilters.search) queryParams.append("search", agentFilters.search);
      if (agentFilters.district_id) queryParams.append("district_id", agentFilters.district_id);
      if (agentFilters.mandal) queryParams.append("mandal", agentFilters.mandal);
      if (agentFilters.village) queryParams.append("village", agentFilters.village);

      const response = await fetch(`${API_URL}/auth/manager/agents?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setPaginatedAgents(data.agents || []);
        setAgentsTotalPages(data.totalPages || 1);
        setAgentsCurrentPage(data.currentPage || 1);
      }
    } catch (error) {
      console.error("Error fetching paginated agents:", error);
    }
  };

  // Agent Operations
  const toggleAgentStatus = async (agentId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/auth/manager/agents/${agentId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        toast.success(`Agent status updated successfully`);
        fetchAgents();
        fetchPaginatedAgents(agentsCurrentPage);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  const createAgent = async () => {
    if (!agentForm.fullName || !agentForm.email || !agentForm.phone || !agentForm.password) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("fullName", agentForm.fullName);
      formData.append("email", agentForm.email);
      formData.append("phone", agentForm.phone);
      formData.append("password", agentForm.password);
      if (agentForm.district_id) formData.append("district_id", agentForm.district_id);
      if (agentForm.mandal_id) formData.append("mandal_id", agentForm.mandal_id);
      if (agentForm.village) formData.append("village", agentForm.village);
      if (agentForm.aadharNumber) formData.append("aadharNumber", agentForm.aadharNumber);
      if (agentForm.alternatePhone) formData.append("alternatePhone", agentForm.alternatePhone);
      if (agentForm.profilePhoto instanceof File) formData.append("profilePhoto", agentForm.profilePhoto);

      const response = await fetch(`${API_URL}/auth/manager/agents`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        toast.success("Agent created successfully!");
        setShowCreateAgent(false);
        setAgentForm({
          fullName: "",
          email: "",
          phone: "",
          password: "",
          district_id: "",
          district: "",
          mandal_id: "",
          village: "",
          aadharNumber: "",
          alternatePhone: "",
        });
        fetchAgents();
        fetchPaginatedAgents(1);
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to create agent");
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditAgent = (agent) => {
    setEditAgentForm({
      id: agent.id,
      fullName: agent.full_name,
      email: agent.email,
      phone: agent.phone,
      district_id: agent.district_id || "",
      district: agent.district?.name || "",
      mandal_id: agent.mandal_id || "",
      village: agent.village || "",
      aadharNumber: agent.aadhar_number || "",
      alternatePhone: agent.alternate_phone || "",
      status: agent.status,
      password: ""
    });

    if (user?.state_id) {
      fetchDistricts(user.state_id);
      if (agent.district_id) fetchMandals(user.state_id, agent.district_id);
      if (agent.district_id && agent.mandal_id) fetchVillages(user.state_id, agent.district_id, agent.mandal_id);
    }

    setShowEditAgent(true);
  };

  const updateAgent = async () => {
    if (!editAgentForm.fullName || !editAgentForm.email || !editAgentForm.phone) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("fullName", editAgentForm.fullName);
      formData.append("email", editAgentForm.email);
      formData.append("phone", editAgentForm.phone);
      if (editAgentForm.district_id) formData.append("district_id", editAgentForm.district_id);
      if (editAgentForm.mandal_id) formData.append("mandal", editAgentForm.mandal_id);
      if (editAgentForm.village) formData.append("village", editAgentForm.village);
      if (editAgentForm.aadharNumber) formData.append("aadharNumber", editAgentForm.aadharNumber);
      if (editAgentForm.alternatePhone) formData.append("alternatePhone", editAgentForm.alternatePhone);
      if (editAgentForm.status) formData.append("status", editAgentForm.status);
      if (editAgentForm.password) formData.append("password", editAgentForm.password);
      if (editAgentForm.profilePhoto instanceof File) formData.append("profilePhoto", editAgentForm.profilePhoto);

      const response = await fetch(`${API_URL}/auth/manager/agents/${editAgentForm.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        toast.success("Agent updated successfully!");
        setShowEditAgent(false);
        fetchAgents();
        fetchPaginatedAgents(agentsCurrentPage);
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to update agent");
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  // Export Tools
  const handleExportLeadsExcel = () => {
    const exportData = leads.map(l => ({
      ID: l.id,
      ClientName: l.client_name,
      ClientPhone: l.client_phone,
      ClientEmail: l.client_email || 'N/A',
      Service: l.service_type,
      Status: l.status,
      PaymentStatus: l.payment_status,
      PaidAmount: l.paid_amount || 0,
      TotalAmount: l.total_amount || 0,
      Date: new Date(l.created_at).toLocaleDateString()
    }));
    exportToExcel(exportData, `Manager_Leads_${new Date().toISOString().split('T')[0]}`);
  };

  const handleExportLeadsPDF = () => {
    const headers = ['Client', 'Phone', 'Service', 'Status', 'Payment', 'Amount', 'Date'];
    const data = leads.map(l => [
      l.client_name,
      l.client_phone,
      l.service_type,
      l.status,
      l.payment_status,
      `₹${l.paid_amount || 0} / ₹${l.total_amount || 0}`,
      new Date(l.created_at).toLocaleDateString()
    ]);
    exportToPDF(headers, data, `Manager_Leads_${new Date().toISOString().split('T')[0]}`, 'My Area Leads Report');
  };

  const handleExportAgentsExcel = () => {
    const exportData = agents.map(a => ({
      ID: a.id,
      Name: a.full_name,
      Email: a.email,
      Phone: a.phone,
      District: a.district?.name || 'N/A',
      Mandal: a.mandal?.name || 'N/A',
      Village: a.village || 'N/A',
      Leads: leads.filter(l => l.agent_id == a.id).length,
      Won: leads.filter(l => l.agent_id == a.id && l.status === 'WON').length,
      Revenue: leads.filter(l => l.agent_id == a.id).reduce((sum, l) => sum + (parseFloat(l.paid_amount) || 0), 0),
      Status: a.status
    }));
    exportToExcel(exportData, `Manager_Agents_${new Date().toISOString().split('T')[0]}`);
  };

  const handleExportAgentsPDF = () => {
    const headers = ['Name', 'Phone', 'District', 'Leads', 'Won', 'Revenue', 'Status'];
    const data = agents.map(a => [
      a.full_name,
      a.phone,
      a.district?.name || 'N/A',
      leads.filter(l => l.agent_id == a.id).length,
      leads.filter(l => l.agent_id == a.id && l.status === 'WON').length,
      `₹${leads.filter(l => l.agent_id == a.id).reduce((sum, l) => sum + (parseFloat(l.paid_amount) || 0), 0).toLocaleString()}`,
      a.status
    ]);
    exportToPDF(headers, data, `Manager_Agents_${new Date().toISOString().split('T')[0]}`, 'My Agents Performance Report');
  };

  // Helper colors
  const getStatusColor = (status) => {
    switch (status) {
      case "NEW": return "bg-blue-100 text-blue-800";
      case "CONTACTED": return "bg-purple-100 text-purple-800";
      case "FOLLOW_UP": return "bg-yellow-100 text-yellow-800";
      case "WON": return "bg-green-100 text-green-800";
      case "LOST": return "bg-red-100 text-red-800";
      case "COMPLETED": return "bg-green-100 text-green-800";
      case "PARTIAL": return "bg-yellow-100 text-yellow-800";
      case "PENDING": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Compute charts
  const leadGrowthData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const result = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = months[d.getMonth()];
      const year = d.getFullYear();
      const monthLeads = leads.filter(l => {
        const leadDate = new Date(l.created_at || l.createdAt);
        if (isNaN(leadDate.getTime())) return false;
        return leadDate.getMonth() === d.getMonth() && leadDate.getFullYear() === year;
      });
      const revenue = monthLeads.reduce((sum, l) => sum + (parseFloat(l.paid_amount) || 0), 0);
      result.push({
        name: monthLabel,
        leads: monthLeads.length,
        revenue: revenue,
      });
    }
    return result;
  }, [leads]);

  const leadStatusData = useMemo(() => {
    const statusCounts = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  }, [leads]);

  const agentPerformanceData = useMemo(() => {
    const processedAgents = agents.map(agent => {
      const agentLeads = leads.filter(l => String(l.agent_id) === String(agent.id));
      const wonLeads = agentLeads.filter(l => l.status === "WON").length;
      const agentRevenue = agentLeads.reduce((sum, l) => sum + (parseFloat(l.paid_amount) || 0), 0);
      return {
        name: agent.full_name?.split(' ')[0] || "Agent",
        leads: agentLeads.length,
        won: wonLeads,
        revenue: agentRevenue
      };
    });
    return processedAgents
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [agents, leads]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SEO 
        title="Manager Dashboard" 
        description="Manager administration view to monitor assigned agents and track local performance." 
      />
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader
          title={
            activeTab === "dashboard"
              ? "Area Overview"
              : activeTab === "leads"
              ? "Area Leads"
              : activeTab === "agents"
              ? "Manage Agents"
              : "My Profile"
          }
          onMenuClick={() => setIsSidebarOpen(true)}
          setActiveTab={setActiveTab}
        />

        <main className="flex-1 overflow-y-auto p-2 pb-20 md:p-4 custom-scrollbar">
          <div className="relative">

            {/* DASHBOARD TAB */}
            {activeTab === "dashboard" && (
              <div className="space-y-4 pb-6">
                {/* Aggregate Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <StatCard 
                    icon={<FaClipboardList size={18} />} 
                    label="Total Leads" 
                    value={leads.length} 
                    color="bg-blue-600" 
                    subtext="All agent leads in my state"
                    onClick={() => setActiveTab("leads")}
                  />
                  <StatCard 
                    icon={<FaUsers size={18} />} 
                    label="Active Agents" 
                    value={agents.filter(a => a.status === "ACTIVE").length} 
                    color="bg-orange-600" 
                    subtext={`${agents.length} total assigned agents`}
                    onClick={() => setActiveTab("agents")}
                  />
                  <StatCard 
                    icon={<FaCheckCircle size={18} />} 
                    label="Won Leads" 
                    value={leads.filter(l => l.status === "WON").length} 
                    color="bg-green-600" 
                    subtext="Closed deals by my team"
                  />
                  <StatCard 
                    icon={<FaMoneyBillWave size={18} />} 
                    label="Total Revenue" 
                    value={`₹${leads.reduce((sum, l) => sum + (parseFloat(l.paid_amount) || 0), 0).toLocaleString()}`} 
                    color="bg-purple-600" 
                    subtext="Earnings generated"
                  />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Growth Area Chart */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 min-w-0"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-lg font-black text-gray-900">Performance Trends</h3>
                        <p className="text-xs text-gray-500 font-medium">Monthly leads vs revenue in my area</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-orange-500" />
                          <span className="text-[10px] font-bold text-gray-600 uppercase">Leads</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <span className="text-[10px] font-bold text-gray-600 uppercase">Revenue</span>
                        </div>
                      </div>
                    </div>
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={leadGrowthData}>
                          <defs>
                            <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }} dy={10} />
                          <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }} />
                          <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }} tickFormatter={(val) => `₹${val >= 1000 ? (val/1000) + 'k' : val}`} />
                          <Tooltip formatter={(value, name) => name === "revenue" ? [`₹${value.toLocaleString()}`, "Revenue"] : [value, "Leads"]} contentStyle={{ borderRadius: "1rem", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)", padding: "0.5rem", fontSize: "12px" }} />
                          <Area yAxisId="left" type="monotone" dataKey="leads" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" />
                          <Area yAxisId="right" type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>

                  {/* Status Distribution Pie Chart */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 min-w-0"
                  >
                    <h3 className="text-lg font-black text-gray-900 mb-4">Lead Status Distribution</h3>
                    <div className="h-[250px] w-full relative text-[10px]">
                      {leadStatusData.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-gray-400 font-bold">No leads recorded yet</div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={leadStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                              {leadStatusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: "1rem", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)", fontSize: "12px" }} />
                            <Legend verticalAlign="bottom" height={30} iconType="circle" formatter={(value) => <span className="text-[10px] font-bold text-gray-600 uppercase">{value}</span>} />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Top Performing Agents Bar Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 min-w-0"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-black text-gray-900">Top Performing Agents</h3>
                      <p className="text-xs text-gray-500 font-medium">Top 5 agents assigned to me based on revenue</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setActiveTab("agents")} className="text-[9px] font-black text-orange-500 hover:text-orange-600 uppercase tracking-widest border-b-2 border-orange-100 hover:border-orange-500 transition-all pb-1">
                        View All
                      </button>
                    </div>
                  </div>
                  <div className="h-[250px] w-full">
                    {agentPerformanceData.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-gray-400 font-bold">No agents available</div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={agentPerformanceData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }} dy={10} />
                          <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }} />
                          <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }} tickFormatter={(val) => `₹${val >= 1000 ? (val/1000) + 'k' : val}`} />
                          <Tooltip formatter={(value, name) => name === "revenue" ? [`₹${value.toLocaleString()}`, "Revenue"] : [value, name]} contentStyle={{ borderRadius: "1rem", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)", fontSize: "12px" }} />
                          <Bar yAxisId="left" dataKey="leads" fill="#f97316" radius={[2, 2, 0, 0]} barSize={12} />
                          <Bar yAxisId="left" dataKey="won" fill="#10b981" radius={[2, 2, 0, 0]} barSize={12} />
                          <Bar yAxisId="right" dataKey="revenue" fill="#3b82f6" radius={[2, 2, 0, 0]} barSize={12} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </motion.div>
              </div>
            )}

            {/* LEADS TAB */}
            {activeTab === "leads" && (
              <div className="space-y-6">
                {/* Module Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <StatCard icon={<FaClipboardList />} label="Total Leads" value={leads.length} color="bg-blue-500" />
                  <StatCard icon={<FaCheckCircle />} label="Won Leads" value={leads.filter(l => l.status === 'WON').length} color="bg-green-500" />
                  <StatCard icon={<FaTimesCircle />} label="Lost Leads" value={leads.filter(l => l.status === 'LOST').length} color="bg-red-500" />
                  <StatCard icon={<FaClock />} label="Pending Payments" value={leads.filter(l => l.payment_status === 'PENDING').length} color="bg-yellow-500" />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2">
                    <FaFilter className="text-orange-500" />
                    <select
                      value={filterAgent}
                      onChange={(e) => setFilterAgent(e.target.value)}
                      className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-700"
                    >
                      <option value="all">All Agents</option>
                      {agents.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.full_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-700"
                    >
                      <option value="all">All Status</option>
                      <option value="NEW">New</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="FOLLOW_UP">Follow Up</option>
                      <option value="WON">Won</option>
                      <option value="LOST">Lost</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                    <FaSearch className="text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search client name or phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-500 font-bold"
                    />
                  </div>

                  {/* Export Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleExportLeadsExcel}
                      className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-bold hover:bg-green-600 hover:text-white transition-all shadow-sm"
                      title="Export to Excel"
                    >
                      <FaFileExcel /> Export
                    </button>
                    <button
                      onClick={handleExportLeadsPDF}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm"
                      title="Export to PDF"
                    >
                      <FaFilePdf /> PDF
                    </button>
                  </div>
                </div>

                {/* Leads Table */}
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-orange-50 text-left border-b border-orange-100">
                          <th className="px-6 py-4 text-xs font-black text-orange-800 uppercase tracking-widest">ID</th>
                          <th className="px-6 py-4 text-xs font-black text-orange-800 uppercase tracking-widest">Client</th>
                          <th className="px-6 py-4 text-xs font-black text-orange-800 uppercase tracking-widest">Agent</th>
                          <th className="px-6 py-4 text-xs font-black text-orange-800 uppercase tracking-widest">Service</th>
                          <th className="px-6 py-4 text-xs font-black text-orange-800 uppercase tracking-widest">Status</th>
                          <th className="px-6 py-4 text-xs font-black text-orange-800 uppercase tracking-widest">Payment</th>
                          <th className="px-6 py-4 text-xs font-black text-orange-800 uppercase tracking-widest">Date</th>
                          <th className="px-6 py-4 text-xs font-black text-orange-800 uppercase tracking-widest">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {paginatedLeads.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="px-6 py-12 text-center text-gray-500 font-bold">
                              No leads found in this area
                            </td>
                          </tr>
                        ) : (
                          paginatedLeads.map((lead, index) => (
                            <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 text-sm font-bold text-gray-400">
                                #{(leadsCurrentPage - 1) * 10 + index + 1}
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-bold text-gray-900">{lead.client_name}</div>
                                <div className="text-xs text-gray-500">{lead.client_phone}</div>
                              </td>
                              <td className="px-6 py-4 text-sm font-bold text-gray-700">
                                {lead.agent?.full_name || "Unknown"}
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-gray-800">{lead.service_type}</td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${getStatusColor(lead.status)}`}>
                                  {lead.status}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${getStatusColor(lead.payment_status)}`}>
                                  {lead.payment_status}
                                </span>
                                {lead.total_amount > 0 && (
                                  <div className="text-xs font-bold text-gray-500 mt-1">
                                    ₹{lead.paid_amount || 0} / ₹{lead.total_amount}
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                {new Date(lead.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4">
                                <button
                                  onClick={() => { setViewLead(lead); setShowViewLead(true); }}
                                  className="p-2.5 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                  title="View Lead Details"
                                >
                                  <FaEye size={14} />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>

                    {/* Pagination */}
                    {leadsTotalPages > 1 && (
                      <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white">
                        <span className="text-sm text-gray-500 font-bold">
                          Page {leadsCurrentPage} of {leadsTotalPages}
                        </span>
                        <div className="flex gap-2">
                          <button
                            disabled={leadsCurrentPage === 1}
                            onClick={() => setLeadsCurrentPage(p => Math.max(1, p - 1))}
                            className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                          >
                            Previous
                          </button>
                          <button
                            disabled={leadsCurrentPage === leadsTotalPages}
                            onClick={() => setLeadsCurrentPage(p => Math.min(leadsTotalPages, p + 1))}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-sm"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* AGENTS TAB */}
            {activeTab === "agents" && (
              <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <StatCard icon={<FaUsers />} label="Total Agents" value={agents.length} color="bg-blue-500" />
                  <StatCard icon={<FaUserCheck />} label="Active Agents" value={agents.filter(a => a.status === 'ACTIVE').length} color="bg-green-500" />
                  <StatCard icon={<FaClock />} label="Pending Approvals" value={agents.filter(a => a.status === 'PENDING').length} color="bg-yellow-500" />
                  <StatCard icon={<FaUserTimes />} label="Inactive Agents" value={agents.filter(a => a.status === 'INACTIVE').length} color="bg-gray-500" />
                </div>

                {/* Create Agent Trigger */}
                <button
                  onClick={() => setShowCreateAgent(true)}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 transition-all shadow-lg w-fit"
                >
                  <FaUserPlus /> Create New Agent
                </button>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2">
                    <FaFilter className="text-orange-500" />
                    <select
                      value={agentFilters.district_id}
                      onChange={(e) => {
                        const id = e.target.value;
                        setAgentFilters({ ...agentFilters, district_id: id, mandal: "", village: "" });
                        if (id) fetchMandals(user.state_id, id);
                        else { setMandals([]); setVillages([]); }
                      }}
                      className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 cursor-pointer"
                    >
                      <option value="">All Districts</option>
                      {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>

                  <select
                    value={agentFilters.mandal}
                    onChange={(e) => {
                      const name = e.target.value;
                      setAgentFilters({ ...agentFilters, mandal: name, village: "" });
                      if (name) fetchVillages(user.state_id, agentFilters.district_id, name);
                      else setVillages([]);
                    }}
                    disabled={!agentFilters.district_id}
                    className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 cursor-pointer disabled:opacity-50"
                  >
                    <option value="">All Mandals</option>
                    {mandals.map((m, i) => <option key={i} value={m.id}>{m.mandal}</option>)}
                  </select>

                  <select
                    value={agentFilters.village}
                    onChange={(e) => setAgentFilters({ ...agentFilters, village: e.target.value })}
                    disabled={!agentFilters.mandal}
                    className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 cursor-pointer disabled:opacity-50"
                  >
                    <option value="">All Villages</option>
                    {villages.map((v, i) => <option key={i} value={v.village}>{v.village}</option>)}
                  </select>

                  <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                    <FaSearch className="text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search agent name..."
                      value={agentFilters.search}
                      onChange={(e) => setAgentFilters({ ...agentFilters, search: e.target.value })}
                      className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-500 font-bold"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setAgentFilters({ search: "", district_id: "", mandal: "", village: "" });
                        setMandals([]);
                        setVillages([]);
                      }}
                      className="p-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm"
                      title="Clear Filters"
                    >
                      <FaTimes />
                    </button>
                    <div className="h-8 w-px bg-gray-200 mx-1"></div>
                    <button
                      onClick={handleExportAgentsExcel}
                      className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-bold hover:bg-green-600 hover:text-white transition-all shadow-sm"
                    >
                      <FaFileExcel /> Export
                    </button>
                    <button
                      onClick={handleExportAgentsPDF}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    >
                      <FaFilePdf /> PDF
                    </button>
                  </div>
                </div>

                {/* Agents List Table */}
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 text-left border-b border-gray-100">
                          <th className="p-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Agent</th>
                          <th className="p-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact</th>
                          <th className="p-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</th>
                          <th className="p-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Performance</th>
                          <th className="p-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                          <th className="p-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {paginatedAgents.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="p-8 text-center text-gray-500 font-bold text-sm">
                              No agents found
                            </td>
                          </tr>
                        ) : (
                          paginatedAgents.map((agent) => (
                            <tr key={agent.id} className="hover:bg-gray-50/30 transition-colors group">
                              <td className="p-3 cursor-pointer" onClick={() => { setSelectedAgent(agent); setShowAgentLeads(true); }}>
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold overflow-hidden border-2 border-white shadow-sm transition-transform group-hover:scale-105">
                                    {agent.profile_photo ? (
                                      <img src={`${API_URL.replace(/\/api\/?$/, "")}/${agent.profile_photo}`} alt="" className="w-full h-full object-cover" />
                                    ) : agent.full_name?.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="font-black text-gray-900 group-hover:text-orange-600 transition-colors">{agent.full_name}</div>
                                    <div className="text-[10px] text-gray-400 font-bold">{agent.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                  <FaPhone className="text-orange-500 text-xs" /> {agent.phone}
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="flex items-start gap-1">
                                  <FaMapMarkerAlt className="text-orange-500 text-xs mt-1" />
                                  <div>
                                    <div className="text-xs font-black text-gray-900">{agent.mandal?.name || agent.mandal || 'N/A'}, {agent.village || 'N/A'}</div>
                                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{agent.district?.name}, {agent.state?.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-4">
                                  <div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase">Leads</div>
                                    <div className="text-sm font-black text-gray-900">{leads.filter(l => l.agent_id == agent.id).length}</div>
                                  </div>
                                  <div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase">Won</div>
                                    <div className="text-sm font-black text-green-600">{leads.filter(l => l.agent_id == agent.id && l.status === 'WON').length}</div>
                                  </div>
                                  <div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase">Revenue</div>
                                    <div className="text-sm font-black text-blue-600">
                                      ₹{leads.filter(l => l.agent_id == agent.id).reduce((sum, l) => sum + (parseFloat(l.paid_amount) || 0), 0).toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${agent.status === "ACTIVE" ? "bg-green-100 text-green-600" :
                                  agent.status === "PENDING" ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-600"
                                  }`}>
                                  {agent.status}
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                <div className="flex justify-end gap-2">
                                  <button onClick={() => { setViewAgent(agent); setShowViewAgent(true); }} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="View Details"><FaEye size={14} /></button>
                                  <button onClick={() => handleEditAgent(agent)} className="p-2.5 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-600 hover:text-white transition-all shadow-sm" title="Edit Agent"><FaEdit size={14} /></button>
                                  <button
                                    onClick={() => toggleAgentStatus(agent.id, agent.status)}
                                    className={`p-2.5 rounded-xl transition-all shadow-sm ${agent.status === 'ACTIVE'
                                      ? "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                                      : "bg-green-50 text-green-600 hover:bg-green-600 hover:text-white"
                                      }`}
                                    title={agent.status === 'ACTIVE' ? "Deactivate" : "Activate"}
                                  >
                                    {agent.status === 'ACTIVE' ? <FaUserTimes size={14} /> : <FaUserCheck size={14} />}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>

                    {/* Pagination */}
                    {agentsTotalPages > 1 && (
                      <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white">
                        <span className="text-sm text-gray-500 font-bold">
                          Page {agentsCurrentPage} of {agentsTotalPages}
                        </span>
                        <div className="flex gap-2">
                          <button
                            disabled={agentsCurrentPage === 1}
                            onClick={() => setAgentsCurrentPage(p => Math.max(1, p - 1))}
                            className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                          >
                            Previous
                          </button>
                          <button
                            disabled={agentsCurrentPage === agentsTotalPages}
                            onClick={() => setAgentsCurrentPage(p => Math.min(agentsTotalPages, p + 1))}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-sm"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === "profile" && <Profile onUpdate={(updatedUser) => setUser(updatedUser)} />}
          </div>
        </main>
      </div>

      {/* PORTALED MODALS - Rendered on body to avoid stacking issues */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {/* Agent Leads Modal */}
          {showAgentLeads && selectedAgent && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-[2rem] p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
                <button onClick={() => setShowAgentLeads(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <FaTimes className="text-xl text-gray-400" />
                </button>
                <div className="mb-6">
                  <h3 className="text-2xl font-black text-gray-900">{selectedAgent.full_name}'s Leads</h3>
                  <p className="text-sm text-gray-500 mt-1">{leads.filter((l) => l.agent_id == selectedAgent.id).length} total leads assigned</p>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50/50 p-6 rounded-[2rem] text-center border border-blue-100 shadow-sm shadow-blue-50">
                    <p className="text-3xl font-black text-blue-600 mb-1">{leads.filter((l) => l.agent_id == selectedAgent.id).length}</p>
                    <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest">Total Leads</p>
                  </div>
                  <div className="bg-green-50/50 p-6 rounded-[2rem] text-center border border-green-100 shadow-sm shadow-green-50">
                    <p className="text-3xl font-black text-green-600 mb-1">{leads.filter((l) => l.agent_id == selectedAgent.id && l.status === "WON").length}</p>
                    <p className="text-[10px] text-green-400 font-black uppercase tracking-widest">Won Deals</p>
                  </div>
                  <div className="bg-orange-50/50 p-6 rounded-[2rem] text-center border border-orange-100 shadow-sm shadow-orange-50">
                    <p className="text-3xl font-black text-orange-600 mb-1">
                      ₹{leads.filter((l) => l.agent_id == selectedAgent.id).reduce((sum, l) => sum + (parseFloat(l.paid_amount) || 0), 0).toFixed(0)}
                    </p>
                    <p className="text-[10px] text-orange-400 font-black uppercase tracking-widest">Total Revenue</p>
                  </div>
                </div>

                {leads.filter((l) => l.agent_id == selectedAgent.id).length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl">
                    <p className="text-gray-500 font-bold">No leads assigned yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-gray-100">
                    <table className="w-full">
                      <thead className="bg-orange-50/50">
                        <tr className="text-left border-b border-orange-100">
                          <th className="px-6 py-4 text-[10px] font-black text-orange-600 uppercase tracking-widest">ID</th>
                          <th className="px-6 py-4 text-[10px] font-black text-orange-600 uppercase tracking-widest">Client</th>
                          <th className="px-6 py-4 text-[10px] font-black text-orange-600 uppercase tracking-widest">Service</th>
                          <th className="px-6 py-4 text-[10px] font-black text-orange-600 uppercase tracking-widest">Status</th>
                          <th className="px-6 py-4 text-[10px] font-black text-orange-600 uppercase tracking-widest">Payment</th>
                          <th className="px-6 py-4 text-[10px] font-black text-orange-600 uppercase tracking-widest">Amount</th>
                          <th className="px-6 py-4 text-[10px] font-black text-orange-600 uppercase tracking-widest">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {leads.filter((l) => l.agent_id == selectedAgent.id).map((lead) => (
                          <tr key={lead.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-500">#{lead.id}</td>
                            <td className="px-4 py-3">
                              <div className="font-bold text-gray-900 text-sm">{lead.client_name}</div>
                              <div className="text-xs text-gray-500">{lead.client_phone}</div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 font-bold">{lead.service_type}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-black uppercase ${getStatusColor(lead.status)}`}>
                                {lead.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-black uppercase ${getStatusColor(lead.payment_status)}`}>
                                {lead.payment_status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm font-bold text-gray-700">
                              {lead.total_amount > 0 ? `₹${lead.paid_amount || 0} / ₹${lead.total_amount}` : "—"}
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500 font-medium">{new Date(lead.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            </div>
          )}

          {/* Create Agent Modal */}
          {showCreateAgent && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl relative">
                <button onClick={() => setShowCreateAgent(false)} className="absolute top-4 right-6 text-gray-400 hover:text-gray-600">
                  <FaTimes size={20} />
                </button>
                <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-sm"><FaUserPlus size={20} /></div>
                  Create New Agent
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest ml-1">Full Name *</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaUser size={14} /></div>
                      <input type="text" placeholder="Enter full name" value={agentForm.fullName} onChange={(e) => setAgentForm({ ...agentForm, fullName: e.target.value })} className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold" />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest ml-1">Email *</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaUser size={14} /></div>
                      <input type="email" placeholder="Enter email address" value={agentForm.email} onChange={(e) => setAgentForm({ ...agentForm, email: e.target.value })} className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold" />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest ml-1">Phone *</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaPhone size={14} /></div>
                      <input type="tel" placeholder="10-digit number" value={agentForm.phone} onChange={(e) => setAgentForm({ ...agentForm, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold" />
                    </div>
                  </div>

                  {/* Alternate Phone */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest ml-1">Alternate Phone</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaPhone size={14} /></div>
                      <input type="tel" placeholder="Optional alternate phone" value={agentForm.alternatePhone} onChange={(e) => setAgentForm({ ...agentForm, alternatePhone: e.target.value.replace(/\D/g, "").slice(0, 10) })} className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold" />
                    </div>
                  </div>

                  {/* Districts (Prefilled state triggers this) */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest ml-1">District</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaMapMarkerAlt size={14} /></div>
                      <select value={agentForm.district_id} onChange={(e) => {
                        const id = e.target.value;
                        const name = districts.find(d => d.id == id)?.name;
                        setAgentForm({ ...agentForm, district_id: id, district: name, mandal_id: "", village: "" });
                        fetchMandals(user.state_id, id);
                      }} className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold appearance-none">
                        <option value="">Select District</option>
                        {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Mandals */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest ml-1">Mandal</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaMapMarkerAlt size={14} /></div>
                      <select value={agentForm.mandal_id} onChange={(e) => {
                        const id = e.target.value;
                        setAgentForm({ ...agentForm, mandal_id: id, village: "" });
                        fetchVillages(user.state_id, agentForm.district_id, id);
                      }} disabled={!agentForm.district_id} className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold appearance-none disabled:opacity-50">
                        <option value="">Select Mandal</option>
                        {mandals.map((m, i) => <option key={i} value={m.id}>{m.mandal}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Villages */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest ml-1">Village</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaMapMarkerAlt size={14} /></div>
                      <input type="text" value={agentForm.village} onChange={(e) => setAgentForm({ ...agentForm, village: e.target.value })} placeholder="Enter Village" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold" />
                    </div>
                  </div>

                  {/* Aadhar */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest ml-1">Aadhar Number</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaIdCard size={14} /></div>
                      <input type="text" placeholder="12-digit number" value={agentForm.aadharNumber} onChange={(e) => setAgentForm({ ...agentForm, aadharNumber: e.target.value.replace(/\D/g, "").slice(0, 12) })} className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold" />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest ml-1">Password *</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaIdCard size={14} /></div>
                      <input type="password" placeholder="Enter secure password" value={agentForm.password} onChange={(e) => setAgentForm({ ...agentForm, password: e.target.value })} className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold" />
                    </div>
                  </div>

                  {/* Profile Photo */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest ml-1">Profile Photo</label>
                    <input type="file" accept="image/*" onChange={(e) => setAgentForm({ ...agentForm, profilePhoto: e.target.files[0] })} className="w-full py-2 text-sm text-gray-500 font-bold" />
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <button onClick={() => setShowCreateAgent(false)} className="px-6 py-3 bg-gray-100 text-gray-500 rounded-xl font-bold hover:bg-gray-200 transition-all">Cancel</button>
                  <button onClick={createAgent} disabled={loading} className="px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all disabled:opacity-50">{loading ? "Saving..." : "Create Agent"}</button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Edit Agent Modal */}
          {showEditAgent && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl relative">
                <button onClick={() => setShowEditAgent(false)} className="absolute top-4 right-6 text-gray-400 hover:text-gray-600">
                  <FaTimes size={20} />
                </button>
                <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-sm"><FaEdit size={20} /></div>
                  Edit Agent Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest ml-1">Full Name *</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaUser size={14} /></div>
                      <input type="text" placeholder="Enter full name" value={editAgentForm.fullName} onChange={(e) => setEditAgentForm({ ...editAgentForm, fullName: e.target.value })} className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold" />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest ml-1">Email *</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaUser size={14} /></div>
                      <input type="email" placeholder="Enter email address" value={editAgentForm.email} onChange={(e) => setEditAgentForm({ ...editAgentForm, email: e.target.value })} className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold" />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest ml-1">Phone *</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaPhone size={14} /></div>
                      <input type="tel" placeholder="10-digit number" value={editAgentForm.phone} onChange={(e) => setEditAgentForm({ ...editAgentForm, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold" />
                    </div>
                  </div>

                  {/* Alternate Phone */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest ml-1">Alternate Phone</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaPhone size={14} /></div>
                      <input type="tel" placeholder="Optional alternate phone" value={editAgentForm.alternatePhone} onChange={(e) => setEditAgentForm({ ...editAgentForm, alternatePhone: e.target.value.replace(/\D/g, "").slice(0, 10) })} className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold" />
                    </div>
                  </div>

                  {/* Districts */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest ml-1">District</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaMapMarkerAlt size={14} /></div>
                      <select value={editAgentForm.district_id} onChange={(e) => {
                        const id = e.target.value;
                        const name = districts.find(d => d.id == id)?.name;
                        setEditAgentForm({ ...editAgentForm, district_id: id, district: name, mandal_id: "", village: "" });
                        fetchMandals(user.state_id, id);
                      }} className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold appearance-none">
                        <option value="">Select District</option>
                        {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Mandals */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest ml-1">Mandal</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaMapMarkerAlt size={14} /></div>
                      <select value={editAgentForm.mandal_id} onChange={(e) => {
                        const id = e.target.value;
                        setEditAgentForm({ ...editAgentForm, mandal_id: id, village: "" });
                        fetchVillages(user.state_id, editAgentForm.district_id, id);
                      }} disabled={!editAgentForm.district_id} className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold appearance-none disabled:opacity-50">
                        <option value="">Select Mandal</option>
                        {mandals.map((m, i) => <option key={i} value={m.id}>{m.mandal}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Villages */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest ml-1">Village</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaMapMarkerAlt size={14} /></div>
                      <input type="text" value={editAgentForm.village} onChange={(e) => setEditAgentForm({ ...editAgentForm, village: e.target.value })} placeholder="Enter Village" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold" />
                    </div>
                  </div>

                  {/* Aadhar */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest ml-1">Aadhar Number</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaIdCard size={14} /></div>
                      <input type="text" placeholder="12-digit number" value={editAgentForm.aadharNumber} onChange={(e) => setEditAgentForm({ ...editAgentForm, aadharNumber: e.target.value.replace(/\D/g, "").slice(0, 12) })} className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold" />
                    </div>
                  </div>

                  {/* Status selection */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest ml-1">Status</label>
                    <select value={editAgentForm.status} onChange={(e) => setEditAgentForm({ ...editAgentForm, status: e.target.value })} className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold cursor-pointer">
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                      <option value="PENDING">PENDING</option>
                    </select>
                  </div>

                  {/* Password (Optional for reset) */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest ml-1">Password (Leave blank to keep current)</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaIdCard size={14} /></div>
                      <input type="password" placeholder="Enter new password" value={editAgentForm.password} onChange={(e) => setEditAgentForm({ ...editAgentForm, password: e.target.value })} className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold" />
                    </div>
                  </div>

                  {/* Profile Photo */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest ml-1">Profile Photo</label>
                    <input type="file" accept="image/*" onChange={(e) => setEditAgentForm({ ...editAgentForm, profilePhoto: e.target.files[0] })} className="w-full py-2 text-sm text-gray-500 font-bold" />
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <button onClick={() => setShowEditAgent(false)} className="px-6 py-3 bg-gray-100 text-gray-500 rounded-xl font-bold hover:bg-gray-200 transition-all">Cancel</button>
                  <button onClick={updateAgent} disabled={loading} className="px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all disabled:opacity-50">{loading ? "Saving..." : "Save Changes"}</button>
                </div>
              </motion.div>
            </div>
          )}

          {/* View Agent Modal */}
          {showViewAgent && viewAgent && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[2.5rem] p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl relative">
                <button onClick={() => setShowViewAgent(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <FaTimes className="text-xl text-gray-400" />
                </button>
                <h3 className="text-2xl font-black text-gray-900 mb-6">Agent Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-orange-50 p-4 rounded-2xl">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                      {viewAgent.profile_photo ? (
                        <img src={`${API_URL.replace(/\/api\/?$/, "")}/${viewAgent.profile_photo}`} alt="" className="w-full h-full object-cover" />
                      ) : viewAgent.full_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-gray-900">{viewAgent.full_name}</h2>
                      <p className="text-xs text-gray-500 font-bold">{viewAgent.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider mb-1">Phone</p>
                      <p className="text-gray-900 font-bold">{viewAgent.phone}</p>
                    </div>
                    {viewAgent.alternate_phone && (
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider mb-1">Alternate Phone</p>
                        <p className="text-gray-900 font-bold">{viewAgent.alternate_phone}</p>
                      </div>
                    )}
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider mb-1">Location Details</p>
                      <p className="text-gray-900 font-bold">Mandal: {viewAgent.mandal?.name || viewAgent.mandal || 'N/A'}, Village: {viewAgent.village || 'N/A'}</p>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">{viewAgent.district?.name}, {viewAgent.state?.name}</p>
                    </div>
                    {viewAgent.aadhar_number && (
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider mb-1">Aadhar Number</p>
                        <p className="text-gray-900 font-bold">{viewAgent.aadhar_number}</p>
                      </div>
                    )}
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider mb-1">Current Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${getStatusColor(viewAgent.status)}`}>{viewAgent.status}</span>
                    </div>
                  </div>

                  <button onClick={() => setShowViewAgent(false)} className="w-full py-4 bg-gray-200 text-gray-700 rounded-2xl font-black hover:bg-gray-300 transition-all uppercase tracking-widest text-xs mt-4 shadow-sm">Close</button>
                </div>
              </motion.div>
            </div>
          )}

          {/* View Lead Modal */}
          {showViewLead && viewLead && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[2.5rem] p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl relative">
                <button onClick={() => setShowViewLead(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <FaTimes className="text-xl text-gray-400" />
                </button>
                <h3 className="text-2xl font-black text-gray-900 mb-6">Lead Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-orange-50 p-4 rounded-2xl">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {viewLead.client_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-gray-900">{viewLead.client_name}</h2>
                      <p className="text-xs text-gray-500 font-bold">{viewLead.client_phone}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {viewLead.client_email && (
                      <div className="bg-gray-50 p-4 rounded-xl md:col-span-2">
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider mb-1">Email</p>
                        <p className="text-gray-900 font-bold">{viewLead.client_email}</p>
                      </div>
                    )}
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider mb-1">Service Required</p>
                      <p className="text-gray-900 font-bold">{viewLead.service_type}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider mb-1">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${getStatusColor(viewLead.status)}`}>{viewLead.status}</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider mb-1">Payment Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${getStatusColor(viewLead.payment_status)}`}>{viewLead.payment_status}</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider mb-1">Amount Paid / Total</p>
                      <p className="text-gray-900 font-bold">₹{viewLead.paid_amount || 0} / ₹{viewLead.total_amount || 0}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl md:col-span-2">
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider mb-1">Project Brief</p>
                      <p className="text-gray-900 font-medium whitespace-pre-wrap">{viewLead.project_brief || "No description provided."}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl md:col-span-2">
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider mb-1">Lead Address</p>
                      <p className="text-gray-900 font-medium">{viewLead.exact_location || "Not mapped."}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl md:col-span-2">
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider mb-1">Assigned Agent</p>
                      <p className="text-gray-900 font-bold">{viewLead.agent?.full_name || "Unknown Agent"}</p>
                      <p className="text-xs text-gray-400 mt-1">{viewLead.agent?.email}</p>
                    </div>
                  </div>

                  <button onClick={() => setShowViewLead(false)} className="w-full py-4 bg-gray-200 text-gray-700 rounded-2xl font-black hover:bg-gray-300 transition-all uppercase tracking-widest text-xs mt-4 shadow-sm">Close</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      , document.body)}
    </div>
  );
}
