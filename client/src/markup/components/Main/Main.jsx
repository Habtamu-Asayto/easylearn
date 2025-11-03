import react, { useState } from "react"; 

// Import the auth hook
import { useAuth } from "../../../contexts/AuthContext";
import AdminMain from "./AdminMain.jsx";
import InstructorMain from "./InstructorMain.jsx";
import StudentMain from "./StudentMain.jsx";

function Main() {
  const [isOpen, setIsOpen] = useState(false);
  // Destructure the auth hook
  const { isLogged, isAdmin, isInstructor, isStudent } = useAuth();

  if (isLogged) {
    if (isAdmin) {
      return <AdminMain/>;
    } else if (isInstructor) {
      return <InstructorMain />;
    } else if (isStudent) {
      return <StudentMain />;
    } else {
      return <h1>Unauthorized</h1>;
    }
  }
}

export default Main;
