import React, { useState } from 'react';
import { db } from './firebase.config'; 
import { ref, push, set } from "firebase/database"; 

const Payment = ({ totalPrice, setView, setCart }) => {
  const [selectedMethod, setSelectedMethod] = useState('bkash');
  const [userAmount, setUserAmount] = useState(''); 
  const [error, setError] = useState(''); 
  
  const [trxId, setTrxId] = useState('');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');

  const methods = [
    { id: 'bkash', name: 'bKash', color: 'bg-[#E3106E]', logo: 'https://www.logo.wine/a/logo/BKash/BKash-Icon-Logo.wine.svg' },
    { id: 'nagad', name: 'Nagad', color: 'bg-[#F49124]', logo: 'https://www.logo.wine/a/logo/Nagad/Nagad-Vertical-Logo.wine.svg' },
    { id: 'rocket', name: 'Rocket', color: 'bg-[#8C3494]', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/Rocket_Dutch_Bangla_Bank_Logo.svg/1200px-Rocket_Dutch_Bangla_Bank_Logo.svg.png' },
  ];

  const handleConfirm = () => {
    const inputAmount = parseInt(userAmount);

    if (!userAmount || !trxId || !userName || !userPhone) {
      setError("সবগুলো ঘর সঠিকভাবে পূরণ করুন!");
      return;
    } else if (inputAmount !== totalPrice) {
      setError(`ভুল অ্যামাউন্ট! আপনাকে ${totalPrice} TK দিতে হবে।`);
      return;
    } else {
      setError('');
      
      // অ্যাডমিন প্যানেলের সাথে সামঞ্জস্য রেখে ডাটা অবজেক্ট
      const orderData = {
        amount: totalPrice,
        paymentMethod: selectedMethod, // এখানে 'method' থেকে 'paymentMethod' করা হলো
        trxId: trxId,
        userName: userName,
        userPhone: userPhone,
        date: new Date().toLocaleDateString(),
        status: 'PENDING' 
      };

      const ordersRef = ref(db, 'orders');
      const newOrderRef = push(ordersRef);

      set(newOrderRef, orderData)
        .then(() => {
          const existingOrders = JSON.parse(localStorage.getItem('userOrders')) || [];
          localStorage.setItem('userOrders', JSON.stringify([...existingOrders, { id: newOrderRef.key, ...orderData }]));

          if (setCart) {
            setCart([]); 
          }
          localStorage.removeItem('cart');

          alert("ধন্যবাদ! পেমেন্ট সফল হয়েছে। অ্যাডমিন চেক করে আপনার অর্ডারটি অ্যাপ্রুভ করবে।");
          setView('my-orders'); 
        })
        .catch((err) => {
          alert("অর্ডার সেভ করতে সমস্যা হয়েছে: " + err.message);
        });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-left">
      <div className="bg-white rounded-[30px] shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Header Section */}
        <div className="p-8 bg-slate-50 border-b flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Checkout</h2>
            <p className="text-slate-500 text-sm font-medium">Payable: <span className="text-blue-600 font-bold text-lg">{totalPrice} TK</span></p>
          </div>
        </div>

        <div className="p-8">
          
          {/* ১. পেমেন্ট মেথড সিলেকশন */}
          <div className="mb-6">
            <label className="block text-slate-700 font-bold mb-4 text-center text-lg underline decoration-blue-100">Select Your Payment Method</label>
            <div className="grid grid-cols-3 gap-4">
              {methods.map((method) => (
                <div 
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${selectedMethod === method.id ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-50' : 'border-gray-100 grayscale opacity-70'}`}
                >
                  <img src={method.logo} alt={method.name} className="h-10 w-10 object-contain" />
                  <span className="font-black text-[10px] uppercase text-slate-800">{method.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ২. পেমেন্ট ইনস্ট্রাকশন */}
          <div className={`p-6 rounded-2xl text-white shadow-lg mb-10 transition-all ${methods.find(m => m.id === selectedMethod).color}`}>
            <h3 className="text-lg font-bold mb-2 uppercase italic tracking-wide">Step 1: Send Money</h3>
            <p className="text-sm leading-relaxed text-white">
              আপনার <b>{selectedMethod.toUpperCase()}</b> থেকে <span className="font-black text-xl text-yellow-300">01XXXXXXXXX</span> নাম্বারে 
              <span className="font-black text-xl text-white"> {totalPrice} TK </span> 
              "Send Money" করুন।
            </p>
          </div>

          {/* ৩. ভেরিফিকেশন ফর্ম */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-700 border-l-4 border-blue-600 pl-3 text-left">Step 2: Verify Your Payment</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2 uppercase text-left">Amount Paid</label>
                <input 
                  type="number" 
                  placeholder={`${totalPrice}`}
                  value={userAmount}
                  onChange={(e) => {
                    setUserAmount(e.target.value);
                    setError('');
                  }}
                  className={`input input-bordered w-full rounded-xl font-bold ${error ? 'border-red-500 ring-1 ring-red-100' : 'focus:ring-2 focus:ring-blue-500'}`} 
                />
                {error && <p className="text-red-600 text-[10px] mt-2 font-black italic text-left">{error}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2 uppercase text-left">Transaction ID (TrxID)</label>
                <input 
                  type="text" 
                  placeholder="যেমন: 8N7X6W5Q" 
                  className="input input-bordered w-full rounded-xl"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2 text-left">Your Name</label>
                <input 
                  type="text" 
                  placeholder="আপনার পূর্ণ নাম" 
                  className="input input-bordered w-full rounded-xl"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2 text-left">Phone Number</label>
                <input 
                  type="text" 
                  placeholder="017XXXXXXXX" 
                  className="input input-bordered w-full rounded-xl"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button 
            onClick={handleConfirm}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl mt-10 shadow-xl active:scale-95 transition-all uppercase tracking-[3px] text-xl"
          >
            Confirm & Get Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;