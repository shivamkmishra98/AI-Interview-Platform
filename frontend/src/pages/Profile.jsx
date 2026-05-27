import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, CheckCircle2, ArrowLeft, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setName(res.data.data.name);
        setEmail(res.data.data.email);
        setIsLoading(false);
      } catch (err) {
        toast.error('Failed to load profile.');
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const token = localStorage.getItem('token');
      const payload = { name, email };
      if (password) payload.password = password;

      await axios.put(
        'http://localhost:5000/api/user/profile',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Profile updated successfully!');
      setPassword(''); // clear password field
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-background min-h-screen flex flex-col justify-center items-center">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(139,92,246,0.3)]"></div>
        <p className="text-text-muted font-medium animate-pulse">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background min-h-screen p-4 sm:p-8 flex justify-center items-center relative overflow-hidden font-sans">
      {/* Background Decorators */}
      <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-primary/20 rounded-full mix-blend-screen filter blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-accent/10 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none z-0"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
        className="w-full max-w-xl glass-panel p-8 sm:p-12 z-10 relative shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        <button 
          onClick={() => window.history.back()}
          className="absolute top-6 left-6 text-text-muted hover:text-white transition-colors flex items-center gap-2 text-sm font-medium z-20"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex flex-col items-center mb-10 mt-6 relative">
          <div className="w-24 h-24 rounded-full bg-surface border border-border flex items-center justify-center mb-4 shadow-inner relative group">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-md group-hover:bg-primary/40 transition-all"></div>
            <User size={40} className="text-primary relative z-10" />
            <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-accent border-2 border-surface flex items-center justify-center shadow-lg">
              <Shield size={14} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Account Settings</h1>
          <p className="text-text-muted text-sm mt-2">Manage your personal information and security</p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <label className="text-xs font-bold text-gray-300 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                <User size={20} />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field pl-12 py-3.5"
                placeholder="John Doe"
                required
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <label className="text-xs font-bold text-gray-300 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                <Mail size={20} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-12 py-3.5"
                placeholder="john@example.com"
                required
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2 pt-4 border-t border-border/50"
          >
            <label className="text-xs font-bold text-gray-300 uppercase tracking-widest ml-1 flex justify-between">
              <span>New Password</span>
              <span className="text-text-muted font-normal normal-case tracking-normal">Optional</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                <Lock size={20} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-12 py-3.5"
                placeholder="Leave blank to keep current"
                minLength="6"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button 
              whileHover={!isSaving ? { scale: 1.02 } : {}}
              whileTap={!isSaving ? { scale: 0.98 } : {}}
              type="submit" 
              disabled={isSaving}
              className="w-full btn-primary flex items-center justify-center gap-2 mt-8 py-4 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(139,92,246,0.3)]"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <CheckCircle2 size={20} />
              )}
              {isSaving ? 'Saving Changes...' : 'Save Changes'}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default Profile;
