import react, { useState } from "react"; 

import Sidebar from "../../components/Sidebar/Sidebar.jsx";
// Import the auth hook
import { useAuth } from "../../../Contexts/AuthContext.jsx";
import StudentList from "./StudentList.jsx";
function Student() {
    const [isOpen, setIsOpen] = useState(false);
   // Destructure the auth hook 
  const { isLogged, isAdmin, isInstructor, isStudent } = useAuth();

   if (isLogged) {
     if (isAdmin || isInstructor) {
       return (
         <div className="flex flex-col md:flex-row overflow-hidden h-screen">
           <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
           <StudentList />
         </div>
       );
     }else {
       return <h1>Unauthorized</h1>;
     }
   }  
}

export default Student;
