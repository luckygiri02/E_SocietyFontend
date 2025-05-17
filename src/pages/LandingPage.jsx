import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import society1 from '../assets/society1.jpg';
import society2 from '../assets/society2.jpg';
import society3 from '../assets/society3.webp';
import demoVideo from '../assets/societyDemo.mp4';

const LandingPage = () => {
  const navigate = useNavigate();

  const handlePost = async () => {
    const newItem = {
      name: "sourabh",
      fullName: "sourabh Suryawanshi",
      mobileNumber: "6261306057",
      email: "sourabh@example.com",
      flatNo: "A-203",
      wingNumber: "Wing A",
      role: "Admin",
      occupation: "Software Developer",
      adharCard: "1234-5678-9012",
      password: "sourabh2303",
      familyMembers: 4,
      documents: ["aadhar.pdf", "pan.pdf"], // You can treat these as file names or URLs
    };
  
    try {
      const response = await fetch(`${import.meta.env.VITE_BaseURL_API}/api/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });
  
      const data = await response.json();
      console.log("Item added successfully:", data);
    } catch (error) {
      console.error("Error while posting item:", error);
    }
  };
  
  return (
    <div className="landing">
      {/* Header */}
      <header className="landing-header">
        <h1 className="logo">🏘️ My Society</h1>
        <nav>
          <button onClick={() => navigate('/rent')}>Rent/Buy</button>
          <button onClick={() => navigate('/about')}>About Us</button>
          <button onClick={() => navigate('/signup')}>Sign Up</button>
          <button onClick={handlePost}>Call API</button>
        </nav>
      </header>

      {/* Hero Section with Animation */}
      <main className="landing-main">
        <h2>Welcome to Our Society</h2>
        <p>Safe, clean, and joyful living</p>

        <div className="image-carousel">
          <img src={society1} alt="Society Event 1" />
          <img src={society2} alt="Society Event 2" />
          <img src={society3} alt="Society Event 3" />
        </div>

        {/* Demo Video Section */}
        <div className="demo-video-section">
          <h3>Watch Our Society Life</h3>
          <video controls className="demo-video">
            <source src={demoVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
