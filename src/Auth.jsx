import React, { useState } from 'react';

const Auth = ({ setView, setUserData }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    photo: 'https://via.placeholder.com/150' 
  });

  const handleAction = (e) => {
    e.preventDefault();

    const ADMIN_EMAIL = "mdjubayer641160@gmail.com";
    const ADMIN_PASSWORD = "Python641160";

    if (isLogin) {
      if (formData.email === ADMIN_EMAIL && formData.password === ADMIN_PASSWORD) {
        const adminUser = { 
          name: 'MD Jubayer', 
          email: ADMIN_EMAIL, 
          role: 'admin', 
          photo: 'jisan.jpeg' 
        };
        setUserData(adminUser);
        localStorage.setItem('logged_in_user', JSON.stringify(adminUser));
        setView('admin'); 
        return;
      }

      const savedUser = JSON.parse(localStorage.getItem('jixen_user'));
      if (savedUser && savedUser.email === formData.email && savedUser.password === formData.password) {
        setUserData(savedUser);
        localStorage.setItem('logged_in_user', JSON.stringify(savedUser));
        setView('home');
      } else {
        alert("ইমেইল বা পাসওয়ার্ড সঠিক নয়!");
      }
    } else {
      localStorage.setItem('jixen_user', JSON.stringify(formData));
      setUserData(formData);
      localStorage.setItem('logged_in_user', JSON.stringify(formData));
      alert("অ্যাকাউন্ট তৈরি হয়েছে!");
      setView('home');
    }
  };

  // ইনপুট ফিল্ডের জন্য কমন স্টাইল (ডার্ক মোড ফিক্স)
  const inputStyle = {
    color: '#000000',           // লেখা সব সময় কালো থাকবে
    backgroundColor: '#ffffff',  // ব্যাকগ্রাউন্ড সব সময় সাদা থাকবে
    WebkitTextFillColor: '#000000' // আইফোনের ডার্ক মোড ফিক্সের জন্য
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafd] px-4 py-12">
      <div className="bg-white p-8 md:p-12 rounded-[45px] shadow-2xl w-full max-w-md border border-slate-100 relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-pink-500 to-purple-500"></div>

        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-slate-800 italic mb-3">
            {isLogin ? 'Welcome Back!' : 'Join Us!'}
          </h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[3px]">
            {isLogin ? 'Enter your details to login' : 'Create a new account'}
          </p>
        </div>

        <form onSubmit={handleAction} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-400 ml-4 uppercase">Full Name</label>
              <input 
                type="text" placeholder="John Doe" required
                className="w-full px-6 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all text-black"
                style={inputStyle}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-400 ml-4 uppercase">Email Address</label>
            <input 
              type="email" placeholder="name@example.com" required
              className="w-full px-6 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all text-black"
              style={inputStyle}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-400 ml-4 uppercase">Password</label>
            <input 
              type="password" placeholder="••••••••" required
              className="w-full px-6 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all text-black"
              style={inputStyle}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          
          <button className="w-full py-5 bg-slate-900 text-white rounded-[20px] font-black shadow-xl hover:bg-black hover:-translate-y-1 transition-all uppercase tracking-widest mt-4">
            {isLogin ? 'Sign In' : 'Register Now'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-slate-500 font-bold text-xs">
            {isLogin ? "New here?" : "Already have an account?"} 
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-blue-600 ml-2 hover:underline font-black uppercase"
            >
              {isLogin ? 'Create Account' : 'Login'}
            </button>
          </p>
        </div>

        <p className="mt-6 text-[9px] text-center text-slate-300 font-bold uppercase tracking-tighter">
          HeartCode Studio BD &copy; 2026 - All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Auth;