import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute() {
  let auth = { token: false };
  return auth.token ? <Outlet /> : <Navigate to="/register" />;
}

export default PrivateRoute;
