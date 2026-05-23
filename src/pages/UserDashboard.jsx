import toast from 'react-hot-toast';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPhone, FaUser, FaMapMarkerAlt, FaFileAlt } from "react-icons/fa";
import SEO from "../components/SEO";

export default function UserDashboard() {
  // Added 'phone' to the state
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", village: "", description: "" });
  const [editIndex, setEditIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("data")) || [];
    setData(stored);
  }, []);

  const saveData = (newData) => {
    setData(newData);
    localStorage.setItem("data", JSON.stringify(newData));
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    navigate("/user-login");
  };

  const handleSubmit = () => {
    // Included phone validation
    if (!form.name || !form.phone || !form.village) return toast.error("Please fill all required details");

    if (editIndex !== null) {
      const updated = [...data];
      updated[editIndex] = form;
      saveData(updated);
      setEditIndex(null);
    } else {
      saveData([...data, form]);
    }

    setForm({ name: "", phone: "", village: "", description: "" });
  };

  return (
    <div className="min-h-screen mt-24 relative overflow-hidden">
      <SEO 
        title="Management Dashboard" 
        description="Submit client details and track progress records securely on the SK Marketings management portal." 
      />
      {/* ─── SHARED BACKGROUND LAYER ─── */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2669&auto=format&fit=crop')` 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/80 via-white/95 to-white" />
      </div>

      {/* ─── CONTENT LAYER ─── */}
      <div className="max-w-6xl mx-auto p-6 relative z-10">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h2 className="text-5xl font-black text-black-900 tracking-tight">
              Management <span className="text-orange-600">Dashboard</span>
            </h2>
            <div className="h-1.5 w-20 bg-orange-600 mt-4 rounded-full" />
          </div>

          <button 
            onClick={handleLogout}
            className="px-6 py-2 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all shadow-md active:scale-95 uppercase text-xs tracking-widest"
          >
            Logout
          </button>
        </header>

        {/* INPUT FORM CARD - Updated to Grid for 4 fields */}
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-xl border border-white mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                <FaUser /> Client Name
              </label>
              <input 
                className="w-full p-3 bg-white/50 border-b-2 border-orange-100 focus:border-orange-500 outline-none transition-colors font-medium text-gray-800"
                placeholder="Enter name..."
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* NEW PHONE NUMBER FIELD */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                <FaPhone /> Phone Number
              </label>
              <input 
                className="w-full p-3 bg-white/50 border-b-2 border-orange-100 focus:border-orange-500 outline-none transition-colors font-medium text-gray-800"
                placeholder="Ex: +91 00000 00000"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                <FaMapMarkerAlt /> Village/City
              </label>
              <input 
                className="w-full p-3 bg-white/50 border-b-2 border-orange-100 focus:border-orange-500 outline-none transition-colors font-medium text-gray-800"
                placeholder="Location..."
                value={form.village}
                onChange={(e) => setForm({ ...form, village: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                <FaFileAlt /> Project Brief
              </label>
              <input 
                className="w-full p-3 bg-white/50 border-b-2 border-orange-100 focus:border-orange-500 outline-none transition-colors font-medium text-gray-800"
                placeholder="Description..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>

          <button 
            onClick={handleSubmit} 
            className="w-full lg:w-auto px-12 py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-200 transition-all active:scale-95 uppercase text-sm tracking-widest"
          >
            {editIndex !== null ? "Update Client Record" : "Add New Submission"}
          </button>
        </div>

        {/* SUBMISSIONS LIST */}
        <div className="space-y-6">
          {data.map((item, index) => (
            <div 
              key={index} 
              className="group flex flex-col md:flex-row items-center justify-between p-6 bg-white/70 backdrop-blur-sm border border-white rounded-[2rem] shadow-lg hover:shadow-2xl hover:border-orange-300 transition-all duration-300 transform hover:-translate-y-1 gap-6"
            >
              <div className="flex items-center gap-6 flex-1">
                <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner shrink-0">
                  {index + 1}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-2xl group-hover:text-orange-600 transition-colors">
                    {item.name}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <p className="text-orange-500 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1">
                      <FaMapMarkerAlt className="text-sm" /> {item.village}
                    </p>
                    <p className="text-slate-900 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1">
                      <FaPhone className="text-sm" /> {item.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 shrink-0">
                <button 
                  onClick={() => navigate(`/view/${index}`)} 
                  className="px-5 py-2 text-sm font-bold text-orange-600 bg-orange-50 border border-orange-100 rounded-xl hover:bg-orange-600 hover:text-white transition-all"
                >
                  View
                </button>

                <button 
                  onClick={() => { setForm(data[index]); setEditIndex(index); window.scrollTo({top: 0, behavior: 'smooth'}); }} 
                  className="px-5 py-2 text-sm font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                >
                  Edit
                </button>

                <button 
                  onClick={() => saveData(data.filter((_, i) => i !== index))} 
                  className="px-5 py-2 text-sm font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {data.length === 0 && (
            <div className="py-20 text-center bg-white/40 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-orange-200">
                <p className="text-orange-300 font-black uppercase tracking-widest">No active submissions to manage</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}