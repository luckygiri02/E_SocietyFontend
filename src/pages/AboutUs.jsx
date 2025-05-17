import React from 'react';
import './AboutUs.css';
import '../components/media.css';

const AboutUs = () => {
  return (
    <section className="about-container">
      <div className="about-header">
        <h1>About Our Society</h1>
        <p>Discover who we are, our vision, and the people behind the development.</p>
      </div>

      <div className="about-section">
        <h2>👷 Developed By</h2>
        <p>
          <strong>Manhorram Builders Pvt. Ltd.</strong> – A reputed construction firm known for quality
          and trust. With 25+ years of experience, Manhorram Builders have delivered premium residential
          projects across the city.
        </p>

        <h2>🏢 Top Pillars of Our Organization</h2>
  <div className="pillars-grid">
    <div className="pillar-card">
      
      <h3>Mr. Lucky giri</h3>
      <p className="role">Founder & CEO</p>
      <p className="bio">Guiding the society’s vision and mission since inception.</p>
    </div>
    <div className="pillar-card">
    
      <h3>Mr. Mayank Jharbade</h3>
      <p className="role">Vice President</p>
      <p className="bio">Managing operations and strategic planning.</p>
    </div>
    <div className="pillar-card">
      
      <h3>Mr. Mohit Yadav</h3>
      <p className="role">General Manager</p>
      <p className="bio">Handles day-to-day affairs of the society and administration.</p>
    </div>
    <div className="pillar-card">
  
  <h3>Ms. Himanshi Patiadr</h3>
  <p className="role">Director of Community Relations</p>
  <p className="bio">Focused on resident engagement, events, and communication.</p>
</div>
  </div>
      </div>

      <div className="about-section">
        <h2>🏡 Society Overview</h2>
        <ul>
          <li><strong>Buildings:</strong> 7 Residential Towers (A to G)</li>
          <li><strong>Total Flats:</strong> 560</li>
          <li><strong>Gardens:</strong> 3 Large Landscaped Gardens</li>
          <li><strong>Play Area:</strong> 1 Kids Play Zone</li>
          <li><strong>Clubhouse:</strong> Equipped with Gym, Hall & Indoor Games</li>
          <li><strong>Parking:</strong> 2-Level Basement Parking</li>
          <li><strong>Security:</strong> 24/7 CCTV Surveillance & Guards</li>
        </ul>
      </div>

      <div className="about-section">
        <h2>🎯 Our Mission</h2>
        <p>To maintain a clean, green, safe, and vibrant community that offers a high quality of life for all residents.</p>
      </div>

      <div className="about-section">
        <h2>🌟 Vision</h2>
        <p>To be a model residential society admired for its sustainable living and community engagement.</p>
      </div>
    </section>
  );
};

export default AboutUs;
