import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import categoryService from "../../../services/coursecategory.service.js";
// Import the useAuth hook
import { useAuth } from "../../../contexts/AuthContext.jsx";

const AddCategory = ({ isOpen, onClose }) => {
  const [category_name, setCategory] = useState("");
  // Error
  const [categoryError, setCategoryError] = useState("");
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
    if (!category_name) {
      setCategoryError("Category is required");
      valid = false;
    } else {
      setCategory("");
    }

    // If the form is not valid, do not submit
    if (!valid) {
      return;
    }
    const formData = {
      category_name,
    };
    // Pass the form data to the service
    try {
      const data = categoryService.createCategory(formData, loggedInUserToken);
      //   console.log("Response:", data);

      if (data.error) {
        setServerError(data.error);
      } else {
        setServerError("");
        setSuccess(true);
        //  Optional: show a toast instead of full reload
        setTimeout(() => (window.location.href = "/category"), 1500);
      }
    } catch (error) {
      console.error("Error creating student:", error);
      setServerError("Something went wrong while adding the category.");
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

            {/* <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-800 text-center">
              {editingStudent ? "Edit Student" : "Add New Student"}
            </h2> */}
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-800 text-center">
              Add New Category
            </h2>

            {/* Example Form */}
            <form className="space-y-4" onSubmit={handleAdd}>
              {/* Full Name */}
              <div>
                {serverError && (
                  <div className="text-red-600 text-sm mb-2" role="alert">
                    {serverError}
                  </div>
                )}
                <label className="block text-sm font-medium text-gray-700">
                  Category Name
                </label>
                <input
                  type="text"
                  name="category_name"
                  value={category_name}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Insert category name"
                />
                {categoryError && (
                  <div className="text-red-600 text-sm mt-1" role="alert">
                    {categoryError}
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

export default AddCategory;
