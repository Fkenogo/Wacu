
import React, { useState } from 'react';

interface PaymentMethodViewProps {
  onSelect: (method: 'MTN' | 'AIRTEL' | 'ARRIVAL') => void;
}

export const PaymentMethodView: React.FC<PaymentMethodViewProps> = ({ onSelect }) => {
  const [selected, setSelected] = useState<'MTN' | 'AIRTEL' | 'ARRIVAL' | null>(null);

  return (
    <div className="p-6 flex flex-col space-y-8 animate-fadeIn h-full">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">How would you like to pay?</h2>
        <p className="text-gray-500 text-sm">Payments are processed instantly via Mobile Money.</p>
      </div>

      <div className="space-y-4 flex-1">
        <button 
          onClick={() => setSelected('MTN')}
          className={`w-full flex items-center justify-between p-5 rounded-2xl shadow-sm transition-all active:scale-95 border-2 ${selected === 'MTN' ? 'border-amber-400 bg-amber-50' : 'border-gray-100 bg-white'}`}
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-inner">
              MTN
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-800">MTN Mobile Money</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Safe & Instant</p>
            </div>
          </div>
          {selected === 'MTN' && <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-white text-xs font-bold">✓</div>}
        </button>

        <button 
          onClick={() => setSelected('AIRTEL')}
          className={`w-full flex items-center justify-between p-5 rounded-2xl shadow-sm transition-all active:scale-95 border-2 ${selected === 'AIRTEL' ? 'border-red-400 bg-red-50' : 'border-gray-100 bg-white'}`}
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-inner">
              A
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-800">Airtel Money</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Fast Local Rail</p>
            </div>
          </div>
          {selected === 'AIRTEL' && <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">✓</div>}
        </button>

        <button 
          onClick={() => setSelected('ARRIVAL')}
          className={`w-full flex items-center justify-between p-5 rounded-2xl shadow-sm transition-all active:scale-95 border-2 border-dashed ${selected === 'ARRIVAL' ? 'border-slate-400 bg-slate-50' : 'border-gray-200 bg-white opacity-70'}`}
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center text-xl">
              💵
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-800">Pay on Arrival</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Limited Support</p>
            </div>
          </div>
          {selected === 'ARRIVAL' && <div className="w-6 h-6 bg-slate-400 rounded-full flex items-center justify-center text-white text-xs font-bold">✓</div>}
        </button>
      </div>

      <div className="space-y-4">
         <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3">
            <span className="text-xl">🛡️</span>
            <p className="text-[10px] text-blue-800 leading-tight font-medium">
              KAZE Protection: Your payment is held securely and only released to the host 24 hours after you successfully check in.
            </p>
         </div>

         <button 
          disabled={!selected}
          onClick={() => selected && onSelect(selected)}
          className={`w-full font-bold py-5 rounded-2xl shadow-lg transition-all active:scale-95 ${selected ? 'bg-slate-900 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
        >
          Confirm & Pay
        </button>
      </div>
    </div>
  );
};
