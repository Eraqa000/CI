import {Navigate, Outlet} from "react-router-dom";
import { getAuthFromStorage } from "../api/auth";

export default function AdminRoute() {
    const { token, user } = getAuthFromStorage();

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    const isAdmin =
        user.role === "admin" ||
        user.status === "admin";

    if(!isAdmin) {
        return <Navigate to="/" replace />;
    }
    

    return <Outlet />;
}