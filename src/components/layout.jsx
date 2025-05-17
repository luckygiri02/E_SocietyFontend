import React from 'react';
import Navbar from './Navbar';
import Sidebar from './sidebar';
import EventPhoto from './Eventphoto';
import NoticeTicker from './NoticeTicker';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import './media.css'
import './Layout.css'; // External CSS

const Layout = () => {
  return (
    <div className="layout1">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Body */}
      <div className="main-content1">
        <div className="sidebar12">
          <Sidebar />
        </div>

        <div className="content1">
          {/* Use the component instead of hardcoded section */}

          <NoticeTicker />
          <EventPhoto />

         

         
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
