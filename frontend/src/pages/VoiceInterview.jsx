import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Mic, MicOff, Video, PhoneOff, Activity, Volume2, User as UserIcon, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceInterview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [conversation, setConversation] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [interviewPhase, setInterviewPhase] = useState('intro'); // 'intro', 'questions', 'closing'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWebcam, setShowWebcam] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [isConversationInitialized, setIsConversationInitialized] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  useEffect(() => {
    // Wait for voices to load
    const loadVoices = () => {
      synthRef.current.getVoices();
      setVoicesLoaded(true);
    };
    if (synthRef.current.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = loadVoices;
    }
    loadVoices();
  }, []);

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
        setIsLoading(false);
      } catch (err) {
        toast.error('Failed to load voice interview');
        navigate('/dashboard');
      }
    };
    fetchInterview();
    
    // Start Webcam
    startWebcam();

    // Capture refs at effect time
    const currentSynthRef = synthRef.current;
    const currentRecognitionRef = recognitionRef.current;

    return () => {
      stopWebcam();
      if (currentSynthRef) {
        currentSynthRef.cancel();
      }
      if (currentRecognitionRef) {
        currentRecognitionRef.stop();
      }
    };
  }, [id, navigate]);

  useEffect(() => {
    if (!isLoading && interview && !isConversationInitialized && voicesLoaded) {
      // Start the conversation
      const greeting = `Hello there! I'm your AI interviewer today, and I'll be taking your mock interview for the ${interview.jobRole} position. How are you feeling today? Are you ready to begin?`;
      setConversation([{ role: 'ai', content: greeting }]);
      setIsConversationInitialized(true);
    }
  }, [isLoading, interview, voicesLoaded, isConversationInitialized]);

  // Separate effect to handle speaking when conversation updates
  useEffect(() => {
    if (conversation.length > 0 && conversation[conversation.length - 1].role === 'ai') {
      const lastMessage = conversation[conversation.length - 1].content;
      speakText(lastMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation]);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
    } catch (err) {
      console.error("Error accessing webcam", err);
      toast.error('Could not access webcam. You can still proceed with audio only.');
      setShowWebcam(false);
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const speakText = (text) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a highly natural female voice
    const voices = synthRef.current.getVoices();
    // Prioritize premium/natural female voices across different platforms
    const preferredVoices = [
      'Google UK English Female',
      'Google US English',
      'Microsoft Zira',
      'Microsoft Zira Desktop',
      'Samantha',
      'Karen',
      'Tessa',
      'Victoria',
      'en-US-Standard-F', // Chrome generic
      'en-GB-Standard-A'
    ];
    
    let selectedVoice = null;
    for (const name of preferredVoices) {
      const voice = voices.find(v => v.name.includes(name));
      if (voice) {
        selectedVoice = voice;
        break;
      }
    }
    
    // Fallback to any female or English voice
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.name.toLowerCase().includes('female')) || voices.find(v => v.lang.startsWith('en'));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = 0.95; // Slightly slower for a more natural, conversational feel
    utterance.pitch = 1.05; // Slightly higher pitch for female resonance

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsThinking(false);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      // Auto start listening after AI finishes speaking
      startListening();
    };
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Speech recognition is not supported in this browser. Please use Chrome.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      setTranscript(interimTranscript);
      if (finalTranscript) {
        setCurrentAnswer(prev => prev + ' ' + finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setTranscript('');
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleToggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const submitAnswerAndContinue = async () => {
    if (isListening) stopListening();
    
    const answer = currentAnswer.trim();
    if (!answer && !transcript) {
      toast.error('Please provide an answer before continuing.');
      return;
    }

    const finalAnswer = answer || transcript;

    // Add user answer to conversation
    const updatedConversation = [...conversation, { role: 'user', content: finalAnswer }];
    setConversation(updatedConversation);
    setCurrentAnswer('');
    setTranscript('');
    setIsThinking(true);

    if (interviewPhase === 'intro') {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.post(
          'http://localhost:5000/api/interview/voice/turn',
          {
            interviewId: id,
            currentQuestionIndex: 0,
            userAnswer: finalAnswer,
            conversationHistory: updatedConversation
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        const aiResponse = res.data.data.aiResponse;
        const firstQuestion = interview.questions[0].questionText;
        const fullResponse = `${aiResponse} ${firstQuestion}`;
        
        setInterviewPhase('questions');
        setConversation(prev => [...prev, { role: 'ai', content: fullResponse }]);
        speakText(fullResponse);
      } catch (err) {
        setInterviewPhase('questions');
        const fallbackResponse = `Great! Let's get started. ${interview.questions[0].questionText}`;
        setConversation(prev => [...prev, { role: 'ai', content: fallbackResponse }]);
        speakText(fallbackResponse);
      }
      return;
    }

    // If it's the last question, finish interview
    if (currentQuestionIndex >= interview.questions.length - 1) {
      if (interviewPhase === 'closing') return;
      setInterviewPhase('closing');
      
      const closingSpeech = "Thank you, it was really nice interacting with you. You've answered all the questions. I'll now generate your interview feedback report.";
      setConversation(prev => [...prev, { role: 'ai', content: closingSpeech }]);
      speakText(closingSpeech);
      
      // Delay routing to let AI finish speaking
      setTimeout(() => {
         finishInterview(updatedConversation);
      }, 7000);
      return;
    }

    // Move to next question
    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
    
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/interview/voice/turn',
        {
          interviewId: id,
          currentQuestionIndex: nextIndex,
          userAnswer: finalAnswer,
          conversationHistory: updatedConversation
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const aiResponse = res.data.data.aiResponse;
      const nextQuestionText = interview.questions[nextIndex].questionText;
      const fullResponse = `${aiResponse} ${nextQuestionText}`;
      
      setConversation(prev => [...prev, { role: 'ai', content: fullResponse }]);
      speakText(fullResponse);
    } catch (err) {
      console.error('Failed to get AI response', err);
      // Fallback
      const nextQuestionText = interview.questions[nextIndex].questionText;
      const fallbackResponse = `Got it. Let's move on. ${nextQuestionText}`;
      setConversation(prev => [...prev, { role: 'ai', content: fallbackResponse }]);
      speakText(fallbackResponse);
    }
  };

  const finishInterview = async (finalConv) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      
      // We will map the conversation back to the questions array format for the existing endpoint
      const answersArray = interview.questions.map((q, idx) => {
        // Extract user answers sequentially from the conversation
        const userResponses = finalConv.filter(msg => msg.role === 'user');
        // Offset by 1 because userResponses[0] is the greeting response
        return userResponses[idx + 1] ? userResponses[idx + 1].content : 'No answer provided.';
      });

      // Submit to the existing backend endpoint
      await axios.post(
        `http://localhost:5000/api/interview/${id}/submit`,
        { answers: answersArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Voice Interview completed! Generating detailed feedback...');
      navigate(`/interview/result/${id}`);
    } catch (err) {
      toast.error('Failed to submit interview');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-[#0b1120] min-h-screen flex justify-center items-center">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="text-primary animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#050B14] min-h-screen flex flex-col font-sans overflow-hidden relative">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-[#050B14] to-[#050B14] z-0 pointer-events-none"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full mix-blend-screen filter blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full mix-blend-screen filter blur-[150px] pointer-events-none z-0"></div>

      <header className="glass-panel border-b border-white/5 px-6 py-4 sticky top-0 z-50 flex justify-between items-center backdrop-blur-xl bg-[#0B1120]/60">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              <Volume2 className="text-white" size={20} />
            </div>
            {(isSpeaking || isThinking) && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#0B1120] rounded-full animate-pulse"></span>
            )}
          </div>
          <div>
            <h2 className="font-bold text-white text-xl tracking-tight">AI Voice Interview</h2>
            <p className="text-sm text-gray-400 font-medium">{interview?.jobRole} • {interview?.category}</p>
          </div>
        </div>
        <button 
          onClick={() => {
            if(window.confirm('Are you sure you want to end this interview?')) {
               navigate('/dashboard');
            }
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 text-red-400 font-semibold border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 transition-all shadow-lg"
        >
          <PhoneOff size={18} /> End Call
        </button>
      </header>

      <main className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8 relative z-10 max-w-[1600px] mx-auto w-full h-[calc(100vh-80px)]">
        
        {/* Left Column: AI Avatar & Webcam */}
        <div className="w-full lg:w-5/12 flex flex-col gap-6 h-full">
          {/* AI Avatar Box */}
          <div className="relative glass-panel rounded-3xl p-8 flex flex-col items-center justify-center flex-1 overflow-hidden border border-white/5 bg-[#0A101D]/80 backdrop-blur-xl shadow-2xl">
            {/* Dynamic Background Glow */}
            <AnimatePresence>
              {isSpeaking && (
                 <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   className="absolute inset-0 bg-[conic-gradient(at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-accent/10 opacity-50 pointer-events-none"
                 />
              )}
            </AnimatePresence>
            
            <div className="relative mb-8 z-10 flex flex-col items-center">
              {/* Premium Orb Avatar */}
              <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Outer pulsing rings when speaking */}
                {isSpeaking && (
                  <>
                    <motion.div 
                      animate={{ scale: [1, 1.4, 2], opacity: [0.6, 0.3, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                      className="absolute inset-0 rounded-full border-2 border-primary/40 bg-primary/10"
                    />
                    <motion.div 
                      animate={{ scale: [1, 1.4, 2], opacity: [0.6, 0.3, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
                      className="absolute inset-0 rounded-full border-2 border-accent/40 bg-accent/10"
                    />
                    <motion.div 
                      animate={{ scale: [1, 1.4, 2], opacity: [0.6, 0.3, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1.2 }}
                      className="absolute inset-0 rounded-full border-2 border-purple-400/40 bg-purple-400/10"
                    />
                  </>
                )}

                {/* Main Orb */}
                <motion.div 
                  animate={
                    isSpeaking 
                      ? { scale: [1, 1.05, 0.95, 1], boxShadow: ["0 0 40px rgba(139,92,246,0.5)", "0 0 80px rgba(139,92,246,0.8)", "0 0 40px rgba(139,92,246,0.5)"] } 
                      : isThinking
                      ? { scale: [1, 1.02, 1], rotate: [0, 180, 360], boxShadow: ["0 0 20px rgba(56,189,248,0.3)", "0 0 40px rgba(56,189,248,0.5)", "0 0 20px rgba(56,189,248,0.3)"] }
                      : { scale: [1, 1.02, 1], boxShadow: ["0 0 20px rgba(255,255,255,0.05)", "0 0 30px rgba(255,255,255,0.1)", "0 0 20px rgba(255,255,255,0.05)"] }
                  }
                  transition={{ duration: isSpeaking ? 1.5 : isThinking ? 3 : 4, repeat: Infinity, ease: "easeInOut" }}
                  className={`w-40 h-40 rounded-full flex items-center justify-center z-10 relative overflow-hidden backdrop-blur-md ${isSpeaking ? 'bg-gradient-to-tr from-primary via-purple-500 to-accent' : isThinking ? 'bg-gradient-to-tr from-blue-500 via-cyan-500 to-blue-400' : 'bg-surface border border-white/10'}`}
                >
                  <div className="absolute inset-0 bg-black/20 rounded-full mix-blend-overlay"></div>
                  {isThinking ? (
                    <Loader2 size={50} className="text-white animate-spin drop-shadow-lg" />
                  ) : (
                    <Sparkles size={50} className={`drop-shadow-lg ${isSpeaking ? 'text-white' : 'text-gray-400'}`} />
                  )}
                </motion.div>
              </div>
              
              <div className="mt-8 text-center space-y-2">
                <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">AI Recruiter</h3>
                <div className="flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-black/40 border border-white/5 backdrop-blur-sm">
                  {isSpeaking ? (
                    <>
                      <span className="flex gap-1">
                        {[1, 2, 3].map((i) => (
                          <motion.span key={i} animate={{ height: ['4px', '12px', '4px'] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }} className="w-1 bg-green-400 rounded-full block" />
                        ))}
                      </span>
                      <span className="text-green-400 text-sm font-semibold tracking-wide">Speaking</span>
                    </>
                  ) : isThinking ? (
                    <>
                      <Loader2 size={14} className="text-blue-400 animate-spin" />
                      <span className="text-blue-400 text-sm font-semibold tracking-wide">Analyzing</span>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                      <span className="text-gray-400 text-sm font-semibold tracking-wide">Listening to you...</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* User Webcam Box */}
          {showWebcam && (
            <div className="glass-panel overflow-hidden relative h-[280px] rounded-3xl border border-white/5 shadow-2xl bg-black">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none"></div>
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-2 border border-white/10 shadow-lg">
                <Video size={16} className="text-primary" /> You
              </div>
              {isListening && (
                 <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                   <div className="flex gap-1 items-end h-4">
                     {[1,2,3,4,5].map(i => (
                       <motion.div 
                         key={i}
                         animate={{ height: ['4px', '16px', '4px'] }}
                         transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
                         className="w-1 bg-accent rounded-full"
                       />
                     ))}
                   </div>
                   <span className="text-xs font-bold text-accent tracking-wider">MIC ON</span>
                 </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Transcript & Controls */}
        <div className="w-full lg:w-7/12 flex flex-col gap-6 h-full">
          <div className="glass-panel flex-1 p-6 lg:p-8 flex flex-col overflow-hidden rounded-3xl border border-white/5 bg-[#0A101D]/80 backdrop-blur-xl shadow-2xl relative">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 border-b border-white/10 pb-5">
              <Activity className="text-primary" size={24} /> 
              Live Transcript
            </h3>
            
            <div className="flex-1 overflow-y-auto pr-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              <AnimatePresence>
                {conversation.map((msg, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    key={idx} 
                    className={`flex flex-col ${msg.role === 'ai' ? 'items-start' : 'items-end'}`}
                  >
                    <span className={`text-[11px] mb-2 font-bold uppercase tracking-widest px-3 py-1 rounded-full ${msg.role === 'ai' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-gray-400'}`}>
                      {msg.role === 'ai' ? 'AI Interviewer' : 'You'}
                    </span>
                    <div className={`p-5 rounded-2xl max-w-[85%] shadow-lg leading-relaxed text-[15px] ${
                      msg.role === 'ai' 
                        ? 'bg-surface/80 border border-white/5 text-white rounded-tl-sm backdrop-blur-sm' 
                        : 'bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 text-white rounded-tr-sm backdrop-blur-sm'
                    }`}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                
                {/* Current answer being spoken */}
                {(currentAnswer || transcript) && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-end"
                  >
                    <span className="text-[11px] mb-2 font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 text-gray-400">You</span>
                    <div className="p-5 rounded-2xl max-w-[85%] bg-white/5 border border-white/10 text-white rounded-tr-sm backdrop-blur-sm leading-relaxed text-[15px]">
                      {currentAnswer} <span className="opacity-60 italic text-accent">{transcript}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Interaction Controls */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-gradient-to-t from-[#0A101D] to-[#0A101D]/80 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            {/* Background animated wave */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
               <motion.div 
                 initial={{ width: "0%" }}
                 animate={{ width: "100%" }}
                 transition={{ duration: 10, repeat: Infinity }}
                 className="h-full bg-gradient-to-r from-transparent via-primary to-transparent"
               />
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 relative z-10">
              <div className="flex items-center gap-5 w-full sm:w-auto">
                <button 
                  onClick={handleToggleMic}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl relative group ${
                    isListening 
                      ? 'bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.4)]' 
                      : 'bg-surface border border-white/10 text-white hover:bg-white/5 hover:border-white/20'
                  }`}
                >
                  {isListening ? (
                    <>
                      <Mic size={28} className="animate-pulse" />
                      <span className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-50"></span>
                    </>
                  ) : (
                    <MicOff size={28} className="group-hover:scale-110 transition-transform" />
                  )}
                </button>
                <div>
                  <h4 className="font-bold text-white text-lg">{isListening ? 'Listening...' : 'Microphone Off'}</h4>
                  <p className="text-sm text-gray-400 font-medium">{isListening ? 'Speak your answer clearly' : 'Tap mic to start speaking'}</p>
                </div>
              </div>

              <button 
                onClick={submitAnswerAndContinue}
                disabled={isSpeaking || (!currentAnswer && !transcript && !isListening) || isThinking}
                className="btn-primary py-4 px-8 w-full sm:w-auto disabled:opacity-50 text-[15px] font-bold rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center justify-center gap-2 transition-all"
              >
                {isSubmitting || isThinking ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : null}
                {currentQuestionIndex >= interview?.questions.length - 1 ? 'Finish Interview' : 'Submit & Next Question'}
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default VoiceInterview;
