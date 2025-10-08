import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import categoryService from "../../../services/coursecategory.service.js";
// Import the useAuth hook
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { toast } from "react-toastify";
import { href } from "react-router";

const AddCategory = ({ isOpen, onClose, editmodal, addmodal }) => {
  const [category_name, setCategory] = useState("");
  // Error
  const [categoryError, setCategoryError] = useState("");
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  // Create a variable to hold the user's token
  let token = "";
  // Destructure the auth hook and get the token
  const { user } = useAuth();
  if (user && user.user_token) {
    token = user.user_token;
  }
  useEffect(() => {
    if (editmodal) {
      // Fill values
      setCategory(editmodal.category_name || "");
    } else {
      setCategory("");
    }
  }, [editmodal]);

    const [category, setCategory2] = useState([]);
  // Handler
  const handleAdd = async (e) => {
    e.preventDefault();
    // Handle client side validations
    let valid = true; // Flag
    // Full name is required
    if (!category_name) {
      setCategoryError("Category is required");
      valid = false;
    } else {
      setCategoryError("");
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
      let response;
      if (editmodal) {
        // EDIT MODE
        response = await categoryService.updateCategory(
          editmodal.category_id,
          formData,
          token
        );
      } else {
        // ADD MODE
        response = await categoryService.createCategory(formData, token);
      }

      if (!response.status) {
        toast.error(response.error);
      } else {
        toast.success(
          editmodal
            ? "Category updated successfully!"
            : "Category added successfully!"
        );
        setTimeout(() => {
          window.location.href = "/category";
        }, 700);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

 const handleDeleteCategory = async (categoryId) => {
   if (!window.confirm("Are you sure you want to delete this course?")) return;

   try {
     const res = await categoryService.deleteCategory(categoryId, token);

     if (res.status) {
       // Remove deleted course from state
       setCategory2(category.filter((c) => c.category_id !== categoryId));
       toast.success("Course deleted successfully");
       setTimeout(()=>{
        window.location.href='/category'
       }, 700)
     } else {
       toast.error(res.error || "Failed to delete course");
     }
   } catch (err) {
     console.error(err);
     toast.error("Something went wrong while deleting");
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
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
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
              {editmodal ? "Edit category" : " Add New Category"}
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
                  {editmodal ? "Edit" : "Save"}
                </button>
                {editmodal ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(editmodal.category_id)}
                    className="px-4 py-2 rounded-lg border bg-red-500 border-gray-300 hover:bg-gray-100 transition cursor-pointer"
                  >
                    Delete
                  </button>
                ) : (
                  <></>
                )}
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddCategory;
