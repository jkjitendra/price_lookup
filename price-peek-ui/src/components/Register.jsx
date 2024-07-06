import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/images/PricePeek.png';
import axios from "../api/query";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGISTER_URL = "/signup";
const GENERATE_OTP_URL = '/generate-otp';

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();

  const [name, setName] = useState('');

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [confirmPwd, setConfirmPwd] = useState('');
  const [validConfirmPwd, setValidConfirmPwd] = useState(false);
  const [confirmPwdFocus, setConfirmPwdFocus] = useState(false);
  
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    setValidPwd(result);
    const match = pwd === confirmPwd;
    setValidConfirmPwd(match);
  }, [pwd, confirmPwd]);

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    setErrMsg('');
  }, [ pwd, confirmPwd, email]);

  const handleRegister = async (e) => {
    e.preventDefault();
    const validPwdMatch = PWD_REGEX.test(pwd);
    const validEmailMatch = EMAIL_REGEX.test(email);
    if (!validPwdMatch || !validEmailMatch) {
      setErrMsg('Please enter valid information in all fields');
      return;
    }

    try {
      const response = await axios.post(REGISTER_URL, 
        JSON.stringify({ name, email, password: pwd }),
        { headers: { 'Content-Type': 'application/json' } }
      );
      // setSuccess(true);
      if (response.data.success) {
        // Call the generate-otp endpoint
        await axios.post(GENERATE_OTP_URL, JSON.stringify({ email }), {
          headers: { 'Content-Type': 'application/json' },
        });
        navigate('/verify-otp', { state: { email } });
      } else {
        setErrMsg("Registration Failed!");
      }
    } catch (error) {
      if (!error.response) {
        setErrMsg("No Server Response");
      } else if (error.response?.status === 409) {
        setErrMsg("Email already in use");
      } else if (error.response?.status === 404) {
        const specificMsg = error.response?.data?.message?.split(':')[0];
        setErrMsg(specificMsg);
      } else if (error.response?.status === 422) {
        const emailErrors = error.response?.data?.errors?.email || [];
        console.log(emailErrors);
        if (emailErrors[0] === 'The email has already been taken.') {
          setErrMsg("Email already in use!");
        } else {
          setErrMsg("Registration Failed!");
        }
      } else {
        setErrMsg("Registration Failed!");
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      <section className="flex items-center justify-center min-h-screen bg-blue-600">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-[50px] shadow-[10px_10px_35px_#FEC924]">
          <img src={logo} alt="Logo" className="mx-auto w-16" />
          <form className="space-y-4" onSubmit={handleRegister}>
            <p ref={errRef} className={errMsg ? 'text-red-500' : 'hidden'} aria-live="assertive">
              {errMsg}
            </p>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-invalid={validEmail ? "false" : "true"}
                aria-describedby="emailNote"
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
                className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <p id="emailNote" className={emailFocus && email && !validEmail ? 'text-red-500' : 'hidden'}>
                Please enter a valid email address.
              </p>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                required
                aria-invalid={validPwd ? "false" : "true"}
                aria-describedby="pwdNote"
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
                className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <p id="pwdNote" className={pwdFocus && !validPwd ? 'text-red-500' : 'hidden'}>
                8 to 24 characters. Must include uppercase and lowercase letters, a number and a special character.
              </p>
            </div>
            <div>
              <label htmlFor="confirm_pwd" className="block text-sm font-medium text-gray-700">Retype Password</label>
              <input
                type="password"
                id="confirm_pwd"
                onChange={(e) => setConfirmPwd(e.target.value)}
                required
                aria-invalid={validConfirmPwd ? "false" : "true"}
                aria-describedby="confirmNote"
                onFocus={() => setConfirmPwdFocus(true)}
                onBlur={() => setConfirmPwdFocus(false)}
                className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <p id="confirmNote" className={confirmPwdFocus && !validConfirmPwd ? 'text-red-500' : 'hidden'}>
                Passwords do not match.
              </p>
            </div>
            <button
              disabled={!validEmail || !validPwd || !validConfirmPwd}
              className="w-full px-4 py-2 text-white bg-yellow-500 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sign Up
            </button>
          </form>
          <p className="text-center">
            Already registered? <Link to="/login" className="text-blue-500">Sign In</Link>
          </p>
        </div>
      </section>
    </>
  );
}

export default Register;
