import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ element }) => {
    const user = useSelector((state) => state.auth.user);
    const token = localStorage.getItem("token");

    // If user is undefined, remove the token from localStorage
    if (!user) {
        localStorage.removeItem("token");
    }

    return user ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
