
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import React, { useState } from "react";
import Main from "../../components/Main/Main.jsx";
function Dashboard() {
const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <Main />
    </div>
  );
}

export default Dashboard;
