import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Package, Activity, BrainCircuit, ListOrdered, CheckCircle, AlertTriangle, Search, LayoutDashboard, ShoppingBag, PieChart, Utensils, Box, MessageSquare, Megaphone, Settings, Plus, Edit2, Trash2, X, Bell } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { menuData } from '../data/menuData'; // Initial data

// Initial Mock Data to simulate DB
const initialOrders = [
  { id: "#LD-092", user: "Rohan K.", items: "Butter Chicken, Garlic Naan", total: 850, status: "Cooking", time: "10 mins ago" },
  { id: "#LD-091", user: "Sneha P.", items: "Truffle Dim Sum, Coke", total: 720, status: "Pending", time: "15 mins ago" },
  { id: "#LD-090", user: "Vikram S.", items: "Paneer Tikka, Jeera Rice", total: 900, status: "Delivered", time: "1 hour ago" },
];

const revenueData = [
  { time: '10 AM', revenue: 4000 },
  { time: '12 PM', revenue: 15000 },
  { time: '2 PM', revenue: 11000 },
  { time: '4 PM', revenue: 8000 },
  { time: '6 PM', revenue: 25000 },
  { time: '8 PM', revenue: 42000 },
  { time: '10 PM', revenue: 38000 },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [searchQuery, setSearchQuery] = useState("");

  // Live State Management (Simulating Redux/DB)
  const [orders, setOrders] = useState(() => {
    const savedOrders = JSON.parse(localStorage.getItem('adminOrders'));
    return savedOrders && savedOrders.length > 0 ? savedOrders : initialOrders;
  });

  useEffect(() => {
    // Fetch orders from DB on mount
    const fetchOrders = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://restaurant-mdtm.onrender.com';
        const res = await fetch(`${API_URL}/api/orders`);
        const data = await res.json();
        if(data.success && data.orders) {
          setOrders(data.orders);
          localStorage.setItem('adminOrders', JSON.stringify(data.orders));
        }
      } catch (err) {
        console.error("Failed to fetch orders from DB", err);
      }
    };
    fetchOrders();

    const handleStorageChange = () => {
      const savedOrders = JSON.parse(localStorage.getItem('adminOrders'));
      if (savedOrders) setOrders(savedOrders);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  const [menu, setMenu] = useState(menuData);
  const [inventory, setInventory] = useState([
    { id: 1, name: "Tomatoes", stock: 15, unit: "kg", status: "Low" },
    { id: 2, name: "Chicken", stock: 45, unit: "kg", status: "Good" },
    { id: 3, name: "Paneer", stock: 8, unit: "kg", status: "Critical" },
    { id: 4, name: "Rice", stock: 120, unit: "kg", status: "Good" },
  ]);

  const tabs = [
    { name: 'Overview', icon: <LayoutDashboard size={18} /> },
    { name: 'Orders', icon: <ShoppingBag size={18} /> },
    { name: 'Menu', icon: <Utensils size={18} /> },
    { name: 'Inventory', icon: <Box size={18} /> },
    { name: 'AI Analytics', icon: <BrainCircuit size={18} /> },
    { name: 'Settings', icon: <Settings size={18} /> },
  ];

  // --- ORDER MANAGEMENT ---
  const handleUpdateOrderStatus = async (id, newStatus) => {
    const updatedOrders = orders.map(o => o._id === id || o.id === id ? { ...o, status: newStatus } : o);
    setOrders(updatedOrders);
    localStorage.setItem('adminOrders', JSON.stringify(updatedOrders));
    window.dispatchEvent(new Event('storage'));
    toast.success(`Order ${id} marked as ${newStatus}`);

    // Update DB
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://restaurant-mdtm.onrender.com';
      await fetch(`${API_URL}/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch(e) { console.error(e); }
  };

  const handleDeleteOrder = async (id) => {
    const updatedOrders = orders.filter(o => o._id !== id && o.id !== id);
    setOrders(updatedOrders);
    localStorage.setItem('adminOrders', JSON.stringify(updatedOrders));
    window.dispatchEvent(new Event('storage'));
    toast.error(`Order ${id} cancelled`);

    // Delete from DB
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://restaurant-mdtm.onrender.com';
      await fetch(`${API_URL}/api/orders/${id}`, { method: 'DELETE' });
    } catch(e) { console.error(e); }
  };

  // --- MENU MANAGEMENT ---
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState({ name: '', price: '', category: 'Indian Mains', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80' });

  const handleAddMenu = () => {
    const newItem = {
      id: Math.random(),
      ...newMenuItem,
      price: Number(newMenuItem.price),
      rating: 4.5,
    };
    setMenu([newItem, ...menu]);
    setIsMenuModalOpen(false);
    toast.success("Dish added successfully!");
  };

  const handleDeleteMenu = (id) => {
    setMenu(menu.filter(m => m.id !== id));
    toast.success("Dish removed!");
  };

  // --- INVENTORY MANAGEMENT ---
  const handleRestock = (id) => {
    setInventory(inventory.map(inv => inv.id === id ? { ...inv, stock: inv.stock + 50, status: 'Good' } : inv));
    toast.success("Inventory restocked!");
  };

  // --- COMPONENTS ---
  const renderOverview = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Today's Revenue", value: "₹2,45,600", trend: "+12.5%", icon: <DollarSign size={20} />, color: "text-green-400" },
          { title: "Active Orders", value: orders.filter(o => o.status !== 'Delivered').length, trend: "+5.2%", icon: <Activity size={20} />, color: "text-orange-400" },
          { title: "Menu Items", value: menu.length, trend: "Live", icon: <Utensils size={20} />, color: "text-blue-400" },
          { title: "Low Stock Items", value: inventory.filter(i => i.status !== 'Good').length, trend: "Action Needed", icon: <AlertTriangle size={20} />, color: "text-red-400" }
        ].map((stat, idx) => (
          <div key={idx} className="glass-card p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-all flex flex-col justify-between group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl bg-black/50 border border-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-md">{stat.trend}</span>
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">{stat.value}</h3>
              <p className="text-gray-400 text-xs font-medium mt-1 uppercase tracking-wider">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-white/10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><TrendingUp className="text-primary" size={18} /> Live Revenue Tracker</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff4757" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ff4757" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="time" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#111', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }} itemStyle={{ color: '#fff', fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="revenue" stroke="#ff4757" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-primary/30 relative overflow-hidden flex flex-col">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 relative z-10">
            <BrainCircuit className="text-primary animate-pulse" size={18} /> AI Operations
          </h2>
          <div className="space-y-4 relative z-10 flex-1">
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 hover:border-primary/50 transition-colors">
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><AlertTriangle size={12}/> Inventory Alert</p>
              <p className="text-sm text-gray-300 leading-relaxed">Paneer stock is critically low. AI suggests ordering <span className="text-white font-bold">15kg</span> today.</p>
            </div>
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 hover:border-green-500/50 transition-colors">
              <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><TrendingUp size={12}/> Demand Surge</p>
              <p className="text-sm text-gray-300 leading-relaxed">High demand detected for <span className="text-green-400 font-bold">Butter Chicken</span>. Dynamic pricing can increase revenue by 12%.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderOrders = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-3xl border border-white/10 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2"><ListOrdered className="text-gray-400" size={20} /> Order Management</h2>
      </div>
      <div className="overflow-x-auto hide-scrollbar">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="border-b border-white/5 text-gray-500 text-xs uppercase tracking-wider">
              <th className="pb-3 font-medium">Order ID</th>
              <th className="pb-3 font-medium">Customer</th>
              <th className="pb-3 font-medium">Items</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-white text-sm">
            {orders.filter(o => (o._id || o.id || "").toString().toLowerCase().includes(searchQuery.toLowerCase()) || (o.user || "").toLowerCase().includes(searchQuery.toLowerCase())).map((order) => (
              <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 font-medium text-white">{order._id || order.id}</td>
                <td className="p-4 text-gray-400">{order.user}</td>
                <td className="p-4 text-gray-400">{order.items}</td>
                <td className="p-4">
                  <select 
                    value={order.status}
                    onChange={(e) => handleUpdateOrderStatus(order._id || order.id, e.target.value)}
                    className="bg-black/50 border border-white/10 rounded-lg px-3 py-1 text-xs text-white outline-none cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Cooking">Cooking</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
                <td className="py-4 text-right">
                  <button onClick={() => handleDeleteOrder(order._id || order.id)} className="p-2 text-gray-500 hover:text-red-500 bg-white/5 hover:bg-red-500/10 rounded-xl transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan="5" className="py-8 text-center text-gray-500">No orders found.</td></tr>}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderMenu = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-3xl border border-white/10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2"><Utensils className="text-gray-400" size={20} /> Menu Inventory</h2>
        <button onClick={() => setIsMenuModalOpen(true)} className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary/80 transition-colors">
          <Plus size={16} /> Add Dish
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[600px] overflow-y-auto hide-scrollbar pr-2">
        {menu.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase())).map(item => (
          <div key={item.id} className="bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col group relative overflow-hidden">
            <img src={item.image.length > 5 ? item.image : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"} alt={item.name} className="w-full h-32 object-cover rounded-xl mb-4" />
            <h3 className="font-bold text-white truncate">{item.name}</h3>
            <p className="text-gray-400 text-sm mb-4">₹{item.price} • {item.category}</p>
            <div className="mt-auto flex justify-between">
              <button className="text-blue-400 hover:text-blue-300 text-xs font-bold uppercase tracking-wider bg-blue-500/10 px-3 py-1.5 rounded-lg">Edit</button>
              <button onClick={() => handleDeleteMenu(item.id)} className="text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-wider bg-red-500/10 px-3 py-1.5 rounded-lg">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {isMenuModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card p-8 rounded-3xl w-full max-w-md border border-white/10 relative">
            <button onClick={() => setIsMenuModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20}/></button>
            <h2 className="text-2xl font-bold text-white mb-6">Add New Dish</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Dish Name</label>
                <input type="text" value={newMenuItem.name} onChange={e=>setNewMenuItem({...newMenuItem, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Price (₹)</label>
                <input type="number" value={newMenuItem.price} onChange={e=>setNewMenuItem({...newMenuItem, price: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Category</label>
                <select value={newMenuItem.category} onChange={e=>setNewMenuItem({...newMenuItem, category: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-primary">
                  <option>Indian Mains</option><option>Starters</option><option>Asian</option><option>Desserts</option>
                </select>
              </div>
              <button onClick={handleAddMenu} className="w-full bg-primary text-white font-bold py-3 rounded-xl mt-4 hover:bg-primary/90 transition-colors">Save Dish</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderInventory = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-3xl border border-white/10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2"><Box className="text-gray-400" size={20} /> Inventory Status</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventory.map(item => (
          <div key={item.id} className="bg-black/40 border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-white text-lg">{item.name}</h3>
              <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                item.status === 'Good' ? 'bg-green-500/10 text-green-400' :
                item.status === 'Low' ? 'bg-orange-500/10 text-orange-400' : 'bg-red-500/10 text-red-400'
              }`}>{item.status}</span>
            </div>
            <div className="mb-6">
              <p className="text-3xl font-black text-white">{item.stock} <span className="text-sm text-gray-500 font-medium">{item.unit}</span></p>
            </div>
            {item.status !== 'Good' && (
              <button onClick={() => handleRestock(item.id)} className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 rounded-xl transition-colors text-sm">
                Restock +50
              </button>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="pt-24 pb-12 max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10 min-h-screen flex flex-col md:flex-row gap-8">
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
      </div>

      <motion.aside initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-full md:w-64 glass-card rounded-3xl p-6 border border-white/10 h-max sticky top-28 hidden md:block">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="bg-primary p-2 rounded-lg text-white shadow-lg shadow-primary/30"><LayoutDashboard size={20} /></div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Admin<span className="text-primary">OS</span></h2>
        </div>
        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button key={tab.name} onClick={() => setActiveTab(tab.name)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === tab.name ? 'bg-gradient-to-r from-primary/20 to-transparent text-primary border-l-2 border-primary shadow-inner' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              {tab.icon} {tab.name}
            </button>
          ))}
        </nav>
        <div className="mt-12 bg-black/40 p-4 rounded-2xl border border-white/5 text-center">
          <BrainCircuit className="mx-auto text-primary mb-2" size={24} />
          <p className="text-xs text-gray-400">System Status</p>
          <p className="text-sm font-bold text-green-400">Fully Operational</p>
        </div>
      </motion.aside>

      <div className="flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">{activeTab}</h1>
            <p className="text-gray-400 text-sm mt-1">Live dashboard environment</p>
          </div>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
            <input type="text" placeholder={`Search ${activeTab.toLowerCase()}...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'Overview' && renderOverview()}
          {activeTab === 'Orders' && renderOrders()}
          {activeTab === 'Menu' && renderMenu()}
          {activeTab === 'Inventory' && renderInventory()}
          
          {(activeTab === 'AI Analytics' || activeTab === 'Settings') && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card h-[60vh] rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center p-8">
              <div className="bg-black/50 p-6 rounded-full border border-white/5 mb-6">
                {tabs.find(t => t.name === activeTab)?.icon}
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{activeTab} Engine</h2>
              <p className="text-gray-400 max-w-md">Backend syncing is initialized. Waiting for production database handshake.</p>
              <button className="mt-8 bg-primary/20 text-primary border border-primary/50 font-bold py-3 px-8 rounded-full hover:bg-primary hover:text-white transition-colors">
                Ping Server
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
