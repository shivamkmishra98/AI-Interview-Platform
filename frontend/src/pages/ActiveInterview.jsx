import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Timer, Send, ChevronRight, ChevronLeft, AlertCircle, Cpu, FileText, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ActiveInterview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [interview, setInterview] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/interview/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.data.status === 'completed') {
          navigate(`/interview/result/${id}`);
          return;
        }

        setInterview(res.data.data);
        setAnswers(new Array(res.data.data.questions.length).fill(''));
        setIsLoading(false);
      } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to load interview');
        setIsLoading(false);
        navigate('/dashboard');
      }
    };

    fetchInterview();
  }, [id, navigate]);

  // Timer logic
  useEffect(() => {
    if (isLoading || isSubmitting) return;
    
    if (timeLeft <= 0) {
      handleSubmit(); // Auto-submit when time is up
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isLoading, isSubmitting, id, answers, navigate]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleAnswerChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < interview.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/interview/${id}/submit`,
        { answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Interview submitted successfully! Analyzing your performance...');
      navigate(`/interview/result/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit interview');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-[#050B14] min-h-screen flex flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-[#050B14] to-[#050B14] z-0 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 border-4 border-white/5 border-t-primary rounded-full animate-spin mb-6 shadow-[0_0_30px_rgba(139,92,246,0.3)]"></div>
          <p className="text-xl text-white font-bold animate-pulse flex items-center gap-2">
            <Sparkles className="text-primary" size={24} /> Initialize AI Environment...
          </p>
        </div>
      </div>
    );
  }

  if (!interview) return null;

  const currentQuestion = interview.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === interview.questions.length - 1;
  const progressPercentage = ((currentQuestionIndex + 1) / interview.questions.length) * 100;

  return (
    <div className="flex-1 bg-[#050B14] min-h-screen flex flex-col font-sans overflow-x-hidden relative">
      {/* Premium Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full mix-blend-screen filter blur-[150px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full mix-blend-screen filter blur-[150px]"></div>
      </div>
      
      {/* Header */}
      <header className="glass-panel border-b border-white/5 px-6 py-4 sticky top-0 z-50 flex flex-col sm:flex-row justify-between items-center gap-4 backdrop-blur-2xl bg-[#0B1120]/70 shadow-lg">
        <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start">
          <div className="hidden sm:flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)] border border-white/10">
               <Cpu className="text-white" size={24} />
             </div>
             <div>
               <h2 className="font-extrabold text-white text-xl flex items-center gap-2 tracking-tight">
                 {interview.jobRole} Interview
               </h2>
               <div className="flex items-center gap-2 mt-1.5">
                 <span className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 backdrop-blur-md tracking-wider uppercase">
                   {interview.category}
                 </span>
                 <span className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 backdrop-blur-md tracking-wider uppercase">
                   {interview.difficulty}
                 </span>
               </div>
             </div>
          </div>
          
          {/* Question Indicator */}
          <div className="bg-[#0A101D] border border-white/10 px-5 py-2.5 rounded-xl flex items-center gap-3 shadow-inner relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
            <span className="text-xs uppercase tracking-widest font-bold text-gray-400">Question</span>
            <span className="font-black text-white text-xl">{currentQuestionIndex + 1} <span className="text-gray-500 text-sm">/ {interview.questions.length}</span></span>
          </div>
        </div>
        
        <div className="w-full sm:w-auto flex items-center justify-end">
          <motion.div 
            animate={timeLeft < 60 ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
            className={`flex items-center justify-center gap-3 px-6 py-3 rounded-2xl font-mono font-bold text-xl shadow-lg border backdrop-blur-md ${
              timeLeft < 60 
                ? 'text-red-400 bg-red-500/10 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
                : 'text-primary bg-primary/10 border-primary/20 shadow-[0_0_20px_rgba(139,92,246,0.15)]'
            }`}
          >
            <Timer size={24} className={timeLeft < 60 ? 'animate-pulse' : ''} />
            {formatTime(timeLeft)}
          </motion.div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-[#0A101D] relative z-40 border-b border-white/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-primary via-purple-500 to-accent shadow-[0_0_15px_rgba(139,92,246,0.6)] relative"
        >
           <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/50"></div>
        </motion.div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 flex flex-col gap-8 relative z-10">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -30, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex-1 flex flex-col gap-6"
          >
            {/* Question Panel */}
            <div className="glass-panel p-8 sm:p-10 relative overflow-hidden group rounded-3xl border border-white/5 bg-[#0A101D]/80 backdrop-blur-xl shadow-2xl">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary to-accent shadow-[0_0_20px_rgba(139,92,246,0.5)]"></div>
              
              {/* Decorative faint icon */}
              <FileText className="absolute right-[-20px] bottom-[-20px] w-48 h-48 text-white/[0.02] rotate-[-15deg] pointer-events-none" />
              
              <div className="flex items-start gap-6 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-1 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <span className="font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent text-lg">Q{currentQuestionIndex + 1}</span>
                </div>
                <h3 className="text-2xl sm:text-[28px] font-bold text-white leading-relaxed tracking-tight">
                  {currentQuestion.questionText}
                </h3>
              </div>
            </div>

            {/* Answer Box */}
            <div className="flex-1 flex flex-col relative group">
              <div className="flex justify-between items-end mb-4 px-2">
                <label className="text-gray-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                  <Send size={16} className="text-primary" /> Your Response
                </label>
                {timeLeft < 300 && (
                  <span className="text-xs text-orange-400 font-bold flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 rounded-full border border-orange-500/20 animate-pulse">
                    <AlertCircle size={14} /> Time running low
                  </span>
                )}
              </div>
              
              <div className="relative flex-1 min-h-[350px]">
                <textarea
                  className="absolute inset-0 w-full h-full glass-panel p-8 text-lg text-gray-200 bg-[#0A101D]/50 focus:bg-[#0A101D]/80 border border-white/5 focus:border-primary/50 outline-none transition-all duration-300 resize-none font-medium leading-relaxed shadow-inner placeholder-gray-600 focus:shadow-[0_0_30px_rgba(139,92,246,0.15)] rounded-3xl backdrop-blur-xl scrollbar-thin"
                  placeholder="Type your detailed, structured answer here... Consider using the STAR method (Situation, Task, Action, Result) for behavioral questions."
                  value={answers[currentQuestionIndex]}
                  onChange={handleAnswerChange}
                ></textarea>
                
                {/* Visual indicator for typing */}
                <div className="absolute bottom-6 right-6 pointer-events-none flex items-center gap-3 bg-[#050B14]/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5">
                  <span className="text-xs font-mono text-gray-400 font-bold">
                    {answers[currentQuestionIndex].length} chars
                  </span>
                  <div className="flex gap-1">
                    <div className={`w-2 h-2 rounded-full transition-colors ${answers[currentQuestionIndex].length > 0 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-600'}`}></div>
                    <div className={`w-2 h-2 rounded-full transition-colors ${answers[currentQuestionIndex].length > 100 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-600'}`}></div>
                    <div className={`w-2 h-2 rounded-full transition-colors ${answers[currentQuestionIndex].length > 300 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-600'}`}></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-white/5">
          <button
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 py-3.5 px-8 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg"
          >
            <ChevronLeft size={20} />
            Previous Question
          </button>

          {!isLastQuestion ? (
            <button
              onClick={handleNext}
              className="w-full sm:w-auto btn-primary py-3.5 px-10 rounded-2xl font-bold text-[15px] shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center justify-center gap-2 group"
            >
              Next Question
              <ChevronRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-3.5 px-10 rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <CheckCircle2 size={20} />
              )}
              {isSubmitting ? 'Evaluating...' : 'Finish & Submit'}
            </motion.button>
          )}
        </div>
      </main>
    </div>
  );
};

export default ActiveInterview;
