
import React from 'react';

export const HostWelcome: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="p-8 flex flex-col h-full space-y-8 animate-fadeIn items-center justify-center text-center">
      <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center text-5xl">
        💰
      </div>
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-slate-900 leading-tight">Open Your Wacu to Rwanda</h2>
        <p className="text-slate-500 leading-relaxed">
          Share your space with our community and start earning today. Wacu means home, and we're building a network of the best Wacus in Rwanda. 
          Get paid instantly via <span className="font-bold text-slate-900"> Mobile Money</span>.
        </p>
      </div>
      
      <div className="w-full space-y-4 pt-8">
        <div className="flex items-center space-x-4 text-left p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-2xl">💵</span>
          <div>
            <h4 className="font-bold text-sm">Passive Wacu Goldmine</h4>
            <p className="text-[10px] text-gray-400">Earn RWF by sharing your Wacu family home</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-left p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-2xl">🛡️</span>
          <div>
            <h4 className="font-bold text-sm">Wacu Protection</h4>
            <p className="text-[10px] text-gray-400">Verified guests only. Our Wacu community stays safe.</p>
          </div>
        </div>
      </div>

      <button 
        onClick={onStart}
        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-amber-100 active:scale-95 transition-all mt-auto uppercase tracking-widest text-xs"
      >
        Open Your Wacu to the World
      </button>
    </div>
  );
};
