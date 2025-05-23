import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Add this import
import { toast } from 'react-toastify';
import displayINRCurrency from '../helpers/displayCurrency';
import SummaryApi from '../common';

function Pay({ totalPrice, tx_ref, productId }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const handlePay = async () => {
    // Validate all required fields
    if (!firstName || !lastName || !email || !phoneNumber) {
      toast.error('Please fill all require7\]]][d fields');
      return;
    }


    setIsLoading(true);
    
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User not authenticated. Please login.');
      }

      const payload = {
        userId,
        productId,
        amount: Number(totalPrice),
        type: 'product',
        email,
        firstName,
        lastName,
        phoneNumber,
        tx_ref
      };

      console.log('Payment payload:', payload);

      const response = await fetch(SummaryApi.paymentInitiate.url, {
        method: SummaryApi.paymentInitiate.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Payment initialization failed');
      }

      if (responseData.success) {
        window.location.href = responseData.checkout_url;
      } else {
        toast.error(responseData.message || 'Payment initialization failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="payment-form p-4">
      <div className="form-group mb-3">
        <label className="block mb-1 font-medium">First Name</label>
        <input 
          type="text" 
          value={firstName} 
          onChange={(e) => setFirstName(e.target.value)} 
          className="w-full p-2 border rounded"
          required 
        />
      </div>
      <div className="form-group mb-3">
        <label className="block mb-1 font-medium">Last Name</label>
        <input 
          type="text" 
          value={lastName} 
          onChange={(e) => setLastName(e.target.value)} 
          className="w-full p-2 border rounded"
          required 
        />
      </div>
      <div className="form-group mb-3">
        <label className="block mb-1 font-medium">Email</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full p-2 border rounded"
          required 
        />
      </div>
      <div className="form-group mb-4">
        <label className="block mb-1 font-medium">Phone Number</label>
        <input 
          type="tel" 
          value={phoneNumber} 
          onChange={(e) => setPhoneNumber(e.target.value)} 
          className="w-full p-2 border rounded"
          required 
        />
      </div>
      <button 
        onClick={handlePay}
        disabled={isLoading}
        className={`w-full p-3 rounded text-white font-medium ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {isLoading ? 'Processing...' : `Pay Now ${displayINRCurrency(totalPrice)}`}
      </button>
    </div>
  );
}

export default Pay;