import React, { useState, useEffect } from 'react';
import { AuthStep, Movie } from './types';
import { MOCK_MOVIES } from './constants';
import AuthLayout from './components/AuthLayout';
import Button from './components/Button';
import MovieCard from './components/MovieCard';
import MovieBookingModal from './components/MovieBookingModal';
import TrailerModal from './components/TrailerModal';
import AIAssistant from './components/AIAssistant';
import { api } from './services/api';

const FlixLogo = ({ className = "w-24 h-24" }) => (
  <div className={`flex flex-col items-center justify-center ${className}`}>
    <div className="relative mb-6">
      <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-60">
        <div className="w-10 h-1 bg-[#d4af37]"></div>
        <div className="w-14 h-1 bg-[#d4af37]"></div>
        <div className="w-8 h-1 bg-[#d4af37]"></div>
      </div>
      <svg viewBox="0 0 100 80" className="w-20 h-20 drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]">
        <rect x="10" y="20" width="80" height="50" rx="12" className="fill-[#d4af37]" />
        <rect x="35" y="10" width="30" height="10" rx="4" className="fill-[#d4af37]" />
        <circle cx="50" cy="45" r="18" className="fill-[#020617]" />
        <circle cx="50" cy="45" r="14" className="fill-[#d4af37]" />
      </svg>
    </div>
    <div className="relative">
      <div className="border-2 border-[#d4af37]/60 px-10 py-3 rounded-2xl bg-[#d4af37]/10 backdrop-blur-md">
        <span className="text-4xl font-black gold-gradient tracking-tighter uppercase italic block">FLIXA</span>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [step, setStep] = useState<AuthStep>(AuthStep.LOGIN);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [viewingMovie, setViewingMovie] = useState<Movie | null>(null);
  const [bookingMovie, setBookingMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [simulatedOtp, setSimulatedOtp] = useState<string | null>(null);

  useEffect(() => {
    const check = async () => {
      const online = await api.checkHealth();
      setIsBackendOnline(online);
    };
    check();
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async () => {
    if (email.trim()) {
      const res = await api.register(email, phone);
      if (res.isOffline && res.simulatedOtp) {
        setSimulatedOtp(res.simulatedOtp);
      } else {
        setSimulatedOtp(null);
      }
      setStep(AuthStep.OTP);
    }
  };

  const handleVerifyOTP = () => {
    setStep(AuthStep.DASHBOARD);
  };

  const filteredMovies = MOCK_MOVIES.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (step === AuthStep.LOGIN) {
    return (
      <AuthLayout title="FLIXA" subtitle="Access the Premier Grid">
        <div className="space-y-8 py-4">
          <FlixLogo className="mx-auto mb-12" />
          
          <div className="space-y-5">
            <div className="relative">
              <input 
                type="email" 
                placeholder="Identity Email" 
                className="w-full bg-slate-950/80 border-2 border-white/10 rounded-[1.5rem] px-6 py-5 text-white focus:outline-none focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/10 transition-all placeholder:text-slate-500 font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <input 
              type="tel" 
              placeholder="Secure Phone (Optional)" 
              className="w-full bg-slate-950/80 border-2 border-white/10 rounded-[1.5rem] px-6 py-5 text-white focus:outline-none focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/10 transition-all placeholder:text-slate-500 font-medium"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <Button 
            fullWidth 
            onClick={handleLogin}
            className="py-6 bg-[#d4af37] hover:bg-[#b8860b] text-slate-950 font-black uppercase tracking-[0.2em] rounded-[1.5rem] shadow-2xl shadow-[#d4af37]/20 border-none transition-all active:scale-95"
          >
            Initialize Session
          </Button>
          
          <div className="pt-8 flex flex-col items-center gap-5">
            <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-2 ${isBackendOnline ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-blue-500/10 border-blue-500/30'}`}>
              <div className={`w-2.5 h-2.5 rounded-full ${isBackendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}`} />
              <span className={`text-[10px] font-black uppercase tracking-widest ${isBackendOnline ? 'text-emerald-500' : 'text-blue-400'}`}>
                {isBackendOnline ? 'Database Core Online' : 'Simulation Mode Active'}
              </span>
            </div>
            {!isBackendOnline && (
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                 <p className="text-[9px] text-slate-400 uppercase tracking-widest leading-relaxed mb-3">
                   The app is using <span className="text-blue-400">Local Persistence</span>.
                 </p>
                 <p className="text-[8px] text-slate-600 uppercase tracking-widest max-w-[280px]">
                   To sync with a real database, execute <code className="text-[#d4af37] font-bold">python main.py</code> in your project root.
                 </p>
              </div>
            )}
          </div>
        </div>
      </AuthLayout>
    );
  }

  if (step === AuthStep.OTP) {
    return (
      <AuthLayout title="Verification" subtitle="Secure Vault Access">
        <div className="space-y-8">
          <div className="text-center mb-6">
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">A secure code was sent to your identity</p>
            {simulatedOtp && (
              <div className="mt-6 p-6 bg-[#00f2ff]/5 border-2 border-[#00f2ff]/20 rounded-[2rem] animate-pulse">
                <p className="text-[#00f2ff] text-[11px] font-black uppercase tracking-widest mb-3">Simulation Key</p>
                <p className="text-4xl font-black text-white tracking-[0.6em] ml-4">{simulatedOtp}</p>
              </div>
            )}
          </div>
          <div className="flex justify-between gap-4">
            {[1, 2, 3, 4].map(i => (
              <input key={i} type="text" maxLength={1} className="w-full h-24 bg-slate-950/80 border-2 border-white/10 rounded-2xl text-center text-4xl text-white font-black focus:border-[#d4af37] focus:outline-none transition-all" />
            ))}
          </div>
          <Button 
            fullWidth 
            onClick={handleVerifyOTP}
            className="py-6 bg-[#d4af37] text-slate-950 font-black uppercase tracking-[0.2em] rounded-[1.5rem] border-none"
          >
            Verify Identity
          </Button>
          <button onClick={() => setStep(AuthStep.LOGIN)} className="w-full text-[10px] text-slate-500 uppercase font-black tracking-widest hover:text-[#d4af37] transition-colors">Return to Login</button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-[#d4af37]/30">
      <nav className="fixed top-0 w-full z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-12">
           <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-[#d4af37] rounded-full animate-pulse shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
              <span className="text-2xl font-black gold-gradient tracking-tighter uppercase italic">FLIXA</span>
           </div>
           <div className="hidden lg:flex gap-10">
             {['Halls', 'Premier', 'Events', 'Lounge'].map(link => (
               <a key={link} href="#" className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-white transition-all hover:translate-y-[-1px]">{link}</a>
             ))}
           </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className={`hidden sm:flex items-center gap-2.5 px-5 py-2 rounded-full border ${isBackendOnline ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-blue-500/10 border-blue-500/20'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isBackendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}`} />
            <span className={`text-[9px] font-black uppercase tracking-[0.1em] ${isBackendOnline ? 'text-emerald-500' : 'text-blue-400'}`}>
              {isBackendOnline ? 'CORE LINKED' : 'SIMULATED'}
            </span>
          </div>

          <div className="relative hidden md:block">
            <input 
              type="text" 
              placeholder="Search Collection..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900/50 border border-white/10 rounded-full pl-12 pr-6 py-2.5 text-[11px] w-72 focus:outline-none focus:border-[#d4af37]/40 focus:ring-4 focus:ring-[#d4af37]/5 transition-all"
            />
            <svg className="w-4 h-4 absolute left-5 top-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#d4af37] to-amber-200 p-[1.5px] cursor-pointer hover:scale-110 transition-all shadow-xl shadow-[#d4af37]/10 active:scale-95">
             <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                <span className="text-[11px] font-black text-[#d4af37]">JD</span>
             </div>
          </div>
        </div>
      </nav>

      <main className="pt-48 pb-24 px-8 max-w-7xl mx-auto">
        <header className="mb-24">
          <p className="text-[#d4af37] text-[12px] font-black uppercase tracking-[1em] mb-6 animate-in fade-in slide-in-from-left-5 duration-700">Curated for you</p>
          <h2 className="text-7xl md:text-9xl font-black stylish-text uppercase tracking-tighter mb-10 leading-[0.85] animate-in fade-in slide-in-from-left-8 duration-1000">Current Premier<br/>Collection</h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-[#d4af37] to-transparent rounded-full" />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {filteredMovies.length > 0 ? (
            filteredMovies.map(movie => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                onTrailer={setViewingMovie} 
                onBook={setBookingMovie} 
              />
            ))
          ) : (
            <div className="col-span-full py-32 text-center border-4 border-dashed border-white/5 rounded-[4rem]">
              <p className="text-slate-500 font-black uppercase tracking-[0.5em] text-sm">No Masterpieces found in grid</p>
            </div>
          )}
        </div>
      </main>

      <AIAssistant />

      {viewingMovie && (
        <TrailerModal 
          movie={viewingMovie} 
          onClose={() => setViewingMovie(null)} 
          onBook={(m) => {
            setViewingMovie(null);
            setBookingMovie(m);
          }}
        />
      )}

      {bookingMovie && (
        <MovieBookingModal 
          movie={bookingMovie} 
          userEmail={email} 
          onClose={() => setBookingMovie(null)} 
        />
      )}
    </div>
  );
};

export default App;