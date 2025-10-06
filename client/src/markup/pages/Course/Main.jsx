import React from "react";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";
import { Plus } from "react-feather";
function Main({ onShowAllMain }) {
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
          <button
            className="px-5 py-2 border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 hover:shadow-md transition"
            onClick={onShowAllMain}
          >
            ALL COURSES
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="card max-w-sm w-full bg-white rounded-2xl overflow-hidden shadow">
            {/* Card Header */}
            <div className="bg-gray-200 from-blue-400 to-indigo-500 flex items-center justify-center h-32">
              <div className="bg-white p-4 rounded-full shadow-md">
                {/* Replace with your icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5zm0 0v7m0-7l-9-5m9 5l9-5"
                  />
                </svg>
              </div>
            </div>
            {/* Card Body */}
            <div className="p-6 text-center">
              <h2 className="text-xl font-bold text-gray-800">
                Awesome CSS with LESS Processing
              </h2>
            </div>
            {/* Card Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex justify-center">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 17l-4-4m0 0l4-4m-4 4h14"
                  />
                </svg>
                Edit Course
              </button>
            </div>
          </div>
          {/* Card 2 */}
          <div className="card max-w-sm w-full bg-white rounded-2xl overflow-hidden shadow">
            {/* Card Header */}
            <div className="bg-gray-200 from-blue-400 to-indigo-500 flex items-center justify-center h-32">
              <div className="bg-white p-4 rounded-full shadow-md">
                {/* Replace with your icon */}
                <svg
                  className="w-10 h-10 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 3h18v18H3V3z" />
                </svg>
              </div>
            </div>
            {/* Card Body */}
            <div className="p-6 text-center">
              <h2 className="text-xl font-bold text-gray-800">
                Awesome CSS with LESS Processing
              </h2>
            </div>
            {/* Card Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex justify-center">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 17l-4-4m0 0l4-4m-4 4h14"
                  />
                </svg>
                Edit Course
              </button>
            </div>
          </div>
          {/* Card 3 */}
          <div className="card max-w-sm w-full bg-white rounded-2xl overflow-hidden shadow">
            {/* Card Header */}
            <div className="bg-gray-200 from-blue-400 to-indigo-500 flex items-center justify-center h-32">
              <div className="bg-white p-4 rounded-full shadow-md">
                {/* Replace with your icon */}
                <svg
                  className="w-10 h-10 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 4h16v16H4V4z" />
                </svg>
              </div>
            </div>
            {/* Card Body */}
            <div className="p-6 text-center">
              <h2 className="text-xl font-bold text-gray-800">
                Awesome CSS with LESS Processing
              </h2>
            </div>
            {/* Card Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex justify-center">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 17l-4-4m0 0l4-4m-4 4h14"
                  />
                </svg>
                Edit Course
              </button>
            </div>
          </div>
          {/* Card 4*/}
          <div className="card max-w-sm w-full bg-white rounded-2xl overflow-hidden shadow">
            {/* Card Header */}
            <div className="bg-gray-200 from-blue-400 to-indigo-500 flex items-center justify-center h-32">
              <div className="bg-white p-4 rounded-full shadow-md">
                {/* Replace with your icon */}
                <svg
                  className="w-10 h-10 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 4h16v16H4V4z" />
                </svg>
              </div>
            </div>
            {/* Card Body */}
            <div className="p-6 text-center">
              <h2 className="text-xl font-bold text-gray-800">
                Awesome CSS with LESS Processing
              </h2>
            </div>
            {/* Card Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex justify-center">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 17l-4-4m0 0l4-4m-4 4h14"
                  />
                </svg>
                Edit Course
              </button>
            </div>
          </div>
          {/*Add Course*/}
          {/* Add New Course Card */}

          <Link
            to="/add-course"
            className="card max-w-sm w-full flex items-center justify-center rounded-2xl 
                 border-2 border-dashed border-gray-300 bg-gray-50 
                 hover:border-indigo-400 hover:bg-indigo-50 
                 transition-all duration-200 cursor-pointer"
          >
            <span className="text-5xl text-gray-400 font-light">+</span>
          </Link>
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
      <Footer />
    </div>
  );
}

export default Main;
