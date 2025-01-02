import { useRef, useState, useEffect, useContext } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import LoadingContext from "../context/LoadingContext";
import { getEmailFromToken } from "../utils/auth/auth.util";
import axios from "../api/query";
import logo from '../assets/images/PricePeek.png';

const LOGIN_URL = "/login";

const Login = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const { setLoading } = useContext(LoadingContext);

  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState('jatwat123@gmail.com');
  const [pwd, setPwd] = useState('Levelup123@');
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
  }, [auth?.email, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(LOGIN_URL, JSON.stringify({ email, password: pwd }), {
        headers: { 'Content-Type': 'application/json' },
        // withCredentials: true, // This sends the cookie with the request
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
      console.error('ye rha error', err);
      if (!err.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing email or password');
      } else if (err.response?.status === 401 && err.response?.data?.message === 'Invalid email or password') {
        setErrMsg('Invalid email or password');
      } else if (err.response?.status === 422) {
        const passwordErrors = err.response?.data?.errors?.password || [];
        const emailErrors = err.response?.data?.errors?.email || [];
        setErrMsg(
          passwordErrors.includes('The password must be at least 6 characters.')
            ? passwordErrors.join(' ')
            : emailErrors.join(' ')
        );
      } else if (err.response?.status === 403 && err.response?.data?.message === 'Email is not verified') {
        navigate('/verify-otp', { state: { email } }); // Redirect to OTP verification page if email is not verified
      } else {
        setErrMsg('Login Failed');
      }
      errRef.current.focus();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-600">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-[50px] shadow-[10px_10px_35px_#FEC924]">
        <img src={logo} alt="Logo" className="mx-auto w-24" />
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
            <button type="submit" className="px-4 py-2 text-white bg-yellow-500 rounded-md" >Sign In</button>
            <Link to="/register" className="text-sm text-blue-500">Create Account</Link>
          </div>
          <div className="text-center">
            <Link to="/forgot-password" className="text-sm text-blue-500">Forgot Password?</Link>
          </div>
          <p ref={errRef} className={errMsg ? 'text-red-500' : 'hidden'} aria-live="assertive">
            {errMsg}
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
