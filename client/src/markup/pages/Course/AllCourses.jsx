import react, { useState } from "react";

import Sidebar from "../../components/Sidebar/Sidebar.jsx";
// Import the auth hook
import { useAuth } from "../../../contexts/AuthContext.jsx";
import Main from "./Main.jsx";
function AllCourses() {
  const [isOpen, setIsOpen] = useState(false);
  // Destructure the auth hook
  const { isLogged, isAdmin, isInstructor, isStudent } = useAuth();

  if (isLogged) {
    if (isAdmin || isInstructor || isStudent) {
      return (
        <div className="flex flex-col md:flex-row overflow-hidden h-screen">
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

          <Main />
        </div>
      );
    } else {
      return <h1>Unauthorized</h1>;
    }
  }
}

export default AllCourses;