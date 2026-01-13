
import React from 'react';
import { HostListingState } from '../../types';

interface Props {
  state: HostListingState;
  onUpdate: (updates: Partial<HostListingState>) => void;
  onContinue: () => void;
}

const AMENITY_OPTIONS = [
  { id: 'wifi', label: 'Wi-Fi', icon: '📶' },
  { id: 'kitchen', label: 'Kitchen', icon: '🍳' },
  { id: 'shower', label: 'Hot Shower', icon: '🚿' },
  { id: 'security', label: 'Security', icon: '🛡️' },
  { id: 'solar', label: 'Solar Power', icon: '☀️' },
  { id: 'mosquito_net', label: 'Mosquito Net', icon: '🕸️' },
  { id: 'breakfast', label: 'Breakfast', icon: '☕' },
  { id: 'laundry', label: 'Laundry', icon: '🧺' },
  { id: 'workspace', label: 'Workspace', icon: '💻' },
  { id: 'water_tank', label: 'Water Tank', icon: '🚰' },
  { id: 'garden', label: 'Garden/Yard', icon: '🌿' },
];

export const AmenitiesRules: React.FC<Props> = ({ state, onUpdate, onContinue }) => {
  const toggleAmenity = (id: string) => {
    const next = state.amenities.includes(id) 
      ? state.amenities.filter(a => a !== id)
      : [...state.amenities, id];
    onUpdate({ amenities: next });
  };

  const getRuleLabel = (key: string) => {
    switch (key) {
      case 'smoking': return 'Smoking Allowed indoors?';
      case 'pets': return 'Pets Allowed?';
      case 'curfew': return 'Night Curfew?';
      default: return `${key} Allowed?`;
    }
  };

  return (
    <div className="p-6 flex flex-col space-y-8 animate-fadeIn h-full">
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900">What amenities do you have?</h3>
          <p className="text-xs text-slate-500">Select everything that applies to your space.</p>
        </div>
        <div className="flex flex-wrap gap-2 max-h-[40vh] overflow-y-auto no-scrollbar pb-4 pr-1">
          {AMENITY_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => toggleAmenity(opt.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-2xl border transition-all ${
                state.amenities.includes(opt.id)
                  ? 'bg-amber-500 border-amber-500 text-white shadow-md'
                  : 'bg-white border-gray-100 text-slate-600 shadow-sm'
              }`}
            >
              <span className="text-lg">{opt.icon}</span>
              <span className="text-xs font-bold whitespace-nowrap">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900">House Rules</h3>
          <p className="text-xs text-slate-500">Set clear expectations for your guests.</p>
        </div>
        <div className="space-y-3">
          {Object.entries(state.rules).map(([key, val]) => (
            <div key={key} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex flex-col">
                <span className="font-bold text-slate-700 text-sm">
                  {key === 'smoking' ? 'No Smoking indoors' : getRuleLabel(key)}
                </span>
                <p className="text-[10px] text-gray-400 font-medium">
                  {key === 'smoking' 
                    ? (val ? 'Guests can smoke inside' : 'Smoking is strictly outdoors only')
                    : `Toggle to ${val ? 'disable' : 'enable'} this rule`}
                </p>
              </div>
              <button
                onClick={() => onUpdate({ rules: { ...state.rules, [key]: !val } })}
                className={`w-12 h-6 rounded-full transition-colors relative ${val ? 'bg-emerald-500' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${val ? 'left-7' : 'left-1 shadow-sm'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1" />

      <button
        onClick={onContinue}
        className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl shadow-lg active:scale-95 transition-all sticky bottom-0"
      >
        Next: Photos
      </button>
    </div>
  );
};
