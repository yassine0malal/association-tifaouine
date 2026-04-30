import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "../Loader";
import { restoreSession } from "../../../features/admin/Login/authSlice";

export const GuestRoute = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { isAuthenticated, loading, initialized } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!initialized && !loading) {
            dispatch(restoreSession());
        }
    }, [initialized, loading, dispatch]);

    if (!initialized || loading) return <Loader />;

    if (isAuthenticated) {
        const from = location.state?.from?.pathname || "/admin";
        return <Navigate to={from} replace />;
    }

    return <Outlet />;
};