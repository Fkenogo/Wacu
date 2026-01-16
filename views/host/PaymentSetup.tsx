
import React, { useState } from 'react';
import { HostListingState } from '../../types';
import { ContextualNudge } from '../../components/TrustComponents';

interface Props {
  state: HostListingState;
  onUpdate: (updates: Partial<HostListingState>) => void;
  onContinue: () => void;
  onHelp: () => void;
  seenTooltips: Set<string>;
  onDismissTooltip: (id: string) => void;
}

export const PaymentSetup: React.FC<Props> = ({ state, onUpdate, onContinue, onHelp, seenTooltips, onDismissTooltip }) => {
  const [confirmIdentifier, setConfirmIdentifier] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateAndContinue = () => {
    setError(null);

    if (!state.paymentMethodType) {
      setError("Please select a payout method.");
      return;
    }

    const id = state.paymentIdentifier || '';
    
    if (!/^\d+$/.test(id)) {
      setError("Payment identifier must contain numbers only.");
      return;
    }

    if (state.paymentMethodType === 'PHONE_NUMBER') {
      if (id.length !== 10 || !id.startsWith('07')) {
        setError("Enter a valid 10-digit Rwanda phone number (starts with 07).");
        return;
      }
    } else {
      if (id.length < 5 || id.length > 8) {
        setError("Enter a valid MTN Merchant Code (5-8 digits).");
        return;
      }
    }

    if (id !== confirmIdentifier) {
      setError("The confirmation does not match the payment identifier. Please check again.");
      return;
    }

    if (!state.commissionConsent) {
      setError("You must agree to the 10% commission to activate your listing.");
      return;
    }

    onContinue();
  };

  return (
    <div className="p-6 flex flex-col space-y-8 animate-fadeIn h-full overflow-y-auto no-scrollbar pb-32">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900 leading-tight tracking-tight">Payout Setup</h2>
          <p className="text-slate-500 text-sm font-medium">How should guests send you money?</p>
        </div>
        <button 
          onClick={onHelp}
          className="bg-amber-50 text-amber-600 p-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-100 shrink-0"
        >
          Help ⓘ
        </button>
      </div>

      <div className="space-y-6">
        <ContextualNudge 
          id="host_paid_directly"
          icon="💰"
          title="You get paid directly"
          text="Guests send payments straight to your Mobile Money account."
          seenTooltips={seenTooltips}
          onDismiss={onDismissTooltip}
        />

        {/* Method Selection */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Payout Method</label>
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => { onUpdate({ paymentMethodType: 'MERCHANT_CODE', paymentIdentifier: '' }); setConfirmIdentifier(''); }}
              className={`flex items-start gap-4 p-5 rounded-[2rem] border-2 transition-all text-left ${
                state.paymentMethodType === 'MERCHANT_CODE' 
                  ? 'border-amber-500 bg-amber-50 ring-4 ring-amber-400/5 shadow-md' 
                  : 'border-gray-100 bg-white hover:border-gray-200 shadow-sm'
              }`}
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-gray-50">🏪</div>
              <div className="flex-1">
                <p className="font-black text-slate-900 text-sm uppercase tracking-tight">MTN Merchant Code</p>
                <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">Use if you have a registered MoMo business code.</p>
              </div>
            </button>

            <button
              onClick={() => { onUpdate({ paymentMethodType: 'PHONE_NUMBER', paymentIdentifier: '' }); setConfirmIdentifier(''); }}
              className={`flex items-start gap-4 p-5 rounded-[2rem] border-2 transition-all text-left ${
                state.paymentMethodType === 'PHONE_NUMBER' 
                  ? 'border-amber-500 bg-amber-50 ring-4 ring-amber-400/5 shadow-md' 
                  : 'border-gray-100 bg-white hover:border-gray-200 shadow-sm'
              }`}
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-gray-50">📱</div>
              <div className="flex-1">
                <p className="font-black text-slate-900 text-sm uppercase tracking-tight">MTN Phone Number</p>
                <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">Standard personal Mobile Money transfer.</p>
              </div>
            </button>
          </div>
        </div>

        {/* Conditional Input Fields */}
        {state.paymentMethodType === 'MERCHANT_CODE' && (
          <div className="space-y-4 animate-slideDown">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">MTN Merchant Code</label>
              <input 
                type="tel"
                value={state.paymentIdentifier || ''}
                onChange={(e) => onUpdate({ paymentIdentifier: e.target.value.replace(/\D/g, '') })}
                placeholder="e.g. 123456"
                className="w-full px-6 py-4 bg-white border-2 border-gray-100 rounded-2xl outline-none font-bold text-lg focus:border-amber-400 transition-all shadow-inner"
              />
              <p className="text-[9px] font-black text-amber-600 uppercase tracking-tighter ml-1">🏪 Verify your merchant code — Guests cannot pay if it's wrong.</p>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Merchant Code</label>
              <input 
                type="tel"
                value={confirmIdentifier}
                onChange={(e) => setConfirmIdentifier(e.target.value.replace(/\D/g, ''))}
                placeholder="Repeat merchant code..."
                className="w-full px-6 py-4 bg-white border-2 border-gray-100 rounded-2xl outline-none font-bold text-lg focus:border-amber-400 transition-all shadow-inner"
              />
            </div>
          </div>
        )}

        {state.paymentMethodType === 'PHONE_NUMBER' && (
          <div className="space-y-4 animate-slideDown">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">MTN Mobile Money Number</label>
              <input 
                type="tel"
                value={state.paymentIdentifier || ''}
                onChange={(e) => onUpdate({ paymentIdentifier: e.target.value.replace(/\D/g, '') })}
                placeholder="e.g. 078XXXXXXX"
                className="w-full px-6 py-4 bg-white border-2 border-gray-100 rounded-2xl outline-none font-bold text-lg focus:border-amber-400 transition-all shadow-inner"
              />
              <p className="text-[9px] font-black text-amber-600 uppercase tracking-tighter ml-1">📱 Double-check your number — Incorrect details delay payouts.</p>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Phone Number</label>
              <input 
                type="tel"
                value={confirmIdentifier}
                onChange={(e) => setConfirmIdentifier(e.target.value.replace(/\D/g, ''))}
                placeholder="Repeat phone number..."
                className="w-full px-6 py-4 bg-white border-2 border-gray-100 rounded-2xl outline-none font-bold text-lg focus:border-amber-400 transition-all shadow-inner"
              />
            </div>
          </div>
        )}

        {/* Commission Consent Toggle */}
        <div className="space-y-3">
          <ContextualNudge 
            id="host_good_faith"
            icon="🤍"
            title="Good-faith contribution"
            text="You agree to remit 10% of received payments to support WACU."
            seenTooltips={seenTooltips}
            onDismiss={onDismissTooltip}
            variant="slate"
          />
          <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
            
            <div className="flex items-center justify-between relative z-10">
              <div className="space-y-1 pr-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-400">Commission Declaration</p>
                <p className="text-[11px] font-bold text-slate-300 leading-relaxed italic">
                  “You agree to remit 10% of received payments to WACU in good faith.”
                </p>
              </div>
              
              <button 
                onClick={() => onUpdate({ commissionConsent: !state.commissionConsent })}
                className={`w-14 h-8 rounded-full relative transition-all duration-300 shrink-0 shadow-inner ${
                  state.commissionConsent ? 'bg-amber-500' : 'bg-white/10'
                }`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 ${
                  state.commissionConsent ? 'left-7' : 'left-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl animate-shake">
            <p className="text-[10px] text-red-600 font-black uppercase tracking-tight text-center">{error}</p>
          </div>
        )}
      </div>

      {/* Primary Action */}
      <button
        onClick={validateAndContinue}
        className={`w-full font-black py-6 rounded-[2.2rem] shadow-2xl active:scale-95 transition-all sticky bottom-0 z-10 uppercase tracking-[0.2em] text-xs ${
          state.commissionConsent && state.paymentIdentifier === confirmIdentifier && state.paymentIdentifier !== ''
            ? 'bg-slate-900 text-white shadow-slate-200'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
        }`}
      >
        Complete Payout Setup
      </button>
    </div>
  );
};
