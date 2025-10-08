import react, { useState } from "react";

import Sidebar from "../../../components/Sidebar/Sidebar.jsx";
// Import the auth hook
import { useAuth } from "../../../../Contexts/AuthContext.jsx";
import Form from "./Form.jsx";
import Unauthorized from "../../Unauthorized.jsx";
function AddCourse() {
  const [isOpen, setIsOpen] = useState(false);
  // Destructure the auth hook
  const { isLogged, isAdmin, isInstructor, isStudent } = useAuth();

  if (isLogged ) {
    if (isAdmin || isInstructor) {
      return (
        <div className="flex flex-col md:flex-row overflow-hidden h-screen">
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

          <Form />
        </div>
      );
    } else {
      return <Unauthorized />;
    }
  }
}

export default AddCourse;
