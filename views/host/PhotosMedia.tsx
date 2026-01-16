
import React, { useState } from 'react';
import { HostListingState } from '../../types';

interface Props {
  state: HostListingState;
  onUpdate: (updates: Partial<HostListingState>) => void;
  onContinue: () => void;
}

export const PhotosMedia: React.FC<Props> = ({ state, onUpdate, onContinue }) => {
  const [activeTip, setActiveTip] = useState<number | null>(0);

  const tips = [
    {
      icon: '☀️',
      title: 'Harness Natural Light',
      text: 'Open all curtains and doors. The best photos are taken during the "Golden Hour" (just after sunrise or before sunset). Avoid using flash.',
      tag: 'Lighting'
    },
    {
      icon: '🛌',
      title: 'The Comfort Close-up',
      text: 'For Rwandan guests, the bed is the most important part. Show clean, well-made beds with tidy mosquito nets if applicable.',
      tag: 'Reliability'
    },
    {
      icon: '🚿',
      title: 'Prove the Amenities',
      text: 'Trust is built through transparency. Take clear shots of the shower, solar panels, water tanks, or your secure gated entrance.',
      tag: 'Trust'
    },
    {
      icon: '⛰️',
      title: 'Capture the "Wacu" Soul',
      text: 'What makes your place home? Photograph the garden, the view of the hills, or unique Rwandan art in your living room.',
      tag: 'Uniqueness'
    }
  ];

  const checklist = [
    { id: 'bedroom', label: 'Tidy Bedroom', icon: '🛏️' },
    { id: 'bathroom', label: 'Clean Bathroom', icon: '🧼' },
    { id: 'outside', label: 'Outside View', icon: '🏡' },
    { id: 'landmark', label: 'Nearby Landmark', icon: '📍' },
  ];

  return (
    <div className="p-6 flex flex-col space-y-8 animate-fadeIn h-full overflow-y-auto no-scrollbar pb-24">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-900 leading-tight">Showcase Your Wacu</h2>
        <p className="text-slate-500 text-sm font-medium">Add at least 3 high-quality photos to build community trust.</p>
      </div>

      {/* Upload Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="aspect-square bg-white rounded-3xl border-2 border-dashed border-amber-400 flex flex-col items-center justify-center space-y-2 cursor-pointer active:scale-95 transition-all shadow-sm group">
          <span className="text-3xl group-hover:scale-110 transition-transform">📸</span>
          <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Main Photo</p>
        </div>
        <div className="aspect-square bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center space-y-2 cursor-pointer active:scale-95 transition-all group">
          <span className="text-3xl opacity-40 group-hover:opacity-100 transition-opacity">➕</span>
          <p className="text-[10px] font-bold text-gray-400 uppercase">Room 1</p>
        </div>
        <div className="aspect-square bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center space-y-2 cursor-pointer active:scale-95 transition-all group">
          <span className="text-3xl opacity-40 group-hover:opacity-100 transition-opacity">➕</span>
          <p className="text-[10px] font-bold text-gray-400 uppercase">Bathroom</p>
        </div>
        <div className="aspect-square bg-slate-900 rounded-3xl flex flex-col items-center justify-center space-y-2 cursor-pointer active:scale-95 transition-all text-white shadow-lg">
          <span className="text-3xl animate-pulse">🎥</span>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Video Tour</p>
        </div>
      </div>

      {/* Photography Tips Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Photography Masterclass</h3>
          <span className="text-[9px] font-black text-amber-500 uppercase">Tap for Pro-Tips</span>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {tips.map((tip, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTip(idx)}
              className={`shrink-0 w-64 p-5 rounded-[2rem] border-2 transition-all text-left space-y-3 ${
                activeTip === idx 
                  ? 'bg-white border-amber-400 shadow-xl ring-4 ring-amber-400/5 scale-[1.02]' 
                  : 'bg-slate-50 border-transparent opacity-60'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm border border-gray-50">
                  {tip.icon}
                </div>
                <span className="text-[8px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                  {tip.tag}
                </span>
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-tight">{tip.title}</h4>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                  {tip.text}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Checklist Section */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
        <div className="space-y-1 relative z-10">
          <h4 className="text-base font-black uppercase tracking-tighter">Wacu Photo Checklist</h4>
          <p className="text-[10px] text-slate-400 font-medium">Double-check your angles before you submit.</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 relative z-10">
          {checklist.map((item) => (
            <div key={item.id} className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl">
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-tight text-slate-300">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
        <span className="text-xl">💡</span>
        <p className="text-xs text-amber-800 leading-relaxed font-medium">
          Note: Bright, clear photos reduce guest inquiries and increase your booking rate by up to <span className="font-black">40%</span>.
        </p>
      </div>

      <button
        onClick={onContinue}
        className="w-full bg-slate-900 text-white font-black py-6 rounded-[2rem] shadow-2xl active:scale-95 transition-all sticky bottom-0 z-10 uppercase tracking-[0.2em] text-xs hover:bg-slate-800"
      >
        Lock in My Wacu Photos!
      </button>
    </div>
  );
};
