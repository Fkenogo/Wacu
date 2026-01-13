
import React, { useState, useRef } from 'react';
import { GuestProfile, TrustBadge } from '../types';

interface Props {
  guest: GuestProfile;
  onUpdate: (updates: GuestProfile) => void;
  onComplete: () => void;
}

export const GuestVerificationView: React.FC<Props> = ({ guest, onUpdate, onComplete }) => {
  const isBaselineIncomplete = !guest.bio.trim() || !guest.badges.includes('Contact Verified');
  
  const [step, setStep] = useState<'BASE_INFO' | 'CHOICE' | 'ID_UPLOAD' | 'COMMUNITY' | 'SOCIAL'>(
    isBaselineIncomplete ? 'BASE_INFO' : 'CHOICE'
  );
  
  const [formData, setFormData] = useState({
    bio: guest.bio,
    phone: guest.phone,
    vouchName: '',
    vouchPhone: '',
    idImage: null as string | null
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStepComplete = (newBadge?: TrustBadge, nextLevel?: 1 | 2 | 3) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const updatedBadges = [...new Set([...guest.badges, ...(newBadge ? [newBadge] : [])])];
      
      if (step === 'BASE_INFO') {
        updatedBadges.push('Contact Verified');
        onUpdate({
          ...guest,
          bio: formData.bio,
          badges: updatedBadges as TrustBadge[],
          verificationLevel: 1
        });
        setStep('CHOICE');
        setIsSubmitting(false);
      } else {
        onUpdate({
          ...guest,
          verificationLevel: nextLevel || guest.verificationLevel,
          badges: updatedBadges as TrustBadge[],
          identityDocumentStored: newBadge === 'Identity Verified' ? true : guest.identityDocumentStored,
          communityReference: step === 'COMMUNITY' ? { name: formData.vouchName, phone: formData.vouchPhone, confirmed: true } : guest.communityReference
        });
        setIsSubmitting(false);
        onComplete();
      }
    }, 2000);
  };

  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, idImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (isSubmitting) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 space-y-8 animate-fadeIn h-full">
        <div className="w-16 h-16 border-4 border-amber-100 border-t-amber-500 rounded-full animate-spin"></div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-black text-slate-900">Establishing Wacu Trust</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Encrypting your identity...</p>
        </div>
      </div>
    );
  }

  // --- STEP: BASE INFO ---
  if (step === 'BASE_INFO') {
    return (
      <div className="p-8 flex flex-col space-y-8 animate-fadeIn">
        <div className="space-y-2">
           <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-full">Level 1: Community Baseline</span>
           <h2 className="text-3xl font-black text-slate-900 leading-tight">Join Our Family</h2>
           <p className="text-slate-500 text-sm font-medium leading-relaxed">Wacu hosts share their homes. Help them get to know you before you arrive.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number (MTN/Airtel)</label>
            <div className="flex gap-2">
              <input 
                type="tel" 
                value={formData.phone}
                className="flex-1 px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none font-bold"
                readOnly
              />
              <div className="px-4 py-4 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl shadow-sm">
                ✅
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">About You</label>
            <textarea 
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              placeholder="Tell our hosts why you're traveling and what makes you a great neighbor..."
              className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-amber-400 font-medium text-sm leading-relaxed shadow-inner"
            />
          </div>
        </div>

        <button 
          onClick={() => handleStepComplete()}
          disabled={!formData.bio.trim() || formData.bio.length < 10}
          className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-95 ${formData.bio.trim().length >= 10 ? 'bg-slate-900 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
        >
          Confirm Community Info
        </button>
      </div>
    );
  }

  // --- STEP: ID UPLOAD ---
  if (step === 'ID_UPLOAD') {
    return (
      <div className="p-8 flex flex-col space-y-8 animate-slideUp h-full">
        <div className="space-y-2">
           <button onClick={() => setStep('CHOICE')} className="text-[10px] font-black text-slate-400 uppercase mb-2">← Back to Options</button>
           <h2 className="text-3xl font-black text-slate-900 leading-tight">Identity Vault</h2>
           <p className="text-slate-500 text-sm font-medium">Please upload a clear photo of your National ID or Passport.</p>
        </div>

        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`flex-1 border-4 border-dashed rounded-[3rem] flex flex-col items-center justify-center p-8 transition-all cursor-pointer ${formData.idImage ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100 bg-slate-50 hover:bg-slate-100'}`}
        >
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleIdUpload} />
          {formData.idImage ? (
            <div className="space-y-4 text-center">
              <img src={formData.idImage} className="w-48 h-32 object-cover rounded-2xl mx-auto shadow-lg" alt="ID Preview" />
              <p className="text-xs font-black text-emerald-600 uppercase">Document Captured Successfully</p>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <span className="text-6xl">📸</span>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Tap to Scan</p>
            </div>
          )}
        </div>

        <button 
          onClick={() => handleStepComplete('Identity Verified', 2)}
          disabled={!formData.idImage}
          className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-95 ${formData.idImage ? 'bg-slate-900 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
        >
          Submit to Vault
        </button>
      </div>
    );
  }

  // --- STEP: COMMUNITY VOUCH ---
  if (step === 'COMMUNITY') {
    return (
      <div className="p-8 flex flex-col space-y-8 animate-slideUp h-full">
        <div className="space-y-2">
           <button onClick={() => setStep('CHOICE')} className="text-[10px] font-black text-slate-400 uppercase mb-2">← Back to Options</button>
           <h2 className="text-3xl font-black text-slate-900 leading-tight">Community Vouch</h2>
           <p className="text-slate-500 text-sm font-medium">Who in the Wacu community can vouch for your integrity? We'll send them a quick trust check.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reference Name</label>
            <input 
              type="text" 
              value={formData.vouchName}
              onChange={(e) => setFormData({...formData, vouchName: e.target.value})}
              placeholder="e.g. Emmanuel M."
              className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-amber-400 font-bold"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reference Phone</label>
            <input 
              type="tel" 
              value={formData.vouchPhone}
              onChange={(e) => setFormData({...formData, vouchPhone: e.target.value})}
              placeholder="078..."
              className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-amber-400 font-bold"
            />
          </div>
        </div>

        <div className="p-6 bg-blue-50 rounded-[2.5rem] border border-blue-100 flex items-start gap-4">
           <span className="text-2xl mt-1">🤝</span>
           <p className="text-[10px] text-blue-800 font-medium leading-relaxed">
             Our team will perform a 30-second verification call with your reference to confirm your community status.
           </p>
        </div>

        <button 
          onClick={() => handleStepComplete('Community Trusted', 2)}
          disabled={!formData.vouchName.trim() || formData.vouchPhone.length < 10}
          className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-95 ${formData.vouchName.trim() && formData.vouchPhone.length >= 10 ? 'bg-slate-900 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
        >
          Send Vouch Request
        </button>
      </div>
    );
  }

  // --- STEP: CHOICE (DEFAULT) ---
  return (
    <div className="p-6 flex flex-col space-y-8 animate-slideUp h-full">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-slate-900 leading-tight">Wacu Trust</h2>
        <p className="text-slate-500 text-sm font-medium">To protect our hosts' households, we require advanced verification to book shared homes.</p>
      </div>

      <div className="space-y-4">
        <button 
          onClick={() => setStep('ID_UPLOAD')}
          className="w-full flex items-center gap-5 p-5 bg-white border-2 border-gray-100 rounded-[2.5rem] hover:border-amber-400 transition-all text-left shadow-sm active:scale-95 group"
        >
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-amber-100 transition-colors">🆔</div>
          <div className="flex-1">
            <p className="font-black text-slate-900 text-sm">National Identity</p>
            <p className="text-[10px] text-slate-400 font-medium leading-tight">Private upload to Wacu Secure Vault.</p>
          </div>
          <span className="text-slate-300 font-black group-hover:translate-x-1 transition-transform">→</span>
        </button>

        <button 
          onClick={() => setStep('COMMUNITY')}
          className="w-full flex items-center gap-5 p-5 bg-white border-2 border-gray-100 rounded-[2.5rem] hover:border-amber-400 transition-all text-left shadow-sm active:scale-95 group"
        >
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-blue-100 transition-colors">🤝</div>
          <div className="flex-1">
            <p className="font-black text-slate-900 text-sm">Community Vouch</p>
            <p className="text-[10px] text-slate-400 font-medium leading-tight">A Wacu host confirms your character.</p>
          </div>
          <span className="text-slate-300 font-black group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>

      <div className="mt-auto p-6 bg-slate-900 rounded-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="flex items-start gap-4 relative z-10">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl">🛡️</div>
          <div className="space-y-1">
            <h4 className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Wacu Secure Vault</h4>
            <p className="text-[10px] text-white/70 font-medium leading-relaxed">
              We never share your raw ID data. We only issue a Trust Badge to our hosts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
