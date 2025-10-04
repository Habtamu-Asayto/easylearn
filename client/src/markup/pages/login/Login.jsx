import { useEffect, useState } from "react";
import feather from "feather-icons";
import bk_image from "../../../assets/images/login-bg.jpg";
import LoginForm from "../../components/Form/LoginForm.jsx";

function Login() {
  const [flipped, setFlipped] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    feather.replace();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      id="background"
      className="min-h-screen w-full flex items-center justify-center relative"
      style={
        isMobile
          ? { backgroundColor: "white" }
          : {
              backgroundImage: `url(${bk_image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
      }
    >
      {/* Dark overlay only if not mobile */}
      {!isMobile && <div className="absolute inset-0 bg-indigo-800/21" />}

      {/* Centered form */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
