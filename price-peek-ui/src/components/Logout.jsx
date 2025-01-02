import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingContext from '../context/LoadingContext';
// import api from '../api/query';

// const LOGOUT_URL = "/logout";

const Logout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { setLoading } = useContext(LoadingContext);

    const handleLogout = async () => {        
        const userConfirmed = window.confirm('Are you sure you want to logout?');
        
        if (userConfirmed) {
            setLoading(true);
            try {
                // Call the backend to clear the HttpOnly cookie
                // await api.post(LOGOUT_URL);

                // Clear any client-side authentication state
                logout();
                
                navigate('/login');
            } catch (error) {
                console.error('Error logging out', error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <button onClick={handleLogout} className='logout-btn'>Logout</button>
    );
};

export default Logout;
