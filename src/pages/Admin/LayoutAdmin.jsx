import React, { useEffect, useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi'; // Hamburger icon

import AdminDashboard from './AdminDashboard';
import UserManagement from './UserManagement';
import EventManagement from './EventManagement';
import ComplaintPanel from './ComplaintPanel';
import NoticeBoardAdmin from './NoticeBoardAdmin';
import PaymentReview from './PaymentReview';
import PropertyListingsAdmin from './PropertyListingsAdmin';
import Onrentsell from './Onrentsell';

import './LayoutAdmin.css';

const LayoutAdmin = () => {
  const [admin, setAdmin] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchAdmin() {
      try {
        const res = await fetch(`${import.meta.env.VITE_BaseURL_API}/api/items`);
        const data = await res.json();
        const adminUser = data.find(
          user => user.role && user.role.toLowerCase() === 'admin'
        );
        if (adminUser) {
          setAdmin(adminUser);
        }
      } catch (error) {
        console.error('Error fetching admin:', error);
      }
    }
    fetchAdmin();
  }, []);

  const profileImage = admin?.documents?.find(doc => doc.name === 'Profile Photo')?.documentData;

  return (
    <div className="admin-container">
      {/* Hamburger Icon */}
      <button className="hamburger-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <FiMenu size={24} />
      </button>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="admin-header">
          {profileImage ? (
            <img src={profileImage} alt="Admin Profile" className="admin-logo" />
          ) : (
            <img src="/logo192.png" alt="Admin" className="admin-logo" />
          )}
          <div className="admin-name-role">
            <p className="admin-fullname">{admin?.fullName || ''}</p>
            <p className="admin-subtitle">Society Admin</p>
          </div>
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin" end className="nav-link" onClick={() => setIsSidebarOpen(false)}>🏠 Dashboard</NavLink>
          <NavLink to="/admin/events" className="nav-link" onClick={() => setIsSidebarOpen(false)}>📅 Events</NavLink>
          <NavLink to="/admin/users" className="nav-link" onClick={() => setIsSidebarOpen(false)}>🧑‍🤝‍🧑 Users</NavLink>
          <NavLink to="/admin/complaints" className="nav-link" onClick={() => setIsSidebarOpen(false)}>🛠 Complaints</NavLink>
          <NavLink to="/admin/notices" className="nav-link" onClick={() => setIsSidebarOpen(false)}>📢 Notices</NavLink>
          <NavLink to="/admin/payments" className="nav-link" onClick={() => setIsSidebarOpen(false)}>💳 Payments</NavLink>
          <NavLink to="/admin/properties" className="nav-link" onClick={() => setIsSidebarOpen(false)}>🧍 Visitor Records</NavLink>
          <NavLink to="/admin/Onrentsell" className="nav-link" onClick={() => setIsSidebarOpen(false)}>🏘️ Properties on rent/sell</NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="admin-scroll-wrapper">
        <main className="admin-main">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="events" element={<EventManagement />} />
            <Route path="complaints" element={<ComplaintPanel />} />
            <Route path="notices" element={<NoticeBoardAdmin />} />
            <Route path="payments" element={<PaymentReview />} />
            <Route path="properties" element={<PropertyListingsAdmin />} />
            <Route path="Onrentsell" element={<Onrentsell />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default LayoutAdmin;
