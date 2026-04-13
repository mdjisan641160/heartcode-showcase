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
  const [isMenuOpen, setIsMenuOpen] = useState(false); // মোবাইল মেনুর জন্য স্টেট

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
    const priceNum = parseInt(item.price.replace(/[^\d]/g, '')) || 0;
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
            HeartCode <span className="text-pink-500">Studio</span>
          </h1>
          
          <div className="flex items-center gap-2 md:gap-4">
            {/* Desktop Menu */}
            <div className="hidden lg:flex gap-2">
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
            </div>

            {/* Cart Icon (Always Visible) */}
            <div 
              onClick={() => setView('cart')} 
              className="relative cursor-pointer bg-slate-100 p-2 rounded-full hover:bg-slate-200 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full font-bold">
                {cart.length}
              </span>
            </div>

            {/* User Profile Image */}
            <button 
              onClick={() => setView('profile')} 
              className={`p-0.5 rounded-full border-2 transition-all ${view === 'profile' ? 'border-blue-600' : 'border-transparent'}`}
            >
              <img 
                src={userData.photo || "https://via.placeholder.com/150"} 
                alt="User" 
                className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover shadow-sm" 
              />
            </button>

            {/* Mobile 3-Dot Menu Button */}
            <div className="relative lg:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 bg-slate-100 rounded-full text-slate-600 active:bg-slate-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                </svg>
              </button>

              {/* Mobile Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-[60] animate-in fade-in zoom-in duration-200">
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

        {view === 'profile' && <Profile setUserData={(data) => {
          setUserData(data);
          localStorage.setItem('logged_in_user', JSON.stringify(data));
        }} />}

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
              className="btn btn-md md:btn-lg bg-green-500 hover:bg-green-600 text-white border-none shadow-2xl rounded-2xl animate-bounce"
            >
              Checkout ({cart.length})
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;