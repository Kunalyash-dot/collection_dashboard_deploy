import React from "react";
import { Navigate, useParams} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
// import { useSelector } from "react-redux";

 const ProtectedRoute = ({ component: Component, roles, ...rest }) => {
  const token = localStorage.getItem("accessToken");
// console.log(token)
  // Decode token and get user info
  const user = token ? jwtDecode(token) : null;
  // console.log(user)
const params = useParams()
  // If the user is not logged in, redirect to the login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  console.log(user.id)
  console.log(user)
   // Check if user's role matches and, if role is Manager/Employee, ensure ID matches
   if (
    roles &&
    !roles.includes(user.role) &&
    (user.role === "Manager" || user.role === "Employee") &&
    user.id !== params.id
  ) {
    return <Navigate to="/unauthorized" />;
  }
console.log(Component)
  // If authorized, render the component
  return <Component {...rest} />;
};

export default ProtectedRoute;