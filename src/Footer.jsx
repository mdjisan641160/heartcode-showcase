import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#0b1120] text-gray-300 pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* ১. ব্র্যান্ডিং সেকশন */}
          <div>
            <h2 className="text-3xl font-bold text-blue-500 mb-6">HeartCode Studio</h2>
            <p className="text-gray-400 leading-relaxed text-justify">
              আপনার পছন্দের সেরা ডিজিটাল গিফট এবং ওয়েবসাইট সংগ্রহ করুন আমাদের কাছ থেকে। 
              আমরা দিচ্ছি ১০০% কোয়ালিটি সম্পন্ন প্রোজেক্টের নিশ্চয়তা। আপনার ডিজিটাল 
              স্মৃতিগুলো আরও রাঙিয়ে তুলতে আমাদের কোড হোক আপনার সঙ্গী।
            </p>
          </div>

          {/* ২. কুইক লিংকস */}
          <div className="md:ml-12">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-2 inline-block">
              Quick Links
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-2 hover:text-blue-500 cursor-pointer transition-all">
                <span>›</span> Home
              </li>
              <li className="flex items-center gap-2 hover:text-blue-500 cursor-pointer transition-all">
                <span>›</span> Shopping Cart
              </li>
              <li className="flex items-center gap-2 hover:text-blue-500 cursor-pointer transition-all">
                <span>›</span> Login / Register
              </li>
              <li className="flex items-center gap-2 hover:text-blue-500 cursor-pointer transition-all">
                <span>›</span> My Profile
              </li>
            </ul>
          </div>

          {/* ৩. কন্টাক্ট ইনফো */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-2 inline-block">
              Contact Us
            </h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <span className="text-pink-500 text-xl">📍</span>
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-pink-500 text-xl">📞</span>
                <span>+88017XXXXXXXX (আপনার নম্বর)</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-pink-500 text-xl">✉️</span>
                <span>heartcodestudio@gmail.com</span>
              </li>
              <li className="flex items-start gap-4 hover:text-green-500 cursor-pointer transition-all">
                <span className="text-green-500 text-xl">💬</span>
                <span>WhatsApp Chat</span>
              </li>
            </ul>
          </div>

        </div>

        {/* নিচের কপিরাইট অংশ */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-500 mb-2">
            © 2026 <span className="text-blue-500 font-bold">HeartCode Studio</span>. All Rights Reserved.
          </p>
          <div className="flex justify-center items-center gap-2 text-xs text-gray-600">
             <div className="h-[1px] w-10 bg-gray-700"></div>
             Developed by <span className="text-gray-400">Your Name</span>
             <div className="h-[1px] w-10 bg-gray-700"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;