
import React from 'react';
import { HostListingState, ListingTag } from '../../types';
import { LISTING_TAGS } from '../../constants';

interface Props {
  state: HostListingState;
  onUpdate: (updates: Partial<HostListingState>) => void;
  onContinue: () => void;
}

const TAG_DETAILS: Record<ListingTag, { icon: string, desc: string }> = {
  'Host lives on site': { icon: '👋', desc: 'You will be present to personally welcome and guide your guests.' },
  'Meals available': { icon: '🍲', desc: 'You offer breakfast, lunch, or dinner (optional or included).' },
  'Family-friendly': { icon: '👨‍👩‍👧', desc: 'Safe for children, with appropriate sleeping arrangements.' },
  'Rural setting': { icon: '🌳', desc: 'Away from the city noise, immersed in nature or village life.' },
  'Near national park': { icon: '🦍', desc: 'Close to Akagera, Nyungwe, or Volcanoes National Park.' },
  'Off-grid / solar': { icon: '☀️', desc: 'Eco-friendly setup using solar power or traditional water systems.' },
  'Long-stay friendly': { icon: '📅', desc: 'Discounts and amenities suitable for guests staying 2+ weeks.' },
  'Group-friendly': { icon: '🤝', desc: 'Common areas and room setups perfect for large groups or retreats.' }
};

export const PropertyTagsSelection: React.FC<Props> = ({ state, onUpdate, onContinue }) => {
  const toggleTag = (tag: ListingTag) => {
    const nextTags = state.tags.includes(tag)
      ? state.tags.filter(t => t !== tag)
      : [...state.tags, tag];
    onUpdate({ tags: nextTags });
  };

  return (
    <div className="p-6 flex flex-col space-y-6 animate-fadeIn h-full">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-900 leading-tight">Refine your stay</h2>
        <p className="text-slate-500 text-sm font-medium">Select any tags that describe the specific experience you offer. (Optional)</p>
      </div>

      <div className="grid grid-cols-1 gap-4 flex-1 overflow-y-auto pr-1 no-scrollbar pb-10">
        {LISTING_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`flex items-center gap-5 text-left p-5 rounded-[2rem] transition-all border-2 relative ${
              state.tags.includes(tag) 
                ? 'border-amber-400 bg-amber-50 shadow-md ring-4 ring-amber-400/5 scale-[1.02]' 
                : 'border-gray-100 bg-white hover:border-gray-200'
            }`}
          >
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-gray-50">
              {TAG_DETAILS[tag].icon}
            </div>
            <div className="flex-1">
              <span className="font-black text-slate-900 text-xs uppercase tracking-widest block mb-1">{tag}</span>
              <p className="text-[10px] text-slate-400 font-medium leading-tight">
                {TAG_DETAILS[tag].desc}
              </p>
            </div>
            {state.tags.includes(tag) && (
              <div className="bg-amber-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[8px] shadow-sm">
                ✓
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="pt-2">
        <button
          onClick={onContinue}
          className="w-full bg-slate-900 text-white font-black py-5 rounded-[1.5rem] transition-all active:scale-95 shadow-xl uppercase tracking-widest text-xs"
        >
          {state.tags.length > 0 ? `Continue with ${state.tags.length} Tags` : 'Skip and Continue'}
        </button>
      </div>
    </div>
  );
};
