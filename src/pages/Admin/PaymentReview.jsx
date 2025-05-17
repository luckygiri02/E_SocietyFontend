import React, { useState, useEffect } from "react";
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './PaymentManagement.css';

const PaymentReview = () => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BaseURL_API}/api/payments`);
      const data = await res.json();
      if (data.success) {
        setPayments(data.data);
      } else {
        console.error("Failed to fetch payments:", data.message);
      }
    } catch (err) {
      console.error("Error fetching payments", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments
    .filter(payment => {
      if (filterStatus !== "all" && payment.status !== filterStatus) return false;
      return (
        payment.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.customer_contact?.includes(searchTerm) ||
        payment.razorpay_payment_id?.includes(searchTerm) ||
        payment.razorpay_order_id?.includes(searchTerm)
      );
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatAmount = (amount) => {
    if (!amount) return "₹0";
    return `₹${(amount /1).toFixed(2)}`;
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      success: "status-success",
      failed: "status-failed",
      pending: "status-pending",
      refunded: "status-refunded"
    };
    return (
      <span className={`status-badge ${statusClasses[status] || ''}`}>
        {status}
      </span>
    );
  };

  const downloadPDFReceipt = async () => {
    if (!selectedPayment) return;
    
    try {
      const doc = new jsPDF();
      
      // Add logo or header
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text('Payment Receipt', 105, 20, { align: 'center' });
      
      // Add payment details
      doc.setFontSize(12);
      doc.text(`Receipt No: ${selectedPayment.razorpay_payment_id}`, 14, 40);
      doc.text(`Date: ${formatDate(selectedPayment.created_at)}`, 14, 50);
      doc.text(`Customer: ${selectedPayment.customer_name}`, 14, 60);
      doc.text(`Contact: ${selectedPayment.customer_contact}`, 14, 70);
      doc.text(`Email: ${selectedPayment.customer_email || 'N/A'}`, 14, 80);
      
      // Add payment summary
      doc.setFontSize(14);
      doc.text('Payment Summary', 14, 100);
      doc.setFontSize(12);
      doc.text(`Amount: ${formatAmount(selectedPayment.amount)}`, 14, 110);
      doc.text(`Status: ${selectedPayment.status.toUpperCase()}`, 14, 120);
      
      if (selectedPayment.description) {
        doc.text(`Description: ${selectedPayment.description}`, 14, 130);
      }
      
      // Add footer
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Thank you for your payment!', 105, 280, { align: 'center' });
      
      doc.save(`payment_receipt_${selectedPayment.razorpay_payment_id}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF receipt');
    }
  };

  const downloadImageReceipt = async () => {
    if (!selectedPayment) return;
    
    try {
      const receiptElement = document.getElementById('receipt-print');
      if (!receiptElement) return;
      
      const canvas = await html2canvas(receiptElement, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      canvas.toBlob((blob) => {
        saveAs(blob, `payment_${selectedPayment.razorpay_payment_id}.png`);
      });
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image receipt');
    }
  };

  return (
    <div className="payment-management-container">
      <div className="payment-list-panel">
        <h2>Payment Management</h2>
        
        <div className="payment-controls">
          <input
            type="text"
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Statuses</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
          </select>
          
          <button onClick={fetchPayments} className="refresh-btn">
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="loading-indicator">Loading payments...</div>
        ) : filteredPayments.length === 0 ? (
          <div className="empty-state">No payments found</div>
        ) : (
          <div className="payments-table">
            <div className="table-header">
              <div className="header-cell">Payment ID</div>
              <div className="header-cell">Customer</div>
              <div className="header-cell">Amount</div>
              <div className="header-cell">Date</div>
              <div className="header-cell">Status</div>
            </div>
            
            <div className="table-body">
              {filteredPayments.map(payment => (
                <div 
                  key={payment._id} 
                  className={`table-row ${selectedPayment?._id === payment._id ? 'selected' : ''}`}
                  onClick={() => setSelectedPayment(payment)}
                >
                  <div className="table-cell" title={payment.razorpay_payment_id}>
                    {payment.razorpay_payment_id?.substring(0, 8)}...
                  </div>
                  <div className="table-cell">
                    <div className="customer-name">{payment.customer_name}</div>
                    <div className="customer-contact">{payment.customer_contact}</div>
                  </div>
                  <div className="table-cell amount-cell">
                    {formatAmount(payment.amount)}
                  </div>
                  <div className="table-cell">
                    {formatDate(payment.created_at)}
                  </div>
                  <div className="table-cell">
                    {getStatusBadge(payment.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="payment-detail-panel">
        {selectedPayment ? (
          <>
            {/* Hidden receipt template for image capture */}
            <div id="receipt-print" style={{ position: 'absolute', left: '-9999px' }}>
              <div style={{ 
                width: '500px', 
                padding: '20px', 
                border: '1px solid #ddd',
                fontFamily: 'Arial, sans-serif'
              }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Payment Receipt</h2>
                <hr style={{ margin: '10px 0' }} />
                <p><strong>Receipt No:</strong> {selectedPayment.razorpay_payment_id}</p>
                <p><strong>Order ID:</strong> {selectedPayment.razorpay_order_id}</p>
                <p><strong>Date:</strong> {formatDate(selectedPayment.created_at)}</p>
                <p><strong>Customer:</strong> {selectedPayment.customer_name}</p>
                <p><strong>Contact:</strong> {selectedPayment.customer_contact}</p>
                <p><strong>Email:</strong> {selectedPayment.customer_email || 'N/A'}</p>
                <hr style={{ margin: '20px 0' }} />
                <h3 style={{ textAlign: 'center', margin: '15px 0' }}>Payment Summary</h3>
                <p><strong>Amount:</strong> {formatAmount(selectedPayment.amount)} {selectedPayment.currency}</p>
                <p><strong>Status:</strong> {selectedPayment.status.toUpperCase()}</p>
                {selectedPayment.description && (
                  <p><strong>Description:</strong> {selectedPayment.description}</p>
                )}
                <hr style={{ margin: '20px 0' }} />
                <p style={{ 
                  textAlign: 'center', 
                  fontStyle: 'italic',
                  marginTop: '30px'
                }}>
                  Thank you for your payment!
                </p>
              </div>
            </div>

            <h2>Payment Details</h2>
            <div className="detail-section">
              <h3>Transaction Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Payment ID:</span>
                  <span className="detail-value">{selectedPayment.razorpay_payment_id}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Order ID:</span>
                  <span className="detail-value">{selectedPayment.razorpay_order_id}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Amount:</span>
                  <span className="detail-value">{formatAmount(selectedPayment.amount)} {selectedPayment.currency}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status:</span>
                  <span className="detail-value">
                    {getStatusBadge(selectedPayment.status)}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">{formatDate(selectedPayment.created_at)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Description:</span>
                  <span className="detail-value">{selectedPayment.description || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Customer Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{selectedPayment.customer_name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{selectedPayment.customer_email || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Contact:</span>
                  <span className="detail-value">{selectedPayment.customer_contact}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Technical Details</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Razorpay Signature:</span>
                  <span className="detail-value code">
                    {selectedPayment.razorpay_signature?.substring(0, 20)}...
                  </span>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              {selectedPayment.status === 'success' && (
                <button className="refund-btn">Initiate Refund</button>
              )}
              <button className="print-btn" onClick={downloadPDFReceipt}>
                Download Receipt (PDF)
              </button>
              <button className="print-btn" onClick={downloadImageReceipt}>
                Download Receipt (Image)
              </button>
            </div>
          </>
        ) : (
          <div className="select-payment-prompt">
            <h3>Select a payment to view details</h3>
            <p>Click on any payment from the list to see complete transaction information</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentReview;