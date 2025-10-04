import React, { useEffect, useState } from "react"; 
import { Link } from "react-router";
import feather from "feather-icons";
import loginService from "../../../services/login.service.js";
import { useAuth } from "../../../contexts/AuthContext.jsx";
function BeforeLoginHeader() {
  // console.log(useAuth()); 
  const [isOpen, setIsOpen] = useState(false);
  // Use the custom hook to access the data in the context
  const { isLogged, setIsLogged, user } = useAuth(); 

  // Log out event handler function
  const logOut = () => {
    // Call the logout function from the login service
    loginService.logOut();
    // Set the isLogged state to false
    setIsLogged(false);
  };
  useEffect(() => {
    feather.replace(); // re-render feather icons after mount
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-gray-50 text-gray-800">
      <header className="bg-white shadow-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          {/* Logo */}
          <h1 className="text-2xl font-bold text-blue-700 flex items-center">
            <i data-feather="book-open" className="mr-2 mt-2"></i> EasyLearn
          </h1>

          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-6 font-medium text-gray-600">
            <li>
              <a className="hover:text-indigo-600" href="/#home">
                Home
              </a>
            </li>
            <li>
              <a className="hover:text-indigo-600" href="/#rate">
                Instructors
              </a>
            </li>
            <li>
              <a className="hover:text-indigo-600" href="/#feedback">
                Feedback
              </a>
            </li>
            <li>
              <a className="hover:text-indigo-600" href="/#scholarship">
                Scholarship
              </a>
            </li>
            <li>
              <a className="hover:text-indigo-600" href="/#price">
                Price
              </a>
            </li>
            <li>
              <a className="hover:text-indigo-600" href="/#tutor">
                Tutor
              </a>
            </li>
            <li>
              <a className="hover:text-indigo-600" href="/#contact">
                Contact
              </a>
            </li>
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {isLogged ? (
              <div className="flex">
                <span className="hidden md:block mt-2 mr-3">👤 {user?.user_email}</span>
              <Link
                onClick={logOut}
                className="hidden md:block px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                to="/"
              >
                Logout
              </Link>
              </div>
            ) : (
              
                <Link
                  className="hidden md:block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-300 transition"
                  to="/login"
                >
                  Log In
                </Link> 
            )}

            {/* Mobile Menu Button */}
            <button
              id="menu-btn"
              className="md:hidden focus:outline-none"
              onClick={toggleMenu} // ✅ FIX: toggle state when clicked
            >
              <i data-feather="menu" className="w-6 h-6" />
            </button>
          </div>
        </div>
        {/* Mobile Menu (hidden by default) */}

        <div
          className={`
            ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
            overflow-hidden transition-all duration-800 ease-in-out
             flex-col bg-gray-50 shadow-md px-6 py-0 space-y-3 md:hidden
          `}
        >
          <a href="#home" className="block text-gray-700 hover:text-indigo-600">
            Home
          </a>
          <a href="#rate" className="block text-gray-700 hover:text-indigo-600">
            Instructors
          </a>
          <a
            href="#feedback"
            className="block text-gray-700 hover:text-indigo-600"
          >
            Students
          </a>
          <a
            href="#scholarship"
            className="block text-gray-700 hover:text-indigo-600"
          >
            Scholarship
          </a>
          <a
            href="#contact"
            className="block text-gray-700 hover:text-indigo-600"
          >
            Contact
          </a>
          {isLogged ? (
            <Link
              onClick={logOut}
              className="block px-4 py-2 bg-red-500  text-white rounded-lg hover:bg-red-600 transition text-center"
              to="/"
            >
              Logout
            </Link>
          ) : (
            <Link
              className="block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-300 transition text-center"
              to="/login"
            >
              Log In
            </Link>
          )}
          <Link
            className="hidden md:block px-4 py-2 text-white rounded-lg  transition"
            to="/login"
          >
            Log In
          </Link>
        </div>
      </header>
    </div>
  );
}

export default BeforeLoginHeader;
