import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPhone,
  FaUser,
  FaMapMarkerAlt,
  FaFileAlt,
  FaEnvelope,
  FaMoneyBill,
  FaReceipt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSignOutAlt,
  FaMapPin,
  FaCheckCircle,
  FaClock,
  FaSpinner,
  FaClipboardList,
  FaTimes,
} from "react-icons/fa";
import Profile from "./Profile";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import Dashboard from "../components/Dashboard";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = API_URL ? API_URL.replace(/\/api\/?$/, "") : "";

const getImageUrl = (path) => {
  if (!path) return null;
  return `${BASE_URL}/${path.replace(/\\/g, "/")}`;
};

export default function AgentDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, leads, create, profile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Lead form state
  const [form, setForm] = useState({
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    serviceType: "",
    projectBrief: "",
    latitude: "",
    longitude: "",
    exactLocation: "",
    status: "NEW",
    paymentStatus: "PENDING",
    totalAmount: "",
    paidAmount: "",
    paymentMethod: "",
    transactionId: "",
    paymentNotes: "",
  });

  const [editingLead, setEditingLead] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);

  const toggleSidebar = useCallback((open) => {
    setIsSidebarOpen(open);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!storedUser || !token) {
      navigate("/user-login");
      return;
    }
    setUser(JSON.parse(storedUser));
    fetchUserProfile();
    fetchLeads();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "leads" && localStorage.getItem("token")) {
      fetchLeads();
    }
  }, [activeTab]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/leads/my-leads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads || []);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/user-login");
  };

  const captureGPS = () => {
    setGpsLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm({
            ...form,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          });
          setGpsLoading(false);
        },
        (error) => {
          alert("Unable to capture GPS location. Please enter manually.");
          setGpsLoading(false);
        }
      );
    } else {
      alert("GPS not supported in this browser.");
      setGpsLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      clientName: "",
      clientPhone: "",
      clientEmail: "",
      serviceType: "",
      projectBrief: "",
      latitude: "",
      longitude: "",
      exactLocation: "",
      status: "NEW",
      paymentStatus: "PENDING",
      totalAmount: "",
      paidAmount: "",
      paymentMethod: "",
      transactionId: "",
      paymentNotes: "",
    });
    setEditingLead(null);
  };

  const handleSubmit = async () => {
    if (!form.clientName || !form.clientPhone || !form.serviceType) {
      alert("Please fill all required fields: Client Name, Phone, Service Type");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const url = editingLead
        ? `${API_URL}/leads/${editingLead.id}`
        : `${API_URL}/leads`;
      const method = editingLead ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        alert(editingLead ? "Lead updated successfully!" : "Lead created successfully!");
        resetForm();
        setActiveTab("leads");
        fetchLeads();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to save lead");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (lead) => {
    setForm({
      clientName: lead.client_name,
      clientPhone: lead.client_phone,
      clientEmail: lead.client_email || "",
      serviceType: lead.service_type || "",
      projectBrief: lead.project_brief || "",
      latitude: lead.latitude || "",
      longitude: lead.longitude || "",
      exactLocation: lead.exact_location || "",
      status: lead.status,
      paymentStatus: lead.payment_status,
      totalAmount: lead.total_amount || "",
      paidAmount: lead.paid_amount || "",
      paymentMethod: lead.payment_method || "",
      transactionId: lead.transaction_id || "",
      paymentNotes: lead.payment_notes || "",
    });
    setEditingLead(lead);
    setActiveTab("create");
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/leads/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchLeads();
      } else {
        alert("Failed to delete lead");
      }
    } catch (error) {
      alert("Network error");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      NEW: "bg-blue-100 text-blue-700",
      CONTACTED: "bg-yellow-100 text-yellow-700",
      FOLLOW_UP: "bg-orange-100 text-orange-700",
      WON: "bg-green-100 text-green-700",
      LOST: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-700",
      PARTIAL: "bg-orange-100 text-orange-700",
      COMPLETED: "bg-green-100 text-green-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden relative">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen}
        onClose={() => toggleSidebar(false)}
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader 
          title={activeTab === 'leads' ? 'My Leads' : activeTab === 'create' ? 'Create New Lead' : 'My Profile'} 
          onMenuClick={() => toggleSidebar(true)}
        />
        
        <main className="flex-1 overflow-y-auto p-4 pb-24 md:p-6 custom-scrollbar">
          {/* Action Buttons (now smaller) */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setActiveTab(activeTab === "create" ? "leads" : "create")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold transition-all shadow-md text-[10px] ${
                activeTab === "create"
                  ? "bg-gray-800 text-white hover:bg-gray-900"
                  : "bg-orange-600 text-white hover:bg-orange-700 shadow-orange-100"
              }`}
            >
              {activeTab === "create" ? (
                <>
                  <FaClipboardList size={10} /> View All Leads
                </>
              ) : (
                <>
                  <FaPlus size={10} /> Create New Lead
                </>
              )}
            </button>

            <button
              onClick={() => setActiveTab("leads")}
              className={`px-4 py-2 rounded-lg font-bold transition-all text-[10px] ${
                activeTab === "leads"
                  ? "bg-orange-600 text-white shadow-md shadow-orange-100"
                  : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm border border-gray-100"
              }`}
            >
              My Leads ({leads.length})
            </button>
            <button
              onClick={() => setActiveTab("create")}
              className={`px-4 py-2 rounded-lg font-bold transition-all text-[10px] ${
                activeTab === "create"
                  ? "bg-orange-600 text-white shadow-md shadow-orange-100"
                  : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm border border-gray-100"
              }`}
            >
              {editingLead ? "Edit Lead" : "Create Lead"}
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-4 py-2 rounded-lg font-bold transition-all text-[10px] ${
                activeTab === "profile"
                  ? "bg-orange-600 text-white shadow-md shadow-orange-100"
                  : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm border border-gray-100"
              }`}
            >
              My Profile
            </button>
        </div>

        {activeTab === 'dashboard' && (
          <Dashboard 
            role="AGENT" 
            leads={leads} 
            onTabChange={setActiveTab}
          />
        )}

        {/* Leads List Tab */}
        {activeTab === "leads" && (
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-20">
                <FaSpinner className="animate-spin text-4xl text-orange-500 mx-auto mb-4" />
                <p className="text-gray-600">Loading leads...</p>
              </div>
            ) : leads.length === 0 ? (
              <div className="text-center py-20 bg-white/70 backdrop-blur-sm rounded-[2rem] border-2 border-dashed border-orange-200">
                <p className="text-gray-500 font-bold text-lg mb-4">No leads yet</p>
                <button
                  onClick={() => setActiveTab("create")}
                  className="px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all"
                >
                  Create Your First Lead
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {leads.map((lead) => (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setSelectedLead(lead)}
                    className="bg-white/90 backdrop-blur-md p-6 rounded-[2rem] shadow-xl border border-white hover:shadow-2xl hover:border-orange-300 transition-all cursor-pointer group"
                  >
                    {/* Lead Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          {lead.id}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{lead.client_name}</h3>
                      </div>
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="p-2 text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-600 hover:text-white transition-all"
                        >
                          <FaEye size={14} />
                        </button>
                        <button
                          onClick={() => handleEdit(lead)}
                          className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Client Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <FaPhone className="text-orange-500" />
                        <span className="font-medium">{lead.client_phone}</span>
                      </div>
                      {lead.client_email && (
                        <div className="flex items-center gap-2 text-sm">
                          <FaEnvelope className="text-orange-500" />
                          <span className="font-medium">{lead.client_email}</span>
                        </div>
                      )}
                      {lead.exact_location && (
                        <div className="flex items-center gap-2 text-sm">
                          <FaMapMarkerAlt className="text-orange-500" />
                          <span className="font-medium text-gray-600">{lead.exact_location}</span>
                        </div>
                      )}
                    </div>

                    {/* Service & Status */}
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold">
                        {lead.service_type}
                      </span>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getPaymentStatusColor(lead.payment_status)}`}>
                        Payment: {lead.payment_status}
                      </span>
                    </div>

                    {/* Payment Info */}
                    {(lead.total_amount || lead.paid_amount) && (
                      <div className="bg-gray-50 p-3 rounded-xl mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total:</span>
                          <span className="font-bold">₹{lead.total_amount || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Paid:</span>
                          <span className="font-bold text-green-600">₹{lead.paid_amount || 0}</span>
                        </div>
                      </div>
                    )}

                    {/* Project Brief Preview */}
                    {lead.project_brief && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{lead.project_brief}</p>
                    )}

                    {/* GPS Location */}
                    {lead.latitude && lead.longitude && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <FaMapPin className="text-green-500" />
                        <span>GPS: {parseFloat(lead.latitude).toFixed(4)}, {parseFloat(lead.longitude).toFixed(4)}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create/Edit Lead Tab */}
        {activeTab === "create" && (
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-[2.5rem] shadow-xl border border-white">
            <h3 className="text-2xl font-black text-gray-900 mb-8">
              {editingLead ? "Edit Lead" : "Create New Lead"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Client Information */}
              <div className="space-y-6">
                <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wider flex items-center gap-2">
                  <FaUser /> Client Information
                </h4>

                <InputField
                  label="Client Name *"
                  value={form.clientName}
                  onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                  placeholder="Enter client name"
                  icon={<FaUser />}
                />

                <InputField
                  label="Phone Number *"
                  value={form.clientPhone}
                  onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
                  placeholder="Enter phone number"
                  icon={<FaPhone />}
                />

                <InputField
                  label="Email"
                  value={form.clientEmail}
                  onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                  placeholder="Enter email (optional)"
                  icon={<FaEnvelope />}
                  type="email"
                />
              </div>

              {/* Service Details */}
              <div className="space-y-6">
                <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wider flex items-center gap-2">
                  <FaFileAlt /> Service Details
                </h4>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Service Type *
                  </label>
                  <select
                    value={form.serviceType}
                    onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all"
                  >
                    <option value="">Select Service</option>
                    <option value="MSME Services">MSME Services</option>
                    <option value="Business Promotions">Business Promotions</option>
                    <option value="Financial Services">Financial Services</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Project Brief
                  </label>
                  <textarea
                    value={form.projectBrief}
                    onChange={(e) => setForm({ ...form, projectBrief: e.target.value })}
                    placeholder="Describe the project requirements..."
                    rows={4}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Lead Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all"
                  >
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

                <button
                  onClick={captureGPS}
                  disabled={gpsLoading}
                  className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {gpsLoading ? <FaSpinner className="animate-spin" /> : <FaMapPin />}
                  {gpsLoading ? "Capturing..." : "Capture GPS Location"}
                </button>

                {form.latitude && form.longitude && (
                  <div className="p-3 bg-green-50 rounded-xl text-sm">
                    <p className="font-bold text-green-800">GPS Captured!</p>
                    <p className="text-green-600">Lat: {form.latitude}</p>
                    <p className="text-green-600">Long: {form.longitude}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Exact Location / Address
                  </label>
                  <textarea
                    value={form.exactLocation}
                    onChange={(e) => setForm({ ...form, exactLocation: e.target.value })}
                    placeholder="Enter detailed address..."
                    rows={3}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all resize-none"
                  />
                </div>
              </div>

              {/* Payment Information */}
              <div className="space-y-6 lg:col-span-2">
                <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wider flex items-center gap-2">
                  <FaMoneyBill /> Payment Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Payment Status
                    </label>
                    <select
                      value={form.paymentStatus}
                      onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })}
                      className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PARTIAL">Partial</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>

                  <InputField
                    label="Total Amount (₹)"
                    value={form.totalAmount}
                    onChange={(e) => setForm({ ...form, totalAmount: e.target.value })}
                    placeholder="0.00"
                    icon={<FaMoneyBill />}
                    type="number"
                  />

                  <InputField
                    label="Paid Amount (₹)"
                    value={form.paidAmount}
                    onChange={(e) => setForm({ ...form, paidAmount: e.target.value })}
                    placeholder="0.00"
                    icon={<FaCheckCircle />}
                    type="number"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Payment Method
                    </label>
                    <select
                      value={form.paymentMethod}
                      onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                      className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all"
                    >
                      <option value="">Select Method</option>
                      <option value="CASH">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                      <option value="CHEQUE">Cheque</option>
                      <option value="CARD">Card</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <InputField
                    label="Transaction ID / Receipt #"
                    value={form.transactionId}
                    onChange={(e) => setForm({ ...form, transactionId: e.target.value })}
                    placeholder="Enter transaction reference"
                    icon={<FaReceipt />}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Payment Notes
                  </label>
                  <textarea
                    value={form.paymentNotes}
                    onChange={(e) => setForm({ ...form, paymentNotes: e.target.value })}
                    placeholder="Any additional payment details..."
                    rows={2}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {submitting ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                {submitting ? "Saving..." : editingLead ? "Update Lead" : "Create Lead"}
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setActiveTab("leads");
                }}
                className="px-8 py-4 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && <Profile onUpdate={(updatedUser) => setUser(updatedUser)} />}
        </main>

        <AnimatePresence>
          {selectedLead && (
            <LeadDetailModal 
              lead={selectedLead} 
              onClose={() => setSelectedLead(null)} 
              onEdit={(l) => { setSelectedLead(null); handleEdit(l); }}
              getStatusColor={getStatusColor}
              getPaymentStatusColor={getPaymentStatusColor}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function LeadDetailModal({ lead, onClose, onEdit, getStatusColor, getPaymentStatusColor }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <div className="p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-start mb-8">
            <div>
              <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                Lead #{lead.id}
              </span>
              <h2 className="text-3xl font-black text-gray-900 mt-2">{lead.client_name}</h2>
              <div className="flex gap-2 mt-3">
                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getStatusColor(lead.status)}`}>
                  {lead.status}
                </span>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getPaymentStatusColor(lead.payment_status)}`}>
                  Payment: {lead.payment_status}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <FaTimes size={20} className="text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Contact Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                      <FaPhone size={14} />
                    </div>
                    <span className="text-sm font-bold text-gray-700">{lead.client_phone}</span>
                  </div>
                  {lead.client_email && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                        <FaEnvelope size={14} />
                      </div>
                      <span className="text-sm font-bold text-gray-700">{lead.client_email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Location Details</h4>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                   <div className="flex items-center gap-3">
                     <FaMapMarkerAlt className="text-orange-500" />
                     <span className="text-sm font-medium text-gray-600">{lead.exact_location || 'No address provided'}</span>
                   </div>
                   {lead.latitude && (
                     <div className="flex items-center gap-3 text-xs text-gray-400 pt-2 border-t border-gray-200">
                        <FaMapPin className="text-green-500" />
                        <span>GPS: {lead.latitude}, {lead.longitude}</span>
                     </div>
                   )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Service & Project</h4>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="font-black text-orange-600 text-sm mb-2">{lead.service_type}</div>
                  <p className="text-sm text-gray-600 leading-relaxed">{lead.project_brief || 'No project description provided.'}</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Financial Overview</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Total</p>
                    <p className="text-lg font-black text-gray-900">₹{lead.total_amount || 0}</p>
                  </div>
                  <div className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Paid</p>
                    <p className="text-lg font-black text-green-600">₹{lead.paid_amount || 0}</p>
                  </div>
                </div>
                {lead.payment_notes && (
                  <div className="mt-3 p-3 bg-orange-50/50 rounded-xl text-[11px] text-orange-800 border border-orange-100 italic">
                    Note: {lead.payment_notes}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-10">
            <button 
              onClick={() => onEdit(lead)}
              className="flex-1 py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-xl shadow-orange-100 flex items-center justify-center gap-2"
            >
              <FaEdit /> Edit Lead Details
            </button>
            <button 
              onClick={onClose}
              className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Reusable Input Field Component
function InputField({ label, value, onChange, placeholder, icon, type = "text" }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400">{icon}</div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all ${
            icon ? "pl-12" : ""
          }`}
        />
      </div>
    </div>
  );
}
