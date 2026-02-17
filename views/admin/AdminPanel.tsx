
import React, { useState } from 'react';
import { Listing, BookingState, HostListingState, PropertyType, UserRole, ListingTag, AuditEntry } from '../../types';
import { LISTING_TAGS } from '../../constants';

interface Props {
  listings: Listing[];
  hostListings: HostListingState[];
  bookings: BookingState[];
  auditLogs: AuditEntry[];
  onUpdateBooking: (id: string, status: BookingState['status']) => void;
  onResolveDispute: (id: string, resolution: 'REFUND' | 'PAY_HOST', details: string) => void;
  onUpdateListing: (id: string, status: HostListingState['status']) => void;
  onHome: () => void;
}

type AdminSection = 'DASHBOARD' | 'MIGRATION_REVIEW' | 'LISTINGS' | 'BOOKINGS' | 'PAYMENTS' | 'USERS' | 'VERIFICATIONS' | 'DISPUTES' | 'AUDIT_LOGS' | 'SETTINGS';

export const AdminPanel: React.FC<Props> = ({ listings, hostListings, bookings, auditLogs, onUpdateBooking, onResolveDispute, onUpdateListing, onHome }) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('DASHBOARD');

  const SidebarItem: React.FC<{ id: AdminSection; label: string; icon: string }> = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveSection(id)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
        activeSection === id ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm font-bold">{label}</span>
    </button>
  );

  const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const getColors = () => {
      switch (status.toUpperCase()) {
        case 'APPROVED':
        case 'CONFIRMED':
        case 'COMPLETED':
        case 'ACTIVE':
        case 'ACTIVE_STAY':
          return 'bg-emerald-100 text-emerald-700';
        case 'PENDING':
        case 'PENDING_REVIEW':
        case 'PENDING_APPROVAL':
        case 'PENDING_PAYMENT':
          return 'bg-amber-100 text-amber-700';
        case 'REJECTED':
        case 'CANCELLED':
        case 'DISPUTE':
        case 'DISPUTED':
        case 'SUSPENDED':
          return 'bg-red-100 text-red-700';
        default:
          return 'bg-slate-100 text-slate-700';
      }
    };
    return (
      <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getColors()}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <div className="mb-8 flex justify-between items-end">
      <div>
        <h3 className="text-2xl font-black text-slate-900">{title}</h3>
        {subtitle && <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{subtitle}</p>}
      </div>
      <div className="flex gap-3">
        <button className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400">Export CSV</button>
        <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">KAZE HQ</button>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Bookings', value: bookings.length, sub: '+12% from last week', icon: '📅' },
          { label: 'Community Audit', value: listings.filter(l => l.needsMigrationReview).length, sub: 'Needs attention', icon: '🛡️' },
          { label: 'Pending Payouts', value: bookings.filter(b => b.status === 'COMPLETED' && !b.payoutReleased).length, sub: 'RWF 0', icon: '💰' },
          { label: 'Open Disputes', value: bookings.filter(b => b.status === 'DISPUTED').length, sub: 'Active conflicts', icon: '⚠️' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-[10px] font-black text-emerald-500 uppercase">{stat.sub}</span>
            </div>
            <p className="mt-4 text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 space-y-6">
          <h3 className="text-lg font-black text-slate-900">Platform Trust Logs</h3>
          <div className="space-y-4">
            {auditLogs.slice(0, 4).map((entry) => (
              <div key={entry.id} className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black uppercase text-amber-600">{entry.action}</p>
                  <p className="text-[8px] text-slate-400">{entry.timestamp}</p>
                </div>
                <p className="text-xs text-slate-700 font-medium">{entry.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'DASHBOARD': return renderDashboard();
      case 'AUDIT_LOGS': return <div className="p-8">Audit Logs Loading...</div>;
      case 'LISTINGS': 
        return (
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden animate-fadeIn">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900">Home Approvals</h3>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Listing</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Host</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {hostListings.map((l, i) => (
                  <tr key={i}>
                    <td className="px-8 py-5 text-sm font-bold text-slate-900">{l.name || 'Draft Listing'}</td>
                    <td className="px-8 py-5 text-sm text-slate-500">{l.hostName || 'Unassigned'}</td>
                    <td className="px-8 py-5"><StatusBadge status={l.status} /></td>
                    <td className="px-8 py-5">
                      <div className="flex gap-2">
                        <button onClick={() => { onUpdateListing(l.id!, 'APPROVED') }} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">✅</button>
                        <button onClick={() => { onUpdateListing(l.id!, 'REJECTED') }} className="p-2 bg-red-50 text-red-600 rounded-lg">❌</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'BOOKINGS':
        return (
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden animate-fadeIn">
            <div className="p-8 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-900">Reservations</h3>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Guest</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {bookings.map((b, i) => (
                  <tr key={i}>
                    <td className="px-8 py-5 font-mono text-xs text-slate-400">#{b.id?.slice(-8)}</td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-900">{b.guestName}</td>
                    <td className="px-8 py-5"><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return <div className="py-20 text-center text-slate-400 font-bold uppercase">Section Coming Soon</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-hidden font-sans">
      <aside className="w-72 bg-white border-r border-slate-100 p-8 flex flex-col hidden lg:flex">
        <div className="mb-12">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">KAZE</h1>
          <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mt-1">Management Hub</p>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem id="DASHBOARD" label="Overview" icon="📊" />
          <SidebarItem id="LISTINGS" label="Approvals" icon="🏠" />
          <SidebarItem id="BOOKINGS" label="Reservations" icon="🎒" />
          <SidebarItem id="PAYMENTS" label="MoMo Monitor" icon="💸" />
          <SidebarItem id="DISPUTES" label="Disputes" icon="⚖️" />
        </nav>

        <div className="mt-auto pt-8 border-t border-slate-100">
          <button 
            onClick={onHome}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:text-slate-900 transition-colors"
          >
            <span>🚪</span>
            <span className="text-xs font-black uppercase tracking-widest">Exit Management</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-y-auto no-scrollbar">
        <header className="sticky top-0 z-40 bg-slate-50/80 backdrop-blur-md px-12 py-8 flex justify-between items-center border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{activeSection.replace('_', ' ')}</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">KAZE • Community First</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white font-black shadow-lg">K</div>
          </div>
        </header>

        <div className="px-12 pb-20 pt-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
