import React, { useState, useEffect } from 'react';
import { db } from './firebase.config';
import { ref, push, set, onValue, update, remove } from "firebase/database";

const Admin = () => {
  // ১. স্টেট ডিক্লারেশন
  const [isLocked, setIsLocked] = useState(true);
  const [pin, setPin] = useState('');
  const [activeTab, setActiveTab] = useState('add-project');
  const [orders, setOrders] = useState([]);
  const [projects, setProjects] = useState([]); 
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // প্রজেক্ট ইনপুট স্টেট
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [netlifyLink, setNetlifyLink] = useState('');

  const adminSecretPin = "1234";

  // ২. অথেন্টিকেশন এবং ডাটা লোড
  useEffect(() => {
    const auth = sessionStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsLocked(false);
    }

    const ordersRef = ref(db, 'orders');
    const unsubscribeOrders = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const orderList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setOrders(orderList.reverse());
      } else {
        setOrders([]);
      }
    });

    const projectsRef = ref(db, 'projects');
    const unsubscribeProjects = onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const projectList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setProjects(projectList.reverse());
      } else {
        setProjects([]);
      }
    });

    const usersRef = ref(db, 'users');
    const unsubscribeUsers = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setTotalUsers(Object.keys(data).length);
    });

    return () => {
      unsubscribeOrders();
      unsubscribeProjects();
      unsubscribeUsers();
    };
  }, []);

  // ৩. আনলক হ্যান্ডলার
  const handleUnlock = () => {
    if (pin === adminSecretPin) {
      sessionStorage.setItem('admin_authenticated', 'true');
      setIsLocked(false);
    } else {
      alert("ভুল সিক্রেট কোড!");
      setPin('');
    }
  };

  // ৪. একশন হ্যান্ডলার
  const handleConfirm = (orderId) => {
    update(ref(db, `orders/${orderId}`), { status: "CONFIRMED" }).then(() => alert("কনফার্ম হয়েছে!"));
  };

  const handleReject = (orderId) => {
    update(ref(db, `orders/${orderId}`), { status: "REJECTED" }).then(() => alert("রিজেক্ট হয়েছে!"));
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm("অর্ডারটি ডিলিট করবেন?")) {
      remove(ref(db, `orders/${orderId}`)).then(() => alert("ডিলিট হয়েছে!"));
    }
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm("এই প্রজেক্টটি ডিলিট করতে চান?")) {
      remove(ref(db, `projects/${projectId}`)).then(() => {
        alert("প্রজেক্ট সফলভাবে ডিলিট হয়েছে!");
      });
    }
  };

  const handlePublish = (e) => {
    e.preventDefault();
    let finalSource = videoUrl || (videoFile ? URL.createObjectURL(videoFile) : '');
    if (!finalSource || !desc || !price) return alert("সব তথ্য দিন!");
    
    const newRef = push(ref(db, 'projects'));
    set(newRef, { 
      videoUrl: finalSource, 
      description: desc, 
      price, 
      github: githubLink,
      netlify: netlifyLink,
      createdAt: Date.now() 
    })
      .then(() => { 
        alert("পাবলিশ হয়েছে!"); 
        setVideoUrl(''); setDesc(''); setPrice(''); setVideoFile(null);
        setGithubLink(''); setNetlifyLink('');
      });
  };

  // ৫. ফিল্টার লজিক
  const filteredOrders = orders.filter(order => {
    const currentStatus = order.status ? order.status.toUpperCase() : 'PENDING';
    const matchesSearch = 
      order.userName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      order.userPhone?.includes(searchQuery) ||
      order.paymentMethod?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || currentStatus === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  const confirmedOrders = orders.filter(order => order.status === 'CONFIRMED');
  const pendingOrders = orders.filter(order => order.status === 'PENDING' || !order.status);
  const totalRevenue = confirmedOrders.reduce((sum, order) => sum + Number(order.amount || 0), 0);

  if (isLocked) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-[35px] shadow-2xl max-w-sm w-full text-center border border-gray-100">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🔐</span>
          </div>
          <h2 className="text-xl font-black text-slate-800 mb-2 uppercase">Admin Security</h2>
          <p className="text-slate-400 text-xs mb-6 font-bold">প্রবেশ করতে আপনার ৪ ডিজিটের পিন দিন</p>
          <input 
            type="password" 
            className="input input-bordered w-full rounded-2xl mb-4 text-center text-2xl tracking-[12px] font-black focus:border-blue-500 outline-none"
            placeholder="••••"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
          />
          <button onClick={handleUnlock} className="btn bg-blue-600 hover:bg-blue-700 text-white w-full rounded-2xl border-none shadow-lg font-bold">
            Unlock Panel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4 mb-20 animate-in fade-in duration-500">
      <div className="flex justify-end mb-6">
        <button 
          onClick={() => { sessionStorage.removeItem('admin_authenticated'); window.location.reload(); }}
          className="text-[10px] font-black bg-white text-slate-400 px-4 py-2 rounded-xl shadow-sm hover:text-red-500 transition-all border border-slate-100"
        >
          🔒 LOGOUT & LOCK
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 text-left">
        <div className="bg-white p-6 rounded-[30px] shadow-sm border-l-[6px] border-blue-500">
          <h4 className="text-[10px] font-black uppercase text-slate-400 mb-1">Total Revenue</h4>
          <p className="text-2xl font-black text-slate-800">{totalRevenue} TK</p>
        </div>
        <div className="bg-white p-6 rounded-[30px] shadow-sm border-l-[6px] border-green-500">
          <h4 className="text-[10px] font-black uppercase text-slate-400 mb-1">Confirmed</h4>
          <p className="text-2xl font-black text-slate-800">{confirmedOrders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-[30px] shadow-sm border-l-[6px] border-yellow-400">
          <h4 className="text-[10px] font-black uppercase text-slate-400 mb-1">Pending</h4>
          <p className="text-2xl font-black text-slate-800">{pendingOrders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-[30px] shadow-sm border-l-[6px] border-purple-500">
          <h4 className="text-[10px] font-black uppercase text-slate-400 mb-1">Users</h4>
          <p className="text-2xl font-black text-slate-800">{totalUsers || '0'}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-10 justify-center">
        <button onClick={() => setActiveTab('add-project')} className={`px-6 py-3 rounded-2xl font-black uppercase text-sm transition-all ${activeTab === 'add-project' ? 'bg-pink-600 text-white shadow-xl scale-105' : 'bg-white text-slate-400'}`}>Add Project</button>
        <button onClick={() => setActiveTab('manage-projects')} className={`px-6 py-3 rounded-2xl font-black uppercase text-sm transition-all ${activeTab === 'manage-projects' ? 'bg-slate-800 text-white shadow-xl scale-105' : 'bg-white text-slate-400'}`}>Manage Projects ({projects.length})</button>
        <button onClick={() => setActiveTab('view-orders')} className={`px-6 py-3 rounded-2xl font-black uppercase text-sm transition-all ${activeTab === 'view-orders' ? 'bg-blue-600 text-white shadow-xl scale-105' : 'bg-white text-slate-400'}`}>Orders ({orders.length})</button>
      </div>

      {activeTab === 'add-project' && (
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-[35px] shadow-2xl border border-slate-50 text-left">
          <h2 className="text-xl font-black mb-8 text-slate-800 uppercase tracking-tight italic">Create New Project</h2>
          <form onSubmit={handlePublish} className="space-y-5">
            <div className="space-y-1">
               <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Upload Video</label>
               <input type="file" accept="video/*" className="file-input file-input-bordered w-full rounded-2xl bg-slate-50 border-none" onChange={(e) => setVideoFile(e.target.files[0])} />
            </div>
            <input type="text" placeholder="Or Video Link (URL)" className="input input-bordered w-full rounded-2xl" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
            <textarea placeholder="Project Description..." className="textarea textarea-bordered w-full rounded-2xl h-32" value={desc} onChange={(e) => setDesc(e.target.value)} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 italic">GitHub Repository</label>
                  <input type="text" placeholder="https://github.com/..." className="input input-bordered w-full rounded-2xl text-sm" value={githubLink} onChange={(e) => setGithubLink(e.target.value)} />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 italic">Netlify Live Link</label>
                  <input type="text" placeholder="https://your-site.netlify.app" className="input input-bordered w-full rounded-2xl text-sm" value={netlifyLink} onChange={(e) => setNetlifyLink(e.target.value)} />
               </div>
            </div>
            <input type="text" placeholder="Price (৳)" className="input input-bordered w-full rounded-2xl font-bold" value={price} onChange={(e) => setPrice(e.target.value)} />
            <button type="submit" className="btn bg-pink-600 hover:bg-pink-700 text-white w-full border-none rounded-2xl shadow-lg font-black uppercase tracking-widest">Publish Now</button>
          </form>
        </div>
      )}

      {activeTab === 'manage-projects' && (
        <div className="bg-white rounded-[40px] shadow-2xl p-8 border border-slate-50">
           <h2 className="text-2xl font-black text-slate-800 mb-8 uppercase italic text-left">Manage Your Projects</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {projects.map((project) => (
               <div key={project.id} className="flex items-center gap-4 p-4 border border-slate-100 rounded-[25px] hover:bg-slate-50 transition-all">
                 <div className="w-20 h-20 bg-slate-200 rounded-xl overflow-hidden flex-shrink-0">
                    <video src={project.videoUrl} className="w-full h-full object-cover" muted />
                 </div>
                 <div className="flex-grow text-left">
                   <p className="text-xs font-bold text-slate-600 line-clamp-1">{project.description}</p>
                   <p className="text-sm font-black text-pink-600">{project.price} TK</p>
                 </div>
                 <button onClick={() => handleDeleteProject(project.id)} className="p-3 bg-red-100 text-red-600 rounded-full hover:bg-red-500 hover:text-white transition-all">🗑️</button>
               </div>
             ))}
           </div>
        </div>
      )}

      {/* View Orders Tab - এটাই আপনার ডাটা দেখানোর মূল অংশ */}
      {activeTab === 'view-orders' && (
        <div className="bg-white rounded-[40px] shadow-2xl p-8 border border-slate-50 animate-in slide-in-from-bottom-5 duration-500">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-2xl font-black text-slate-800 uppercase italic">Recent Orders</h2>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Search phone or name..." 
                className="input input-bordered rounded-xl text-sm w-48"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select className="select select-bordered rounded-xl text-sm" onChange={(e) => setStatusFilter(e.target.value)}>
                <option>All</option>
                <option>Pending</option>
                <option>Confirmed</option>
                <option>Rejected</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredOrders.length > 0 ? filteredOrders.map((order) => (
              <div key={order.id} className="p-6 border border-slate-100 rounded-[30px] hover:border-blue-200 transition-all text-left bg-slate-50/30">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${order.status === 'CONFIRMED' ? 'bg-green-100 text-green-600' : order.status === 'REJECTED' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                        {order.status || 'PENDING'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">{new Date(order.createdAt).toLocaleString()}</span>
                    </div>
                    <h3 className="font-black text-slate-800 text-lg">{order.userName}</h3>
                    <p className="text-sm font-bold text-slate-500">{order.userPhone}</p>
                    <p className="text-xs text-blue-600 font-black mt-2 uppercase">Project: {order.projectName || 'Premium Script'}</p>
                    <p className="text-xs font-bold text-slate-400 mt-1">Method: {order.paymentMethod} | TrxID: {order.trxId}</p>
                  </div>
                  <div className="flex flex-col items-end justify-center gap-3">
                    <p className="text-xl font-black text-slate-800">{order.amount} TK</p>
                    <div className="flex gap-2">
                      <button onClick={() => handleConfirm(order.id)} className="btn btn-sm bg-green-500 hover:bg-green-600 text-white border-none rounded-xl px-4">Confirm</button>
                      <button onClick={() => handleReject(order.id)} className="btn btn-sm bg-slate-200 text-slate-600 border-none rounded-xl px-4">Reject</button>
                      <button onClick={() => handleDeleteOrder(order.id)} className="btn btn-sm bg-red-100 text-red-600 border-none rounded-xl">🗑️</button>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-20">
                <p className="text-slate-400 font-bold italic">No orders found!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;