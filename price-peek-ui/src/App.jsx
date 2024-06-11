import React, { useEffect } from'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Register from './components/Register';
import Login from "./components/Login";
import Logout from './components/Logout';
import Layout from './components/Layout';
import Unauthorized from './components/Unauthorized';
import RequireAuth from './components/RequireAuth';
import Home from './components/Home';
import Admin from './components/Admin';
import Missing from './components/Missing';
import { Routes, Route } from 'react-router-dom';
import ForgotPassword from './components/ForgotPassword';

function App() {

  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect from /index.html to /login if needed
    if (location.pathname === '/index.html' || location.pathname === '/index.html/') {
      navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  console.log("existing route",  location);
  return (
    <Routes>
      <Route path="/" element={<Layout />} >
        {/* public routes */}
        <Route path="" element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* protected routes */}
        <Route element={<RequireAuth allowedRoles={['USER']} />}>
          <Route path="home" element={<Home />} />
          {/* Commented out below as Home component is handling below routes */}
          {/* <Route path="productslist" element={<ProductsList />} />
          <Route path="addproduct" element={<AddProduct />} /> */}
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
