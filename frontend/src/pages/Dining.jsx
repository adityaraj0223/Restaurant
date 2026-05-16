import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Users, MapPin, CheckCircle, ChefHat, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const Dining = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('2');
  const [seating, setSeating] = useState('Indoor');
  const [isBooking, setIsBooking] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleBooking = (e) => {
    e.preventDefault();
    if (!date || !time) return toast.error("Please select a date and time");
    
    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      setIsConfirmed(true);
    }, 2000);
  };

  return (
    <div className="pt-24 pb-12 min-h-screen relative z-10">
      <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-orange-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-white/5 border border-white/10 text-orange-400 text-sm font-semibold mb-4 backdrop-blur-sm">
            <Sparkles size={16} /> Exclusive Dining
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">Experience <span className="gradient-text">Luxury</span></h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Book your table for an unforgettable AI-assisted culinary journey.</p>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="h-64 rounded-3xl overflow-hidden group relative">
            <img src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&q=80" alt="Luxury Dining" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
              <h3 className="text-xl font-bold text-white">Indoor Fine Dining</h3>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="h-64 rounded-3xl overflow-hidden group relative">
            <img src="https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&q=80" alt="Rooftop Dining" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
              <h3 className="text-xl font-bold text-white">Rooftop Lounge</h3>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="h-64 rounded-3xl overflow-hidden group relative">
            <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80" alt="Private Seating" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
              <h3 className="text-xl font-bold text-white">Private Cabanas</h3>
            </div>
          </motion.div>
        </div>

        {/* Booking Form */}
        <div className="max-w-4xl mx-auto glass-card p-8 md:p-12 rounded-[40px] border border-white/10 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {!isConfirmed ? (
              <motion.form key="booking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleBooking} className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <ChefHat className="text-primary" size={28} />
                  <h2 className="text-3xl font-bold text-white">Reserve Your Table</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary focus:outline-none" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Time</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <select value={time} onChange={e => setTime(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary focus:outline-none" required>
                        <option value="">Select Time</option>
                        <option value="19:00">7:00 PM</option>
                        <option value="19:30">7:30 PM</option>
                        <option value="20:00">8:00 PM</option>
                        <option value="20:30">8:30 PM</option>
                        <option value="21:00">9:00 PM</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Guests</label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <select value={guests} onChange={e => setGuests(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary focus:outline-none">
                        {[1,2,3,4,5,6,7,8,"8+"].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Seating Preference</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <select value={seating} onChange={e => setSeating(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary focus:outline-none">
                        <option>Indoor Fine Dining</option>
                        <option>Rooftop Lounge</option>
                        <option>Private Cabana</option>
                        <option>Bar Counter</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button disabled={isBooking} type="submit" className="w-full mt-10 bg-gradient-to-r from-primary to-orange-500 text-white font-bold text-lg py-5 rounded-2xl hover:shadow-[0_0_30px_rgba(255,71,87,0.4)] transition-all flex justify-center items-center gap-3">
                  {isBooking ? <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div> : 'Confirm Reservation'}
                </button>
              </motion.form>
            ) : (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10 relative z-10">
                <div className="w-24 h-24 bg-green-500/20 text-green-400 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={48} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Table Confirmed!</h2>
                <p className="text-gray-400 text-lg mb-8">We look forward to hosting you on {new Date(date).toLocaleDateString()} at {time} for {guests} guests.</p>
                <button onClick={() => setIsConfirmed(false)} className="bg-white/10 text-white font-bold py-3 px-8 rounded-full hover:bg-white/20 transition-colors border border-white/5">
                  Book Another Table
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Dining;
