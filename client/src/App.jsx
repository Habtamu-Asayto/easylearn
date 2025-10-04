import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./markup/pages/login/Login.jsx";
import Home from "./markup/pages/Home.jsx";
import Dashboard from "./markup/pages/Admin/Dashboard.jsx";
import "./assets/styles/styles.css";
import bk_image from "./assets/images/login-bg.jpg";

// Layouts
import BeforeLoginHeader from "./markup/components/Header/BeforeLoginHeader.jsx";
import PrivateAuthRoute from "../src/markup/components/Auth/PrivateAuthRoute.jsx";

//import unauthorized page
import Unauthorized from "./markup/pages/Unauthorized.jsx";

function BeforeLoginLayout({ children }) {
  return (
    <>
      <BeforeLoginHeader />
      <main className="bg-gray-50 text-gray-800">{children}</main>
    </>
  );
}

function AfterLoginLayout({ children }) {
  return (
    <div className="flex">
      <main className="flex-1 bg-gray-50 text-gray-800">{children}</main>
    </div>
  );
}

function LoginLayout({ children }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      {children}
    </main>
  );
}
function UnauthorizedLayout({ children }) {
  return (
    <main
      className="min-h-screen flex items-center justify-center bg-gray-50"
      style={{
        backgroundImage: `url(${bk_image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {children}
    </main>
  );
}

function App() {
  const user = JSON.parse(localStorage.getItem("user")); // check login state
  const location = useLocation(); // detect current route

  // Determine if current route is login or after-login
  const isLoginPage = location.pathname === "/login";
  const isAfterLoginPage = location.pathname.startsWith("/admin");

  return (
    <>
      <Routes>
        {/* Public pages before login */}
        <Route
          path="/"
          element={
            <BeforeLoginLayout>
              <Home />
            </BeforeLoginLayout>
          }
        />
        {/* Login page (no header, no footer) */}
        <Route
          path="/login"
          element={
            <LoginLayout>
              <Login />
            </LoginLayout>
          }
        />
        <Route
          path="/unauthorized"
          element={
            <UnauthorizedLayout>
              <Unauthorized />
            </UnauthorizedLayout>
          }
        />
        {/* Only admins can route 
        <Route
          path="/welcome"
          element={
            <PrivateAuthRoute roles={[1,2,3]}>
              <AfterLoginLayout>
                <AdminDashboard />
              </AfterLoginLayout>
            </PrivateAuthRoute>
          }
        />  */}
        <Route
          path="/welcome"
          element={
            <AfterLoginLayout>
              <PrivateAuthRoute roles={[1, 2, 3]}>
                <Dashboard />
              </PrivateAuthRoute>
            </AfterLoginLayout>
          }
        />
      </Routes>
    </>
  );
}

export default App;
