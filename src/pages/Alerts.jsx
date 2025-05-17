import React from 'react';
import './Alerts.css';
import '../components/media.css';

const Alerts = () => {
  const societyAlerts = [
    {
      id: 1,
      title: '🛠️ Water Supply Maintenance',
      message: 'Water supply will be interrupted on May 3 from 9 AM to 12 PM.',
    },
    {
      id: 2,
      title: '🏢 General Meeting',
      message: 'Society meeting scheduled on May 5 at 6 PM in the Community Hall.',
    },
  ];

  const personalAlerts = [
    {
      id: 1,
      title: '💳 Maintenance Due',
      message: 'You have pending maintenance charges for April 2025.',
    },
    {
      id: 2,
      title: '🚪 Guest Approval',
      message: 'Your guest visit for May 1 has been approved by the security team.',
    },
  ];

  return (
    <div className="alerts-page">
      <h1>🔔 Alerts & Notifications</h1>

      <div className="alert-section">
        <h2>Society Alerts</h2>
        {societyAlerts.map(alert => (
          <div key={alert.id} className="alert-card">
            <h3>{alert.title}</h3>
            <p>{alert.message}</p>
          </div>
        ))}
      </div>

      <div className="alert-section">
        <h2>Personal Alerts</h2>
        {personalAlerts.map(alert => (
          <div key={alert.id} className="alert-card personal">
            <h3>{alert.title}</h3>
            <p>{alert.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;
