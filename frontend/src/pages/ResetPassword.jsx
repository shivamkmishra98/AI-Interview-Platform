import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setIsLoading(true);
    try {
      const res = await axios.put(`http://localhost:5000/api/auth/resetpassword/${token}`, { password });
      
      // Auto login after reset
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      
      toast.success('Password reset successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid or expired token');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-background min-h-screen flex justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorators */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary rounded-full mix-blend-screen filter blur-[150px] pointer-events-none z-0"
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent rounded-full mix-blend-screen filter blur-[150px] pointer-events-none z-0"
      />

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-panel p-8 sm:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
          <div className="flex justify-center mb-8">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: -5 }}
              className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center border border-primary/30 shadow-[0_0_30px_rgba(139,92,246,0.3)] backdrop-blur-md"
            >
              <Lock className="text-white w-10 h-10" />
            </motion.div>
          </div>

          <h1 className="text-3xl font-extrabold text-white text-center mb-3 tracking-tight">Reset Password</h1>
          <p className="text-text-muted text-center mb-8 font-medium">
            Please enter your new password below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="text-xs font-bold text-gray-300 uppercase tracking-widest ml-1 mb-2 block">New Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-12 py-3.5"
                  placeholder="••••••••"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="text-xs font-bold text-gray-300 uppercase tracking-widest ml-1 mb-2 block">Confirm New Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field pl-12 py-3.5"
                  placeholder="••••••••"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-4 mt-2 flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Reset Password <ArrowRight className="w-5 h-5 ml-1" />
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <Link to="/login" className="text-sm font-semibold text-text-muted hover:text-white transition-colors flex items-center justify-center gap-2 group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Cancel
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
