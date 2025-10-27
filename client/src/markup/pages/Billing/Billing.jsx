import React, { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import { useAuth } from "../../../Contexts/AuthContext";
import Footer from "../../components/Footer/Footer.jsx";
import A404 from "../A404.jsx";

function Billing() {
  const [isOpen, setIsOpen] = useState(false);
  // Destructure the auth hook
  const { isLogged, isAdmin, isInstructor, isStudent } = useAuth();

  if (isLogged) {
    if (isAdmin || isInstructor || isStudent) {
      return (
        <div className="flex flex-col md:flex-row h-screen overflow-hidden">
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

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
              <div id="all-courses" className="flex p-4">
                Coming soon....
              </div>
            </main>
            <Footer />
          </div>
        </div>
      );
    } else {
      <>
        <A404 />
      </>;
    }
  }
}

export default Billing;
