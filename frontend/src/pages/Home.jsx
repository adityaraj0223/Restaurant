import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Clock, MapPin, Sparkles, BrainCircuit, ScanLine } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const scrollToFeatures = () => {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-32 pb-24 pt-16">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/20 rounded-full blur-[120px]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center">
        <div className="flex flex-col-reverse lg:flex-row items-center w-full gap-12">
          
          <div className="w-full lg:w-1/2 z-10 relative">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-white/5 border border-white/10 text-primary text-sm font-semibold mb-8 backdrop-blur-sm">
                <Sparkles size={16} className="text-orange-400" />
                <span className="text-gray-300">Welcome to the future of dining</span>
              </div>
              
              <h1 className="text-6xl lg:text-8xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
                AI-Powered <br/>
                <span className="gradient-text">Smart Dining</span> <br/>
                Ecosystem.
              </h1>
              
              <p className="text-xl text-gray-400 mb-10 max-w-lg leading-relaxed font-light">
                Experience the intersection of luxury gastronomy and artificial intelligence. Personalized recommendations, live kitchen tracking, and seamless automation.
              </p>
              
              <div className="flex flex-wrap items-center gap-6">
                <Link to="/menu" className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105">
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative flex items-center gap-2 group-hover:text-white transition-colors">
                    Order Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                
                <button onClick={scrollToFeatures} className="px-8 py-4 rounded-full font-bold text-lg text-white border border-white/20 hover:bg-white/5 transition-colors backdrop-blur-sm">
                  Explore AI Features
                </button>
              </div>
            </motion.div>
          </div>
          
          {/* Cinematic Right Visual */}
          <div className="w-full lg:w-1/2 h-[500px] lg:h-[700px] relative perspective-1000">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* Central Glowing Orb */}
              <div className="absolute w-64 h-64 bg-gradient-to-br from-primary to-orange-500 rounded-full blur-[80px] animate-pulse"></div>
              
              {/* Glassmorphism Mockup Card */}
              <motion.div 
                animate={{ y: [-15, 15, -15], rotateX: [5, -5, 5] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 w-80 h-[450px] glass-card rounded-[40px] border border-white/10 shadow-2xl flex flex-col items-center p-6 overflow-hidden"
              >
                <div className="w-full flex justify-between items-center mb-8">
                  <div className="w-12 h-4 bg-white/20 rounded-full"></div>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><ScanLine size={16} className="text-white/50" /></div>
                </div>
                
                <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-gray-900 to-gray-800 p-2 shadow-[0_0_50px_rgba(255,71,87,0.3)] mb-8 flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 rounded-full border border-primary/30 animate-[spin_10s_linear_infinite] z-20"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1552611052-33e04de081de?w=800&q=80" 
                    alt="Spicy Ramen Bowl" 
                    className="w-full h-full rounded-full object-cover z-10"
                  />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">Spicy Ramen Bowl</h3>
                <p className="text-primary text-sm font-semibold mb-6">AI Match: 98% based on weather</p>
                
                <div className="w-full h-12 bg-white text-black rounded-2xl flex items-center justify-center font-bold">
                  Add to Order — ₹450
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div 
                className="absolute top-20 right-10 glass px-6 py-4 rounded-2xl border border-white/10 shadow-xl"
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <div className="flex items-center gap-3">
                  <BrainCircuit className="text-primary" />
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Smart Insight</p>
                    <p className="text-sm text-white font-bold">Rain detected. Recommending Hot Soups.</p>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* Features/Highlights Section */}
      <section id="features" className="pt-24 relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-6"
          >
            Powered by <span className="gradient-text">Intelligence</span>
          </motion.h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">We combine top-tier culinary expertise with cutting-edge artificial intelligence to deliver an unmatched dining experience.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Star className="text-orange-400" size={32} />, title: "AI Recommendations", desc: "Our Gemini-powered engine suggests meals based on time of day, weather, and dynamic restaurant context." },
            { icon: <Clock className="text-blue-400" size={32} />, title: "Live Kitchen Tracking", desc: "Watch exactly when your food is being prepped, cooked, and packed with our simulated live camera feeds." },
            { icon: <MapPin className="text-green-400" size={32} />, title: "Hyperlocal Delivery", desc: "Real-time geographical route tracking ensures you know exactly when your food arrives hot and fresh." }
          ].map((feature, idx) => (
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                key={idx}
                whileHover={{ y: -10, scale: 1.02 }}
                className="glass-card p-10 rounded-3xl border border-white/5 hover:border-white/10 transition-all text-center group"
            >
              <div className="bg-white/5 w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white/10 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
      {/* Delivery & Operations Visuals */}
      <section className="pt-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
            <img src="https://images.unsplash.com/photo-1526367790999-0150786686a2?w=1200&q=80" alt="Delivery Rider" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 p-8 z-20">
              <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">Lightning Fast</span>
              <h3 className="text-3xl font-bold text-white mb-2">Hyperlocal Delivery</h3>
              <p className="text-gray-300">Track your order in real-time on our interactive map.</p>
            </div>
          </motion.div>

          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              From Kitchen to <br/><span className="gradient-text">Your Doorstep.</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Our AI-optimized routing ensures your food arrives hot, fresh, and exactly when you expect it. Watch our delivery partners on the live map.
            </p>
            <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-black/50 border border-white/10 overflow-hidden shrink-0">
                <img src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80" alt="Burger" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-white font-bold mb-1">Gourmet Burger Combo</p>
                <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2 mb-1">
                  <div className="bg-green-400 h-1.5 rounded-full w-[80%] animate-pulse"></div>
                </div>
                <p className="text-xs text-green-400 font-bold uppercase tracking-wider">Arriving in 5 mins</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof & Community */}
      <section className="pt-24 pb-12 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Loved by the <span className="gradient-text">Community</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="h-64 rounded-3xl overflow-hidden group">
            <img src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&q=80" alt="Friends Dining" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="h-64 rounded-3xl overflow-hidden group md:mt-8">
            <img src="https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=800&q=80" alt="Party" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="h-64 rounded-3xl overflow-hidden group">
            <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80" alt="Food Shot" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="h-64 rounded-3xl overflow-hidden group md:mt-8">
            <img src="https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80" alt="Chef" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
