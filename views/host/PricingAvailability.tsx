
import React, { useState } from 'react';
import { HostListingState } from '../../types';

interface Props {
  state: HostListingState;
  onUpdate: (updates: Partial<HostListingState>) => void;
  onContinue: () => void;
}

export const PricingAvailability: React.FC<Props> = ({ state, onUpdate, onContinue }) => {
  // State for the currently viewed month
  const [viewDate, setViewDate] = useState(new Date());
  // Store selected dates as YYYY-MM-DD strings to persist across months
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const currentMonth = viewDate.toLocaleString('default', { month: 'long' });
  const currentYear = viewDate.getFullYear();

  const toggleDay = (dateStr: string) => {
    setSelectedDates(prev => 
      prev.includes(dateStr) 
        ? prev.filter(d => d !== dateStr) 
        : [...prev, dateStr].sort()
    );
  };

  const changeMonth = (offset: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  // Calendar Generation Logic
  const getCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDayOfMonth.getDate();
    // Adjust JS getDay (0=Sun) to Monday start (0=Mon, 6=Sun)
    const startDay = (firstDayOfMonth.getDay() + 6) % 7;
    
    const days = [];
    // Padding for start of month
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    // Actual days
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(new Date(year, month, d));
    }
    return days;
  };

  const calendarDays = getCalendarDays();
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  const isPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="p-6 flex flex-col h-full space-y-8 animate-fadeIn overflow-y-auto no-scrollbar pb-24">
      <div className="space-y-4">
        <h3 className="text-xl font-black text-slate-900">Set your price</h3>
        <div className="relative">
          <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-2xl text-slate-400">RWF</span>
          <input 
            type="number"
            value={state.pricePerNight || ''}
            onChange={(e) => onUpdate({ pricePerNight: parseInt(e.target.value) || 0 })}
            placeholder="0"
            className="w-full pl-24 pr-6 py-8 bg-white border-2 border-gray-100 rounded-3xl text-3xl font-black outline-none focus:border-amber-400 transition-all shadow-sm"
          />
        </div>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">Typical stays in your area: 15,000 - 25,000 RWF</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-black text-slate-900">Deals & Availability</h3>
        <div className="space-y-4">
          <button
            onClick={() => onUpdate({ weeklyDiscount: !state.weeklyDiscount })}
            className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${
              state.weeklyDiscount ? 'bg-amber-50 border-amber-400 shadow-sm' : 'bg-white border-gray-100'
            }`}
          >
            <div className="text-left">
              <p className="font-bold text-slate-800">Weekly Discount (10%)</p>
              <p className="text-[10px] text-gray-500">Apply for stays longer than 7 days</p>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${state.weeklyDiscount ? 'bg-amber-400 border-amber-400 text-white shadow-sm' : 'border-gray-200'}`}>
              {state.weeklyDiscount && '✓'}
            </div>
          </button>

          <div className="p-6 bg-white rounded-3xl border border-gray-100 space-y-6 shadow-sm">
            <p className="font-black text-slate-800 text-[10px] uppercase tracking-widest">When is your space available?</p>
            <div className="flex gap-2 bg-gray-100 p-1 rounded-2xl">
               <button 
                onClick={() => onUpdate({ availability: 'Always' })}
                className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${state.availability === 'Always' ? 'bg-slate-900 text-white shadow-md' : 'bg-transparent text-gray-400'}`}
               >
                 Always
               </button>
               <button 
                onClick={() => onUpdate({ availability: 'Select' })}
                className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${state.availability === 'Select' ? 'bg-slate-900 text-white shadow-md' : 'bg-transparent text-gray-400'}`}
               >
                 Select Dates
               </button>
            </div>

            {state.availability === 'Select' && (
              <div className="animate-slideDown space-y-6">
                 {/* Navigation Header */}
                 <div className="flex items-center justify-between px-1">
                   <div className="flex items-center gap-3">
                     <button 
                      onClick={() => changeMonth(-1)}
                      className="p-2 hover:bg-slate-50 rounded-full transition-colors"
                     >
                       <span className="text-slate-400 font-black">←</span>
                     </button>
                     <p className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">{currentMonth} {currentYear}</p>
                     <button 
                      onClick={() => changeMonth(1)}
                      className="p-2 hover:bg-slate-50 rounded-full transition-colors"
                     >
                       <span className="text-slate-400 font-black">→</span>
                     </button>
                   </div>
                   <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{selectedDates.length} Days Open</p>
                 </div>
                 
                 <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((wd, i) => (
                      <span key={i} className="text-[9px] font-black text-slate-300 text-center uppercase">{wd}</span>
                    ))}
                    {calendarDays.map((date, index) => {
                      if (!date) return <div key={`empty-${index}`} className="aspect-square" />;
                      
                      const key = formatDateKey(date);
                      const isSelected = selectedDates.includes(key);
                      const disabled = isPast(date);

                      return (
                        <button
                          key={key}
                          disabled={disabled}
                          onClick={() => toggleDay(key)}
                          className={`aspect-square rounded-xl text-xs font-bold transition-all flex items-center justify-center relative ${
                            isSelected 
                              ? 'bg-amber-500 text-white shadow-md scale-105 border-none' 
                              : disabled
                                ? 'bg-transparent text-slate-200'
                                : 'bg-gray-50 text-slate-600 hover:border-gray-200'
                          } ${isToday(date) && !isSelected ? 'ring-2 ring-amber-500/20' : ''}`}
                        >
                          {date.getDate()}
                          {isToday(date) && !isSelected && (
                            <span className="absolute bottom-1 w-1 h-1 bg-amber-500 rounded-full"></span>
                          )}
                        </button>
                      );
                    })}
                 </div>

                 <div className="p-4 bg-slate-50 rounded-2xl flex items-start gap-3">
                   <span className="text-lg">ℹ️</span>
                   <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                     Tapped days are marked as <span className="text-amber-600 font-black">Open</span> for booking. Guests will only see these dates in your calendar.
                   </p>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        disabled={!state.pricePerNight || state.pricePerNight < 1000 || (state.availability === 'Select' && selectedDates.length === 0)}
        onClick={onContinue}
        className={`w-full font-black py-5 rounded-[1.5rem] transition-all active:scale-95 shadow-xl uppercase tracking-widest text-xs ${
          state.pricePerNight >= 1000 && (state.availability === 'Always' || selectedDates.length > 0) ? 'bg-slate-900 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        Continue to Verification
      </button>
    </div>
  );
};
