// Import React and the Hooks we need here
import React, { useState, useEffect, useContext } from "react";
// Import the Util function we created to handle the reading from the local storage
import getAuth from "../util/auth.jsx";
// Create a context object
const AuthContext = React.createContext();
// Create a custom hook to use the context
export const useAuth = () => {
  return useContext(AuthContext);
};
// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isInstructor, setIsInstructor] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [user, setUser] = useState(null);

  const value = {
    isLogged,
    isAdmin,
    isInstructor,
    isStudent,
    setIsAdmin,
    setIsLogged,
    setIsInstructor,
    setIsStudent,
    user,
  };

  useEffect(() => {
    // Retrieve the logged in user from local storage
    const loggedInUser = getAuth();
    // console.log(loggedInEmployee);
    loggedInUser.then((response) => {
      // console.log(response);
      if (response.user_token) {
        setIsLogged(true);
        // 1 is the role_name for admin
        if (response.role_name === 1) {
          setIsAdmin(true);
        }
        // 2 is the role_name for instuctor
        else if (response.role_name === 2) {
          setIsInstructor(true);
        }
        // 3 is the employee_role for admin
        if (response.role_name === 3) {
          setIsStudent(true);
        }

        setUser(response);
      }
    });
  }, []);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
