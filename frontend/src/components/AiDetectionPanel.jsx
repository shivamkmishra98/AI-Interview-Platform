import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ShieldAlert, AlertTriangle, Fingerprint, RefreshCw, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AiDetectionPanel = ({ question, answer }) => {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeAnswer = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/detect-answer',
        { question, answer },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReport(res.data.data);
      toast.success('Analysis complete');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to run AI detection');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score, invert = false) => {
    // If invert is true, higher score is better (Human), else lower is better (AI/Plagiarism)
    if (invert) {
      if (score > 70) return 'text-green-400';
      if (score > 40) return 'text-yellow-400';
      return 'text-red-400';
    } else {
      if (score > 60) return 'text-red-400';
      if (score > 30) return 'text-yellow-400';
      return 'text-green-400';
    }
  };

  const getProgressColor = (score, invert = false) => {
    if (invert) {
      if (score > 70) return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]';
      if (score > 40) return 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]';
      return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
    } else {
      if (score > 60) return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
      if (score > 30) return 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]';
      return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]';
    }
  };

  if (!report) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 p-6 rounded-2xl border border-dashed border-border bg-surface/30 flex flex-col items-center justify-center text-center relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mb-4 shadow-inner relative">
          <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-md group-hover:bg-indigo-500/40 transition-all"></div>
          <ShieldAlert size={28} className="text-indigo-400 relative z-10" />
        </div>
        
        <h4 className="text-base font-bold text-white mb-2 tracking-tight">Verify Authenticity</h4>
        <p className="text-sm text-text-muted mb-6 max-w-sm leading-relaxed">
          Run an advanced linguistic check to detect AI-generated patterns and potential plagiarism against database entries.
        </p>
        
        <motion.button 
          whileHover={!isLoading ? { scale: 1.02 } : {}}
          whileTap={!isLoading ? { scale: 0.98 } : {}}
          onClick={analyzeAnswer}
          disabled={isLoading}
          className="flex items-center gap-3 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 px-6 py-3 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(79,70,229,0.2)] hover:shadow-[0_0_25px_rgba(79,70,229,0.4)] relative z-10"
        >
          {isLoading ? (
            <RefreshCw size={18} className="animate-spin" />
          ) : (
            <Fingerprint size={18} />
          )}
          {isLoading ? 'Analyzing Text Structure...' : 'Run Detailed Analysis'}
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-6 p-6 sm:p-8 rounded-2xl border border-border bg-surface/60 shadow-[0_10px_30px_rgba(0,0,0,0.2)] relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-bl-full pointer-events-none blur-2xl"></div>

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30 shadow-[0_0_10px_rgba(79,70,229,0.3)]">
          <Fingerprint size={20} className="text-indigo-400" />
        </div>
        <h4 className="text-sm font-extrabold text-white uppercase tracking-widest">Authenticity Report</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 relative z-10">
        {/* Human Score */}
        <div className="bg-background/80 p-5 rounded-xl border border-border flex flex-col items-center justify-center shadow-inner hover:border-indigo-500/30 transition-colors">
          <p className="text-[10px] text-text-muted mb-2 uppercase tracking-widest font-bold">Human Likelihood</p>
          <div className="text-3xl font-extrabold mb-3">
            <span className={getScoreColor(report.humanWritingScore, true)}>{report.humanWritingScore}%</span>
          </div>
          <div className="w-full bg-surface border border-border rounded-full h-2 overflow-hidden shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${report.humanWritingScore}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className={`h-full rounded-full ${getProgressColor(report.humanWritingScore, true)}`}
            />
          </div>
        </div>

        {/* AI Score */}
        <div className="bg-background/80 p-5 rounded-xl border border-border flex flex-col items-center justify-center shadow-inner hover:border-purple-500/30 transition-colors">
          <p className="text-[10px] text-text-muted mb-2 uppercase tracking-widest font-bold">AI Probability</p>
          <div className="text-3xl font-extrabold mb-3">
            <span className={getScoreColor(report.aiProbability)}>{report.aiProbability}%</span>
          </div>
          <div className="w-full bg-surface border border-border rounded-full h-2 overflow-hidden shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${report.aiProbability}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className={`h-full rounded-full ${getProgressColor(report.aiProbability)}`}
            />
          </div>
        </div>

        {/* Plagiarism Score */}
        <div className="bg-background/80 p-5 rounded-xl border border-border flex flex-col items-center justify-center shadow-inner hover:border-rose-500/30 transition-colors">
          <p className="text-[10px] text-text-muted mb-2 uppercase tracking-widest font-bold">Plagiarism Match</p>
          <div className="text-3xl font-extrabold mb-3">
            <span className={getScoreColor(report.plagiarismScore)}>{report.plagiarismScore}%</span>
          </div>
          <div className="w-full bg-surface border border-border rounded-full h-2 overflow-hidden shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${report.plagiarismScore}%` }}
              transition={{ duration: 1, delay: 0.4 }}
              className={`h-full rounded-full ${getProgressColor(report.plagiarismScore)}`}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {report.flags && report.flags.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 relative z-10 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400">
                <AlertTriangle size={18} />
              </div>
              <h5 className="text-sm font-bold text-red-300 uppercase tracking-widest">Suspicious Flags Detected</h5>
            </div>
            <ul className="space-y-2 mt-4 pl-1">
              {report.flags.map((flag, idx) => (
                <motion.li 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (idx * 0.1) }}
                  key={idx} 
                  className="flex items-start gap-2 text-sm text-red-200/90 bg-background/50 p-2.5 rounded-lg border border-red-500/10"
                >
                  <span className="text-red-500 mt-0.5 shrink-0">•</span> {flag}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/10 border border-green-500/30 rounded-xl p-5 flex items-center gap-4 relative z-10 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
          >
            <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h5 className="text-sm font-bold text-green-300 uppercase tracking-widest mb-1">Content Verified</h5>
              <p className="text-sm font-medium text-green-200/80">No suspicious patterns detected. The response appears highly original.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AiDetectionPanel;
