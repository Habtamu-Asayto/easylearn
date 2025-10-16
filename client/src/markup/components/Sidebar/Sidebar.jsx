import React, { useState, useEffect } from "react";
import feather from "feather-icons";
import {
  Menu,
  BookOpen,
  Book,
  Bell,
  Award,
  Mail,
  Code,
  Layout,
  Home,
  MessageSquare,
  User,
  CreditCard,
  LogOut,
  ArrowLeft,
  BellOff,
  Users,
} from "react-feather";

import loginService from "../../../services/login.service.js";

// Import the auth hook
import { useAuth } from "../../../Contexts/AuthContext";

import { useLocation, Link } from "react-router-dom";

function Sidebar({ isOpen, setIsOpen }) {
  const [openMenu, setOpenMenu] = useState({ courses: false, forum: false });
  // Destructure the auth hook
  const { user, isLogged, isAdmin, isInstructor, isStudent } = useAuth();
  useEffect(() => {
    feather.replace();
  }, [openMenu, isOpen]);

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };
  // Log out event handler function
  const logOut = () => {
    // Call the logout function from the login service
    loginService.logOut();
    // Set the isLogged state to false
    setIsLogged(false);
  };

  const location = useLocation();
  const currentPath = location.pathname;

  // Regex to match /edit-course/ followed by any number
  const isEditCoursePath = /^\/edit-course\/\d+$/.test(currentPath);
  const isDetailCoursePath = /^\/course-detail\/\d+$/.test(currentPath);

  return (
    <div>
      <header className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md text-gray-700"
        >
          <Menu />
        </button>

        <div className="w-8"></div>
      </header>
      <div
        id="sidebar"
        className={`sidebar bg-white w-64 border-r border-gray-200 flex-shrink-0 fixed md:relative inset-y-0 z-50 transition-transform duration-300 ease-in-out overflow-y-auto scroll-smooth h-screen ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 flex border-gray-200">
          <h1 className="text-2xl font-bold text-blue-700 flex items-center">
            <BookOpen className="mr-2 mt-2" />
            EasyLearn
          </h1>
          <span
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="ml-13 mt-1 text-blue-700" />
          </span>
        </div>

        <div className="p-4">
          {/* Profile */}
          <div className="flex items-center mb-6">
            <img
              src="http://learning.frontendmatter.com/html/images/people/110/guy-5.jpg"
              alt="profile"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <h4 className="font-medium">{user?.user_full_name}</h4>
              <p className="text-xs text-gray-500">
                {isAdmin ? (
                  <>Admin</>
                ) : isInstructor ? (
                  <>Instructor</>
                ) : isStudent ? (
                  <>Student</>
                ) : (
                  <></>
                )}
              </p>
            </div>
          </div>

          {/* Menu */}

          {!isLogged ? (
            <h1>You are not logged in</h1>
          ) : isAdmin ? (
            // {/* Admin Sidebar menu*/}
            <nav>
              <h5 className="text-xs uppercase text-gray-500 font-semibold mb-3">
                Main
              </h5>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="flex items-center px-3 py-2 rounded-lg bg-blue-500 text-white"
                  >
                    <Home className="w-5 h-5 mr-3" />
                    Dashboard
                  </a>
                </li>

                {/* Courses */}
                <li>
                  <button
                    onClick={() => toggleMenu("courses")}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-300 transition text-base cursor-pointer"
                  >
                    <span className="flex items-center">
                      <Book className="w-5 h-5 mr-3" />
                      Courses
                    </span>
                    <svg
                      className={`w-4 h-4 transform transition-transform ${
                        openMenu.courses ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <ul
                    className={`overflow-hidden transition-all duration-300 ease-in-out pl-0 mt-1 space-y-1 text-base ${
                      openMenu.courses ? "max-h-60" : "max-h-0"
                    }`}
                  >
                    {/* Display My courses based on user role */}
                    {user?.role_name === 1 ? (
                      <li>
                        <a
                          href="#"
                          className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-blue-300"
                        >
                          My Courses
                        </a>
                      </li>
                    ) : (
                      <li></li>
                    )}
                    <li>
                      <a
                        href="#"
                        className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-blue-300"
                      >
                        Enroll
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-blue-300"
                      >
                        Assignments
                      </a>
                    </li>
                  </ul>
                </li>

                {/* Forum */}
                <li>
                  <button
                    onClick={() => toggleMenu("forum")}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-300 transition text-base cursor-pointer"
                  >
                    <span className="flex items-center">
                      <MessageSquare className="w-5 h-5 mr-3" /> Forum
                    </span>
                    <svg
                      className={`w-4 h-4 transform transition-transform ${
                        openMenu.forum ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <ul
                    className={`overflow-hidden transition-all duration-300 ease-in-out pl-0 mt-1 space-y-1 text-base ${
                      openMenu.forum ? "max-h-60" : "max-h-0"
                    }`}
                  >
                    <li>
                      <a
                        href="#"
                        className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-blue-300"
                      >
                        General
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-blue-300"
                      >
                        Q&A
                      </a>
                    </li>
                    <li>
                      <Link
                        to="/news"
                        className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-blue-300"
                      >
                        Announcements
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-300 transition text-base cursor-pointer"
                  >
                    <Users className="w-5 h-5 mr-3" />
                    Students
                  </a>
                </li>
              </ul>

              <h5 className="text-xs uppercase text-gray-500 font-semibold mt-6 mb-3">
                Account
              </h5>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    <User className="w-5 h-5 mr-3" />
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    <CreditCard className="w-5 h-5 mr-3" />
                    Billing
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    onClick={logOut}
                    className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                  </a>
                </li>
              </ul>
            </nav>
          ) : isInstructor ? (
            // {/* Instructor Sidebar menu */}
            <nav>
              <h5 className="text-xs uppercase text-gray-500 font-semibold mb-3">
                Main
              </h5>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/welcome"
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                      currentPath === "/welcome"
                        ? "bg-blue-500 text-white"
                        : "hover:bg-blue-100 text-gray-700"
                    }`}
                  >
                    <Home className="w-5 h-5 mr-3" />
                    Dashboard
                  </Link>
                </li>

                {/* Courses */}
                <li>
                  <Link
                    to="/courses"
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                      currentPath === "/courses" ||
                      currentPath === "/add-course" ||
                      currentPath === "/category" ||
                      isEditCoursePath ||
                      isDetailCoursePath
                        ? "bg-blue-500 text-white"
                        : "hover:bg-blue-100 text-gray-700"
                    }`}
                  >
                    <BookOpen className="w-5 h-5 mr-3" />
                    My Courses
                  </Link>
                </li>
                {/* Students */}
                <li>
                  <Link
                    to="/students"
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                      currentPath === "/students"
                        ? "bg-blue-500 text-white"
                        : "hover:bg-blue-100 text-gray-700"
                    }`}
                  >
                    <Users className="w-5 h-5 mr-3" />
                    My Students
                  </Link>
                </li>

                {/* Message */}
                <li>
                  <button
                    onClick={() => toggleMenu("forum")}
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                      currentPath === "/chat"
                        ? "bg-blue-500 text-white"
                        : "hover:bg-blue-100 text-gray-700"
                    }`}
                  >
                    <span className="flex items-center">
                      <MessageSquare className="w-5 h-5 mr-3" /> Message
                    </span>
                    <svg
                      className={`w-4 h-4 transform transition-transform ${
                        openMenu.forum ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <ul
                    className={`overflow-hidden transition-all duration-300 ease-in-out pl-0 mt-1 space-y-1 text-base ${
                      openMenu.forum ? "max-h-60" : "max-h-0"
                    }  
                    
                    `}
                  >
                    <li>
                      <Link
                        to="/chat"
                        className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors`}
                      >
                        Community
                      </Link>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-blue-300"
                      >
                        Chat
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link
                    to="/news"
                    className={`flex items-center w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-300 transition text-base cursor-pointer ${
                      currentPath === "/news"
                        ? "bg-blue-500 text-white"
                        : "hover:bg-blue-100 text-gray-700"
                    }`}
                  >
                    <BellOff className="w-5 h-5 mr-3" />
                    Announcements
                  </Link>
                </li>
              </ul>

              <h5 className="text-xs uppercase text-gray-500 font-semibold mt-6 mb-3">
                Account
              </h5>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="flex items-center w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-300 transition text-base cursor-pointer"
                  >
                    <User className="w-5 h-5 mr-3" />
                    Profile
                  </a>
                </li>

                <li>
                  <Link
                    to="/billing"
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                      currentPath === "/billing"
                        ? "bg-blue-500 text-white"
                        : "hover:bg-blue-100 text-gray-700"
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mr-3" />
                    Billing
                  </Link>
                </li>

                <li>
                  <a
                    href="/"
                    onClick={logOut}
                    className="flex items-center w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-300 transition text-base cursor-pointer"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                  </a>
                </li>
              </ul>
            </nav>
          ) : isStudent ? (
            // {/* Stundet Sidebar menu */}
            <nav>
              <h5 className="text-xs uppercase text-gray-500 font-semibold mb-3">
                Main
              </h5>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="flex items-center px-3 py-2 rounded-lg bg-blue-500 text-white"
                  >
                    <Home className="w-5 h-5 mr-3" />
                    Dashboard
                  </a>
                </li>

                {/* Courses */}
                <li>
                  <button
                    onClick={() => toggleMenu("courses")}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-300 transition text-base cursor-pointer"
                  >
                    <span className="flex items-center">
                      <Book className="w-5 h-5 mr-3" />
                      Courses
                    </span>
                    <svg
                      className={`w-4 h-4 transform transition-transform ${
                        openMenu.courses ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <ul
                    className={`overflow-hidden transition-all duration-300 ease-in-out pl-0 mt-1 space-y-1 text-base ${
                      openMenu.courses ? "max-h-60" : "max-h-0"
                    }`}
                  >
                    {/* Display My courses based on user role */}
                    {/* {user?.role_name === 1 ? (
                      <li>
                        <a
                          href="#"
                          className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-blue-300"
                        >
                          My Courses
                        </a>
                      </li>
                    ) : (
                      <li></li>
                    )} */}
                    <li>
                      <a
                        href="#"
                        className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-blue-300"
                      >
                        My Courses
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-blue-300"
                      >
                        Quizes
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-blue-300"
                      >
                        Assignments
                      </a>
                    </li>
                  </ul>
                </li>

                {/* Forum */}
                <li>
                  <button
                    onClick={() => toggleMenu("forum")}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-300 transition text-base cursor-pointer"
                  >
                    <span className="flex items-center">
                      <MessageSquare className="w-5 h-5 mr-3" /> Message
                    </span>
                    <svg
                      className={`w-4 h-4 transform transition-transform ${
                        openMenu.forum ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <ul
                    className={`overflow-hidden transition-all duration-300 ease-in-out pl-0 mt-1 space-y-1 text-base ${
                      openMenu.forum ? "max-h-60" : "max-h-0"
                    }`}
                  >
                    <li>
                      <a
                        href="#"
                        className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-blue-300"
                      >
                        Community
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-blue-300"
                      >
                        Chat
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-300 transition text-base cursor-pointer"
                  >
                    <BellOff className="w-5 h-5 mr-3" />
                    Announcements
                  </a>
                </li>
              </ul>

              <h5 className="text-xs uppercase text-gray-500 font-semibold mt-6 mb-3">
                Account
              </h5>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="flex items-center w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-300 transition text-base cursor-pointer"
                  >
                    <User className="w-5 h-5 mr-3" />
                    Profile
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="flex items-center w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-300 transition text-base cursor-pointer"
                  >
                    <CreditCard className="w-5 h-5 mr-3" />
                    Billing
                  </a>
                </li>

                <li>
                  <a
                    href="/"
                    onClick={logOut}
                    className="flex items-center w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-300 transition text-base cursor-pointer"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                  </a>
                </li>
              </ul>
            </nav>
          ) : (
            <h1>Unknown role</h1>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
