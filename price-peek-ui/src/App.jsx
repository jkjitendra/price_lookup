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
import Dashboard from './components/Dashboard';
import ProductLists from './components/ProductLists';
import ProductDetails from './components/ProductDetails';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />} >
        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />
        <Route path="register" element={<Register />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* protected routes */}
        <Route element={<RequireAuth allowedRoles={['USER']} />}>
          <Route path="/" element={<Home />} />
          <Route path="productlists" element={<ProductLists />} />
          <Route path="productdetails" element={<ProductDetails />} />
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
