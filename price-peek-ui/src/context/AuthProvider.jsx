import { createContext, useState, useEffect } from'react';
import { getRolesFromToken, getEmailFromToken } from '../utils/auth/auth.util';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

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

    useEffect(() => {
        // Assuming the token is stored in localStorage
        const token = localStorage.getItem('accessToken');
        if (token) {
        //   const roles = getRolesFromToken(token);
            const roles = ['USER'];
            const email = getEmailFromToken(token);
            setAuth({ email, token, roles });
        }
      }, [setAuth]);

    const logout = () => {
        setAuth({});
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
