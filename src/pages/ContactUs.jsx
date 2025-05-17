import React, { useState, useEffect } from "react";
import "./ContactUs.css";

const ContactUs = () => {
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BaseURL_API}/api/items`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        
        const filteredStaff = data.filter(item => 
          item.role && typeof item.role === 'string' && 
          item.role.toLowerCase().includes('staff')
        ).map(member => {
          // Extract the profile photo if it exists
          const profilePhoto = member.documents?.find(doc => doc.name === "Profile Photo");
          return {
            ...member,
            image: profilePhoto?.documentData || null
          };
        });

        setStaffMembers(filteredStaff);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading contact information...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="contact-us">
      <div className="contact-us-header">
        <h1>Contact Society Management</h1>
        <h4>Reach out to your society representatives for any help or queries.</h4>
      </div>
      
      <h2>Our Staff</h2>
      {staffMembers.length > 0 ? (
        <div className="contact-grid">
          {staffMembers.map((member, index) => (
            <div className="contact-card" key={index}>
              <div className="contact-avatar">
                {member.image ? (
                  <img 
                    src={member.image} 
                    alt={member.fullName || member.name} 
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                ) : (
                  <img src="/default-avatar.png" alt="Default avatar" />
                )}
              </div>
              <h3>{member.fullName || member.name}</h3>
              <p><strong>{member.role}</strong></p>
              <p>📞 {member.mobileNumber || 'Not provided'}</p>
              <p>📧 {member.email || 'Not provided'}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No staff members found</p>
      )}
    </div>
  );
};

export default ContactUs;