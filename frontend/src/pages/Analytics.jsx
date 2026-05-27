import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, Award, BrainCircuit, Activity, ArrowLeft, ChartBar } from 'lucide-react';
import { motion } from 'framer-motion';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/feedback/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setData(res.data.data);
        setIsLoading(false);
      } catch {
        setError('Failed to load analytics data');
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 bg-background min-h-screen flex flex-col justify-center items-center">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(139,92,246,0.3)]"></div>
        <p className="text-text-muted font-medium animate-pulse">Compiling Analytics Data...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-1 bg-background min-h-screen flex justify-center items-center p-8">
        <div className="text-center glass-panel p-10 max-w-md w-full">
          <Activity size={48} className="text-red-400 mx-auto mb-4" />
          <p className="text-red-400 text-xl font-bold mb-6">{error}</p>
          <Link to="/dashboard" className="btn-secondary w-full inline-flex">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

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
    <div className="flex-1 bg-background min-h-screen p-4 sm:p-8 relative overflow-x-hidden font-sans">
      {/* Background Decorators */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full mix-blend-screen filter blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent/10 rounded-full mix-blend-screen filter blur-[150px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6"
        >
          <div>
            <Link to="/dashboard" className="flex items-center gap-2 text-text-muted hover:text-white transition-colors mb-4 w-fit group">
              <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-colors">
                <ArrowLeft size={16} />
              </div>
              <span className="font-semibold text-sm">Back to Dashboard</span>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                <ChartBar className="text-white" size={24} />
              </div>
              Performance Analytics
            </h1>
          </div>
          <div className="bg-surface/50 border border-border px-4 py-2 rounded-xl backdrop-blur-md">
            <span className="text-sm font-medium text-text-muted">Last Updated: <span className="text-white font-bold">{new Date().toLocaleDateString()}</span></span>
          </div>
        </motion.div>

        {/* Stats Summary */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div variants={itemVariants} className="glass-panel p-8 flex items-center justify-between group hover:border-primary/50 transition-all duration-300">
            <div>
              <p className="text-text-muted text-xs font-bold mb-2 uppercase tracking-widest">Total Interviews</p>
              <h3 className="text-4xl font-extrabold text-white group-hover:text-primary transition-colors">{data.totalInterviews}</h3>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 shadow-inner">
              <BrainCircuit size={32} />
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="glass-panel p-8 flex items-center justify-between group hover:border-accent/50 transition-all duration-300">
            <div>
              <p className="text-text-muted text-xs font-bold mb-2 uppercase tracking-widest">Average Score</p>
              <h3 className="text-4xl font-extrabold text-white group-hover:text-accent transition-colors">{data.averageScore}%</h3>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 text-accent flex items-center justify-center group-hover:scale-110 group-hover:bg-accent/20 transition-all duration-300 shadow-inner">
              <Award size={32} />
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="glass-panel p-8 flex items-center justify-between group hover:border-green-500/50 transition-all duration-300">
            <div>
              <p className="text-text-muted text-xs font-bold mb-2 uppercase tracking-widest">Growth Trend</p>
              <h3 className="text-4xl font-extrabold text-green-400 group-hover:text-green-300 transition-colors">+12%</h3>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-green-500/20 transition-all duration-300 shadow-inner">
              <TrendingUp size={32} />
            </div>
          </motion.div>
        </motion.div>

        {/* Charts Grid */}
        {data.totalInterviews > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <motion.div variants={itemVariants} className="glass-panel p-8 relative overflow-hidden group">
                <div className="absolute left-0 top-0 w-1.5 h-full bg-gradient-to-b from-green-400 to-emerald-600"></div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center"><TrendingUp size={16} /></span>
                  Strong Topics
                </h3>
                <div className="flex flex-wrap gap-3">
                  {data.strongTopics?.length > 0 ? data.strongTopics.map(t => (
                    <span key={t} className="px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl font-bold text-sm shadow-sm group-hover:border-green-500/40 transition-colors">{t}</span>
                  )) : <span className="text-text-muted italic text-sm font-medium">Not enough data to determine strengths</span>}
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="glass-panel p-8 relative overflow-hidden group">
                <div className="absolute left-0 top-0 w-1.5 h-full bg-gradient-to-b from-red-400 to-rose-600"></div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center"><TrendingUp size={16} className="rotate-180" /></span>
                  Topics to Review
                </h3>
                <div className="flex flex-wrap gap-3">
                  {data.weakTopics?.length > 0 ? data.weakTopics.map(t => (
                    <span key={t} className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl font-bold text-sm shadow-sm group-hover:border-red-500/40 transition-colors">{t}</span>
                  )) : <span className="text-text-muted italic text-sm font-medium">Not enough data to determine weaknesses</span>}
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Trend Chart */}
              <motion.div variants={itemVariants} className="glass-panel p-8">
                <h3 className="text-xl font-bold text-white mb-8 border-b border-border pb-4">Score Timeline</h3>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.performanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                      <YAxis stroke="#94a3b8" domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                        itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                        cursor={{ stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '4 4' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#3b82f6" 
                        strokeWidth={4} 
                        dot={{ fill: '#030712', stroke: '#3b82f6', strokeWidth: 3, r: 5 }} 
                        activeDot={{ r: 8, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} 
                        animationDuration={1500}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Radar Chart */}
              <motion.div variants={itemVariants} className="glass-panel p-8">
                <h3 className="text-xl font-bold text-white mb-8 border-b border-border pb-4">Category Competency</h3>
                <div className="h-[350px] w-full flex justify-center items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data.categoryAverages}>
                      <PolarGrid stroke="#ffffff20" />
                      <PolarAngleAxis dataKey="subject" stroke="#f8fafc" tick={{ fill: '#e2e8f0', fontSize: 13, fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fill: '#94a3b8' }} />
                      <Radar 
                        name="Avg Score" 
                        dataKey="score" 
                        stroke="#8b5cf6" 
                        strokeWidth={3}
                        fill="#8b5cf6" 
                        fillOpacity={0.4} 
                        animationDuration={1500}
                      />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-16 text-center max-w-3xl mx-auto mt-12 border-dashed border-2 border-border/50"
          >
            <div className="w-24 h-24 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-6 shadow-inner">
              <ChartBar size={40} className="text-text-muted" />
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-4">No Analytics Available Yet</h2>
            <p className="text-text-muted text-lg mb-8 max-w-md mx-auto leading-relaxed">Complete your first mock interview to unlock detailed performance insights, competency charts, and growth trends.</p>
            <Link to="/interview/setup" className="btn-primary inline-flex">Start Your First Interview</Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
