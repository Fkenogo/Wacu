import React, { useState, useRef } from 'react';
import { GuestProfile, TrustBadge } from '../types';
import { auth, uploadImage } from '../firebase';

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
    name: guest.name || '',
    bio: guest.bio,
    phone: guest.phone,
    vouchName: '',
    vouchPhone: '',
    idImage: null as string | null,
    avatar: guest.avatar || null as string | null
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleStepComplete = (newBadge?: TrustBadge, nextLevel?: 1 | 2 | 3) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const updatedBadges = [...new Set([...guest.badges, ...(newBadge ? [newBadge] : [])])];
      
      if (step === 'BASE_INFO') {
        updatedBadges.push('Contact Verified');
        onUpdate({
          ...guest,
          name: formData.name,
          bio: formData.bio,
          avatar: formData.avatar || guest.avatar,
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
    }, 1500);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'ID' | 'AVATAR') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const userId = auth.currentUser?.uid || 'anonymous';
      const fileName = `${type === 'ID' ? 'id' : 'avatar'}_${Date.now()}_${file.name}`;
      const path = `${type === 'ID' ? 'id_vault' : 'avatars'}/${userId}/${fileName}`;
      
      const downloadUrl = await uploadImage(file, path);
      if (type === 'ID') {
        setFormData(prev => ({ ...prev, idImage: downloadUrl }));
      } else {
        setFormData(prev => ({ ...prev, avatar: downloadUrl }));
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  if (isSubmitting) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 space-y-8 animate-fadeIn h-full bg-white">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-black text-[#1d180c]">Establishing Wacu Trust</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Encrypting your identity...</p>
        </div>
      </div>
    );
  }

  // --- STEP: BASE INFO (Trust Baseline Redesign) ---
  if (step === 'BASE_INFO') {
    return (
      <div className="max-w-md mx-auto min-h-screen flex flex-col bg-white shadow-xl overflow-hidden font-display">
        <header className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <button 
            onClick={onComplete}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold tracking-tight">Trust Baseline</h1>
          <div className="w-10"></div>
        </header>

        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-primary">Step 1 of 3</span>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Profile Verification</span>
          </div>
          <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-1/3 rounded-full"></div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Build Your Trust Baseline</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Level 1 is the first step to unlocking Wacu features. Establish your identity baseline.
            </p>
          </div>

          <div className="flex flex-col items-center mb-8">
            <div 
              onClick={() => avatarInputRef.current?.click()}
              className="relative group cursor-pointer"
            >
              <div className="w-32 h-32 rounded-full border-4 border-primary/20 bg-primary/5 flex items-center justify-center overflow-hidden transition-all hover:border-primary/40">
                {formData.avatar ? (
                  <img src={formData.avatar} className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-4xl text-primary/40">person</span>
                )}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">photo_camera</span>
                </div>
              </div>
              <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'AVATAR')} />
              <button className="absolute bottom-0 right-0 bg-primary text-[#1d180c] w-10 h-10 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-sm">add_a_photo</span>
              </button>
            </div>
            <p className="mt-3 text-xs font-medium text-gray-400">Tap to upload profile photo</p>
          </div>

          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full">
              <span className="material-symbols-outlined text-emerald-500 text-xl font-bold">verified_user</span>
              <div className="flex flex-col text-left">
                <span className="text-emerald-600 text-sm font-bold leading-none">Level 1 Protocol</span>
                <span className="text-[10px] text-emerald-500/80 font-medium">Community baseline</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
              <div className="relative">
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full h-14 px-5 rounded-xl border border-gray-200 bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400" 
                  placeholder="Enter your full name" 
                />
                {formData.name.trim().length > 3 && (
                  <span className="material-symbols-outlined absolute right-4 top-4 text-emerald-500 font-bold">check_circle</span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-gray-700">Short Bio</label>
                <span className="text-[10px] text-gray-400 font-medium">{formData.bio.length}/150</span>
              </div>
              <textarea 
                rows={3}
                maxLength={150}
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="w-full p-5 rounded-xl border border-gray-200 bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400 resize-none" 
                placeholder="Tell us a little about yourself..."
              ></textarea>
            </div>
          </div>
        </main>

        <footer className="p-6 bg-white border-t border-gray-100 space-y-4">
          <button 
            onClick={() => handleStepComplete()}
            disabled={!formData.name.trim() || formData.bio.trim().length < 10}
            className={`w-full h-14 font-bold rounded-full shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all ${
              formData.name.trim() && formData.bio.trim().length >= 10 ? 'bg-primary text-[#1d180c]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Complete Profile
          </button>
          <div className="flex justify-center gap-6">
            <button onClick={() => setStep('CHOICE')} className="text-sm font-medium text-gray-400 hover:text-primary transition-colors">Skip for now</button>
            <button className="text-sm font-medium text-gray-400 hover:text-primary transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">help</span>
              Why is this needed?
            </button>
          </div>
        </footer>
      </div>
    );
  }

  // --- STEP: ID UPLOAD ---
  if (step === 'ID_UPLOAD') {
    return (
      <div className="p-8 flex flex-col space-y-8 animate-slideUp h-full bg-background-light min-h-screen">
        <div className="space-y-2">
           <button onClick={() => setStep('CHOICE')} className="text-[10px] font-black text-slate-400 uppercase mb-2 flex items-center gap-1">
             <span className="material-symbols-outlined text-xs">arrow_back</span> Back to Options
           </button>
           <h2 className="text-3xl font-black text-slate-900 leading-tight">Identity Vault</h2>
           <p className="text-slate-500 text-sm font-medium">Please upload a clear photo of your National ID or Passport.</p>
        </div>

        <div 
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`flex-1 border-4 border-dashed rounded-[3rem] flex flex-col items-center justify-center p-8 transition-all cursor-pointer ${formData.idImage ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100 bg-slate-50 hover:bg-slate-100'}`}
        >
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'ID')} />
          {isUploading ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
              <p className="text-xs font-black text-primary uppercase tracking-widest">Encrypting Upload...</p>
            </div>
          ) : formData.idImage ? (
            <div className="space-y-4 text-center">
              <img src={formData.idImage} className="w-48 h-32 object-cover rounded-2xl mx-auto shadow-lg" alt="ID Preview" />
              <p className="text-xs font-black text-emerald-600 uppercase">Document Securely Captured</p>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <span className="text-6xl">📸</span>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Tap to Scan ID</p>
            </div>
          )}
        </div>

        <button 
          onClick={() => handleStepComplete('Identity Verified', 2)}
          disabled={!formData.idImage || isUploading}
          className={`w-full py-5 rounded-full font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-95 ${formData.idImage && !isUploading ? 'bg-primary text-[#1d180c]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
        >
          Submit to Vault
        </button>
      </div>
    );
  }

  // --- STEP: COMMUNITY VOUCH ---
  if (step === 'COMMUNITY') {
    return (
      <div className="p-8 flex flex-col space-y-8 animate-slideUp h-full bg-background-light min-h-screen">
        <div className="space-y-2">
           <button onClick={() => setStep('CHOICE')} className="text-[10px] font-black text-slate-400 uppercase mb-2 flex items-center gap-1">
             <span className="material-symbols-outlined text-xs">arrow_back</span> Back to Options
           </button>
           <h2 className="text-3xl font-black text-slate-900 leading-tight">Community Vouch</h2>
           <p className="text-slate-500 text-sm font-medium">Who in the Wacu community can vouch for your integrity?</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reference Name</label>
            <input 
              type="text" 
              value={formData.vouchName}
              onChange={(e) => setFormData({...formData, vouchName: e.target.value})}
              placeholder="e.g. Emmanuel M."
              className="w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-primary font-bold"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reference Phone</label>
            <input 
              type="tel" 
              value={formData.vouchPhone}
              onChange={(e) => setFormData({...formData, vouchPhone: e.target.value})}
              placeholder="078..."
              className="w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-primary font-bold"
            />
          </div>
        </div>

        <div className="p-6 bg-blue-50 rounded-[2.5rem] border border-blue-100 flex items-start gap-4">
           <span className="text-2xl mt-1">🤝</span>
           <p className="text-[10px] text-blue-800 font-medium leading-relaxed">
             Our team will perform a trust verification call with your reference.
           </p>
        </div>

        <button 
          onClick={() => handleStepComplete('Community Trusted', 2)}
          disabled={!formData.vouchName.trim() || formData.vouchPhone.length < 10}
          className={`w-full py-5 rounded-full font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-95 ${formData.vouchName.trim() && formData.vouchPhone.length >= 10 ? 'bg-primary text-[#1d180c]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
        >
          Send Vouch Request
        </button>
      </div>
    );
  }

  // --- STEP: CHOICE (DEFAULT) ---
  return (
    <div className="p-6 flex flex-col space-y-8 animate-slideUp h-full bg-background-light min-h-screen">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-slate-900 leading-tight">Wacu Trust</h2>
        <p className="text-slate-500 text-sm font-medium">To protect our hosts' households, we require advanced verification.</p>
      </div>

      <div className="space-y-4">
        <button 
          onClick={() => setStep('ID_UPLOAD')}
          className="w-full flex items-center gap-5 p-5 bg-white border-2 border-slate-100 rounded-[2.5rem] hover:border-primary transition-all text-left shadow-sm active:scale-95 group"
        >
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-primary/20 transition-colors">🆔</div>
          <div className="flex-1">
            <p className="font-black text-slate-900 text-sm">National Identity</p>
            <p className="text-[10px] text-slate-400 font-medium leading-tight">Private upload to Wacu Secure Vault.</p>
          </div>
          <span className="material-symbols-outlined text-slate-300 font-bold group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>

        <button 
          onClick={() => setStep('COMMUNITY')}
          className="w-full flex items-center gap-5 p-5 bg-white border-2 border-slate-100 rounded-[2.5rem] hover:border-primary transition-all text-left shadow-sm active:scale-95 group"
        >
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-blue-100 transition-colors">🤝</div>
          <div className="flex-1">
            <p className="font-black text-slate-900 text-sm">Community Vouch</p>
            <p className="text-[10px] text-slate-400 font-medium leading-tight">A Wacu host confirms your character.</p>
          </div>
          <span className="material-symbols-outlined text-slate-300 font-bold group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
      </div>

      <div className="mt-auto p-6 bg-background-dark rounded-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="flex items-start gap-4 relative z-10">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl">🛡️</div>
          <div className="space-y-1">
            <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Wacu Secure Vault</h4>
            <p className="text-[10px] text-white/70 font-medium leading-relaxed">
              We never share your raw ID data. We only issue Trust Badges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};