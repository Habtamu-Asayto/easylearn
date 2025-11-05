import { Camera, Edit, Lock } from "react-feather";
import React, { useState, useEffect } from "react";
import userService from "../../../services/user.service";
import { useAuth } from "../../../Contexts/AuthContext";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
function ProfilePage() {
  const [profile, setProfile] = useState({
    user_full_name: "",
    user_phone: "",
    user_email: "",
    role_name: "",
    profile_img: null,
  });
  const [avatar, setAvatar] = useState(null);

  const { user } = useAuth();
  let token = null;
  if (user) {
    token = user.user_token;
  }

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await userService.getUserProfile(token);
      setProfile(data);
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("user_full_name", profile.user_full_name);
    formData.append("user_phone", profile.user_phone);
    if (avatar) formData.append("profile_img", avatar);

    const updated = await userService.updateUserProfile(formData, token);
    if (updated) {
      toast.success("Profile successfully updated !");
      // Update state with backend path
      setProfile({
        ...profile,
        ...updated,
        profile_img: updated.profile_img || profile.profile_img,
      });
      setAvatar(null);
    }
  };

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    const result = await userService.changePassword(
      passwordData.currentPassword,
      passwordData.newPassword,
      token
    );

    if (result) {
      toast.success("Password changed successfully!");
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Update Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
              {/* Left Column - Avatar & Personal Info */}
              <div className="lg:col-span-1">
                {/* Avatar Section */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <img
                      src={
                        avatar
                          ? URL.createObjectURL(avatar)
                          : profile.profile_img
                          ? `http://localhost:8080${profile.profile_img}`
                          : "/Image/profile.jpg"
                      }
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div className="absolute bottom-0 right-0">
                      <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 right-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-blue-600 transition"
                      >
                        <Camera className="text-white" size={20} />
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setAvatar(file); // preview handled by URL.createObjectURL
                          }
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 text-center">
                    Click the camera icon to update your profile picture
                  </p>
                </div>
              </div>

              {/* Right Column - Form Fields */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Personal Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full name
                        </label>
                        <input
                          type="text"
                          name="fullname"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter your full name"
                          value={profile.user_full_name || ""}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              user_full_name: e.target.value,
                            })
                          }
                        />
                      </div>
                      {/* Role */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Role
                        </label>
                        <input
                          type="text"
                          name="role"
                          disabled
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter your phone number"
                          value={profile.role_name}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          disabled
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter your email address"
                          value={profile.user_email || ""}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter your phone number"
                          value={profile.user_phone || ""}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              user_phone: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="flex cursor-pointer items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-300"
                >
                  <Lock className="mr-2" size={18} /> Change Password
                </button>

                <button
                  type="submit"
                  // disabled={isLoading}
                  //   className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  className="align-super px-6 py-3 flex cursor-pointer bg-blue-500 border border-gray-300 rounded-lg text-white hover:bg-blue-600 transition-colors duration-200 font-medium"
                >
                  <Edit className="mr-2" />
                  Update Profile
                  {/* {isLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save mr-2"></i>
                        Update Profile
                      </>
                    )} */}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* 🔒 Change Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 px-4 sm:px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Modal Card */}
            <motion.div
              className="
                    bg-white rounded-2xl shadow-xl p-6 sm:p-8 
                    w-full max-w-md sm:max-w-lg md:max-w-xl relative
                    overflow-y-auto  
                  "
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <button
                onClick={() => setShowPasswordModal(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>

              <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
                Change Password
              </h2>

              <form onSubmit={handlePasswordChange} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
                >
                  Update Password
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProfilePage;
