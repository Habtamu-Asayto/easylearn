import react, { useState } from "react";

import Sidebar from "../../../components/Sidebar/Sidebar.jsx";
// Import the auth hook
import { useAuth } from "../../../../Contexts/AuthContext.jsx";
import CategoryList from "./CategoryList.jsx";
function Category() {
  const [isOpen, setIsOpen] = useState(false);

  // Destructure the auth hook
  const { isLogged, isAdmin, isInstructor, isStudent } = useAuth();

  const [activePage, setActivePage] = useState("main");
  if (isLogged) {
    if (isAdmin || isInstructor) {
      return (
        <div className="flex flex-col md:flex-row overflow-hidden h-screen">
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

          <CategoryList />
        </div>
      );
    } else {
      return <h1>Unauthorized</h1>;
    }
  }
}

export default Category;
