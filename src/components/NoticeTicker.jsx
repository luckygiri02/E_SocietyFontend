import React, { useState, useEffect } from 'react';
import './NoticeTicker.css';
import './media.css';

const NoticeTicker = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BaseURL_API}/api/notices`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch notices');
        }
        const data = await response.json();
        
        // Filter notices where targetArea is 'homepage'
        const homepageNotices = data.filter(notice => 
          notice.targetArea === 'homepage' && notice.status === 'active'
        );
        
        setNotices(homepageNotices);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  if (loading) {
    return (
      <div className="notice-ticker1">
        <div className="notice-ticker-content1">
          <span className="notice-icon1">📢</span>
          <p>Loading notices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notice-ticker1">
        <div className="notice-ticker-content1">
          <span className="notice-icon1">⚠️</span>
          <p>Error loading notices</p>
        </div>
      </div>
    );
  }

  if (notices.length === 0) {
    return (
      <div className="notice-ticker1">
        <div className="notice-ticker-content1">
          <span className="notice-icon1">ℹ️</span>
          <p>No active notices at this time</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notice-ticker1">
      <div className="notice-ticker-content1">
        {notices.map((notice, index) => (
          <React.Fragment key={notice._id}>
            <span className="notice-icon1">
              {notice.category === 'event' ? '🎉' : 
               notice.category === 'alert' ? '⚠️' : 
               notice.category === 'payment' ? '💳' : '📢'}
            </span>
            <span className="span1">{notice.title}</span>
            {/* Add a separator if not the last notice */}
            {index < notices.length - 1 && <span className="separator">•</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default NoticeTicker;