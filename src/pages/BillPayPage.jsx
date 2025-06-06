import React, { useState, useEffect } from 'react';
import "./BillPayPage.css"
import '../components/media.css';

const BillPayPage = () => {
  // Form state
  const [formData, setFormData] = useState({
    amount: '',
    name: '',
    email: '',
    contact: '',
    description: ''
  });

  // Payments history state
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isLoading, setIsLoading] = useState({
    payments: false,
    paymentProcessing: false
  });
  const [error, setError] = useState({
    payments: null,
    paymentProcessing: null
  });
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch payments from backend with proper error handling
  const fetchPayments = async () => {
    setIsLoading(prev => ({ ...prev, payments: true }));
    setError(prev => ({ ...prev, payments: null }));
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BaseURL_API}/api/payments`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch payments');
      }
      
      const data = await response.json();
      setPayments(data);
    } catch (err) {
      console.error('Fetch payments error:', err);
      setError(prev => ({ ...prev, payments: err.message }));
    } finally {
      setIsLoading(prev => ({ ...prev, payments: false }));
    }
  };

  // Load payments on component mount
  useEffect(() => {
    fetchPayments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async (e) => {
    e.preventDefault();
    setError(prev => ({ ...prev, paymentProcessing: null }));
    setSuccessMessage(null);
  
    // Validate form (existing code remains the same)
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      setError(prev => ({ ...prev, paymentProcessing: 'Please enter a valid amount' }));
      return;
    }
    
    if (!formData.name || !formData.contact) {
      setError(prev => ({ ...prev, paymentProcessing: 'Name and contact number are required' }));
      return;
    }
  
    setIsLoading(prev => ({ ...prev, paymentProcessing: true }));
  
    try {
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      
      if (!res) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }
  
      // First create an order on your backend
      const orderResponse = await fetch(`${import.meta.env.VITE_BaseURL_API}/api/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(parseFloat(formData.amount) * 100),
          currency: 'INR',
          receipt: 'receipt_' + Math.random().toString(36).substring(2, 15)
        })
      });
  
      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create order');
      }
  
      const orderData = await orderResponse.json();
  
      const options = {
        key: 'rzp_test_JiSRo4AsuOLqwN',
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.id, // Use the order ID from your backend
        name: 'Your Company Name',
        description: formData.description || 'Payment for services',
        image: 'https://example.com/your_logo.jpg',
        handler: async function (response) {
          try {
            setIsLoading(prev => ({ ...prev, paymentProcessing: true }));
            
            // Prepare payment data with all required fields
            const paymentData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              amount: formData.amount, // Convert back to rupees
              currency: 'INR',
              customer_name: formData.name.trim(),
              customer_email: formData.email?.trim() || undefined,
              customer_contact: formData.contact.trim(),
              description: formData.description?.trim() || undefined,
              status: 'success'
            };
  
            const saveResponse = await fetch(`${import.meta.env.VITE_BaseURL_API}/api/payments`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(paymentData)
            });
  
            if (!saveResponse.ok) {
              const errorData = await saveResponse.json().catch(() => ({}));
              throw new Error(errorData.message || 'Payment record could not be saved');
            }
  
            const savedPayment = await saveResponse.json();
            setSuccessMessage(`Payment successful! ID: ${response.razorpay_payment_id}`);
            
            await fetchPayments();
            setFormData({
              amount: '',
              name: '',
              email: '',
              contact: '',
              description: ''
            });
          } catch (err) {
            console.error('Payment processing error:', err);
            setError(prev => ({ 
              ...prev, 
              paymentProcessing: `Payment successful but record not saved: ${err.message}` 
            }));
          } finally {
            setIsLoading(prev => ({ ...prev, paymentProcessing: false }));
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.contact
        },
        theme: {
          color: '#3399cc'
        },
        modal: {
          ondismiss: () => {
            setIsLoading(prev => ({ ...prev, paymentProcessing: false }));
          }
        }
      };
  
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error('Payment initialization error:', err);
      setError(prev => ({ ...prev, paymentProcessing: err.message }));
      setIsLoading(prev => ({ ...prev, paymentProcessing: false }));
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Payment System</h1>
      
      <div style={{ gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        {/* Payment Form */}
        <div>
          <h2 style={{ marginBottom: '20px' }}>Make a Payment</h2>
          
          {/* Success Message */}
          {successMessage && (
            <div style={{ 
              padding: '10px', 
              backgroundColor: '#d4edda', 
              color: '#155724',
              borderRadius: '4px',
              marginBottom: '20px'
            }}>
              {successMessage}
            </div>
          )}
          
          {/* Payment Processing Error */}
          {error.paymentProcessing && (
            <div style={{ 
              padding: '10px', 
              backgroundColor: '#f8d7da', 
              color: '#721c24',
              borderRadius: '4px',
              marginBottom: '20px'
            }}>
              {error.paymentProcessing}
            </div>
          )}
          
          <form onSubmit={displayRazorpay} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label htmlFor="amount">Amount (INR)*</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                min="1"
                step="0.01"
                required
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
            
            <div>
              <label htmlFor="name">Full Name*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
            
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
            
            <div>
              <label htmlFor="contact">Phone Number*</label>
              <input
                type="tel"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Enter 10-digit phone number"
                pattern="[0-9]{10}"
                required
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
            
            <div>
              <label htmlFor="description">Payment Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter payment description"
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box', minHeight: '80px' }}
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading.paymentProcessing}
              style={{
                padding: '12px 20px',
                backgroundColor: isLoading.paymentProcessing ? '#cccccc' : '#3399cc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isLoading.paymentProcessing ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                marginTop: '10px'
              }}
            >
              {isLoading.paymentProcessing ? 'Processing...' : `Proceed to Pay ₹${formData.amount || '0'}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BillPayPage;