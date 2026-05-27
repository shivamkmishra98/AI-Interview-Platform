import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Award, Target, BrainCircuit, ArrowLeft, MessageSquare, ThumbsUp, AlertTriangle, Lightbulb, Sparkles } from 'lucide-react';
import AiDetectionPanel from '../components/AiDetectionPanel';
import { motion } from 'framer-motion';

const InterviewResult = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/interview/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setResult(res.data.data);
        setIsLoading(false);
      } catch {
        setError('Failed to load interview results');
        setIsLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex-1 bg-background min-h-screen flex flex-col justify-center items-center">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(139,92,246,0.3)]"></div>
        <p className="text-text-muted font-medium animate-pulse">Analyzing Interview Performance...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="flex-1 bg-background min-h-screen flex justify-center items-center p-8">
        <div className="text-center glass-panel p-10 max-w-md w-full">
          <AlertTriangle size={48} className="text-red-400 mx-auto mb-4" />
          <p className="text-red-400 text-xl font-bold mb-6">{error}</p>
          <Link to="/dashboard" className="btn-secondary w-full inline-flex justify-center">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400 border-green-500/30 bg-green-500/10 shadow-[0_0_10px_rgba(34,197,94,0.2)]';
    if (score >= 50) return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10 shadow-[0_0_10px_rgba(234,179,8,0.2)]';
    return 'text-red-400 border-red-500/30 bg-red-500/10 shadow-[0_0_10px_rgba(239,68,68,0.2)]';
  };

  const getOverallStrokeColor = (score) => {
    if (score >= 80) return '#22c55e'; // green-500
    if (score >= 50) return '#eab308'; // yellow-500
    return '#ef4444'; // red-500
  };

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
    <div className="flex-1 bg-background min-h-screen p-4 sm:p-8 font-sans overflow-x-hidden relative">
      {/* Background Decorators */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full mix-blend-screen filter blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-accent/10 rounded-full mix-blend-screen filter blur-[150px] pointer-events-none z-0"></div>

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        
        {/* Header Actions */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <Link to="/dashboard" className="flex items-center gap-2 text-text-muted hover:text-white transition-colors group">
            <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-colors">
              <ArrowLeft size={16} />
            </div>
            <span className="font-semibold text-sm">Back to Dashboard</span>
          </Link>
        </motion.div>

        {/* Score Overview Panel */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-panel p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 group shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_50px_rgba(139,92,246,0.15)] transition-all"
        >
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary/30 transition-colors"></div>
          
          <div className="flex-1 text-center md:text-left z-10">
            <h1 className="text-4xl font-extrabold text-white mb-3 flex items-center justify-center md:justify-start gap-3">
              <Sparkles className="text-primary" />
              Interview Results
            </h1>
            <p className="text-text-muted text-lg mb-8 font-medium">
              Role: <span className="text-white bg-surface px-2 py-1 rounded-md border border-border mx-1">{result.jobRole}</span> • 
              Difficulty: <span className="text-white bg-surface px-2 py-1 rounded-md border border-border ml-1">{result.difficulty}</span>
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="bg-surface/80 p-5 rounded-2xl border border-border flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BrainCircuit className="text-primary" size={24} />
                </div>
                <div>
                  <p className="text-xs text-text-muted font-bold uppercase tracking-widest">AI Evaluation</p>
                  <p className="font-extrabold text-white text-lg">Complete</p>
                </div>
              </div>
              <div className="bg-surface/80 p-5 rounded-2xl border border-border flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Target className="text-accent" size={24} />
                </div>
                <div>
                  <p className="text-xs text-text-muted font-bold uppercase tracking-widest">Questions</p>
                  <p className="font-extrabold text-white text-lg">{result.questions.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <svg className="w-48 h-48 sm:w-56 sm:h-56 transform -rotate-90 filter drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              <circle cx="50%" cy="50%" r="40%" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="transparent" />
              <motion.circle 
                cx="50%" cy="50%" r="40%" stroke={getOverallStrokeColor(result.overallScore)} strokeWidth="12" fill="transparent" strokeLinecap="round"
                initial={{ strokeDasharray: "251.2", strokeDashoffset: "251.2" }}
                animate={{ strokeDashoffset: 251.2 - (251.2 * result.overallScore) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                className="filter drop-shadow-[0_0_10px_currentColor]"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl sm:text-6xl font-extrabold text-white">{result.overallScore}%</span>
              <span className="text-sm font-bold text-text-muted uppercase tracking-widest mt-1">Score</span>
            </div>
          </div>
        </motion.div>

        {/* Detailed Feedback */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.4)]">
              <MessageSquare className="text-white" size={20} />
            </div>
            Question Breakdown
          </motion.h2>
          
          {result.questions.map((q, i) => (
            <motion.div variants={itemVariants} key={q._id || i} className="glass-panel p-8 border-l-4 border-l-primary flex flex-col gap-6 relative overflow-hidden group hover:border-l-accent transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none group-hover:bg-accent/5 transition-colors"></div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 relative z-10">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-surface border border-border rounded-lg text-primary text-xs font-bold uppercase tracking-widest shadow-sm">Question {i + 1}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl text-white font-semibold leading-relaxed tracking-tight">{q.questionText}</h3>
                </div>
                <div className={`px-5 py-2.5 rounded-xl font-bold border-2 flex items-center gap-2 whitespace-nowrap ${getScoreColor(q.score)}`}>
                  <Award size={20} />
                  <span className="text-lg">{q.score} <span className="opacity-50 text-sm">/ 100</span></span>
                </div>
              </div>
              
              <div className="bg-surface/50 p-6 rounded-2xl border border-border shadow-inner relative z-10">
                <p className="text-xs text-text-muted font-bold mb-3 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  Your Response
                </p>
                <p className="text-gray-300 font-mono text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{q.userAnswer || <span className="italic text-gray-500">No response provided.</span>}</p>
              </div>
              
              <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 relative z-10">
                <p className="text-xs text-primary font-bold mb-4 uppercase tracking-widest flex items-center gap-2">
                  <BrainCircuit size={16} /> Evaluation Metrics
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="flex flex-col items-center justify-center p-4 bg-surface rounded-xl border border-border shadow-sm">
                    <p className="text-xs text-text-muted font-bold uppercase tracking-widest mb-1">Technical</p>
                    <p className="text-2xl font-extrabold text-accent">{q.technicalScore || 0}%</p>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-surface rounded-xl border border-border shadow-sm">
                    <p className="text-xs text-text-muted font-bold uppercase tracking-widest mb-1">Communication</p>
                    <p className="text-2xl font-extrabold text-green-400">{q.communicationScore || 0}%</p>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-surface rounded-xl border border-border shadow-sm">
                    <p className="text-xs text-text-muted font-bold uppercase tracking-widest mb-1">Confidence</p>
                    <p className="text-2xl font-extrabold text-purple-400">{q.confidenceScore || 0}%</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-primary font-bold mb-2 uppercase tracking-widest flex items-center gap-2">
                      <MessageSquare size={16} /> Summary Feedback
                    </p>
                    <p className="text-gray-300 leading-relaxed text-sm sm:text-base bg-surface/50 p-4 rounded-xl border border-border">{q.feedback}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {q.strengths && q.strengths.length > 0 && (
                      <div className="bg-green-500/5 p-4 rounded-xl border border-green-500/10">
                        <p className="text-sm text-green-400 font-bold mb-3 uppercase tracking-widest flex items-center gap-2">
                          <ThumbsUp size={16} /> Key Strengths
                        </p>
                        <ul className="space-y-2">
                          {q.strengths.map((s, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                              <span className="text-green-400 mt-0.5">•</span> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {q.weaknesses && q.weaknesses.length > 0 && (
                      <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/10">
                        <p className="text-sm text-red-400 font-bold mb-3 uppercase tracking-widest flex items-center gap-2">
                          <AlertTriangle size={16} /> Areas to Improve
                        </p>
                        <ul className="space-y-2">
                          {q.weaknesses.map((w, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                              <span className="text-red-400 mt-0.5">•</span> {w}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {q.improvementSuggestions && q.improvementSuggestions.length > 0 && (
                    <div className="bg-yellow-500/5 p-5 rounded-xl border border-yellow-500/20">
                      <p className="text-sm text-yellow-400 font-bold mb-3 uppercase tracking-widest flex items-center gap-2">
                        <Lightbulb size={16} /> Actionable Suggestions
                      </p>
                      <ul className="space-y-2">
                        {q.improvementSuggestions.map((s, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm bg-surface/50 p-2.5 rounded-lg border border-border">
                            <span className="text-yellow-400 mt-0.5 shrink-0">→</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* AI Detection Tool Integration */}
                <div className="mt-6 pt-6 border-t border-primary/10">
                  <AiDetectionPanel 
                    question={q.questionText} 
                    answer={q.userAnswer} 
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
      </div>
    </div>
  );
};

export default InterviewResult;
