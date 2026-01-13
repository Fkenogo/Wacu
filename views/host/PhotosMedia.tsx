
import React from 'react';
import { HostListingState } from '../../types';

interface Props {
  state: HostListingState;
  onUpdate: (updates: Partial<HostListingState>) => void;
  onContinue: () => void;
}

export const PhotosMedia: React.FC<Props> = ({ state, onUpdate, onContinue }) => {
  return (
    <div className="p-6 flex flex-col space-y-6 animate-fadeIn h-full">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">Showcase your space</h2>
        <p className="text-slate-500 text-sm">Add at least 3 photos to help guests trust your listing.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1">
        <div className="aspect-square bg-gray-100 rounded-3xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center space-y-2 cursor-pointer active:scale-95 transition-all">
          <span className="text-3xl">📸</span>
          <p className="text-[10px] font-bold text-gray-400 uppercase">Main Photo</p>
        </div>
        <div className="aspect-square bg-gray-100 rounded-3xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center space-y-2 cursor-pointer active:scale-95 transition-all">
          <span className="text-3xl">➕</span>
          <p className="text-[10px] font-bold text-gray-400 uppercase">Add Photo</p>
        </div>
        <div className="aspect-square bg-gray-100 rounded-3xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center space-y-2 cursor-pointer active:scale-95 transition-all">
          <span className="text-3xl">➕</span>
        </div>
        <div className="aspect-square bg-slate-900 rounded-3xl flex flex-col items-center justify-center space-y-2 cursor-pointer active:scale-95 transition-all text-white">
          <span className="text-3xl">🎥</span>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Video Walkthru</p>
        </div>
      </div>

      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
        <p className="text-xs text-amber-800 leading-relaxed font-medium">
          💡 Tip: Bright, clear photos of the bed and bathroom are most important for Rwandan guests.
        </p>
      </div>

      <button
        onClick={onContinue}
        className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl shadow-lg active:scale-95 transition-all"
      >
        Next
      </button>
    </div>
  );
};
