
import React from 'react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onTrailer: (movie: Movie) => void;
  onBook: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onTrailer, onBook }) => {
  return (
    <div className="group relative bg-slate-900 rounded-[3rem] overflow-hidden transition-all duration-700 hover:-translate-y-5 hover:shadow-[0_40px_80px_rgba(0,242,255,0.2)] border border-white/5">
      {/* Poster Section */}
      <div className="aspect-[2/3] overflow-hidden relative">
        <img 
          src={movie.image} 
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
        />
        
        {/* Play Icon Overlay (For Trailer) */}
        <div 
          onClick={() => onTrailer(movie)}
          className="absolute inset-0 flex items-center justify-center z-30 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100 cursor-pointer"
        >
           <div className="w-20 h-20 bg-[#00f2ff] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,242,255,0.6)] relative animate-pulse-neon">
              <svg className="w-8 h-8 text-slate-950 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <div className="absolute -inset-2 border-2 border-[#00f2ff]/30 rounded-full animate-ping" />
           </div>
           <div className="absolute bottom-1/4 transform translate-y-12">
              <span className="text-[10px] font-black text-[#00f2ff] uppercase tracking-[0.4em] bg-slate-950/80 px-4 py-2 rounded-full border border-[#00f2ff]/20 backdrop-blur-md">Watch Trailer</span>
           </div>
        </div>

        {/* Prominent Rating Badge */}
        <div className="absolute top-6 right-6 z-20">
          <div className="bg-slate-950/90 backdrop-blur-xl border border-[#00f2ff]/40 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-2xl transition-transform group-hover:scale-110">
            <svg className="w-4 h-4 text-[#00f2ff] fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-black text-white">{movie.rating}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 bg-slate-950/40 backdrop-blur-xl border-t border-white/5 relative z-10">
        <h3 className="text-white font-black text-2xl leading-none stylish-text uppercase group-hover:eye-catchy-gradient transition-all duration-300 truncate mb-5">
          {movie.title}
        </h3>
        
        <div className="flex justify-between items-end mb-6">
          <div className="flex flex-col gap-2">
             <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] animate-pulse" />
               <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{movie.duration}</span>
             </div>
             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">In Theaters</span>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Starts At</span>
             <span className="text-white font-black text-2xl tracking-tighter">₹{movie.price}</span>
          </div>
        </div>

        <button 
          onClick={() => onBook(movie)}
          className="w-full py-4 bg-[#ff007a] text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-[0_10px_20px_rgba(255,0,122,0.2)] hover:bg-[#e6006d] hover:scale-[1.02] active:scale-95 transition-all"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
