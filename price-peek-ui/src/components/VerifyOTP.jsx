import React, { useState } from 'react';
import axios from '../api/query';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const VERIFY_OTP_URL = '/verify-email';
const GENERATE_OTP_URL = '/generate-otp';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(VERIFY_OTP_URL, JSON.stringify({ email, otp }), {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.success) {
        navigate('/login');
      } else {
        setErrMsg(response.data.message);
      }
    } catch (err) {
      setErrMsg('Failed to verify OTP');
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await axios.post(GENERATE_OTP_URL, JSON.stringify({ email }), {
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-600">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-md shadow-md">
        <h1 className="text-2xl font-bold text-center">Verify OTP</h1>
        <form className="space-y-4" onSubmit={handleVerifyOtp}>
          <p className={errMsg ? 'text-red-500' : 'hidden'} aria-live="assertive">{errMsg}</p>
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Enter OTP</label>
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
          <button type="submit" className="w-full px-4 py-2 text-white bg-yellow-500 rounded-md">Verify OTP</button>
        </form>
        <div className="text-center mt-4">
          <span className="text-sm font-medium text-gray-700">Didn't receive the OTP? </span><button onClick={handleResendOtp} className="text-sm text-blue-500">Resend</button>
        </div>
        <div className="text-center mt-4">
          <Link to="/login" className="text-sm text-blue-500">Back to Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;