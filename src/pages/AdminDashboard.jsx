import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaClipboardList,
  FaEnvelope,
  FaSignOutAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
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
} from "react-icons/fa";

const API_URL = "http://localhost:3000/api";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("leads"); // leads, agents, inquiries
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
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Create Agent Modal
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [agentForm, setAgentForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    state: "",
    district: "",
    mandal: "",
    village: "",
  });

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
    state: "",
    district: "",
    mandal: "",
    village: "",
    aadharNumber: "",
    alternatePhone: "",
    status: "",
  });

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

  const fetchDashboardData = async () => {
    await Promise.all([fetchLeads(), fetchAgents(), fetchInquiries()]);
  };

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/leads/all`, {
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

  const fetchAgents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/auth/agents`, {
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
        fetchAgents();
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
      const response = await fetch(`${API_URL}/auth/create-agent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...agentForm, status: "ACTIVE" }),
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
      state: agent.state || "",
      district: agent.district || "",
      mandal: agent.mandal || "",
      village: agent.village || "",
      aadharNumber: agent.aadhar_number || "",
      alternatePhone: agent.alternate_phone || "",
      status: agent.status,
    });
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
      const response = await fetch(`${API_URL}/auth/agents/${editAgentForm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          fullName: editAgentForm.fullName,
          email: editAgentForm.email,
          phone: editAgentForm.phone,
          state: editAgentForm.state,
          district: editAgentForm.district,
          mandal: editAgentForm.mandal,
          village: editAgentForm.village,
          aadharNumber: editAgentForm.aadharNumber,
          alternatePhone: editAgentForm.alternatePhone,
          status: editAgentForm.status,
        }),
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
        }),
      });

      if (response.ok) {
        alert("Lead updated successfully!");
        setShowEditLead(false);
        fetchLeads();
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

  const filteredLeads = leads.filter((lead) => {
    const matchesAgent = filterAgent === "all" || lead.agent_id?.toString() === filterAgent;
    const matchesStatus = filterStatus === "all" || lead.status === filterStatus;
    const matchesSearch =
      searchQuery === "" ||
      lead.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.client_phone?.includes(searchQuery);
    return matchesAgent && matchesStatus && matchesSearch;
  });

  const activeAgents = agents.filter((a) => a.status === "ACTIVE");

  return (
    <div className="min-h-screen mt-24 relative overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2669&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/80 via-white/90 to-white" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6 relative z-10">
        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <FaUserCheck /> Admin Portal
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
              Admin <span className="text-orange-600">Dashboard</span>
            </h2>
            <p className="text-gray-600 mt-2">Manage agents, leads, and inquiries</p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-900 transition-all shadow-lg"
          >
            <FaSignOutAlt /> Logout
          </button>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<FaClipboardList />}
            label="Total Leads"
            value={stats.totalLeads}
            color="bg-blue-500"
          />
          <StatCard
            icon={<FaUsers />}
            label="Total Agents"
            value={stats.totalAgents}
            color="bg-green-500"
          />
          <StatCard
            icon={<FaClock />}
            label="Pending Approvals"
            value={stats.pendingAgents}
            color="bg-yellow-500"
          />
          <StatCard
            icon={<FaEnvelope />}
            label="New Inquiries"
            value={stats.newInquiries}
            color="bg-purple-500"
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-3 mb-8">
          <TabButton
            active={activeTab === "leads"}
            onClick={() => setActiveTab("leads")}
            icon={<FaClipboardList />}
            label="All Leads"
            count={stats.totalLeads}
          />
          <TabButton
            active={activeTab === "agents"}
            onClick={() => setActiveTab("agents")}
            icon={<FaUsers />}
            label="Manage Agents"
            count={stats.pendingAgents > 0 ? `${stats.totalAgents} (${stats.pendingAgents} pending)` : stats.totalAgents}
          />
          <TabButton
            active={activeTab === "inquiries"}
            onClick={() => setActiveTab("inquiries")}
            icon={<FaEnvelope />}
            label="Contact Inquiries"
            count={stats.newInquiries > 0 ? `${inquiries.length} (${stats.newInquiries} new)` : inquiries.length}
          />
        </div>

        {/* LEADS TAB */}
        {activeTab === "leads" && (
          <div className="space-y-6">
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
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                          No leads found
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium">#{lead.id}</td>
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
              </div>
            </div>
          </div>
        )}

        {/* AGENTS TAB */}
        {activeTab === "agents" && (
          <div className="space-y-6">
            {/* Create Agent Button */}
            <button
              onClick={() => setShowCreateAgent(true)}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg"
            >
              <FaUserPlus /> Create New Agent
            </button>

            {/* Agents List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/90 backdrop-blur-md p-6 rounded-[2rem] shadow-xl border border-white cursor-pointer hover:border-orange-300 hover:shadow-2xl transition-all"
                  onClick={() => handleViewAgentLeads(agent)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{agent.full_name}</h3>
                      <p className="text-sm text-gray-500">{agent.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* View Icon */}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleViewAgent(agent); }}
                        className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                        title="View Agent"
                      >
                        <FaEye size={14} />
                      </button>
                      {/* Edit Icon */}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEditAgent(agent); }}
                        className="p-2 text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-600 hover:text-white transition-all"
                        title="Edit Agent"
                      >
                        <FaEdit size={14} />
                      </button>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(agent.status)}`}>
                        {agent.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-orange-500" />
                      <span>{agent.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-orange-500" />
                      <span>{agent.district}, {agent.state}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="bg-gray-50 p-3 rounded-xl mb-4">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-lg font-bold text-gray-900">
                          {leads.filter((l) => l.agent_id == agent.id).length}
                        </div>
                        <div className="text-xs text-gray-500">Leads</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">
                          {leads.filter((l) => l.agent_id == agent.id && l.status === "WON").length}
                        </div>
                        <div className="text-xs text-gray-500">Won</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-600">
                          ₹
                          {leads
                            .filter((l) => l.agent_id == agent.id)
                            .reduce((sum, l) => sum + (parseFloat(l.paid_amount) || 0), 0)
                            .toFixed(0)}
                        </div>
                        <div className="text-xs text-gray-500">Revenue</div>
                      </div>
                    </div>
                  </div>

                  {/* Tap hint */}
                  <p className="text-xs text-center text-orange-400 font-bold mb-2 tracking-wide">TAP CARD TO VIEW ALL LEADS</p>

                  {/* Status Actions */}
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    {agent.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => updateAgentStatus(agent.id, "ACTIVE")}
                          className="flex-1 py-2 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 transition-all flex items-center justify-center gap-1"
                        >
                          <FaCheckCircle /> Approve
                        </button>
                        <button
                          onClick={() => updateAgentStatus(agent.id, "REJECTED")}
                          className="flex-1 py-2 bg-red-600 text-white rounded-lg font-bold text-sm hover:bg-red-700 transition-all flex items-center justify-center gap-1"
                        >
                          <FaTimesCircle /> Reject
                        </button>
                      </>
                    )}
                    {agent.status === "ACTIVE" && (
                      <button
                        onClick={() => updateAgentStatus(agent.id, "INACTIVE")}
                        className="flex-1 py-2 bg-gray-600 text-white rounded-lg font-bold text-sm hover:bg-gray-700 transition-all flex items-center justify-center gap-1"
                      >
                        <FaUserTimes /> Deactivate
                      </button>
                    )}
                    {agent.status === "INACTIVE" && (
                      <button
                        onClick={() => updateAgentStatus(agent.id, "ACTIVE")}
                        className="flex-1 py-2 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 transition-all flex items-center justify-center gap-1"
                      >
                        <FaUserCheck /> Activate
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* INQUIRIES TAB */}
        {activeTab === "inquiries" && (
          <div className="space-y-6">
            {/* Info note */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-3 text-sm text-blue-700 font-medium flex items-start gap-2">
              <span className="mt-0.5 text-blue-400">ℹ️</span>
              <span>
                <strong>Assign to Agent</strong> — marks the inquiry as contacted and links it to that agent for follow-up. The inquiry does <strong>not</strong> appear in the agent's leads automatically.
                Use <strong>"Convert to Lead"</strong> to create an actual lead in the agent's account.
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {inquiries.length === 0 ? (
                <div className="text-center py-12 bg-white/80 backdrop-blur-md rounded-[2rem]">
                  <p className="text-gray-500">No inquiries yet</p>
                </div>
              ) : (
                inquiries.map((inquiry) => (
                  <motion.div
                    key={inquiry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/90 backdrop-blur-md p-6 rounded-[2rem] shadow-xl border border-white"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-bold text-gray-900">{inquiry.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(inquiry.status)}`}>
                            {inquiry.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{new Date(inquiry.created_at).toLocaleString()}</p>
                      </div>
                      {/* View Icon */}
                      <button
                        onClick={() => handleViewInquiry(inquiry)}
                        className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                        title="View Inquiry"
                      >
                        <FaEye size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <FaPhone className="text-orange-500" />
                        <span>{inquiry.phone}</span>
                      </div>
                      {inquiry.email && (
                        <div className="flex items-center gap-2">
                          <FaEnvelope className="text-orange-500" />
                          <span>{inquiry.email}</span>
                        </div>
                      )}
                      {inquiry.location && (
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-orange-500" />
                          <span>{inquiry.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl mb-4">
                      <div className="text-xs font-bold text-gray-500 uppercase mb-1">Service Required</div>
                      <div className="font-medium">{inquiry.service_required}</div>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-2">{inquiry.message}</p>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                      {inquiry.status === "NEW" && (
                        <>
                          <select
                            onChange={(e) => e.target.value && assignInquiry(inquiry.id, e.target.value)}
                            className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                            defaultValue=""
                          >
                            <option value="">Assign to Agent...</option>
                            {activeAgents.map((agent) => (
                              <option key={agent.id} value={agent.id}>
                                {agent.full_name}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => convertInquiryToLead(inquiry.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 transition-all flex items-center gap-1"
                          >
                            <FaExchangeAlt /> Convert to Lead
                          </button>
                        </>
                      )}
                      {inquiry.assigned_agent_id && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
                          <FaUserCheck />
                          Assigned to: {agents.find((a) => a.id === inquiry.assigned_agent_id)?.full_name}
                          <span className="text-xs text-blue-400 ml-1">(follow-up only — use Convert to Lead to add to agent's leads)</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}

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
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-2xl text-center">
                  <p className="text-2xl font-black text-blue-600">{leads.filter((l) => l.agent_id == selectedAgent.id).length}</p>
                  <p className="text-xs text-gray-500 font-bold uppercase">Total</p>
                </div>
                <div className="bg-green-50 p-4 rounded-2xl text-center">
                  <p className="text-2xl font-black text-green-600">{leads.filter((l) => l.agent_id == selectedAgent.id && l.status === "WON").length}</p>
                  <p className="text-xs text-gray-500 font-bold uppercase">Won</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-2xl text-center">
                  <p className="text-2xl font-black text-orange-600">
                    ₹{leads.filter((l) => l.agent_id == selectedAgent.id).reduce((sum, l) => sum + (parseFloat(l.paid_amount) || 0), 0).toFixed(0)}
                  </p>
                  <p className="text-xs text-gray-500 font-bold uppercase">Revenue</p>
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
                    <thead className="bg-orange-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-orange-800 uppercase">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-orange-800 uppercase">Client</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-orange-800 uppercase">Service</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-orange-800 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-orange-800 uppercase">Payment</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-orange-800 uppercase">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-orange-800 uppercase">Date</th>
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
                className="w-full py-4 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition-all mt-6"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}

        {/* View Inquiry Modal */}
        {showViewInquiry && viewInquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2rem] p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2rem] p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-gray-900">Create New Agent</h3>
                <button
                  onClick={() => setShowCreateAgent(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaTimesCircle className="text-2xl text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={agentForm.fullName}
                  onChange={(e) => setAgentForm({ ...agentForm, fullName: e.target.value })}
                  className="p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 outline-none"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={agentForm.email}
                  onChange={(e) => setAgentForm({ ...agentForm, email: e.target.value })}
                  className="p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 outline-none"
                />
                <input
                  type="tel"
                  placeholder="Phone *"
                  value={agentForm.phone}
                  onChange={(e) => setAgentForm({ ...agentForm, phone: e.target.value })}
                  className="p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 outline-none"
                />
                <input
                  type="password"
                  placeholder="Password *"
                  value={agentForm.password}
                  onChange={(e) => setAgentForm({ ...agentForm, password: e.target.value })}
                  className="p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={agentForm.state}
                  onChange={(e) => setAgentForm({ ...agentForm, state: e.target.value })}
                  className="p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="District"
                  value={agentForm.district}
                  onChange={(e) => setAgentForm({ ...agentForm, district: e.target.value })}
                  className="p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Mandal"
                  value={agentForm.mandal}
                  onChange={(e) => setAgentForm({ ...agentForm, mandal: e.target.value })}
                  className="p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Village"
                  value={agentForm.village}
                  onChange={(e) => setAgentForm({ ...agentForm, village: e.target.value })}
                  className="p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 outline-none"
                />
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={createAgent}
                  disabled={loading}
                  className="flex-1 py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? <FaSpinner className="animate-spin" /> : <FaUserPlus />}
                  {loading ? "Creating..." : "Create Agent"}
                </button>
                <button
                  onClick={() => setShowCreateAgent(false)}
                  className="px-8 py-4 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* View Agent Modal */}
        {showViewAgent && viewAgent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
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
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {viewAgent.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{viewAgent.full_name}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      viewAgent.status === 'ACTIVE' ? 'bg-green-100 text-green-600' :
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
                      {viewAgent.district && `${viewAgent.district}, `}
                      {viewAgent.state}
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2rem] p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-gray-900">Edit Agent</h3>
                <button onClick={() => setShowEditAgent(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <FaTimesCircle className="text-2xl text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Full Name *" value={editAgentForm.fullName}
                  onChange={(e) => setEditAgentForm({ ...editAgentForm, fullName: e.target.value })}
                  className="p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 outline-none" />
                <input type="email" placeholder="Email *" value={editAgentForm.email}
                  onChange={(e) => setEditAgentForm({ ...editAgentForm, email: e.target.value })}
                  className="p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 outline-none" />
                <input type="tel" placeholder="Phone *" value={editAgentForm.phone}
                  onChange={(e) => setEditAgentForm({ ...editAgentForm, phone: e.target.value })}
                  className="p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 outline-none" />
                <input type="tel" placeholder="Alternate Phone" value={editAgentForm.alternatePhone}
                  onChange={(e) => setEditAgentForm({ ...editAgentForm, alternatePhone: e.target.value })}
                  className="p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 outline-none" />
                <input type="text" placeholder="State" value={editAgentForm.state}
                  onChange={(e) => setEditAgentForm({ ...editAgentForm, state: e.target.value })}
                  className="p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 outline-none" />
                <input type="text" placeholder="District" value={editAgentForm.district}
                  onChange={(e) => setEditAgentForm({ ...editAgentForm, district: e.target.value })}
                  className="p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 outline-none" />
                <input type="text" placeholder="Mandal" value={editAgentForm.mandal}
                  onChange={(e) => setEditAgentForm({ ...editAgentForm, mandal: e.target.value })}
                  className="p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 outline-none" />
                <input type="text" placeholder="Village" value={editAgentForm.village}
                  onChange={(e) => setEditAgentForm({ ...editAgentForm, village: e.target.value })}
                  className="p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 outline-none" />
                <input type="text" placeholder="Aadhar Number" value={editAgentForm.aadharNumber}
                  onChange={(e) => setEditAgentForm({ ...editAgentForm, aadharNumber: e.target.value })}
                  className="p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 outline-none" />

                {/* Status Change */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Account Status</label>
                  <select
                    value={editAgentForm.status}
                    onChange={(e) => setEditAgentForm({ ...editAgentForm, status: e.target.value })}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 outline-none"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button onClick={updateAgent} disabled={loading}
                  className="flex-1 py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all disabled:opacity-70 flex items-center justify-center gap-2">
                  {loading ? <FaSpinner className="animate-spin" /> : <FaEdit />}
                  {loading ? "Updating..." : "Update Agent"}
                </button>
                <button onClick={() => setShowEditAgent(false)}
                  className="px-8 py-4 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition-all">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2rem] p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto"
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
                  <LeadInputField label="Phone Number *" value={editLeadForm.clientPhone} onChange={(e) => setEditLeadForm({ ...editLeadForm, clientPhone: e.target.value })} placeholder="Enter phone number" icon={<FaPhone />} />
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

              <div className="flex gap-4 mt-8">
                <button onClick={updateLead} disabled={loading} className="flex-1 py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all disabled:opacity-70 flex items-center justify-center gap-2">
                  {loading ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                  {loading ? "Updating..." : "Update Lead"}
                </button>
                <button onClick={() => setShowEditLead(false)} className="px-8 py-4 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition-all">
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
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
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
        active
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