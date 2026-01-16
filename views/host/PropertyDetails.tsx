
import React, { useState, useRef } from 'react';
import { HostListingState } from '../../types';

interface Props {
  state: HostListingState;
  onUpdate: (updates: Partial<HostListingState>) => void;
  onContinue: () => void;
}

export const PropertyDetails: React.FC<Props> = ({ state, onUpdate, onContinue }) => {
  const [nameTouched, setNameTouched] = useState(false);
  const [descTouched, setDescTouched] = useState(false);
  const [howTouched, setHowTouched] = useState(false);
  const [photoTouched, setPhotoTouched] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isNameInvalid = nameTouched && !state.name.trim();
  const isDescInvalid = descTouched && !state.description.trim();
  const isHowInvalid = howTouched && !state.howToGetThere.trim();
  const isPhotoInvalid = photoTouched && !state.photos[0];

  const handleContinue = () => {
    // Force show all errors if user attempts to skip
    setNameTouched(true);
    setDescTouched(true);
    setHowTouched(true);
    setPhotoTouched(true);

    if (state.name.trim() && state.description.trim() && state.howToGetThere.trim() && state.photos[0]) {
      onContinue();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const newPhotos = [...state.photos];
        newPhotos[0] = result;
        onUpdate({ photos: newPhotos });
        setPhotoTouched(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const privacyOptions = [
    { id: 'Entire Place', label: 'Entire Place', desc: 'Guests have the whole Wacu to themselves.', icon: '🔑' },
    { id: 'Private Room', label: 'Private Room', desc: 'Guests have their own room but share other spaces.', icon: '🚪' },
    { id: 'Shared Room', label: 'Shared Room', desc: 'Guests stay in a bedroom or common area shared with others.', icon: '🤝' }
  ];

  const interactionOptions = [
    { label: 'I give guests privacy', desc: 'I give guests their complete space and privacy.', icon: '🤫' },
    { label: 'I love sharing meals', desc: 'I love sharing meals, stories, and local coffee.', icon: '☕' },
    { label: 'I offer local tours', desc: 'I enjoy taking guests on tours or teaching crafts.', icon: '🗺️' },
    { label: 'I am available if needed', desc: 'I am nearby and responsive to any questions.', icon: '📱' }
  ];

  return (
    <div className="p-6 flex flex-col space-y-6 animate-fadeIn h-full">
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-slate-900 leading-tight">Make Your Wacu Shine</h2>
        <p className="text-slate-500 text-sm font-medium">Define the space and hosting style that makes your Wacu unique.</p>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar pb-10">
        {/* Main Photo Upload Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Main Wacu Photo</label>
            <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase">Must Have</span>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          
          <div 
            onClick={triggerUpload}
            className={`w-full aspect-video rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group ${
              state.photos[0] 
                ? 'border-amber-400 bg-amber-50' 
                : isPhotoInvalid 
                  ? 'border-red-400 bg-red-50' 
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
            }`}
          >
            {state.photos[0] ? (
              <>
                <img src={state.photos[0]} className="w-full h-full object-cover" alt="Preview" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <p className="text-white text-xs font-black uppercase tracking-widest bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">Change Photo</p>
                </div>
              </>
            ) : (
              <div className="text-center p-6">
                <span className="text-4xl mb-2 block animate-bounce">📸</span>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Tap to Upload Wacu Magic</p>
              </div>
            )}
          </div>
          {isPhotoInvalid && <p className="text-[10px] text-red-500 font-black ml-1 uppercase">EVERY WACU NEEDS A PHOTO!</p>}
        </div>

        {/* Privacy & Space Selector */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Privacy & Space</label>
          <div className="grid grid-cols-1 gap-3">
            {privacyOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onUpdate({ roomType: opt.id })}
                className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                  state.roomType === opt.id 
                    ? 'border-amber-500 bg-amber-50 ring-4 ring-amber-500/5' 
                    : 'border-gray-100 bg-white hover:border-gray-200 shadow-sm'
                }`}
              >
                <span className="text-2xl mt-1">{opt.icon}</span>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-sm">{opt.label}</p>
                  <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">{opt.desc}</p>
                </div>
                {state.roomType === opt.id && (
                  <div className="w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-[10px] shrink-0 font-black shadow-sm">✓</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Name Input */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">GIVE YOUR WACU A CATCHY NAME</label>
          <input 
            type="text"
            value={state.name}
            onBlur={() => setNameTouched(true)}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="e.g. The Secret Hillside Haven"
            className={`w-full px-5 py-4 bg-white rounded-2xl border-2 outline-none transition-all font-bold ${
              isNameInvalid ? 'border-red-400 focus:border-red-500 bg-red-50/20 ring-4 ring-red-400/5' : 'border-gray-100 focus:border-amber-400 shadow-sm'
            }`}
          />
          {isNameInvalid && (
            <div className="flex items-center gap-1.5 ml-1 animate-fadeIn">
               <span className="text-red-500 text-xs">⚠️</span>
               <p className="text-[10px] text-red-500 font-black uppercase tracking-tight">Wait! Your Wacu Needs a Name to Stand Out!</p>
            </div>
          )}
        </div>

        {/* Description Input */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Why Will Guests Obsess Over This Wacu?</label>
          <textarea 
            rows={4}
            value={state.description}
            onBlur={() => setDescTouched(true)}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Tell the story that makes them hit 'Reserve' instantly..."
            className={`w-full px-5 py-4 bg-white rounded-2xl border-2 outline-none transition-all resize-none font-medium text-sm leading-relaxed ${
              isDescInvalid ? 'border-red-400 focus:border-red-500 bg-red-50/20 ring-4 ring-red-400/5' : 'border-gray-100 focus:border-amber-400 shadow-sm'
            }`}
          />
          {isDescInvalid && <p className="text-[10px] text-red-500 font-black ml-1 uppercase">Share the story of your Wacu!</p>}
        </div>

        {/* Instructions Input */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">The Secret Path to Your Wacu Door</label>
          <textarea 
            rows={3}
            value={state.howToGetThere}
            onBlur={() => setHowTouched(true)}
            onChange={(e) => onUpdate({ howToGetThere: e.target.value })}
            placeholder="Share landmarks only locals know..."
            className={`w-full px-5 py-4 bg-white rounded-2xl border-2 outline-none transition-all resize-none font-medium text-sm leading-relaxed ${
              isHowInvalid ? 'border-red-400 focus:border-red-500 bg-red-50/20 ring-4 ring-red-400/5' : 'border-gray-100 focus:border-amber-400 shadow-sm'
            }`}
          />
          {isHowInvalid && <p className="text-[10px] text-red-500 font-black ml-1 uppercase">Help guests find their next stay!</p>}
        </div>
      </div>

      <button
        onClick={handleContinue}
        className="w-full bg-slate-900 text-white font-black py-5 rounded-[1.5rem] shadow-2xl active:scale-95 transition-all uppercase tracking-[0.2em] text-xs hover:bg-slate-800"
      >
        PIN YOUR WACU ON THE MAP!
      </button>
    </div>
  );
};
