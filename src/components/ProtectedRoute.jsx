import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem("loggedInMobile");

  if (!isLoggedIn) {
    return <Navigate to="/" replace />; // Redirect to Signup if not logged in
  }

  return children;
};

export default ProtectedRoute;
