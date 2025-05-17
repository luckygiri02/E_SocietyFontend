import React, { useState, useEffect } from "react";
import './VisitorManagement.css';

const PropertyListingsAdmin = () => {
  const [visitors, setVisitors] = useState([]);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BaseURL_API}/api/items`);
      const data = await res.json();
      // Filter users with role "Visitor" (case insensitive)
      const visitorList = data.filter(user => 
        user.role && user.role.toLowerCase() === "visitor"
      );
      setVisitors(visitorList);
    } catch (err) {
      console.error("Error fetching visitors", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredVisitors = visitors.filter(visitor => 
    visitor.mobileNumber?.includes(searchTerm) ||
    visitor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.flatNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="visitor-management-container">
      <div className="visitor-list-panel">
        <h2>Visitor Management</h2>
        
        <div className="search-controls">
          <input
            type="text"
            placeholder="Search visitors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={fetchVisitors} className="refresh-btn">
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="loading-indicator">Loading visitors...</div>
        ) : filteredVisitors.length === 0 ? (
          <div className="empty-state">No visitors found</div>
        ) : (
          <div className="visitors-grid">
            {filteredVisitors.map(visitor => (
              <div 
                key={visitor._id} 
                className={`visitor-card ${selectedVisitor?._id === visitor._id ? 'selected' : ''}`}
                onClick={() => setSelectedVisitor(visitor)}
              >
                <div className="visitor-avatar">
                  {visitor.documents?.length > 0 ? (
                    <img 
                      src={visitor.documents[0].documentData} 
                      alt="Visitor" 
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      {visitor.name?.charAt(0) || 'V'}
                    </div>
                  )}
                </div>
                <div className="visitor-info">
                  <h4>{visitor.fullName || 'No Name'}</h4>
                  <p>Mobile: {visitor.mobileNumber || 'N/A'}</p>
                  <p>Visiting: {visitor.flatNo || 'N/A'}</p>
                  <p>Visit Time: {formatDate(visitor.visittime)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="visitor-detail-panel">
        {selectedVisitor ? (
          <>
            <h2>Visitor Details</h2>
            <div className="detail-section">
              <h3>Basic Information</h3>
              <div className="detail-row">
                <span className="detail-label">Full Name:</span>
                <span className="detail-value">{selectedVisitor.fullName || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Mobile:</span>
                <span className="detail-value">{selectedVisitor.mobileNumber || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{selectedVisitor.email || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Visiting Flat:</span>
                <span className="detail-value">
                  {selectedVisitor.flatNo || 'N/A'} {selectedVisitor.wingNumber ? `(Wing ${selectedVisitor.wingNumber})` : ''}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Visit Time:</span>
                <span className="detail-value">{formatDate(selectedVisitor.visittime)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Purpose:</span>
                <span className="detail-value">{selectedVisitor.purpose || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Relation:</span>
                <span className="detail-value">{selectedVisitor.relation || 'N/A'}</span>
              </div>
            </div>

            {selectedVisitor.familyMembers?.length > 0 && (
              <div className="detail-section">
                <h3>Host Family Members</h3>
                <div className="family-members-list">
                  {selectedVisitor.familyMembers.map((member, index) => (
                    <div key={index} className="family-member">
                      <div className="member-relation">{member.relationship || 'Family'}</div>
                      <div className="member-name">{member.fullName || 'No Name'}</div>
                      <div className="member-mobile">{member.mobileNumber || 'N/A'}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedVisitor.documents?.length > 0 && (
              <div className="detail-section">
                <h3>Documents</h3>
                <div className="document-list">
                  {selectedVisitor.documents.map((doc, index) => (
                    <div key={index} className="document-item">
                      <span className="doc-type">{doc.name || 'Document'}</span>
                      <a 
                        href={doc.documentData} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="view-doc-btn"
                      >
                        View Document
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="select-visitor-prompt">
            <h3>Select a visitor to view details</h3>
            <p>Click on any visitor from the list to see their complete information</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyListingsAdmin;