import React, { useState, useEffect } from 'react';
import './ComplaintPanel.css';

const ComplaintPanel = () => {
  const [complaints, setComplaints] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [status, setStatus] = useState('pending');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${import.meta.env.VITE_BaseURL_API}/api/complaints`);
        if (!res.ok) throw new Error('Failed to fetch complaints');
        const data = await res.json();
        setComplaints(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleEdit = (complaint) => {
    setEditingId(complaint._id);
    setResponseText(complaint.adminResponse || '');
    setStatus(complaint.status);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BaseURL_API}/api/complaints/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          adminResponse: responseText, 
          status 
        }),
      });

      if (!res.ok) throw new Error('Failed to update complaint');
      
      const updated = await res.json();
      setComplaints(prev => prev.map(c => c._id === updated._id ? updated : c));
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleImagePreview = (imageData) => {
    if (imageData) {
      const imgSrc = `data:${imageData.contentType};base64,${imageData.data}`;
      setImagePreview(imgSrc);
    }
  };

  if (isLoading) {
    return <div className="loading-spinner"></div>;
  }

  return (
    <div className="panel-container">
      <h1 className="panel-title">Complaints Management</h1>
      
      {error && <div className="error-box">{error}</div>}
      
      <div className="table-wrapper">
        <table className="complaint-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Evidence</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length > 0 ? (
              complaints.map(complaint => (
                <React.Fragment key={complaint._id}>
                  <tr>
                    <td>{complaint._id.slice(-6)}</td>
                    <td>{complaint.subject}</td>
                    <td>
                      <span className={`status-tag ${complaint.status}`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td>
                      {complaint.evidenceImage ? (
                        <button 
                          className="image-button"
                          onClick={() => handleImagePreview(complaint.evidenceImage)}
                        >
                          View
                        </button>
                      ) : (
                        <span className="no-image">None</span>
                      )}
                    </td>
                    <td>
                      <button 
                        className="edit-button"
                        onClick={() => editingId === complaint._id ? setEditingId(null) : handleEdit(complaint)}
                      >
                        {editingId === complaint._id ? 'Cancel' : 'Respond'}
                      </button>
                    </td>
                  </tr>
                  
                  {editingId === complaint._id && (
                    <tr className="response-row">
                      <td colSpan="5">
                        <div className="edit-panel">
                          <h3>Respond to: {complaint.subject}</h3>
                          
                          <div className="edit-grid">
                            <div className="edit-item">
                              <label>Complaint Details</label>
                              <div className="readonly-box">
                                {complaint.description || 'No description provided'}
                              </div>
                            </div>
                            
                            <div className="edit-item">
                              <label>Update Status</label>
                              <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                              >
                                <option value="pending">Pending</option>
                                <option value="inprogress">In Progress</option>
                                <option value="solved">Solved</option>
                              </select>
                            </div>
                          </div>
                          
                          {complaint.evidenceImage && (
                            <div className="evidence-preview">
                              <label>Evidence</label>
                              <button onClick={() => handleImagePreview(complaint.evidenceImage)}>
                                <img
                                  src={`data:${complaint.evidenceImage.contentType};base64,${complaint.evidenceImage.data}`}
                                  alt="Evidence"
                                  className="thumbnail"
                                />
                              </button>
                            </div>
                          )}
                          
                          <div className="edit-response">
                            <label>Admin Response</label>
                            <textarea
                              value={responseText}
                              onChange={(e) => setResponseText(e.target.value)}
                              placeholder="Enter your response here..."
                              rows="5"
                            />
                          </div>
                          
                          <div className="edit-actions">
                            <button 
                              className="cancel-button"
                              onClick={() => setEditingId(null)}
                            >
                              Cancel
                            </button>
                            <button 
                              className="save-button"
                              onClick={handleSave}
                            >
                              Save Response
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">No complaints found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {imagePreview && (
        <div className="image-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Evidence Image</h3>
              <button 
                onClick={() => setImagePreview(null)} 
                className="close-button"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <img 
                src={imagePreview} 
                alt="Evidence preview" 
                className="modal-image" 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintPanel;