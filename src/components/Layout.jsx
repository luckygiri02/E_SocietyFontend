import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import EventPhoto from './EventPhoto';
import NoticeTicker from './NoticeTicker';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
  return (
    <div className="layout-container">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        {/* Sidebar - Will stack on mobile */}
        <aside className="sidebar-container">
          <Sidebar />
        </aside>

        {/* Primary Content */}
        <main className="content-area">
          <NoticeTicker />
          <EventPhoto />
          <Outlet /> {/* For nested routes */}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;