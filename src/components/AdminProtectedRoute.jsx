import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const mobile = localStorage.getItem("loggedInMobile");
      if (!mobile) return;

      try {
        const res = await fetch(`${import.meta.env.VITE_BaseURL_API}/api/items`);
        const data = await res.json();
        const foundUser = data.find((u) => u.mobileNumber === mobile);
        setUser(foundUser);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  if (user === null) return null; // loading state

  if (user.role?.toLowerCase() !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
