
import React, { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-50 animate-fadeIn">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex justify-between items-center text-left gap-4 active:bg-slate-50 transition-colors"
      >
        <span className="text-[13px] font-black text-slate-900 leading-tight uppercase tracking-tight">{question}</span>
        <span className={`text-slate-300 font-black transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          {isOpen ? '−' : '+'}
        </span>
      </button>
      {isOpen && (
        <div className="pb-5 animate-slideDown">
          <p className="text-xs text-slate-500 font-medium leading-relaxed italic border-l-2 border-amber-200 pl-4 py-1">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
};

export const FAQs: React.FC = () => {
  return (
    <div className="flex-1 bg-white animate-fadeIn h-full overflow-y-auto no-scrollbar pb-10">
      <div className="p-8 space-y-12">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Payments & Trust FAQs</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Common questions about the Wacu model.</p>
        </div>

        {/* For Guests */}
        <section className="space-y-4">
          <h3 className="text-xs font-black text-purple-600 uppercase tracking-widest flex items-center gap-2 border-b border-purple-100 pb-2">
            <span className="text-lg">🎒</span> For Guests
          </h3>
          <div>
            <FAQItem question="Do I pay WACU or the host?" answer="You pay the host directly using Mobile Money." />
            <FAQItem question="Why doesn’t WACU hold my money?" answer="WACU is starting with a trust-based model to support local hosts and simple payments." />
            <FAQItem question="When should I mark “Payment Sent”?" answer="Only after you receive the Mobile Money confirmation SMS." />
            <FAQItem question="What if I pay but the host says they didn’t receive it?" answer="Report the issue in the app. You may be asked to share proof (like an SMS screenshot)." />
            <FAQItem question="What happens if I mark payment sent when I didn’t pay?" answer="This is a breach of trust and may limit your ability to book in the future." />
          </div>
        </section>

        {/* For Hosts */}
        <section className="space-y-4">
          <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2 border-b border-emerald-100 pb-2">
            <span className="text-lg">🏠</span> For Hosts
          </h3>
          <div>
            <FAQItem question="How do guests pay me?" answer="Guests pay you directly via Mobile Money using your phone number or merchant code." />
            <FAQItem question="When should I confirm payment?" answer="Only after you verify that you have received the Mobile Money payment in your account." />
            <FAQItem question="What is the 10% commission to WACU?" answer="It’s a good-faith contribution to support the platform in Phase 1." />
            <FAQItem question="Is the commission deducted automatically?" answer="No. You remit it manually based on trust. Check your Earnings tab." />
            <FAQItem question="What if a guest claims they paid but I didn’t receive anything?" answer="Report the missing payment in the app. Our admin team will review the transaction logs." />
          </div>
        </section>

        {/* Trust & Safety */}
        <section className="space-y-4">
          <h3 className="text-xs font-black text-amber-600 uppercase tracking-widest flex items-center gap-2 border-b border-amber-100 pb-2">
            <span className="text-lg">🤝</span> Trust & Safety
          </h3>
          <div>
            <FAQItem question="How does WACU build trust without escrow?" answer="Through multi-level verification, mandatory education, dispute tracking, and community ratings." />
            <FAQItem question="Can trust affect my account?" answer="Yes. Honest behavior improves listing visibility and platform access. Abuse reduces it." />
            <FAQItem question="Will WACU introduce escrow later?" answer="Yes, once the platform and community are ready for larger-scale financial operations." />
          </div>
        </section>

        <div className="pt-10 space-y-4">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white text-center space-y-3 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
            <h4 className="text-sm font-black uppercase tracking-widest relative z-10">Still need help?</h4>
            <p className="text-[10px] text-slate-400 font-medium relative z-10">Contact Wacu Support via WhatsApp for urgent payment matters.</p>
            <button className="bg-white text-slate-900 font-black px-6 py-3 rounded-xl text-[10px] uppercase tracking-widest relative z-10 shadow-lg active:scale-95 transition-all">Support Chat</button>
          </div>
        </div>
      </div>
    </div>
  );
};
