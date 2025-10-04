import React from 'react'

function InstructorHeader() {
  return (
    <div>
      <header className="bg-white border-b border-gray-200 py-4 px-6 justify-between items-center hidden md:flex">
        <h2 className="text-xl font-semibold text-dark">Instructor Dashboard</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <i data-feather="bell" className="w-5 h-5 text-gray-500"></i>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              4
            </span>
          </div>
          <img
            src="http://learning.frontendmatter.com/html/images/people/110/guy-6.jpg"
            alt="avatar"
            className="w-8 h-8 rounded-full hidden sm:block"
          />
        </div>
      </header>
    </div>
  );
}

export default InstructorHeader;;
