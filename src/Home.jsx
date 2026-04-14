import React, { useState, useEffect } from 'react';
import { db } from './firebase.config';
import { ref, onValue, update, push, set } from "firebase/database";

const Home = ({ addToCart, wishlist = [], toggleWishlist }) => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  const [selectedProject, setSelectedProject] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const categories = ['All', 'Anniversary', 'Proposal', 'Birthday', 'Wedding', 'Love'];

  useEffect(() => {
    const projectsRef = ref(db, 'projects');
    onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] })).reverse();
        setProjects(list);
      }
    });
  }, []);

  // ভিডিও রেন্ডার করার জন্য সর্বোচ্চ সাপোর্ট সম্বলিত ফাংশন
  const renderMedia = (url) => {
    if (!url) return <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">No Preview</div>;

    // সোশ্যাল মিডিয়া লিঙ্ক (YouTube/Facebook) হ্যান্ডেল করা
    if (url.includes("facebook.com") || url.includes("fb.watch") || url.includes("youtube.com") || url.includes("youtu.be") || url.includes("fb.gg")) {
      let embedUrl = url;
      
      // ফেসবুকের জন্য (Reels, Watch, Plugins) এম্বেড লিঙ্ক তৈরি
      if (url.includes("facebook.com") || url.includes("fb.watch") || url.includes("fb.gg")) {
        let finalUrl = url;
        
        // রিল লিঙ্ক হলে আইডি ক্লিন করে ওয়াচ মোডে নেওয়া (আইফ্রেম স্ট্যাবিলিটির জন্য)
        if (url.includes("/reel/")) {
          const parts = url.split("/reel/");
          const reelId = parts[1]?.split("/")[0]?.split("?")[0]; 
          finalUrl = `https://www.facebook.com/watch/?v=${reelId}`;
        }
        
        embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(finalUrl)}&show_text=false&width=560`;
      } 
      // ইউটিউবের জন্য এম্বেড লিঙ্ক তৈরি
      else if (url.includes("youtube.com") || url.includes("youtu.be")) {
        const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop()?.split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }

      return (
        <iframe 
          src={embedUrl} 
          className="w-full h-full aspect-video rounded-t-[25px]" 
          allowFullScreen 
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        ></iframe>
      );
    }

    // লোকাল পাথ বা সরাসরি ভিডিও ফাইল (.mp4) হলে
    return (
      <video 
        key={url}
        src={url} 
        controls 
        preload="metadata"
        className="w-full h-full object-cover rounded-t-[25px]" 
        onError={(e) => {
          e.target.parentElement.innerHTML = '<div class="text-slate-500 text-xs p-4 text-center">Video Not Found (Check Path)</div>';
        }}
      />
    );
  };

  const handleReviewSubmit = (productId) => {
    if (rating === 0) return alert("দয়া করে স্টার রেটিং দিন!");
    
    const reviewRef = ref(db, `projects/${productId}/reviews`);
    const newReviewRef = push(reviewRef);
    
    const reviewData = {
      rating,
      comment,
      date: new Date().toLocaleDateString()
    };

    set(newReviewRef, reviewData).then(() => {
      alert("রিভিউ সফলভাবে যোগ হয়েছে!");
      setRating(0);
      setComment('');
      setSelectedProject(null);
    });
  };

  const getAverageRating = (reviews) => {
    if (!reviews) return 0;
    const revList = Object.values(reviews);
    const total = revList.reduce((acc, curr) => acc + curr.rating, 0);
    return (total / revList.length).toFixed(1);
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || p.description.toLowerCase().includes(activeCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      
      {/* ১. সার্চ এবং ক্যাটাগরি সেকশন */}
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-black text-slate-800 mb-6 italic uppercase">Find Your Perfect Project</h2>
        
        <div className="relative mb-6 group">
          <input 
            type="text" 
            placeholder="Search projects (e.g. Birthday, Anniversary...)" 
            className="w-full px-6 py-4 rounded-2xl bg-white shadow-lg border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute right-5 top-4 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                activeCategory === cat 
                ? 'bg-slate-800 text-white shadow-md' 
                : 'bg-white text-slate-500 border border-slate-200 hover:border-blue-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ২. প্রজেক্ট গ্রিড */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((p) => {
            const isInWishlist = wishlist.some(item => item.id === p.id);
            const avgRating = getAverageRating(p.reviews);
            const reviewCount = p.reviews ? Object.keys(p.reviews).length : 0;
            
            return (
              <div key={p.id} className="bg-white rounded-[25px] shadow-sm hover:shadow-2xl transition-all border overflow-hidden flex flex-col group relative">
                
                <button 
                  onClick={() => toggleWishlist(p)}
                  className="absolute top-4 right-4 z-20 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg transition-transform active:scale-90 hover:scale-110"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill={isInWishlist ? "red" : "none"} 
                    stroke={isInWishlist ? "red" : "currentColor"} 
                    strokeWidth={2} 
                    className="w-5 h-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                </button>

                <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden">
                  {renderMedia(p.videoUrl)}
                  
                  {activeCategory !== 'All' && (
                    <div className="absolute top-3 left-3 bg-blue-600 text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase z-10">
                      {activeCategory}
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex flex-col flex-grow text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-500 font-bold">★ {avgRating}</span>
                    <span className="text-slate-400 text-xs">({reviewCount} reviews)</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 mb-4 line-clamp-2">{p.description}</h3>

                  <div className="flex gap-2 mb-4">
                    {p.github && (
                      <a 
                        href={p.github} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex-1 text-center py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase transition-all"
                      >
                         GitHub Code
                      </a>
                    )}
                    {p.netlify && (
                      <a 
                        href={p.netlify} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex-1 text-center py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-[10px] font-black uppercase transition-all"
                      >
                         Live Demo
                      </a>
                    )}
                  </div>
                  
                  <div className="mb-4 bg-slate-50 p-3 rounded-xl">
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button 
                          key={num} 
                          onClick={() => { setSelectedProject(p.id); setRating(num); }}
                          className={`text-lg ${ (selectedProject === p.id ? rating : 0) >= num ? 'text-yellow-500' : 'text-slate-300'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <input 
                      type="text" 
                      placeholder="Write a review..."
                      className="w-full text-xs p-2 rounded-lg border border-slate-200 outline-none"
                      onChange={(e) => { setSelectedProject(p.id); setComment(e.target.value); }}
                      value={selectedProject === p.id ? comment : ''}
                    />
                    {selectedProject === p.id && rating > 0 && (
                      <button 
                        onClick={() => handleReviewSubmit(p.id)}
                        className="mt-2 text-[10px] bg-slate-800 text-white px-3 py-1 rounded-lg uppercase font-bold"
                      >
                        Post Review
                      </button>
                    )}
                  </div>

                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-2xl font-black text-blue-600">{p.price} <small className="text-sm font-bold">TK</small></span>
                    <button 
                      onClick={() => addToCart(p)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold transition-all active:scale-90"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-20 bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
            <p className="text-slate-400 font-bold italic uppercase tracking-widest">No projects found for "{searchTerm || activeCategory}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;