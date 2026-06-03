import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { Camera, Mail, Pencil, Save, User, X } from "lucide-react";

export const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    gender: "",
    profilePic: null,
  });

  const getProfile = async () => {
    try {
      const res = await axiosInstance.get("/user/profile");
      const profile = res.data.data;

      setUser(profile);
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        age: profile.age || "",
        gender: profile.gender || "",
        profilePic: null,
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed To Load Profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImage = (e) => {
    setFormData({ ...formData, profilePic: e.target.files[0] });
  };

  const updateProfile = async () => {
    try {
      await axiosInstance.put("/user/update-profile", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        age: formData.age,
        gender: formData.gender,
      });

      if (formData.profilePic && typeof formData.profilePic !== "string") {
        const imageData = new FormData();
        imageData.append("profilePic", formData.profilePic);

        await axiosInstance.put("/user/profilePic", imageData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success("Profile Updated");
      setShowEditModal(false);
      getProfile();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Update Failed");
    }
  };

  const profileImage = user?.profilePic ? `${user.profilePic}?t=${new Date().getTime()}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  if (loading) {
    return (
      <div className="page-wrap">
        <div className="app-card flex min-h-72 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-700 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap space-y-6">
      <section className="app-card overflow-hidden">
        <div className="h-40 bg-slate-950" />
        <div className="p-5 sm:p-8">
          <div className="-mt-24 flex flex-col gap-5 sm:flex-row sm:items-end">
            <img src={profileImage} alt="Profile" className="h-36 w-36 rounded-lg border-4 border-white bg-white object-cover shadow-xl" />
            <div className="flex-1">
              <span className="pill">
                <User size={15} />
                Account profile
              </span>
              <h1 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="mt-2 flex items-center gap-2 font-bold text-slate-500">
                <Mail size={17} />
                {user?.email}
              </p>
            </div>
            <button type="button" onClick={() => setShowEditModal(true)} className="primary-btn">
              <Pencil size={18} />
              Edit Profile
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="app-card p-6">
          <h2 className="text-xl font-black text-slate-950">Personal Information</h2>
          <div className="mt-5 space-y-4">
            <Info label="Full Name" value={`${user?.firstName || ""} ${user?.lastName || ""}`} />
            <Info label="Email" value={user?.email || "Not added"} />
          </div>
        </div>

        <div className="app-card p-6">
          <h2 className="text-xl font-black text-slate-950">Account Details</h2>
          <div className="mt-5 space-y-4">
            <Info label="Age" value={user?.age || "Not added"} />
            <Info label="Gender" value={user?.gender || "Not added"} />
            <Info label="Joined On" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN") : "Not available"} />
          </div>
        </div>
      </section>

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="app-card max-h-[92vh] w-full max-w-2xl overflow-y-auto p-5 sm:p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black text-slate-950">Edit Profile</h2>
              <button type="button" onClick={() => setShowEditModal(false)} className="icon-btn" aria-label="Close modal">
                <X size={18} />
              </button>
            </div>

            <div className="mb-6 flex justify-center">
              <div className="relative">
                <img
                  src={formData.profilePic ? URL.createObjectURL(formData.profilePic) : profileImage}
                  alt="Profile preview"
                  className="h-32 w-32 rounded-lg border border-slate-200 object-cover"
                />
                <label className="icon-btn absolute -bottom-2 -right-2 bg-white" aria-label="Upload profile picture">
                  <input type="file" className="hidden" accept="image/*" onChange={handleImage} />
                  <Camera size={18} />
                </label>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="field-input" />
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="field-input" />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="field-input" />
              <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Age" className="field-input" />
              <select name="gender" value={formData.gender} onChange={handleChange} className="field-input">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setShowEditModal(false)} className="secondary-btn">
                Cancel
              </button>
              <button type="button" onClick={updateProfile} className="primary-btn">
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Info = ({ label, value }) => (
  <div className="rounded-lg border border-slate-100 bg-white/70 p-4">
    <p className="text-sm font-bold text-slate-500">{label}</p>
    <p className="mt-1 break-words text-lg font-black text-slate-950">{value}</p>
  </div>
);
