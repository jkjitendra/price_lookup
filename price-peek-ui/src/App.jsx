import { useEffect, useContext } from'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Register from './components/Register';
import Loading from './components/Loading';
import Login from "./components/Login";
import Logout from './components/Logout';
import Layout from './components/Layout';
import Unauthorized from './components/Unauthorized';
import RequireAuth from './components/RequireAuth';
import Home from './components/Home';
import Admin from './components/Admin';
import AuthContext from './context/AuthProvider';
import Missing from './components/Missing';
import { Routes, Route } from 'react-router-dom';
import ForgotPassword from './components/ForgotPassword';
import VerifyOTP from './components/VerifyOTP';

function App() {

  const location = useLocation();
  const navigate = useNavigate();
  const { loading } = useContext(AuthContext);
  
  useEffect(() => {
    // Redirect from /index.html to /login if needed
    if (location.pathname === '/index.html' || location.pathname === '/index.html/') {
      navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />} >
        {/* public routes */}
        <Route path="" element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="verify-otp" element={<VerifyOTP />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* protected routes */}
        <Route element={<RequireAuth allowedRoles={['USER']} />}>
          <Route path="home" element={<Home />} />
        </Route>
        <Route  element={<RequireAuth allowedRoles={['ADMIN']} />}>
          <Route path="admin" element={<Admin />} />
        </Route>

        {/* catch all other routes */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
