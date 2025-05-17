// src/pages/Logout.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear auth data or tokens here
    localStorage.clear(); // or your auth context
    navigate('/');  // redirect to Signup or Home page
  }, [navigate]);

  return null; // or a spinner/loading message
};

export default Logout;
