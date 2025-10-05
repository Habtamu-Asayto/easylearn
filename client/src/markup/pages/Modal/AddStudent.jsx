import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import userService from "../../../services/user.service.js";
// Import the useAuth hook
import { useAuth } from "../../../contexts/AuthContext.jsx";

const AddStudent = ({ isOpen, onClose, editingStudent }) => {
  const [student_email, setEmail] = useState("");
  const [student_name, setName] = useState("");
  const [student_phone, setPhone] = useState("");
  const [student_password, setPassword] = useState("");

  // Error
  const [emailError, setEmailError] = useState("");
  const [nameRequired, setNameRequired] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  // Create a variable to hold the user's token
  let loggedInUserToken = "";
  // Destructure the auth hook and get the token
  const { user } = useAuth();
  if (user && user.user_token) {
    loggedInUserToken = user.user_token;
  }
  const handleAdd = (e) => {
    e.preventDefault();
    // Handle client side validations
    let valid = true; // Flag
    // Full name is required
    if (!student_name) {
      setNameRequired("Full name is required");
      valid = false;
    } else {
      setName("");
    }
    // Email is required
    if (!student_email) {
      setEmailError("Email is required");
      valid = false;
    } else if (!student_email.includes("@")) {
      setEmailError("Invalid email format");
    } else {
      const regex = /^\S+@\S+\.\S+$/;
      if (!regex.test(student_email)) {
        setEmailError("Invalid email format");
        valid = false;
      } else {
        setEmailError("");
      }
    }

    // Password has to be at least 6 characters long
    if (!student_password || student_password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      valid = false;
    } else {
      setPasswordError("");
    }
    // If the form is not valid, do not submit
    if (!valid) {
      return;
    }
    const formData = {
      student_email: student_email.trim().toLowerCase(),
      student_name,
      student_phone,
      student_password,
    };
    // Pass the form data to the service
    try {
      const data = userService.createStudent(formData, loggedInUserToken);
      console.log("Response:", data);

      if (data.error) {
        setServerError(data.error);
      } else {
        setServerError("");
        setSuccess(true);
        //  Optional: show a toast instead of full reload
        setTimeout(() => (window.location.href = "/students"), 1500);
      }
    } catch (error) {
      console.error("Error creating student:", error);
      setServerError("Something went wrong while adding the student.");
    }
  };
  useEffect(() => {
    if (editingStudent) {
      // Pre-fill form values
      setName(editingStudent.user_full_name || "");
      setEmail(editingStudent.user_email || "");
      setPhone(editingStudent.user_phone || "");
      setPassword(""); // leave blank for security
    } else {
      // Reset when adding a new one
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
    }
  }, [editingStudent]);

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    // validate as before...
    // Handle client side validations
    let valid = true; // Flag
    // Full name is required
    if (!student_name) {
      setNameRequired("Full name is required");
      valid = false;
    } else {
      setName("");
    }
    // Email is required
    if (!student_email) {
      setEmailError("Email is required");
      valid = false;
    } else if (!student_email.includes("@")) {
      setEmailError("Invalid email format");
    } else {
      const regex = /^\S+@\S+\.\S+$/;
      if (!regex.test(student_email)) {
        setEmailError("Invalid email format");
        valid = false;
      } else {
        setEmailError("");
      }
    }

    // Password has to be at least 6 characters long
    if (!student_password || student_password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      valid = false;
    } else {
      setPasswordError("");
    }
    const formData = {
      student_email: student_email.trim().toLowerCase(),
      student_name,
      student_phone,
      student_password,
    };

    try {
      let response;
      if (editingStudent) {
        // EDIT MODE
        response = await userService.updateStudent(
          editingStudent.user_id,
          formData
        );
      } else {
        // ADD MODE
        response = await userService.createStudent(formData);
      }

      if (response.error) {
        setServerError(response.error);
      } else {
        setServerError("");
        setSuccess(true);
        setTimeout(() => {
          window.location.href = "/students";
        }, 1500);
      }
    } catch (error) {
      setServerError("Something went wrong");
      console.error(error);
    }
  };

  if (!isOpen) return null;
  return (
    <AnimatePresence>
      {isOpen && (
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
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg cursor-pointer"
            >
              ✕
            </button>

            <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-800 text-center">
              {editingStudent ? "Edit Student" : "Add New Student"}
            </h2>

            {/* Example Form */}
            <form className="space-y-4" onSubmit={handleAddOrUpdate}>
              {/* Full Name */}
              <div>
                {serverError && (
                  <div className="text-red-600 text-sm mb-2" role="alert">
                    {serverError}
                  </div>
                )}
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="student_name"
                  value={student_name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Hab Asa"
                />
                {nameRequired && (
                  <div className="text-red-600 text-sm mt-1" role="alert">
                    {nameRequired}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="user_email"
                  value={student_email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="student@example.com"
                />
                {emailError && (
                  <div className="text-red-600 text-sm mt-1" role="alert">
                    {emailError}
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="student_phone"
                  value={student_phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="+2519..."
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="student_password"
                  value={student_password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Password"
                />
                {passwordError && (
                  <div className="text-red-600 text-sm mt-1" role="alert">
                    {passwordError}
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddStudent;
