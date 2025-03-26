import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
// import api from '../api/query';

// const LOGOUT_URL = "/logout";

const Logout = ({ onBeforeLogout }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    // const { setLoading } = useContext(LoadingContext);

    const handleLogout = async () => {        
        if (onBeforeLogout) onBeforeLogout(); // trigger menu close before confirmation

        // Delay the confirm so the menu closes first
        setTimeout(async () => {
            const userConfirmed = window.confirm('Are you sure you want to logout?');
        
            if (userConfirmed) {
                // setLoading(true);
                try {
                    // Call the backend to clear the HttpOnly cookie
                    // await api.post(LOGOUT_URL);

                    // Clear any client-side authentication state
                    logout();
                    
                    navigate('/login');
                } catch (error) {
                    console.error('Error logging out', error);
                } finally {
                    // setLoading(false);
                }
            }
        }, 100);
    };

    return (
        <button onClick={handleLogout} className='logout-btn'>Logout</button>
    );
};

// const Logout = () => (
//     <LoadingProvider>
//         <LogoutContent />
//     </LoadingProvider>
// );

export default Logout;
