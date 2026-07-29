import React, { useState, useEffect } from 'react';
import { Temple, LiveDarshanStatus, Festival, Journal, BookingRecord, CrowdLevel } from '../types';
import {
  ShieldCheck,
  TrendingUp,
  Ticket,
  Building2,
  Calendar,
  BookOpen,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  PlusCircle,
  RefreshCw,
  Sliders,
  DollarSign,
  Users,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  AlertCircle,
  KeyRound
} from 'lucide-react';

interface AdminDashboardProps {
  temples: Temple[];
  liveStatuses: LiveDarshanStatus[];
  festivals: Festival[];
  journals: Journal[];
  onExitAdmin: () => void;
  onRefreshData?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  temples,
  liveStatuses: initialLiveStatuses,
  festivals: initialFestivals,
  journals,
  onExitAdmin,
}) => {
  // Password Protection State (Master Password: swaxthika2026)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => sessionStorage.getItem('swaxthika_admin_auth') === 'true'
  );
  const [inputPassword, setInputPassword] = useState('');
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'crowd' | 'festivals' | 'journals'>('overview');
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [liveStatuses, setLiveStatuses] = useState<LiveDarshanStatus[]>(initialLiveStatuses);
  const [festivals, setFestivals] = useState<Festival[]>(initialFestivals);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [loading, setLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Password submission handler
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPassword === 'swaxthika2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('swaxthika_admin_auth', 'true');
      setAuthError(null);
    } else {
      setAuthError('Incorrect Master Admin Password. Please try again.');
    }
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('swaxthika_admin_auth');
    onExitAdmin();
  };

  // New Booking Modal / Form state
  const [showAddBookingModal, setShowAddBookingModal] = useState(false);
  const [newDevoteeName, setNewDevoteeName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newTempleName, setNewTempleName] = useState('Tirupati Balaji Temple');
  const [newSevaName, setNewSevaName] = useState('Kalyanotsavam Seva & Special Darshan');
  const [newBookingDate, setNewBookingDate] = useState('2026-08-10');

  // Crowd Level Editing State
  const [editingCrowdId, setEditingCrowdId] = useState<string | null>(null);
  const [tempCrowdLevel, setTempCrowdLevel] = useState<CrowdLevel>('Moderate');
  const [tempWaitTime, setTempWaitTime] = useState<number>(45);

  // Fetch Bookings from API
  const fetchBookings = () => {
    setLoading(true);
    fetch('/api/admin/bookings')
      .then((r) => r.json())
      .then((data) => {
        if (data.bookings) {
          setBookings(data.bookings);
        }
      })
      .catch((e) => console.error('Failed to load admin bookings', e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const triggerNotification = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  // Update Booking Status handler
  const handleUpdateBookingStatus = (bookingId: string, newStatus: 'Confirmed' | 'Completed' | 'Cancelled') => {
    fetch('/api/admin/update-booking-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId, status: newStatus }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setBookings((prev) =>
            prev.map((b) => (b.bookingId === bookingId ? { ...b, status: newStatus } : b))
          );
          triggerNotification(`Booking ${bookingId} status updated to ${newStatus}`);
        }
      })
      .catch((err) => console.error(err));
  };

  // Create Manual Admin Booking
  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevoteeName || !newPhone) return;

    fetch('/api/book-seva', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templeName: newTempleName,
        sevaName: newSevaName,
        devoteeName: newDevoteeName,
        phone: newPhone,
        date: newBookingDate,
        numberOfDevotees: 2,
        totalAmount: 600,
        specialWishes: 'Admin Registered Booking',
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.booking) {
          setBookings((prev) => [res.booking, ...prev]);
          setShowAddBookingModal(false);
          setNewDevoteeName('');
          setNewPhone('');
          triggerNotification(`New Seva Booking #${res.booking.bookingId} registered successfully!`);
        }
      });
  };

  // Save Crowd Status
  const handleSaveCrowdStatus = (templeId: string) => {
    fetch('/api/admin/update-crowd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templeId,
        crowdLevel: tempCrowdLevel,
        waitTimeMinutes: tempWaitTime,
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.liveCrowd) {
          setLiveStatuses(res.liveCrowd);
          setEditingCrowdId(null);
          triggerNotification(`Live queue updated for ${templeId}`);
        }
      });
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.devoteeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.includes(searchQuery) ||
      b.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.templeName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  // Render Password Lock Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1c0806] flex items-center justify-center p-4">
        <div className="bg-[#fffdfa] rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6 border border-[#c5a059]/40 relative overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#5d100a]/10 rounded-full blur-xl pointer-events-none"></div>

          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-[#5d100a] text-[#c5a059] mx-auto flex items-center justify-center shadow-lg border border-[#c5a059]/40">
              <Lock className="w-8 h-8 text-[#c5a059]" />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059] bg-[#5d100a]/10 px-3 py-1 rounded-full border border-[#c5a059]/30">
              Restricted Console Access
            </span>

            <h2 className="text-2xl font-serif font-bold text-[#5d100a]">
              Admin Portal Authentication
            </h2>
            <p className="text-xs text-gray-500 font-sans">
              Enter the Master Admin Password to unlock Swaxthika management features.
            </p>
          </div>

          {authError && (
            <div className="bg-rose-50 border border-rose-300 text-rose-800 text-xs p-3 rounded-xl flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Master Admin Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#c5a059] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPasswordText ? 'text' : 'password'}
                  required
                  placeholder="Enter admin password..."
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-9 pr-10 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#5d100a] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordText(!showPasswordText)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPasswordText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#5d100a] text-white font-bold text-xs py-3 rounded-xl hover:bg-opacity-95 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
              <span>Unlock Admin Portal</span>
            </button>
          </form>

          <div className="pt-2 text-center border-t border-gray-100">
            <button
              onClick={onExitAdmin}
              className="text-xs text-gray-500 hover:text-[#5d100a] hover:underline font-semibold cursor-pointer"
            >
              ← Back to Swaxthika Travel Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcf8f5] text-gray-800">
      {/* Top Admin Navbar */}
      <header className="bg-[#420a06] text-white border-b border-[#c5a059]/40 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c5a059] to-[#8c6b2d] flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-lg text-white tracking-wide">
                  SWAXTHIKA <span className="text-[#c5a059] font-sans font-normal text-xs uppercase tracking-widest ml-1">ADMIN PORTAL</span>
                </h1>
                <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live Sync
                </span>
              </div>
              <p className="text-[11px] text-amber-200/80">
                Devotional Management & Real-time Temple Operations Console
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchBookings}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
              title="Refresh All Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Sync Data</span>
            </button>

            <button
              onClick={handleAdminLogout}
              className="bg-[#c5a059] hover:bg-[#b08c46] text-[#420a06] font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock & Exit</span>
            </button>
          </div>
        </div>
      </header>

      {/* Action Notification Toast */}
      {actionSuccess && (
        <div className="fixed top-16 right-6 z-50 bg-emerald-900 text-emerald-100 border border-emerald-500/50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-semibold">{actionSuccess}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl p-1.5 border border-gray-200/80 shadow-xs flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-[#5d100a] text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-[#c5a059]" />
            <span>Overview & Stats</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 relative ${
              activeTab === 'bookings'
                ? 'bg-[#5d100a] text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Ticket className="w-4 h-4 text-[#c5a059]" />
            <span>Seva Bookings ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('crowd')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'crowd'
                ? 'bg-[#5d100a] text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Building2 className="w-4 h-4 text-[#c5a059]" />
            <span>Live Crowd Management</span>
          </button>

          <button
            onClick={() => setActiveTab('festivals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'festivals'
                ? 'bg-[#5d100a] text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#c5a059]" />
            <span>Tamil Uthsavams ({festivals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('journals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'journals'
                ? 'bg-[#5d100a] text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#c5a059]" />
            <span>Devotee Journals ({journals.length})</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & STATS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Metric KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-gradient-to-br from-amber-500 to-amber-700 text-white rounded-2xl p-5 shadow-md flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-xs font-bold uppercase tracking-wider">Total Revenue</p>
                  <h3 className="text-3xl font-serif font-bold mt-1">₹{totalRevenue.toLocaleString('en-IN')}</h3>
                  <p className="text-[11px] text-amber-200 mt-1">From Devotee Seva Registrations</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#5d100a] to-[#801810] text-white rounded-2xl p-5 shadow-md flex items-center justify-between">
                <div>
                  <p className="text-amber-200 text-xs font-bold uppercase tracking-wider">Total Bookings</p>
                  <h3 className="text-3xl font-serif font-bold mt-1">{bookings.length}</h3>
                  <p className="text-[11px] text-amber-100 mt-1">Seva & Special Darshan Passes</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Ticket className="w-6 h-6 text-[#c5a059]" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white rounded-2xl p-5 shadow-md flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider">Active Temples</p>
                  <h3 className="text-3xl font-serif font-bold mt-1">{temples.length}</h3>
                  <p className="text-[11px] text-emerald-200 mt-1">With Live Darshan Tracking</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-700 to-indigo-900 text-white rounded-2xl p-5 shadow-md flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-xs font-bold uppercase tracking-wider">Tamil Uthsavams</p>
                  <h3 className="text-3xl font-serif font-bold mt-1">{festivals.length}</h3>
                  <p className="text-[11px] text-purple-200 mt-1">Sacred Calendar Events</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Calendar className="w-6 h-6 text-amber-300" />
                </div>
              </div>
            </div>

            {/* Quick Live Crowd Overview Table */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#5d100a]">Real-Time Temple Darshan Queue Status</h3>
                  <p className="text-xs text-gray-500">Live queue wait times displayed on devotee mobile app</p>
                </div>
                <button
                  onClick={() => setActiveTab('crowd')}
                  className="text-xs font-bold text-[#5d100a] hover:underline flex items-center gap-1"
                >
                  <span>Manage All Queues</span>
                  <Sliders className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {liveStatuses.map((st) => (
                  <div key={st.templeId} className="bg-[#fffdfa] border border-amber-200/70 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-xs text-gray-900 truncate">{st.templeName}</span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          st.crowdLevel === 'Low'
                            ? 'bg-emerald-100 text-emerald-800'
                            : st.crowdLevel === 'Moderate'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {st.crowdLevel} Crowd
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-[#5d100a]">~{st.waitTimeMinutes}</span>
                      <span className="text-xs text-gray-500">mins wait</span>
                    </div>
                    <p className="text-[10px] text-gray-500 truncate">{st.statusText}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SEVA & DARSHAN BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-5">
            {/* Header & Controls Bar */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by Devotee Name, ID, Phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-[#5d100a]"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-[#5d100a]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <button
                onClick={() => setShowAddBookingModal(true)}
                className="bg-[#5d100a] text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-opacity-90 transition-all cursor-pointer shadow-md w-full sm:w-auto justify-center"
              >
                <PlusCircle className="w-4 h-4 text-[#c5a059]" />
                <span>New Seva Booking</span>
              </button>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-700">
                  <thead className="bg-[#420a06] text-white uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="px-4 py-3.5">Booking ID</th>
                      <th className="px-4 py-3.5">Devotee Name</th>
                      <th className="px-4 py-3.5">Temple & Seva</th>
                      <th className="px-4 py-3.5">Date</th>
                      <th className="px-4 py-3.5">Devotees</th>
                      <th className="px-4 py-3.5">Amount</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-10 text-gray-400 italic">
                          No Seva Bookings match the filter query.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => (
                        <tr key={b.bookingId} className="hover:bg-[#fffdfa] transition-colors">
                          <td className="px-4 py-3 font-mono font-bold text-[#5d100a]">{b.bookingId}</td>
                          <td className="px-4 py-3">
                            <p className="font-bold text-gray-900">{b.devoteeName}</p>
                            <p className="text-[10px] text-gray-500">{b.phone}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-semibold text-gray-900">{b.templeName}</p>
                            <p className="text-[10px] text-[#c5a059] font-bold">{b.sevaName}</p>
                          </td>
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{b.date}</td>
                          <td className="px-4 py-3 font-bold text-gray-700 text-center">{b.numberOfDevotees}</td>
                          <td className="px-4 py-3 font-bold text-[#5d100a]">₹{b.totalAmount}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                b.status === 'Confirmed'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300/60'
                                  : b.status === 'Completed'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300/60'
                                  : 'bg-rose-100 text-rose-800 border border-rose-300/60'
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {b.status !== 'Completed' && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(b.bookingId, 'Completed')}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-2 py-1 rounded shadow-xs transition-all cursor-pointer"
                                  title="Mark as Completed"
                                >
                                  Complete
                                </button>
                              )}
                              {b.status !== 'Cancelled' && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(b.bookingId, 'Cancelled')}
                                  className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold px-2 py-1 rounded shadow-xs transition-all cursor-pointer"
                                  title="Cancel Booking"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LIVE CROWD MANAGEMENT */}
        {activeTab === 'crowd' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#5d100a]">Manage Real-Time Darshan Queue Status</h3>
              <p className="text-xs text-gray-500">
                Update queue length and crowd density for temples in real-time. Changes are instantly published to all devotees.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {liveStatuses.map((st) => (
                  <div
                    key={st.templeId}
                    className="bg-[#fffdfa] border border-[#c5a059]/40 p-5 rounded-2xl space-y-4 shadow-2xs hover:border-[#5d100a] transition-all"
                  >
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div>
                        <h4 className="font-serif font-bold text-sm text-gray-900">{st.templeName}</h4>
                        <p className="text-[10px] text-gray-400">{st.lastUpdated}</p>
                      </div>

                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          st.crowdLevel === 'Low'
                            ? 'bg-emerald-100 text-emerald-800'
                            : st.crowdLevel === 'Moderate'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {st.crowdLevel} Density
                      </span>
                    </div>

                    {editingCrowdId === st.templeId ? (
                      <div className="space-y-3 bg-amber-50/60 p-3.5 rounded-xl border border-amber-200">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold uppercase text-gray-600 block mb-1">Crowd Level</label>
                            <select
                              value={tempCrowdLevel}
                              onChange={(e) => setTempCrowdLevel(e.target.value as CrowdLevel)}
                              className="w-full bg-white border border-gray-300 text-xs rounded-lg p-2 font-bold"
                            >
                              <option value="Low">Low</option>
                              <option value="Moderate">Moderate</option>
                              <option value="High">High</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold uppercase text-gray-600 block mb-1">Wait Time (Mins)</label>
                            <input
                              type="number"
                              value={tempWaitTime}
                              onChange={(e) => setTempWaitTime(Number(e.target.value))}
                              className="w-full bg-white border border-gray-300 text-xs rounded-lg p-2 font-bold"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2">
                          <button
                            onClick={() => setEditingCrowdId(null)}
                            className="text-xs font-bold text-gray-600 px-3 py-1 hover:underline"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveCrowdStatus(st.templeId)}
                            className="bg-[#5d100a] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs hover:bg-opacity-90"
                          >
                            Save Updates
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <p className="text-xs text-gray-500">Current Queue Wait</p>
                          <p className="text-xl font-bold text-[#5d100a]">~{st.waitTimeMinutes} minutes</p>
                        </div>

                        <button
                          onClick={() => {
                            setEditingCrowdId(st.templeId);
                            setTempCrowdLevel(st.crowdLevel);
                            setTempWaitTime(st.waitTimeMinutes);
                          }}
                          className="bg-white border border-[#c5a059] text-[#5d100a] font-bold text-xs px-3.5 py-1.5 rounded-xl hover:bg-[#fff8f5] transition-all cursor-pointer"
                        >
                          Edit Status
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TAMIL CALENDAR UTHSAVAMS */}
        {activeTab === 'festivals' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#5d100a]">தமிழ் ஆன்மீகத் திருவிழாக்கள் • Tamil Uthsavams</h3>
                  <p className="text-xs text-gray-500">Sacred Tamil festivals and Panchangam dates published on website</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {festivals.map((f) => (
                  <div key={f.id} className="bg-[#fffdfa] border border-amber-200/80 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#5d100a] uppercase">{f.month} {f.dateNumber}</span>
                      <span className="bg-amber-100 text-amber-900 text-[9px] font-bold px-2 py-0.5 rounded">{f.status}</span>
                    </div>
                    <h4 className="font-bold text-sm text-gray-900">{f.name}</h4>
                    <p className="text-xs font-medium text-gray-600">{f.templeName}</p>
                    <p className="text-[10px] text-gray-500 italic line-clamp-2">{f.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DEVOTEE JOURNALS */}
        {activeTab === 'journals' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#5d100a]">Devotee Yatra Experience Journals</h3>
              <p className="text-xs text-gray-500">Pilgrim reviews, travel tips, and community posts</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {journals.map((j) => (
                  <div key={j.id} className="bg-[#fffdfa] border border-gray-200 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-gray-900">{j.authorName}</span>
                      <span className="text-amber-500 text-xs font-bold">★ {j.rating}/5</span>
                    </div>
                    <h4 className="font-bold text-xs text-[#5d100a]">{j.title}</h4>
                    <p className="text-xs text-gray-600 line-clamp-3">{j.content}</p>
                    <p className="text-[10px] text-[#c5a059] font-semibold">{j.templeVisited} • {j.dateVisited}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Booking Admin Modal */}
      {showAddBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-[#c5a059]/40 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-[#5d100a]">Manual Devotee Seva Registration</h3>
              <button
                onClick={() => setShowAddBookingModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Devotee Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={newDevoteeName}
                  onChange={(e) => setNewDevoteeName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5d100a]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5d100a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Temple</label>
                  <select
                    value={newTempleName}
                    onChange={(e) => setNewTempleName(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-2 py-2 text-xs focus:outline-none focus:border-[#5d100a]"
                  >
                    <option value="Tirupati Balaji Temple">Tirupati Balaji</option>
                    <option value="Meenakshi Amman Temple">Meenakshi Amman</option>
                    <option value="Srirangam Ranganathaswamy Temple">Srirangam Ranganathaswamy</option>
                    <option value="Sabarimala Temple">Sabarimala</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Date</label>
                  <input
                    type="date"
                    value={newBookingDate}
                    onChange={(e) => setNewBookingDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-2 py-2 text-xs focus:outline-none focus:border-[#5d100a]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Seva Name</label>
                <input
                  type="text"
                  value={newSevaName}
                  onChange={(e) => setNewSevaName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5d100a]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddBookingModal(false)}
                  className="text-xs font-bold text-gray-500 hover:underline cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#5d100a] text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-opacity-90 transition-all cursor-pointer shadow-md"
                >
                  Issue Booking Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
