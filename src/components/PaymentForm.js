import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import displayINRCurrency from '../helpers/displayCurrency';
import SummaryApi from '../common';

const PaymentForm = ({ totalPrice, productIds, quantities, onSuccess }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load user data from localStorage when component mounts
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setPhoneNumber(user.phoneNumber || '');
    }
  }, []);

  const handlePay = async () => {
    if (!firstName || !lastName || !email || !phoneNumber) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?._id) {
        throw new Error('Please login to proceed with payment');
      }

      // Create a transaction for each product in cart
      const paymentPromises = productIds.map((productId, index) => {
        const tx_ref = `tx-${productId}-${Date.now()}-${index}`;
        
        return fetch(SummaryApi.paymentInitiate.url, {
          method: SummaryApi.paymentInitiate.method,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: user._id,  // Use user ID from localStorage
            productId,
            amount: quantities[index] * totalPrice / quantities.reduce((a, b) => a + b, 0),
            type: 'cart',
            email: email || user.email,  // Use form email or fallback to user email
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName,
            phoneNumber: phoneNumber || user.phoneNumber,
            tx_ref,
            quantity: quantities[index]
          })
        });
      });

      const responses = await Promise.all(paymentPromises);
      const responseData = await Promise.all(responses.map(res => res.json()));

      if (responses.some(res => !res.ok)) {
        throw new Error('Some payments failed to initialize');
      }

      // For simplicity, we'll redirect to the first payment URL
      window.location.href = responseData[0].checkout_url;
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="font-medium mb-4">Payment Information</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-2 border rounded mt-1"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-2 border rounded mt-1"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mt-1"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-2 border rounded mt-1"
            required
          />
        </div>
        
        <button
          onClick={handlePay}
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isLoading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isLoading ? 'Processing...' : `Pay ${displayINRCurrency(totalPrice)}`}
        </button>
      </div>
    </div>
  );
};

export default PaymentForm;