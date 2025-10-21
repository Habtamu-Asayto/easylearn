import React, { useState } from "react";

import Sidebar from "../../components/Sidebar/Sidebar.jsx";
// Import the auth hook
import { useAuth } from "../../../contexts/AuthContext.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Header from "../../components/Header/Header.jsx";

function Profile() {
  const { user, isLogged, isAdmin, isInstructor, isStudent } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  if (isLogged) {
    if (isAdmin || isInstructor || isStudent) {
      return (
        <div className="flex flex-col md:flex-row overflow-hidden h-screen">
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
          <div className="flex-1 overflow-y-auto">
            {/* Header */}
            <Header />
            {/* Dashboard Content */}
            <main className="p-6">Profile Page</main>
            <Footer />
          </div>
        </div>
      );
    }
  }
}

export default Profile;
