
import React, { useState } from 'react';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);

  const slides = [
    {
      title: "Yambi!",
      subtitle: "Discover authentic stays.",
      description: "Experience the warmth of African hospitality. Stay in real homes hosted by real people, and discover the soul of the continent.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbUWR4H_JO3rq9EqonsyLrQO-GG64AogBUAvkTCDxflCbXVH0UKteYc630-vX8TVJcKeMVfS1K_BXpZFHSQ_6s-O3WKVB8pqDf6JsrpvqIRohBZz6FqfEnoYGof2V07tjincKpu7tZ40hjsl0N0C-XGdFtRtvxOVRvOXHxQqBDQLX-xk90WEhnWU6uvKh0oEHhsbFG8i5zhTLmzCnqk5ii-Ook4hEBxk4CD9u-g27KXHIoBOiQHZiRg-PXaYhAEMq0VfH57KHycNmi"
    },
    {
      title: "Find a Wacu",
      subtitle: "Your home anywhere.",
      description: "Choose how you want to stay. With a local host, or with space to yourself. Every Wacu is unique.",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800"
    },
    {
      title: "Trust is Wacu",
      subtitle: "Stay with confidence.",
      description: "Hosts and guests verify themselves. Everyone knows who they’re welcoming into their home through our trust baseline.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800"
    }
  ];

  const currentSlide = slides[step - 1];

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
      <header className="flex items-center justify-between p-6 z-10">
        <button 
          onClick={onComplete}
          className="flex size-12 items-center justify-start text-slate-900 active:scale-90 transition-transform"
        >
          <span className="material-symbols-outlined text-2xl font-bold">close</span>
        </button>
        <div className="flex-1 text-center">
          <span className="text-xl font-black tracking-tight text-slate-900">Wacu</span>
        </div>
        <div className="size-12"></div>
      </header>

      <main className="flex flex-col flex-1">
        <div className="px-6">
          <div className="relative w-full aspect-[4/5] overflow-hidden rounded-[3rem] shadow-sm">
            <div 
              className="absolute inset-0 bg-center bg-no-repeat bg-cover transition-all duration-700 ease-in-out" 
              style={{ backgroundImage: `url("${currentSlide.image}")` }}
            ></div>
          </div>
        </div>

        <div className="flex flex-col items-center px-8 pt-10 pb-6 text-center space-y-4">
          <div className="space-y-1">
            <h1 className="text-slate-900 text-4xl font-black leading-tight tracking-tight">
              {currentSlide.title}
            </h1>
            <h2 className="text-primary text-4xl font-black leading-tight tracking-tight">
              {currentSlide.subtitle}
            </h2>
          </div>
          
          <p className="text-slate-600 text-[17px] font-medium max-w-sm leading-relaxed px-2">
            {currentSlide.description}
          </p>

          <div className="flex items-center justify-center gap-2 pt-6">
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${step === i ? 'w-6 bg-primary' : 'w-2 bg-primary/20'}`}
              ></div>
            ))}
          </div>
        </div>

        <div className="mt-auto px-6 pb-12 w-full max-w-md mx-auto space-y-4">
          <button 
            onClick={() => step < 3 ? setStep(step + 1) : onComplete()}
            className="flex h-16 w-full items-center justify-center gap-2 rounded-full bg-primary text-slate-900 text-lg font-black shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
          >
            <span>{step === 3 ? 'Get Started' : 'Next'}</span>
            <span className="material-symbols-outlined text-2xl font-black">arrow_forward</span>
          </button>
          
          <button 
            onClick={onComplete}
            className="w-full text-center text-slate-400 font-bold text-sm hover:text-primary transition-colors active:opacity-60"
          >
            Skip for now
          </button>
        </div>
      </main>
    </div>
  );
};
