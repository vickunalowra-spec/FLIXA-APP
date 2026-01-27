import React from 'react';
import { ParkingSpot } from '../types';

interface ParkingMapProps {
  spots: ParkingSpot[];
  onToggleSpot: (id: string) => void;
  isFree: boolean;
}

const ParkingMap: React.FC<ParkingMapProps> = ({ spots, onToggleSpot, isFree }) => {
  const getSpotIcon = (type: ParkingSpot['type']) => {
    switch (type) {
      case 'ev':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 2v11h3v9l7-12h-4l4-8H7z"/>
          </svg>
        );
      case 'accessible':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm2 10.5V11c0-.83-.67-1.5-1.5-1.5H11c-.83 0-1.5.67-1.5 1.5v3.5H7V22h2v-4.5h2V22h2v-4.5h2V22h2V14.5h-3zM10.5 5h3v4h-3V5z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
          </svg>
        );
    }
  };

  const getSpotColor = (spot: ParkingSpot) => {
    if (spot.status === 'occupied') return 'bg-slate-800 border-white/5 opacity-20 cursor-not-allowed';
    if (spot.status === 'blocked') return 'bg-slate-900/50 border-orange-500/20 cursor-not-allowed opacity-40';
    if (spot.status === 'selected') return 'bg-[#ff007a]/20 border-[#ff007a] shadow-[0_0_20px_rgba(255,0,122,0.4)]';
    
    switch (spot.type) {
      case 'ev': return 'bg-[#00f2ff]/5 border-[#00f2ff]/30 hover:border-[#00f2ff] hover:bg-[#00f2ff]/10';
      case 'accessible': return 'bg-violet-900/10 border-violet-500/30 hover:border-violet-400';
      default: return 'bg-slate-900 border-white/10 hover:border-[#00f2ff]/50 hover:bg-[#00f2ff]/5';
    }
  };

  const getIconColor = (spot: ParkingSpot) => {
    if (spot.status === 'selected') return 'text-[#ff007a]';
    if (spot.status === 'occupied') return 'text-slate-700';
    if (spot.status === 'blocked') return 'text-orange-900';
    switch (spot.type) {
      case 'ev': return 'text-[#00f2ff]';
      case 'accessible': return 'text-violet-400';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="bg-slate-950/60 p-10 rounded-[4rem] border border-white/5 relative overflow-hidden backdrop-blur-3xl shadow-2xl">
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
           <div>
             <h4 className="text-[12px] font-black uppercase tracking-[0.5em] eye-catchy-gradient">Parking Bay Grid</h4>
             <p className="text-[10px] text-slate-500 mt-2 uppercase font-bold tracking-widest">Digital Twin Occupancy View</p>
           </div>
           
           {/* Status Legend */}
           <div className="flex flex-wrap gap-6 bg-slate-900/50 px-6 py-3 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                 <div className="w-3 h-3 bg-slate-800 rounded-md" /> Occupied
              </div>
              <div className="flex items-center gap-3 text-[10px] font-black text-orange-500 uppercase tracking-widest">
                 <div className="w-3 h-3 bg-orange-900 rounded-md" /> Frozen (1hr)
              </div>
              <div className="flex items-center gap-3 text-[10px] font-black text-[#ff007a] uppercase tracking-widest">
                 <div className="w-3 h-3 bg-[#ff007a] rounded-md shadow-[0_0_10px_rgba(255,0,122,0.5)]" /> Selected
              </div>
           </div>
        </div>

        {/* Spot Type Legend */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 p-6 bg-slate-900/40 rounded-[2.5rem] border border-white/10">
          <div className="flex items-center gap-4 group cursor-help">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 border border-white/5">
              {getSpotIcon('standard')}
            </div>
            <div>
              <p className="text-[11px] font-black text-white uppercase tracking-widest">Standard Bay</p>
              <p className="text-[9px] text-[#00f2ff] uppercase font-bold mt-1">₹50 Pre-book</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group cursor-help">
            <div className="w-12 h-12 rounded-2xl bg-[#00f2ff]/10 flex items-center justify-center text-[#00f2ff] border border-[#00f2ff]/20">
              {getSpotIcon('ev')}
            </div>
            <div>
              <p className="text-[11px] font-black text-[#00f2ff] uppercase tracking-widest">EV Charged</p>
              <p className="text-[9px] text-white/60 uppercase font-bold mt-1">₹120 Premium</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group cursor-help">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400 border border-violet-500/20">
              {getSpotIcon('accessible')}
            </div>
            <div>
              <p className="text-[11px] font-black text-violet-400 uppercase tracking-widest">Accessible</p>
              <p className="text-[9px] text-white/60 uppercase font-bold mt-1">₹120 Premium</p>
            </div>
          </div>
        </div>

        {/* Parking Grid */}
        <div className="grid grid-cols-5 gap-5">
           {spots.map((spot) => (
              <button
                 key={spot.id}
                 disabled={spot.status === 'occupied' || spot.status === 'blocked'}
                 onClick={() => onToggleSpot(spot.id)}
                 className={`
                    relative h-24 rounded-2xl border-2 transition-all duration-500 flex flex-col items-center justify-center gap-3 group/spot
                    ${getSpotColor(spot)}
                 `}
              >
                 <span className={`text-[10px] font-black tracking-widest ${spot.status === 'selected' ? 'text-white' : 'text-slate-600'}`}>
                    {spot.id}
                 </span>
                 <div className={`${getIconColor(spot)} transition-transform duration-500 group-hover/spot:scale-125`}>
                   {spot.status === 'blocked' ? (
                     <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   ) : getSpotIcon(spot.type)}
                 </div>
                 {spot.status === 'selected' && (
                   <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#ff007a] rounded-full flex items-center justify-center shadow-lg animate-bounce">
                     <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7"/></svg>
                   </div>
                 )}
                 {spot.status === 'blocked' && (
                    <span className="text-[8px] font-black text-orange-500/60 uppercase">Frozen</span>
                 )}
              </button>
           ))}
        </div>
        
        <div className="mt-12 flex items-center justify-between pt-8 border-t border-white/10">
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status Report</span>
              <span className="text-sm font-black uppercase tracking-widest eye-catchy-gradient">
                 All Bookings Held for 1 Hour
              </span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingMap;