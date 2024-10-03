import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { auth } = useContext(AuthContext);

    // Check if the user is authenticated
    try
    {if (!auth.isAuthenticated) {
        return <Navigate to="/login" />;
    }
    }catch{
        console.log("error");
    }

    // Check if the user has the required role
    if (requiredRole && auth.userRole !== requiredRole) {
        return <Navigate to="/" />; // Redirect to home or any other page
    }

    return children;
};

export default ProtectedRoute;
