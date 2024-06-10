import { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import {Link, useNavigate, useLocation} from "react-router-dom";
import { getEmailFromToken } from "../utils/auth/auth.util";
import axios from "../api/query";

const LOGIN_URL = "/login";

const Login = () => {

    const { setAuth } = useAuth();

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

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log(email, pwd);

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({email, password: pwd}),
                {
                    headers: { 'Content-Type': 'application/json' },
                    // withCredentials: true
                }
            );
            console.log('new response', response.data.token);
            if (response?.data) {
                console.log('response', response.data.token);
                const accessToken = response.data.token;
                const refreshToken = response.data.refresh_token;
                // Decode roles, email from token
                // const roles = getRolesFromToken(accessToken);
                const email = getEmailFromToken(accessToken);
                console.log("email val : ", email);
                setAuth({ email, accessToken, roles: ["USER"] });

                // Store token in localStorage
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                setEmail('');
                setPwd('');
                // navigate(from, { replace: true });
                navigate('/home', { replace: true });
              } else {
                throw new Error('No data in response');
              }
            // setAuth(email, pwd, accessToken);

            // setEmail('');
            // setPwd('');
            // navigate(from, {replace: true});
        } catch (err) {
            if (!err.response) {
                console.log('No response', err);
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
    <>
        <section>
            <p
            ref={errRef}
            className={errMsg ? 'errmsg' : 'offscreen'}
            aria-live="assertive"
            >
                {errMsg}
            </p>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <label htmlFor="login-email">
                    Email
                </label>
                <input
                type="email"
                id="login-email"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                />

                <label htmlFor="login-password">
                    Password
                </label>
                <input
                type="password"
                id="login-password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
                />
                <button>Login</button>
            </form>
            <div className="form-footer">
                <p>
                    Create an account<br />
                    <span className="line">
                    <Link to="/register">Sign Up</Link>
                    </span>
                </p>
                <p>
                    <br />
                    <span className="line">
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </span>
                </p>
            </div>
        
        </section>
    </>
  )
}

export default Login;
