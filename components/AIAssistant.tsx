
import React, { useState, useRef, useEffect } from 'react';
import { askFlixa, ChatMessage } from '../services/geminiService';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'Welcome to the FLIXA Lounge. I am your personal Cinema Concierge. Do you have any doubts about our showtimes, parking, or the booking process?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (textOverride?: string) => {
    const userMsg = textOverride || input;
    if (!userMsg.trim()) return;
    
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    // Prepare history for Gemini API
    const botResponse = await askFlixa(userMsg, chatHistory);
    
    const responseText = botResponse || 'I am processing your inquiry.';
    
    setMessages(prev => [...prev, { role: 'bot', text: responseText }]);
    
    // Update persistent history
    setChatHistory(prev => [
      ...prev,
      { role: 'user', parts: [{ text: userMsg }] },
      { role: 'model', parts: [{ text: responseText }] }
    ]);
    
    setIsTyping(false);
  };

  const quickDoubts = [
    "What are the showtimes?",
    "How does parking work?",
    "Ticket prices?",
    "Security & OTP?"
  ];

  return (
    <div className="fixed bottom-24 right-8 z-[140] flex flex-col items-end">
      {isOpen && (
        <div className="w-85 md:w-96 h-[550px] bg-[#030712]/98 backdrop-blur-3xl border border-[#00f2ff]/30 rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,242,255,0.2)] flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-500">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-[#030712] to-slate-900 border-b border-[#00f2ff]/10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#00f2ff]/10 flex items-center justify-center border border-[#00f2ff]/30">
                  <svg className="w-5 h-5 text-[#00f2ff]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#030712]" />
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest eye-catchy-gradient">Cinema Concierge</h4>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">AI Doubts Assistant</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          {/* Quick Actions Bar */}
          <div className="px-4 py-3 bg-slate-900/50 border-b border-white/5 flex gap-2 overflow-x-auto custom-scrollbar no-scrollbar">
            {quickDoubts.map((doubt) => (
              <button 
                key={doubt} 
                onClick={() => handleSend(doubt)}
                className="whitespace-nowrap px-4 py-1.5 bg-slate-800 border border-[#00f2ff]/10 rounded-full text-[9px] font-black text-slate-300 uppercase tracking-widest hover:border-[#00f2ff]/40 hover:text-[#00f2ff] transition-all"
              >
                {doubt}
              </button>
            ))}
          </div>

          {/* Chat Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-[1.5rem] text-[12px] font-medium leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-[#00f2ff] text-slate-950 rounded-tr-none shadow-xl shadow-[#00f2ff]/10' 
                    : 'bg-slate-900 border border-white/5 text-slate-200 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-900 p-4 rounded-[1.5rem] rounded-tl-none border border-white/5 flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-[#00f2ff] rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-[#00f2ff] rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-[#00f2ff] rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-slate-950/80 border-t border-white/5">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask your cinematic doubt..."
                className="w-full bg-slate-900 border border-white/10 rounded-2xl pl-5 pr-14 py-4 text-[12px] text-white focus:outline-none focus:ring-1 focus:ring-[#00f2ff] transition-all"
              />
              <button 
                onClick={() => handleSend()} 
                className="absolute right-2 p-3 bg-[#00f2ff] rounded-xl text-slate-950 hover:bg-[#00d8e6] transition-colors shadow-lg active:scale-95"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Trigger Button */}
      <div className="flex items-center gap-4">
        {!isOpen && (
          <div className="hidden md:flex bg-[#00f2ff] px-5 py-2.5 rounded-2xl rounded-br-none shadow-[0_10px_30px_rgba(0,242,255,0.3)] animate-in fade-in slide-in-from-right-5 duration-700">
            <span className="text-[11px] font-black text-slate-950 uppercase tracking-widest">DOUBT? ASK AI</span>
          </div>
        )}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 bg-[#00f2ff] rounded-full flex items-center justify-center shadow-[0_15px_45px_rgba(0,242,255,0.4)] hover:scale-110 active:scale-90 transition-all animate-pulse-neon group relative"
        >
          {isOpen ? (
            <svg className="w-7 h-7 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-8 h-8 text-slate-950 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;
