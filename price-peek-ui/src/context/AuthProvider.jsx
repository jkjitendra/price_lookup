import { createContext, useState, useEffect } from'react';
import { getRolesFromToken } from '../utils/auth/auth.util';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            // const roles = getRolesFromToken(token);
            const roles = ['USER'];
            return { token, roles };
        }
        return {};
    });

    useEffect(() => {
        // Assuming the token is stored in localStorage
        const token = localStorage.getItem('accessToken');
        if (token) {
        //   const roles = getRolesFromToken(token);
            const roles = ['USER'];
            setAuth({ token, roles });
        }
      }, []);

    const logout = () => {
        setAuth({});
        localStorage.removeItem('accessToken');
        
        // Remove cookies or tokens here if necessary
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
