import React, { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import { useAuth } from "../../../Contexts/AuthContext";
import Footer from "../../components/Footer/Footer.jsx";
import ChatBox from "./ChatBox.jsx";
import Header from "../../components/Header/Header.jsx";

function Chat() {
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
            <Header />

            {/* Dashboard Content */}
            <main className="h-screen w-full bg-gray-100 p-6 flex items-center justify-center">
              <ChatBox />
            </main>
            <Footer />
          </div>
        </div>
      );
    }
  }
}

export default Chat;
