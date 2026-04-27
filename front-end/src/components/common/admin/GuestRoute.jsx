import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "../Loader";
import { restoreSession } from "../../../features/admin/Login/authSlice";
export const GuestRoute = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { isAuthenticated, loading, forceLoggedOut, initialized } = useSelector((state) => state.auth);

    useEffect(() => {
        // Only run if we haven't initialized and aren't already loading
        console.log("etat ",initialized)
        if (!initialized && !loading) {
            dispatch(restoreSession());
        }
    }, [initialized, loading,dispatch]);

    // Don't show the login page until we know if the user is authenticated or not
    if (!initialized || loading) {
        return <Loader />;
    }

    if (isAuthenticated) {
        const from = location.state?.from?.pathname || "/admin";
        return <Navigate to={from} replace />;
    }

    return <Outlet />;
};