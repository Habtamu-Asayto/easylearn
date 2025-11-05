import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import userService from "../../../services/user.service.js";
import { toast } from "react-toastify";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
        const res = await userService.resetPassword(token, newPassword);
        if(res.status === "success"){
          toast.success("Password reset successful! Please log in.");
          navigate("/login");
        } else {
          toast.error(res.message || "Password reset failed");
        }
    } catch (err) {
      console.error("Reset Password Error:", err);
      toast.error(err.message || "An error occurred during password reset");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 backdrop-blur-sm">
      <div className="bg-white p-8 shadow-2xl rounded-2xl w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="w-full px-4 py-3 border rounded-lg"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <label htmlFor="confirmpassword">Confirm password</label>
          <input
            type="password"
            className="w-full px-4 py-3 border rounded-lg"
            placeholder="Enter New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
