import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer/Footer.jsx";
import {
  Menu,
  BookOpen,
  Book,
  Bell,
  Award,
  Mail,
  Code,
  Layout,
} from "react-feather";
import StudentTable from "./StudentTable.jsx";
function StudentList() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div>
        <header className="bg-white border-b border-gray-200 py-4 px-6 justify-between items-center hidden md:flex">
          <h2 className="text-xl font-semibold text-dark">
            {/* {user?.role_name === 1
              ? "Admin Dashboard"
              : user?.role_name === 2
              ? "Instructor Dashboard"
              : "Student dashboard"} */}
            Students List
          </h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-500" />
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

      {/* Main */}
      <main className="p-2">
        {/* Overview */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-dark">Overview</h3>
            <span className="text-sm text-gray-500">
              Your subscription ends on 25 February 2015
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-blue-50 rounded-lg p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Courses</h4>
                  <p className="text-2xl font-bold mt-1">12</p>
                </div>
                <Book className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Certificates
                  </h4>
                  <p className="text-2xl font-bold mt-1">4</p>
                </div>
                <Award className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Messages
                  </h4>
                  <p className="text-2xl font-bold mt-1">8</p>
                </div>
                <Mail className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* table  */}
        <StudentTable />
      </main>
      <Footer />
    </div>
  );
}

export default StudentList;
