import React, { useState } from 'react';
import { Movie } from '../types';
import Button from './Button';

interface TrailerModalProps {
  movie: Movie | null;
  onClose: () => void;
  onBook: (movie: Movie) => void;
}

const TrailerModal: React.FC<TrailerModalProps> = ({ movie, onClose, onBook }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 md:p-8">
      {/* Heavy Backdrop to focus on video */}
      <div className="absolute inset-0 bg-[#030712]/98 backdrop-blur-3xl animate-in fade-in duration-700" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl bg-slate-900/40 border border-white/10 rounded-[4rem] overflow-hidden shadow-[0_0_150px_rgba(0,0,0,1)] animate-in zoom-in-95 slide-in-from-bottom-12 duration-700">
        <div className="flex flex-col lg:flex-row h-full min-h-[600px]">
          {/* Main Stage: Video Player */}
          <div className="lg:w-2/3 bg-black relative aspect-video lg:aspect-auto group/player">
            {/* Loading Overlay - Added pointer-events-none when loaded */}
            <div className={`absolute inset-0 flex items-center justify-center bg-slate-950 transition-opacity duration-500 z-20 ${isVideoLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
               <div className="w-12 h-12 border-4 border-[#00f2ff]/20 border-t-[#00f2ff] rounded-full animate-spin" />
            </div>
            
            <iframe 
              onLoad={() => setIsVideoLoaded(true)}
              src={`${movie.trailerUrl}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=0&enablejsapi=1&playsinline=1&origin=${window.location.origin}`}
              className="absolute inset-0 w-full h-full z-10"
              title={`${movie.title} Integrated Player`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
            
            {/* OVERLAY ACTION: Moved higher to avoid blocking playback controls */}
            <div className="absolute bottom-16 right-10 z-30 opacity-0 group-hover/player:opacity-100 transition-all duration-500 translate-y-4 group-hover/player:translate-y-0 pointer-events-none">
               <button 
                 onClick={(e) => {
                   e.stopPropagation();
                   onBook(movie);
                 }}
                 className="pointer-events-auto flex items-center gap-4 bg-[#ff007a] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_15px_30px_rgba(255,0,122,0.4)] hover:bg-[#e6006d] hover:scale-105 active:scale-95 transition-all"
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" /></svg>
                 Instant Booking
               </button>
            </div>

            {/* Native Overlay UI */}
            <div className="absolute top-8 left-8 z-20 pointer-events-none flex flex-col gap-3">
               <div className="flex items-center gap-3">
                 <span className="flex h-3 w-3 relative">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f2ff] opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00f2ff]"></span>
                 </span>
                 <span className="bg-[#00f2ff]/20 backdrop-blur-md text-[#00f2ff] text-[10px] font-black px-5 py-2 rounded-full border border-[#00f2ff]/40 uppercase tracking-[0.4em]">Integrated Preview</span>
               </div>
            </div>
          </div>

          {/* Context Sidebar */}
          <div className="lg:w-1/3 p-12 flex flex-col bg-slate-900/80 backdrop-blur-2xl border-l border-white/5 relative overflow-y-auto custom-scrollbar">
            <div className="absolute top-0 right-0 p-8 z-30">
               <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-500 transition-all border border-white/5">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/></svg>
               </button>
            </div>

            <div className="pt-8">
              <p className="text-[#ff007a] text-[10px] font-black uppercase tracking-[0.6em] mb-4">Official Trailer</p>
              <h2 className="text-5xl font-black text-white leading-[0.9] stylish-text uppercase tracking-tighter mb-8">{movie.title}</h2>

              <div className="flex flex-wrap gap-3 mb-10">
                {movie.genre.map(g => (
                  <span key={g} className="text-[9px] font-black text-white/60 uppercase tracking-widest bg-white/5 px-4 py-1.5 rounded-xl border border-white/10">{g}</span>
                ))}
              </div>

              <div className="space-y-8 mb-10">
                <div className="flex items-center gap-6">
                   <div className="p-3 bg-slate-950 rounded-2xl border border-[#00f2ff]/20 text-[#00f2ff]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Duration</p>
                      <p className="text-sm font-black text-white uppercase tracking-tight">{movie.duration}</p>
                   </div>
                </div>
                <div className="flex items-center gap-6">
                   <div className="p-3 bg-slate-950 rounded-2xl border border-amber-500/20 text-amber-500">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Critics Choice</p>
                      <p className="text-sm font-black text-white uppercase tracking-tight">{movie.rating} Score</p>
                   </div>
                </div>
              </div>

              <div className="mb-12 relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-[#ff007a] to-transparent rounded-full" />
                <p className="text-slate-400 text-sm leading-relaxed font-medium italic pl-4 py-2 uppercase tracking-wide">
                  {movie.description}
                </p>
              </div>

              {/* PRIMARY CTA: STAND OUT ACTION */}
              <div className="space-y-6">
                <Button 
                  fullWidth 
                  onClick={() => onBook(movie)}
                  className="py-7 bg-gradient-to-r from-[#00f2ff] to-[#ff007a] text-slate-950 font-black uppercase tracking-[0.4em] rounded-[2.5rem] shadow-[0_25px_50px_rgba(0,242,255,0.4)] hover:scale-[1.05] active:scale-95 transition-all text-[11px] relative overflow-hidden group/btn animate-pulse-neon"
                >
                  <span className="relative z-10">Book Your Premier Seat</span>
                  <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                </Button>
                
                <div className="flex items-center justify-center gap-4">
                   <div className="h-[1px] flex-1 bg-white/10" />
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Exclusive Screening</p>
                   <div className="h-[1px] flex-1 bg-white/10" />
                </div>
              </div>
            </div>

            {/* Bottom spacer for scroll content */}
            <div className="mt-12 opacity-20 text-center">
              <FlixSmallLogo />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FlixSmallLogo = () => (
  <div className="inline-flex flex-col items-center opacity-30">
    <div className="w-8 h-0.5 bg-slate-500 mb-2"></div>
    <span className="text-[10px] font-black tracking-[0.8em] text-white">FLIXA</span>
  </div>
);

export default TrailerModal;