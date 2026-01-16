
import React, { useState } from 'react';
import { Listing, BookingState } from '../types';
import { ContextualNudge } from '../components/TrustComponents';

interface Props {
  listing: Listing;
  booking: BookingState;
  onSelect: (method: 'MTN' | 'AIRTEL' | 'ARRIVAL') => void;
  onConfirmedSent: () => void;
  onHelp: () => void;
  seenTooltips: Set<string>;
  onDismissTooltip: (id: string) => void;
}

export const PaymentMethodView: React.FC<Props> = ({ 
  listing, 
  booking, 
  onSelect, 
  onConfirmedSent, 
  onHelp,
  seenTooltips,
  onDismissTooltip
}) => {
  const [step, setStep] = useState<'CHOICE' | 'INSTRUCTIONS'>('CHOICE');
  const [selected, setSelected] = useState<'MTN' | 'AIRTEL' | 'ARRIVAL' | null>(null);

  const identifier = listing.paymentIdentifier || "0780000000";
  const ussd = listing.paymentMethodType === 'MERCHANT_CODE' 
    ? `*182*8*1*${identifier}#` 
    : `*182*1*1*${identifier}#`;

  const handleDial = () => {
    window.location.href = `tel:${ussd.replace('#', '%23')}`;
  };

  const SafetyFooter = () => (
    <div className="mt-6 pt-6 border-t border-gray-100 space-y-2 px-2">
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Safety Warnings</p>
      <ul className="space-y-1">
        <li className="text-[9px] text-slate-500 font-medium leading-tight">• Do not share your Mobile Money PIN.</li>
        <li className="text-[9px] text-slate-500 font-medium leading-tight">• WACU staff will never ask for your PIN.</li>
        <li className="text-[9px] text-slate-500 font-medium leading-tight">• Payments made outside the app are at your own risk.</li>
      </ul>
    </div>
  );

  if (step === 'INSTRUCTIONS') {
    return (
      <div className="p-6 flex flex-col space-y-6 animate-fadeIn h-full overflow-y-auto no-scrollbar pb-32">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <button onClick={() => setStep('CHOICE')} className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1">
              <span className="text-sm">←</span> Change Method
            </button>
            <button onClick={onHelp} className="text-[10px] font-black text-amber-600 uppercase tracking-widest underline decoration-amber-200">How payments work</button>
          </div>
          
          <ContextualNudge 
            id="guest_pay_carefully"
            icon="⚠️"
            title="Pay carefully"
            text="Only pay using the details shown here. Never share your PIN."
            seenTooltips={seenTooltips}
            onDismiss={onDismissTooltip}
          />

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 leading-tight">Pay the Host Directly</h2>
            <p className="text-slate-500 text-sm font-medium italic">
              “Pay only after reviewing booking details.”
            </p>
          </div>
        </div>

        {/* USSD Card */}
        <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
          
          <div className="space-y-3 text-center relative z-10">
            <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Amount to Send</p>
            <p className="text-4xl font-black">{booking.totalPrice.toLocaleString()} RWF</p>
            <div className="bg-white/10 border border-white/20 p-4 rounded-2xl inline-block mt-2">
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">MTN USSD Code</p>
               <p className="text-xl font-black font-mono tracking-tighter text-amber-400">{ussd}</p>
            </div>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-6 relative z-10">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step-by-Step Instructions:</h4>
            <div className="space-y-4">
              <div className="flex gap-4 items-center">
                <span className="w-6 h-6 bg-amber-500 text-slate-900 rounded-full flex items-center justify-center text-[10px] font-black shadow-lg">1</span>
                <p className="text-xs font-bold leading-tight">Prompt: Enter Amount <span className="text-amber-400">({booking.totalPrice.toLocaleString()} RWF)</span></p>
              </div>
              <div className="flex gap-4 items-center">
                <span className="w-6 h-6 bg-white/10 text-white rounded-full flex items-center justify-center text-[10px] font-black">2</span>
                <p className="text-xs font-bold leading-tight">Prompt: Confirm Merchant & Amount</p>
              </div>
              <div className="flex gap-4 items-center">
                <span className="w-6 h-6 bg-white/10 text-white rounded-full flex items-center justify-center text-[10px] font-black">3</span>
                <p className="text-xs font-bold leading-tight text-emerald-400">Wait for MTN SMS confirmation</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <ContextualNudge 
            id="guest_wait_sms"
            icon="📩"
            title="Wait for confirmation"
            text="Tap “Payment Sent” only after you receive the Mobile Money SMS."
            seenTooltips={seenTooltips}
            onDismiss={onDismissTooltip}
          />

          <div className="grid grid-cols-1 gap-3 sticky bottom-0 pt-4 bg-gray-50 pb-6">
            <button 
              onClick={handleDial}
              className="w-full bg-amber-500 text-slate-900 font-black py-6 rounded-[2rem] shadow-xl shadow-amber-500/20 active:scale-95 transition-all uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 border-b-4 border-amber-600"
            >
              <span className="text-xl">📞</span> Proceed to MTN Mobile Money
            </button>
            
            <div className="space-y-2">
              <ContextualNudge 
                id="guest_confirm_honestly"
                icon="✔️"
                title="Confirm honestly"
                text="False payment claims can affect future bookings."
                variant="slate"
                seenTooltips={seenTooltips}
                onDismiss={onDismissTooltip}
              />
              <button 
                onClick={onConfirmedSent}
                className="w-full bg-slate-900 text-white font-black py-5 rounded-[2rem] shadow-xl active:scale-95 transition-all uppercase tracking-[0.2em] text-xs"
              >
                I have sent the payment
              </button>
            </div>

            <div className="pt-2">
              {!seenTooltips.has('guest_having_trouble') && (
                <div className="text-center mb-2 animate-bounce">
                  <span className="bg-amber-100 text-amber-800 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">🛠️ Having trouble? Report here</span>
                </div>
              )}
              <button 
                onClick={() => { onDismissTooltip('guest_having_trouble'); alert("WACU Support alerted. Redirecting to issue report..."); }}
                className="w-full py-2 text-slate-400 font-black uppercase tracking-widest text-[9px] hover:text-slate-600 transition-colors"
              >
                I had a payment issue
              </button>
            </div>
          </div>
        </div>
        <SafetyFooter />
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col space-y-8 animate-fadeIn h-full overflow-y-auto no-scrollbar pb-12">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1 pr-4">
          <ContextualNudge 
            id="guest_direct_pay"
            icon="💳"
            title="Pay the host directly"
            text="Payments go straight to the host using Mobile Money. WACU does not hold funds."
            seenTooltips={seenTooltips}
            onDismiss={onDismissTooltip}
          />
          <h2 className="text-3xl font-black text-slate-900 leading-tight">Pay the host directly using Mobile Money.</h2>
        </div>
        <button onClick={onHelp} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shadow-sm shrink-0">❓</button>
      </div>

      <div className="space-y-4 flex-1">
        <button 
          onClick={() => setSelected('MTN')}
          className={`w-full flex items-center justify-between p-6 rounded-[2.5rem] shadow-sm transition-all active:scale-95 border-2 ${selected === 'MTN' ? 'border-amber-400 bg-amber-50 ring-4 ring-amber-400/5' : 'border-gray-100 bg-white'}`}
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-amber-400 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-inner">
              MTN
            </div>
            <div className="text-left">
              <p className="font-black text-slate-800 text-sm uppercase">MTN Mobile Money</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Direct Payment — Phase 1</p>
            </div>
          </div>
          {selected === 'MTN' && <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-lg">✓</div>}
        </button>

        <button 
          className="w-full flex items-center justify-between p-6 rounded-[2.5rem] border-2 border-gray-100 bg-white opacity-50 grayscale cursor-not-allowed"
          disabled
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-inner">
              A
            </div>
            <div className="text-left">
              <p className="font-black text-slate-800 text-sm uppercase">Airtel Money</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Coming Phase 2</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => setSelected('ARRIVAL')}
          className={`w-full flex items-center justify-between p-6 rounded-[2.5rem] transition-all active:scale-95 border-2 border-dashed ${selected === 'ARRIVAL' ? 'border-slate-400 bg-slate-50' : 'border-gray-200 bg-white'}`}
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl">
              💵
            </div>
            <div className="text-left">
              <p className="font-black text-slate-800 text-sm uppercase">Pay on Arrival</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">In-person Cash</p>
            </div>
          </div>
          {selected === 'ARRIVAL' && <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-lg">✓</div>}
        </button>
      </div>

      <div className="space-y-4">
         <button 
          disabled={!selected}
          onClick={() => selected === 'MTN' ? setStep('INSTRUCTIONS') : (selected && onSelect(selected))}
          className={`w-full font-black py-6 rounded-[2rem] shadow-2xl transition-all active:scale-95 uppercase tracking-[0.2em] text-xs ${selected ? 'bg-slate-900 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
        >
          {selected === 'MTN' ? 'View Payment Details' : 'Confirm Selection'}
        </button>
      </div>
      <SafetyFooter />
    </div>
  );
};
