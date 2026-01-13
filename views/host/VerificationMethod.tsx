
import React, { useState } from 'react';
import { HostListingState, PropertyType } from '../../types';

interface Props {
  state: HostListingState;
  onUpdate: (updates: Partial<HostListingState>) => void;
  onSubmit: () => void;
}

export const VerificationMethod: React.FC<Props> = ({ state, onUpdate, onSubmit }) => {
  const [activeStep, setActiveStep] = useState<'PHONE' | 'PROPERTY' | 'METHODS' | 'SUBMITTING'>('METHODS');
  const [isProcessing, setIsProcessing] = useState(false);

  const isSharedStay = state.type === PropertyType.FAMILY_HOMESTAY || state.type === PropertyType.SHARED_HOME;
  const livesOnSite = state.tags.includes('Host lives on site');
  const sharedStayRisk = isSharedStay && livesOnSite;

  const toggleMethod = (method: 'Vouch' | 'Video' | 'ID') => {
    const next = state.verificationCompleted.includes(method)
      ? state.verificationCompleted.filter(m => m !== method)
      : [...state.verificationCompleted, method];
    onUpdate({ verificationCompleted: next });
  };

  const handleFinalSubmit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onSubmit();
    }, 2500);
  };

  const isBasicVerified = state.verificationCompleted.some(m => ['Vouch', 'Video', 'ID'].includes(m));

  if (isProcessing) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 space-y-12 animate-fadeIn">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-2xl">🛡️</div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-900">Final Wacu Audit</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col h-full space-y-8 animate-fadeIn">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
           <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-full">Final Step: Wacu Trust</span>
        </div>
        <h2 className="text-3xl font-black text-slate-900 leading-tight">Secure Your Home</h2>
        <p className="text-slate-500 text-sm font-medium">To protect both hosts and guests, we require proof of identity and property location to call it Wacu.</p>
      </div>

      {/* Mandatory Base Verifications */}
      <div className="grid grid-cols-2 gap-3">
         <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-sm">
            <span className="text-xl">📱</span>
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-emerald-600 uppercase">Verified</span>
              <span className="text-xs font-bold text-slate-900">Phone & MoMo</span>
            </div>
         </div>
         <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-sm">
            <span className="text-xl">📍</span>
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-emerald-600 uppercase">Verified</span>
              <span className="text-xs font-bold text-slate-900">Home Pin</span>
            </div>
         </div>
      </div>

      {/* Verification Methods Selection */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Trust Method</h3>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => toggleMethod('Vouch')}
            className={`w-full flex items-center gap-4 p-5 rounded-[2rem] border-2 transition-all text-left ${
              state.verificationCompleted.includes('Vouch') ? 'border-amber-500 bg-amber-50 ring-4 ring-amber-500/5' : 'border-gray-100 bg-white hover:border-gray-200'
            }`}
          >
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl">🤝</div>
            <div className="flex-1">
              <p className="font-black text-slate-900 text-sm">Wacu Community Vouch</p>
              <p className="text-[10px] text-slate-400 font-medium leading-tight">Another verified Wacu host confirms your home.</p>
            </div>
            {state.verificationCompleted.includes('Vouch') && <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs">✓</div>}
          </button>

          <button
            onClick={() => toggleMethod('ID')}
            className={`w-full flex items-center gap-4 p-5 rounded-[2rem] border-2 transition-all text-left ${
              state.verificationCompleted.includes('ID') ? 'border-amber-500 bg-amber-50 ring-4 ring-amber-500/5' : 'border-gray-100 bg-white hover:border-gray-200'
            }`}
          >
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-3xl">🆔</div>
            <div className="flex-1">
              <p className="font-black text-slate-900 text-sm">National Identity</p>
              <p className="text-[10px] text-slate-400 font-medium leading-tight">Secure upload of your ID. Privacy is our priority.</p>
            </div>
            {state.verificationCompleted.includes('ID') && <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs">✓</div>}
          </button>
        </div>
      </div>

      <div className="flex-1" />

      <button
        disabled={!isBasicVerified}
        onClick={handleFinalSubmit}
        className={`w-full font-black py-5 rounded-[1.5rem] transition-all active:scale-95 shadow-2xl uppercase tracking-[0.2em] text-xs ${
          isBasicVerified ? 'bg-slate-900 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        Submit Home for Wacu Audit
      </button>
    </div>
  );
};
