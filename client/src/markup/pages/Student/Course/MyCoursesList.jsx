import React from "react";

function MyCoursesList() {
  return (
    <main className="p-6">
     
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Card 1 */}
        <div className="card bg-white rounded-2xl overflow-hidden shadow">
          <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
            <span className="text-xs sm:text-sm text-gray-500">
              Lessons 4 of 12
            </span>
            <div className="w-20 sm:w-24 bg-gray-200 rounded-full h-2">
              <div
                className="progress bg-gray-600 h-2 rounded-full"
                style={{ width: "33%" }}
              />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-8 sm:py-10 px-4 text-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <svg
                className="w-10 h-10 text-gray-700"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12..." />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-3">
              Github Webhooks for Beginners
            </h3>
            <a
              href="#"
              className="text-blue-500 hover:underline text-sm sm:text-base"
            >
              GO TO COURSE
            </a>
          </div>
        </div>
        {/* Card 2 */}
        <div className="card bg-white rounded-2xl overflow-hidden shadow">
          <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
            <span className="text-xs sm:text-sm text-gray-500">
              Lessons 2 of 13
            </span>
            <div className="w-20 sm:w-24 bg-gray-200 rounded-full h-2">
              <div
                className="progress bg-blue-500 h-2 rounded-full"
                style={{ width: "15%" }}
              />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-8 sm:py-10 px-4 text-center">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <svg
                className="w-10 h-10 text-blue-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 3h18v18H3V3z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-3">
              Awesome CSS with LESS Processing
            </h3>
            <a
              href="#"
              className="text-blue-500 hover:underline text-sm sm:text-base"
            >
              GO TO COURSE
            </a>
          </div>
        </div>
        {/* Card 3 */}
        <div className="card bg-white rounded-2xl overflow-hidden shadow">
          <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
            <span className="text-xs sm:text-sm text-gray-500">
              Lessons 2 of 6
            </span>
            <div className="w-20 sm:w-24 bg-gray-200 rounded-full h-2">
              <div
                className="progress bg-red-500 h-2 rounded-full"
                style={{ width: "30%" }}
              />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-8 sm:py-10 px-4 text-center">
            <div className="bg-red-100 p-4 rounded-full mb-4">
              <svg
                className="w-10 h-10 text-red-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M4 4h16v16H4V4z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-3">
              Vagrant Portable Environments
            </h3>
            <a
              href="#"
              className="text-blue-500 hover:underline text-sm sm:text-base"
            >
              GO TO COURSE
            </a>
          </div>
        </div>
        {/* Card 4*/}
        <div className="card bg-white rounded-2xl overflow-hidden shadow">
          <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
            <span className="text-xs sm:text-sm text-gray-500">
              Lessons 2 of 6
            </span>
            <div className="w-20 sm:w-24 bg-gray-200 rounded-full h-2">
              <div
                className="progress bg-red-500 h-2 rounded-full"
                style={{ width: "30%" }}
              />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-8 sm:py-10 px-4 text-center">
            <div className="bg-red-100 p-4 rounded-full mb-4">
              <svg
                className="w-10 h-10 text-red-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M4 4h16v16H4V4z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-3">
              Vagrant Portable Environments
            </h3>
            <a
              href="#"
              className="text-blue-500 hover:underline text-sm sm:text-base"
            >
              GO TO COURSE
            </a>
          </div>
        </div>
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
  );
}

export default MyCoursesList;
