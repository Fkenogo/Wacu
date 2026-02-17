
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
    <div className="min-h-screen flex flex-col bg-background-light font-display">
      <header className="flex items-center justify-between p-6 bg-background-light sticky top-0 z-10">
        <button 
          onClick={onBack}
          className="size-12 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors"
        >
          <span className="material-symbols-outlined text-slate-900 font-bold">arrow_back</span>
        </button>
        <h1 className="text-slate-900 text-lg font-black leading-tight flex-1 text-center pr-12">Access Portal</h1>
      </header>

      <main className="flex-1 max-w-[480px] mx-auto w-full px-6 flex flex-col">
        <div className="mt-4 mb-8">
          <div 
            className="w-full aspect-video rounded-[2.5rem] bg-center bg-no-repeat bg-cover shadow-sm border border-primary/10" 
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA3X-2dQCtC5kKU6enCIVaSN2jvqqbBuQk_fqBBLUTtwiC-2QVShIlxMiN01VJ-9C2S3RQ-DxAptMVV0pnyXwdi9GHRLg1sx_1nAMZep3WMvmiinVFk9bSqE3pEC_2KWq9P2NhdvoS21Xc38MDUgwf8GPfCE9kB78gownusd8nZR9vEa6-P_tFaaF061ZcolHJHOacxUG4nSBi_whVKOiYr4sBo_aIV6GvJkDsWvEJ38njH0224Zxc_1FLAqHA4gH39zHN243Y6ZKXE")' }}
          ></div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-slate-900 text-[28px] font-black leading-tight mb-3">
            {step === 'PHONE' ? 'Welcome to Wacu' : 'Check Your SMS'}
          </h2>
          <p className="text-slate-500 text-base font-medium">
            {step === 'PHONE' 
              ? 'Enter your mobile money number to continue securely.' 
              : `We sent a 6-digit code to ${phoneNumber}.`}
          </p>
        </div>

        <div className="space-y-6">
          {step === 'PHONE' ? (
            <div className="group">
              <label className="block text-slate-900 text-sm font-black uppercase tracking-widest mb-3 ml-1">Mobile Number</label>
              <div className="relative flex items-center">
                <div className="absolute left-4 flex items-center gap-2 pr-3 border-r border-slate-100">
                  <img alt="Rwanda Flag" className="w-6 h-4 rounded-sm object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaKtFmNnkYRjesLDaADI64kiszhbhGA-UBqojgcH5PaHZOenopI8rRTfkes3ES9OC0xjx_AZaEX95Ja1CWt9bnn1H3E38Xl-ZObDRQKQyV3Em9q0yH-xM6OT8KSG3A-MtrBmmuGudwXEzpQwlNSqxrgwnVw9-YndyaxgJuOLUMG9bM-Mz5S6R6CltoJU6wksEB7_Hfu0UuWO_qr48M1YBpLXtqEXdGJO3z99tUsGyQaxkNlgeJWtO52ZJ3I3K7zh2CfYs7H9LYM_GH"/>
                  <span className="text-slate-900 font-bold">+250</span>
                </div>
                <input 
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-28 pr-4 h-16 rounded-2xl border border-slate-100 bg-white text-slate-900 text-lg font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" 
                  placeholder="78X XXX XXX"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <input 
                type="tel"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full px-6 h-16 bg-white border border-slate-100 rounded-2xl text-3xl font-black tracking-[0.5em] text-center outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
              />
              <button 
                onClick={() => setStep('PHONE')}
                className="w-full text-sm font-black text-primary uppercase tracking-widest text-center"
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
            <div className="p-5 bg-primary/5 rounded-2xl border border-primary/20 animate-slideDown shadow-sm">
              <div className="flex items-center gap-3 mb-3 text-primary">
                <span className="material-symbols-outlined font-black">bolt</span>
                <p className="text-[10px] font-black uppercase tracking-widest">Admin Access</p>
              </div>
              <button 
                onClick={handleDevBypass}
                className="w-full bg-primary text-slate-900 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all"
              >
                Launch Admin Bypass
              </button>
            </div>
          )}

          <button
            disabled={loading || (step === 'PHONE' && phoneNumber.length < 8) || (step === 'OTP' && otp.length < 6)}
            onClick={step === 'PHONE' ? handleSendOtp : handleVerifyOtp}
            className={`w-full h-16 rounded-full font-black shadow-lg transition-all flex items-center justify-center gap-2 text-lg active:scale-[0.98] ${
              loading ? 'bg-slate-100 text-slate-400' : 'bg-primary text-slate-900 shadow-primary/20'
            }`}
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-slate-900/10 border-t-slate-900 rounded-full animate-spin"></div>
            ) : (
              <>
                <span>{step === 'PHONE' ? 'Get Verification Code' : 'Verify Identity'}</span>
                <span className="material-symbols-outlined font-black">chevron_right</span>
              </>
            )}
          </button>

          <div className="text-center px-4">
            <p className="text-slate-400 text-xs leading-relaxed font-medium">
              {step === 'PHONE' 
                ? "By tapping 'Get Verification Code', you will receive a 6-digit SMS code. Standard operator messaging rates may apply."
                : "Didn't get a code? Tap to resend."}
            </p>
          </div>
        </div>

        <footer className="mt-auto py-10 flex flex-col items-center gap-6">
          <div className="flex items-center gap-6 text-sm font-black uppercase tracking-widest text-primary">
            <a className="hover:underline" href="#">Terms</a>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-100"></div>
            <a className="hover:underline" href="#">Help</a>
          </div>
          <div className="flex items-center gap-2 text-slate-300 text-xs font-bold uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm font-bold">lock</span>
            <span>Securely powered by Wacu Digital</span>
          </div>
          <div className="h-2 w-32 bg-slate-100 rounded-full mx-auto mb-2 shrink-0"></div>
        </footer>
      </main>
    </div>
  );
};
