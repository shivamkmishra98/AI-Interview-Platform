import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Terminal, ChevronDown, ArrowLeft, Code2, PlayCircle, ShieldCheck, Layout, FileText, Settings, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LANGUAGE_BOILERPLATES = {
  python: 'def solve():\n    # Write your code here\n    pass\n\nif __name__ == "__main__":\n    solve()',
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}',
  java: 'public class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}'
};

const CodingInterview = () => {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(LANGUAGE_BOILERPLATES['python']);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeTab, setActiveTab] = useState('input'); // 'input' or 'output'
  const navigate = useNavigate();

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(LANGUAGE_BOILERPLATES[newLang]);
  };

  const handleRunCode = async () => {
    setIsExecuting(true);
    setActiveTab('output');
    setOutput('Compiling and Executing in Virtual Sandbox...');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/execute',
        { language, code, input },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.data.success) {
        setOutput(res.data.data.output || 'Execution completed with no output.');
        toast.success('Execution successful');
      } else {
        setOutput(res.data.data.output || 'Execution failed.');
        toast.error('Execution failed');
      }
    } catch (err) {
      setOutput(err.response?.data?.error || 'Server error during execution.');
      toast.error('Server error');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmitCode = async () => {
    setIsExecuting(true);
    setActiveTab('output');
    setOutput('Evaluating test cases against AI Oracle...');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/execute',
        { language, code, input },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.data.success) {
        setOutput(res.data.data.output || 'All test cases passed successfully!');
        toast.success('Solution Accepted! Amazing job.');
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        setOutput(res.data.data.output || 'Execution failed on hidden test cases.');
        toast.error('Submission Failed. Check your logic.');
      }
    } catch (err) {
      setOutput(err.response?.data?.error || 'Server error during submission.');
      toast.error('Server error');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="flex-1 bg-[#050B14] min-h-screen flex flex-col font-sans overflow-hidden text-gray-200">
      {/* Header */}
      <header className="glass-panel border-b border-white/5 px-6 py-4 flex justify-between items-center z-20 backdrop-blur-2xl bg-[#0A101D]/90 shadow-xl">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors shadow-sm">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-purple-600 to-accent border border-white/20 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]">
              <Code2 className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-black text-white leading-tight tracking-tight">Nexus IDE</h1>
              <p className="text-[11px] text-primary font-bold uppercase tracking-widest">Secure Sandbox</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="relative group">
            <select
              value={language}
              onChange={handleLanguageChange}
              className="appearance-none bg-black/40 border border-white/10 hover:border-primary/50 text-white text-sm font-bold rounded-xl pl-5 pr-12 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer shadow-inner backdrop-blur-md"
            >
              <option value="python">Python 3.10</option>
              <option value="cpp">C++ (GCC 11)</option>
              <option value="java">Java (OpenJDK 17)</option>
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary transition-colors pointer-events-none" />
          </div>
          
          <div className="h-6 w-px bg-white/10"></div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRunCode}
            disabled={isExecuting}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-sm group hover:border-primary/30"
          >
            {isExecuting && activeTab === 'output' && !output.includes('Evaluating') ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <PlayCircle size={18} className="text-gray-400 group-hover:text-primary transition-colors" />
            )}
            Run Code
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmitCode}
            disabled={isExecuting}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] border border-green-400/20"
          >
            {isExecuting && output.includes('Evaluating') ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <ShieldCheck size={18} />
            )} 
            Submit
          </motion.button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Problem Description */}
        <div className="w-[40%] border-r border-white/5 flex flex-col bg-[#0A101D]/50 relative z-10 backdrop-blur-xl">
          <div className="bg-[#0B1120] border-b border-white/5 px-6 py-3.5 flex justify-between items-center shadow-md z-10">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <FileText size={14} className="text-primary" /> Problem Statement
            </h2>
            <div className="flex gap-2">
               <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
            </div>
          </div>
          
          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar relative">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full mix-blend-screen filter blur-[80px] pointer-events-none"></div>
             
            <h1 className="text-3xl font-black text-white mb-4 tracking-tight">1. Two Sum</h1>
            <div className="flex flex-wrap gap-3 mb-10">
              <span className="px-3.5 py-1 bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-bold rounded-md shadow-sm uppercase tracking-wider">Easy</span>
              <span className="px-3.5 py-1 bg-white/5 border border-white/10 text-gray-300 text-xs font-bold rounded-md hover:bg-white/10 transition-colors cursor-pointer uppercase tracking-wider">Array</span>
              <span className="px-3.5 py-1 bg-white/5 border border-white/10 text-gray-300 text-xs font-bold rounded-md hover:bg-white/10 transition-colors cursor-pointer uppercase tracking-wider">Hash Table</span>
            </div>
            <div className="prose prose-invert max-w-none text-gray-300 text-[15px] leading-relaxed">
              <p>Given an array of integers <code className="bg-black/50 border border-white/10 px-2 py-1 rounded text-accent font-bold">nums</code> and an integer <code className="bg-black/50 border border-white/10 px-2 py-1 rounded text-accent font-bold">target</code>, return <em>indices of the two numbers such that they add up to <code className="bg-black/50 border border-white/10 px-2 py-1 rounded text-accent font-bold">target</code></em>.</p>
              <p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the <em>same</em> element twice.</p>
              <p>You can return the answer in any order.</p>
              
              <div className="mt-10 space-y-8">
                <div>
                  <h3 className="text-white font-bold mb-4 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(139,92,246,0.8)]"></div>
                    Example 1:
                  </h3>
                  <div className="bg-black/40 border border-white/5 p-6 rounded-2xl font-mono text-sm shadow-inner relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/50 group-hover:bg-primary transition-colors shadow-[0_0_10px_rgba(139,92,246,0.8)]"></div>
                    <div className="text-gray-400 mb-2"><strong className="text-white">Input:</strong> nums = [2,7,11,15], target = 9</div>
                    <div className="text-gray-400 mb-2"><strong className="text-white">Output:</strong> [0,1]</div>
                    <div className="text-gray-400"><strong className="text-white">Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-bold mb-4 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_rgba(56,189,248,0.8)]"></div>
                    Constraints:
                  </h3>
                  <ul className="list-none space-y-3 text-sm">
                    <li className="flex items-center gap-3"><Sparkles size={14} className="text-accent" /> <code className="bg-white/5 px-2 py-0.5 rounded text-gray-300">2 &lt;= nums.length &lt;= 10^4</code></li>
                    <li className="flex items-center gap-3"><Sparkles size={14} className="text-accent" /> <code className="bg-white/5 px-2 py-0.5 rounded text-gray-300">-10^9 &lt;= nums[i] &lt;= 10^9</code></li>
                    <li className="flex items-center gap-3"><Sparkles size={14} className="text-accent" /> <code className="bg-white/5 px-2 py-0.5 rounded text-gray-300">-10^9 &lt;= target &lt;= 10^9</code></li>
                    <li className="flex items-center gap-3"><Sparkles size={14} className="text-accent" /> <strong className="text-white font-bold">Only one valid answer exists.</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Code Editor and Console */}
        <div className="flex-1 flex flex-col relative bg-[#0D1117]">
          {/* Editor Area */}
          <div className="flex-1 relative flex flex-col">
            <div className="bg-[#161B22] border-b border-[#30363D] px-4 py-2 flex justify-between items-center z-10">
              <div className="flex gap-1">
                 <div className="bg-[#0D1117] border-t-2 border-t-primary border-x border-[#30363D] px-4 py-1.5 rounded-t-md text-sm font-mono text-white flex items-center gap-2">
                   {language === 'python' ? 'solution.py' : language === 'cpp' ? 'main.cpp' : 'Main.java'}
                 </div>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Settings size={16} className="cursor-pointer hover:text-white transition-colors" />
                <Layout size={16} className="cursor-pointer hover:text-white transition-colors" />
              </div>
            </div>
            
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none"></div>
              <Editor
                height="100%"
                theme="vs-dark"
                language={language}
                value={code}
                onChange={(val) => setCode(val)}
                options={{
                  minimap: { enabled: false },
                  fontSize: 16,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  fontLigatures: true,
                  padding: { top: 24, bottom: 24 },
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  cursorBlinking: "expand",
                  cursorSmoothCaretAnimation: "on",
                  formatOnPaste: true,
                  lineHeight: 1.8,
                  renderLineHighlight: "all",
                  scrollbar: {
                    verticalScrollbarSize: 8,
                    horizontalScrollbarSize: 8,
                  }
                }}
                loading={
                  <div className="flex h-full items-center justify-center bg-[#0D1117]">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  </div>
                }
              />
            </div>
          </div>

          {/* Console / Output Area */}
          <div className="h-[35%] border-t border-[#30363D] bg-[#0A101D] flex flex-col relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <div className="flex border-b border-[#30363D] bg-[#050B14]">
              <button 
                onClick={() => setActiveTab('input')}
                className={`px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all relative ${activeTab === 'input' ? 'text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
              >
                {activeTab === 'input' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_rgba(139,92,246,0.8)]"></div>}
                Custom Testcase
              </button>
              <button 
                onClick={() => setActiveTab('output')}
                className={`flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all relative ${activeTab === 'output' ? 'text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
              >
                {activeTab === 'output' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent shadow-[0_0_10px_rgba(56,189,248,0.8)]"></div>}
                <Terminal size={14} className={activeTab === 'output' ? 'text-accent' : ''} /> Console Output
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden p-0 relative">
               <div className="absolute left-0 top-0 bottom-0 w-8 bg-[#0D1117] border-r border-[#30363D] flex flex-col items-center py-2 gap-2 z-10">
                 <span className="text-gray-600 font-mono text-[10px]">1</span>
                 <span className="text-gray-600 font-mono text-[10px]">2</span>
                 <span className="text-gray-600 font-mono text-[10px]">3</span>
               </div>
              <AnimatePresence mode="wait">
                {activeTab === 'input' ? (
                  <motion.div
                    key="input"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="w-full h-full pl-8"
                  >
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="w-full h-full bg-transparent p-4 text-gray-300 font-mono text-[15px] resize-none focus:outline-none transition-all custom-scrollbar leading-relaxed"
                      placeholder="Enter inputs line by line..."
                    ></textarea>
                  </motion.div>
                ) : (
                  <motion.div
                    key="output"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="w-full h-full bg-[#050B14] p-6 overflow-y-auto custom-scrollbar relative pl-12"
                  >
                    {isExecuting ? (
                       <div className="flex items-center gap-3 text-gray-400 font-mono text-[15px] animate-pulse">
                         <div className="w-5 h-5 border-2 border-primary/50 border-t-primary rounded-full animate-spin"></div>
                         {output}
                       </div>
                    ) : (
                      <pre className={`font-mono text-[15px] whitespace-pre-wrap leading-relaxed ${output.includes('Error') || output.includes('Exception') || output.includes('failed') ? 'text-red-400 bg-red-500/5 p-4 rounded-xl border border-red-500/10' : 'text-green-400'}`}>
                        {output || <span className="text-gray-600 italic">~&gt; Ready for execution.</span>}
                      </pre>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingInterview;
