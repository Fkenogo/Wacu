
import React, { useState } from 'react';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-8 animate-fadeIn">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center text-5xl">🌍</div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Yambi.</h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                Wacu lets you stay in real homes, hosted by real people.
              </p>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-8 animate-fadeIn">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-5xl">🏠</div>
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Find a Wacu</h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                Choose how you want to stay.<br/>
                With a host, or with space to yourself.
              </p>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-8 animate-fadeIn">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-5xl">🛡️</div>
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Trust matters here</h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                Hosts and guests verify themselves.<br/>
                Everyone knows who they’re welcoming.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {renderStep()}
      
      <div className="p-10 space-y-6">
        <div className="flex justify-center gap-2">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${step === i ? 'w-8 bg-amber-500' : 'w-2 bg-slate-200'}`} 
            />
          ))}
        </div>
        
        <button 
          onClick={() => step < 3 ? setStep(step + 1) : onComplete()}
          className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl active:scale-95 transition-all uppercase tracking-widest text-xs"
        >
          {step === 3 ? 'Get Started' : 'Next'}
        </button>
      </div>
    </div>
  );
};
