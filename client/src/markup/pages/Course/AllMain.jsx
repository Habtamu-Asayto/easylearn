import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer/Footer";

import courseService from "../../../services/course.service";
import { useAuth } from "../../../contexts/AuthContext";
function AllMain({ onShowMain }) {
   const { user } = useAuth();
   let token = null;
   if (user) {
     token = user.user_token;
   }

   const [apiError, setApiError] = useState(false);
   const [apiErrorMessage, setApiErrorMessage] = useState(null);
   const [course, setCourse] = useState([]);
   useEffect(() => {
     // Call the getAllStudents function
     const allCourse = courseService.getAllCourses(token);
     allCourse
       .then((res) => {
         if (!res.ok) {
           console.log("Here is: " + res.status);
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
           console.log(data.data);
           setCourse(data.data);
         }
       })
       .catch((err) => {
         // console.log(err);
       });
   }, []);
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
      <main className="p-2">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Library</h1>
            <p className="text-gray-500 text-sm">
              Browse through thousands of lessons.
            </p>
          </div>
          {/* Right buttons */}
          <div className="flex items-center space-x-3">
            {/* View toggle */}
            <div className="flex space-x-2">
              <button
                className="px-5 py-2 border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 hover:shadow-md transition"
                onClick={onShowMain}
              >
                MY COURSES
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 space-y-4">
          {/* Card 1 */}
          {apiError ? (
            <section className="contact-section">
              <div className="auto-container">
                <div className="contact-title">
                  <h2>{apiErrorMessage}</h2>
                </div>
              </div>
            </section>
          ) : course.length > 0 ? (
            course.map((cat, index) => (
              <div className="bg-white rounded shadow hover:shadow-lg transition">
                <div className="flex flex-col sm:flex-row">
                  {/* Icon */}
                  <div className="flex items-center justify-center bg-blue-100 w-full sm:w-40 h-32 sm:h-auto">
                    <svg
                      className="w-12 h-12 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 3h18v18H3V3z" />
                    </svg>
                  </div>
                  {/* Content */}
                  <div className="flex-1 p-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {cat.title}
                    </h2>
                    {/* Rating */}
                    <div className="flex items-center space-x-1 text-yellow-500 my-1">
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span className="text-gray-400">★</span>
                      <span className="text-gray-400">★</span>
                    </div>
                    {/* Description */}
                    <p className="text-sm text-gray-600">{cat.description}</p>
                    {/* Instructor */}
                    <div className="mt-3 flex items-center space-x-2 border-t pt-3">
                      <img
                        src="https://i.pravatar.cc/30"
                        alt="Instructor"
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          {cat.category_name}
                        </p>
                        <p className="text-xs text-gray-500">Instructor</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h4 className="font-medium">Empty</h4>
          )}
        </div>
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

export default AllMain;
