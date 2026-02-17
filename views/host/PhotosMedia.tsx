
import React, { useState, useRef } from 'react';
import { HostListingState } from '../../types';
import { uploadImage } from '../../firebase';

interface Props {
  state: HostListingState;
  onUpdate: (updates: Partial<HostListingState>) => void;
  onContinue: () => void;
}

export const PhotosMedia: React.FC<Props> = ({ state, onUpdate, onContinue }) => {
  const [activeTip, setActiveTip] = useState<number | null>(0);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const targetIndexRef = useRef<number>(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const index = targetIndexRef.current;
    try {
      setUploadingIndex(index);
      const listingId = state.id || `pending_${Date.now()}`;
      if (!state.id) onUpdate({ id: listingId });

      const fileName = `gallery_${index}_${Date.now()}_${file.name}`;
      const path = `listings/${listingId}/${fileName}`;
      
      const downloadUrl = await uploadImage(file, path);
      
      const newPhotos = [...state.photos];
      newPhotos[index] = downloadUrl;
      onUpdate({ photos: newPhotos });
    } catch (err) {
      console.error("Gallery upload failed", err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingIndex(null);
      // Reset input value so same file can be uploaded again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const triggerUpload = (index: number) => {
    if (uploadingIndex !== null) return;
    targetIndexRef.current = index;
    fileInputRef.current?.click();
  };

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
    }
  ];

  const PhotoSlot = ({ index, label }: { index: number, label: string }) => {
    const isUploading = uploadingIndex === index;
    const photoUrl = state.photos[index];

    return (
      <div 
        onClick={() => triggerUpload(index)}
        className={`aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group ${
          photoUrl 
            ? 'border-amber-400 bg-amber-50' 
            : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
        }`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-1">
            <div className="w-6 h-6 border-2 border-amber-100 border-t-amber-500 rounded-full animate-spin"></div>
            <span className="text-[8px] font-black text-amber-600 uppercase tracking-widest">Wait...</span>
          </div>
        ) : photoUrl ? (
          <img src={photoUrl} className="w-full h-full object-cover" alt={`Slot ${index}`} />
        ) : (
          <>
            <span className="text-3xl opacity-40 group-hover:opacity-100 transition-opacity">
              {index === 0 ? '📸' : '➕'}
            </span>
            <p className={`text-[10px] font-black uppercase tracking-widest ${index === 0 ? 'text-amber-600' : 'text-gray-400'}`}>
              {label}
            </p>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 flex flex-col space-y-8 animate-fadeIn h-full overflow-y-auto no-scrollbar pb-24">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-900 leading-tight">Showcase Your Wacu</h2>
        <p className="text-slate-500 text-sm font-medium">Add at least 3 high-quality photos to build community trust.</p>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Upload Grid */}
      <div className="grid grid-cols-2 gap-4">
        <PhotoSlot index={0} label="Main Photo" />
        <PhotoSlot index={1} label="Living Room" />
        <PhotoSlot index={2} label="Bedroom" />
        <PhotoSlot index={3} label="Bathroom" />
      </div>

      {/* Photography Tips Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Photography Masterclass</h3>
          <span className="text-[9px] font-black text-amber-500 uppercase">Pro-Tips</span>
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
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{tip.text}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
        <div className="space-y-1 relative z-10 text-center">
          <h4 className="text-base font-black uppercase tracking-tighter text-amber-400">Capture the "Wacu" Soul</h4>
          <p className="text-[10px] text-slate-400 font-medium">What makes your place home? Garden? Views?</p>
        </div>
      </div>

      <button
        onClick={onContinue}
        disabled={state.photos.filter(Boolean).length < 3 || uploadingIndex !== null}
        className={`w-full bg-slate-900 text-white font-black py-6 rounded-[2rem] shadow-2xl transition-all uppercase tracking-[0.2em] text-xs ${
          state.photos.filter(Boolean).length >= 3 && uploadingIndex === null
            ? 'active:scale-95 hover:bg-slate-800'
            : 'opacity-50 cursor-not-allowed'
        }`}
      >
        {state.photos.filter(Boolean).length < 3 ? `Upload ${3 - state.photos.filter(Boolean).length} more photos` : 'Lock in My Wacu Photos!'}
      </button>
    </div>
  );
};
