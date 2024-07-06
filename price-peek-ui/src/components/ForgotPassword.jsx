import React, { useState } from 'react';
import axios from '../api/query';
import { Link, useNavigate } from 'react-router-dom';

const FORGOT_PASSWORD_URL = '/forgot-password';
const CHANGE_PASSWORD_URL = '/change-password';
const purpose = "forgot_password";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(FORGOT_PASSWORD_URL, JSON.stringify({ email, purpose }), {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.success) {
        setStep(2);
        setErrMsg('');
      } else {
        setErrMsg(response.data.message);
      }
    } catch (err) {
      setErrMsg('Failed to process request');
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await axios.post(FORGOT_PASSWORD_URL, JSON.stringify({ email, purpose }), {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.success) {
        setErrMsg('OTP has been resent to your email');
      } else {
        setErrMsg(response.data.message);
      }
    } catch (err) {
      setErrMsg('Failed to resend OTP');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(CHANGE_PASSWORD_URL, JSON.stringify({ email, password, otp }), {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.success) {
        navigate('/login');
      } else {
        setErrMsg(response.data.message);
      }
    } catch (err) {
      setErrMsg('Failed to change password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-600">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-md shadow-md">
        {step === 1 ? (
          <>
            <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
            <form className="space-y-4" onSubmit={handleForgotPassword}>
              <p className={errMsg ? 'text-red-500' : 'hidden'} aria-live="assertive">{errMsg}</p>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button type="submit" className="w-full px-4 py-2 text-white bg-yellow-500 rounded-md">Send OTP</button>
            </form>
            <div className="text-center mt-4">
              <Link to="/login" className="text-sm text-blue-500">Back to Sign In</Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-center">Verify OTP</h1>
            <form className="space-y-4" onSubmit={handleChangePassword}>
              <p className={errMsg ? 'text-red-500' : 'hidden'} aria-live="assertive">{errMsg}</p>
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">OTP</label>
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
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  id="password"
                  autoComplete="off"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button type="submit" className="w-full px-4 py-2 text-white bg-yellow-500 rounded-md">Change Password</button>
            </form>
            <div className="text-center mt-4">
              <button onClick={handleResendOTP} className="text-sm text-blue-500">Didn't receive the OTP? Resend</button>
            </div>
            <div className="text-center mt-4">
              <Link to="/login" className="text-sm text-blue-500">Back to Sign In</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
