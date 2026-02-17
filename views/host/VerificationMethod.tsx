
import React, { useState } from 'react';
import { HostListingState } from '../../types';

interface Props {
  state: HostListingState;
  onUpdate: (updates: Partial<HostListingState>) => void;
  onSubmit: () => void;
}

export const VerificationMethod: React.FC<Props> = ({ state, onUpdate, onSubmit }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateVouchDetails = () => {
    const newErrors: Record<string, string> = {};
    const vouch = state.vouchDetails;

    if (!vouch?.name?.trim()) {
      newErrors.name = "Ambassador's full name is required.";
    }

    if (!vouch?.phone?.trim()) {
      newErrors.phone = "Ambassador's phone number is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toggleMethod = (method: 'Vouch' | 'Video' | 'ID') => {
    const next = state.verificationCompleted.includes(method)
      ? state.verificationCompleted.filter(m => m !== method)
      : [...state.verificationCompleted, method];
    onUpdate({ verificationCompleted: next });
    
    if (method === 'Vouch' && !state.vouchDetails) {
      onUpdate({ 
        vouchDetails: { name: '', phone: '', profileLink: '', isExistingHost: false } 
      });
    }
    setErrors({});
  };

  const handleFinalSubmit = () => {
    if (state.verificationCompleted.includes('Vouch')) {
      if (!validateVouchDetails()) return;
    }

    setIsProcessing(true);
    // Real submission is handled by parent App.tsx after this call
    setTimeout(() => {
      onSubmit();
    }, 2500);
  };

  const isBasicVerified = state.verificationCompleted.some(m => ['Vouch', 'Video', 'ID'].includes(m));

  if (isProcessing) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 space-y-12 animate-fadeIn bg-white">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-4xl">🛡️</div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Uploading Your Wacu</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Deploying to community network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col h-full space-y-8 animate-fadeIn overflow-y-auto no-scrollbar pb-12">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
           <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-full">Final Step: Wacu Trust</span>
        </div>
        <h2 className="text-3xl font-black text-slate-900 leading-tight">Secure Your Home</h2>
        <p className="text-slate-500 text-sm font-medium">To protect both hosts and guests, we require proof of identity and property location to call it Wacu.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
         <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-sm">
            <span className="text-xl">📱</span>
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-emerald-600 uppercase">Verified</span>
              <span className="text-xs font-bold text-slate-900 leading-none">Phone</span>
            </div>
         </div>
         <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-sm">
            <span className="text-xl">📍</span>
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-emerald-600 uppercase">Verified</span>
              <span className="text-xs font-bold text-slate-900 leading-none">Map Pin</span>
            </div>
         </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Trust Method</h3>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => toggleMethod('Vouch')}
            className={`w-full flex items-center gap-4 p-5 rounded-[2rem] border-2 transition-all text-left ${
              state.verificationCompleted.includes('Vouch') ? 'border-amber-500 bg-amber-50 ring-4 ring-amber-400/5' : 'border-gray-100 bg-white hover:border-gray-200'
            }`}
          >
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl shrink-0">🤝</div>
            <div className="flex-1">
              <p className="font-black text-slate-900 text-sm uppercase tracking-tight">Community Vouch</p>
              <p className="text-[10px] text-slate-400 font-medium leading-tight">Another verified host confirms your home.</p>
            </div>
            {state.verificationCompleted.includes('Vouch') && <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs shrink-0">✓</div>}
          </button>

          <button
            onClick={() => toggleMethod('ID')}
            className={`w-full flex items-center gap-4 p-5 rounded-[2rem] border-2 transition-all text-left ${
              state.verificationCompleted.includes('ID') ? 'border-amber-500 bg-amber-50 ring-4 ring-amber-400/5' : 'border-gray-100 bg-white hover:border-gray-200'
            }`}
          >
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-3xl shrink-0">🆔</div>
            <div className="flex-1">
              <p className="font-black text-slate-900 text-sm uppercase tracking-tight">National ID</p>
              <p className="text-[10px] text-slate-400 font-medium leading-tight">Private, secure upload to the Wacu Vault.</p>
            </div>
            {state.verificationCompleted.includes('ID') && <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs shrink-0">✓</div>}
          </button>
        </div>
      </div>

      <div className="flex-1" />

      <button
        disabled={!isBasicVerified || isProcessing}
        onClick={handleFinalSubmit}
        className={`w-full font-black py-6 rounded-[2rem] transition-all active:scale-95 shadow-2xl uppercase tracking-[0.2em] text-xs ${
          isBasicVerified ? 'bg-slate-900 text-white shadow-slate-200' : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
        }`}
      >
        Complete Wacu Listing
      </button>
    </div>
  );
};
