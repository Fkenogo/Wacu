
import React, { useState } from 'react';
import { PropertyType } from '../types';
import { CATEGORY_ICONS } from '../constants';

interface Props {
  onBack: () => void;
  referralCount: number;
  trustPoints: number;
  userId: string;
}

export const ReferralDashboard: React.FC<Props> = ({ onBack, referralCount, trustPoints, userId }) => {
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedType, setSelectedType] = useState<PropertyType | null>(null);

  const baseRef = userId?.slice(-6) || "keza123";
  // Dynamically generate link based on selection and real User ID
  const referralLink = selectedType 
    ? `kaze.rw/ref/${baseRef}?type=${selectedType.toLowerCase().replace(/\s+/g, '_')}`
    : `kaze.rw/ref/${baseRef}`;

  const handleCopy = () => {
    if (!selectedType) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const referralOptions = [
    { type: PropertyType.FAMILY_HOMESTAY, points: 150 },
    { type: PropertyType.ENTIRE_HOME, points: 100 },
    { type: PropertyType.VILLAGE_STAY, points: 150 },
    { type: PropertyType.CITY_APARTMENT, points: 100 },
    { type: PropertyType.FARM_STAY, points: 125 },
    { type: PropertyType.GROUP_FAMILY_COMPOUND, points: 200 },
    { type: PropertyType.SHARED_HOME, points: 125 },
    { type: PropertyType.CULTURAL_STAY, points: 150 },
  ];

  const steps = [
    {
      icon: "👥",
      title: "Tell us who you're referring",
      desc: "Vouch for your friend to host a KAZE, offer an experience, or join as a trusted guest."
    },
    {
      icon: "📤",
      title: "Send them your link",
      desc: "Make sure your friend creates their trust profile using your unique community link."
    },
    {
      icon: "🛡️",
      title: "Get rewarded in Trust",
      desc: "After they complete a qualifying stay or verification, your Trust Points will be updated instantly."
    }
  ];

  return (
    <div className="flex flex-col min-h-full bg-white animate-fadeIn pb-12">
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-gray-100">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full">←</button>
        <button 
          onClick={() => setShowHowItWorks(true)}
          className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full"
        >
          Referral Program
        </button>
      </div>

      <div className="p-8 space-y-10">
        <div className="space-y-3">
          <h2 className="text-3xl font-black text-slate-900 leading-tight">Refer a Host,<br/>earn Trust Rewards</h2>
          <p className="text-slate-500 text-sm font-medium">Strengthen our community. Every successful vouch builds your KAZE reputation.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Successful</p>
            <p className="text-3xl font-black text-slate-900">{referralCount}</p>
            <p className="text-[9px] font-black text-amber-600 uppercase">Vouch Matches</p>
          </div>
          <div className="bg-amber-500 p-6 rounded-[2rem] text-white space-y-1 shadow-lg shadow-amber-100">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Trust Points</p>
            <p className="text-3xl font-black">{trustPoints}</p>
            <p className="text-[9px] font-black uppercase">earned so far</p>
          </div>
        </div>

        {/* Selection Type */}
        <div className="space-y-4">
           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Step 1: What type of host are you referring?</h4>
           <div className="space-y-3 max-h-[320px] overflow-y-auto no-scrollbar pr-1 border-b border-slate-50 pb-4">
              {referralOptions.map((opt) => (
                <button 
                  key={opt.type}
                  onClick={() => {
                    setSelectedType(opt.type);
                    setCopied(false);
                  }}
                  className={`w-full flex items-center justify-between p-6 rounded-[2.5rem] active:scale-[0.98] transition-all group border-2 ${
                    selectedType === opt.type 
                      ? 'bg-amber-50 border-amber-400 shadow-md scale-[1.02]' 
                      : 'bg-white border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-3xl transition-all ${selectedType === opt.type ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`}>
                      {CATEGORY_ICONS[opt.type]}
                    </span>
                    <div className="text-left">
                       <p className="font-black text-slate-900 text-[11px] uppercase tracking-tight">{opt.type} HOST</p>
                       <p className="text-[10px] text-slate-400 font-bold">+{opt.points} Trust Points</p>
                    </div>
                  </div>
                  <span className={`transition-transform ${selectedType === opt.type ? 'text-amber-500 translate-x-1' : 'text-slate-300 group-hover:text-amber-500 group-hover:translate-x-1'}`}>→</span>
                </button>
              ))}
           </div>
        </div>

        {/* Link Section */}
        <div className={`space-y-4 transition-all duration-500 ${selectedType ? 'opacity-100 translate-y-0 scale-100' : 'opacity-30 pointer-events-none translate-y-4 scale-95 grayscale'}`}>
           <div className="flex justify-between items-center px-1">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Step 2: Your Unique Invite Link</h4>
             {selectedType && (
               <span className="text-[8px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase">Ready to Share</span>
             )}
           </div>
           <div className={`p-2 rounded-2xl flex items-center justify-between transition-all border-2 ${selectedType ? 'bg-white border-amber-400 shadow-xl shadow-amber-100' : 'bg-gray-50 border-gray-100'}`}>
              <span className="font-mono text-[11px] font-bold text-slate-600 pl-4 truncate flex-1">
                {selectedType ? referralLink : "Select a type first..."}
              </span>
              <button 
                onClick={handleCopy}
                disabled={!selectedType}
                className={`px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shrink-0 ml-2 shadow-lg ${
                  copied 
                    ? 'bg-emerald-500 text-white shadow-emerald-100' 
                    : selectedType 
                      ? 'bg-slate-900 text-white shadow-slate-200' 
                      : 'bg-gray-200 text-gray-400 shadow-none'
                }`}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
           </div>
        </div>

        <button 
          onClick={() => setShowHowItWorks(true)}
          className="w-full py-5 text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] border-2 border-amber-100 rounded-[1.5rem] active:bg-amber-50 transition-colors"
        >
          Learn more about Trust Rewards
        </button>
      </div>

      {/* How it Works Modal */}
      {showHowItWorks && (
        <div className="fixed inset-0 z-[200] flex flex-col justify-end animate-fadeIn">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowHowItWorks(false)} />
          <div className="relative bg-white w-full rounded-t-[3rem] p-8 space-y-8 animate-slideUp">
            <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto -mt-2" />
            
            <div className="text-center space-y-2 pt-2">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">How it works</h3>
            </div>

            <div className="space-y-10 py-4">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="w-10 h-10 flex items-center justify-center text-xl bg-slate-50 rounded-xl shrink-0">{step.icon}</div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{step.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-4">
              <button 
                onClick={() => setShowHowItWorks(false)}
                className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
