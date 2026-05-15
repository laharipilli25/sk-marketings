import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUsers,
  FaClipboardList,
  FaEnvelope,
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
  FaExchangeAlt,
  FaIdCard,
  FaTrash,
  FaUser,
  FaFileAlt,
  FaMoneyBill,
  FaReceipt,
  FaMapPin,
  FaChartPie,
  FaTimes,
  FaLock,
  FaEnvelopeOpenText,
} from "react-icons/fa";
import Dashboard from "../components/Dashboard";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import Profile from "./Profile";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, leads, agents, inquiries
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalAgents: 0,
    pendingAgents: 0,
    newInquiries: 0,
  });
  const [filterAgent, setFilterAgent] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Paginated Leads State
  const [paginatedLeads, setPaginatedLeads] = useState([]);
  const [leadsCurrentPage, setLeadsCurrentPage] = useState(1);
  const [leadsTotalPages, setLeadsTotalPages] = useState(1);

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Create Agent Modal
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [agentForm, setAgentForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    state_id: "",
    state: "",
    district_id: "",
    district: "",
    mandal: "",
    village: "",
    pincode: "",
  });

  const [mandalSuggestions, setMandalSuggestions] = useState([]);
  const [pincodeLoading, setPincodeLoading] = useState(false);

  // Agent Leads Modal
  const [showAgentLeads, setShowAgentLeads] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);

  const handleViewAgentLeads = (agent) => {
    setSelectedAgent(agent);
    setShowAgentLeads(true);
  };

  // View Inquiry Modal
  const [showViewInquiry, setShowViewInquiry] = useState(false);
  const [viewInquiry, setViewInquiry] = useState(null);

  // View Agent Modal
  const [showViewAgent, setShowViewAgent] = useState(false);
  const [viewAgent, setViewAgent] = useState(null);

  // Edit Agent Modal
  const [showEditAgent, setShowEditAgent] = useState(false);
  const [editAgentForm, setEditAgentForm] = useState({
    id: "",
    fullName: "",
    email: "",
    phone: "",
    state_id: "",
    state: "",
    district_id: "",
    district: "",
    mandal: "",
    village: "",
    aadharNumber: "",
    alternatePhone: "",
    status: "",
    pincode: "",
  });

  // Location Data
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [mandals, setMandals] = useState([]);
  const [villages, setVillages] = useState([]);

  // Agent Filters & Search
  const [agentFilters, setAgentFilters] = useState({
    search: "",
    state_id: "",
    district_id: "",
    mandal: "",
    village: ""
  });

  useEffect(() => {
    fetchStates();
  }, []);

  const handlePincodeLookup = async (pincode, isEdit = false) => {
    if (pincode.length === 6) {
      setPincodeLoading(true);
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();

        if (data[0].Status === "Success") {
          const postOffices = data[0].PostOffice;
          const apiState = postOffices[0].State;
          const apiDistrict = postOffices[0].District;

          setMandalSuggestions(postOffices.map(po => po.Name));

          // Find and set State
          const foundState = states.find(s => s.name.toUpperCase() === apiState.toUpperCase());
          if (foundState) {
            if (isEdit) {
              setEditAgentForm(prev => ({ ...prev, state_id: foundState.id, state: foundState.name }));
            } else {
              setAgentForm(prev => ({ ...prev, state_id: foundState.id, state: foundState.name }));
            }

            // Fetch and set District
            const distResponse = await fetch(`${API_URL}/auth/districts/${foundState.id}`);
            if (distResponse.ok) {
              const distData = await distResponse.json();
              setDistricts(distData);
              const foundDist = distData.find(d => d.name.toUpperCase() === apiDistrict.toUpperCase());
              if (foundDist) {
                if (isEdit) {
                  setEditAgentForm(prev => ({ ...prev, district_id: foundDist.id, district: foundDist.name }));
                } else {
                  setAgentForm(prev => ({ ...prev, district_id: foundDist.id, district: foundDist.name }));
                }
              }
            }
          }
        }
      } catch (err) {
        console.error("Pincode API Error:", err);
      } finally {
        setPincodeLoading(false);
      }
    }
  };

  const fetchStates = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/states`);
      if (response.ok) {
        const data = await response.json();
        setStates(data);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!storedUser || !token) {
      navigate("/user-login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "ADMIN") {
      navigate("/user-login");
      return;
    }
    setUser(parsedUser);
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === "leads" || activeTab === "dashboard") fetchLeads();
    if (activeTab === "agents" || activeTab === "dashboard") fetchAgents();
    if (activeTab === "inquiries" || activeTab === "dashboard") fetchInquiries();
  }, [activeTab]);

  // Handle server-side pagination for Leads Table
  useEffect(() => {
    setLeadsCurrentPage(1);
  }, [filterAgent, filterStatus, searchQuery]);

  useEffect(() => {
    if (activeTab === "leads") {
      const timer = setTimeout(() => {
        fetchPaginatedLeads(leadsCurrentPage);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeTab, filterAgent, filterStatus, searchQuery, leadsCurrentPage]);

  const fetchDashboardData = async () => {
    await Promise.all([fetchLeads(), fetchAgents(), fetchInquiries()]);
  };

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/leads/all?limit=10000`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads || []);
        setStats((prev) => ({ ...prev, totalLeads: data.leads?.length || 0 }));
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

      const response = await fetch(`${API_URL}/leads/all?${queryParams.toString()}`, {
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

  const fetchAgents = async (filters = agentFilters) => {
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append("search", filters.search);
      if (filters.state_id) queryParams.append("state_id", filters.state_id);
      if (filters.district_id) queryParams.append("district_id", filters.district_id);
      if (filters.mandal) queryParams.append("mandal", filters.mandal);
      if (filters.village) queryParams.append("village", filters.village);

      const response = await fetch(`${API_URL}/auth/agents?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setAgents(data.agents || []);
        const pending = data.agents?.filter((a) => a.status === "PENDING").length || 0;
        setStats((prev) => ({
          ...prev,
          totalAgents: data.agents?.length || 0,
          pendingAgents: pending,
        }));
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  const toggleAgentStatus = async (agentId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/auth/agents/${agentId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchAgents(agentFilters); // Refresh list with current filters
      }
    } catch (error) {
      console.error("Error toggling agent status:", error);
    }
  };

  const fetchInquiries = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/inquiries`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setInquiries(data.inquiries || []);
        const newCount = data.inquiries?.filter((i) => i.status === "NEW").length || 0;
        setStats((prev) => ({ ...prev, newInquiries: newCount }));
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/user-login");
  };

  const updateAgentStatus = async (agentId, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/auth/agents/${agentId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchAgents(agentFilters);
      } else {
        alert("Failed to update agent status");
      }
    } catch (error) {
      alert("Network error");
    }
  };

  const createAgent = async () => {
    if (!agentForm.fullName || !agentForm.email || !agentForm.phone || !agentForm.password) {
      alert("Please fill all required fields");
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
      formData.append("status", "ACTIVE");
      if (agentForm.state_id) formData.append("state_id", agentForm.state_id);
      if (agentForm.district_id) formData.append("district_id", agentForm.district_id);
      if (agentForm.mandal) formData.append("mandal", agentForm.mandal);
      if (agentForm.village) formData.append("village", agentForm.village);
      if (agentForm.aadharNumber) formData.append("aadharNumber", agentForm.aadharNumber);
      if (agentForm.alternatePhone) formData.append("alternatePhone", agentForm.alternatePhone);
      if (agentForm.profilePhoto instanceof File) formData.append("profilePhoto", agentForm.profilePhoto);

      const response = await fetch(`${API_URL}/auth/create-agent`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        alert("Agent created successfully!");
        setShowCreateAgent(false);
        setAgentForm({
          fullName: "",
          email: "",
          phone: "",
          password: "",
          state: "",
          district: "",
          mandal: "",
          village: "",
        });
        fetchAgents();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to create agent");
      }
    } catch (error) {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  // View Agent Details
  const handleViewAgent = (agent) => {
    setViewAgent(agent);
    setShowViewAgent(true);
  };

  // Edit Agent
  const handleEditAgent = (agent) => {
    setEditAgentForm({
      id: agent.id,
      fullName: agent.full_name,
      email: agent.email,
      phone: agent.phone,
      state_id: agent.state_id || "",
      state: agent.state || "",
      district_id: agent.district_id || "",
      district: agent.district || "",
      mandal: agent.mandal || "",
      village: agent.village || "",
      aadharNumber: agent.aadhar_number || "",
      alternatePhone: agent.alternate_phone || "",
      status: agent.status,
      profilePhoto: agent.profile_photo || null,
    });

    if (agent.state_id) fetchDistricts(agent.state_id);
    if (agent.state_id && agent.district_id) fetchMandals(agent.state_id, agent.district_id);
    if (agent.state_id && agent.district_id && agent.mandal) fetchVillages(agent.state_id, agent.district_id, agent.mandal);

    setShowEditAgent(true);
  };

  const updateAgent = async () => {
    if (!editAgentForm.fullName || !editAgentForm.email || !editAgentForm.phone) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("fullName", editAgentForm.fullName);
      formData.append("email", editAgentForm.email);
      formData.append("phone", editAgentForm.phone);
      if (editAgentForm.state_id) formData.append("state_id", editAgentForm.state_id);
      if (editAgentForm.district_id) formData.append("district_id", editAgentForm.district_id);
      if (editAgentForm.mandal) formData.append("mandal", editAgentForm.mandal);
      if (editAgentForm.village) formData.append("village", editAgentForm.village);
      if (editAgentForm.aadharNumber) formData.append("aadharNumber", editAgentForm.aadharNumber);
      if (editAgentForm.alternatePhone) formData.append("alternatePhone", editAgentForm.alternatePhone);
      if (editAgentForm.status) formData.append("status", editAgentForm.status);
      if (editAgentForm.password) formData.append("password", editAgentForm.password);
      if (editAgentForm.profilePhoto instanceof File) formData.append("profilePhoto", editAgentForm.profilePhoto);

      const response = await fetch(`${API_URL}/auth/agents/${editAgentForm.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        alert("Agent updated successfully!");
        setShowEditAgent(false);
        fetchAgents();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to update agent");
      }
    } catch (error) {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  // View Lead
  const [showViewLead, setShowViewLead] = useState(false);
  const [viewLead, setViewLead] = useState(null);

  // Edit Lead
  const [showEditLead, setShowEditLead] = useState(false);
  const [editLeadGpsLoading, setEditLeadGpsLoading] = useState(false);
  const [editLeadForm, setEditLeadForm] = useState({
    id: "",
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    exactLocation: "",
    latitude: "",
    longitude: "",
    serviceType: "",
    projectBrief: "",
    status: "",
    paymentStatus: "",
    totalAmount: "",
    paidAmount: "",
    paymentMethod: "",
    transactionId: "",
    paymentNotes: "",
    lostReason: "",
  });

  const handleViewLead = (lead) => {
    setViewLead(lead);
    setShowViewLead(true);
  };

  const handleEditLead = (lead) => {
    setEditLeadForm({
      id: lead.id,
      clientName: lead.client_name,
      clientPhone: lead.client_phone,
      clientEmail: lead.client_email || "",
      exactLocation: lead.exact_location || "",
      latitude: lead.latitude || "",
      longitude: lead.longitude || "",
      serviceType: lead.service_type || "",
      projectBrief: lead.project_brief || "",
      status: lead.status,
      paymentStatus: lead.payment_status,
      totalAmount: lead.total_amount || "",
      paidAmount: lead.paid_amount || "",
      paymentMethod: lead.payment_method || "",
      transactionId: lead.transaction_id || "",
      paymentNotes: lead.payment_notes || "",
      lostReason: lead.lost_reason || "",
    });
    setShowEditLead(true);
  };

  const captureEditLeadGPS = () => {
    setEditLeadGpsLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setEditLeadForm((f) => ({ ...f, latitude: pos.coords.latitude.toString(), longitude: pos.coords.longitude.toString() }));
          setEditLeadGpsLoading(false);
        },
        () => { alert("Unable to capture GPS."); setEditLeadGpsLoading(false); }
      );
    } else {
      alert("GPS not supported.");
      setEditLeadGpsLoading(false);
    }
  };

  const updateLead = async () => {
    if (!editLeadForm.clientName || !editLeadForm.clientPhone || !editLeadForm.serviceType) {
      alert("Please fill required fields: Client Name, Phone, Service Type");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/leads/${editLeadForm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          clientName: editLeadForm.clientName,
          clientPhone: editLeadForm.clientPhone,
          clientEmail: editLeadForm.clientEmail,
          exactLocation: editLeadForm.exactLocation,
          latitude: editLeadForm.latitude,
          longitude: editLeadForm.longitude,
          serviceType: editLeadForm.serviceType,
          projectBrief: editLeadForm.projectBrief,
          status: editLeadForm.status,
          paymentStatus: editLeadForm.paymentStatus,
          totalAmount: editLeadForm.totalAmount,
          paidAmount: editLeadForm.paidAmount,
          paymentMethod: editLeadForm.paymentMethod,
          transactionId: editLeadForm.transactionId,
          paymentNotes: editLeadForm.paymentNotes,
          lostReason: editLeadForm.lostReason,
        }),
      });

      if (response.ok) {
        alert("Lead updated successfully!");
        setShowEditLead(false);
        fetchLeads(); // Update overall counts
        fetchPaginatedLeads(leadsCurrentPage); // Update current table view
      } else {
        const data = await response.json();
        alert(data.message || "Failed to update lead");
      }
    } catch (error) {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleViewInquiry = (inquiry) => {
    setViewInquiry(inquiry);
    setShowViewInquiry(true);
  };

  const assignInquiry = async (inquiryId, agentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/inquiries/${inquiryId}/assign`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ agentId }),
      });

      if (response.ok) {
        fetchInquiries();
      } else {
        alert("Failed to assign inquiry");
      }
    } catch (error) {
      alert("Network error");
    }
  };

  const convertInquiryToLead = async (inquiryId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/inquiries/${inquiryId}/convert`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        alert("Inquiry converted to lead successfully!");
        fetchInquiries();
        fetchLeads();
      } else {
        alert("Failed to convert inquiry");
      }
    } catch (error) {
      alert("Network error");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-700",
      ACTIVE: "bg-green-100 text-green-700",
      INACTIVE: "bg-gray-100 text-gray-700",
      REJECTED: "bg-red-100 text-red-700",
      NEW: "bg-blue-100 text-blue-700",
      CONTACTED: "bg-yellow-100 text-yellow-700",
      CONVERTED: "bg-green-100 text-green-700",
      CLOSED: "bg-gray-100 text-gray-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };



  const activeAgents = agents.filter((a) => a.status === "ACTIVE");

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader
          title={activeTab === 'dashboard' ? 'Overview' : activeTab === 'leads' ? 'Lead Management' : activeTab === 'agents' ? 'Agent Management' : activeTab === 'inquiries' ? 'Contact Inquiries' : 'My Profile'}
          onMenuClick={() => setIsSidebarOpen(true)}
          setActiveTab={setActiveTab}
        />

        <main className="flex-1 overflow-y-auto p-4 pb-24 md:p-6 custom-scrollbar">
          <div className="relative">

            {/* DASHBOARD TAB */}
            {activeTab === "dashboard" && (
              <Dashboard
                role="ADMIN"
                leads={leads}
                agents={agents}
                inquiries={inquiries}
                stats={stats}
                onTabChange={setActiveTab}
              />
            )}

            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <Profile />
            )}

            {/* LEADS TAB */}
            {activeTab === "leads" && (
              <div className="space-y-6">
                {/* Module Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <StatCard icon={<FaClipboardList />} label="Total Leads" value={leads.length} color="bg-blue-500" />
                  <StatCard icon={<FaCheckCircle />} label="Won Leads" value={leads.filter(l => l.status === 'WON').length} color="bg-green-500" />
                  <StatCard icon={<FaTimesCircle />} label="Lost Leads" value={leads.filter(l => l.status === 'LOST').length} color="bg-red-500" />
                  <StatCard icon={<FaClock />} label="Pending Payments" value={leads.filter(l => l.payment_status === 'PENDING').length} color="bg-yellow-500" />
                </div>
                {/* Filters */}
                <div className="flex flex-wrap gap-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <FaFilter className="text-orange-500" />
                    <select
                      value={filterAgent}
                      onChange={(e) => setFilterAgent(e.target.value)}
                      className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                    >
                      <option value="all">All Agents</option>
                      {activeAgents.map((agent) => (
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
                      className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="NEW">New</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="FOLLOW_UP">Follow Up</option>
                      <option value="WON">Won</option>
                      <option value="LOST">Lost</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 flex-1">
                    <FaSearch className="text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name or phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                </div>

                {/* Leads Table */}
                <div className="bg-white/90 backdrop-blur-md rounded-[2rem] shadow-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-orange-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-orange-800 uppercase">ID</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-orange-800 uppercase">Client</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-orange-800 uppercase">Agent</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-orange-800 uppercase">Service</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-orange-800 uppercase">Status</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-orange-800 uppercase">Payment</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-orange-800 uppercase">Date</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-orange-800 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {paginatedLeads.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                              No leads found
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
                                <div className="text-sm text-gray-500">{lead.client_phone}</div>
                              </td>
                              <td className="px-6 py-4 text-sm">
                                {agents.find((a) => a.id === lead.agent_id)?.full_name || "Unknown"}
                              </td>
                              <td className="px-6 py-4 text-sm">{lead.service_type}</td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(lead.status)}`}>
                                  {lead.status}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(lead.payment_status)}`}>
                                  {lead.payment_status}
                                </span>
                                {lead.total_amount > 0 && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    ₹{lead.paid_amount || 0} / ₹{lead.total_amount}
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {new Date(lead.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleViewLead(lead)}
                                    className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                                    title="View Lead"
                                  >
                                    <FaEye size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleEditLead(lead)}
                                    className="p-2 text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-600 hover:text-white transition-all"
                                    title="Edit Lead"
                                  >
                                    <FaEdit size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>

                    {/* Pagination Controls */}
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

            {activeTab === "agents" && (
              <div className="space-y-6">
                {/* Module Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <StatCard icon={<FaUsers />} label="Total Agents" value={stats.totalAgents} color="bg-blue-500" />
                  <StatCard icon={<FaUserCheck />} label="Active Agents" value={agents.filter(a => a.status === 'ACTIVE').length} color="bg-green-500" />
                  <StatCard icon={<FaClock />} label="Pending Approvals" value={stats.pendingAgents} color="bg-yellow-500" />
                  <StatCard icon={<FaUserTimes />} label="Inactive Agents" value={agents.filter(a => a.status === 'INACTIVE').length} color="bg-gray-500" />
                </div>

                {/* Create Button */}
                <button
                  onClick={() => setShowCreateAgent(true)}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 transition-all shadow-lg"
                >
                  <FaUserPlus /> Create New Agent
                </button>

                {/* Filters */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-lg font-black text-gray-900">Filter Agents</h4>
                    <div className="relative group w-72">
                      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                      <input
                        type="text"
                        placeholder="Search agent name..."
                        value={agentFilters.search}
                        onChange={(e) => {
                          const newFilters = { ...agentFilters, search: e.target.value };
                          setAgentFilters(newFilters);
                          fetchAgents(newFilters);
                        }}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium outline-none focus:border-orange-500 focus:bg-white transition-all shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <select
                      value={agentFilters.state_id}
                      onChange={(e) => {
                        const id = e.target.value;
                        const newFilters = { ...agentFilters, state_id: id, district_id: "", mandal: "", village: "" };
                        setAgentFilters(newFilters);
                        fetchAgents(newFilters);
                        if (id) fetchDistricts(id);
                        else { setDistricts([]); setMandals([]); setVillages([]); }
                      }}
                      className="w-full py-2.5 px-4 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 outline-none focus:border-orange-500 shadow-sm appearance-none cursor-pointer"
                    >
                      <option value="">All States</option>
                      {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    <select
                      value={agentFilters.district_id}
                      onChange={(e) => {
                        const id = e.target.value;
                        const newFilters = { ...agentFilters, district_id: id, mandal: "", village: "" };
                        setAgentFilters(newFilters);
                        fetchAgents(newFilters);
                        if (id) fetchMandals(agentFilters.state_id, id);
                        else { setMandals([]); setVillages([]); }
                      }}
                      disabled={!agentFilters.state_id}
                      className="w-full py-2.5 px-4 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 outline-none focus:border-orange-500 shadow-sm appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">All Districts</option>
                      {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                    <select
                      value={agentFilters.mandal}
                      onChange={(e) => {
                        const name = e.target.value;
                        const newFilters = { ...agentFilters, mandal: name, village: "" };
                        setAgentFilters(newFilters);
                        fetchAgents(newFilters);
                        if (name) fetchVillages(agentFilters.state_id, agentFilters.district_id, name);
                        else setVillages([]);
                      }}
                      disabled={!agentFilters.district_id}
                      className="w-full py-2.5 px-4 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 outline-none focus:border-orange-500 shadow-sm appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">All Mandals</option>
                      {mandals.map((m, i) => <option key={i} value={m.mandal}>{m.mandal}</option>)}
                    </select>
                    <select
                      value={agentFilters.village}
                      onChange={(e) => {
                        const name = e.target.value;
                        const newFilters = { ...agentFilters, village: name };
                        setAgentFilters(newFilters);
                        fetchAgents(newFilters);
                      }}
                      disabled={!agentFilters.mandal}
                      className="w-full py-2.5 px-4 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 outline-none focus:border-orange-500 shadow-sm appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">All Villages</option>
                      {villages.map((v, i) => <option key={i} value={v.village}>{v.village}</option>)}
                    </select>
                    <button
                      onClick={() => {
                        const cleared = { search: "", state_id: "", district_id: "", mandal: "", village: "" };
                        setAgentFilters(cleared);
                        fetchAgents(cleared);
                        setDistricts([]);
                        setMandals([]);
                        setVillages([]);
                      }}
                      className="w-full py-2.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <FaTimes /> Clear Filters
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50/50 text-left border-b border-gray-100">
                          <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Agent</th>
                          <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact</th>
                          <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</th>
                          <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Performance</th>
                          <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                          <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {agents.map((agent) => (
                          <tr key={agent.id} className="hover:bg-gray-50/30 transition-colors group">
                            <td className="p-5 cursor-pointer" onClick={() => handleViewAgentLeads(agent)}>
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold overflow-hidden border-2 border-white shadow-sm transition-transform group-hover:scale-105">
                                  {agent.profile_photo ? (
                                    <img src={`${API_URL.replace(/\/api\/?$/, "")}/${agent.profile_photo}`} alt="" className="w-full h-full object-cover" />
                                  ) : agent.full_name?.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-black text-gray-900 group-hover:text-orange-600 transition-colors">{agent.full_name}</div>
                                  <div className="text-[10px] text-gray-400 font-medium">{agent.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-5">
                              <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                <FaPhone className="text-orange-500 text-xs" /> {agent.phone}
                              </div>
                            </td>
                            <td className="p-5">
                              <div className="flex items-start gap-1">
                                <FaMapMarkerAlt className="text-orange-500 text-xs mt-1" />
                                <div>
                                  <div className="text-xs font-black text-gray-900">{agent.mandal || 'N/A'}, {agent.village || 'N/A'}</div>
                                  <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{agent.district?.name}, {agent.state?.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-5">
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
                            <td className="p-5">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${agent.status === "ACTIVE" ? "bg-green-100 text-green-600" :
                                agent.status === "PENDING" ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-600"
                                }`}>
                                {agent.status}
                              </span>
                            </td>
                            <td className="p-5 text-right">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => { setViewAgent(agent); setShowViewAgent(true); }} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="View Details"><FaEye size={14} /></button>
                                <button onClick={() => handleEditAgent(agent)} className="p-2.5 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-600 hover:text-white transition-all shadow-sm" title="Edit Agent"><FaEdit size={14} /></button>
                                {agent.status === 'PENDING' ? (
                                  <>
                                    <button
                                      onClick={() => updateAgentStatus(agent.id, "ACTIVE")}
                                      className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                      title="Accept Agent"
                                    >
                                      <FaCheck size={14} />
                                    </button>
                                    <button
                                      onClick={() => updateAgentStatus(agent.id, "REJECTED")}
                                      className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                      title="Reject Agent"
                                    >
                                      <FaTimes size={14} />
                                    </button>
                                  </>
                                ) : (
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
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* INQUIRIES TAB */}
            {activeTab === "inquiries" && (
              <div className="space-y-6">
                {/* Module Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <StatCard icon={<FaEnvelope />} label="Total Inquiries" value={inquiries.length} color="bg-blue-500" />
                  <StatCard icon={<FaEnvelopeOpenText />} label="New Inquiries" value={stats.newInquiries} color="bg-purple-500" />
                  <StatCard icon={<FaCheckCircle />} label="Converted" value={inquiries.filter(i => i.status === 'CONVERTED').length} color="bg-green-500" />
                  <StatCard icon={<FaTimesCircle />} label="Rejected" value={inquiries.filter(i => i.status === 'REJECTED').length} color="bg-red-500" />
                </div>
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50/50 text-left border-b border-gray-100">
                          <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID</th>
                          <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Details</th>
                          <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Service</th>
                          <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</th>
                          <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                          <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                          <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Assignment / Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {inquiries.map((inquiry) => (
                          <tr key={inquiry.id} className="hover:bg-gray-50/30 transition-colors group">
                            <td className="p-5 text-sm font-black text-gray-400">#{inquiry.id}</td>
                            <td className="p-5">
                              <div className="font-black text-gray-900">{inquiry.name}</div>
                              <div className="flex items-center gap-1 text-[10px] text-orange-600 font-bold">
                                <FaPhone size={8} /> {inquiry.phone}
                              </div>
                            </td>
                            <td className="p-5">
                              <div className="text-sm font-black text-gray-900">{inquiry.service_required}</div>
                              <div className="text-[10px] text-gray-400 italic">"{inquiry.message?.substring(0, 30)}..."</div>
                            </td>
                            <td className="p-5">
                              <div className="text-xs font-bold text-gray-700">{inquiry.location || 'Madanapalli'}</div>
                            </td>
                            <td className="p-5">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${inquiry.status === "NEW" ? "bg-blue-100 text-blue-600" :
                                inquiry.status === "CONTACTED" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                                }`}>
                                {inquiry.status}
                              </span>
                            </td>
                            <td className="p-5">
                              <div className="text-[10px] text-gray-500 font-bold uppercase">
                                {new Date(inquiry.created_at).toLocaleDateString()}<br />
                                {new Date(inquiry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </td>
                            <td className="p-5">
                              <div className="flex items-center gap-2">
                                {inquiry.assigned_agent_id ? (
                                  <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-[10px] font-black">
                                    <FaUser size={10} /> {agents.find(a => a.id === inquiry.assigned_agent_id)?.full_name}
                                  </div>
                                ) : (
                                  <select
                                    onChange={(e) => e.target.value && assignInquiry(inquiry.id, e.target.value)}
                                    className="bg-orange-50 text-orange-700 border-none rounded-lg px-3 py-1.5 text-[10px] font-black outline-none appearance-none cursor-pointer hover:bg-orange-100 transition-all"
                                  >
                                    <option value="">Assign Agent...</option>
                                    {agents.map(a => <option key={a.id} value={a.id}>{a.full_name}</option>)}
                                  </select>
                                )}
                                <button onClick={() => handleViewInquiry(inquiry)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                                  <FaEye size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* MODALS SECTION - Higher Z-Index to cover Sidebar/Header */}
        <div className="relative z-[100]">

          {/* Agent Leads Modal */}
          {showAgentLeads && selectedAgent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2rem] p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">
                      {selectedAgent.full_name}'s Leads
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {leads.filter((l) => l.agent_id == selectedAgent.id).length} total leads
                    </p>
                  </div>
                  <button onClick={() => setShowAgentLeads(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <FaTimesCircle className="text-2xl text-gray-400" />
                  </button>
                </div>

                {/* Agent summary */}
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

                {/* Leads table */}
                {leads.filter((l) => l.agent_id == selectedAgent.id).length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl">
                    <p className="text-gray-500 font-bold">No leads yet for this agent</p>
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
                        {leads
                          .filter((l) => l.agent_id == selectedAgent.id)
                          .map((lead) => (
                            <tr key={lead.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-500">#{lead.id}</td>
                              <td className="px-4 py-3">
                                <div className="font-bold text-gray-900 text-sm">{lead.client_name}</div>
                                <div className="text-xs text-gray-500">{lead.client_phone}</div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">{lead.service_type}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(lead.status)}`}>
                                  {lead.status}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(lead.payment_status)}`}>
                                  {lead.payment_status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {lead.total_amount > 0 ? (
                                  <span className="text-gray-700">₹{lead.paid_amount || 0} / ₹{lead.total_amount}</span>
                                ) : <span className="text-gray-400">—</span>}
                              </td>
                              <td className="px-4 py-3 text-xs text-gray-500">
                                {new Date(lead.created_at).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <button
                  onClick={() => setShowAgentLeads(false)}
                  className="w-full py-5 bg-gray-100 text-gray-500 rounded-[2rem] font-black hover:bg-gray-200 transition-all mt-8 uppercase tracking-[0.2em] text-xs shadow-inner"
                >
                  Close
                </button>
              </motion.div>
            </div>
          )}

          {/* View Inquiry Modal */}
          {showViewInquiry && viewInquiry && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2.5rem] p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-gray-900">Inquiry Details</h3>
                  <button onClick={() => setShowViewInquiry(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <FaTimesCircle className="text-2xl text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center gap-4 bg-orange-50 p-4 rounded-2xl">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {viewInquiry.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">{viewInquiry.name}</h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(viewInquiry.status)}`}>
                        {viewInquiry.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">Phone</p>
                      <p className="text-gray-900 font-medium">{viewInquiry.phone}</p>
                    </div>
                    {viewInquiry.email && (
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Email</p>
                        <p className="text-gray-900 font-medium">{viewInquiry.email}</p>
                      </div>
                    )}
                    {viewInquiry.location && (
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Location</p>
                        <p className="text-gray-900 font-medium">{viewInquiry.location}</p>
                      </div>
                    )}
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">Service Required</p>
                      <p className="text-gray-900 font-medium">{viewInquiry.service_required}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">Message</p>
                      <p className="text-gray-900">{viewInquiry.message}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">Submitted On</p>
                      <p className="text-gray-900">{new Date(viewInquiry.created_at).toLocaleString()}</p>
                    </div>
                    {viewInquiry.assigned_agent_id && (
                      <div className="bg-blue-50 p-4 rounded-xl">
                        <p className="text-xs text-blue-500 uppercase font-bold mb-1">Assigned Agent</p>
                        <p className="text-blue-800 font-bold">{agents.find((a) => a.id === viewInquiry.assigned_agent_id)?.full_name || "Unknown"}</p>
                        <p className="text-xs text-blue-400 mt-1">Assigned for follow-up only. Use Convert to Lead to add to agent's leads.</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setShowViewInquiry(false)}
                    className="w-full py-4 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition-all mt-2"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Create Agent Modal */}
          {showCreateAgent && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl relative"
              >
                <button onClick={() => setShowCreateAgent(false)} className="absolute top-6 right-8 text-gray-400 hover:text-gray-600">
                  <FaTimes size={24} />
                </button>

                <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-sm"><FaUserPlus size={24} /></div>
                  Create New Agent
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name *</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaUser size={14} /></div>
                      <input
                        type="text"
                        placeholder="Enter full name"
                        value={agentForm.fullName}
                        onChange={(e) => setAgentForm({ ...agentForm, fullName: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email *</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaEnvelope size={14} /></div>
                      <input
                        type="email"
                        placeholder="Enter email"
                        value={agentForm.email}
                        onChange={(e) => setAgentForm({ ...agentForm, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone *</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaPhone size={14} /></div>
                      <input
                        type="tel"
                        placeholder="Enter phone number"
                        value={agentForm.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setAgentForm({ ...agentForm, phone: val });
                        }}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">PIN Code</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors">
                        {pincodeLoading ? <FaSpinner className="animate-spin" /> : <FaMapMarkerAlt size={14} />}
                      </div>
                      <input
                        type="tel"
                        placeholder="6-digit PIN code"
                        value={agentForm.pincode}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                          setAgentForm({ ...agentForm, pincode: val });
                          handlePincodeLookup(val, false);
                        }}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Alternate Number</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaPhone size={14} /></div>
                      <input
                        type="tel"
                        placeholder="Enter alternate number"
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setAgentForm({ ...agentForm, alternatePhone: val });
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">State</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaMapMarkerAlt size={14} /></div>
                      <select
                        value={agentForm.state_id || ""}
                        onChange={(e) => {
                          const id = e.target.value;
                          const name = states.find(s => s.id == id)?.name;
                          setAgentForm({ ...agentForm, state_id: id, state: name });
                          fetchDistricts(id);
                        }}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold appearance-none"
                      >
                        <option value="">Select State</option>
                        {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">District</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaMapMarkerAlt size={14} /></div>
                      <select
                        value={agentForm.district_id || ""}
                        onChange={(e) => {
                          const id = e.target.value;
                          const name = districts.find(d => d.id == id)?.name;
                          setAgentForm({ ...agentForm, district_id: id, district: name });
                          fetchMandals(agentForm.state_id, id);
                        }}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold appearance-none disabled:opacity-50"
                        disabled={!agentForm.state_id}
                      >
                        <option value="">Select District</option>
                        {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mandal</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaMapMarkerAlt size={14} /></div>
                      <input
                        list="mandal-list-create"
                        placeholder="Enter mandal"
                        value={agentForm.mandal}
                        onChange={(e) => setAgentForm({ ...agentForm, mandal: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold"
                      />
                      <datalist id="mandal-list-create">
                        {mandalSuggestions.map((m, i) => <option key={i} value={m} />)}
                      </datalist>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Village</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaMapMarkerAlt size={14} /></div>
                      <input
                        list="village-list-create"
                        placeholder="Enter village"
                        value={agentForm.village}
                        onChange={(e) => setAgentForm({ ...agentForm, village: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold"
                      />
                      <datalist id="village-list-create">
                        {mandalSuggestions.map((v, i) => <option key={i} value={v} />)}
                      </datalist>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Aadhar Number</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaIdCard size={14} /></div>
                      <input
                        type="text"
                        placeholder="Enter Aadhar number"
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 12);
                          setAgentForm({ ...agentForm, aadharNumber: val });
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password *</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaLock size={14} /></div>
                      <input
                        type="password"
                        placeholder="Enter password"
                        value={agentForm.password}
                        onChange={(e) => setAgentForm({ ...agentForm, password: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Profile Photo</label>
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 overflow-hidden">
                      {agentForm.profilePhoto ? (
                        <img src={URL.createObjectURL(agentForm.profilePhoto)} className="w-full h-full object-cover" />
                      ) : (
                        <FaUser size={32} />
                      )}
                    </div>
                    <input
                      type="file"
                      onChange={(e) => setAgentForm({ ...agentForm, profilePhoto: e.target.files[0] })}
                      className="text-xs font-bold text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-10">
                  <button
                    onClick={createAgent}
                    disabled={loading}
                    className="flex-1 py-4 bg-orange-600 text-white rounded-2xl font-black shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {loading ? <FaSpinner className="animate-spin" /> : <FaUserPlus />}
                    {loading ? "Creating Agent..." : "Create Agent"}
                  </button>
                  <button
                    onClick={() => setShowCreateAgent(false)}
                    className="px-10 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* View Agent Modal */}
          {showViewAgent && viewAgent && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2rem] p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-gray-900">Agent Details</h3>
                  <button
                    onClick={() => setShowViewAgent(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FaTimesCircle className="text-2xl text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Header with status */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-3xl font-bold overflow-hidden border-4 border-white shadow-md">
                      {viewAgent.profile_photo ? (
                        <img src={`${API_URL.replace(/\/api\/?$/, "")}/${viewAgent.profile_photo}`} alt="" className="w-full h-full object-cover" />
                      ) : (
                        viewAgent.full_name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{viewAgent.full_name}</h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${viewAgent.status === 'ACTIVE' ? 'bg-green-100 text-green-600' :
                        viewAgent.status === 'PENDING' ? 'bg-yellow-100 text-yellow-600' :
                          viewAgent.status === 'REJECTED' ? 'bg-red-100 text-red-600' :
                            'bg-gray-100 text-gray-600'
                        }`}>
                        {viewAgent.status}
                      </span>
                      <p className="text-sm text-gray-500 capitalize mt-1">{viewAgent.role}</p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-xs text-gray-500 uppercase font-bold">Email</p>
                      <p className="text-gray-900">{viewAgent.email}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-xs text-gray-500 uppercase font-bold">Phone</p>
                      <p className="text-gray-900">{viewAgent.phone}</p>
                    </div>
                    {viewAgent.alternate_phone && (
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-xs text-gray-500 uppercase font-bold">Alternate Phone</p>
                        <p className="text-gray-900">{viewAgent.alternate_phone}</p>
                      </div>
                    )}
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-xs text-gray-500 uppercase font-bold">Address</p>
                      <p className="text-gray-900">
                        {viewAgent.village && `${viewAgent.village}, `}
                        {viewAgent.mandal && `${viewAgent.mandal}, `}
                        {viewAgent.district?.name || viewAgent.district_id}, {viewAgent.state?.name || viewAgent.state_id}
                      </p>
                    </div>
                    {viewAgent.aadhar_number && (
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-xs text-gray-500 uppercase font-bold">Aadhar Number</p>
                        <p className="text-gray-900">XXXX-XXXX-{viewAgent.aadhar_number.slice(-4)}</p>
                      </div>
                    )}
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-xs text-gray-500 uppercase font-bold">Joined Date</p>
                      <p className="text-gray-900">{new Date(viewAgent.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="bg-blue-50 p-4 rounded-xl text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {leads.filter((l) => l.agent_id == viewAgent.id).length}
                      </p>
                      <p className="text-xs text-gray-500">Total Leads</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {leads.filter((l) => l.agent_id == viewAgent.id && l.status === "WON").length}
                      </p>
                      <p className="text-xs text-gray-500">Won</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        ₹{leads.filter((l) => l.agent_id == viewAgent.id).reduce((sum, l) => sum + (parseFloat(l.paid_amount) || 0), 0).toFixed(0)}
                      </p>
                      <p className="text-xs text-gray-500">Revenue</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowViewAgent(false)}
                    className="w-full py-4 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition-all mt-6"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Edit Agent Modal */}
          {showEditAgent && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl relative"
              >
                <button onClick={() => setShowEditAgent(false)} className="absolute top-6 right-8 text-gray-400 hover:text-gray-600">
                  <FaTimes size={24} />
                </button>

                <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-sm"><FaEdit size={24} /></div>
                  Edit Agent Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name *</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaUser size={14} /></div>
                      <input
                        type="text"
                        placeholder="Enter full name"
                        value={editAgentForm.fullName}
                        onChange={(e) => setEditAgentForm({ ...editAgentForm, fullName: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email *</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaEnvelope size={14} /></div>
                      <input
                        type="email"
                        placeholder="Enter email"
                        value={editAgentForm.email}
                        onChange={(e) => setEditAgentForm({ ...editAgentForm, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone *</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaPhone size={14} /></div>
                      <input
                        type="tel"
                        placeholder="Enter phone number"
                        value={editAgentForm.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setEditAgentForm({ ...editAgentForm, phone: val });
                        }}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">PIN Code</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors">
                        {pincodeLoading ? <FaSpinner className="animate-spin" /> : <FaMapMarkerAlt size={14} />}
                      </div>
                      <input
                        type="tel"
                        placeholder="6-digit PIN code"
                        value={editAgentForm.pincode}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                          setEditAgentForm({ ...editAgentForm, pincode: val });
                          handlePincodeLookup(val, true);
                        }}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Alternate Phone</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaPhone size={14} /></div>
                      <input
                        type="tel"
                        placeholder="Enter alternate phone"
                        value={editAgentForm.alternatePhone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setEditAgentForm({ ...editAgentForm, alternatePhone: val });
                        }}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">State</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaMapMarkerAlt size={14} /></div>
                      <select
                        value={editAgentForm.state_id || ""}
                        onChange={(e) => {
                          const id = e.target.value;
                          const name = states.find(s => s.id == id)?.name;
                          setEditAgentForm({ ...editAgentForm, state_id: id, state: name });
                          fetchDistricts(id);
                        }}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold appearance-none"
                      >
                        <option value="">Select State</option>
                        {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">District</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaMapMarkerAlt size={14} /></div>
                      <select
                        value={editAgentForm.district_id || ""}
                        onChange={(e) => {
                          const id = e.target.value;
                          const name = districts.find(d => d.id == id)?.name;
                          setEditAgentForm({ ...editAgentForm, district_id: id, district: name });
                          fetchMandals(editAgentForm.state_id, id);
                        }}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold appearance-none disabled:opacity-50"
                        disabled={!editAgentForm.state_id}
                      >
                        <option value="">Select District</option>
                        {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mandal</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaMapMarkerAlt size={14} /></div>
                      <input
                        list="mandal-list-edit"
                        placeholder="Enter mandal"
                        value={editAgentForm.mandal}
                        onChange={(e) => setEditAgentForm({ ...editAgentForm, mandal: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold"
                      />
                      <datalist id="mandal-list-edit">
                        {mandalSuggestions.map((m, i) => <option key={i} value={m} />)}
                      </datalist>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Village</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaMapMarkerAlt size={14} /></div>
                      <input
                        list="village-list-edit"
                        placeholder="Enter village"
                        value={editAgentForm.village}
                        onChange={(e) => setEditAgentForm({ ...editAgentForm, village: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold"
                      />
                      <datalist id="village-list-edit">
                        {mandalSuggestions.map((v, i) => <option key={i} value={v} />)}
                      </datalist>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"><FaCheckCircle size={14} /></div>
                      <select
                        value={editAgentForm.status}
                        onChange={(e) => setEditAgentForm({ ...editAgentForm, status: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold appearance-none"
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="PENDING">PENDING</option>
                        <option value="INACTIVE">INACTIVE</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Profile Photo</label>
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 overflow-hidden">
                      {editAgentForm.profilePhoto ? (
                        <img src={typeof editAgentForm.profilePhoto === 'string' ? `${API_URL.replace(/\/api\/?$/, "")}/${editAgentForm.profilePhoto}` : URL.createObjectURL(editAgentForm.profilePhoto)} className="w-full h-full object-cover" />
                      ) : (
                        <FaUser size={32} />
                      )}
                    </div>
                    <input
                      type="file"
                      onChange={(e) => setEditAgentForm({ ...editAgentForm, profilePhoto: e.target.files[0] })}
                      className="text-xs font-bold text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-10">
                  <button
                    onClick={updateAgent}
                    disabled={loading}
                    className="flex-1 py-4 bg-orange-600 text-white rounded-2xl font-black shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {loading ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                    {loading ? "Updating Agent..." : "Update Agent"}
                  </button>
                  <button
                    onClick={() => setShowEditAgent(false)}
                    className="px-10 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* View Lead Modal */}
          {showViewLead && viewLead && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2rem] p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-gray-900">Lead Details</h3>
                  <button
                    onClick={() => setShowViewLead(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FaTimesCircle className="text-2xl text-gray-400" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Client Info */}
                  <div className="bg-orange-50 p-6 rounded-2xl">
                    <h4 className="text-sm font-bold text-orange-600 uppercase mb-4">Client Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Name</p>
                        <p className="font-bold text-gray-900">{viewLead.client_name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="font-bold text-gray-900">{viewLead.client_phone}</p>
                      </div>
                      {viewLead.client_email && (
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="font-bold text-gray-900">{viewLead.client_email}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-500">Service Type</p>
                        <p className="font-bold text-gray-900">{viewLead.service_type}</p>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  {viewLead.exact_location && (
                    <div className="bg-blue-50 p-6 rounded-2xl">
                      <h4 className="text-sm font-bold text-blue-600 uppercase mb-2">Location</h4>
                      <p className="text-gray-900">{viewLead.exact_location}</p>
                      {viewLead.latitude && viewLead.longitude && (
                        <p className="text-xs text-gray-500 mt-2">
                          GPS: {parseFloat(viewLead.latitude).toFixed(4)}, {parseFloat(viewLead.longitude).toFixed(4)}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Project Details */}
                  {viewLead.project_brief && (
                    <div className="bg-gray-50 p-6 rounded-2xl">
                      <h4 className="text-sm font-bold text-gray-600 uppercase mb-2">Project Brief</h4>
                      <p className="text-gray-900">{viewLead.project_brief}</p>
                    </div>
                  )}

                  {/* Lost Reason */}
                  {viewLead.status === "LOST" && viewLead.lost_reason && (
                    <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-100">
                      <h4 className="text-sm font-bold text-red-600 uppercase mb-2">Reason for Lost</h4>
                      <p className="text-red-900 font-medium">{viewLead.lost_reason}</p>
                    </div>
                  )}

                  {/* Status & Payment */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-50 p-4 rounded-2xl">
                      <p className="text-xs text-gray-500 uppercase">Lead Status</p>
                      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(viewLead.status)}`}>
                        {viewLead.status}
                      </span>
                    </div>
                    <div className="bg-green-50 p-4 rounded-2xl">
                      <p className="text-xs text-gray-500 uppercase">Payment Status</p>
                      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(viewLead.payment_status)}`}>
                        {viewLead.payment_status}
                      </span>
                    </div>
                  </div>

                  {/* Payment Details */}
                  {(viewLead.total_amount > 0 || viewLead.paid_amount > 0) && (
                    <div className="bg-yellow-50 p-6 rounded-2xl">
                      <h4 className="text-sm font-bold text-yellow-600 uppercase mb-4">Payment Details</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Total Amount</p>
                          <p className="text-xl font-bold text-gray-900">₹{viewLead.total_amount || 0}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Paid Amount</p>
                          <p className="text-xl font-bold text-green-600">₹{viewLead.paid_amount || 0}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Agent */}
                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                      {agents.find((a) => a.id === viewLead.agent_id)?.full_name?.charAt(0) || "A"}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Assigned Agent</p>
                      <p className="font-bold text-gray-900">
                        {agents.find((a) => a.id === viewLead.agent_id)?.full_name || "Unknown"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowViewLead(false)}
                    className="w-full py-4 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition-all"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Edit Lead Modal - Full form matching agent create lead */}
          {showEditLead && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] p-10 w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar"
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-gray-900">Edit Lead</h3>
                  <button onClick={() => setShowEditLead(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <FaTimesCircle className="text-2xl text-gray-400" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                  {/* Client Information */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wider flex items-center gap-2">
                      <FaUser /> Client Information
                    </h4>
                    <LeadInputField label="Client Name *" value={editLeadForm.clientName} onChange={(e) => setEditLeadForm({ ...editLeadForm, clientName: e.target.value })} placeholder="Enter client name" icon={<FaUser />} />
                    <LeadInputField label="Phone Number *" value={editLeadForm.clientPhone} onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setEditLeadForm({ ...editLeadForm, clientPhone: val });
                    }} placeholder="Enter phone number" icon={<FaPhone />} />
                    <LeadInputField label="Email" value={editLeadForm.clientEmail} onChange={(e) => setEditLeadForm({ ...editLeadForm, clientEmail: e.target.value })} placeholder="Enter email (optional)" icon={<FaEnvelope />} type="email" />
                  </div>

                  {/* Service Details */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wider flex items-center gap-2">
                      <FaFileAlt /> Service Details
                    </h4>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Service Type *</label>
                      <select value={editLeadForm.serviceType} onChange={(e) => setEditLeadForm({ ...editLeadForm, serviceType: e.target.value })} className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all">
                        <option value="">Select Service</option>
                        <option value="MSME Services">MSME Services</option>
                        <option value="Business Promotions">Business Promotions</option>
                        <option value="Financial Services">Financial Services</option>
                        <option value="Digital Marketing">Digital Marketing</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Project Brief</label>
                      <textarea value={editLeadForm.projectBrief} onChange={(e) => setEditLeadForm({ ...editLeadForm, projectBrief: e.target.value })} placeholder="Describe the project requirements..." rows={4} className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all resize-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Lead Status</label>
                      <select value={editLeadForm.status} onChange={(e) => setEditLeadForm({ ...editLeadForm, status: e.target.value })} className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all">
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="FOLLOW_UP">Follow Up</option>
                        <option value="WON">Won</option>
                        <option value="LOST">Lost</option>
                      </select>
                    </div>

                    {/* Lost Reason Field */}
                    {editLeadForm.status === "LOST" && (
                      <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
                        <label className="text-xs font-bold text-red-600 uppercase tracking-wider">Reason for Lost *</label>
                        <textarea
                          value={editLeadForm.lostReason}
                          onChange={(e) => setEditLeadForm({ ...editLeadForm, lostReason: e.target.value })}
                          placeholder="Please provide the reason why this lead was lost..."
                          rows={3}
                          className="w-full p-4 bg-red-50 border-2 border-red-100 rounded-2xl focus:border-red-500 focus:bg-white outline-none transition-all resize-none text-red-900 placeholder:text-red-300"
                        />
                      </div>
                    )}
                  </div>

                  {/* Location */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wider flex items-center gap-2">
                      <FaMapMarkerAlt /> Location
                    </h4>
                    <button onClick={captureEditLeadGPS} disabled={editLeadGpsLoading} className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                      {editLeadGpsLoading ? <FaSpinner className="animate-spin" /> : <FaMapPin />}
                      {editLeadGpsLoading ? "Capturing..." : "Capture GPS Location"}
                    </button>
                    {editLeadForm.latitude && editLeadForm.longitude && (
                      <div className="p-3 bg-green-50 rounded-xl text-sm">
                        <p className="font-bold text-green-800">GPS Captured!</p>
                        <p className="text-green-600">Lat: {editLeadForm.latitude}</p>
                        <p className="text-green-600">Long: {editLeadForm.longitude}</p>
                      </div>
                    )}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Exact Location / Address</label>
                      <textarea value={editLeadForm.exactLocation} onChange={(e) => setEditLeadForm({ ...editLeadForm, exactLocation: e.target.value })} placeholder="Enter detailed address..." rows={3} className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all resize-none" />
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="space-y-6 lg:col-span-3">
                    <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wider flex items-center gap-2">
                      <FaMoneyBill /> Payment Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Payment Status</label>
                        <select value={editLeadForm.paymentStatus} onChange={(e) => setEditLeadForm({ ...editLeadForm, paymentStatus: e.target.value })} className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all">
                          <option value="PENDING">Pending</option>
                          <option value="PARTIAL">Partial</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                      </div>
                      <LeadInputField label="Total Amount (₹)" value={editLeadForm.totalAmount} onChange={(e) => setEditLeadForm({ ...editLeadForm, totalAmount: e.target.value })} placeholder="0.00" icon={<FaMoneyBill />} type="number" />
                      <LeadInputField label="Paid Amount (₹)" value={editLeadForm.paidAmount} onChange={(e) => setEditLeadForm({ ...editLeadForm, paidAmount: e.target.value })} placeholder="0.00" icon={<FaCheckCircle />} type="number" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Payment Method</label>
                        <select value={editLeadForm.paymentMethod} onChange={(e) => setEditLeadForm({ ...editLeadForm, paymentMethod: e.target.value })} className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all">
                          <option value="">Select Method</option>
                          <option value="CASH">Cash</option>
                          <option value="UPI">UPI</option>
                          <option value="BANK_TRANSFER">Bank Transfer</option>
                          <option value="CHEQUE">Cheque</option>
                          <option value="CARD">Card</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                      <LeadInputField label="Transaction ID / Receipt #" value={editLeadForm.transactionId} onChange={(e) => setEditLeadForm({ ...editLeadForm, transactionId: e.target.value })} placeholder="Enter transaction reference" icon={<FaReceipt />} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Payment Notes</label>
                      <textarea value={editLeadForm.paymentNotes} onChange={(e) => setEditLeadForm({ ...editLeadForm, paymentNotes: e.target.value })} placeholder="Any additional payment details..." rows={2} className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all resize-none" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-12 pt-6 border-t border-gray-100">
                  <button onClick={updateLead} disabled={loading} className="flex-1 py-5 bg-orange-600 text-white rounded-2xl font-black shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all disabled:opacity-70 flex items-center justify-center gap-3 text-lg">
                    {loading ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                    {loading ? "Updating..." : "Update Lead Details"}
                  </button>
                  <button onClick={() => setShowEditLead(false)} className="px-10 py-5 bg-gray-100 text-gray-500 rounded-2xl font-black hover:bg-gray-200 transition-all text-lg">
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white">
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white text-xl mb-4`}>
        {icon}
      </div>
      <div className="text-3xl font-black text-gray-900">{value}</div>
      <div className="text-sm text-gray-500 font-medium">{label}</div>
    </div>
  );
}

// Tab Button Component
function TabButton({ active, onClick, icon, label, count }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${active
        ? "bg-orange-600 text-white shadow-lg"
        : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
        }`}
    >
      {icon}
      <span>{label}</span>
      {count !== undefined && (
        <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${active ? "bg-white/20" : "bg-orange-100 text-orange-600"}`}>
          {count}
        </span>
      )}
    </button>
  );
}

// Lead Input Field (matches agent dashboard style)
function LeadInputField({ label, value, onChange, placeholder, icon, type = "text" }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400">{icon}</div>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all ${icon ? "pl-12" : ""}`}
        />
      </div>
    </div>
  );
}