import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, Flame, Share2, Check, Sparkles, BrainCircuit, Star } from 'lucide-react';
import { menuData, categories } from '../data/menuData';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import toast from 'react-hot-toast';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI("AIzaSyAFKfqh2NvlB7rtZe1tkX6-n_R0GKUZ7fQ");

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("Analyzing current trends...");
  const dispatch = useDispatch();

  useEffect(() => {
    generateAIRecommendation();
  }, []);

  const generateAIRecommendation = async () => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const timeOfDay = new Date().getHours();
      let timeContext = "evening";
      if (timeOfDay < 12) timeContext = "morning";
      else if (timeOfDay < 17) timeContext = "afternoon";

      const prompt = `You are an AI for a premium futuristic restaurant called LuminaDine. It is currently ${timeContext}. Based on this short menu: "Butter Chicken, Dal Makhani, Truffle Mushroom Pizza, Sushi, Triple Sundae, Cold Coffee", generate a single short 1-sentence engaging food recommendation for the user. Do not use quotes.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      setAiSuggestion(response.text().trim());
    } catch (error) {
      console.error("AI Recommendation Error:", error);
      setAiSuggestion("It's a beautiful evening. We recommend pairing our signature Butter Chicken with fresh Garlic Naan.");
    }
  };

  const filteredMenu = menuData.filter(item => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
    toast.success(`Added ${item.name} to cart!`);
  };

  const handleShare = async (item) => {
    const shareData = {
      title: `Try this amazing ${item.name} at LuminaDine!`,
      text: `I highly recommend the ${item.name} for just ₹${item.price}. Check it out!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.title} ${shareData.url}`);
        toast.success(`Link copied to clipboard!`);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className="py-24 relative z-10 min-h-screen">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Explore <span className="gradient-text">Menu</span></h1>
        
        {/* Real AI Recommendation Banner */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute -right-10 -top-10 opacity-10">
            <Sparkles size={200} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"></div>
          
          <div className="bg-black/50 p-4 rounded-2xl text-primary border border-white/5 relative z-10 shadow-inner">
            <BrainCircuit size={32} className="animate-pulse" />
          </div>
          <div className="relative z-10">
            <h3 className="font-bold text-white text-xl flex items-center gap-3 mb-2">
              Gemini AI Insight 
              <span className="text-[10px] bg-primary text-white px-2 py-1 rounded-full uppercase tracking-wider font-bold animate-pulse shadow-[0_0_10px_rgba(255,71,87,0.5)]">Live</span>
            </h3>
            <p className="text-gray-300 font-medium text-lg">
              {aiSuggestion}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <div className="flex overflow-x-auto w-full pb-4 md:pb-0 gap-3 hide-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all duration-300 border backdrop-blur-md ${
                activeCategory === cat 
                  ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-105' 
                  : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative w-full md:w-72 flex-shrink-0 group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search culinary delights..." 
              className="w-full pl-12 pr-4 py-3 bg-black/50 border border-white/10 text-white placeholder-gray-500 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all backdrop-blur-md"
            />
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <AnimatePresence>
          {filteredMenu.length > 0 ? (
            filteredMenu.map((item, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: (idx % 12) * 0.05 }}
                key={item.id}
                className="glass-card rounded-[32px] p-6 border border-white/5 group hover:border-white/20 transition-all flex flex-col hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
              >
                <div className="relative w-full h-48 bg-gray-900 rounded-2xl mb-6 flex items-center justify-center overflow-hidden group">
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                  
                  {/* Skeleton Loader (visible before image loads) */}
                  <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
                  
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    loading="lazy" 
                    className="w-full h-full object-cover z-0 relative transform group-hover:scale-110 transition-transform duration-500 blur-0"
                    onLoad={(e) => {
                      e.target.previousSibling.style.display = 'none';
                    }}
                  />
                  
                  <button 
                    onClick={() => handleShare(item)}
                    className="absolute top-3 right-3 bg-black/60 backdrop-blur-md p-2.5 rounded-full shadow-lg text-gray-400 hover:text-white border border-white/10 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 z-20"
                    title="Share this dish"
                  >
                    <Share2 size={16} />
                  </button>
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      {item.tag && (
                        <span className="inline-block text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full mb-3 uppercase tracking-wider">
                          {item.tag}
                        </span>
                      )}
                      <h3 className="text-xl font-bold text-white leading-tight">{item.name}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-400 mb-4">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" /> {item.rating}
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-auto pt-5 border-t border-white/5">
                  <span className="text-2xl font-black text-white">₹{item.price}</span>
                  <button 
                    onClick={() => handleAddToCart(item)}
                    className="bg-white text-black p-3.5 rounded-xl hover:bg-primary hover:text-white transition-colors focus:scale-95 shadow-lg"
                  >
                    <Plus size={20} className="stroke-[3]" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-500 text-xl font-medium">No dishes found matching your search.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Menu;
