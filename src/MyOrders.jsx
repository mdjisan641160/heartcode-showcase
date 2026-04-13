import React, { useState, useEffect } from 'react';
import { db } from './firebase.config';
import { ref, onValue } from "firebase/database";

const MyOrders = ({ setView }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ১. ফায়ারবেস থেকে ডাটা রিড করা (যাতে অ্যাডমিন আপডেট করলে এখানে দেখা যায়)
    const ordersRef = ref(db, 'orders');
    
    // রিয়েল-টাইম লিসেনার
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const allOrders = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));

        // আপনার ফোনের সাথে মিল আছে এমন অর্ডারগুলো ফিল্টার করতে পারেন
        // আপাতত সব অর্ডার দেখাচ্ছে, আপনি চাইলে আপনার ফোন নাম্বার দিয়ে ফিল্টার করতে পারেন
        setOrders(allOrders.reverse()); 
      } else {
        setOrders([]);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // ক্লিনআপ
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-left">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-slate-800 uppercase italic">My Orders</h2>
        <button onClick={() => setView('home')} className="btn btn-ghost btn-sm text-slate-500">Back to Home</button>
      </div>

      {loading ? (
        <div className="text-center py-20"><span className="loading loading-spinner loading-lg"></span></div>
      ) : orders.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-[25px] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{order.date}</span>
                <h3 className="font-bold text-slate-700 text-lg">Order ID: #{order.id.slice(-5)}</h3>
                <div className="flex gap-2 items-center">
                  <span className="text-blue-600 font-black">{order.amount} TK</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-xs font-bold text-slate-500 uppercase">{order.method}</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Status</span>
                  <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-tighter shadow-sm ${
                    order.status === 'CONFIRMED' ? 'bg-green-500 text-white' : 
                    order.status === 'REJECTED' ? 'bg-red-500 text-white' : 
                    'bg-yellow-400 text-white'
                  }`}>
                    {order.status || 'PENDING'}
                  </span>
                </div>
                
                {order.status === 'CONFIRMED' && (
                  <button className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-none rounded-xl px-6">
                    Download
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-20 rounded-[40px] text-center shadow-inner border border-dashed border-slate-200">
          <p className="text-slate-400 font-bold italic">এখনো কোনো অর্ডার করা হয়নি!</p>
        </div>
      )}
    </div>
  );
};

export default MyOrders;