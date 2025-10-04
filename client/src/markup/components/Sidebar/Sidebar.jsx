import react,{useState} from "react";
import StudentSidebar from "./StudentSidebar.jsx";
import AdminSidebar from "./AdminSidebar.jsx";
import InstructorSidebar from "./InsturctorSidebar.jsx";

// Import the auth hook 
  import { useAuth } from "../../../Contexts/AuthContext";

function Sidebar() {

  const [isOpen, setIsOpen] = useState(false);
   // Destructure the auth hook 
  const { isLogged, isAdmin, isInstructor, isStudent } = useAuth();

  if (isLogged) {
    if (isAdmin) {
      return <AdminSidebar isOpen={isOpen} setIsOpen={setIsOpen} />;
    } else if (isInstructor) {
      return <InstructorSidebar isOpen={isOpen} setIsOpen={setIsOpen} />;
    } else if (isStudent) {
      return <StudentSidebar isOpen={isOpen} setIsOpen={setIsOpen} />;
    }
    else{
      return <h1>Unauthorized</h1>
    }
  }  
  
}

export default Sidebar;
