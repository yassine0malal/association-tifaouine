
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { restoreSession } from "../../../features/admin/Login/authSlice";
import Loader from "../Loader";

// this page if the user already connected 
export const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const { loading, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(restoreSession());
    }
  }, [dispatch, isAuthenticated]);

  if (loading) return <Loader />;

  if (!isAuthenticated) {
    return <Navigate to="/AdminLogin" replace />;
  }

  return <Outlet/>;
};