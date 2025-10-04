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
import { useAuth } from "../../../Contexts/AuthContext.jsx";
function AdminMain() {
  const { isLogged, setIsLogged, user } = useAuth();
  return (
    <div className="flex-1 overflow-y-auto">
      <div>
        <header className="bg-white border-b border-gray-200 py-4 px-6 justify-between items-center hidden md:flex">
          <h2 className="text-xl font-semibold text-dark">
            {user?.role_name === 1
              ? "Admin Dashboard"
              : user?.role_name === 2
              ? "Instructor Dashboard"
              : "Student dashboard"}
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
      <main className="p-6">
        {/* Overview */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-dark">Admin</h3>
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

        {/* Recent Courses & Quizzes */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Your Courses */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-dark">
                Your Recent Courses
              </h3>
              <a href="#" className="text-sm text-primary">
                View All
              </a>
            </div>

            <div className="space-y-4">
              {/* Course 1 */}
              <div className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Code className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-medium">Advanced JavaScript</h4>
                  <p className="text-sm text-gray-500">Progress: 75%</p>
                </div>
                <div className="ml-auto">
                  {/* Progress Circle */}
                  <div className="w-8 h-8">
                    <svg viewBox="0 0 36 36" className="circular-chart">
                      <path
                        className="circle-bg"
                        d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#eee"
                        strokeWidth="2.5"
                        strokeDasharray="100, 100"
                      />
                      <path
                        className="circle-fill"
                        d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#4F46E5"
                        strokeWidth="2.5"
                        strokeDasharray="75, 100"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Course 2 */}
              <div className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <Layout className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h4 className="font-medium">UI/UX Design</h4>
                  <p className="text-sm text-gray-500">Progress: 45%</p>
                </div>
                <div className="ml-auto">
                  <div className="w-8 h-8">
                    <svg viewBox="0 0 36 36" className="circular-chart">
                      <path
                        className="circle-bg"
                        d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#eee"
                        strokeWidth="2.5"
                        strokeDasharray="100, 100"
                      />
                      <path
                        className="circle-fill"
                        d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="2.5"
                        strokeDasharray="45, 100"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quizzes */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-dark mb-4">
              Quizzes Performance
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {/* Quiz 1 */}
              <div className="text-center">
                <div className="relative mx-auto w-20 h-20 mb-2">
                  {/* Done */}
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path
                      className="circle-bg"
                      d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831"
                      fill="none"
                      stroke="#eee"
                      strokeWidth="3"
                      strokeDasharray="100, 100"
                    />
                    <path
                      className="circle-fill"
                      d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="3"
                      strokeDasharray="58, 100"
                    />
                    <text
                      x="18"
                      y="20.5"
                      textAnchor="middle"
                      className="text-xs font-semibold fill-current text-gray-700"
                    >
                      5.8
                    </text>
                  </svg>
                </div>
                <p className="text-sm text-green-500 font-medium">Good</p>
              </div>

              {/* Quiz 2 */}
              <div className="text-center">
                <div className="relative mx-auto w-20 h-20 mb-2">
                  {/* Done */}
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path
                      className="circle-bg"
                      d="M18 2.0845
       a15.9155 15.9155 0 0 1 0 31.831
       a15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#eee"
                      strokeWidth="3"
                      strokeDasharray="100, 100"
                    />
                    <path
                      className="circle-fill"
                      d="M18 2.0845
       a15.9155 15.9155 0 0 1 0 31.831
       a15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#4F46E5"
                      strokeWidth="3"
                      strokeDasharray="98, 100"
                    />
                    <text
                      x="18"
                      y="20.5"
                      textAnchor="middle"
                      className="text-xs font-semibold fill-current text-gray-700"
                    >
                      9.8
                    </text>
                  </svg>
                </div>
                <p className="text-sm text-primary font-medium">Great</p>
              </div>

              {/* Quiz 3 */}
              <div className="text-center">
                <div className="relative mx-auto w-20 h-20 mb-2">
                  {/* Done */}
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    {/* Background Circle */}
                    <path
                      className="circle-bg"
                      d="M18 2.0845
       a15.9155 15.9155 0 0 1 0 31.831
       a15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#eee"
                      strokeWidth="3"
                      strokeDasharray="100, 100"
                    />

                    {/* Progress Circle */}
                    <path
                      className="circle-fill"
                      d="M18 2.0845
       a15.9155 15.9155 0 0 1 0 31.831
       a15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#EF4444" // red-500
                      strokeWidth="3"
                      strokeDasharray="34, 100" // 34% progress
                    />

                    {/* Label */}
                    <text
                      x="18"
                      y="20.5"
                      textAnchor="middle"
                      className="text-xs font-semibold fill-current text-gray-700"
                    >
                      3.4
                    </text>
                  </svg>
                </div>
                <p className="text-sm text-red-500 font-medium">Failed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Forum Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-dark">Forum Activity</h3>
            <a href="#" className="text-sm text-primary">
              View All
            </a>
          </div>
          <div className="space-y-4">
            <div className="flex items-start">
              <img
                src="http://learning.frontendmatter.com/html/images/people/110/guy-3.jpg"
                className="w-10 h-10 rounded-full mr-4"
                alt="User"
              />
              <div>
                <h4 className="font-medium">
                  New discussion in JavaScript group
                </h4>
                <p className="text-sm text-gray-500">1 hr ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <img
                src="http://learning.frontendmatter.com/html/images/people/110/guy-6.jpg"
                className="w-10 h-10 rounded-full mr-4"
                alt="User"
              />
              <div>
                <h4 className="font-medium">Question about React hooks</h4>
                <p className="text-sm text-gray-500">2 hrs ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <img
                src="http://learning.frontendmatter.com/html/images/people/110/guy-5.jpg"
                className="w-10 h-10 rounded-full mr-4"
                alt="User"
              />
              <div>
                <h4 className="font-medium">Help with CSS animations</h4>
                <p className="text-sm text-gray-500">3 hr ago</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AdminMain;
