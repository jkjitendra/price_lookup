import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
      navigate('/login');
    };
  
    const handleRegisterClick = () => {
      navigate('/register');
    };

    return (
        <div className='flex flex-col items-center h-screen p-4'>
          <div className='flex justify-between w-full mb-4'>
            <button className='btn' onClick={handleLoginClick}>
              Login
            </button>
            <button className='btn' onClick={handleRegisterClick}>
              Register
            </button>
          </div>
    
        </div>
      );
}

export default Dashboard;
