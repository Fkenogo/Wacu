
import React, { useEffect } from 'react';

interface ProcessingViewProps {
  onFinish: () => void;
}

export const ProcessingView: React.FC<ProcessingViewProps> = ({ onFinish }) => {
  useEffect(() => {
    // Simulate payment processing time
    const timer = setTimeout(() => {
      onFinish();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-10 bg-white text-slate-900 space-y-12 animate-fadeIn">
      <div className="relative">
        {/* Modern Loader */}
        <div className="w-20 h-20 border-4 border-amber-100 border-t-amber-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-2xl">
          📱
        </div>
      </div>

      <div className="text-center space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Confirm payment for Wacu</h2>
        
        <div className="space-y-3">
          <p className="text-slate-500 text-sm max-w-[240px] mx-auto leading-relaxed">
            We've sent a request to your number. Please enter your MoMo PIN to join our community.
          </p>
          <div className="bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100 inline-block font-mono text-amber-600 font-bold">
            Waiting for PIN...
          </div>
        </div>
      </div>

      <div className="w-full max-w-xs bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-4">
        <div className="flex items-center space-x-3 text-xs text-slate-400">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="font-medium">Connection encrypted</span>
        </div>
      </div>

      <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black">Wacu Secure Pay</p>
    </div>
  );
};
