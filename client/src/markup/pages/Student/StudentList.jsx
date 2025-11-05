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
import StudentTable from "./StudentTable.jsx";
function StudentList() {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Main */}
      <main className="p-2">
        
        {/* table  */}
        <StudentTable />
      </main>
      <Footer />
    </div>
  );
}

export default StudentList;
