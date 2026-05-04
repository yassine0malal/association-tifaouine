
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { restoreSession } from "../../../features/admin/Login/authSlice";
import Loader from "../Loader";

// this page if the user already connected 
export const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const location = useLocation()
  const { loading, isAuthenticated } = useSelector((state) => state.auth);
  // console.log("location")
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(restoreSession());
    }
  }, [dispatch, isAuthenticated]);

  if (loading) return <Loader />;

  if (!isAuthenticated) {
    return <Navigate to="/adminLogin" state={{ from: location }} replace />;
  }

  return <Outlet />;
};