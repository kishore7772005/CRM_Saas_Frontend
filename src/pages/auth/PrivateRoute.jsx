import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = ({ permission }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  //  Not logged in
  if (!token || !userData) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  try {
    const user = JSON.parse(userData);

    //  Invalid user object
    if (!user || !user.role) {
      throw new Error("Invalid user");
    }

    //  Admin full access
    if (user.role.name === "Admin") {
      return <Outlet />;
    }

    //  Permission check
    if (permission && !user.role.permissions?.[permission]) {
      return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
  } catch (err) {
    localStorage.clear();
    return <Navigate to="/" replace />;
  }
};

export default PrivateRoute;