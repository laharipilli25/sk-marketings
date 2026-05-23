import toast from "react-hot-toast";
import { createPortal } from 'react-dom';
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUsers, FaUserTie, FaUserCheck, FaClock, FaUserTimes,
  FaUserPlus, FaEdit, FaEye, FaUserFriends, FaFilter,
  FaSearch, FaPhone, FaMapMarkerAlt, FaEnvelope, FaIdCard,
  FaLock, FaUser, FaCheck, FaCheckCircle, FaTimes,
  FaTimesCircle, FaSpinner, FaFileExcel, FaFilePdf,
} from "react-icons/fa";
import { exportToExcel, exportToPDF } from "../../utils/exportUtils";

const API_URL = import.meta.env.VITE_API_URL;
const imgBase = () => API_URL.replace(/\/api\/?$/, "");
const auth = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });
const statusColor = (s) =>
  ({ ACTIVE: "bg-green-100 text-green-600", PENDING: "bg-yellow-100 text-yellow-600", INACTIVE: "bg-gray-100 text-gray-600", REJECTED: "bg-red-100 text-red-600" }[s] || "bg-gray-100 text-gray-600");

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white/90 backdrop-blur-md p-3 md:p-4 rounded-2xl shadow-lg border border-white">
      <div className={`w-8 h-8 md:w-10 md:h-10 ${color} rounded-xl flex items-center justify-center text-white text-base md:text-lg mb-1.5 md:mb-2`}>{icon}</div>
      <div className="text-lg md:text-xl font-black text-gray-900">{value}</div>
      <div className="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-tight">{label}</div>
    </div>
  );
}

// ── Styled Input ───────────────────────────────────────────────────────────
function FInput({ label, value, onChange, placeholder, icon, type = "text" }) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group">
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors pointer-events-none">{icon}</div>}
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}
          className={`w-full ${icon ? "pl-12" : "pl-4"} pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold`} />
      </div>
    </div>
  );
}

// ── Styled Select ──────────────────────────────────────────────────────────
function FSelect({ label, value, onChange, options, placeholder, icon, disabled }) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group">
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors pointer-events-none z-10">{icon}</div>}
        <select value={value} onChange={onChange} disabled={disabled}
          className={`w-full ${icon ? "pl-12" : "pl-4"} pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold appearance-none disabled:opacity-50`}>
          <option value="">{placeholder}</option>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
export default function ManageManagers() {

  // Data
  const [managers, setManagers]     = useState([]);
  const [allManagers, setAllManagers] = useState([]);   // for export
  const [stats, setStats]           = useState({ totalManagers: 0, activeManagers: 0, pendingManagers: 0, inactiveManagers: 0 });
  const [loading, setLoading]       = useState(false);
  const [managerCounts, setManagerCounts] = useState({}); // { managerId: count }

  // Pagination
  const [page, setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [filters, setFilters] = useState({ search: "", state_id: "", district_id: "", mandal: "", village: "" });

  // Location
  const [states, setStates]     = useState([]);
  const [districts, setDistricts] = useState([]);
  const [mandals, setMandals]   = useState([]);
  const [villages, setVillages] = useState([]);

  // Modal location (shared between create/edit)
  const [mDistricts, setMDistricts] = useState([]);
  const [mMandals, setMMandals]     = useState([]);

  // Modals
  const [showCreate, setShowCreate] = useState(false);
  const [showView,   setShowView]   = useState(false);
  const [showEdit,   setShowEdit]   = useState(false);
  const [viewMgr,    setViewMgr]    = useState(null);

  const emptyForm = { fullName:"", email:"", phone:"", alternatePhone:"", password:"", state_id:"", district_id:"", mandal_id:"", village:"", aadharNumber:"", profilePhoto:null, status:"ACTIVE" };
  const [createForm, setCreateForm] = useState(emptyForm);
  const [editForm,   setEditForm]   = useState(emptyForm);

  // Drawer
  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const [drawerMgr,   setDrawerMgr]   = useState(null);
  const [drawerAgents, setDrawerAgents] = useState([]);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [drawerSearch,  setDrawerSearch]  = useState("");
  const [drawerDistricts, setDrawerDistricts] = useState([]);
  const [drawerMandals,   setDrawerMandals]   = useState([]);
  const [drawerDist, setDrawerDist] = useState("");
  const [drawerMandal, setDrawerMandal] = useState("");
  const [selected, setSelected] = useState([]);
  const [saving, setSaving]     = useState(false);

  // ── Boot ──────────────────────────────────────────────────────────────────
  useEffect(() => { fetchStates(); fetchStats(); fetchAllManagers(); }, []);
  useEffect(() => { setPage(1); }, [filters]);
  useEffect(() => {
    const t = setTimeout(() => fetchManagers(page), 300);
    return () => clearTimeout(t);
  }, [filters, page]);

  // ── API ───────────────────────────────────────────────────────────────────
  const fetchStats = async () => {
    try {
      const r = await fetch(`${API_URL}/auth/managers/stats`, { headers: auth() });
      if (r.ok) setStats(await r.json());
    } catch (e) { console.error(e); }
  };

  const fetchManagers = async (p = 1) => {
    try {
      const q = new URLSearchParams({ page: p, limit: 10 });
      if (filters.search)      q.append("search", filters.search);
      if (filters.state_id)    q.append("state_id", filters.state_id);
      if (filters.district_id) q.append("district_id", filters.district_id);
      if (filters.mandal)      q.append("mandal", filters.mandal);
      if (filters.village)     q.append("village", filters.village);
      const r = await fetch(`${API_URL}/auth/managers?${q}`, { headers: auth() });
      if (r.ok) {
        const d = await r.json();
        setManagers(d.managers || []);
        setTotalPages(d.totalPages || 1);
        setPage(d.currentPage || 1);
      }
    } catch (e) { console.error(e); }
  };

  const fetchAllManagers = async () => {
    try {
      const r = await fetch(`${API_URL}/auth/managers`, { headers: auth() });
      if (r.ok) { const d = await r.json(); setAllManagers(d.managers || []); }
    } catch (e) { console.error(e); }
  };

  // Location cascades
  const fetchStates     = async () => { try { const r = await fetch(`${API_URL}/auth/states`); if (r.ok) setStates(await r.json()); } catch(e){} };
  const fetchDistricts  = async (sid, target) => {
    try {
      const r = await fetch(`${API_URL}/auth/districts/${sid}`);
      if (!r.ok) return;
      const d = await r.json();
      if (target === "filter")  { setDistricts(d); setMandals([]); setVillages([]); }
      if (target === "modal")   { setMDistricts(d); setMMandals([]); }
      if (target === "drawer")  { setDrawerDistricts(d); }
    } catch(e){}
  };
  const fetchMandals = async (sid, did, target) => {
    try {
      const r = await fetch(`${API_URL}/auth/mandals/${sid}/${did}`);
      if (!r.ok) return;
      const d = await r.json();
      if (target === "filter") { setMandals(d); setVillages([]); }
      if (target === "modal")  { setMMandals(d); }
      if (target === "drawer") { setDrawerMandals(d); }
    } catch(e){}
  };
  const fetchVillages = async (sid, did, mid) => {
    try { const r = await fetch(`${API_URL}/auth/villages/${sid}/${did}/${mid}`); if (r.ok) setVillages(await r.json()); } catch(e){}
  };

  // ── CRUD ──────────────────────────────────────────────────────────────────
  const buildFD = (form) => {
    const fd = new FormData();
    fd.append("fullName", form.fullName);
    fd.append("email", form.email);
    fd.append("phone", form.phone);
    fd.append("status", form.status || "ACTIVE");
    if (form.alternatePhone) fd.append("alternatePhone", form.alternatePhone);
    if (form.password)       fd.append("password", form.password);
    if (form.state_id)       fd.append("state_id", form.state_id);
    if (form.district_id)    fd.append("district_id", form.district_id);
    if (form.mandal_id)      fd.append("mandal_id", form.mandal_id);
    if (form.village)        fd.append("village", form.village);
    if (form.aadharNumber)   fd.append("aadharNumber", form.aadharNumber);
    if (form.profilePhoto instanceof File) fd.append("profilePhoto", form.profilePhoto);
    return fd;
  };

  const createManager = async () => {
    if (!createForm.fullName || !createForm.email || !createForm.phone || !createForm.password) { toast.error("Fill all required fields"); return; }
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/auth/create-manager`, { method:"POST", headers: auth(), body: buildFD(createForm) });
      if (r.ok) { toast.success("Manager created!"); setShowCreate(false); setCreateForm(emptyForm); setMDistricts([]); setMMandals([]); fetchManagers(1); fetchStats(); fetchAllManagers(); }
      else { const d = await r.json(); toast.error(d.message || "Failed"); }
    } catch(e) { toast.error("Network error"); }
    finally { setLoading(false); }
  };

  const updateManager = async () => {
    if (!editForm.fullName || !editForm.email || !editForm.phone) { toast.error("Fill required fields"); return; }
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/auth/agents/${editForm.id}`, { method:"PUT", headers: auth(), body: buildFD(editForm) });
      if (r.ok) { toast.success("Manager updated!"); setShowEdit(false); fetchManagers(page); fetchAllManagers(); }
      else { const d = await r.json(); toast.error(d.message || "Failed"); }
    } catch(e) { toast.error("Network error"); }
    finally { setLoading(false); }
  };

  const toggleStatus = async (id, cur) => {
    const ns = cur === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      const r = await fetch(`${API_URL}/auth/managers/${id}/status`, { method:"PUT", headers:{...auth(),"Content-Type":"application/json"}, body: JSON.stringify({ status: ns }) });
      if (r.ok) { toast.success("Status updated!"); fetchManagers(page); fetchStats(); fetchAllManagers(); }
    } catch(e) { toast.error("Network error"); }
  };

  const approveReject = async (id, status) => {
    try {
      const r = await fetch(`${API_URL}/auth/managers/${id}/status`, { method:"PUT", headers:{...auth(),"Content-Type":"application/json"}, body: JSON.stringify({ status }) });
      if (r.ok) { toast.success(`Manager ${status.toLowerCase()}!`); fetchManagers(page); fetchStats(); fetchAllManagers(); }
    } catch(e) { toast.error("Network error"); }
  };

  // ── Edit pre-fill ─────────────────────────────────────────────────────────
  const handleEdit = (m) => {
    setEditForm({ id:m.id, fullName:m.full_name, email:m.email, phone:m.phone, alternatePhone:m.alternate_phone||"", password:"",
      state_id:m.state_id||"", district_id:m.district_id||"", mandal_id:m.mandal_id||"", village:m.village||"",
      aadharNumber:m.aadhar_number||"", status:m.status, profilePhoto:m.profile_photo||null });
    setMDistricts([]); setMMandals([]);
    if (m.state_id)              fetchDistricts(m.state_id, "modal");
    if (m.state_id&&m.district_id) fetchMandals(m.state_id, m.district_id, "modal");
    setShowEdit(true);
  };

  // ── Agent Drawer ──────────────────────────────────────────────────────────
  const openDrawer = async (m) => {
    setDrawerMgr(m);
    setDrawerSearch("");
    setDrawerDist("");
    setDrawerMandal("");
    setDrawerDistricts([]);
    setDrawerMandals([]);
    setDrawerOpen(true);
    // Load districts for this manager's state
    if (m.state_id) fetchDistricts(m.state_id, "drawer");
    // Load agents (state-wide, no district filter initially)
    await loadDrawerAgents(m, "", "");
  };

  const loadDrawerAgents = async (m, distId, mandalId) => {
    setDrawerLoading(true);
    try {
      const q = new URLSearchParams();
      if (distId)   q.append("district_id", distId);
      if (mandalId) q.append("mandal_id", mandalId);
      const r = await fetch(`${API_URL}/auth/managers/${m.id}/agents?${q}`, { headers: auth() });
      if (r.ok) {
        const d = await r.json();
        const agents = d.agents || [];
        setDrawerAgents(agents);
        // Pre-select already-assigned agents
        const assignedIds = agents.filter(a => String(a.manager_id) === String(m.id)).map(a => a.id);
        setSelected(assignedIds);
        // Update local count
        setManagerCounts(prev => ({ ...prev, [m.id]: assignedIds.length }));
      }
    } catch(e) { console.error(e); }
    finally { setDrawerLoading(false); }
  };

  const toggleAgent = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const saveAssignments = async () => {
    if (!drawerMgr) return;
    setSaving(true);
    try {
      const r = await fetch(`${API_URL}/auth/managers/${drawerMgr.id}/save-agents`, {
        method:"POST", headers:{...auth(),"Content-Type":"application/json"}, body: JSON.stringify({ agentIds: selected }),
      });
      if (r.ok) {
        const d = await r.json();
        toast.success(`Saved! ${d.assignedCount} agent(s) assigned.`);
        // Update count immediately
        setManagerCounts(prev => ({ ...prev, [drawerMgr.id]: d.assignedCount }));
        // Refresh managers list so table reflects new count if backend returns it
        fetchManagers(page);
        fetchAllManagers();
      } else toast.error("Failed to save");
    } catch(e) { toast.error("Network error"); }
    finally { setSaving(false); }
  };

  // ── Exports ───────────────────────────────────────────────────────────────
  const handleExportExcel = () => {
    const data = allManagers.map(m => ({
      ID: m.id, Name: m.full_name, Email: m.email, Phone: m.phone,
      State: m.state?.name || "N/A", District: m.district?.name || "N/A",
      Mandal: m.mandal?.name || "N/A", Village: m.village || "N/A",
      "Assigned Agents": managerCounts[m.id] ?? m.assignedAgentsCount ?? 0,
      Status: m.status,
    }));
    exportToExcel(data, `Managers_Export_${new Date().toISOString().split("T")[0]}`);
  };

  const handleExportPDF = () => {
    const headers = ["Name", "Phone", "Location", "Assigned Agents", "Status"];
    const data = allManagers.map(m => [
      m.full_name, m.phone,
      `${m.district?.name || "N/A"}, ${m.state?.name || "N/A"}`,
      managerCounts[m.id] ?? m.assignedAgentsCount ?? 0,
      m.status,
    ]);
    exportToPDF(headers, data, `Managers_Export_${new Date().toISOString().split("T")[0]}`, "Managers Report");
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const visibleAgents = drawerAgents.filter(a =>
    !drawerSearch || a.full_name?.toLowerCase().includes(drawerSearch.toLowerCase())
  );

  const getCount = (m) => managerCounts[m.id] ?? m.assignedAgentsCount ?? 0;

  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={<FaUserTie />}   label="Total Managers"    value={stats.totalManagers}    color="bg-orange-500" />
        <StatCard icon={<FaUserCheck />} label="Active"            value={stats.activeManagers}   color="bg-green-500" />
        <StatCard icon={<FaClock />}     label="Pending Approvals" value={stats.pendingManagers}  color="bg-yellow-500" />
        <StatCard icon={<FaUserTimes />} label="Inactive"          value={stats.inactiveManagers} color="bg-gray-500" />
      </div>

      {/* Create button */}
      <button
        onClick={() => { setCreateForm(emptyForm); setMDistricts([]); setMMandals([]); setShowCreate(true); }}
        className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 transition-all shadow-lg w-fit"
      >
        <FaUserPlus /> Create New Manager
      </button>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2">
          <FaFilter className="text-orange-500" />
          <select value={filters.state_id} onChange={e => {
            const id = e.target.value;
            setFilters({ ...filters, state_id:id, district_id:"", mandal:"", village:"" });
            setDistricts([]); setMandals([]); setVillages([]);
            if (id) fetchDistricts(id, "filter");
          }} className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 outline-none">
            <option value="">All States</option>
            {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <select value={filters.district_id} disabled={!filters.state_id}
          onChange={e => { const id=e.target.value; setFilters({...filters,district_id:id,mandal:"",village:""}); setMandals([]); setVillages([]); if(id) fetchMandals(filters.state_id,id,"filter"); }}
          className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 outline-none disabled:opacity-50">
          <option value="">All Districts</option>
          {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>

        <select value={filters.mandal} disabled={!filters.district_id}
          onChange={e => { const v=e.target.value; setFilters({...filters,mandal:v,village:""}); setVillages([]); if(v) fetchVillages(filters.state_id,filters.district_id,v); }}
          className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 outline-none disabled:opacity-50">
          <option value="">All Mandals</option>
          {mandals.map((m,i) => <option key={i} value={m.id}>{m.mandal}</option>)}
        </select>

        <select value={filters.village} disabled={!filters.mandal}
          onChange={e => setFilters({...filters,village:e.target.value})}
          className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 outline-none disabled:opacity-50">
          <option value="">All Villages</option>
          {villages.map((v,i) => <option key={i} value={v.village}>{v.village}</option>)}
        </select>

        <div className="flex items-center gap-2 flex-1 min-w-[180px]">
          <FaSearch className="text-gray-400 flex-shrink-0" />
          <input type="text" placeholder="Search manager name..." value={filters.search}
            onChange={e => setFilters({...filters,search:e.target.value})}
            className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-500" />
        </div>

        <div className="flex gap-2 items-center">
          <button onClick={() => { setFilters({search:"",state_id:"",district_id:"",mandal:"",village:""}); setDistricts([]); setMandals([]); setVillages([]); }}
            className="p-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-600 hover:text-white transition-all" title="Clear Filters">
            <FaTimes />
          </button>
          <div className="h-6 w-px bg-gray-200" />
          <button onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-bold hover:bg-green-600 hover:text-white transition-all shadow-sm">
            <FaFileExcel /> Export
          </button>
          <button onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm">
            <FaFilePdf /> PDF
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 text-left border-b border-gray-100">
                {["Manager","Contact","Location","Assigned Agents","Status","Actions"].map(h => (
                  <th key={h} className="p-3 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {managers.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500 font-bold text-sm">No managers found.</td></tr>
              ) : managers.map(m => (
                <tr key={m.id} className="hover:bg-gray-50/50 transition-colors group">

                  {/* Manager */}
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold overflow-hidden border-2 border-white shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
                        {m.profile_photo
                          ? <img src={`${imgBase()}/${m.profile_photo}`} alt="" className="w-full h-full object-cover" />
                          : m.full_name?.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-black text-gray-900 group-hover:text-orange-600 transition-colors truncate">{m.full_name}</div>
                        <div className="text-[10px] text-gray-400 font-medium truncate">{m.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm font-bold text-gray-700">
                      <FaPhone className="text-orange-500 text-xs flex-shrink-0" /> {m.phone}
                    </div>
                  </td>

                  {/* Location */}
                  <td className="p-3">
                    <div className="flex items-start gap-1">
                      <FaMapMarkerAlt className="text-orange-500 text-xs mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-black text-gray-900">{m.mandal?.name || "N/A"}, {m.village || "N/A"}</div>
                        <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{m.district?.name}, {m.state?.name}</div>
                      </div>
                    </div>
                  </td>

                  {/* Assigned Agents */}
                  <td className="p-3">
                    <button onClick={() => openDrawer(m)}
                      className="flex items-center gap-2 px-3 py-2 bg-orange-50 text-orange-700 rounded-xl hover:bg-orange-600 hover:text-white transition-all group/btn">
                      <FaUserFriends size={13} />
                      <span className="text-sm font-black">{getCount(m)}</span>
                      <span className="text-[10px] font-bold hidden group-hover/btn:inline">Agents</span>
                    </button>
                  </td>

                  {/* Status */}
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${statusColor(m.status)}`}>
                      {m.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => { setViewMgr(m); setShowView(true); }}
                        className="p-2 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-600 hover:text-white transition-all" title="View">
                        <FaEye size={13} />
                      </button>
                      <button onClick={() => handleEdit(m)}
                        className="p-2 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-600 hover:text-white transition-all" title="Edit">
                        <FaEdit size={13} />
                      </button>
                      <button onClick={() => openDrawer(m)}
                        className="p-2 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-600 hover:text-white transition-all" title="Assign Agents">
                        <FaUserFriends size={13} />
                      </button>
                      {m.status === "PENDING" ? (
                        <>
                          <button onClick={() => approveReject(m.id,"ACTIVE")}
                            className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all" title="Approve">
                            <FaCheck size={13} />
                          </button>
                          <button onClick={() => approveReject(m.id,"REJECTED")}
                            className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all" title="Reject">
                            <FaTimes size={13} />
                          </button>
                        </>
                      ) : (
                        <button onClick={() => toggleStatus(m.id, m.status)}
                          className={`p-2 rounded-xl transition-all ${m.status==="ACTIVE" ? "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white" : "bg-green-50 text-green-600 hover:bg-green-600 hover:text-white"}`}
                          title={m.status==="ACTIVE" ? "Deactivate" : "Activate"}>
                          {m.status==="ACTIVE" ? <FaUserTimes size={13}/> : <FaUserCheck size={13}/>}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white">
              <span className="text-sm text-gray-500 font-bold">Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button disabled={page===1} onClick={() => setPage(p=>Math.max(1,p-1))}
                  className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-50 font-bold">Previous</button>
                <button disabled={page===totalPages} onClick={() => setPage(p=>Math.min(totalPages,p+1))}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 font-bold shadow-sm">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* AGENT ASSIGNMENT DRAWER                                           */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {createPortal(<AnimatePresence>
        {drawerOpen && drawerMgr && (
          <>
            {/* Backdrop */}
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm"
              onClick={() => setDrawerOpen(false)} />

            {/* Drawer panel */}
            <motion.div
              initial={{ x:"100%" }} animate={{ x:0 }} exit={{ x:"100%" }}
              transition={{ type:"spring", damping:28, stiffness:280 }}
              className="fixed right-0 top-0 h-full z-[120] w-full max-w-[420px] bg-white shadow-2xl flex flex-col"
            >
              {/* ── Drawer Header */}
              <div className="flex-shrink-0 p-5 border-b border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                        <FaUserFriends size={14} />
                      </div>
                      Assign Agents
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 ml-10">
                      <span className="font-bold text-gray-800">{drawerMgr.full_name}</span>
                      <span className="mx-1.5 text-gray-300">·</span>
                      <span className="text-orange-600 font-bold">{drawerMgr.state?.name}</span>
                    </p>
                  </div>
                  <button onClick={() => setDrawerOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600 flex-shrink-0">
                    <FaTimes size={16} />
                  </button>
                </div>

                {/* Selection summary */}
                <div className="flex items-center gap-2 bg-orange-50 rounded-xl px-3 py-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-xs font-black text-orange-700">{selected.length} agent{selected.length !== 1 ? "s" : ""} selected</span>
                  {selected.length > 0 && (
                    <button onClick={() => setSelected([])} className="ml-auto text-[10px] font-black text-orange-500 hover:text-orange-700">
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              {/* ── Drawer Filters */}
              <div className="flex-shrink-0 p-4 border-b border-gray-100 space-y-2 bg-gray-50/50">
                {/* Search */}
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
                  <FaSearch className="text-gray-400 flex-shrink-0" size={12} />
                  <input type="text" placeholder="Search agent by name..."
                    value={drawerSearch} onChange={e => setDrawerSearch(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm font-bold text-gray-700 placeholder:font-normal" />
                  {drawerSearch && (
                    <button onClick={() => setDrawerSearch("")} className="text-gray-400 hover:text-gray-600">
                      <FaTimes size={10} />
                    </button>
                  )}
                </div>
                {/* District + Mandal row */}
                <div className="flex gap-2">
                  <select value={drawerDist}
                    onChange={e => {
                      const id = e.target.value;
                      setDrawerDist(id); setDrawerMandal(""); setDrawerMandals([]);
                      if (id) fetchMandals(drawerMgr.state_id, id, "drawer");
                      loadDrawerAgents(drawerMgr, id, "");
                    }}
                    className="flex-1 p-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none">
                    <option value="">All Districts</option>
                    {drawerDistricts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                  <select value={drawerMandal} disabled={!drawerDist}
                    onChange={e => { const id=e.target.value; setDrawerMandal(id); loadDrawerAgents(drawerMgr, drawerDist, id); }}
                    className="flex-1 p-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none disabled:opacity-40">
                    <option value="">All Mandals</option>
                    {drawerMandals.map((m,i) => <option key={i} value={m.id}>{m.mandal}</option>)}
                  </select>
                </div>
              </div>

              {/* ── Agent list */}
              <div className="flex-1 overflow-y-auto overscroll-contain p-4">
                {drawerLoading ? (
                  <div className="flex flex-col items-center justify-center h-40 gap-3">
                    <FaSpinner className="animate-spin text-orange-500 text-2xl" />
                    <p className="text-sm text-gray-400 font-bold">Loading agents…</p>
                  </div>
                ) : visibleAgents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300">
                      <FaUsers size={20} />
                    </div>
                    <p className="text-sm text-gray-400 font-bold">No agents found</p>
                    <p className="text-xs text-gray-400">Try adjusting district / mandal filters</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Select / Deselect all */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black text-gray-500 uppercase tracking-wider">{visibleAgents.length} agent{visibleAgents.length!==1?"s":""} in state</span>
                      <button
                        onClick={() => {
                          const eligibleIds = visibleAgents.filter(a => !a.manager_id || String(a.manager_id)===String(drawerMgr.id)).map(a=>a.id);
                          const allSelected = eligibleIds.every(id => selected.includes(id));
                          if (allSelected) setSelected(prev => prev.filter(id => !eligibleIds.includes(id)));
                          else setSelected(prev => [...new Set([...prev, ...eligibleIds])]);
                        }}
                        className="text-[10px] font-black text-orange-600 hover:text-orange-800 bg-orange-50 px-2 py-1 rounded-lg"
                      >
                        {visibleAgents.filter(a=>!a.manager_id||String(a.manager_id)===String(drawerMgr.id)).every(a=>selected.includes(a.id)) ? "Deselect All" : "Select All"}
                      </button>
                    </div>

                    {visibleAgents.map(agent => {
                      const isSelected        = selected.includes(agent.id);
                      const assignedElsewhere = agent.manager_id && String(agent.manager_id) !== String(drawerMgr.id);

                      return (
                        <div key={agent.id}
                          onClick={() => !assignedElsewhere && toggleAgent(agent.id)}
                          className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all select-none ${
                            assignedElsewhere ? "border-gray-100 bg-gray-50/50 opacity-50 cursor-not-allowed"
                            : isSelected      ? "border-orange-400 bg-orange-50 cursor-pointer"
                                              : "border-gray-100 bg-white hover:border-gray-300 cursor-pointer"
                          }`}
                        >
                          {/* Avatar */}
                          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 font-bold flex items-center justify-center overflow-hidden flex-shrink-0">
                            {agent.profile_photo
                              ? <img src={`${imgBase()}/${agent.profile_photo}`} alt="" className="w-full h-full object-cover" />
                              : agent.full_name?.charAt(0)}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="font-black text-gray-900 text-sm truncate">{agent.full_name}</div>
                            <div className="text-[10px] text-gray-400 font-medium">
                              {[agent.district?.name, agent.mandal?.name].filter(Boolean).join(" · ") || "—"}
                            </div>
                            {assignedElsewhere && (
                              <div className="text-[10px] text-red-500 font-bold">Assigned to another manager</div>
                            )}
                          </div>

                          {/* Status pill */}
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full flex-shrink-0 ${statusColor(agent.status)}`}>
                            {agent.status}
                          </span>

                          {/* Checkbox */}
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            isSelected ? "bg-orange-600 border-orange-600" : "border-gray-300"
                          }`}>
                            {isSelected && <FaCheck size={9} className="text-white" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ── Drawer Footer */}
              <div className="flex-shrink-0 p-4 border-t border-gray-100 bg-white">
                <div className="flex gap-3">
                  <button onClick={saveAssignments} disabled={saving}
                    className="flex-1 py-3.5 bg-orange-600 text-white rounded-2xl font-black hover:bg-orange-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-orange-100">
                    {saving ? <FaSpinner className="animate-spin" /> : <FaCheckCircle size={14} />}
                    {saving ? "Saving…" : `Save (${selected.length} selected)`}
                  </button>
                  <button onClick={() => setDrawerOpen(false)}
                    className="px-5 py-3.5 bg-gray-100 text-gray-600 rounded-2xl font-black hover:bg-gray-200 transition-all">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>, document.body)}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* VIEW MODAL                                                        */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {createPortal(<AnimatePresence>
        {showView && viewMgr && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{opacity:0,scale:0.92}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.92}}
              className="bg-white rounded-[2rem] p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto overscroll-contain shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-gray-900">Manager Details</h3>
                <button onClick={() => setShowView(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <FaTimesCircle className="text-2xl text-gray-400" />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-3xl font-bold overflow-hidden border-4 border-white shadow-md flex-shrink-0">
                  {viewMgr.profile_photo
                    ? <img src={`${imgBase()}/${viewMgr.profile_photo}`} alt="" className="w-full h-full object-cover" />
                    : viewMgr.full_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{viewMgr.full_name}</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor(viewMgr.status)}`}>{viewMgr.status}</span>
                  <p className="text-sm text-gray-400 mt-1">Manager</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {[
                  { l:"Email",          v: viewMgr.email },
                  { l:"Phone",          v: viewMgr.phone },
                  viewMgr.alternate_phone && { l:"Alternate Phone", v: viewMgr.alternate_phone },
                  { l:"Location",       v: [viewMgr.village, viewMgr.mandal?.name, viewMgr.district?.name, viewMgr.state?.name].filter(Boolean).join(", ") },
                  viewMgr.aadhar_number && { l:"Aadhar", v:`XXXX-XXXX-${viewMgr.aadhar_number.slice(-4)}` },
                  { l:"Joined",         v: new Date(viewMgr.created_at).toLocaleDateString() },
                ].filter(Boolean).map(item => (
                  <div key={item.l} className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-[10px] text-gray-400 font-black uppercase">{item.l}</p>
                    <p className="text-gray-900 font-medium mt-0.5">{item.v}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-orange-50 p-4 rounded-xl text-center">
                  <p className="text-2xl font-black text-orange-600">{getCount(viewMgr)}</p>
                  <p className="text-xs text-gray-500 mt-1">Assigned Agents</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl text-center">
                  <p className="text-lg font-black text-orange-600">{viewMgr.state?.name || "—"}</p>
                  <p className="text-xs text-gray-500 mt-1">State Coverage</p>
                </div>
              </div>

              <button onClick={() => setShowView(false)}
                className="w-full py-4 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition-all mt-6">
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>, document.body)}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* CREATE MODAL                                                      */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {createPortal(<AnimatePresence>
        {showCreate && (
          <ManagerFormModal title="Create New Manager" icon={<FaUserPlus size={18}/>}
            form={createForm} setForm={setCreateForm}
            states={states} districts={mDistricts} mandals={mMandals}
            onStateChange={id => { setCreateForm(f=>({...f,state_id:id,district_id:"",mandal_id:"",village:""})); setMDistricts([]); setMMandals([]); if(id) fetchDistricts(id,"modal"); }}
            onDistrictChange={id => { setCreateForm(f=>({...f,district_id:id,mandal_id:"",village:""})); setMMandals([]); if(id) fetchMandals(createForm.state_id,id,"modal"); }}
            onMandalChange={id => setCreateForm(f=>({...f,mandal_id:id}))}
            onSubmit={createManager} onCancel={() => setShowCreate(false)}
            loading={loading} submitLabel="Create Manager" loadingLabel="Creating…" submitIcon={<FaUserPlus size={14}/>}
          />
        )}
      </AnimatePresence>, document.body)}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* EDIT MODAL                                                        */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {createPortal(<AnimatePresence>
        {showEdit && (
          <ManagerFormModal title="Edit Manager" icon={<FaEdit size={18}/>}
            form={editForm} setForm={setEditForm}
            states={states} districts={mDistricts} mandals={mMandals}
            onStateChange={id => { setEditForm(f=>({...f,state_id:id,district_id:"",mandal_id:"",village:""})); setMDistricts([]); setMMandals([]); if(id) fetchDistricts(id,"modal"); }}
            onDistrictChange={id => { setEditForm(f=>({...f,district_id:id,mandal_id:"",village:""})); setMMandals([]); if(id) fetchMandals(editForm.state_id,id,"modal"); }}
            onMandalChange={id => setEditForm(f=>({...f,mandal_id:id}))}
            onSubmit={updateManager} onCancel={() => setShowEdit(false)}
            loading={loading} submitLabel="Update Manager" loadingLabel="Updating…" submitIcon={<FaCheckCircle size={14}/>}
            showStatus
          />
        )}
      </AnimatePresence>, document.body)}

    </div>
  );
}

// ── Manager Form Modal (shared by Create + Edit) ───────────────────────────
function ManagerFormModal({ title, icon, form, setForm, states, districts, mandals, onStateChange, onDistrictChange, onMandalChange, onSubmit, onCancel, loading, submitLabel, loadingLabel, submitIcon, showStatus=false }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95,y:20}}
        className="bg-white rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto overscroll-contain custom-scrollbar shadow-2xl relative">

        <button onClick={onCancel} className="absolute top-5 right-6 text-gray-400 hover:text-gray-600 transition-colors z-10">
          <FaTimes size={18} />
        </button>

        <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">{icon}</div>
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <FInput label="Full Name *" value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})} placeholder="Enter full name" icon={<FaUser size={13}/>} />
          <FInput label="Email *" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Enter email" icon={<FaEnvelope size={13}/>} type="email" />
          <FInput label="Phone *" value={form.phone}
            onChange={e=>setForm({...form,phone:e.target.value.replace(/\D/g,"").slice(0,10)})}
            placeholder="Enter phone number" icon={<FaPhone size={13}/>} />
          <FInput label="Alternate Number" value={form.alternatePhone}
            onChange={e=>setForm({...form,alternatePhone:e.target.value.replace(/\D/g,"").slice(0,10)})}
            placeholder="Alternate number" icon={<FaPhone size={13}/>} />

          {/* State */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest ml-1">State</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10"><FaMapMarkerAlt size={13}/></div>
              <select value={form.state_id||""} onChange={e=>onStateChange(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold appearance-none">
                <option value="">Select State</option>
                {states.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>

          {/* District */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest ml-1">District</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10"><FaMapMarkerAlt size={13}/></div>
              <select value={form.district_id||""} onChange={e=>onDistrictChange(e.target.value)} disabled={!form.state_id}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold appearance-none disabled:opacity-50">
                <option value="">Select District</option>
                {districts.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>

          {/* Mandal */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest ml-1">Mandal</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10"><FaMapMarkerAlt size={13}/></div>
              <select value={form.mandal_id||""} onChange={e=>onMandalChange(e.target.value)} disabled={!form.district_id}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold appearance-none disabled:opacity-50">
                <option value="">Select Mandal</option>
                {mandals.map((m,i)=><option key={i} value={m.id}>{m.mandal}</option>)}
              </select>
            </div>
          </div>

          <FInput label="Village" value={form.village} onChange={e=>setForm({...form,village:e.target.value})} placeholder="Enter village" icon={<FaMapMarkerAlt size={13}/>} />
          <FInput label="Aadhar Number" value={form.aadharNumber}
            onChange={e=>setForm({...form,aadharNumber:e.target.value.replace(/\D/g,"").slice(0,12)})}
            placeholder="12-digit Aadhar" icon={<FaIdCard size={13}/>} />
          <FInput label={showStatus ? "New Password (optional)" : "Password *"} value={form.password}
            onChange={e=>setForm({...form,password:e.target.value})}
            placeholder={showStatus ? "Leave blank to keep current" : "Enter password"} icon={<FaLock size={13}/>} type="password" />

          {showStatus && (
            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest ml-1">Status</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10"><FaCheckCircle size={13}/></div>
                <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white transition-all outline-none text-sm font-bold appearance-none">
                  {["ACTIVE","PENDING","INACTIVE","REJECTED"].map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Profile Photo */}
        <div className="mt-7 space-y-3">
          <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest ml-1">Profile Photo</label>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 overflow-hidden flex-shrink-0">
              {form.profilePhoto
                ? <img src={form.profilePhoto instanceof File ? URL.createObjectURL(form.profilePhoto) : `${imgBase()}/${form.profilePhoto}`} className="w-full h-full object-cover" alt="" />
                : <FaUser size={24} />}
            </div>
            <input type="file" accept="image/*" onChange={e=>setForm({...form,profilePhoto:e.target.files[0]})}
              className="text-xs font-bold text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 transition-all" />
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button onClick={onSubmit} disabled={loading}
            className="flex-1 py-4 bg-orange-600 text-white rounded-2xl font-black shadow-lg shadow-orange-100 hover:bg-orange-700 transition-all disabled:opacity-70 flex items-center justify-center gap-2">
            {loading ? <FaSpinner className="animate-spin"/> : submitIcon}
            {loading ? loadingLabel : submitLabel}
          </button>
          <button onClick={onCancel} className="px-10 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black hover:bg-gray-200 transition-all">
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}