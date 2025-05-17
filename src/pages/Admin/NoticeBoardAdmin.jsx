import React, { useState, useEffect } from 'react';
import './NoticeAdmin.css';

const NoticeBoardAdmin = () => {
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    postedBy: '',
    deadline: '',
    audienceType: 'global',
    targetArea: 'homepage',
    category: 'general',
    priority: 'medium',
    status: 'active',
    targetUsers: '' // Changed from array to empty string
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BaseURL_API}/api/notices`);
      const data = await response.json();
      setNotices(data);
    } catch (err) {
      console.error('Error fetching notices:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectNotice = (notice) => {
    setSelectedNotice(notice);
    setFormData({
      title: notice.title,
      message: notice.message,
      postedBy: notice.postedBy,
      deadline: new Date(notice.deadline).toISOString().slice(0, 16),
      audienceType: notice.audienceType,
      targetArea: notice.targetArea,
      category: notice.category,
      priority: notice.priority,
      status: notice.status,
      targetUsers: notice.targetUsers.join(',') // Convert array to string
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.message || !formData.postedBy || !formData.deadline) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const url = selectedNotice 
        ? `${import.meta.env.VITE_BaseURL_API}/api/notices/${selectedNotice._id}`
        : `${import.meta.env.VITE_BaseURL_API}/api/notices`;

      const method = selectedNotice ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        targetUsers: formData.targetUsers.split(',').map(u => u.trim()) // Now safe to split
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Request failed');

      const result = await response.json();
      fetchNotices();
      setSelectedNotice(null);
      setFormData({
        title: '',
        message: '',
        postedBy: '',
        deadline: '',
        audienceType: 'global',
        targetArea: 'homepage',
        category: 'general',
        priority: 'medium',
        status: 'active',
        targetUsers: ''
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await fetch(`${import.meta.env.VITE_BaseURL_API}/api/notices/${id}`, { method: 'DELETE' });
        fetchNotices();
        setSelectedNotice(null);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="notice-admin-container">
      <div className="notice-list-panel">
        <h2>Manage Notices</h2>
        <button 
          className="new-notice-btn"
          onClick={() => setSelectedNotice(null)}
        >
          + Create New Notice
        </button>
        
        <div className="notice-list">
          {notices.map(notice => (
            <div 
              key={notice._id}
              className={`notice-item ${selectedNotice?._id === notice._id ? 'selected' : ''}`}
              onClick={() => handleSelectNotice(notice)}
            >
              <h4>{notice.title}</h4>
              <p>Category: {notice.category}</p>
              <p>Deadline: {new Date(notice.deadline).toLocaleDateString()}</p>
              <button 
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(notice._id);
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="notice-form-panel">
        <h2>{selectedNotice ? 'Edit Notice' : 'Create New Notice'}</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Posted By *</label>
              <input
                type="text"
                name="postedBy"
                value={formData.postedBy}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Deadline *</label>
              <input
                type="datetime-local"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Audience Type</label>
              <select
                name="audienceType"
                value={formData.audienceType}
                onChange={handleInputChange}
              >
                <option value="global">Global</option>
                <option value="personal">Personal</option>
              </select>
            </div>

            <div className="form-group">
              <label>Target Area</label>
              <select
                name="targetArea"
                value={formData.targetArea}
                onChange={handleInputChange}
              >
                <option value="homepage">Homepage</option>
                <option value="section1">Section 1</option>
                <option value="section2">Section 2</option>
                <option value="personal">Personal</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="general">General</option>
                <option value="maintenance">Maintenance</option>
                <option value="event">Event</option>
                <option value="alert">Alert</option>
                <option value="payment">Payment</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            {formData.audienceType === 'personal' && (
              <div className="form-group">
                <label>Target Users (comma-separated IDs)</label>
                <input
                  type="text"
                  name="targetUsers"
                  value={formData.targetUsers}
                  onChange={handleInputChange}
                />
              </div>
            )}

          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {selectedNotice ? 'Update Notice' : 'Create Notice'}
            </button>
            {selectedNotice && (
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setSelectedNotice(null)}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoticeBoardAdmin;