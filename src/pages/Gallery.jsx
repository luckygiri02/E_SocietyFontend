import React from "react";
import "./Gallery.css";

const galleryItems = [
  { title: "Clubhouse", img: "/gallery/clubhouse.jpeg" },
  { title: "Swimming Pool", img: "/gallery/pool.jpeg" },
  { title: "Playground", img: "/gallery/playground.jpeg" },
  { title: "Garden Area", img: "/gallery/garden.jpg" },
  { title: "Main Building", img: "/gallery/buildings.webp" },
  { title: "Gym", img: "/gallery/gym.jpeg" },
];

const Gallery = () => {
  return (
    <div className="gallery-container">
      {/* Hero / Banner */}
      <header className="gallery-banner">
        <h1>Society Gallery</h1>
        <p>Explore our beautiful surroundings and amenities</p>
      </header>

      {/* Grid Section */}
      <section className="gallery-grid">
        {galleryItems.map((item, index) => (
          <div key={index} className="gallery-card">
            <img src={item.img} alt={item.title} />
            <h3>{item.title}</h3>
          </div>
        ))}
      </section>

      {/* Optional About Section */}
      <section className="about-section">
        <div className="about-box">
          <h2>About Our Society</h2>
          <p>
            Our society offers modern living with thoughtfully planned amenities
            including a gym, clubhouse, swimming pool, lush gardens, and secure
            surroundings. Perfect for families seeking comfort and community.
          </p>
          
        </div>
      </section>

      {/* Optional Testimonials Section */}
      <section className="testimonial-section">
        <h2>What Our Residents Say</h2>
        <div className="testimonial-box">
          <p>"Great environment and friendly neighbors. My kids love the playground!"</p>
          <span>– Priya Sharma</span>
        </div>
        <div className="testimonial-box">
          <p>"Secure and clean with all amenities. The clubhouse is my favorite!"</p>
          <span>– Raj Mehta</span>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
