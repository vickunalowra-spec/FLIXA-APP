import React from 'react';
import { Seat } from '../types';

interface SeatSelectorProps {
  seats: Seat[];
  onToggleSeat: (seatId: string) => void;
}

const SeatSelector: React.FC<SeatSelectorProps> = ({ seats, onToggleSeat }) => {
  return (
    <div className="space-y-8 py-4">
      {/* Screen */}
      <div className="relative">
        <div className="w-full h-3 bg-[#00f2ff]/20 rounded-full blur-md" />
        <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#00f2ff] to-transparent mt-2 opacity-80" />
        <p className="text-[10px] text-center text-[#00f2ff] mt-4 font-black tracking-[0.5em] uppercase">CINEMA PREMIER SCREEN</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-8 gap-4 max-w-sm mx-auto">
        {seats.map((seat) => (
          <button
            key={seat.id}
            disabled={seat.status === 'booked' || seat.status === 'blocked'}
            onClick={() => onToggleSeat(seat.id)}
            className={`
              w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black transition-all duration-300 border relative
              ${seat.status === 'booked' ? 'bg-slate-800 border-white/5 text-slate-600 cursor-not-allowed opacity-30' : 
                seat.status === 'blocked' ? 'bg-slate-900/50 border-white/5 text-slate-700 cursor-not-allowed grayscale' :
                seat.status === 'selected' ? 'bg-[#ff007a] border-[#ff007a] text-white scale-110 shadow-[0_0_20px_rgba(255,0,122,0.4)]' : 
                'bg-slate-900 border-[#00f2ff]/20 text-[#00f2ff]/70 hover:border-[#00f2ff] hover:text-[#00f2ff] hover:shadow-[0_0_15px_rgba(0,242,255,0.2)]'}
            `}
          >
            {seat.status === 'blocked' ? (
              <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            ) : seat.id}
            
            {seat.status === 'blocked' && (
               <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse" title="Temporarily Frozen" />
            )}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-6 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-950/50 p-4 rounded-2xl border border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-slate-900 border border-[#00f2ff]/30 rounded-lg" /> Available
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-[#ff007a] rounded-lg shadow-[0_0_10px_rgba(255,0,122,0.4)]" /> Your Pick
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-slate-900/50 border border-white/5 rounded-lg flex items-center justify-center">
             <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
          </div> Wait Time (1hr)
        </div>
        <div className="flex items-center gap-3 opacity-50">
          <div className="w-4 h-4 bg-slate-800 rounded-lg" /> Taken
        </div>
      </div>
    </div>
  );
};

export default SeatSelector;