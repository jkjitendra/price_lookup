import { createContext, useState, useEffect } from'react';
import { useNavigate } from "react-router-dom";
import { getRolesFromToken, getEmailFromToken } from '../utils/auth/auth.util';
import { jwtDecode } from 'jwt-decode'; 
import refreshToken from '../api/refreshToken';

const AuthContext = createContext();

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch (err) {
    console.error('Invalid token:', err);
    return true; // Assume expired if decoding fails
  }
};

export const AuthProvider = ({ children }) => {

  const navigate = useNavigate();

  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // const roles = getRolesFromToken(token);
      const roles = ['USER'];
      const email = getEmailFromToken(token);
      return { email, token, roles };
    }
    return {};
  });

  // useEffect(() => {
  //     // Assuming the token is stored in localStorage
  //   const token = localStorage.getItem('accessToken');
  //   if (token && !isTokenExpired(token)) {
  //   //   const roles = getRolesFromToken(token);
  //     const roles = ['USER'];
  //     const email = getEmailFromToken(token);
  //     setAuth({ email, token, roles });
  //   } else if (token && isTokenExpired(token)) {
  //     console.warn('Token has expired. Clearing tokens.');
  //     localStorage.removeItem('accessToken');
  //     navigate('/login');
  //   } else {
  //     console.info('No token found.');
  //   }
  // }, []);

  useEffect(() => {
    const handleTokenRefresh = async () => {
      const token = localStorage.getItem('accessToken');
      if (token && isTokenExpired(token)) {
        console.warn('Access token expired. Attempting to refresh...');
        try {
          const newToken = await refreshToken(); // Call the refresh token function
          const email = getEmailFromToken(newToken);
          const roles = ['USER'];
          setAuth({ email, token: newToken, roles });
        } catch (err) {
          console.error('Failed to refresh token:', err);
          logout(); // Log the user out if refresh fails
        }
      } else if (!token) {
        console.info('No token found.');
      }
    };

    handleTokenRefresh();
  }, []);

  const logout = (redirectToLogin = true) => {
    setAuth({});
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // document.cookie = "refreshToken=; Max-Age=0; path=/;"; // Clear the refreshToken cookie
    if (redirectToLogin) {
      window.location.href = '/login'; // Redirect user to login page
    }
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout}}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
