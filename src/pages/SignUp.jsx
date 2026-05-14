import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaLock,
  FaUserAlt,
  FaArrowRight,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaIdCard,
  FaSpinner,
  FaCamera,
  FaPlus,
  FaHome,
} from "react-icons/fa";

import bgUser from "../assets/bguser.jpg";
import skLogo from "../assets/sklogo.png";

const API_URL = import.meta.env.VITE_API_URL;

export default function UserSignup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    alternatePhone: "",
    state_id: "",
    district_id: "",
    mandal: "",
    village: "",
    aadharNumber: "",
    password: "",
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({});

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/states`);

      if (response.ok) {
        const data = await response.json();
        setStates(data);
      }
    } catch (err) {
      console.error("Error fetching states:", err);
    }
  };

  const fetchDistricts = async (stateId) => {
    try {
      const response = await fetch(
        `${API_URL}/auth/districts/${stateId}`
      );

      if (response.ok) {
        const data = await response.json();
        setDistricts(data);
      }
    } catch (err) {
      console.error("Error fetching districts:", err);
    }
  };

  const handleStateChange = (e) => {
    const stateId = e.target.value;

    setFormData({
      ...formData,
      state_id: stateId,
      district_id: "",
    });

    setFieldErrors((prev) => ({
      ...prev,
      state_id: "",
    }));

    if (stateId) {
      fetchDistricts(stateId);
    } else {
      setDistricts([]);
    }
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    // FULL NAME
    if (name === "fullName") {
      value = value.replace(/[^A-Za-z\s]/g, "");
    }

    // PHONE NUMBERS
    if (name === "phone" || name === "alternatePhone") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }

    // MANDAL / VILLAGE
    if (name === "mandal" || name === "village") {
      value = value.replace(/[^A-Za-z\s]/g, "");
    }

    // AADHAR
    if (name === "aadharNumber") {
      value = value.replace(/\D/g, "").slice(0, 12);
    }

    setFormData({
      ...formData,
      [name]: value,
    });

    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProfilePhoto(file);
      setPreview(URL.createObjectURL(file));

      setFieldErrors((prev) => ({
        ...prev,
        profilePhoto: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // FULL NAME
    if (formData.fullName.trim().length < 3) {
      errors.fullName =
        "Full name must be at least 3 characters";
    }

    // PHONE
    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      errors.phone =
        "Enter valid 10 digit mobile number";
    }

    // ALTERNATE PHONE
    if (
      formData.alternatePhone &&
      !/^[6-9]\d{9}$/.test(formData.alternatePhone)
    ) {
      errors.alternatePhone =
        "Enter valid alternate mobile number";
    }

    // STATE
    if (!formData.state_id) {
      errors.state_id = "Please select state";
    }

    // DISTRICT
    if (!formData.district_id) {
      errors.district_id = "Please select district";
    }

    // MANDAL
    if (formData.mandal.trim().length < 2) {
      errors.mandal =
        "Mandal must be at least 2 characters";
    }

    // VILLAGE
    if (formData.village.trim().length < 2) {
      errors.village =
        "Village must be at least 2 characters";
    }

    // PASSWORD
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(formData.password)) {
      errors.password =
        "Password must contain uppercase, lowercase, number and 8 characters";
    }

    // PROFILE PHOTO
    if (profilePhoto) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (!allowedTypes.includes(profilePhoto.type)) {
        errors.profilePhoto =
          "Only JPG, PNG and WEBP images allowed";
      }

      if (profilePhoto.size > 5 * 1024 * 1024) {
        errors.profilePhoto =
          "Image size must be less than 5MB";
      }
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const form = new FormData();

      form.append("fullName", formData.fullName);
      form.append("email", formData.email);
      form.append("phone", formData.phone);
      form.append(
        "alternatePhone",
        formData.alternatePhone
      );
      form.append("state_id", formData.state_id);
      form.append("district_id", formData.district_id);
      form.append("mandal", formData.mandal);
      form.append("village", formData.village);
      form.append(
        "aadharNumber",
        formData.aadharNumber
      );
      form.append("password", formData.password);

      if (profilePhoto) {
        form.append("profilePhoto", profilePhoto);
      }

      const response = await fetch(
        `${API_URL}/auth/register`,
        {
          method: "POST",
          body: form,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed"
        );
      }

      setSuccess(true);

    } catch (err) {
      setError(
        err.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white font-body overflow-hidden">
      {/* LEFT SIDE - BRAND HIGHLIGHTS (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-slate-900">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 scale-105 animate-pulse-slow"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1600')` }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-orange-600/90 via-orange-500/80 to-slate-900/95" />

        <div className="relative z-20 w-full p-12 flex flex-col justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-between"
          >
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-2 shadow-xl group transition-transform duration-500">
                <img src={skLogo} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="block text-2xl font-black text-white tracking-tighter uppercase leading-none">Marketings</span>
                <span className="text-[10px] font-black text-orange-200 uppercase tracking-[0.3em]">Business Consultancy</span>
              </div>
            </Link>

            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10"
            >
              <FaHome /> Home
            </Link>
          </motion.div>

          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <h1 className="text-5xl font-black text-white leading-[1.1] mb-4 tracking-tighter">
                Start Your <span className="text-orange-200">Journey,</span><br />
                Build Your <span className="underline decoration-white/30 decoration-8 underline-offset-4 text-white">Legacy.</span>
              </h1>
              <p className="text-orange-50 text-base font-bold opacity-90 leading-relaxed mb-6">
                Become a part of India's fastest-growing business consultancy network. Empower yourself and your community with premium MSME solutions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="grid grid-cols-1 gap-4"
            >
              {[
                { title: "Pan-India Network", desc: "Collaborate with experts across the country." },
                { title: "Growth Opportunities", desc: "Scale your business with our proven strategies." }
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 hover:bg-white/20 transition-all cursor-default group">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                    <FaArrowRight className="-rotate-45" size={10} />
                  </div>
                  <div>
                    <div className="text-sm font-black text-white uppercase tracking-tight">{feature.title}</div>
                    <div className="text-[10px] text-orange-200 font-bold uppercase tracking-widest">{feature.desc}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="flex gap-12"
          >
            <div>
              <div className="text-4xl font-black text-white">500+</div>
              <div className="text-[10px] font-black text-orange-200 uppercase tracking-[0.2em]">Agents Active</div>
            </div>
            <div>
              <div className="text-4xl font-black text-white">24/7</div>
              <div className="text-[10px] font-black text-orange-200 uppercase tracking-[0.2em]">Support Desk</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT SIDE - SIGNUP FORM */}
      <div className="w-full lg:w-[55%] flex flex-col items-center p-8 pt-24 md:pt-12 bg-slate-50 relative overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden absolute top-6 left-6 right-6 flex items-center justify-between z-30 bg-slate-50/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/50 shadow-sm">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1 shadow-md">
              <img src={skLogo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-sm font-black text-slate-900 tracking-tighter uppercase leading-none">Marketings</span>
          </Link>
          <Link to="/" className="p-2 bg-white text-orange-500 rounded-lg shadow-sm border border-orange-50"><FaHome size={16} /></Link>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl my-auto"
        >
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 text-[10px] font-black px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
              ✨ Join Our Network
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-1">
              Create <span className="text-orange-500">Account.</span>
            </h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-tight">
              Fill in your professional details to get started.
            </p>
          </div>

          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-6 bg-green-50 border-2 border-green-100 rounded-3xl text-center shadow-lg shadow-green-100"
            >
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-green-800 font-black uppercase text-sm tracking-widest mb-2">Account Created Successfully!</h3>
              <p className="text-green-600 text-xs font-bold mb-6">Your account is pending admin approval. You will be able to login once approved.</p>
              <Link to="/user-login" className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-700 transition-all shadow-xl shadow-green-200">Go to Login <FaArrowRight /></Link>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-4 bg-red-50 border-2 border-red-100 rounded-2xl text-red-600 text-xs font-black uppercase text-center tracking-widest shadow-lg shadow-red-100"
            >
              ⚠️ {error}
            </motion.div>
          )}

          {!success && (
            <form onSubmit={handleSignup} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Profile Photo Upload */}
              <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-2">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-orange-100 bg-orange-50 flex items-center justify-center shadow-sm relative group">
                    {preview ? (
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <FaCamera className="text-orange-200 text-2xl" />
                    )}
                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <FaCamera className="text-white text-xl" />
                      <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                    </label>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Profile Identity</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 mb-3">Upload a professional headshot</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="block w-full text-[10px] text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-orange-100 file:text-orange-600 hover:file:bg-orange-200"
                    />
                    {fieldErrors.profilePhoto && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-tight">{fieldErrors.profilePhoto}</p>}
                  </div>
                </div>
              </div>

              <InputField icon={<FaUserAlt />} label="Full Name" name="fullName" placeholder="John Doe" value={formData.fullName} onChange={handleChange} error={fieldErrors.fullName} />
              <InputField icon={<FaUserAlt />} label="Email Address" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} />
              <InputField icon={<FaPhoneAlt />} label="Primary Phone" name="phone" placeholder="9876543210" value={formData.phone} onChange={handleChange} error={fieldErrors.phone} />
              <InputField icon={<FaPhoneAlt />} label="Alternate Phone" name="alternatePhone" placeholder="9876543210" value={formData.alternatePhone} onChange={handleChange} error={fieldErrors.alternatePhone} />

              <SelectField
                icon={<FaMapMarkerAlt />}
                label="State"
                name="state_id"
                value={formData.state_id}
                onChange={handleStateChange}
                placeholder="Select State"
                options={states.map(s => ({ value: s.id, label: s.name }))}
                error={fieldErrors.state_id}
              />
              <SelectField
                icon={<FaMapMarkerAlt />}
                label="District"
                name="district_id"
                value={formData.district_id}
                onChange={handleChange}
                placeholder="Select District"
                disabled={!formData.state_id}
                options={districts.map(d => ({ value: d.id, label: d.name }))}
                error={fieldErrors.district_id}
              />

              <InputField icon={<FaMapMarkerAlt />} label="Mandal" name="mandal" placeholder="Enter mandal" value={formData.mandal} onChange={handleChange} error={fieldErrors.mandal} />
              <InputField icon={<FaMapMarkerAlt />} label="Village" name="village" placeholder="Enter village" value={formData.village} onChange={handleChange} error={fieldErrors.village} />
              <InputField icon={<FaIdCard />} label="Aadhar Number" name="aadharNumber" placeholder="12-digit number" value={formData.aadharNumber} onChange={handleChange} />
              <InputField icon={<FaLock />} label="Password" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} error={fieldErrors.password} />

              <div className="md:col-span-2 mt-4">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-200 flex items-center justify-center gap-4 text-[11px] tracking-[0.3em] uppercase disabled:opacity-70"
                >
                  {loading ? <FaSpinner className="animate-spin text-lg" /> : <>Complete Registration <FaArrowRight /></>}
                </motion.button>
                <p className="mt-6 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Already registered? <Link to="/user-login" className="text-orange-500 hover:text-orange-600 transition-colors">Sign In Here</Link>
                </p>
              </div>
            </form>
          )}
          <p className="mt-8 mb-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">© 2026 SK Marketings. All rights reserved.</p>
        </motion.div>
      </div>
    </div>
  );
}

/* REUSABLE SELECT FIELD */
function SelectField({ icon, label, name, value, onChange, options, placeholder, disabled = false, error }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors z-10">{icon}</div>
        <select
          name={name}
          required
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full pl-12 pr-10 py-4 rounded-2xl bg-white border-2 focus:border-orange-500 focus:outline-none transition-all font-bold text-sm text-slate-800 appearance-none disabled:opacity-50 shadow-sm ${error ? "border-red-100 bg-red-50/30" : "border-slate-100"}`}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
        </select>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300"><FaArrowRight className="rotate-90 size-3" /></div>
      </div>
      {error && <p className="text-red-500 text-[10px] font-bold ml-2 uppercase tracking-tight">{error}</p>}
    </div>
  );
}

/* REUSABLE INPUT FIELD */
function InputField({ icon, label, name, type = "text", placeholder, value, onChange, error }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors">{icon}</div>
        <input
          type={type}
          name={name}
          required
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full pl-12 pr-5 py-4 rounded-2xl bg-white border-2 focus:border-orange-500 focus:outline-none transition-all font-bold text-sm text-slate-800 placeholder:text-slate-300 shadow-sm ${error ? "border-red-100 bg-red-50/30" : "border-slate-100"}`}
        />
      </div>
      {error && <p className="text-red-500 text-[10px] font-bold ml-2 uppercase tracking-tight">{error}</p>}
    </div>
  );
}
