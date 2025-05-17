import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import "./PropertyDetails.css";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BaseURL_API}/api/properties/id/${id}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setProperty(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProperty();
  }, [id]);

  if (!property) return <p>Loading...</p>;

  return (
    <div className="property-details-page">
      <h2>{property.title || "Property Details"}</h2>
      <p><strong>Owner:</strong> {property.userName}</p>
      <p><strong>Mobile:</strong> {property.mobileNumber}</p>
      <p><strong>Price:</strong> {property.price}</p>
      <p><strong>Flat No:</strong> {property.flatNo}, Wing {property.wing}</p>
      <p><strong>Visit Time:</strong> {property.visitTime}</p>

      <div className="images-section">
        {property.images?.map((img, index) => (
          <img key={index} src={img} alt={`Flat ${index}`} />
        ))}
      </div>

      <div className="videos-section">
        {property.videos?.map((video, index) => (
          <video key={index} controls width="100%">
            <source src={video} type="video/mp4" />
          </video>
        ))}
      </div>
    </div>
  );
};

export default PropertyDetails;