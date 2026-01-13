
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

  return (
    <div className="p-6 flex flex-col space-y-6 animate-fadeIn h-full">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-900 leading-tight">What kind of stay are you offering?</h2>
        <p className="text-slate-500 text-sm font-medium">Choose the category that best describes your living context.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 flex-1 overflow-y-auto pr-1 no-scrollbar pb-10">
        {types.map((type) => (
          <div key={type} className="flex flex-col">
            <button
              onClick={() => onUpdate({ type })}
              className={`flex flex-col text-left p-6 rounded-[2rem] transition-all border-2 relative overflow-hidden ${
                state.type === type 
                  ? 'border-amber-400 bg-amber-50 shadow-md ring-4 ring-amber-400/10' 
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <div className="flex items-center gap-4 mb-2">
                <span className="text-3xl">
                  {CATEGORY_ICONS[type]}
                </span>
                <span className="font-black text-slate-900 text-lg uppercase tracking-tight">{type}</span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {CATEGORY_DESCRIPTIONS[type]}
              </p>
              {state.type === type && (
                <div className="absolute top-4 right-4 bg-amber-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] shadow-sm">
                  ✓
                </div>
              )}
            </button>
            
            {/* Expanded Insight for Selected Category */}
            {state.type === type && (
              <div className="mt-3 px-6 py-4 bg-slate-900 text-white rounded-[2rem] animate-slideDown shadow-xl mx-2">
                <div className="flex items-start gap-3">
                  <span className="text-lg">💡</span>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-400">Why choose this?</p>
                    <p className="text-[11px] leading-relaxed font-medium">
                      {type === PropertyType.FAMILY_HOMESTAY && "Perfect for hosts who want to involve guests in their daily routines like cooking and storytelling."}
                      {type === PropertyType.SHARED_HOME && "Best if you live there but want to offer guests a bit more personal space within your home."}
                      {type === PropertyType.ENTIRE_HOME && "Use this if the guest will have the whole property keys and you won't be staying there at the same time."}
                      {type === PropertyType.VILLAGE_STAY && "Focuses on the surrounding rural community and traditional lifestyle beyond just the room."}
                      {type === PropertyType.FARM_STAY && "Great for active farms where guests might want to see how you harvest or manage livestock."}
                      {type === PropertyType.ECO_STAY && "Highlight your solar power, local construction materials, or proximity to Rwanda's beautiful nature."}
                      {type === PropertyType.GUESTHOUSE_COMPOUND && "The right choice for larger properties with several guest rooms and a shared central area."}
                      {type === PropertyType.CITY_APARTMENT && "Standard urban living. Guests look for convenience, security, and proximity to city services."}
                      {type === PropertyType.CULTURAL_STAY && "If your property is a hub for crafts, history, or artisan groups, select this."}
                      {type === PropertyType.GROUP_FAMILY_COMPOUND && "Perfect for large enclosed spaces where multiple families or groups can stay together safely."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        disabled={!state.type}
        onClick={onContinue}
        className={`w-full font-black py-5 rounded-[1.5rem] transition-all active:scale-95 shadow-xl uppercase tracking-widest text-xs ${
          state.type ? 'bg-slate-900 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        Next: Refine Experience
      </button>
    </div>
  );
};
