import React, { useState } from "react";

import Sidebar from "../../components/Sidebar/Sidebar.jsx";
// Import the auth hook
import { useAuth } from "../../../Contexts/AuthContext.jsx";
import Main from "./Main.jsx";
import AllMain from "./AllMain.jsx";
function Course() {
  const [isOpen, setIsOpen] = useState(false);
  // Destructure the auth hook
  const { isLogged, isAdmin, isInstructor, isStudent } = useAuth();

  const [activePage, setActivePage] = useState("main");

  if (isLogged) {
    if (isAdmin || isInstructor || isStudent) {
      return (
        <div className="flex flex-col md:flex-row overflow-hidden h-screen">
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

          {activePage === "allMain" ? (
            <AllMain onShowMain={() => setActivePage("main")} />
          ) : (
            <Main onShowAllMain={() => setActivePage("allMain")} />
          )}
        </div>
      );
    } else {
      return <h1>Unauthorized</h1>;
    }
  }
}

export default Course;
