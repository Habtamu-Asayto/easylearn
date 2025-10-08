import Footer from "../../../components/Footer/Footer";
import { Link } from "react-router-dom"; 
import React, { useState, useEffect } from "react";  

import AddCategory from "../../Modal/AddCategory";
import {useAuth} from "../../../../contexts/AuthContext";
import categoryService from "../../../../services/coursecategory.service";
import { format } from "date-fns"; // To properly format the date on the table
 
 
function CategoryList() {
  // For both add and edit student
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editmodal, setEditModal] = useState(null);

  const [categories, setCategories] = useState([]);
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState(null);
   
  
  const { user } = useAuth();
  let token = null;
  if (user) {
    token = user.user_token;
  }
  useEffect(() => {
    // Call the getAllStudents function
    const allcategories = categoryService.getAllcategory(token);
    allcategories
      .then((res) => {
        if (!res.ok) {
          setApiError(true);
          if (res.status === 401) {
            setApiErrorMessage("Please login again");
          } else if (res.status === 403) {
            setApiErrorMessage("You are not authorized to view this page");
          } else {
            setApiErrorMessage("Please try again later");
          }
        }
        return res.json();
      })
      .then((data) => {
        if (data.data.length !== 0) {
          setCategories(data.data);
        }
      })
      .catch((err) => {
        // console.log(err);
      });
  }, []);

  const handleAddClick = () => {
    setEditModal(null); // reset for new student
    setIsModalOpen(true);
  };

  const handleEditClick = (category) => {
    setEditModal(category);
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 justify-between items-center hidden md:flex">
        <h2 className="text-xl font-semibold text-dark">My Courses</h2>
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="relative">
            <i data-feather="bell" className="w-5 h-5 text-gray-500" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              4
            </span>
          </div>
          <img
            src="http://learning.frontendmatter.com/html/images/people/110/guy-6.jpg"
            className="w-8 h-8 rounded-full hidden sm:block"
          />
        </div>
      </header>
      {/* Dashboard Content */}
      <main className="p-6">
        {/* Overview */}
        <div id="all-courses" className="flex justify-end p-4">
          <Link to="/courses">
            <button className="px-5 py-2 border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 hover:shadow-md transition">
              ALL COURSES
            </button>
          </Link>
        </div>

        <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Example card */}

          {apiError ? (
            <section className="contact-section">
              <div className="auto-container">
                <div className="contact-title">
                  <h2>{apiErrorMessage}</h2>
                </div>
              </div>
            </section>
          ) : categories.length > 0 ? (
            categories.map((cat, index) => (
              <article
                key={cat.category_id}
                onClick={() => handleEditClick(cat)}
                className="bg-white rounded-2xl shadow-sm  border-1 border-gray-400 p-4 hover:bg-gray-100 cursor-pointer hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-indigo-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 14l9-5-9-5-9 5 9 5zm0 0v7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">{cat.category_name}</h4>
                    <p className="text-sm text-gray-500">
                      {format(new Date(cat.created_at), "MM-dd-yyyy | HH:mm")}
                    </p>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <h4 className="font-medium">Empty</h4>
          )}

          {/* Add new lesson small card */}
          <article
            onClick={() => handleAddClick(true)}
            className="bg-gray-100 rounded-2xl border-dashed border-2 border-gray-400 p-6 flex items-center justify-center hover:bg-gray-50 cursor-pointer transition"
          >
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </article>
        </section>
        <AddCategory
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          editmodal={editmodal}
        />
        {/* Pagination */}
        <div className="flex mt-8">
          <div className="inline-flex items-center space-x-1">
            {/* Prev */}
            <button
              className="px-3 py-2 rounded bg-gray-100 text-gray-500 cursor-not-allowed"
              disabled
            >
              «
            </button>
            {/* Page numbers */}
            <button className="px-3 py-2 rounded bg-blue-500 text-white">
              1
            </button>
            <button className="px-3 py-2 rounded bg-white text-gray-700 border hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-2 rounded bg-white text-gray-700 border hover:bg-gray-50">
              3
            </button>
            {/* Next */}
            <button className="px-3 py-2 rounded bg-white text-gray-700 border hover:bg-gray-50">
              »
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default CategoryList;
