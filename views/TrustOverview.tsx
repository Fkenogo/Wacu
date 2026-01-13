
import React from 'react';

interface Props {
  onContinue: () => void;
}

export const TrustOverviewView: React.FC<Props> = ({ onContinue }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white text-center space-y-12 animate-fadeIn h-full overflow-y-auto no-scrollbar">
      <div className="relative">
        <div className="w-24 h-24 bg-amber-100 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-inner animate-pulse">
          🛡️
        </div>
        <div className="absolute -top-2 -right-2 bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
          ✓
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900 leading-tight">Wacu is Built on Trust</h2>
          <div className="w-12 h-1.5 bg-amber-500 rounded-full mx-auto" />
        </div>
        
        <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-[300px] mx-auto">
          Wacu means "Our Home." Sharing our Wacus requires a community of honest, verified people.
          We use identity checks and community vouching to keep everyone in our family safe.
        </p>
      </div>

      <div className="w-full space-y-4 pt-4">
        {[
          { icon: '🆔', title: 'Identity Verification', text: 'Secure government ID audit for the Wacu family.' },
          { icon: '🤝', title: 'Community Vouching', text: 'Confirmed by our trusted Wacu host network.' }
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4 p-5 bg-slate-50 rounded-[2rem] text-left border border-slate-100">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0">
              {item.icon}
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest">{item.title}</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-tight mt-0.5">{item.text}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onContinue}
        className="w-full bg-slate-900 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-slate-200 active:scale-95 transition-all uppercase tracking-[0.2em] text-xs mt-4"
      >
        Enter Our Wacu Community
      </button>
    </div>
  );
};
