import React, { useState, useContext } from "react";
import axios from "../api/query";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LoadingContext, { LoadingProvider } from "../context/LoadingContext";
import { getEmailFromToken } from "../utils/auth/auth.util";
import useAuth from "../hooks/useAuth";

const VERIFY_OTP_URL = "/verify-email";
const GENERATE_OTP_URL = "/generate-otp";

const VerifyOTPContent = () => {
  const [otp, setOtp] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const { setAuth } = useAuth();
  const { loading, setLoading } = useContext(LoadingContext);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const purpose = location.state?.purpose || "";
  const fromRegister = purpose === "verify_email";

  if (!email) {
    setErrMsg("No email provided for OTP verification.");
    return null;
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        VERIFY_OTP_URL,
        JSON.stringify({ email, otp, purpose }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("res in verifyOTP", response);
      if (response.data.success) {
        console.log("OTPverified fromReg ", fromRegister);
        if (fromRegister) {
          const accessToken = response.data.token;
          const refreshToken = response.data.refresh_token;
          const email = getEmailFromToken(accessToken);

          setAuth({ email, accessToken, roles: ["USER"] });
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          navigate("/home");
        } else {
          navigate("/login");
        }
      } else {
        setErrMsg(response.data.message);
      }
    } catch (err) {
      console.log(err);
      setErrMsg("Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        GENERATE_OTP_URL,
        JSON.stringify({ email, purpose }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        setErrMsg("OTP has been resent to your email");
      } else {
        setErrMsg(response.data.message);
      }
    } catch (err) {
      setErrMsg("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-600">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-md shadow-md">
        <h1 className="text-2xl font-bold text-center">Verify OTP</h1>
        <form className="space-y-4" onSubmit={handleVerifyOtp}>
          <p
            className={errMsg ? "text-red-500" : "hidden"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700"
            >
              Enter OTP
            </label>
            <input
              type="text"
              id="otp"
              autoComplete="off"
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-yellow-500 rounded-md"
          >
            Verify OTP
          </button>
        </form>
        <div className="text-center mt-4">
          <span className="text-sm font-medium text-gray-700">
            Didn't receive the OTP?{" "}
          </span>
          <button onClick={handleResendOtp} className="text-sm text-blue-500">
            Resend
          </button>
        </div>
        <div className="text-center mt-4">
          <Link
            to={fromRegister ? "/register" : "/login"}
            className={`text-sm ${loading ? "text-gray-400" : "text-blue-500"}`}
          >
            {fromRegister ? "Back to Create Account" : "Back to Sign In"}
          </Link>
        </div>
      </div>
    </div>
  );
};

const VerifyOTP = () => (
  <LoadingProvider>
    <VerifyOTPContent />
  </LoadingProvider>
);

export default VerifyOTP;
