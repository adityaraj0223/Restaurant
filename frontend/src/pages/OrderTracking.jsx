import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChefHat, CheckCircle, Clock, Navigation, Phone, MessageSquare } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const defaultCenter = [28.6139, 77.2090]; // Restaurant
const destination = [28.6250, 77.2150]; // User Location

const OrderTracking = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, title: 'Order Accepted', icon: <CheckCircle size={24} />, desc: 'AI has processed your order.' },
    { id: 2, title: 'Live Kitchen', icon: <ChefHat size={24} />, desc: 'Chef is crafting your meal.' },
    { id: 3, title: 'Out for Delivery', icon: <Navigation size={24} />, desc: 'Optimized routing active.' },
    { id: 4, title: 'Delivered', icon: <MapPin size={24} />, desc: 'Experience delivered.' }
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(2), 5000);
    const timer2 = setTimeout(() => setCurrentStep(3), 15000);
    const timer3 = setTimeout(() => setCurrentStep(4), 30000);
    return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); };
  }, []);

  return (
    <div className="py-24 max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 min-h-[85vh] relative z-10">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Live Map Section */}
      <div className="w-full lg:w-2/3 glass-card rounded-[32px] overflow-hidden shadow-2xl border border-white/10 relative min-h-[500px]">
        <MapContainer 
          center={defaultCenter} 
          zoom={13} 
          style={{ width: '100%', height: '100%', zIndex: 10, background: '#0a0a0a' }}
          zoomControl={false}
        >
          {/* Dark Mode Map Tiles */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          <Marker position={defaultCenter} />
          
          {currentStep >= 3 && (
            <>
              <Marker position={destination} />
              <Polyline 
                positions={[defaultCenter, [28.6180, 77.2120], destination]} 
                pathOptions={{ color: '#ff4757', weight: 5, dashArray: '10, 10' }} 
              />
            </>
          )}
        </MapContainer>

        {/* Live Status Overlay */}
        <div className="absolute top-6 left-6 right-6 bg-black/60 backdrop-blur-xl p-5 rounded-2xl shadow-2xl border border-white/10 flex items-center justify-between" style={{ zIndex: 1000 }}>
          <div>
            <h3 className="font-bold text-white text-lg">Estimated Arrival</h3>
            <p className="text-gray-400 font-medium">15 - 20 minutes</p>
          </div>
          <div className="bg-white/10 text-white border border-white/20 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 backdrop-blur-md">
            <Clock size={20} className="text-primary" />
            On Time
          </div>
        </div>

        {/* Delivery Partner Overlay */}
        <AnimatePresence>
          {currentStep >= 3 && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-xl p-5 rounded-2xl shadow-2xl border border-white/10 flex items-center justify-between"
              style={{ zIndex: 1000 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-tr from-gray-800 to-gray-700 rounded-full flex items-center justify-center text-2xl shadow-inner border border-white/5">
                  🛵
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Ramesh Kumar</h4>
                  <p className="text-gray-400 text-sm">Elite Partner • 4.8 <span className="text-yellow-500">★</span></p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="p-3.5 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 transition-colors backdrop-blur-md">
                  <MessageSquare size={20} />
                </button>
                <button className="p-3.5 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                  <Phone size={20} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Live Kitchen & Order Status Section */}
      <div className="w-full lg:w-1/3 glass-card p-8 rounded-[32px] shadow-2xl border border-white/10 overflow-y-auto">
        <h2 className="text-3xl font-extrabold text-white mb-10 tracking-tight">Order <span className="gradient-text">Status</span></h2>
        
        <div className="space-y-10">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;

            return (
              <div key={step.id} className="relative flex gap-6">
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className={`absolute left-7 top-14 bottom-[-2.5rem] w-0.5 ${isCompleted ? 'bg-gradient-to-b from-primary to-orange-500' : 'bg-white/10'}`}></div>
                )}
                
                {/* Icon */}
                <div className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                  isActive ? 'bg-primary text-white shadow-[0_0_20px_rgba(255,71,87,0.5)] scale-110' : 
                  isCompleted ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/5 text-gray-600 border border-white/5'
                }`}>
                  {step.icon}
                </div>

                {/* Content */}
                <div className="pt-2">
                  <h3 className={`font-bold text-xl mb-1 ${isActive ? 'text-white' : isCompleted ? 'text-gray-300' : 'text-gray-600'}`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm ${isActive ? 'text-gray-400' : isCompleted ? 'text-gray-500' : 'text-gray-700'}`}>
                    {step.desc}
                  </p>
                  
                  {/* Live Kitchen Camera Simulation */}
                  {step.id === 2 && isActive && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                      className="bg-black/60 rounded-2xl overflow-hidden relative border border-white/10 shadow-inner"
                    >
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 z-10 shadow-lg">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> LIVE
                      </div>
                      {/* Fake Video Stream */}
                      <div className="aspect-video bg-gradient-to-br from-gray-900 to-black flex items-center justify-center relative overflow-hidden">
                        {/* Scanline effect */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-20 pointer-events-none opacity-20"></div>
                        
                        <motion.div 
                          animate={{ rotate: 360, scale: [1, 1.1, 1] }} 
                          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                          className="text-6xl z-10"
                        >
                          🍳
                        </motion.div>
                      </div>
                      <p className="text-center text-xs text-gray-500 py-2 font-mono uppercase tracking-widest bg-black/80">Cam-01 // Kitchen Area</p>
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
