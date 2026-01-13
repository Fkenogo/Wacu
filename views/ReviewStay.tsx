
import React, { useState } from 'react';
import { BookingState, StructuredReview, UserRole } from '../types';

interface Props {
  trip: BookingState;
  role: UserRole;
  onSubmit: (review: StructuredReview) => void;
}

export const ReviewStayView: React.FC<Props> = ({ trip, role, onSubmit }) => {
  const isGuest = role === UserRole.GUEST;
  
  const [q1, setQ1] = useState<boolean | null>(null);
  const [q2, setQ2] = useState<boolean | null>(null);
  const [q3, setQ3] = useState<boolean | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (q1 === null || q2 === null || q3 === null) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
        onSubmit({
            submitted: true,
            timestamp: new Date().toISOString(),
            q1,
            q2,
            q3,
            comment: comment.trim() || undefined
        });
    }, 1200);
  };

  const prompts = isGuest ? [
    { 
      id: 'q1', 
      title: 'Safety Check', 
      text: 'Did you feel safe and respected in this Wacu?', 
      icon: '🛡️', 
      value: q1, 
      setter: setQ1 
    },
    { 
      id: 'q2', 
      title: 'Wacu Accuracy', 
      text: 'Were the photos and landmark directions accurate?', 
      icon: '🎯', 
      value: q2, 
      setter: setQ2 
    },
    { 
      id: 'q3', 
      title: 'Recommendation', 
      text: 'Would you stay in this Wacu again?', 
      icon: '🎒', 
      value: q3, 
      setter: setQ3 
    }
  ] : [
    { 
      id: 'q1', 
      title: 'Vouch for Guest', 
      text: 'Would you host this guest in your Wacu again?', 
      icon: '🤝', 
      value: q1, 
      setter: setQ1 
    },
    { 
      id: 'q2', 
      title: 'Wacu Rules', 
      text: 'Did the guest respect your Wacu and rules?', 
      icon: '🏠', 
      value: q2, 
      setter: setQ2 
    },
    { 
      id: 'q3', 
      title: 'Integrity', 
      text: 'Any safety concerns to report to the Wacu family?', 
      icon: '⚠️', 
      value: q3, 
      setter: setQ3 
    }
  ];

  if (isSubmitting) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 space-y-8 animate-fadeIn">
        <div className="w-16 h-16 border-4 border-amber-100 border-t-amber-500 rounded-full animate-spin"></div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-black text-slate-900">Finalizing Wacu Trust</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Updating Community Metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col space-y-8 animate-slideUp pb-12 h-full overflow-y-auto no-scrollbar">
      {/* Header Context */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
           <img src={trip.guestProfile?.avatar} className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover" alt="Profile" />
           <div>
             <h2 className="text-2xl font-black text-slate-900 leading-tight">
               Review your time at this Wacu
             </h2>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{trip.startDate} — {trip.endDate}</p>
           </div>
        </div>
        
        <div className="bg-slate-900 p-5 rounded-[2rem] flex items-center gap-4 shadow-xl">
           <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl">🤫</div>
           <div className="space-y-0.5">
             <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Double-Blind Protection</p>
             <p className="text-[9px] text-white/70 font-medium leading-relaxed">
               Your review is hidden until the other party submits theirs. This keeps our Wacu family honest.
             </p>
           </div>
        </div>
      </div>

      {/* Structured Prompts */}
      <div className="space-y-4">
        {prompts.map((prompt) => (
          <div key={prompt.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-5">
             <div className="flex items-start gap-4">
               <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shrink-0">
                 {prompt.icon}
               </div>
               <div className="space-y-1">
                 <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{prompt.title}</h4>
                 <p className="text-xs text-slate-500 font-medium leading-tight">{prompt.text}</p>
               </div>
             </div>

             <div className="flex gap-2">
               <button 
                onClick={() => prompt.setter(true)}
                className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all border-2 ${prompt.value === true ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg' : 'bg-white border-gray-100 text-slate-400 hover:border-gray-200'}`}
               >
                 Yes
               </button>
               <button 
                onClick={() => prompt.setter(false)}
                className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all border-2 ${prompt.value === false ? 'bg-red-500 border-red-500 text-white shadow-lg' : 'bg-white border-gray-100 text-slate-400 hover:border-gray-200'}`}
               >
                 No
               </button>
             </div>
          </div>
        ))}
      </div>

      {/* Comment Prompt */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wacu Context (Optional)</h4>
          <span className="text-[9px] font-black text-slate-300 uppercase">Visible to community</span>
        </div>
        <textarea 
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={isGuest ? "Share details about the hospitality, breakfast, or directions..." : "How was the guest's communication and respect for your Wacu?"}
          className="w-full px-6 py-6 bg-white border-2 border-gray-100 rounded-[2.5rem] outline-none focus:border-amber-400 font-medium text-sm leading-relaxed shadow-inner"
        />
      </div>

      <div className="pt-2 space-y-4">
        <div className="p-6 bg-amber-50 border border-amber-100 rounded-[2.5rem] flex items-start gap-4">
           <span className="text-2xl mt-1">✨</span>
           <div className="space-y-1">
             <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest">Build Reputation</p>
             <p className="text-[11px] font-bold text-amber-800/70 leading-relaxed">
               Honesty helps keep the Wacu community safe and flourishing for everyone.
             </p>
           </div>
        </div>

        <button 
            disabled={q1 === null || q2 === null || q3 === null}
            onClick={handleSubmit}
            className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl transition-all active:scale-95 ${q1 !== null && q2 !== null && q3 !== null ? 'bg-slate-900 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
        >
            Securely Submit Review
        </button>
      </div>
    </div>
  );
};
