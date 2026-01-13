
import React from 'react';

export const SubmissionStatus: React.FC<{ onHome: () => void }> = ({ onHome }) => {
  return (
    <div className="p-8 flex flex-col h-full items-center justify-center text-center space-y-8 animate-fadeIn">
      <div className="relative">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-5xl">
          ⏳
        </div>
        <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md">
          🏠
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-slate-900">Audit in Progress</h2>
        <p className="text-slate-500 text-sm leading-relaxed max-w-[280px]">
          Thank you for opening your home! Our community team is reviewing your listing to ensure it meets our Wacu community standards.
        </p>
      </div>

      <div className="w-full bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-4 text-left">
        <h4 className="font-bold text-xs uppercase tracking-widest text-gray-400">Next Steps</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-blue-500 rounded-full text-white flex items-center justify-center text-[10px] font-bold">1</div>
            <p className="text-xs font-medium text-slate-700">Call from a Wacu Ambassador</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-gray-200 rounded-full text-gray-500 flex items-center justify-center text-[10px] font-bold">2</div>
            <p className="text-xs font-medium text-slate-400">Your Home goes live on Wacu!</p>
          </div>
        </div>
      </div>

      <button
        onClick={onHome}
        className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl active:scale-95 transition-all mt-8 shadow-xl"
      >
        Go to Wacu Dashboard
      </button>
    </div>
  );
};
