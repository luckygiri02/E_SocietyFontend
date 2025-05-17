// src/components/GoBackButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const GoBackButton = () => {
  const navigate = useNavigate(); // Hook to get the navigate function

  const handleGoBack = () => {
    navigate(-1); // Go back one step in the browser history
  };

  return (
    <button
      onClick={handleGoBack}
      style={{
        padding: '10px 20px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        marginBottom: '20px',
      }}
    >
      Go Back
    </button>
  );
};

export default GoBackButton;
