
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Loader2, BrainCircuit, ToggleLeft, ToggleRight } from 'lucide-react';
import { getGeminiChat } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: "Hello! I am your PetroSphere AI assistant. How can I help you with your petrological studies today? I can analyze complex rock systems, explain mineral lattices, or help classify metamorphic facies." }
  ]);
  const [input, setInput] = useState('');
  const [isThinkingMode, setIsThinkingMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current = getGeminiChat(isThinkingMode);
  }, [isThinkingMode]);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async () => {
    if (!input || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: input });
      const modelMsg: ChatMessage = { 
        role: 'model', 
        content: response.text,
        isThinking: isThinkingMode 
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', content: "I encountered an error while processing your request. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] max-w-4xl mx-auto bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      <header className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl">
            <MessageSquare className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif">Petro-Assistant</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Gemini 3 Pro</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setIsThinkingMode(!isThinkingMode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${isThinkingMode ? 'bg-purple-500/10 border-purple-500/50 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
        >
          <BrainCircuit className={`w-4 h-4 ${isThinkingMode ? 'animate-pulse' : ''}`} />
          <span className="text-xs font-bold uppercase tracking-tight">Thinking Mode</span>
          {isThinkingMode ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-emerald-600' : 'bg-slate-800 border border-slate-700'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-emerald-500" />}
              </div>
              <div className={`space-y-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.isThinking && (
                  <div className="flex items-center gap-1 text-[10px] text-purple-400 uppercase font-bold tracking-widest mb-1">
                    <BrainCircuit className="w-3 h-3" />
                    Deep Logic Applied
                  </div>
                )}
                <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-slate-800/80 border border-slate-700/50 text-slate-200 rounded-tl-none'}`}>
                  {msg.content}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] flex gap-4">
              <div className="w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center bg-slate-800 border border-slate-700">
                <Bot className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-800/40 rounded-2xl rounded-tl-none border border-slate-700/50">
                <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                <span className="text-xs text-slate-500 font-medium">Assistant is processing...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-slate-900/80 border-t border-slate-800">
        <div className="relative group">
          <input
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-6 pr-16 text-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
            placeholder={isThinkingMode ? "Enter a complex query for deep reasoning..." : "Ask a petrology question..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!input || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl transition-all shadow-lg shadow-emerald-600/20"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
