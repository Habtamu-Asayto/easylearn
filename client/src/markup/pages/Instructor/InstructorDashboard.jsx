import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer/Footer.jsx";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
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

function InstructorDashboard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md text-gray-700"
        >
          <Menu />
        </button>
        
        <div className="w-8"></div>
      </header>

      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex-1 overflow-y-auto">
        <div>
          <header className="bg-white border-b border-gray-200 py-4 px-6 justify-between items-center hidden md:flex">
            <h2 className="text-xl font-semibold text-dark">Instructor Dashboard</h2>
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
        <main className="p-4 space-y-4 md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
          {/* Earnings */}
          <section className="bg-white rounded-lg shadow p-4 md:col-span-2">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold">Earnings</h2>
              <button className="text-sm text-blue-500">Reports</button>
            </div>
            <div className="h-40 flex items-center justify-center text-gray-400">
              📊 Chart Placeholder
            </div>
            <div className="flex justify-around mt-4">
              <p className="text-orange-500 font-bold text-xl">102.4k</p>
              <p className="text-green-600 font-bold text-xl">55k</p>
            </div>
          </section>

          {/* Courses */}
          <section className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold mb-2">My Courses</h2>
            <div className="space-y-2">
              <div>
                <p>Basics of HTML</p>
                <div className="w-full bg-gray-200 rounded h-2">
                  <div className="bg-green-500 h-2 rounded w-3/4"></div>
                </div>
              </div>
              <div>
                <p>Angular in Steps</p>
                <div className="w-full bg-gray-200 rounded h-2">
                  <div className="bg-green-500 h-2 rounded w-2/3"></div>
                </div>
              </div>
              <div>
                <p>Bootstrap Foundations</p>
                <div className="w-full bg-gray-200 rounded h-2">
                  <div className="bg-green-500 h-2 rounded w-1/3"></div>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <button className="px-3 py-1 bg-gray-200 rounded text-sm">
                View All
              </button>
              <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
                Create Course +
              </button>
            </div>
          </section>

          {/* Transactions */}
          <section className="bg-white rounded-lg shadow p-4 md:col-span-1">
            <h2 className="font-semibold mb-2">Transactions</h2>
            <div className="divide-y">
              <div className="flex justify-between py-2">
                <span className="text-sm">12 Jan 2015</span>
                <span className="text-blue-500">#4975</span>
                <span>$74</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm">12 Jan 2015</span>
                <span className="text-blue-500">#8981</span>
                <span>$42</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm">12 Jan 2015</span>
                <span className="text-blue-500">#11090</span>
                <span>$42</span>
              </div>
            </div>
          </section>

          {/* Comments */}
          <section className="bg-white rounded-lg shadow p-4 md:col-span-2">
            <h2 className="font-semibold mb-2">Comments</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="text-blue-500">mosaicpro</span> · 30 min
                    ago
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit...
                  </p>
                  <p className="text-sm text-gray-500">
                    Course: Basics of HTML
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="text-blue-500">mosaicpro</span> · 26 min
                    ago
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit...
                  </p>
                  <p className="text-sm text-gray-500">
                    Course: Basics of HTML
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default InstructorDashboard;
