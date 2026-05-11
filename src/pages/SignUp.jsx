import { useState } from "react";
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
} from "react-icons/fa";

import bgUser from "../assets/bguser.jpg";

const API_URL = "http://localhost:3000/api"; // SK Marketings Backend

export default function UserSignup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    alternatePhone: "",
    state: "",
    district: "",
    mandal: "",
    village: "",
    adharNumber: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          alternatePhone: formData.alternatePhone,
          state: formData.state,
          district: formData.district,
          mandal: formData.mandal,
          village: formData.village,
          aadharNumber: formData.adharNumber,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center overflow-hidden py-10"
      style={{ backgroundImage: `url(${bgUser})` }}
    >
      {/* ORANGE OVERLAY */}
      <div className="absolute inset-0 bg-orange-500/40 backdrop-blur-sm"></div>

      {/* SIGNUP BOX */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-3xl mx-4 p-8 md:p-12 bg-white rounded-[3rem] shadow-2xl shadow-orange-900/20 border-2 border-orange-50"
      >
        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-500 text-[10px] font-black px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            ✨ Create Account
          </div>

          <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
            Agent <span className="text-orange-500">Signup</span>
          </h2>

          <p className="text-[11px] font-bold text-slate-400 uppercase mt-2 tracking-tight">
            Fill your details to create your account
          </p>
        </div>

        {success && (
          <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-2xl text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-green-800 font-bold text-lg mb-2">Account Created!</h3>
            <p className="text-green-600 text-sm mb-4">
              Your account is pending admin approval. You will be able to login once approved.
            </p>
            <Link
              to="/user-login"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-colors"
            >
              Go to Login
            </Link>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-bold text-center">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSignup} className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Full Name */}
          <InputField
            icon={<FaUserAlt />}
            label="Full Name"
            name="fullName"
            placeholder="Enter full name"
            value={formData.fullName}
            onChange={handleChange}
          />

          {/* Email */}
          <InputField
            icon={<FaUserAlt />}
            label="Email Address"
            name="email"
            type="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
          />

          {/* Phone */}
          <InputField
            icon={<FaPhoneAlt />}
            label="Phone Number"
            name="phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={handleChange}
          />

          {/* Alternate Phone */}
          <InputField
            icon={<FaPhoneAlt />}
            label="Alternate Number"
            name="alternatePhone"
            placeholder="Enter alternate number"
            value={formData.alternatePhone}
            onChange={handleChange}
          />

          {/* State */}
          <InputField
            icon={<FaMapMarkerAlt />}
            label="State"
            name="state"
            placeholder="Enter state"
            value={formData.state}
            onChange={handleChange}
          />

          {/* District */}
          <InputField
            icon={<FaMapMarkerAlt />}
            label="District"
            name="district"
            placeholder="Enter district"
            value={formData.district}
            onChange={handleChange}
          />

          {/* Mandal */}
          <InputField
            icon={<FaMapMarkerAlt />}
            label="Mandal"
            name="mandal"
            placeholder="Enter mandal"
            value={formData.mandal}
            onChange={handleChange}
          />

          {/* Village */}
          <InputField
            icon={<FaMapMarkerAlt />}
            label="Village"
            name="village"
            placeholder="Enter village"
            value={formData.village}
            onChange={handleChange}
          />

          {/* Aadhar */}
          <InputField
            icon={<FaIdCard />}
            label="Aadhar Number"
            name="adharNumber"
            placeholder="Enter Aadhar number"
            value={formData.adharNumber}
            onChange={handleChange}
          />

          {/* Password */}
          <InputField
            icon={<FaLock />}
            label="Password"
            name="password"
            type="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
          />

          {/* BUTTON */}
          <div className="md:col-span-2 mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || success}
              className="w-full py-5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-200 flex items-center justify-center gap-3 text-[10px] tracking-[0.2em] uppercase disabled:opacity-70"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <>Create Account <FaArrowRight /></>}
            </motion.button>
          </div>

          {/* LOGIN LINK */}
          {!success && (
            <div className="md:col-span-2 text-center mt-3">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Already have an account?{" "}
                <Link
                  to="/user-login"
                  className="text-orange-500 hover:text-orange-600"
                >
                  Login
                </Link>
              </p>
            </div>
          )}
        </form>
      </motion.div>
    </div>
  );
}

/* REUSABLE INPUT FIELD */
function InputField({
  icon,
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest ml-2">
        {label}
      </label>

      <div className="relative">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-300 text-sm">
          {icon}
        </div>

        <input
          type={type}
          name={name}
          required
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-12 pr-5 py-4 rounded-2xl bg-orange-50/30 border-2 border-orange-50 focus:border-orange-500 focus:bg-white focus:outline-none transition-all font-bold text-sm text-slate-800 placeholder:text-slate-300"
        />
      </div>
    </div>
  );
}