import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, CreditCard, CheckCircle } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, increaseQuantity, decreaseQuantity, clearCart } from '../store/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Cart = () => {
  const { items, totalAmount } = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const deliveryFee = items.length > 0 ? 40 : 0;
  const total = totalAmount + deliveryFee;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate Razorpay/Stripe Payment Flow wait
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newOrder = {
      user: "Current User",
      items: items.map(i => i.name).join(', '),
      totalAmount: total,
      status: "Pending"
    };

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://restaurant-mdtm.onrender.com';
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      const data = await response.json();
      
      if (data.success) {
        setIsProcessing(false);
        setPaymentSuccess(true);
        toast.success("Order Placed and Saved in Database!");
        
        // Also keep local trigger for instant UI response in other tabs
        const existingOrders = JSON.parse(localStorage.getItem('adminOrders')) || [];
        localStorage.setItem('adminOrders', JSON.stringify([data.order, ...existingOrders]));
        window.dispatchEvent(new Event('storage'));

        setTimeout(() => {
          dispatch(clearCart());
          navigate('/tracking');
        }, 2000);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      toast.error("Failed to place order in DB. Continuing locally...");
      
      // Fallback
      setPaymentSuccess(true);
      const existingOrders = JSON.parse(localStorage.getItem('adminOrders')) || [];
      localStorage.setItem('adminOrders', JSON.stringify([{ id: `#LD-${Math.floor(Math.random()*1000)}`, ...newOrder }, ...existingOrders]));
      window.dispatchEvent(new Event('storage'));
      setTimeout(() => {
        dispatch(clearCart());
        navigate('/tracking');
      }, 2000);
    }
  };

  if (items.length === 0 && !paymentSuccess) {
    return (
      <div className="py-32 flex flex-col items-center justify-center text-center">
        <div className="w-48 h-48 bg-white/5 rounded-full flex items-center justify-center mb-8 text-gray-700 border border-white/5 shadow-inner">
          <ShoppingBag size={80} strokeWidth={1} />
        </div>
        <h2 className="text-4xl font-extrabold text-white mb-4">Your cart is empty</h2>
        <p className="text-gray-400 mb-10 max-w-md text-lg">Looks like you haven't added anything to your cart yet. Discover our delicious menu and start ordering.</p>
        <Link to="/menu" className="bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition-colors shadow-lg">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="py-24 max-w-5xl mx-auto relative z-10">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[30%] left-[-10%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Payment Processing Modal */}
      <AnimatePresence>
        {(isProcessing || paymentSuccess) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card p-10 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center text-center max-w-sm w-full"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-6"></div>
                  <h3 className="text-2xl font-bold text-white mb-2">Processing Payment</h3>
                  <p className="text-gray-400">Securing your transaction...</p>
                </>
              ) : (
                <>
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle size={40} />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-2">Payment Successful!</h3>
                  <p className="text-gray-400 mb-6">Redirecting to live tracking...</p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <h1 className="text-4xl font-extrabold text-white mb-10">Your <span className="gradient-text">Cart</span></h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="w-full lg:w-2/3 space-y-5">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, x: -20 }}
                transition={{ duration: 0.2 }}
                key={item.id} 
                className="glass-card p-5 rounded-3xl border border-white/5 flex items-center gap-4 sm:gap-6 hover:border-white/10 transition-colors"
              >
                <div className="w-24 h-24 bg-gray-900 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                  {/* Skeleton loader */}
                  <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover z-10 relative" 
                    loading="lazy"
                    onLoad={(e) => {
                      e.target.previousSibling.style.display = 'none';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-xl truncate mb-1">{item.name}</h3>
                  <p className="text-primary font-bold">₹{item.price}</p>
                </div>
                
                <div className="flex items-center gap-1 bg-black/50 p-1.5 rounded-xl border border-white/5">
                  <button 
                    onClick={() => dispatch(decreaseQuantity(item.id))}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-bold w-6 text-center text-white">{item.quantity}</span>
                  <button 
                    onClick={() => dispatch(increaseQuantity(item.id))}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <button 
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="p-3.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors ml-1 sm:ml-2"
                >
                  <Trash2 size={20} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="glass-card p-8 rounded-[32px] border border-white/10 sticky top-32">
            <h2 className="text-2xl font-bold text-white mb-8">Order Summary</h2>
            
            <div className="space-y-4 text-gray-400 mb-8 border-b border-white/10 pb-8">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-medium text-white">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-medium text-white">₹{deliveryFee}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-10">
              <span className="text-xl font-bold text-gray-300">Total</span>
              <span className="text-4xl font-black text-white">₹{total}</span>
            </div>

            <button 
              onClick={handlePayment}
              className="w-full bg-white text-black py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              <CreditCard size={20} />
              Pay Securely
            </button>
            <p className="text-center text-xs text-gray-500 mt-5 flex justify-center items-center gap-1 font-medium tracking-wide uppercase">
               Secured by Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
