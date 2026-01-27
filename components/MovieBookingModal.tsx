import React, { useState } from 'react';
import { Movie, Schedule, Seat, ParkingSpot } from '../types';
import { MOVIE_SCHEDULES, generateSeats } from '../constants';
import { api, BlockManager } from '../services/api';
import Button from './Button';
import SeatSelector from './SeatSelector';
import ParkingMap from './ParkingMap';

interface MovieBookingModalProps {
  movie: Movie | null;
  userEmail: string;
  onClose: () => void;
}

const MovieBookingModal: React.FC<MovieBookingModalProps> = ({ movie, userEmail, onClose }) => {
  const [bookingStep, setBookingStep] = useState<'time' | 'seats' | 'parking' | 'payment' | 'success'>('time');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }));
  
  const [seats, setSeats] = useState<Seat[]>(() => {
    return generateSeats().map(s => ({
      ...s,
      status: BlockManager.isBlocked(s.id) ? 'blocked' : s.status
    }));
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const paymentDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const [parkingSpots] = useState<ParkingSpot[]>(() => {
    return Array.from({ length: 15 }, (_, i) => {
      const id = `P-${i + 1}`;
      let type: ParkingSpot['type'] = 'standard';
      if (i === 0 || i === 4) type = 'accessible';
      else if (i === 7 || i === 8 || i === 14) type = 'ev';
      
      return {
        id,
        status: BlockManager.isBlocked(id) ? 'blocked' : (Math.random() > 0.6 ? 'occupied' : 'available'),
        type
      };
    });
  });
  
  const [selectedParkingId, setSelectedParkingId] = useState<string | null>(null);

  if (!movie) return null;

  const toggleSeat = (id: string) => {
    setSeats(prev => prev.map(s => 
      s.id === id ? { ...s, status: s.status === 'selected' ? 'available' : 'selected' } : s
    ));
  };

  const toggleParking = (id: string) => {
    setSelectedParkingId(prev => prev === id ? null : id);
  };

  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  });

  const selectedSeats = seats.filter(s => s.status === 'selected');
  const selectedParking = parkingSpots.find(p => p.id === selectedParkingId);
  
  const seatTotal = selectedSeats.length * movie.price;
  
  const getParkingFee = (spot?: ParkingSpot) => {
    if (!spot) return 0;
    return spot.type === 'standard' ? 50 : 120;
  };
  
  const parkingCharge = getParkingFee(selectedParking);
  const convenienceFee = selectedSeats.length > 0 ? 35 : 0;
  const finalTotal = seatTotal + parkingCharge + convenienceFee;

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    try {
      const bookingData = {
        email: userEmail,
        movie_title: movie.title,
        date: selectedDate,
        time: selectedTime,
        seats: selectedSeats.map(s => s.id),
        parking_spot: selectedParking?.id || 'None',
        total_price: finalTotal
      };
      await api.confirmBooking(bookingData);
      setBookingStep('success');
    } catch (err) {
      console.error("Booking Error:", err);
      alert("Error processing transaction. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (bookingStep === 'success') {
    return (
      <div className="fixed inset-0 z-[150] overflow-y-auto bg-slate-950/98 backdrop-blur-3xl flex items-center justify-center p-4">
        <div className="relative w-full max-w-xl animate-in zoom-in-95 duration-500">
          <div className="bg-white rounded-[3rem] p-8 md:p-12 text-slate-900 shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h2 className="text-4xl font-black stylish-text uppercase tracking-tight text-slate-950">Booking Success</h2>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Seat locked for 1 hour</p>
            </div>
            
            <div className="bg-slate-50 rounded-[2rem] p-8 space-y-4 mb-10 border border-slate-200">
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Movie</span>
                 <span className="font-black text-slate-900 uppercase">{movie.title}</span>
              </div>
              <div className="flex justify-between">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Show Info</span>
                 <span className="font-black text-slate-800 text-sm text-right">{selectedDate} @ {selectedTime}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-4">
                 <span className="text-[10px] font-black text-slate-950 uppercase tracking-widest">Total Paid</span>
                 <span className="font-black text-xl text-slate-900">₹{finalTotal}</span>
              </div>
            </div>

            <div className="flex flex-col items-center mb-10">
               <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-lg mb-4">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=FLX_${movie.id}_${selectedDate}`} 
                    alt="QR" 
                    className="w-32 h-32" 
                  />
               </div>
               <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Show this at the cinema</p>
            </div>

            <Button fullWidth onClick={onClose} className="py-6 text-[11px] tracking-[0.3em] uppercase font-black bg-slate-950 text-white rounded-2xl">Done</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 md:p-6 overflow-hidden">
      <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl" onClick={onClose} />
      
      <div className="relative w-full max-w-7xl bg-slate-900 border border-white/10 rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh]">
        
        {/* Sidebar */}
        <div className="hidden md:block md:w-[25%] relative overflow-hidden border-r border-white/5">
          <img src={movie.image} alt={movie.title} className="w-full h-full object-cover grayscale-[0.3]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
          <div className="absolute bottom-10 left-8 right-8">
            <h2 className="text-3xl font-black text-white stylish-text uppercase tracking-tighter mb-4">{movie.title}</h2>
            <p className="text-slate-400 text-[10px] uppercase leading-relaxed line-clamp-3 opacity-60">{movie.description}</p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-xl h-full">
          
          {/* Header Navigation */}
          <div className="p-4 md:p-8 border-b border-white/5 bg-slate-900/40">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 md:gap-4 overflow-x-auto no-scrollbar py-1">
                {['time', 'seats', 'parking', 'payment'].map((s, idx) => (
                  <button 
                    key={s}
                    disabled={
                      (s === 'seats' && !selectedTime) || 
                      (s === 'parking' && selectedSeats.length === 0) ||
                      (s === 'payment' && selectedSeats.length === 0)
                    }
                    onClick={() => setBookingStep(s as any)}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${bookingStep === s ? 'bg-flixa-cyan border-flixa-cyan text-slate-950 shadow-[0_0_20px_rgba(0,242,255,0.2)]' : 'bg-slate-800/40 border-white/5 text-slate-500 opacity-60'}`}
                  >
                    {idx + 1}. {s === 'time' ? 'Time' : s === 'seats' ? 'Seats' : s === 'parking' ? 'Parking' : 'Pay'}
                  </button>
                ))}
              </div>
              <button onClick={onClose} className="ml-4 w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>

          {/* Scrollable Step Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
            {bookingStep === 'time' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-3xl font-black text-white uppercase tracking-tight">Pick a Time</h3>
                
                <div className="space-y-4">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black">1. Select Date</p>
                  <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                    {availableDates.map(date => (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`flex-shrink-0 w-24 py-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${selectedDate === date ? 'bg-flixa-cyan border-flixa-cyan text-slate-950 shadow-lg' : 'bg-slate-950/40 border-white/10 text-slate-500 hover:border-white/20'}`}
                      >
                        <span className="text-[9px] font-black uppercase">{date.split(' ')[0]}</span>
                        <span className="text-lg font-black">{date.split(' ')[1]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  {(Object.keys(MOVIE_SCHEDULES) as Array<keyof Schedule>).map((session) => (
                    <div key={session}>
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-4 uppercase border-l-2 border-slate-700 pl-3">{session}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {MOVIE_SCHEDULES[session].map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`py-4 rounded-xl text-[10px] font-black border-2 transition-all ${selectedTime === time ? 'bg-white border-white text-slate-900 shadow-xl' : 'bg-slate-950/40 border-white/5 text-slate-400 hover:border-white/20'}`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {bookingStep === 'seats' && (
              <div className="animate-in fade-in zoom-in-95 duration-500 pb-20">
                <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-8">Choose Seats</h3>
                <SeatSelector seats={seats} onToggleSeat={toggleSeat} />
              </div>
            )}

            {bookingStep === 'parking' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-8">Add Parking</h3>
                <ParkingMap 
                  spots={parkingSpots.map(p => ({
                    ...p, 
                    status: p.id === selectedParkingId ? 'selected' as any : p.status
                  }))} 
                  onToggleSpot={toggleParking} 
                  isFree={false} 
                />
              </div>
            )}

            {bookingStep === 'payment' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-8">Payment Details</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
                  <div className="bg-slate-950/50 rounded-3xl p-6 md:p-8 border border-white/5 space-y-6">
                    <div className="flex justify-between border-b border-white/10 pb-4">
                       <span className="text-[10px] font-black text-slate-500 uppercase">Order Date</span>
                       <span className="text-xs font-black text-white uppercase">{paymentDate}</span>
                    </div>
                    
                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-slate-500 uppercase">Selected Seats</span>
                          <span className="font-black text-flixa-cyan uppercase tracking-widest bg-flixa-cyan/10 px-3 py-1 rounded-lg">
                            {selectedSeats.length > 0 ? selectedSeats.map(s => s.id).join(', ') : 'None'}
                          </span>
                       </div>
                       {selectedParking && (
                         <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-500 uppercase">Parking Spot</span>
                            <span className="font-black text-violet-400 uppercase bg-violet-400/10 px-3 py-1 rounded-lg">{selectedParking.id}</span>
                         </div>
                       )}
                       <div className="pt-4 border-t border-white/5 space-y-3">
                          <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                             <span>Tickets ({selectedSeats.length})</span>
                             <span>₹{seatTotal}</span>
                          </div>
                          <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                             <span>Parking Bay</span>
                             <span>₹{parkingCharge}</span>
                          </div>
                          <div className="flex justify-between text-[11px] font-bold text-flixa-cyan uppercase tracking-widest">
                             <span>Service Fee</span>
                             <span>₹{convenienceFee}</span>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-8 bg-slate-950/80 rounded-3xl border border-white/5">
                     <p className="text-flixa-gold text-[10px] font-black uppercase tracking-widest mb-6">Scan with UPI</p>
                     <div className="bg-white p-6 rounded-[2rem] mb-6 shadow-2xl">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=UPI_PAY_${finalTotal}_FLX`} 
                          alt="UPI QR" 
                          className="w-32 h-32" 
                        />
                     </div>
                     <p className="text-slate-500 text-[10px] text-center uppercase font-bold px-4 leading-relaxed">
                       Secure Checkout Powered by FLIXA Pay
                     </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Bar - Always stays at the bottom */}
          <div className="p-4 md:p-8 border-t border-white/5 bg-slate-950/90 backdrop-blur-2xl flex flex-row items-center justify-between gap-4 z-20">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Final Total</span>
              <span className="text-2xl md:text-3xl font-black text-white tracking-tighter">₹{finalTotal}</span>
            </div>
            
            <div className="flex gap-3">
               {bookingStep !== 'time' && (
                  <button 
                    onClick={() => {
                      if (bookingStep === 'seats') setBookingStep('time');
                      else if (bookingStep === 'parking') setBookingStep('seats');
                      else if (bookingStep === 'payment') setBookingStep('parking');
                    }}
                    className="px-4 md:px-6 py-3 rounded-xl bg-slate-800 text-[10px] font-black text-white uppercase border border-white/10"
                  >
                    Back
                  </button>
               )}
               <Button 
                 disabled={isProcessing || (bookingStep === 'time' && !selectedTime) || (bookingStep === 'seats' && selectedSeats.length === 0)}
                 onClick={() => {
                    if (bookingStep === 'time') setBookingStep('seats');
                    else if (bookingStep === 'seats') setBookingStep('parking');
                    else if (bookingStep === 'parking') setBookingStep('payment');
                    else handleConfirmPayment();
                 }}
                 className="px-8 md:px-12 py-3 md:py-4 text-[11px] uppercase font-black bg-flixa-gold text-slate-950 rounded-xl shadow-xl transition-all"
               >
                 {isProcessing ? 'Processing...' : bookingStep === 'payment' ? 'Pay Now' : 'Continue'}
               </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MovieBookingModal;