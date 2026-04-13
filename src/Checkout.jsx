import React from 'react';

const Checkout = ({ cart, removeFromCart, setView }) => {
  // মোট টাকার হিসাব
  const totalPrice = cart.reduce((sum, item) => {
    const priceNum = parseInt(item.price.replace(/[^\d]/g, '')) || 0;
    return sum + priceNum;
  }, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-blue-600 mb-8">Your Shopping Cart</h2>
      
      {cart.length > 0 ? (
        <div className="bg-white rounded-[30px] shadow-2xl p-8 md:p-10 border border-gray-100">
          <div className="space-y-8">
            {cart.map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-gray-100 last:border-0 last:pb-0">
                
                {/* প্রোজেক্ট থাম্বনেইল/ভিডিও অংশ */}
                <div className="w-full sm:w-32 h-32 bg-slate-100 rounded-[20px] overflow-hidden flex-shrink-0 shadow-inner">
                  <video 
                    src={item.videoUrl} 
                    className="w-full h-full object-cover"
                    muted 
                  />
                </div>

                {/* প্রোজেক্ট ডিটেইলস */}
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="font-bold text-slate-800 text-xl mb-1">{item.description}</h3>
                  <p className="text-blue-600 font-black text-lg">{item.price} TK</p>
                </div>

                {/* রিমুভ বাটন */}
                <button 
                  onClick={() => removeFromCart(index)}
                  className="bg-red-50 text-red-500 px-6 py-2 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all active:scale-95 border border-red-100"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* টোটাল সেকশন */}
          <div className="mt-12 pt-8 border-t-2 border-slate-900 flex justify-between items-center">
            <span className="text-2xl font-black text-slate-800 uppercase tracking-tight">Total:</span>
            <span className="text-3xl font-black text-green-600 tracking-tighter">{totalPrice} TK</span>
          </div>

          {/* পেমেন্ট বাটন - এখানে ক্লিক করলে সরাসরি Payment পেজে নিয়ে যাবে */}
          <button 
            onClick={() => setView('payment')} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[20px] mt-10 shadow-xl shadow-blue-200 transition-all active:scale-95 text-lg uppercase tracking-wider"
          >
            Proceed to Checkout
          </button>
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-[40px] shadow-sm border border-dashed border-gray-200">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-slate-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </div>
          <p className="text-gray-400 font-medium mb-6">আপনার কার্টটি এখন খালি আছে!</p>
          <button 
            onClick={() => setView('home')} 
            className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all"
          >
            প্রোজেক্ট দেখুন
          </button>
        </div>
      )}
    </div>
  );
};

export default Checkout;