import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

import Layout from './components/Layout';
import Complaint from './pages/ComplaintPage';
import BillPay from './pages/BillPayPage';
import ContactUS from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import ComplaintHistory from './pages/ComplaintHistory';
import ComplaintReplyPage from './pages/ComplaintReplyPage';
import FAQPage from './pages/FAQPage';
import AddPropertyPage from './pages/AddPropertyPage';
import Alerts from './pages/Alerts';
import VisitorRoom from './pages/VisitorRoom';
import Events from './pages/Events';
import MyAccount from './pages/MyAccount';
import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import Logout from './pages/Logout';
import PropertyDetails from './pages/PropertyDetails';
import LayoutAdmin from './pages/Admin/LayoutAdmin'; // Admin layout import
import { UserProvider } from './context/UserContext';
import UpdateDocument from './pages/UpdateDocument';
import Rent from './pages/RentPage';
import Sell from './pages/SellPage';
import Gallery from './pages/Gallery';
import Onrentsell from './pages/Admin/Onrentsell';

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Signup />} />
          <Route path="/landing" element={<LandingPage />} />

          {/* Protected User Routes */}
          <Route path="/homepage" element={<ProtectedRoute><Layout /></ProtectedRoute>} />
          <Route path="/complaint" element={<ProtectedRoute><Complaint /></ProtectedRoute>} />
          <Route path="/billpay" element={<ProtectedRoute><BillPay /></ProtectedRoute>} />
          <Route path="/rent" element={<ProtectedRoute><Rent /></ProtectedRoute>} />
          <Route path="/sell" element={<ProtectedRoute><Sell /></ProtectedRoute>} />
          <Route path="/gallery" element={<ProtectedRoute><Gallery /></ProtectedRoute>} />
          <Route path="/contact" element={<ProtectedRoute><ContactUS /></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><AboutUs /></ProtectedRoute>} />
          <Route path="/complaint-history" element={<ProtectedRoute><ComplaintHistory /></ProtectedRoute>} />
          <Route path="/update-document" element={<ProtectedRoute><UpdateDocument /></ProtectedRoute>} />
          <Route path="/complaints-reply" element={<ProtectedRoute><ComplaintReplyPage /></ProtectedRoute>} />
          <Route path="/faq" element={<ProtectedRoute><FAQPage /></ProtectedRoute>} />
          <Route path="/add-property" element={<ProtectedRoute><AddPropertyPage /></ProtectedRoute>} />
          <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
          <Route path="/visitor-room" element={<ProtectedRoute><VisitorRoom /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><MyAccount /></ProtectedRoute>} />
          <Route path="/logout" element={<ProtectedRoute><Logout /></ProtectedRoute>} />
          <Route path="/property/:id" element={<ProtectedRoute><PropertyDetails /></ProtectedRoute>} />

          {/* Admin Protected Routes */}
          <Route path="/admin/*" element={<AdminProtectedRoute><LayoutAdmin /></AdminProtectedRoute>} />
        </Routes>
      </UserProvider>
    </Router>
  );
}


export default App;
