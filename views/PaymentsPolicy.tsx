
import React from 'react';

export const PaymentsPolicy: React.FC = () => {
  return (
    <div className="flex-1 bg-white animate-fadeIn h-full overflow-y-auto no-scrollbar pb-10">
      <div className="p-8 space-y-10">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Payments on WACU</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">How payments work on the platform.</p>
        </div>

        <div className="space-y-8">
          <section className="space-y-3">
            <h3 className="text-xs font-black text-amber-600 uppercase tracking-widest flex items-center gap-2">
              <span className="w-6 h-6 bg-amber-50 rounded-lg flex items-center justify-center text-sm">💳</span> Section 1 — The Basics
            </h3>
            <div className="space-y-4 pl-8">
              <div>
                <p className="font-black text-slate-800 text-sm">Who do I pay?</p>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Guests pay hosts directly using Mobile Money.</p>
              </div>
              <div>
                <p className="font-black text-slate-800 text-sm">Does WACU hold money?</p>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">No. In Phase 1, WACU does not hold or process payments.</p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center text-sm">📱</span> Section 2 — Payment Methods
            </h3>
            <div className="pl-8 space-y-2">
              <p className="text-xs text-slate-500 font-medium leading-relaxed">Payments are made using:</p>
              <ul className="space-y-1">
                <li className="text-xs text-slate-900 font-bold">• Mobile Money phone number</li>
                <li className="text-xs text-slate-900 font-bold">• Mobile Money merchant code</li>
              </ul>
              <p className="text-[10px] text-slate-400 italic">These are provided by the host during booking.</p>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-xs font-black text-purple-600 uppercase tracking-widest flex items-center gap-2">
              <span className="w-6 h-6 bg-purple-50 rounded-lg flex items-center justify-center text-sm">🎒</span> Section 3 — Guest Responsibilities
            </h3>
            <div className="pl-8 space-y-3">
              <p className="text-xs text-slate-500 font-medium leading-relaxed">As a guest, you agree to:</p>
              <ul className="space-y-2">
                <li className="text-xs text-slate-700 font-medium">• Pay only using the details shown in the app</li>
                <li className="text-xs text-slate-700 font-medium">• Confirm payment only after receiving the Mobile Money SMS</li>
                <li className="text-xs text-slate-700 font-medium">• Report payment problems through the app</li>
              </ul>
              <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                <p className="text-[10px] text-red-600 font-black uppercase tracking-tight">⚠️ False payment claims may affect your account.</p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
              <span className="w-6 h-6 bg-emerald-50 rounded-lg flex items-center justify-center text-sm">🏠</span> Section 4 — Host Responsibilities
            </h3>
            <div className="pl-8 space-y-3">
              <p className="text-xs text-slate-500 font-medium leading-relaxed">As a host, you agree to:</p>
              <ul className="space-y-2">
                <li className="text-xs text-slate-700 font-medium">• Confirm payment only after receiving it</li>
                <li className="text-xs text-slate-700 font-medium">• Act honestly when confirming or disputing payments</li>
                <li className="text-xs text-slate-700 font-medium">• Remit 10% of received payments to WACU in good faith</li>
              </ul>
              <p className="text-[10px] text-slate-400 italic">Repeated issues may affect listing visibility.</p>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-xs font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
              <span className="w-6 h-6 bg-red-50 rounded-lg flex items-center justify-center text-sm">⚖️</span> Section 5 — Disputes
            </h3>
            <div className="pl-8 space-y-3">
              <p className="text-xs text-slate-500 font-medium leading-relaxed">If a payment issue occurs:</p>
              <ul className="space-y-2">
                <li className="text-xs text-slate-700 font-medium">• Report it in the app</li>
                <li className="text-xs text-slate-700 font-medium">• Provide information if requested</li>
                <li className="text-xs text-slate-700 font-medium">• WACU will review and record the outcome</li>
              </ul>
              <p className="text-[10px] text-red-500 font-black uppercase">WACU cannot guarantee recovery of funds in Phase 1.</p>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <span className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-sm">📈</span> Section 6 — Trust & Future Changes
            </h3>
            <div className="pl-8 space-y-2">
              <ul className="space-y-2">
                <li className="text-xs text-slate-700 font-medium">• Honest behavior improves trust and visibility</li>
                <li className="text-xs text-slate-700 font-medium">• WACU may introduce escrow payments in the future</li>
                <li className="text-xs text-slate-700 font-medium">• You will be notified before any changes apply</li>
              </ul>
            </div>
          </section>
        </div>

        <div className="pt-8 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
            WACU provides the platform. Payments are the responsibility of guests and hosts.
          </p>
        </div>
      </div>
    </div>
  );
};
