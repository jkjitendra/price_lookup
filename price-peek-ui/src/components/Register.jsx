import { useRef, useState, useEffect } from "react";
import {faCheck, faTimes, faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../api/query";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGISTER_URL = "/price-peek/signup";

const Register = () => {

    const userRef = useRef();
    const errRef = useRef();

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
        // console.log(result);
        // console.log(pwd);
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
        //if button enabled through javascript
        const validPwdMatch = PWD_REGEX.test(pwd);
        const validEmailMatch = EMAIL_REGEX.test(email);
        if (!validPwdMatch || !validEmailMatch) {
            setErrMsg('Please enter valid information in all fields');
            return;
        }
        
        try {
            const response = await axios.post(REGISTER_URL, 
                JSON.stringify({
                name, email, password: pwd
            }),
            {
                headers: { 'Content-Type': 'application/json' },
                // withCredentials: true
            });
            console.log(response.data);
            setSuccess(true);

        } catch (error) {
            if (!error.response) {
                setErrMsg("No Server Response");
                return;
            } else if (error.response?.status === 409) {
                setErrMsg("email already in use");
                return;
            } else if (error.response?.status === 404) {
                const specificMsg = error.response?.data?.message?.split(':')[0];
                setErrMsg(specificMsg);
            } else {
                setErrMsg("Registration Failed");
            }
            errRef.current.focus();
        }
    };
    
    return (
        <>
            { success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <a href="/login"> Sign In</a>
                    </p>
                </section>
                ) : (
                    <section>
                        <p
                        ref={errRef}
                        className={errMsg ? 'errmsg' : 'offscreen'}
                        aria-live="assertive"
                        >
                            {errMsg}
                        </p>
                        <h1>Register</h1>
                        <form onSubmit={handleRegister}>
                            <label htmlFor="name">
                                Name:
                            </label>
                            <input
                              type="text"
                              id="name"
                              ref={userRef}
                              autoComplete="off"
                              onChange={(e) => setName(e.target.value)}
                              required
                            />

                            <label htmlFor="email">
                                Email:
                                <span className={validEmail ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>
                                <span className={validEmail || !email ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>
                            </label>
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
                            />
                            <p
                              id="emailNote"
                              className={emailFocus && email && !validEmail ? 'instructions' : 'offscreen'}
                            >
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Please enter a valid email address.
                            </p>

                            <label htmlFor="password">
                                Password:
                                <span className={validPwd ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>
                                <span className={validPwd || !pwd ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>
                            </label>
                            <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdNote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                            />
                            <p
                            id="pwdNote"
                            className={pwdFocus && !validPwd ? 'instructions' : 'offscreen'}
                            >
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span><span aria-label="exclamation mark">!</span><span aria-label="at symbol">@</span>
                            <span aria-label="hashtag">#</span><span aria-label="dollar sign">$</span><span aria-label="percent">%</span>
                            </p>

                            <label htmlFor="confirm_pwd">
                                Retype Password:
                                <span className={validConfirmPwd && confirmPwd ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>
                                <span className={validConfirmPwd || !confirmPwd ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>
                            </label>
                            <input
                            type="password"
                            id="confirm_pwd"
                            onChange={(e) => setConfirmPwd(e.target.value)}
                            required
                            aria-invalid={validConfirmPwd ? "false" : "true"}
                            aria-describedby="confirmNote"
                            onFocus={() => setConfirmPwdFocus(true)}
                            onBlur={() => setConfirmPwdFocus(false)}
                            />
                            <p
                            id="confirmNote"
                            className={confirmPwdFocus && !validConfirmPwd ? 'instructions' : 'offscreen'}
                            >
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Passwords do not match
                            </p>

                            <button disabled={!validEmail || !validPwd || !validConfirmPwd ? true : false}>Sign Up</button>
                        </form>
                        <p>
                            Already registered?<br />
                            <span className="line">
                                {<a href="/login" >Sign In</a>}
                            </span>
                        </p>
                    </section>
                )
            }
        </>
    );
}

export default Register;