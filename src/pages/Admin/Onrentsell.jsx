import React, { useEffect, useState } from "react";
import "../FlatCard.css"; 
const Onrentsell = () => {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const fetchProperties = async () => {
    const mobileNumber = localStorage.getItem("loggedInMobile");
    if (!mobileNumber) {
      setError("Mobile number not found");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BaseURL_API}/api/properties`);
      if (!response.ok) throw new Error("Failed to fetch properties");

      const data = await response.json();

      const processed = data.properties.map((p) => ({
        ...p,
        imageUrls: p.images?.map((_, index) =>
          `${import.meta.env.VITE_BaseURL_API}/api/properties/media/${p._id}/image/${index}?${Date.now()}`
        ),
        videoUrls: p.videos?.map((_, index) =>
          `${import.meta.env.VITE_BaseURL_API}/api/properties/media/${p._id}/video/${index}?${Date.now()}`
        ),
        thumbnailUrl: p.images?.length > 0
          ? `${import.meta.env.VITE_BaseURL_API}/api/properties/media/${p._id}/image/0?${Date.now()}`
          : "/placeholder-property.jpg"
      }));

      setProperties(processed);
      setError(null);
    } catch (err) {
      setError("Failed to fetch properties.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
  };

  const closePopup = () => {
    setSelectedProperty(null);
  };

  return (
    <section className="property-list my-properties-section">
      <h2>Available Properties</h2>

      {loading && <p className="loading-spinner">Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && properties.length === 0 && (
        <div className="no-properties">
          <p>No properties found.</p>
        </div>
      )}

      <div className="property-grid">
        {properties.map((property) => (
          <div
            key={property._id}
            className="property-card"
            onClick={() => handlePropertyClick(property)}
          >
            <div className="property-image-container">
              <img
                src={property.thumbnailUrl}
                alt="Property"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder-property.jpg";
                }}
              />
              <div className="media-badges">
                {property.imageUrls?.length > 0 && (
                  <span className="image-badge">
                    {property.imageUrls.length} Image{property.imageUrls.length > 1 ? "s" : ""}
                  </span>
                )}
                {property.videoUrls?.length > 0 && (
                  <span className="video-badge">
                    {property.videoUrls.length} Video{property.videoUrls.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
            <div className="property-details">
              <h3>{property.type || "Property"}</h3>
              <p><strong>Price:</strong> ₹{property.price}</p>
              <p><strong>Location:</strong> {property.wing} - {property.flatNo}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal to show selected property details */}
      {selectedProperty && (
        <div className="property-popup">
          <div className="popup-content">
            <span className="close-popup" onClick={closePopup}>&times;</span>

            <h3>{selectedProperty.type || "Property"}</h3>
            <p><strong>Price:</strong> ₹{selectedProperty.price}</p>
            <p><strong>Location:</strong> {selectedProperty.wing} - {selectedProperty.flatNo}</p>
            <p><strong>Posted By:</strong> {selectedProperty.userName}</p>
            <p><strong>Contact:</strong> {selectedProperty.mobileNumber}</p>
            <p><strong>Eligibility:</strong> {selectedProperty.eligibility}</p>
            <p><strong>Visit Time:</strong> {selectedProperty.visitTime}</p>
            <p><strong>Description:</strong> {selectedProperty.description || "No description available."}</p>

            {selectedProperty.imageUrls?.length > 0 && (
              <div className="popup-images">
                <img 
                  src={selectedProperty.imageUrls[0]} 
                  alt={`Property image 1`} 
                />
                <div className="media-badges">
                  <span className="image-badge">
                    {selectedProperty.imageUrls.length} Image{selectedProperty.imageUrls.length > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            )}

            {selectedProperty.videoUrls?.length > 0 && (
              <div className="popup-videos">
                {selectedProperty.videoUrls.map((url, index) => (
                  <video key={index} controls>
                    <source src={url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Onrentsell;
