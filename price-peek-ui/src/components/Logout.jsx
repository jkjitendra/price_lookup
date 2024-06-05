import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import axios from "../api/query";

const LOGOUT_URL = "/api/v1/auth/logout";


const Logout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Call the backend to clear the HttpOnly cookie
            // await axios.post(LOGOUT_URL);

            // Clear any client-side authentication state
            logout();

            // Redirect to the login page
            navigate('/login');
        } catch (error) {
            console.error('Error logging out', error);
        }
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default Logout;
