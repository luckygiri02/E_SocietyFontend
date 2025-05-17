// src/pages/User/RentPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./RentPage.css";
import FlatCard from "./FlatCard.jsx";

import image1 from "../assets/rentphoto/image1.jpeg";
import image2 from "../assets/rentphoto/image2.jpeg";
import image3 from "../assets/rentphoto/image3.jpeg";
import image4 from "../assets/rentphoto/image4.jpeg";

const RentPage = () => {
  return (
    <div className="rent-page">
      {/* Header Section */}
      <header className="rent-header">
        <div className="logo">
          <div className="logo-section">
            <img src="/logo1.png" alt="Society Logo" className="logo-image" />
          </div>
          <span> Society Name</span>
        </div>
        <nav>
          <Link to="/about">Info</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/Contact">Contact</Link>
          <Link to="/faq">FAQ</Link>
        </nav>
      </header>

      {/* Content Section */}
      <div className="rent-content">
        <div className="text-section">
          <h4>SPECIAL OFFER</h4>
          <h1>
            FAMILY <br /> HOUSE <br /> FOR RENT
          </h1>
          <p>
            Welcome to the Society Rent Portal! <br />
            Here, you can easily explore and manage available flats for rent
            within the society.
          </p>

          <div className="icons">
            <div className="icon-block">📍 Indore</div>
          </div>
        </div>

        <div className="image-section">
          <div className="carousel">
            <div className="carousel-item">
              <img src={image2} alt="Slide 1" />
            </div>
            <div className="carousel-item">
              <img src={image3} alt="Slide 2" />
            </div>
            <div className="carousel-item">
              <img src={image4} alt="Slide 3" />
            </div>
            <div className="carousel-item">
              <img src={image1} alt="Slide 4" />
            </div>
          </div>
        </div>
      </div>

      <div className="sellbutton">
        <h3>Looking to Explore Available Listings?</h3>
      </div>

      {/* Available Flats Section */}
      <div className="flat-listing-section">
        <h2>Available Flats for Rent</h2>
        <div className="flat-cards-container">
          <FlatCard />
          {/* Add more FlatCard components if needed */}
        </div>
      </div>

      {/* Footer Section */}
      <footer className="rent-footer">
        <span>📞 0731 458001</span>
        <div className="footer-icons">● ● ● ●</div>
      </footer>
    </div>
  );
};

export default RentPage;
