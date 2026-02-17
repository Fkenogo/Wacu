
import React, { useState, useEffect } from 'react';
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '../firebase';

interface Props {
  onSuccess: (user: any) => void;
  onBack: () => void;
}

const BYPASS_KEY = 'WACU_BYPASS_SESSION';

export const LoginView: React.FC<Props> = ({ onSuccess, onBack }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdminNumber = phoneNumber === '794003947' || phoneNumber === '0794003947' || phoneNumber === '+250794003947';

  useEffect(() => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {
          // reCAPTCHA solved
        }
      });
    }
  }, []);

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 8) {
      setError("Please enter a valid phone number.");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const formattedPhone = phoneNumber.startsWith('+') 
        ? phoneNumber 
        : `+250${phoneNumber.replace(/^0/, '')}`;
        
      const appVerifier = (window as any).recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setStep('OTP');
    } catch (err: any) {
      console.error(err);
      setError(`Auth Error: ${err.code || err.message}. Please use Admin Bypass for testing.`);
      if ((window as any).recaptchaVerifier && (window as any).grecaptcha) {
        (window as any).recaptchaVerifier.render().then((widgetId: any) => {
          (window as any).grecaptcha.reset(widgetId);
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDevBypass = () => {
    setLoading(true);
    const mockUser = {
      uid: `admin_${phoneNumber.replace(/\D/g, '')}`,
      phoneNumber: `+250${phoneNumber.replace(/^0/, '').replace(/\D/g, '')}`,
      email: 'fredkenogo@gmail.com'
    };
    
    localStorage.setItem(BYPASS_KEY, JSON.stringify(mockUser));
    
    setTimeout(() => {
      onSuccess(mockUser);
    }, 1000);
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return;
    setLoading(true);
    setError(null);
    try {
      const result = await confirmationResult.confirm(otp);
      onSuccess(result.user);
    } catch (err: any) {
      setError("Invalid verification code. Please check your SMS.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-8 space-y-10 animate-fadeIn h-full bg-white">
      <div className="space-y-3 pt-12">
        <button onClick={onBack} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">← Back</button>
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">
          {step === 'PHONE' ? 'Join WACU' : 'Check Your SMS'}
        </h2>
        <p className="text-slate-500 font-medium leading-relaxed">
          {step === 'PHONE' 
            ? 'Enter your Mobile Money phone number to sign in.' 
            : `We sent a 6-digit code to ${phoneNumber}.`}
        </p>
      </div>

      <div className="space-y-6">
        {step === 'PHONE' ? (
          <div className="space-y-4">
            <div className="relative">
               <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400">+250</span>
               <input 
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value.replace(/\D/g, ''));
                  setError(null);
                }}
                placeholder="794 003 947"
                className="w-full pl-20 pr-6 py-6 bg-gray-50 border-2 border-gray-100 rounded-3xl text-xl font-black outline-none focus:border-amber-400 transition-all shadow-inner"
               />
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center px-4">
              We'll send an SMS code to verify. Carrier rates may apply.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <input 
              type="tel"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full px-6 py-6 bg-gray-50 border-2 border-gray-100 rounded-3xl text-3xl font-black tracking-[0.5em] text-center outline-none focus:border-amber-400 transition-all shadow-inner"
            />
            <button 
              onClick={() => setStep('PHONE')}
              className="w-full text-[10px] font-black text-amber-600 uppercase tracking-widest"
            >
              Change Phone Number
            </button>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl animate-shake">
            <p className="text-[10px] text-red-600 font-black uppercase tracking-tight text-center">{error}</p>
          </div>
        )}

        {isAdminNumber && step === 'PHONE' && (
          <div className="p-5 bg-amber-50 rounded-[2.5rem] border border-amber-200 animate-slideDown shadow-xl shadow-amber-500/10">
             <div className="flex items-center gap-3 mb-3">
               <span className="text-xl">🛠️</span>
               <p className="text-[10px] font-black text-amber-900 uppercase">Admin Access Protocol</p>
             </div>
             <p className="text-xs text-amber-800 leading-tight mb-4 font-medium">Bypass SMS verification for immediate access to the HQ.</p>
             <button 
               onClick={handleDevBypass}
               className="w-full bg-amber-500 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-amber-400/30 active:scale-95 transition-all"
             >
               Launch Admin Bypass
             </button>
          </div>
        )}
      </div>

      <button
        disabled={loading || (step === 'PHONE' && phoneNumber.length < 8) || (step === 'OTP' && otp.length < 6)}
        onClick={step === 'PHONE' ? handleSendOtp : handleVerifyOtp}
        className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
          loading ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white shadow-slate-200'
        }`}
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>
        ) : (
          step === 'PHONE' ? 'Send Code' : 'Verify Identity'
        )}
      </button>

      <div className="mt-auto p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
         <div className="flex gap-4">
           <span className="text-2xl">🛡️</span>
           <div className="space-y-1">
             <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">WACU Trust Protocol</h4>
             <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Your phone number is your identity. We never share it without consent.</p>
           </div>
         </div>
      </div>
    </div>
  );
};
