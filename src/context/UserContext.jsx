// src/context/UserContext.js
import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const mobile = localStorage.getItem("loggedInMobile");
    if (!mobile) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BaseURL_API}/api/items`);
        const data = await res.json();
        const user = data.find((item) => item.mobileNumber === mobile);
        if (user) setUserData(user);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};
