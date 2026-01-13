
import React, { useState } from 'react';
import { Listing } from '../../types';

interface Props {
  listings: Listing[];
}

export const VerifierDashboard: React.FC<Props> = ({ listings }) => {
  const [vouched, setVouched] = useState<string[]>([]);

  const handleVouch = (id: string) => {
    setVouched(prev => [...prev, id]);
  };

  // Simulation: Filter to listings needing verification
  const pending = listings.filter(l => !l.isVerified && !vouched.includes(l.id));

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div className="bg-blue-600 p-6 rounded-[2rem] text-white space-y-2 shadow-xl shadow-blue-100">
        <h2 className="text-xl font-bold">Community Verifier</h2>
        <p className="text-[10px] opacity-80 font-bold uppercase tracking-widest">Trust Infrastructure</p>
        <div className="pt-4 flex gap-4">
           <div>
             <p className="text-2xl font-black">12</p>
             <p className="text-[9px] font-bold uppercase opacity-70">Vouched</p>
           </div>
           <div className="w-px h-10 bg-white/20" />
           <div>
             <p className="text-2xl font-black">5.0</p>
             <p className="text-[9px] font-bold uppercase opacity-70">Verifier Rating</p>
           </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-800 uppercase tracking-widest text-xs ml-1">Pending Verification Queue</h3>
        
        {pending.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <span className="text-4xl opacity-40">✅</span>
            <p className="text-sm text-slate-400 font-medium">All local hosts are verified.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pending.map(item => (
              <div key={item.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4 animate-slideIn">
                <div className="flex gap-4">
                  <img src={item.image} className="w-20 h-20 rounded-2xl object-cover shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm leading-tight">{item.title}</h4>
                    <p className="text-[10px] text-gray-500 mt-1">Host: {item.hostName}</p>
                    <p className="text-[10px] text-amber-600 font-bold mt-1">📍 {item.landmark}</p>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl space-y-2">
                   <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Verification Method</p>
                   <p className="text-xs font-medium text-slate-700">Video Walkthrough (Submitted)</p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => handleVouch(item.id)}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold text-xs active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <span>🛡️</span> Vouch for Host
                  </button>
                  <button className="w-12 bg-gray-100 rounded-xl flex items-center justify-center text-lg active:scale-95 transition-all">🔍</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
