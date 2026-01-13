
import React from 'react';
import { HostListingState } from '../../types';

interface Props {
  state: HostListingState;
  onUpdate: (updates: Partial<HostListingState>) => void;
  onContinue: () => void;
}

export const LocationSetup: React.FC<Props> = ({ state, onUpdate, onContinue }) => {
  return (
    <div className="p-6 flex flex-col space-y-6 animate-fadeIn h-full">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">Where is it located?</h2>
        <p className="text-slate-500 text-sm">Help guests find your place using local landmarks.</p>
      </div>

      <div className="space-y-5 flex-1 overflow-y-auto no-scrollbar">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nearest Landmark</label>
          <select 
            value={state.landmark}
            onChange={(e) => onUpdate({ landmark: e.target.value })}
            className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none text-sm"
          >
            <option value="">Select a landmark...</option>
            <option value="Amahoro Stadium">Amahoro Stadium</option>
            <option value="Kigali Heights">Kigali Heights</option>
            <option value="Musanze Market">Musanze Market</option>
            <option value="Lake Kivu Public Beach">Lake Kivu Public Beach</option>
            <option value="Custom">Custom Landmark...</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Navigation Instructions</label>
          <textarea 
            rows={2}
            value={state.locationDescription}
            onChange={(e) => onUpdate({ locationDescription: e.target.value })}
            placeholder="e.g. Turn left at the big tree after the stadium..."
            className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">What3Words (Optional)</label>
          <div className="relative">
            <span className="absolute left-4 top-4 text-amber-600 font-bold">///</span>
            <input 
              type="text"
              value={state.what3words}
              onChange={(e) => onUpdate({ what3words: e.target.value })}
              placeholder="fountain.pizza.climbing"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-mono text-sm"
            />
          </div>
        </div>

        <div className="p-6 bg-slate-50 rounded-[2rem] border border-gray-200 border-dashed flex flex-col items-center justify-center space-y-2 cursor-pointer hover:bg-slate-100 transition-colors">
          <span className="text-2xl">📍</span>
          <p className="text-xs font-bold text-slate-500">Tap to set Map Pin</p>
        </div>
      </div>

      <button
        disabled={!state.landmark || !state.locationDescription}
        onClick={onContinue}
        className={`w-full font-bold py-5 rounded-2xl transition-all active:scale-95 shadow-lg ${
          state.landmark && state.locationDescription ? 'bg-slate-900 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        Confirm location
      </button>
    </div>
  );
};
