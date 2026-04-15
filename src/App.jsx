import React, { useState, useEffect } from 'react';
import Home from './Home';
import Admin from './Admin';
import Footer from './Footer';
import Checkout from './Checkout';
import Payment from './Payment';
import MyOrders from './MyOrders';
import WishlistPage from './Wishlist';
import Profile from './Profile';
import Auth from './Auth';

function App() {
  const [view, setView] = useState('home'); 
  const [cart, setCart] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('logged_in_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('jixen_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('jixen_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (project) => {
    const isExist = wishlist.find(item => item.id === project.id);
    if (isExist) {
      setWishlist(wishlist.filter(item => item.id !== project.id));
    } else {
      setWishlist([...wishlist, project]);
    }
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
    alert("ব্যাগ-এ যোগ করা হয়েছে!");
  };

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  const totalPrice = cart.reduce((sum, item) => {
    const priceNum = parseInt(item.price.toString().replace(/[^\d]/g, '')) || 0;
    return sum + priceNum;
  }, 0);

  const handleLogout = () => {
    localStorage.removeItem('logged_in_user');
    setUserData(null);
    setView('home');
  };

  if (!userData) {
    return <Auth setUserData={(data) => {
      setUserData(data);
      localStorage.setItem('logged_in_user', JSON.stringify(data));
    }} />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafd] flex flex-col text-left">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-black italic text-slate-800 cursor-pointer" onClick={() => setView('home')}>
            HeartCode <span className="text-pink-500">Studio BD</span>
          </h1>
          
          <div className="flex items-center gap-2 md:gap-4">
            {/* Desktop Menu */}
            <div className="hidden lg:flex gap-2 items-center">
              <button 
                onClick={() => setView('home')} 
                className={`px-4 py-2 rounded-full font-bold transition-all ${view === 'home' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                Home
              </button>
              
              <button 
                onClick={() => setView('wishlist')} 
                className={`px-4 py-2 rounded-full font-bold flex items-center gap-1 transition-all ${view === 'wishlist' ? 'bg-pink-500 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <span>❤️</span> Wishlist
              </button>
              
              <button 
                onClick={() => setView('my-orders')} 
                className={`px-4 py-2 rounded-full font-bold transition-all ${view === 'my-orders' ? 'bg-purple-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                My Orders
              </button>

              {userData?.role === 'admin' && (
                <button 
                  onClick={() => setView('admin')} 
                  className={`px-4 py-2 rounded-full font-bold transition-all ${view === 'admin' ? 'bg-pink-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  Admin
                </button>
              )}

              <button 
                onClick={handleLogout} 
                className="px-4 py-2 rounded-full font-bold text-red-500 hover:bg-red-50 transition-all ml-2"
              >
                Logout
              </button>
            </div>

            {/* Cart Icon */}
            <div 
              onClick={() => setView('cart')} 
              className="relative cursor-pointer bg-slate-100 p-2 rounded-full hover:bg-slate-200 transition-all shadow-sm"
              style={{ backgroundColor: '#f1f5f9' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6" style={{ color: '#1e293b' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <span 
                className="absolute -top-1 -right-1 text-white text-[10px] w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full font-black shadow-sm"
                style={{ backgroundColor: '#ef4444', color: '#ffffff', zIndex: 10 }}
              >
                {cart.length}
              </span>
            </div>

            {/* User Profile */}
            <button 
              onClick={() => setView('profile')} 
              className={`p-0.5 rounded-full border-2 transition-all ${view === 'profile' ? 'border-blue-600' : 'border-transparent'}`}
            >
              <img 
                src={userData.photo || "https://via.placeholder.com/150"} 
                alt="User" 
                className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover shadow-sm bg-white" 
              />
            </button>

            {/* Mobile 3-Dot Menu */}
            <div className="relative lg:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 bg-slate-100 rounded-full text-slate-600 active:bg-slate-200"
                style={{ backgroundColor: '#f1f5f9' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6" style={{ color: '#475569' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                </svg>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-[60] animate-in fade-in zoom-in duration-200">
                  <button onClick={() => { setView('home'); setIsMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">🏠 Home</button>
                  <button onClick={() => { setView('wishlist'); setIsMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">❤️ Wishlist</button>
                  <button onClick={() => { setView('my-orders'); setIsMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">📦 My Orders</button>
                  {userData?.role === 'admin' && (
                    <button onClick={() => { setView('admin'); setIsMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm font-bold text-pink-600 hover:bg-slate-50">🛠️ Admin Panel</button>
                  )}
                  <div className="border-t border-slate-50 my-1"></div>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50">🚪 Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {view === 'home' && (
          <Home 
            addToCart={addToCart} 
            wishlist={wishlist} 
            toggleWishlist={toggleWishlist} 
          />
        )}
        
        {view === 'admin' && <Admin />}
        
        {view === 'wishlist' && (
          <WishlistPage 
            wishlist={wishlist} 
            toggleWishlist={toggleWishlist} 
            addToCart={addToCart}
          />
        )}

        {/* Profile Component Update */}
        {view === 'profile' && (
          <Profile 
            userData={userData}
            setUserData={(data) => {
              setUserData(data);
              localStorage.setItem('logged_in_user', JSON.stringify(data));
            }} 
          />
        )}

        {view === 'cart' && (
          <Checkout 
            cart={cart} 
            removeFromCart={removeFromCart} 
            setView={setView} 
          />
        )}
        
        {view === 'payment' && (
          <Payment 
            totalPrice={totalPrice} 
            setView={setView} 
            setCart={setCart} 
          />
        )}

        {view === 'my-orders' && (
          <MyOrders setView={setView} />
        )}
        
        {cart.length > 0 && view === 'home' && (
          <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100]">
            <button 
              onClick={() => setView('cart')} 
              className="px-6 py-4 bg-green-500 hover:bg-green-600 text-white border-none shadow-2xl rounded-2xl animate-bounce font-bold flex items-center gap-2"
              style={{ backgroundColor: '#22c55e', color: '#ffffff' }}
            >
              Checkout ({cart.length})
            </button>
          </div>
        )}
        
        <a 
          href="https://wa.me/8801787171252" 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-6 left-6 z-[100] bg-[#25D366] p-4 rounded-full shadow-2xl hover:scale-110 transition-all active:scale-95"
          style={{ backgroundColor: '#25D366' }}
        >
          <svg className="w-6 h-6 fill-white" viewBox="0 0 448 512">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.1 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.4-8.6-44.6-27.6-16.5-14.7-27.6-32.8-30.8-38.4-3.2-5.6-.3-8.6 2.5-11.4 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.2 3.7-5.5 5.5-9.3 1.9-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.5 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.5 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
          </svg>
        </a>
      </main>

      <Footer />
    </div>
  );
}

export default App;