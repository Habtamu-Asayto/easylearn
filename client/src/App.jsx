import { Routes, Route, useLocation, Navigate } from "react-router-dom";
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
import A404 from "./markup/pages/A404.jsx";
import StudentList from "./markup/pages/Student/StudentList.jsx";
import Student from "./markup/pages/Student/Student.jsx";
import Course from "./markup/pages/Course/Course.jsx";
import AddCourse from "./markup/pages/Course/Add/AddCourse.jsx";
import Category from "./markup/pages/Course/Category/Category.jsx";
import EditCourse from "./markup/pages/Course/Edit/EditCourse.jsx";

// Toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Detail from "./markup/pages/Course/Detail/Detail.jsx";
import Announcement from "./markup/pages/News/Announcement.jsx";
import Billing from "./markup/pages/Billing/Billing.jsx";
import Chat from "./markup/pages/Chat/Chat.jsx";
import EmailVerification from "./markup/components/Form/EmailVerification.jsx";

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
  // Toast for any page

  const user = JSON.parse(localStorage.getItem("user")); // check login state
  const location = useLocation(); // detect current route

  // Determine if current route is login or after-login
  const isLoginPage = location.pathname === "/login";
  const isAfterLoginPage = location.pathname.startsWith("/welcome");

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
        <Route
          path="/students"
          element={
            <AfterLoginLayout>
              <PrivateAuthRoute roles={[1, 2]}>
                <Student />
              </PrivateAuthRoute>
            </AfterLoginLayout>
          }
        />
        <Route
          path="/courses"
          element={
            <AfterLoginLayout>
              <PrivateAuthRoute roles={[1, 2, 3]}>
                <Course />
              </PrivateAuthRoute>
            </AfterLoginLayout>
          }
        />
        <Route
          path="/news"
          element={
            <AfterLoginLayout>
              <PrivateAuthRoute roles={[1, 2]}>
                <Announcement />
              </PrivateAuthRoute>
            </AfterLoginLayout>
          }
        />

        <Route
          path="/add-course"
          element={
            <AfterLoginLayout>
              <PrivateAuthRoute roles={[1, 2, 3]}>
                <AddCourse />
              </PrivateAuthRoute>
            </AfterLoginLayout>
          }
        />
        <Route
          path="/edit-course/:id"
          element={
            <AfterLoginLayout>
              <PrivateAuthRoute roles={[1, 2]}>
                <EditCourse />
              </PrivateAuthRoute>
            </AfterLoginLayout>
          }
        />
        <Route
          path="/course-detail/:id"
          element={
            <AfterLoginLayout>
              <PrivateAuthRoute roles={[1, 2]}>
                <Detail />
              </PrivateAuthRoute>
            </AfterLoginLayout>
          }
        />
        <Route
          path="/category"
          element={
            <AfterLoginLayout>
              <PrivateAuthRoute roles={[1, 2]}>
                <Category />
              </PrivateAuthRoute>
            </AfterLoginLayout>
          }
        />
        <Route
          path="/billing"
          element={
            <AfterLoginLayout>
              <PrivateAuthRoute roles={[1, 2]}>
                <Billing />
              </PrivateAuthRoute>
            </AfterLoginLayout>
          }
        />

        <Route
          path="/chat"
          element={
            <AfterLoginLayout>
              <PrivateAuthRoute roles={[1, 2, 3]}>
                <Chat />
              </PrivateAuthRoute>
            </AfterLoginLayout>
          }
        />
      </Routes>
      <Routes>
        <Route path="/verify-email" element={<EmailVerification />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
