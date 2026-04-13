import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [user, setUser] = useState({
    name: 'User Name',
    email: 'user@example.com',
    photo: 'https://via.placeholder.com/150'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempUser, setTempUser] = useState(user);

  // লোকাল স্টোরেজ থেকে ডাটা লোড করা
  useEffect(() => {
    const savedUser = localStorage.getItem('jixen_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setTempUser(JSON.parse(savedUser));
    }
  }, []);

  const handleSave = () => {
    setUser(tempUser);
    localStorage.setItem('jixen_user', JSON.stringify(tempUser));
    setIsEditing(false);
    alert("প্রোফাইল আপডেট হয়েছে!");
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempUser({ ...tempUser, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        
        <div className="px-8 pb-10">
          <div className="relative -mt-16 mb-6 flex justify-center">
            <div className="relative group">
              <img 
                src={tempUser.photo} 
                alt="Profile" 
                className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-slate-800 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-slate-700">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15a2.25 2.25 0 0 0 2.25-2.25V9.574c0-1.067-.75-1.994-1.802-2.169a48.324 48.324 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                  </svg>
                  <input type="file" className="hidden" onChange={handlePhotoChange} />
                </label>
              )}
            </div>
          </div>

          <div className="text-center space-y-4">
            {!isEditing ? (
              <>
                <h2 className="text-2xl font-black text-slate-800">{user.name}</h2>
                <p className="text-slate-500 font-medium">{user.email}</p>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="mt-4 px-8 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Edit Profile
                </button>
              </>
            ) : (
              <div className="space-y-4 text-left">
                <div>
                  <label className="text-xs font-black uppercase text-slate-400 ml-2">Full Name</label>
                  <input 
                    type="text" 
                    value={tempUser.name}
                    onChange={(e) => setTempUser({...tempUser, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase text-slate-400 ml-2">Email Address</label>
                  <input 
                    type="email" 
                    value={tempUser.email}
                    onChange={(e) => setTempUser({...tempUser, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <button 
                    onClick={handleSave}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                  >
                    Save Changes
                  </button>
                  <button 
                    onClick={() => { setIsEditing(false); setTempUser(user); }}
                    className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;