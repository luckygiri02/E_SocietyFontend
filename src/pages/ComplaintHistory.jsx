import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import './ComplaintHistory.css';

const ComplaintHistory = () => {
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userData } = useContext(UserContext);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BaseURL_API}/api/complaints`);
        if (!response.ok) {
          throw new Error('Failed to fetch complaints');
        }
        const data = await response.json();
        
        // Filter complaints by the user's flat number
        const userComplaints = data.filter(
          complaint => complaint.flatNo === userData?.flatNo
        );
        
        setComplaints(userComplaints);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (userData?.flatNo) {
      fetchComplaints();
    }
  }, [userData]);

  const filteredComplaints = complaints.filter(c => {
    const title = c.title?.toLowerCase() || '';
    const description = c.description?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    
    return title.includes(search) || description.includes(search);
  });

  if (!userData?.flatNo) {
    return (
      <div className="complaint-history-page">
        <h2>My Complaint History</h2>
        <p>Please login to view your complaint history</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="complaint-history-page">
        <h2>My Complaint History</h2>
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="complaint-history-page">
        <h2>My Complaint History</h2>
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="complaint-history-page">
      <h2>My Complaint History</h2>
      <input
        type="text"
        placeholder="Search complaints..."
        className="complaint-search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredComplaints.length === 0 ? (
        <p className="no-complaints">No complaints found</p>
      ) : (
        <div className="complaint-list">
          {filteredComplaints.map((c, idx) => (
            <div key={idx} className="complaint-card">
              <div className="complaint-header">
                <strong>{c.subject || 'No title'}</strong>
                <span className={`status ${c.status?.toLowerCase() || ''}`}>
                  {c.status || 'Unknown'}
                </span>
              </div>
              <p>{c.description || 'No description provided'}</p>
              <div className="complaint-meta">
                <p>Reported on: {c.submittedDate ? new Date(c.submittedDate).toLocaleDateString() : 'Unknown date'}</p>
                <p>Flat: {c.flatNo || 'Unknown'}</p>
                {c.adminResponse && (
                  <div className="admin-response">
                    <strong>Admin Response:</strong>
                    <p>{c.adminResponse}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComplaintHistory;