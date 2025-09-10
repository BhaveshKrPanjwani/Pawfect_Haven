// src/pages/DonationPage.js

import React, { useState } from "react";
import "../style/PetQuiz.css";
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // To potentially prefill user info
import "../style/donation.css"; // Ensure styles are specific to this page

const DonationPage = () => {
  const { user } = useAuth(); // Get authenticated user data if available

  const [amount, setAmount] = useState(100); // Default to a reasonable amount, in Rupees
  const [donorName, setDonorName] = useState(user ? user.fullName : ""); // Prefill if logged in
  const [email, setEmail] = useState(user ? user.email : ""); // Prefill if logged in
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(''); // For user feedback

  const backendUrl = 'http://localhost:5000'; // Your backend URL

  // Function to load the Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setLoading(true);

    // Basic Client-side validation
    if (!donorName || !email || !amount || amount < 1) {
      setMessage('Please fill in all details and ensure amount is at least ₹1.');
      setLoading(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        setMessage("Please enter a valid email address.");
        setLoading(false);
        return;
    }

    // 1. Load Razorpay script
    const res = await loadRazorpayScript();
    if (!res) {
      setMessage('Razorpay SDK failed to load. Please check your internet connection.');
      setLoading(false);
      return;
    }

    try {
      // 2. Call your backend to create an order
      const orderResponse = await axios.post(`${backendUrl}/api/payments/createOrder`, {
        amount: amount, // Amount in Rupees
        donorName: donorName,
        email: email,
      });

      const { id: order_id, currency, amount: order_amount, receipt } = orderResponse.data;

      // 3. Configure Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Your Public Key ID from .env.local
        amount: order_amount, // Amount received from backend (in paisa)
        currency: currency,
        name: "Pawfect Haven",
        description: `Donation for Animal Welfare (Receipt: ${receipt})`,
        order_id: order_id, // Order ID from your backend
        handler: async function (response) {
          // This function is called on successful payment
          setMessage('Payment successful! Verifying donation...');
          try {
            // 4. Call your backend to verify the payment signature
            const verifyResponse = await axios.post(`${backendUrl}/api/payments/verifyPayment`, {
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            if (verifyResponse.data.status === 'success') {
              setMessage('Donation successfully processed and verified! Thank you for your kindness!');
              // Optionally clear form fields or redirect
              setAmount(100);
              // Do not clear name/email if prefilled from user context, let user modify for next donation
            } else {
              setMessage('Payment successful, but verification failed. Please contact support with Payment ID: ' + response.razorpay_payment_id);
            }
          } catch (error) {
            console.error('Error during payment verification:', error.response?.data?.message || error.message);
            setMessage('An error occurred during verification. Please contact support.');
          }
        },
        prefill: {
          name: donorName,
          email: email,
          // contact: "9999999999" // Optional: prefill user's contact if you collect it
        },
        notes: {
          'Donation for': 'Animal Welfare',
          'Donor Email': email,
        },
        theme: {
          color: "#3399CC" // Customize Razorpay popup theme
        }
      };

      // 5. Open the Razorpay payment popup
      const rzp1 = new window.Razorpay(options);
      rzp1.on('razorpay_payment_failed', function (response) {
        console.error('Payment Failed:', response.error);
        setMessage(`Payment failed: ${response.error.description}. Code: ${response.error.code}`);
      });
      rzp1.open();

    } catch (error) {
      console.error('Error during payment initiation:', error.response?.data?.message || error.message);
      setMessage(error.response?.data?.message || 'Error initiating payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="donation-page">
      <h1 className="donation-page-header">Support Animal Welfare</h1>
      <p className="donation-page-description">
        Your donation helps provide shelter, food, and medical care for animals in need.
      </p>

      <div className="donation-page-content">
        <form className="donation-page-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            className="donation-page-input"
            required
            disabled={loading}
          />

          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="donation-page-input"
            required
            disabled={loading}
          />

          <input
            type="number"
            placeholder="Donation Amount (₹)"
            value={amount}
            onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 0))} // Min amount 1
            className="donation-page-input"
            required
            min="1"
            step="1"
            disabled={loading}
          />

          {/* Removed payment method select as Razorpay handles various methods in its popup */}
          {/* <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="donation-page-select"
          >
            <option value="credit-card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="upi">UPI</option>
            <option value="bank-transfer">Bank Transfer</option>
          </select> */}

          {message && <p className="donation-message" style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}

          <button type="submit" className="donation-page-button" disabled={loading}>
            {loading ? "Processing Payment..." : `Donate ₹${amount}`}
          </button>
        </form>
      </div>
      <p style={{ marginTop: '20px', fontSize: '14px', color: '#666', textAlign: 'center' }}>
        All donations are processed securely by Razorpay.
      </p>
      ` `
    </div>
  );
};

export default DonationPage;