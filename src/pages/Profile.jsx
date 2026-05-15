import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaCheckCircle, FaSpinner, FaMapMarkerAlt, FaIdCard, FaCamera, FaSave, FaGlobe, FaAddressCard } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = API_URL ? API_URL.replace(/\/api\/?$/, "") : "";

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${BASE_URL}/${path.replace(/\\/g, "/")}`;
};

export default function Profile({ onUpdate }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Profile Details state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [alternatePhone, setAlternatePhone] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        
        // Map backend response fields
        const userData = {
          ...data,
          stateName: data.state?.name,
          districtName: data.district?.name
        };
        
        setUser(userData);
        setFullName(data.full_name || "");
        setPhone(data.phone || "");
        setEmail(data.email || "");
        setAlternatePhone(data.alternate_phone || "");
        setAadharNumber(data.aadhar_number || "");
        setPreviewUrl(getImageUrl(data.profile_photo));
        
        // Update local storage with fresh data
        localStorage.setItem("user", JSON.stringify(userData));
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setMessage(null);
    setError(null);

    // Validations
    if (phone && !/^\d{10}$/.test(phone)) {
      setError("Primary phone must be a valid 10-digit number");
      setProfileLoading(false);
      return;
    }

    if (alternatePhone && !/^\d{10}$/.test(alternatePhone)) {
      setError("Alternate phone must be a valid 10-digit number");
      setProfileLoading(false);
      return;
    }

    if (aadharNumber && !/^\d{12}$/.test(aadharNumber)) {
      setError("Aadhar number must be a valid 12-digit number");
      setProfileLoading(false);
      return;
    }

    if (user.role === 'ADMIN' && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      setProfileLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("phone", phone);
      formData.append("alternatePhone", alternatePhone);
      formData.append("aadharNumber", aadharNumber);

      // Agents cannot update email, Admins can
      if (user.role === 'ADMIN') {
        formData.append("email", email);
      }
      
      if (profilePhoto) {
        formData.append("profilePhoto", profilePhoto);
      }

      const response = await fetch(`${API_URL}/auth/update-profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Profile updated successfully!");
        
        // Map backend response fields for frontend consistency
        const updatedUser = {
          ...data.user,
          stateName: data.user.state?.name,
          districtName: data.user.district?.name
        };
        
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        if (onUpdate) onUpdate(updatedUser);
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(data.message || "Failed to update password");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const isAdmin = user.role === "ADMIN";

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-md rounded-[2.5rem] shadow-2xl border border-white overflow-hidden"
      >
        {/* Header/Banner */}
        <div className="h-40 bg-gradient-to-r from-orange-500 to-orange-600 relative">
          <div className="absolute -bottom-16 left-8 md:left-12">
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-white p-2 shadow-xl overflow-hidden border-4 border-white">
                {previewUrl ? (
                  <img src={previewUrl} alt="Profile" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <div className="w-full h-full rounded-2xl bg-orange-100 flex items-center justify-center text-orange-500 text-5xl font-black">
                    {user.full_name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              <label className="absolute bottom-4 right-4 p-3 bg-white text-orange-500 rounded-xl shadow-lg cursor-pointer hover:bg-orange-50 transition-all border border-orange-100">
                <FaCamera size={18} />
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
          </div>
        </div>

        <div className="pt-20 pb-8 px-8 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">{user.full_name}</h2>
              <p className="text-orange-600 font-bold uppercase tracking-widest text-xs mt-1 flex items-center gap-2">
                <FaIdCard /> {user.role} Account
              </p>
              {user.village && (
                 <p className="text-gray-500 text-sm font-medium mt-1 flex items-center gap-2">
                   <FaMapMarkerAlt className="text-orange-400" /> {user.village}, {user.mandal}, {user.districtName}, {user.stateName}
                 </p>
              )}
            </div>
            <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
              user.status === 'ACTIVE' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
            }`}>
              {user.status}
            </div>
          </div>

          {(message || error) && (
            <div className={`mb-8 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 border ${
              message ? 'bg-green-50 border-green-200 text-green-600' : 'bg-red-50 border-red-200 text-red-600'
            }`}>
              {message ? <FaCheckCircle /> : null}
              {message || error}
            </div>
          )}

          <div className={`grid grid-cols-1 ${isAdmin ? 'lg:grid-cols-2' : ''} gap-12`}>
            {/* Profile Details Section */}
            <div className="space-y-8">
              <h3 className="text-xl font-black text-gray-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-500">
                  <FaUser size={14} />
                </div>
                Profile Details
              </h3>

              <form onSubmit={handleUpdateProfile} className="space-y-6 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-gray-50 rounded-2xl focus:border-orange-500 outline-none transition-all text-sm font-bold text-gray-700 shadow-sm"
                        placeholder="Your Name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Primary Phone</label>
                    <div className="relative">
                      <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          if (val.length <= 10) setPhone(val);
                        }}
                        className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-gray-50 rounded-2xl focus:border-orange-500 outline-none transition-all text-sm font-bold text-gray-700 shadow-sm"
                        placeholder="Phone Number"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Alternate Phone</label>
                    <div className="relative">
                      <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input
                        type="tel"
                        value={alternatePhone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          if (val.length <= 10) setAlternatePhone(val);
                        }}
                        className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-gray-50 rounded-2xl focus:border-orange-500 outline-none transition-all text-sm font-bold text-gray-700 shadow-sm"
                        placeholder="Alternate Phone"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Aadhar Number</label>
                    <div className="relative">
                      <FaAddressCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input
                        type="text"
                        value={aadharNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          if (val.length <= 12) setAadharNumber(val);
                        }}
                        className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-gray-50 rounded-2xl focus:border-orange-500 outline-none transition-all text-sm font-bold text-gray-700 shadow-sm"
                        placeholder="Aadhar Number"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Email Address {!isAdmin && '(Read Only)'}</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      type="email"
                      required={isAdmin}
                      disabled={!isAdmin}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-11 pr-4 py-3.5 border-2 rounded-2xl outline-none transition-all text-sm font-bold shadow-sm ${
                        isAdmin 
                        ? 'bg-white border-gray-50 focus:border-orange-500 text-gray-700' 
                        : 'bg-gray-100 border-transparent text-gray-400 cursor-not-allowed'
                      }`}
                      placeholder="Email Address"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-xl shadow-orange-200 flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {profileLoading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                  {profileLoading ? "Saving Changes..." : "Save Profile Details"}
                </button>
              </form>

              {/* Location details for Everyone */}
              {user.village && (
                <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 space-y-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">{isAdmin ? 'Your Base Location' : 'Your Assigned Location'}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <DetailItem icon={<FaMapMarkerAlt />} label="Village" value={user.village} />
                    <DetailItem icon={<FaGlobe />} label="Mandal" value={user.mandal} />
                    <DetailItem icon={<FaIdCard />} label="District" value={user.districtName} />
                    <DetailItem icon={<FaGlobe />} label="State" value={user.stateName} />
                  </div>
                </div>
              )}
            </div>

            {/* Security Section - ONLY for Admin */}
            {isAdmin && (
              <div className="space-y-8">
                <h3 className="text-xl font-black text-gray-800 flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-500">
                    <FaLock size={14} />
                  </div>
                  Security & Password
                </h3>

                <div className="space-y-6">
                  <form onSubmit={handlePasswordChange} className="space-y-6 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest ml-1 mb-2">Change Password</p>
                    <div className="space-y-2">
                      <div className="relative">
                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                        <input
                          type="password"
                          required
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-gray-50 rounded-2xl focus:border-orange-500 outline-none transition-all text-sm font-bold text-gray-700 shadow-sm"
                          placeholder="Current Password"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                        <input
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-gray-50 rounded-2xl focus:border-orange-500 outline-none transition-all text-sm font-bold text-gray-700 shadow-sm"
                          placeholder="New Password"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-gray-50 rounded-2xl focus:border-orange-500 outline-none transition-all text-sm font-bold text-gray-700 shadow-sm"
                          placeholder="Confirm New Password"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-gray-800 text-white rounded-2xl font-bold hover:bg-gray-900 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-70"
                    >
                      {loading ? <FaSpinner className="animate-spin" /> : <FaLock />}
                      {loading ? "Updating..." : "Update Password"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-bold text-gray-800 truncate max-w-[100px]">{value || 'N/A'}</p>
      </div>
    </div>
  );
}
