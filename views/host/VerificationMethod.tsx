
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
    } else if (!/^\d{10,}$/.test(vouch.phone.replace(/\s+/g, ''))) {
      newErrors.phone = "Enter a valid phone number (at least 10 digits).";
    }

    if (vouch?.isExistingHost) {
      const link = vouch.profileLink?.trim() || '';
      if (!link) {
        newErrors.profileLink = "Profile link or ID is mandatory for existing hosts.";
      } else {
        const isUrl = link.includes('wacu.rw/host/');
        const isNumericId = /^\d+$/.test(link);
        if (!isUrl && !isNumericId) {
          newErrors.profileLink = "Format must be a Wacu URL or a numeric ID.";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toggleMethod = (method: 'Vouch' | 'Video' | 'ID') => {
    const next = state.verificationCompleted.includes(method)
      ? state.verificationCompleted.filter(m => m !== method)
      : [...state.verificationCompleted, method];
    onUpdate({ verificationCompleted: next });
    
    // Initialize vouchDetails if Vouch is selected for the first time
    if (method === 'Vouch' && !state.vouchDetails) {
      onUpdate({ 
        vouchDetails: { name: '', phone: '', profileLink: '', isExistingHost: false } 
      });
    }
    // Clear errors when toggling
    setErrors({});
  };

  const handleVouchUpdate = (updates: Partial<NonNullable<HostListingState['vouchDetails']>>) => {
    onUpdate({
      vouchDetails: {
        ...(state.vouchDetails || { name: '', phone: '', profileLink: '', isExistingHost: false }),
        ...updates
      }
    });
    // Clear specific field error on change
    const fieldKeys = Object.keys(updates);
    if (fieldKeys.length > 0) {
      setErrors(prev => {
        const next = { ...prev };
        fieldKeys.forEach(k => delete next[k]);
        return next;
      });
    }
  };

  const handleFinalSubmit = () => {
    // Validation check for Vouch details if selected
    if (state.verificationCompleted.includes('Vouch')) {
      if (!validateVouchDetails()) {
        return;
      }
    }

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
    <div className="p-6 flex flex-col h-full space-y-8 animate-fadeIn overflow-y-auto no-scrollbar pb-12">
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
      <div className="space-y-6">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Trust Method</h3>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-4">
            <button
              onClick={() => toggleMethod('Vouch')}
              className={`w-full flex items-center gap-4 p-5 rounded-[2rem] border-2 transition-all text-left ${
                state.verificationCompleted.includes('Vouch') ? 'border-amber-500 bg-amber-50 ring-4 ring-amber-400/5' : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl shrink-0">🤝</div>
              <div className="flex-1">
                <p className="font-black text-slate-900 text-sm uppercase tracking-tight">Wacu Community Vouch</p>
                <p className="text-[10px] text-slate-400 font-medium leading-tight">Another verified Wacu host or Ambassador confirms your home.</p>
              </div>
              {state.verificationCompleted.includes('Vouch') && <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs shrink-0">✓</div>}
            </button>

            {/* Expanded Vouch Form */}
            {state.verificationCompleted.includes('Vouch') && (
              <div className="mx-2 p-6 bg-white border-2 border-amber-200 rounded-[2.5rem] shadow-xl animate-slideDown space-y-6">
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Ambassador Details</h4>
                  <p className="text-[11px] text-slate-400 leading-tight italic">Our team will call them to confirm your community status.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex justify-between">
                      Full Name
                      <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={state.vouchDetails?.name || ''}
                      onChange={(e) => handleVouchUpdate({ name: e.target.value })}
                      placeholder="e.g. Emmanuel Mugisha"
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-1 focus:ring-amber-300 text-xs font-bold transition-colors ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-100'}`}
                    />
                    {errors.name && <p className="text-[9px] text-red-500 font-bold ml-1">{errors.name}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex justify-between">
                      Phone Number
                      <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="tel" 
                      value={state.vouchDetails?.phone || ''}
                      onChange={(e) => handleVouchUpdate({ phone: e.target.value })}
                      placeholder="078..."
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-1 focus:ring-amber-300 text-xs font-bold transition-colors ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-100'}`}
                    />
                    {errors.phone && <p className="text-[9px] text-red-500 font-bold ml-1">{errors.phone}</p>}
                  </div>

                  <div className="pt-2 border-t border-slate-50">
                    <button 
                      onClick={() => handleVouchUpdate({ isExistingHost: !state.vouchDetails?.isExistingHost })}
                      className="flex items-center gap-2 group"
                    >
                      <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${state.vouchDetails?.isExistingHost ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-slate-200'}`}>
                        {state.vouchDetails?.isExistingHost && '✓'}
                      </div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-amber-600">They are already a Wacu Host</span>
                    </button>
                  </div>

                  {state.vouchDetails?.isExistingHost && (
                    <div className="space-y-1 animate-fadeIn">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          Host Profile Link / ID
                          <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[7px] font-black text-amber-500 uppercase">Speeds up Audit</span>
                      </div>
                      <input 
                        type="text" 
                        value={state.vouchDetails?.profileLink || ''}
                        onChange={(e) => handleVouchUpdate({ profileLink: e.target.value })}
                        placeholder="wacu.rw/host/123..."
                        className={`w-full px-4 py-3 bg-amber-50/30 border rounded-xl outline-none focus:border-amber-400 text-xs font-mono transition-colors ${errors.profileLink ? 'border-red-500 bg-red-50' : 'border-amber-100'}`}
                      />
                      {errors.profileLink && <p className="text-[9px] text-red-500 font-bold ml-1">{errors.profileLink}</p>}
                      <p className="text-[8px] text-slate-400 italic px-1 mt-1">Found in the "Share Wacu" button on their listing profile.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => toggleMethod('ID')}
            className={`w-full flex items-center gap-4 p-5 rounded-[2rem] border-2 transition-all text-left ${
              state.verificationCompleted.includes('ID') ? 'border-amber-500 bg-amber-50 ring-4 ring-amber-400/5' : 'border-gray-100 bg-white hover:border-gray-200'
            }`}
          >
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-3xl shrink-0">🆔</div>
            <div className="flex-1">
              <p className="font-black text-slate-900 text-sm uppercase tracking-tight">National Identity</p>
              <p className="text-[10px] text-slate-400 font-medium leading-tight">Secure upload of your ID. Privacy is our priority.</p>
            </div>
            {state.verificationCompleted.includes('ID') && <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs shrink-0">✓</div>}
          </button>
        </div>
      </div>

      <div className="flex-1" />

      <button
        disabled={!isBasicVerified}
        onClick={handleFinalSubmit}
        className={`w-full font-black py-5 rounded-[1.5rem] transition-all active:scale-95 shadow-2xl uppercase tracking-[0.2em] text-xs ${
          isBasicVerified ? 'bg-slate-900 text-white shadow-slate-200' : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
        }`}
      >
        Submit Home for Wacu Audit
      </button>
    </div>
  );
};
