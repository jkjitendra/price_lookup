import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();

    // const userRoles = auth?.roles || [];

    // return (
    //     userRoles.some(role => allowedRoles.includes(role))
    //     ? <Outlet />
    //     : auth?.email
    //         ? <Navigate to="/unauthorized" state={{ from: location }} replace />
    //         : <Navigate to="/login" state={{ from: location }} replace />
    // );
    return (
        auth?.email
        ? <Outlet />
        : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;