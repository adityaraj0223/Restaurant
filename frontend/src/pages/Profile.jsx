import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Phone, Mail, Save, Image as ImageIcon } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://restaurant-mdtm.onrender.com';
      const response = await fetch(`${API_URL}/api/users/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        dispatch(login({ ...user, ...data.user }));
        toast.success("Profile saved securely in MongoDB!");
      } else {
        toast.error("Failed to save profile: " + data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error while saving profile.");
      // Fallback for local
      dispatch(login({ ...user, ...formData }));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="pt-24 pb-12 max-w-4xl mx-auto px-4 relative z-10 min-h-screen">
      <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-white mb-2">Complete Profile</h1>
        <p className="text-gray-400">Update your details for faster delivery and personalized dining.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-1">
          <div className="glass-card p-6 rounded-3xl text-center border border-white/10">
            <div className="w-32 h-32 mx-auto rounded-full bg-gray-800 border-4 border-primary/30 flex items-center justify-center mb-4 relative overflow-hidden group cursor-pointer">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-gray-500" />
              )}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ImageIcon size={24} className="text-white" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-white">{formData.name || 'Guest'}</h2>
            <p className="text-sm text-gray-400 mb-4">{formData.email || formData.phone || 'New User'}</p>
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <p className="text-xs text-gray-400 font-bold uppercase mb-1">Profile Completion</p>
              <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
                <div className="bg-green-400 h-2 rounded-full w-[60%]"></div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-2">
          <form onSubmit={handleSave} className="glass-card p-8 rounded-3xl border border-white/10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-400 mb-1 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary" required />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400 mb-1 block">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-400 mb-1 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary" />
              </div>
            </div>

            <hr className="border-white/5 my-6" />

            <h3 className="font-bold text-white mb-4">Delivery Address</h3>
            
            <div>
              <label className="text-sm font-medium text-gray-400 mb-1 block">Street Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-500" size={16} />
                <textarea rows="2" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary" placeholder="House/Flat No., Street Name" required></textarea>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="col-span-2 md:col-span-1">
                <label className="text-sm font-medium text-gray-400 mb-1 block">City</label>
                <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary" required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400 mb-1 block">State</label>
                <input type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary" required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400 mb-1 block">Pincode</label>
                <input type="text" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary" required />
              </div>
            </div>

            <button type="submit" disabled={isSaving} className="w-full bg-primary text-white font-bold py-4 rounded-xl mt-4 hover:bg-primary/90 transition-all flex justify-center items-center gap-2">
              {isSaving ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : <><Save size={20} /> Save Profile</>}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
