import { useState } from "react";

import React from "react";
import { useAuth } from "../../../../contexts/AuthContext.jsx";
import Sidebar from "../../../components/Sidebar/Sidebar.jsx";
import QuizeContent from "./QuizeContent.jsx";



export default function Quiz() {
  
  const [isOpen, setIsOpen] = useState(false);
  // Destructure the auth hook
  const { isLogged, isAdmin, isInstructor, isStudent } = useAuth();


   if (isLogged) {
    if (isAdmin || isInstructor || isStudent) {
      return (
        <div className="flex flex-col md:flex-row overflow-hidden h-screen">
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
           <QuizeContent />
        </div>
      );
    } else {
      return <h1>Unauthorized</h1>;
    }
  }
}
