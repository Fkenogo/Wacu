
import React from 'react';

export const HostWelcome: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white animate-fadeIn pb-12 overflow-y-auto no-scrollbar">
      {/* Hero Section */}
      <div className="px-6 pt-4">
        <div className="relative w-full aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover brightness-75" 
            alt="Beautiful Home Interior" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-10 left-8 right-8">
            <h1 className="text-4xl font-black text-white leading-tight tracking-tight">
              Become a Wacu Host<br />and Earn
            </h1>
          </div>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 py-8">
        <div className="h-1.5 w-6 bg-primary rounded-full"></div>
        <div className="h-1.5 w-1.5 bg-primary/20 rounded-full"></div>
        <div className="h-1.5 w-1.5 bg-primary/20 rounded-full"></div>
        <div className="h-1.5 w-1.5 bg-primary/20 rounded-full"></div>
        <div className="h-1.5 w-1.5 bg-primary/20 rounded-full"></div>
      </div>

      {/* Highlighted Feature Card */}
      <div className="px-6 mb-10">
        <div className="bg-amber-50 rounded-[2.5rem] p-8 flex items-center gap-6 border border-amber-100 shadow-sm">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-3xl font-black" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Instant MoMo Payouts</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
              Mobile money payments are instant and sent directly to the Wacu owner.
            </p>
          </div>
        </div>
      </div>

      {/* Benefit List Section */}
      <div className="px-6 space-y-8">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Why host on Wacu?</h2>
        
        <div className="space-y-6">
          {/* Benefit 1 */}
          <div className="flex items-center gap-5 p-2 group transition-all">
            <div className="w-14 h-14 bg-amber-50 rounded-[1.5rem] flex items-center justify-center text-primary shrink-0 transition-colors group-hover:bg-amber-100">
              <span className="material-symbols-outlined text-2xl font-black">payments</span>
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-black text-slate-900 tracking-tight uppercase">Instant Payouts</h4>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Receive earnings directly via MoMo within 24 hours of guest checkout.
              </p>
            </div>
          </div>

          {/* Benefit 2 */}
          <div className="flex items-center gap-5 p-2 group transition-all">
            <div className="w-14 h-14 bg-amber-50 rounded-[1.5rem] flex items-center justify-center text-primary shrink-0 transition-colors group-hover:bg-amber-100">
              <span className="material-symbols-outlined text-2xl font-black">shield</span>
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-black text-slate-900 tracking-tight uppercase">Secure & Trusted</h4>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Protected by our Community Shield safety program for every booking.
              </p>
            </div>
          </div>

          {/* Benefit 3 */}
          <div className="flex items-center gap-5 p-2 group transition-all">
            <div className="w-14 h-14 bg-amber-50 rounded-[1.5rem] flex items-center justify-center text-primary shrink-0 transition-colors group-hover:bg-amber-100">
              <span className="material-symbols-outlined text-2xl font-black">bolt</span>
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-black text-slate-900 tracking-tight uppercase">Simple Setup</h4>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Our easy onboarding wizard makes it simple to go live in less than 15 minutes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="mt-auto px-6 pt-12 pb-8 flex flex-col items-center space-y-4">
        <button 
          onClick={onStart}
          className="w-full bg-primary text-slate-900 font-black py-6 rounded-full shadow-2xl shadow-primary/30 active:scale-[0.98] transition-all text-lg tracking-tight flex items-center justify-center"
        >
          Start Listing
        </button>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
          By continuing, you agree to Wacu Hosting Terms
        </p>
      </div>
    </div>
  );
};
