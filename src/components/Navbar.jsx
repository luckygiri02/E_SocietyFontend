import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import './media.css';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasNewAlert, setHasNewAlert] = useState(true); // Assume true for demo
  const location = useLocation();

  const isActive = (path) => (location.pathname === path ? "active-link" : "");

  // OPTIONAL: Clear red dot when user visits the Alerts page
  useEffect(() => {
    if (location.pathname === "/alerts") {
      setHasNewAlert(false);
    }
  }, [location]);

  return (
    <header className="header sticky-header">
      <div className="logo-section">
        <img src="./logo1.png" alt="Society Logo" className="logo-image" />
        <h1 className="society-name">Society Name</h1>
      </div>

      <div className="menu-section">
        <nav className="nav-links">
          <Link to="/complaint" className={isActive("/complaint")}>
            🛠️ Complaint
          </Link>
          <Link to="/billpay" className={isActive("/billpay")}>
            🧾 Bill Pay
          </Link>
          <Link to="/sell" className={isActive("/rent")}>
            🏠 sell
          </Link>
          <Link to="/events" className={isActive("/events")}>
            📅 Event
          </Link>
        </nav>

        <div className="settings">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="settings-button"
            aria-label="Settings Menu"
          >
            ⚙️ Settings
          </button>
          {dropdownOpen && (
            <div className="dropdown" role="menu">
               <Link to="/account">My Account</Link>
              <Link to="/contact">Contact Us</Link>
             
             

              {/* Alerts link with red dot */}
              <Link to="/alerts" className="alert-link">
                Alerts {hasNewAlert && <span className="red-dot" />}
              </Link>

              <Link to="/visitor-room">Visitor Room</Link>
              <Link to="/about">About Us</Link>
              <Link to="/logout">Logout</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
