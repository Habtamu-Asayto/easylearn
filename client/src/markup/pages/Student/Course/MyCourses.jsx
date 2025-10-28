import react, { useState } from "react";
import Sidebar from "../../../components/Sidebar/Sidebar.jsx";
// Import the auth hook
import { useAuth } from "../../../../contexts/AuthContext.jsx";
import Header from "../../../components/Header/Header.jsx";
import MyCoursesList from "./MyCoursesList.jsx";
import Footer from "../../../components/Footer/Footer.jsx"
function MyCourses() {
  const [isOpen, setIsOpen] = useState(false);
  // Destructure the auth hook
  const { isLogged, isAdmin, isInstructor, isStudent } = useAuth();
  if (isLogged) {
    if (isAdmin || isInstructor || isStudent) {
      return (
        <div className="flex flex-col md:flex-row overflow-hidden h-screen">
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
          <div className="flex-1 overflow-y-auto">
            <Header />

            <MyCoursesList />
            <Footer />
          </div>
        </div>
      );
    }
  }
}

export default MyCourses;
