import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Play, Settings, Briefcase, ChevronDown, ArrowLeft, Layers, Target, Mic, Type } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = ['HR', 'DSA', 'System Design', 'OOPs', 'DBMS'];
const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

const InterviewSetup = () => {
  const [jobRole, setJobRole] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [difficulty, setDifficulty] = useState(difficulties[1]);
  const [isVoiceMode, setIsVoiceMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleStart = async (e) => {
    e.preventDefault();
    if (!jobRole) return toast.error('Job Role is required');
    
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/interview/generate',
        { jobRole, category, difficulty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const interviewId = res.data.data._id;
      if (isVoiceMode) {
        navigate(`/interview/voice/${interviewId}`);
      } else {
        navigate(`/interview/${interviewId}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to start interview');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-background min-h-screen p-4 sm:p-8 flex justify-center items-center relative overflow-hidden font-sans">
      {/* Background Decorators */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary rounded-full mix-blend-screen filter blur-[150px] pointer-events-none"
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-accent rounded-full mix-blend-screen filter blur-[150px] pointer-events-none"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
        className="w-full max-w-2xl glass-panel p-8 md:p-12 z-10 relative shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        <button 
          onClick={() => navigate('/dashboard')}
          className="absolute top-6 left-6 text-text-muted hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="text-center mb-10 mt-6">
          <motion.div 
            animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
            transition={isLoading ? { duration: 2, repeat: Infinity, ease: "linear" } : { duration: 0.5 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 mb-8 shadow-[0_0_30px_rgba(139,92,246,0.3)] backdrop-blur-md"
          >
            <Settings size={48} className="text-primary" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">Configure Interview</h1>
          <p className="text-text-muted text-lg font-medium">Customize the AI generation for your exact needs</p>
        </div>

        <form onSubmit={handleStart} className="space-y-8">
          {/* Job Role */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <label className="text-sm font-bold text-gray-300 uppercase tracking-widest ml-1">Target Job Role</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                <Briefcase size={22} />
              </div>
              <input
                type="text"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className="input-field pl-14 py-4 text-lg font-medium shadow-inner focus:shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                placeholder="e.g. Senior Frontend Engineer"
                required
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Category */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <label className="text-sm font-bold text-gray-300 uppercase tracking-widest ml-1">Domain</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-accent transition-colors z-10">
                  <Layers size={22} />
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-field pl-14 pr-12 py-4 text-lg font-medium appearance-none cursor-pointer hover:border-white/20 focus:border-accent/50 focus:ring-accent/20"
                >
                  {categories.map((c) => (
                    <option key={c} value={c} className="bg-surface text-white py-2">{c}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-accent transition-colors">
                  <ChevronDown size={22} />
                </div>
              </div>
            </motion.div>

            {/* Difficulty */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <label className="text-sm font-bold text-gray-300 uppercase tracking-widest ml-1">Complexity</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-accent transition-colors z-10">
                  <Target size={22} />
                </div>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="input-field pl-14 pr-12 py-4 text-lg font-medium appearance-none cursor-pointer hover:border-white/20 focus:border-accent/50 focus:ring-accent/20"
                >
                  {difficulties.map((d) => (
                    <option key={d} value={d} className="bg-surface text-white py-2">{d}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-accent transition-colors">
                  <ChevronDown size={22} />
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="pt-4"
          >
            {/* Interview Mode Selector */}
            <div className="mb-8">
              <label className="text-sm font-bold text-gray-300 uppercase tracking-widest ml-1 mb-3 block">Interview Mode</label>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  onClick={() => setIsVoiceMode(true)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${isVoiceMode ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(139,92,246,0.2)]' : 'border-border bg-surface/50 hover:bg-surface'}`}
                >
                  <div className={`p-3 rounded-full ${isVoiceMode ? 'bg-primary text-white shadow-lg' : 'bg-surface border border-border text-text-muted'}`}>
                    <Mic size={24} />
                  </div>
                  <span className={`font-bold ${isVoiceMode ? 'text-white' : 'text-text-muted'}`}>Real-Time Voice</span>
                  <span className="text-xs text-center text-text-muted hidden sm:block">AI speaks & listens via mic</span>
                </div>
                <div 
                  onClick={() => setIsVoiceMode(false)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${!isVoiceMode ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(139,92,246,0.2)]' : 'border-border bg-surface/50 hover:bg-surface'}`}
                >
                  <div className={`p-3 rounded-full ${!isVoiceMode ? 'bg-primary text-white shadow-lg' : 'bg-surface border border-border text-text-muted'}`}>
                    <Type size={24} />
                  </div>
                  <span className={`font-bold ${!isVoiceMode ? 'text-white' : 'text-text-muted'}`}>Standard Text</span>
                  <span className="text-xs text-center text-text-muted hidden sm:block">Read & type your answers</span>
                </div>
              </div>
            </div>

            <motion.button 
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              type="submit" 
              disabled={isLoading}
              className={`w-full py-5 text-xl rounded-2xl flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed transition-all ${isVoiceMode ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] text-white' : 'btn-primary'}`}
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Initializing AI Core...
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    {isVoiceMode ? <Mic size={20} className="ml-1" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                  </div>
                  Launch {isVoiceMode ? 'Voice' : 'Text'} Interview
                </>
              )}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default InterviewSetup;
