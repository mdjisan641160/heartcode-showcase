import React from 'react';

const WishlistPage = ({ wishlist, toggleWishlist, addToCart }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-black text-slate-800 mb-8 italic uppercase text-left">
        My <span className="text-pink-500">❤️</span> Wishlist
      </h2>
      
      {wishlist.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[40px] shadow-sm border border-dashed border-slate-200">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-slate-400 font-bold uppercase tracking-widest">আপনার উইশলিস্ট খালি!</p>
          <button 
            onClick={() => window.location.reload()} // বা আপনার হোম ভিউতে যাওয়ার লজিক
            className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg"
          >
            Explore Projects
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlist.map((p) => (
            <div key={p.id} className="bg-white rounded-[25px] shadow-sm hover:shadow-2xl transition-all border overflow-hidden flex flex-col group relative">
              
              {/* উইশলিস্ট থেকে রিমুভ করার বাটন */}
              <button 
                onClick={() => toggleWishlist(p)}
                className="absolute top-4 right-4 z-30 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="red" 
                  className="w-5 h-5"
                >
                  <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              </button>

              {/* ভিডিও সেকশন */}
              <div className="aspect-video bg-black relative">
                <video src={p.videoUrl} controls className="w-full h-full object-cover" />
              </div>
              
              {/* কন্টেন্ট সেকশন */}
              <div className="p-6 flex flex-col flex-grow text-left">
                <h3 className="text-lg font-bold text-slate-800 mb-4 line-clamp-2">{p.description}</h3>
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-2xl font-black text-blue-600">{p.price} <small className="text-sm font-bold">TK</small></span>
                  <button 
                    onClick={() => addToCart(p)}
                    className="bg-slate-900 hover:bg-black text-white px-6 py-2 rounded-xl font-bold transition-all active:scale-90"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;