import { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getEmailFromToken } from "../utils/auth/auth.util";
import axios from "../api/query";
import logo from '../assets/images/PricePeek.png';

const LOGIN_URL = "/login";

const Login = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [email, pwd]);

  useEffect(() => {
    if (auth?.email) {
      navigate('/home', { replace: true });
    }
  })

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(LOGIN_URL, JSON.stringify({ email, password: pwd }), {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response?.data) {
        const accessToken = response.data.token;
        const refreshToken = response.data.refresh_token;
        const email = getEmailFromToken(accessToken);

        setAuth({ email, accessToken, roles: ["USER"] });
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        setEmail('');
        setPwd('');
        navigate('/home');
      } else {
        throw new Error('No data in response');
      }
    } catch (err) {
      if (!err.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing username or password');
      } else if (err.response?.status === 401) {
        setErrMsg('Invalid username or password');
      } else if (err.response?.status === 404) {
        const specificMsg = err.response?.data?.message?.split(':')[0];
        setErrMsg(specificMsg);
      } else {
        setErrMsg('Login Failed');
      }
      errRef.current.focus();
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-600">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md">
        <img src={logo} alt="Logo" className="mx-auto w-24 h-24" />
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="login-email"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="login-password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <button type="submit" className="px-4 py-2 text-white bg-yellow-500 rounded-md">Sign In</button>
            <Link to="/register" className="text-sm text-blue-500">Create Account</Link>
          </div>
          <div className="text-center">
            <Link to="/forgot-password" className="text-sm text-blue-500">Forgot Password?</Link>
        </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
