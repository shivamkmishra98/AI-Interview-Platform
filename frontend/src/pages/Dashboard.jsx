import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, Play, Clock, Award, BarChart3, ChevronRight, Video, Terminal, User as UserIcon, Trophy, Search, Activity, Sparkles, Cpu, Zap, Network, Flame, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [history, setHistory] = useState([]);
  const [filterRole, setFilterRole] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch Leaderboard
        const leadRes = await axios.get('http://localhost:5000/api/user/leaderboard');
        setLeaderboard(leadRes.data.data);

        // Fetch Interview History
        const histRes = await axios.get('http://localhost:5000/api/interview/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(histRes.data.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDeleteActivity = async () => {
    if (!activityToDelete) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/interview/${activityToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setHistory(prev => prev.filter(item => item._id !== activityToDelete));
      toast.success('Activity deleted successfully', {
        style: { background: '#0B1120', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.1)' }
      });
      setDeleteModalOpen(false);
      setActivityToDelete(null);
    } catch (err) {
      console.error('Failed to delete activity', err);
      toast.error('Failed to delete activity', {
        style: { background: '#0B1120', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.1)' }
      });
    }
  };

  const openDeleteModal = (e, id) => {
    e.stopPropagation();
    setActivityToDelete(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setActivityToDelete(null);
    toast('Deletion cancelled', {
      icon: 'ℹ️',
      style: { background: '#0B1120', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.1)' }
    });
  };

  const filteredHistory = history.filter(h => 
    (filterRole ? h.jobRole.toLowerCase().includes(filterRole.toLowerCase()) : true) &&
    (filterCategory ? h.category === filterCategory : true)
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="flex-1 bg-[#050B14] min-h-screen relative overflow-x-hidden text-gray-200 font-sans">
      {/* Dynamic Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-[#050B14] to-[#050B14]"></div>

      {/* Navbar */}
      <nav className="glass-panel border-b border-white/5 px-6 py-4 flex justify-between items-center sticky top-0 z-50 backdrop-blur-2xl bg-[#0B1120]/70">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/50 blur-xl rounded-full group-hover:bg-primary transition-colors duration-500"></div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-purple-500 to-accent flex items-center justify-center relative border border-white/20 shadow-[0_0_20px_rgba(139,92,246,0.4)]">
              <Sparkles className="text-white" size={24} />
            </div>
          </div>
          <div>
             <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 block tracking-tight">
               AI INTERVIEW
             </span>
             <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase">Pro Edition</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/analytics')} className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-bold text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <BarChart3 size={18} className="text-primary" /> Analytics
          </button>
          <button onClick={() => navigate('/profile')} className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-bold text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <UserIcon size={18} className="text-accent" /> Profile
          </button>
          <div className="w-px h-8 bg-white/10 mx-2 hidden md:block"></div>
          <button 
            onClick={handleLogout}
            className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-12 glass-panel p-8 rounded-3xl border border-white/5 bg-gradient-to-r from-[#0A101D] to-[#0D1424]/50 relative overflow-hidden"
        >
          {/* Decorative neon streak */}
          <div className="absolute top-0 right-0 w-1/2 h-1 bg-gradient-to-l from-primary via-accent to-transparent"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
              <Activity size={14} className="animate-pulse" /> System Online
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-white">
              Welcome back to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Nexus</span> <span className="inline-block origin-bottom-right hover:rotate-12 transition-transform">👋</span>
            </h1>
            <p className="text-gray-400 text-lg font-medium max-w-xl">Your AI neural interface is ready. Initiate a new simulation to enhance your technical capabilities.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto relative z-10">
            <button onClick={() => navigate('/interview/setup')} className="btn-primary py-4 px-8 rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] font-bold text-lg flex justify-center group overflow-hidden relative">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
              <Play size={22} fill="currentColor" className="mr-2 group-hover:scale-110 transition-transform" />
              Init AI Interview
            </button>
            <button onClick={() => navigate('/interview/coding')} className="bg-[#0A101D] hover:bg-[#111827] text-white border border-white/10 hover:border-accent/50 py-4 px-8 rounded-2xl font-bold text-lg flex items-center justify-center transition-all duration-300 shadow-xl group">
              <Terminal size={22} className="mr-2 text-accent group-hover:rotate-12 transition-transform" />
              Coding Matrix
            </button>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            { icon: <Cpu className="text-blue-400" size={24}/>, title: "Total Simulations", value: history.length, desc: "Interviews completed", bg: "from-blue-500/10 to-transparent", border: "border-blue-500/20" },
            { icon: <Flame className="text-orange-400" size={24}/>, title: "Current Streak", value: "3 Days", desc: "Keep it up!", bg: "from-orange-500/10 to-transparent", border: "border-orange-500/20" },
            { icon: <Award className="text-green-400" size={24}/>, title: "Avg Score", value: "85%", desc: "Top 10% of users", bg: "from-green-500/10 to-transparent", border: "border-green-500/20" },
            { icon: <Network className="text-purple-400" size={24}/>, title: "Network Rank", value: "#42", desc: "Global leaderboard", bg: "from-purple-500/10 to-transparent", border: "border-purple-500/20" }
          ].map((stat, i) => (
            <div key={i} className={`glass-panel p-6 rounded-3xl border ${stat.border} bg-gradient-to-br ${stat.bg} backdrop-blur-xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-300`}>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-gray-400 text-sm font-bold tracking-wider uppercase mb-1">{stat.title}</h3>
              <div className="flex items-end gap-2">
                 <span className="text-3xl font-black text-white">{stat.value}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2 font-medium">{stat.desc}</p>
            </div>
          ))}
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 xl:grid-cols-3 gap-8"
        >
          {/* Main Feed: Recent Interviews with Filters */}
          <motion.div variants={itemVariants} className="xl:col-span-2 glass-panel p-8 rounded-3xl border border-white/5 bg-[#0A101D]/80 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            {/* Glow */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6 relative z-10">
              <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
                <Zap className="text-yellow-400 fill-yellow-400/20" size={28} /> Activity Log
              </h2>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search roles..."
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl pl-12 pr-4 py-3 text-sm font-medium outline-none transition-all duration-300 text-white placeholder-gray-500"
                  />
                </div>
                <div className="relative w-full sm:w-auto">
                  <select 
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-primary rounded-2xl px-6 py-3 text-sm font-medium outline-none transition-all duration-300 cursor-pointer appearance-none text-white pr-10"
                  >
                    <option value="">All Domains</option>
                    <option value="HR">Behavioral (HR)</option>
                    <option value="DSA">Algorithms (DSA)</option>
                    <option value="System Design">System Architecture</option>
                    <option value="OOPs">Object Oriented</option>
                    <option value="DBMS">Database Systems</option>
                  </select>
                  <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" />
                </div>
              </div>
            </div>
            
            <div className="space-y-5 relative z-10">
              <AnimatePresence>
              {filteredHistory.length > 0 ? filteredHistory.map((interview, idx) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ delay: idx * 0.1 }}
                  key={interview._id} 
                  onClick={() => navigate(interview.status === 'completed' ? `/interview/result/${interview._id}` : `/interview/${interview._id}`)}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/50 hover:bg-primary/[0.05] transition-all duration-300 cursor-pointer group hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] relative overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-primary transition-colors duration-300"></div>

                  <div className="flex items-center gap-6 mb-4 sm:mb-0">
                    <div className="relative">
                       <div className="absolute inset-0 bg-accent/20 blur-md rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       <div className="w-16 h-16 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative z-10">
                         {interview.category === 'DSA' ? <Terminal size={26} className="text-accent" /> : <Video size={26} className="text-primary" />}
                       </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-xl text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all mb-1 tracking-tight">{interview.jobRole}</h4>
                      <p className="text-sm text-gray-400 font-semibold flex items-center gap-1.5">
                        <Clock size={14} className="text-gray-500" /> {new Date(interview.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between w-full sm:w-auto gap-8">
                    <div className="flex gap-2">
                      <span className="px-3.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs font-bold text-gray-300 uppercase tracking-wider">
                        {interview.category}
                      </span>
                      <span className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${interview.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400 border-red-500/20' : interview.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                        {interview.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      {interview.status === 'completed' ? (
                        <div className="text-right flex flex-col items-end">
                          <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Match Rate</span>
                          <span className={`text-2xl font-black tracking-tighter ${interview.overallScore >= 80 ? 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]' : interview.overallScore >= 60 ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]'}`}>
                            {interview.overallScore}%
                          </span>
                        </div>
                      ) : (
                        <div className="text-right">
                          <span className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-black uppercase tracking-widest rounded-xl animate-pulse inline-block shadow-[0_0_15px_rgba(234,179,8,0.2)]">Active</span>
                        </div>
                      )}
                      <button 
                        onClick={(e) => openDeleteModal(e, interview._id)}
                        className="w-10 h-10 rounded-full bg-red-500/5 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 border border-red-500/10 hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] text-red-400 group/delete z-10"
                        title="Delete Activity"
                      >
                        <Trash2 size={18} className="group-hover/delete:scale-110 transition-transform" />
                      </button>
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300 border border-white/10 group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                        <ChevronRight size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-white/10 rounded-3xl bg-black/20 relative overflow-hidden">
                   <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.02)_10px,rgba(255,255,255,0.02)_20px)] pointer-events-none"></div>
                  <div className="w-20 h-20 rounded-full bg-black/50 border border-white/10 flex items-center justify-center mb-6 relative z-10">
                    <Activity size={32} className="text-gray-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 relative z-10">No Simulation Data</h3>
                  <p className="text-gray-400 max-w-md relative z-10">You haven't completed any interviews matching these parameters. Initialize a new simulation to generate data.</p>
                </div>
              )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Sidebar: Leaderboard */}
          <motion.div variants={itemVariants} className="glass-panel p-8 flex flex-col h-fit rounded-3xl border border-white/5 bg-[#0A101D]/80 backdrop-blur-xl shadow-2xl relative overflow-hidden">
             {/* Glow */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full mix-blend-screen filter blur-[80px] pointer-events-none"></div>

            <h2 className="text-xl font-black mb-8 flex items-center gap-3 tracking-tight text-white relative z-10">
              <Trophy className="text-yellow-400 fill-yellow-400/20" size={24} /> Global Rankings
            </h2>
            
            <div className="space-y-4 relative z-10">
              {leaderboard.length > 0 ? leaderboard.map((user, index) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  key={user.id} 
                  className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-500/10 to-amber-500/5 border-yellow-500/40 shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 
                    index === 1 ? 'bg-gradient-to-r from-gray-300/10 to-gray-400/5 border-gray-400/40 shadow-[0_0_15px_rgba(156,163,175,0.1)]' : 
                    index === 2 ? 'bg-gradient-to-r from-amber-700/20 to-orange-700/10 border-amber-600/40 shadow-[0_0_15px_rgba(217,119,6,0.1)]' : 
                    'bg-black/40 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-xl text-base font-black shadow-lg ${
                      index === 0 ? 'bg-gradient-to-br from-yellow-300 to-amber-500 text-[#050B14]' : 
                      index === 1 ? 'bg-gradient-to-br from-gray-200 to-gray-400 text-[#050B14]' : 
                      index === 2 ? 'bg-gradient-to-br from-amber-500 to-orange-700 text-white' : 
                      'bg-white/5 border border-white/10 text-gray-400'
                    }`}>
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-base text-white tracking-tight">{user.name}</p>
                      <p className="text-xs text-gray-400 font-semibold">{user.totalInterviews} missions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-black tracking-tighter ${
                      index === 0 ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 
                      index === 1 ? 'text-gray-300 drop-shadow-[0_0_10px_rgba(209,213,219,0.5)]' : 
                      index === 2 ? 'text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 
                      'text-primary'
                    }`}>{user.avgScore}%</p>
                  </div>
                </motion.div>
              )) : (
                 <div className="flex flex-col items-center justify-center py-12 text-center bg-black/20 rounded-2xl border border-white/5">
                  <Trophy size={40} className="text-gray-600 mb-4" />
                  <p className="text-sm text-gray-400 font-medium">Rankings unavailable.</p>
                </div>
              )}
            </div>
          </motion.div>

        </motion.div>
        
        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={closeDeleteModal}
              ></motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md bg-[#0A101D] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
              >
                {/* Modal Glow */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500/50 via-red-500 to-red-500/50"></div>
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/20 rounded-full blur-[50px] pointer-events-none"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 mx-auto">
                    <Trash2 size={32} className="text-red-500" />
                  </div>
                  
                  <h3 className="text-2xl font-black text-white text-center mb-2 tracking-tight">Delete Activity</h3>
                  <p className="text-gray-400 text-center mb-8 font-medium">
                    Are you sure you want to delete this activity log? This action cannot be undone and will permanently remove the interview data.
                  </p>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={closeDeleteModal}
                      className="flex-1 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleDeleteActivity}
                      className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] flex items-center justify-center"
                    >
                      Delete Log
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;
