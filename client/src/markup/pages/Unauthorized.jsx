import React from 'react'
import { useAuth } from "../../contexts/AuthContext.jsx";
function Unauthorized() {
  const { isLogged, setIsLogged, user } = useAuth();
  return (
    <div>
      <h1>{user?.role_name}</h1>
      <h1 className='text-2xl'>You don't have the authorization to access the page you requested</h1>
    </div>
  );
}

export default Unauthorized
