import React, { useEffect, useState } from "react";
import "./SellPage.css";
import { Link } from "react-router-dom";

const SellPage = () => {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // ✅ Fetch all properties from backend
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BaseURL_API}/api/properties`);
      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }

      const data = await response.json();

      // Add media URLs
      const propertiesWithMedia = data.properties.map(property => ({
        ...property,
        imageUrls: property.images?.map((_, index) =>
          `${import.meta.env.VITE_BaseURL_API}/api/properties/media/${property._id}/image/${index}?${Date.now()}`
        ),
        videoUrls: property.videos?.map((_, index) =>
          `${import.meta.env.VITE_BaseURL_API}/api/properties/media/${property._id}/video/${index}?${Date.now()}`
        ),
        thumbnailUrl: property.images?.length > 0
          ? `${import.meta.env.VITE_BaseURL_API}/api/properties/media/${property._id}/image/0?${Date.now()}`
          : '/placeholder-property.jpg'
      }));

      setProperties(propertiesWithMedia);
      setError(null);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setError("Failed to fetch properties. Please try again.");
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

  const closeDetails = () => {
    setSelectedProperty(null);
  };

  return (
    <div className="sell-page">
      <section className="hero">
        <h1>STYLISH PROPERTIES IN PRIME LOCATIONS</h1>
        <p>Explore trusted property listings to simplify your selling experience.</p>
        <Link to="/add-property">
          <button className="cta-button">SELL YOUR PROPERTY</button>
        </Link>
      </section>

      <section className="property-list">
        <h2>All Properties</h2>

        {loading && <div className="loading-spinner">Loading properties...</div>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          properties.length > 0 ? (
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
                        e.target.src = '/placeholder-property.jpg';
                      }}
                    />
                    <div className="media-badges">
                      {property.imageUrls?.length > 0 && (
                        <span className="image-badge">
                          {property.imageUrls.length} {property.imageUrls.length === 1 ? 'Image' : 'Images'}
                        </span>
                      )}
                      {property.videoUrls?.length > 0 && (
                        <span className="video-badge">
                          {property.videoUrls.length} {property.videoUrls.length === 1 ? 'Video' : 'Videos'}
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
          ) : (
            <div className="no-properties">
              <p>No properties found.</p>
              <Link to="/add-property">
                <button className="cta-button">Add Your First Property</button>
              </Link>
            </div>
          )
        )}
      </section>

      {/* Property Details Modal */}
      {selectedProperty && (
        <div className="property-modal">
          <div className="modal-content">
            <button className="close-button" onClick={closeDetails}>×</button>
            
            <h2>{selectedProperty.wing} - {selectedProperty.flatNo}</h2>
            <p><strong>Type:</strong> {selectedProperty.type}</p>
            <p><strong>Price:</strong> ₹{selectedProperty.price}</p>
            <p><strong>Contact:</strong> {selectedProperty.mobileNumber}</p>
            {selectedProperty.eligibility && <p><strong>Eligibility:</strong> {selectedProperty.eligibility}</p>}
            {selectedProperty.visitTime && <p><strong>Visit Time:</strong> {selectedProperty.visitTime}</p>}

            {/* Images Section */}
            {selectedProperty.imageUrls?.length > 0 && (
              <div className="media-section">
                <h3>Images</h3>
                <div className="media-grid">
                  {selectedProperty.imageUrls.map((url, index) => (
                    <div key={`img-${index}`} className="media-item">
                      <img 
                        src={url} 
                        alt={`Property ${index}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos Section */}
            {selectedProperty.videoUrls?.length > 0 && (
              <div className="media-section">
                <h3>Videos</h3>
                <div className="media-grid">
                  {selectedProperty.videoUrls.map((url, index) => (
                    <div key={`vid-${index}`} className="media-item">
                      <video controls>
                        <source src={url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SellPage;
