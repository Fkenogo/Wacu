
import React from 'react';

interface EducationCardProps {
  icon: string;
  title: string;
  text: string;
  note?: string;
}

const EducationCard: React.FC<EducationCardProps> = ({ icon, title, text, note }) => (
  <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-3 animate-slideIn">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0">
        {icon}
      </div>
      <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight leading-tight">{title}</h3>
    </div>
    <div className="space-y-2 pl-2">
      <p className="text-xs text-slate-500 font-medium leading-relaxed">{text}</p>
      {note && (
        <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full inline-block">
          {note}
        </p>
      )}
    </div>
  </div>
);

interface Props {
  type: 'GUEST' | 'HOST';
  onComplete: () => void;
  onSkip?: () => void;
}

export const PaymentEducationView: React.FC<Props> = ({ type, onComplete, onSkip }) => {
  const isGuest = type === 'GUEST';

  const guestCards = [
    {
      icon: '🏠',
      title: 'You pay the host directly',
      text: 'Payments go straight to the property owner using Mobile Money. WACU does not hold your money at this stage.'
    },
    {
      icon: '📱',
      title: 'Pay using Mobile Money',
      text: 'Follow the on-screen steps to pay by Merchant Code or Phone Number.',
      note: 'Never share your Mobile Money PIN.'
    },
    {
      icon: '📩',
      title: 'Confirm after SMS',
      text: 'Only tap “Payment Sent” after you receive the MTN confirmation SMS.'
    },
    {
      icon: '⚠️',
      title: 'Payment problems',
      text: 'If payment fails or you’re unsure, report the issue in the app. Do not mark payment as sent if it wasn’t successful.'
    },
    {
      icon: '🛡️',
      title: 'Honesty protects your account',
      text: 'False payment claims may affect your ability to book in the future.'
    }
  ];

  const hostCards = [
    {
      icon: '💰',
      title: 'Guests pay you directly',
      text: 'Guests send payment straight to your Mobile Money account.'
    },
    {
      icon: '✅',
      title: 'Confirm honestly',
      text: 'Only confirm payment after you receive the Mobile Money SMS.'
    },
    {
      icon: '🌍',
      title: 'Supporting the platform',
      text: 'You agree to remit 10% of received payments to WACU in good faith.',
      note: 'This helps WACU grow and support hosts.'
    },
    {
      icon: '⚖️',
      title: 'If payment is disputed',
      text: 'Report missing payments promptly. Provide information if requested by admin.'
    },
    {
      icon: '📈',
      title: 'Trust affects visibility',
      text: 'Consistent and honest confirmations improve your listing visibility.'
    }
  ];

  const cards = isGuest ? guestCards : hostCards;

  return (
    <div className="p-6 flex flex-col space-y-8 animate-fadeIn h-full overflow-y-auto no-scrollbar pb-32">
      <div className="flex justify-between items-start pt-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 leading-tight tracking-tight">
            {isGuest ? 'How payments work on WACU' : 'Getting paid on WACU'}
          </h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Wacu Trust Protocol — Phase 1</p>
        </div>
        {onSkip && (
          <button onClick={onSkip} className="text-[10px] font-black text-slate-300 uppercase tracking-widest p-2">Skip</button>
        )}
      </div>

      <div className="space-y-4">
        {cards.map((card, idx) => (
          <EducationCard key={idx} {...card} />
        ))}
      </div>

      <div className="pt-4 sticky bottom-0 bg-gray-50 pb-6">
        <button 
          onClick={onComplete}
          className="w-full bg-slate-900 text-white font-black py-6 rounded-[2.5rem] shadow-2xl active:scale-95 transition-all uppercase tracking-[0.2em] text-xs"
        >
          {isGuest ? 'I understand how payments work' : 'I understand my payment responsibilities'}
        </button>
      </div>
    </div>
  );
};
