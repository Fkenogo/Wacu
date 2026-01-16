
import React, { useState, useMemo } from 'react';
import { HostListingState, HouseRule } from '../../types';
import { AMENITY_CATEGORIES, HOUSE_RULES_TOOLTIPS } from '../../constants';
import { TrustTooltip } from '../../components/TrustComponents';

interface Props {
  state: HostListingState;
  onUpdate: (updates: Partial<HostListingState>) => void;
  onContinue: () => void;
}

export const AmenitiesRules: React.FC<Props> = ({ state, onUpdate, onContinue }) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['connectivity']);
  const [expandedRules, setExpandedRules] = useState<string[]>(['Safety & Security']);
  const [error, setError] = useState<string | null>(null);

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleRuleCategory = (cat: string) => {
    setExpandedRules(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleAmenity = (id: string) => {
    setError(null);
    const next = state.amenities.includes(id) 
      ? state.amenities.filter(a => a !== id)
      : [...state.amenities, id];
    onUpdate({ amenities: next });
  };

  const updateRule = (id: string, updates: Partial<HouseRule>) => {
    const next = state.rules.map(r => r.id === id ? { ...r, ...updates } : r);
    onUpdate({ rules: next });
  };

  const ruleGroups = useMemo(() => {
    const groups: Record<string, HouseRule[]> = {};
    state.rules.forEach(r => {
      if (!groups[r.category]) groups[r.category] = [];
      groups[r.category].push(r);
    });
    return groups;
  }, [state.rules]);

  const validateAndContinue = () => {
    const hasWifi = state.amenities.includes('wifi');
    const hasPower = state.amenities.includes('grid_power') || state.amenities.includes('solar') || state.amenities.includes('generator');
    
    if (hasWifi && !hasPower) {
      setError("Guests need a power source (Grid, Solar, or Generator) for Wi-Fi to be reliable.");
      return;
    }

    const hasHotShower = state.amenities.includes('shower');
    const hasWaterSource = state.amenities.includes('running_water') || state.amenities.includes('water_tank');

    if (hasHotShower && !hasWaterSource) {
      setError("Hot showers require a reliable water source (Running Water or Water Tank).");
      return;
    }

    // Logic for House Rules
    const checkIn = state.rules.find(r => r.id === 'check_in_window');
    if (checkIn?.enabled && (!checkIn.meta?.time || !checkIn.meta?.endTime)) {
      setError("Please specify a full Check-in window (Start & End Time).");
      return;
    }

    onContinue();
  };

  const getRuleTooltip = (id: string) => {
    return HOUSE_RULES_TOOLTIPS[id] || null;
  };

  return (
    <div className="p-6 flex flex-col space-y-8 animate-fadeIn h-full overflow-y-auto no-scrollbar pb-32">
      {/* Amenities Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-slate-900 leading-tight">Wacu Amenities</h3>
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl">
            <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
              “Select amenities guests can depend on every day. Incorrect selections reduce trust and visibility.”
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl animate-shake">
            <p className="text-[10px] text-red-600 font-black uppercase tracking-tight">⚠️ Verification Error</p>
            <p className="text-xs text-red-800 mt-1 font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          {AMENITY_CATEGORIES.map(cat => (
            <div key={cat.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
              <button 
                onClick={() => toggleCategory(cat.id)}
                className="w-full flex items-center justify-between p-6 active:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{cat.icon}</span>
                  <div className="text-left">
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{cat.name}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                      {cat.amenities.filter(a => state.amenities.includes(a.id)).length} / {cat.amenities.length} Selected
                    </p>
                  </div>
                </div>
                <span className={`text-slate-300 font-black transition-transform duration-300 ${expandedCategories.includes(cat.id) ? 'rotate-90' : ''}`}>→</span>
              </button>

              {expandedCategories.includes(cat.id) && (
                <div className="p-6 pt-0 grid grid-cols-1 gap-3 animate-slideDown">
                  {cat.amenities.map(amenity => (
                    <button
                      key={amenity.id}
                      onClick={() => toggleAmenity(amenity.id)}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                        state.amenities.includes(amenity.id)
                          ? 'bg-amber-50 border-amber-400'
                          : 'bg-slate-50 border-transparent text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{amenity.icon}</span>
                        <span className={`text-xs font-black uppercase tracking-tight ${state.amenities.includes(amenity.id) ? 'text-slate-900' : 'text-slate-400'}`}>
                          {amenity.name}
                        </span>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${state.amenities.includes(amenity.id) ? 'bg-amber-500 text-white shadow-sm' : 'bg-gray-200 text-white'}`}>
                        {state.amenities.includes(amenity.id) ? '✓' : ''}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Categorized House Rules Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900 leading-tight">House Rules</h3>
            <TrustTooltip title={HOUSE_RULES_TOOLTIPS.general.title} text={HOUSE_RULES_TOOLTIPS.general.text}>
              <span className="text-amber-500 text-sm font-black p-2">ⓘ</span>
            </TrustTooltip>
          </div>
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium italic">
              “Short, clear rules reduce surprises. Don’t add rules you won’t enforce.”
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(ruleGroups).map(([catName, rules]) => {
            const typedRules = rules as HouseRule[];
            return (
              <div key={catName} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <button 
                  onClick={() => toggleRuleCategory(catName)}
                  className="w-full flex items-center justify-between p-6 active:bg-slate-50 transition-colors"
                >
                  <div className="text-left">
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{catName}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                      {typedRules.filter(r => r.enabled).length} Enabled
                    </p>
                  </div>
                  <span className={`text-slate-300 font-black transition-transform duration-300 ${expandedRules.includes(catName) ? 'rotate-90' : ''}`}>→</span>
                </button>

                {expandedRules.includes(catName) && (
                  <div className="p-6 pt-0 space-y-4 animate-fadeIn">
                    {typedRules.map(rule => {
                      const tt = getRuleTooltip(rule.id);
                      return (
                        <div key={rule.id} className="p-4 bg-slate-50 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{rule.label}</span>
                              {tt && (
                                <TrustTooltip title={tt.title} text={tt.text}>
                                  <span className="text-amber-500 text-[10px] font-black">ⓘ</span>
                                </TrustTooltip>
                              )}
                            </div>
                            <button
                              onClick={() => updateRule(rule.id, { enabled: !rule.enabled })}
                              className={`w-12 h-6 rounded-full relative transition-colors ${rule.enabled ? 'bg-emerald-500' : 'bg-gray-300'}`}
                            >
                              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${rule.enabled ? 'left-7' : 'left-1'}`} />
                            </button>
                          </div>

                          {rule.enabled && (
                            <div className="space-y-3 animate-slideDown">
                              {/* Metadata Fields */}
                              {(rule.meta?.time !== undefined) && (
                                <div className="flex items-center gap-3">
                                  <div className="flex-1 space-y-1">
                                    <label className="text-[8px] font-black uppercase text-slate-400">{rule.id === 'check_in_window' ? 'Start' : 'Time'}</label>
                                    <input 
                                      type="time" 
                                      value={rule.meta.time} 
                                      onChange={(e) => updateRule(rule.id, { meta: { ...rule.meta, time: e.target.value } })}
                                      className="w-full bg-white border border-gray-100 rounded-lg p-2 text-xs font-bold"
                                    />
                                  </div>
                                  {rule.meta.endTime !== undefined && (
                                    <div className="flex-1 space-y-1">
                                      <label className="text-[8px] font-black uppercase text-slate-400">End</label>
                                      <input 
                                        type="time" 
                                        value={rule.meta.endTime} 
                                        onChange={(e) => updateRule(rule.id, { meta: { ...rule.meta, endTime: e.target.value } })}
                                        className="w-full bg-white border border-gray-100 rounded-lg p-2 text-xs font-bold"
                                      />
                                    </div>
                                  )}
                                </div>
                              )}

                              {rule.meta?.count !== undefined && (
                                <div className="space-y-1">
                                  <label className="text-[8px] font-black uppercase text-slate-400">Count</label>
                                  <input 
                                    type="number" 
                                    value={rule.meta.count} 
                                    onChange={(e) => updateRule(rule.id, { meta: { ...rule.meta, count: parseInt(e.target.value) || 0 } })}
                                    className="w-full bg-white border border-gray-100 rounded-lg p-2 text-xs font-bold"
                                  />
                                </div>
                              )}

                              {rule.meta?.amount !== undefined && (
                                <div className="space-y-1">
                                  <label className="text-[8px] font-black uppercase text-slate-400">Amount (RWF)</label>
                                  <input 
                                    type="number" 
                                    value={rule.meta.amount} 
                                    onChange={(e) => updateRule(rule.id, { meta: { ...rule.meta, amount: parseInt(e.target.value) || 0 } })}
                                    className="w-full bg-white border border-gray-100 rounded-lg p-2 text-xs font-bold"
                                  />
                                </div>
                              )}

                              {/* Rule Note / Clarification */}
                              <div className="space-y-1">
                                <label className="text-[8px] font-black uppercase text-slate-400">Host Clarification (Optional)</label>
                                <input 
                                  type="text" 
                                  maxLength={120}
                                  value={rule.note || ''} 
                                  onChange={(e) => updateRule(rule.id, { note: e.target.value })}
                                  placeholder="Add a short note for guests..."
                                  className="w-full bg-white border border-gray-100 rounded-lg p-2 text-xs font-medium"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Special Host Note */}
          <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100 space-y-3">
            <h4 className="text-[10px] font-black text-amber-900 uppercase tracking-widest">Unique Host Rule</h4>
            <textarea 
              maxLength={200}
              placeholder="e.g. Always greet the neighbors; no plastic bags in the garden..."
              className="w-full bg-white border border-amber-200 rounded-xl p-4 text-xs font-medium outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>
        </div>
      </div>

      <button
        onClick={validateAndContinue}
        className="w-full bg-slate-900 text-white font-black py-6 rounded-[2rem] shadow-2xl active:scale-95 transition-all sticky bottom-0 z-10 uppercase tracking-[0.2em] text-xs"
      >
        Save & Continue
      </button>
    </div>
  );
};
