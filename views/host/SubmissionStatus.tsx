
import React from 'react';

export const SubmissionStatus: React.FC<{ onHome: () => void }> = ({ onHome }) => {
  return (
    <div className="p-8 flex flex-col h-full items-center justify-center text-center space-y-8 animate-fadeIn bg-white">
      <div className="relative">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-5xl">
          🏠
        </div>
        <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-full shadow-md">
          ✓
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Yambi. Your Wacu is live</h2>
        <p className="text-slate-500 font-medium leading-relaxed max-w-[280px] mx-auto">
          Guests can now discover and book your space. Welcome to the Wacu host community!
        </p>
      </div>

      <div className="w-full bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-4 text-left">
        <h4 className="font-bold text-[10px] uppercase tracking-widest text-gray-400">Host Dashboard Tips</h4>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-blue-500 rounded-full text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</div>
            <p className="text-xs font-bold text-slate-700 leading-tight">Keep your calendar updated to receive more guests.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-blue-500 rounded-full text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</div>
            <p className="text-xs font-bold text-slate-700 leading-tight">Respond to guest messages quickly to build your trust rating.</p>
          </div>
        </div>
      </div>

      <button
        onClick={onHome}
        className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl active:scale-95 transition-all mt-8 shadow-xl uppercase tracking-widest text-xs"
      >
        Go to Wacu Dashboard
      </button>
    </div>
  );
};
