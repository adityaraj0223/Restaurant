import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, UtensilsCrossed, Menu as MenuIcon, Sparkles, LogOut, LayoutDashboard, Settings, UserCircle } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../store/authSlice';
import toast from 'react-hot-toast';

const Navbar = () => {
  const totalQuantity = useSelector(state => state.cart.totalQuantity);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setShowProfile(false);
    toast.success("Successfully logged out!");
    navigate('/');
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 bg-black/40 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-br from-primary to-orange-500 text-white p-2.5 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-primary/30">
                <UtensilsCrossed size={24} />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white flex items-center">
                Lumina<span className="text-primary">Dine</span>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="ml-1 text-primary opacity-50"
                >
                  <Sparkles size={16} />
                </motion.div>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-10">
            {['Home', 'Menu', 'Dining', 'Tracking'].map((item) => (
              <Link 
                key={item}
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                className="relative text-gray-300 hover:text-white font-medium transition-colors group text-sm uppercase tracking-wider"
              >
                {item}
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
            ))}
            
            <div className="w-px h-6 bg-gray-800"></div>

            <Link to="/cart" className="relative text-gray-300 hover:text-white transition-colors group">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <ShoppingCart size={24} />
              </motion.div>
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg shadow-primary/50 animate-pulse">
                  {totalQuantity}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity outline-none"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-10 h-10 rounded-full border-2 border-primary/50 shadow-lg shadow-primary/20" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-orange-500 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </button>

                <AnimatePresence>
                  {showProfile && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-64 glass-card border border-white/10 rounded-2xl shadow-2xl py-2 overflow-hidden z-50 bg-[#0a0a0a]/90 backdrop-blur-xl"
                    >
                      <div className="px-4 py-3 border-b border-white/5 mb-2">
                        <p className="text-sm font-bold text-white">{user?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email || user?.phone}</p>
                      </div>
                      
                      <Link to="/profile" onClick={() => setShowProfile(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                        <UserCircle size={16} className="text-blue-400" /> My Profile
                      </Link>
                      
                      {user?.isAdmin && (
                        <Link to="/admin" onClick={() => setShowProfile(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-primary hover:bg-white/5 transition-colors">
                          <LayoutDashboard size={16} /> Admin Dashboard
                        </Link>
                      )}
                      
                      <Link to="/settings" onClick={() => setShowProfile(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                        <Settings size={16} className="text-gray-400" /> Settings
                      </Link>
                      
                      <div className="border-t border-white/5 mt-2 pt-2">
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-5 py-2.5 rounded-full hover:bg-white/10 transition-colors backdrop-blur-md shadow-lg">
                <User size={18} />
                <span className="font-medium text-sm tracking-wide">Sign In</span>
              </Link>
            )}
          </div>
          
          <div className="md:hidden flex items-center gap-4">
            {isAuthenticated && (
               <button onClick={() => navigate('/profile')} className="w-8 h-8 rounded-full border border-primary overflow-hidden">
                 {user?.avatar && <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />}
               </button>
            )}
            <button className="text-gray-300 hover:text-white p-2">
              <MenuIcon size={28} />
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
