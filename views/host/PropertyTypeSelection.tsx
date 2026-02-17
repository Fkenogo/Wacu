
import React from 'react';
import { HostListingState, PropertyType } from '../../types';
import { CATEGORY_ICONS, CATEGORY_DESCRIPTIONS } from '../../constants';

interface Props {
  state: HostListingState;
  onUpdate: (updates: Partial<HostListingState>) => void;
  onContinue: () => void;
}

export const PropertyTypeSelection: React.FC<Props> = ({ state, onUpdate, onContinue }) => {
  const types = Object.values(PropertyType);

  const getHint = (type: PropertyType) => {
    switch (type) {
      case PropertyType.FAMILY_HOMESTAY: return "Perfect for hosts who want to involve guests in their daily routines like cooking and storytelling.";
      case PropertyType.SHARED_HOME: return "Best if you live there but want to offer guests a bit more personal space within your home.";
      case PropertyType.ENTIRE_HOME: return "Use this if the guest will have the whole property keys and you won't be staying there at the same time.";
      case PropertyType.VILLAGE_STAY: return "Focuses on the surrounding rural community and traditional lifestyle beyond just the room.";
      case PropertyType.FARM_STAY: return "Great for active farms where guests might want to see how you harvest or manage livestock.";
      case PropertyType.ECO_STAY: return "Highlight your solar power, local construction materials, or proximity to Rwanda's nature.";
      case PropertyType.GUESTHOUSE_COMPOUND: return "The right choice for larger properties with several guest rooms and a shared central area.";
      case PropertyType.CITY_APARTMENT: return "Standard urban living. Guests look for convenience, security, and proximity to city services.";
      case PropertyType.CULTURAL_STAY: return "If your property is a hub for crafts, history, or artisan groups, select this.";
      case PropertyType.GROUP_FAMILY_COMPOUND: return "Perfect for large enclosed spaces where multiple families or groups can stay together safely.";
      default: return "";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCF5] animate-fadeIn">
      {/* Custom Hosting Header Matching Screenshot */}
      <header className="sticky top-0 bg-white z-20 px-6 py-4 flex items-center justify-between border-b border-gray-50">
        <button onClick={() => window.history.back()} className="text-slate-900 active:scale-90 transition-transform">
          <span className="material-symbols-outlined font-black">arrow_back</span>
        </button>
        <h1 className="text-[13px] font-black uppercase tracking-[0.2em] text-primary">Host Your Stay</h1>
        <button className="text-[11px] font-black uppercase tracking-widest text-primary/60">Save & Exit</button>
      </header>

      {/* Progress Section */}
      <div className="px-6 pt-4 pb-2 space-y-2">
        <div className="flex justify-between items-end">
          <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">Step 1 of 5</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">20% Complete</p>
        </div>
        <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500 w-[20%]" />
        </div>
      </div>

      <main className="flex-1 px-6 pb-32">
        <div className="py-8 space-y-3">
          <h2 className="text-[32px] font-black text-slate-900 leading-[1.1] tracking-tight">
            What kind of stay are you offering?
          </h2>
          <p className="text-[15px] text-slate-500 font-medium leading-relaxed pr-8">
            Choose the category that best describes your property to help guests find you.
          </p>
        </div>

        <div className="space-y-4">
          {types.map((type) => {
            const isSelected = state.type === type;
            return (
              <div key={type} className="flex flex-col space-y-3">
                <button
                  onClick={() => onUpdate({ type })}
                  className={`flex items-center gap-4 p-5 rounded-[2rem] border-2 transition-all text-left relative ${
                    isSelected 
                      ? 'border-primary bg-primary/[0.03] shadow-md ring-4 ring-primary/5' 
                      : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 transition-colors ${isSelected ? 'bg-primary/10' : 'bg-slate-50'}`}>
                    {CATEGORY_ICONS[type]}
                  </div>
                  <div className="flex-1 pr-6">
                    <h3 className="font-black text-slate-900 text-[15px] leading-tight mb-1">{type}</h3>
                    <p className="text-[11px] text-slate-400 font-bold leading-tight line-clamp-2">
                      {CATEGORY_DESCRIPTIONS[type]}
                    </p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    isSelected ? 'border-primary bg-primary' : 'border-gray-200'
                  }`}>
                    {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                  </div>
                </button>

                {/* Hint/Insight Box: Preserved per instructions */}
                {isSelected && (
                  <div className="mx-2 px-6 py-5 bg-[#1e293b] text-white rounded-[2rem] animate-slideDown shadow-xl border-l-4 border-primary">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                         <span className="text-xl">💡</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Why choose this?</p>
                        <p className="text-[12px] leading-relaxed font-medium text-slate-200 pr-4">
                          {getHint(type)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Floating Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/95 backdrop-blur-xl border-t border-gray-50 z-30 max-w-md mx-auto">
        <button
          disabled={!state.type}
          onClick={onContinue}
          className={`w-full font-black py-6 rounded-[1.5rem] transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs ${
            state.type ? 'bg-primary text-[#1d180c]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Next: Refine Experience
          <span className="material-symbols-outlined text-lg font-black">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
