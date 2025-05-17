import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ComplaintReplyPage.css';

const ComplaintReplyPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BaseURL_API}/api/complaints`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch complaints');
        }
        
        const data = await response.json();
        
        // Filter complaints to only show those with admin responses
        const repliedComplaints = data.filter(
          complaint => complaint.adminResponse && complaint.adminResponse.trim() !== ''
        );
        
        setComplaints(repliedComplaints);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (isLoading) {
    return (
      <div className="complaint-reply-page">
        <h1>Complaint Replies</h1>
        <div className="loading">Loading complaints...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="complaint-reply-page">
        <h1>Complaint Replies</h1>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="complaint-reply-page">
      <h1>Complaint Replies</h1>
      
      {complaints.length === 0 ? (
        <div className="no-complaints">
          <p>No replied complaints found</p>
          <Link to="/complaint" className="back-button">Back to Dashboard</Link>
        </div>
      ) : (
        <>
          <div className="complaint-list">
            {complaints.map((complaint) => (
              <div className="complaint-item" key={complaint._id}>
                <h3>{complaint.subject || 'No subject'}</h3>
                <p><strong>Status:</strong> <span className={`status ${complaint.status?.toLowerCase()}`}>
                  {complaint.status || 'Unknown'}
                </span></p>
                <p><strong>Complaint:</strong> {complaint.description || 'No description provided'}</p>
                <p><strong>Submitted Date:</strong> {new Date(complaint.submittedDate).toLocaleDateString()}</p>
                <p><strong>Flat No:</strong> {complaint.flatNo || 'Unknown'}</p>
                <div className="admin-response">
                  <strong>Reply from Authority:</strong>
                  <p>{complaint.adminResponse}</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/complaint" className="back-button">Back to Dashboard</Link>
        </>
      )}
    </div>
  );
};

export default ComplaintReplyPage;