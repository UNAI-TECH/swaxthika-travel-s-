import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Ticket,
  Compass,
  Calendar,
  Lock,
  LogOut,
  RefreshCw,
  PlusCircle,
  XCircle,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Trash2,
  Eye,
  Search,
  Check,
  Edit2,
  User
} from 'lucide-react';
import { DevotionalPackage, Booking, TourDate, PackageAddon } from '../types';
import { supabase } from '../lib/supabase';

interface AdminDashboardProps {
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExitAdmin }) => {
  // Password Protection State (Master Password: swaxthika2026)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => sessionStorage.getItem('swaxthika_admin_auth') === 'true'
  );
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'overview' | 'packages' | 'dates' | 'bookings' | 'verify'>('overview');
  const [packages, setPackages] = useState<DevotionalPackage[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  // Verification tab state
  const [verificationCode, setVerificationCode] = useState('');
  const [verifiedBooking, setVerifiedBooking] = useState<Booking | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Form states
  const [loading, setLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [showAddPackageModal, setShowAddPackageModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<DevotionalPackage | null>(null);

  // Form fields for package CRUD
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDuration, setFormDuration] = useState('');
  const [formPrice, setFormPrice] = useState(0);
  const [formImage, setFormImage] = useState('');
  const [formCategory, setFormCategory] = useState('South India');
  const [formHighlights, setFormHighlights] = useState('');
  const [formInclusions, setFormInclusions] = useState('');
  const [formExclusions, setFormExclusions] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formAddons, setFormAddons] = useState<PackageAddon[]>([]);
  
  // Image upload and addons sub-form states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [newAddonName, setNewAddonName] = useState('');
  const [newAddonPrice, setNewAddonPrice] = useState(0);
  const [newAddonDesc, setNewAddonDesc] = useState('');

  // Date management state
  const [selectedPackageIdForDates, setSelectedPackageIdForDates] = useState('');
  const [newTourDate, setNewTourDate] = useState('');
  const [newTotalSeats, setNewTotalSeats] = useState(30);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Email and Password Login submission
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setAuthError(null);

    fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inputEmail, password: inputPassword }),
    })
      .then(async (r) => {
        const contentType = r.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const res = await r.json();
          if (r.ok && res.success) {
            setIsAuthenticated(true);
            sessionStorage.setItem('swaxthika_admin_auth', 'true');
            sessionStorage.setItem('swaxthika_admin_user', JSON.stringify(res.user));
            setAuthError(null);
          } else {
            setAuthError(res.error || 'Invalid credentials or unauthorized role.');
          }
        } else {
          setAuthError(`Server returned an error status ${r.status}.`);
        }
      })
      .catch((err) => {
        console.error(err);
        setAuthError('Connection error. Failed to reach auth server.');
      })
      .finally(() => {
        setLoginLoading(false);
      });
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('swaxthika_admin_auth');
    onExitAdmin();
  };

  const triggerNotification = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const fetchPackages = () => {
    setLoading(true);
    fetch('/api/admin/packages')
      .then((r) => r.json())
      .then((data) => {
        if (data.packages) {
          setPackages(data.packages);
          if (data.packages.length > 0 && !selectedPackageIdForDates) {
            setSelectedPackageIdForDates(data.packages[0].id);
          }
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  const fetchBookings = () => {
    fetch('/api/admin/bookings')
      .then((r) => r.json())
      .then((data) => {
        if (data.bookings) setBookings(data.bookings);
      })
      .catch((e) => console.error(e));
  };

  const syncData = () => {
    fetchPackages();
    fetchBookings();
    triggerNotification('Synced dashboard databases successfully.');
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchPackages();
    fetchBookings();

    // Subscribe to real-time changes
    const packagesChannel = supabase
      .channel('admin-realtime-packages')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'packages' },
        (payload) => {
          console.log('Admin realtime package change received:', payload);
          fetchPackages();
        }
      )
      .subscribe();

    const bookingsChannel = supabase
      .channel('admin-realtime-bookings')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        (payload) => {
          console.log('Admin realtime booking change received:', payload);
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(packagesChannel);
      supabase.removeChannel(bookingsChannel);
    };
  }, [isAuthenticated]);

  // Set form fields for Editing
  const openEditPackage = (pkg: DevotionalPackage) => {
    setEditingPackage(pkg);
    setFormName(pkg.name);
    setFormDescription(pkg.description);
    setFormDuration(pkg.duration);
    setFormPrice(pkg.pricePerSeat);
    setFormImage(pkg.image);
    setFormCategory(pkg.category);
    setFormHighlights(pkg.highlights.join(', '));
    setFormInclusions(pkg.inclusions.join(', '));
    setFormExclusions(pkg.exclusions.join(', '));
    setFormIsActive(pkg.isActive);
    setFormAddons(pkg.addons || []);
    setShowAddPackageModal(true);
  };

  // Reset form fields
  const resetForm = () => {
    setEditingPackage(null);
    setFormName('');
    setFormDescription('');
    setFormDuration('');
    setFormPrice(0);
    setFormImage('');
    setFormCategory('South India');
    setFormHighlights('');
    setFormInclusions('');
    setFormExclusions('');
    setFormIsActive(true);
    setFormAddons([]);
    setNewAddonName('');
    setNewAddonPrice(0);
    setNewAddonDesc('');
    setUploadError(null);
  };

  // Image Upload helper
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('image', file);

    fetch('/api/admin/upload-image', {
      method: 'POST',
      body: formData,
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.url) {
          setFormImage(res.url);
          triggerNotification('Image uploaded successfully to Supabase Storage!');
        } else {
          setUploadError(res.error || 'Failed to upload image.');
        }
      })
      .catch((err) => {
        console.error(err);
        setUploadError('Failed to connect to image upload server.');
      })
      .finally(() => {
        setUploadingImage(false);
      });
  };

  // Addons helpers
  const handleAddAddon = () => {
    if (!newAddonName.trim()) return;
    const newAddon: PackageAddon = {
      id: 'add-' + Date.now(),
      name: newAddonName.trim(),
      price: Number(newAddonPrice) || 0,
      description: newAddonDesc.trim() || undefined
    };
    setFormAddons([...formAddons, newAddon]);
    setNewAddonName('');
    setNewAddonPrice(0);
    setNewAddonDesc('');
  };

  const handleRemoveAddon = (id: string) => {
    setFormAddons(formAddons.filter((a) => a.id !== id));
  };

  // Create or Update Package
  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formName,
      description: formDescription,
      duration: formDuration,
      pricePerSeat: Number(formPrice),
      image: formImage || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
      category: formCategory,
      highlights: formHighlights.split(',').map((s) => s.trim()).filter(Boolean),
      inclusions: formInclusions.split(',').map((s) => s.trim()).filter(Boolean),
      exclusions: formExclusions.split(',').map((s) => s.trim()).filter(Boolean),
      isActive: formIsActive,
      addons: formAddons
    };

    const url = editingPackage ? `/api/admin/packages/${editingPackage.id}` : '/api/admin/packages';
    const method = editingPackage ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          triggerNotification(editingPackage ? 'Package updated successfully.' : 'New devotional package created.');
          setShowAddPackageModal(false);
          resetForm();
          fetchPackages();
        }
      })
      .catch((err) => console.error(err));
  };

  // Delete Package
  const handleDeletePackage = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this devotional package?')) return;

    fetch(`/api/admin/packages/${id}`, { method: 'DELETE' })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          triggerNotification('Package deleted successfully.');
          fetchPackages();
        }
      })
      .catch((err) => console.error(err));
  };

  // Add Tour Date
  const handleAddTourDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackageIdForDates || !newTourDate) return;

    fetch(`/api/admin/packages/${selectedPackageIdForDates}/dates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: newTourDate, totalSeats: newTotalSeats }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          triggerNotification('Tour date added to package.');
          setNewTourDate('');
          fetchPackages();
        }
      })
      .catch((err) => console.error(err));
  };

  // Remove Tour Date
  const handleRemoveTourDate = (pkgId: string, dateId: string) => {
    if (!window.confirm('Remove this departure date?')) return;

    fetch(`/api/admin/packages/${pkgId}/dates/${dateId}`, { method: 'DELETE' })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          triggerNotification('Tour date removed.');
          fetchPackages();
        }
      })
      .catch((err) => console.error(err));
  };

  // Verify Booking Onboarding Pass
  const handleVerifyBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode) return;

    setVerificationError(null);
    setVerifiedBooking(null);

    fetch('/api/admin/verify-booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: verificationCode }),
    })
      .then(async (r) => {
        const res = await r.json();
        if (r.ok && res.success) {
          setVerifiedBooking(res.booking);
        } else {
          setVerificationError(res.error || 'No booking record matches this code.');
        }
      })
      .catch((err) => {
        console.error(err);
        setVerificationError('Error checking booking details.');
      });
  };

  // Perform Boarding / Check-In
  const handleCheckIn = (bookingId: string) => {
    fetch('/api/admin/update-booking-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId, status: 'Checked-In' }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setVerifiedBooking(res.booking);
          // Sync bookings table
          setBookings(prev => prev.map(b => b.bookingId === bookingId ? res.booking : b));
          triggerNotification('Devotee boarded/checked-in successfully.');
        }
      })
      .catch((err) => console.error(err));
  };

  // Update Status in bookings table
  const handleUpdateBookingStatus = (bookingId: string, newStatus: 'Confirmed' | 'Completed' | 'Cancelled') => {
    fetch('/api/admin/update-booking-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId, status: newStatus }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setBookings(prev => prev.map(b => b.bookingId === bookingId ? res.booking : b));
          if (verifiedBooking && verifiedBooking.bookingId === bookingId) {
            setVerifiedBooking(res.booking);
          }
          triggerNotification(`Booking status updated to ${newStatus}`);
        }
      })
      .catch((err) => console.error(err));
  };

  // Filters logic
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.userPhone.includes(searchQuery) ||
      b.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.uniqueCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.packageName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = bookings
    .filter((b) => b.status !== 'Cancelled')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  // Lock Screen Render
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
              Enter your admin email and password to verify credentials and access dashboard features.
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
              <label className="text-xs font-bold text-gray-700 block">Admin Email Address</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#c5a059] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@swaxthika.com"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#5d100a] focus:bg-white text-gray-800"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Admin Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#c5a059] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#5d100a] focus:bg-white text-gray-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-[#5d100a] disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl hover:bg-opacity-95 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              {loginLoading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
                  <span>Unlock Admin Portal</span>
                </>
              )}
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

  // Selected package for date configuration
  const currentSelectedPkgForDates = packages.find(p => p.id === selectedPackageIdForDates);

  return (
    <div className="min-h-screen bg-[#fcf8f5] text-gray-850">
      {/* Admin Navbar */}
      <header className="bg-[#420a06] text-white border-b border-[#c5a059]/40 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c5a059] to-[#8c6b2d] flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-lg text-white tracking-wide">
                  SWAXTHIKA <span className="text-[#c5a059] font-sans font-normal text-xs uppercase tracking-widest ml-1">ADMIN CONSOLE</span>
                </h1>
                <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Console
                </span>
              </div>
              <p className="text-[11px] text-amber-200/80">
                Manage packages, departure tour dates, and check-in verified devotee codes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={syncData}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Sync</span>
            </button>

            <button
              onClick={handleAdminLogout}
              className="bg-[#c5a059] hover:bg-[#b08c46] text-[#420a06] font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Console</span>
            </button>
          </div>
        </div>
      </header>

      {/* Action Success Toast */}
      {actionSuccess && (
        <div className="fixed top-16 right-6 z-50 bg-emerald-900 text-emerald-100 border border-emerald-500/50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-semibold">{actionSuccess}</span>
        </div>
      )}

      {/* Admin Tabs Panel */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-white rounded-2xl p-1.5 border border-gray-200/80 shadow-xs flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'overview' ? 'bg-[#5d100a] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-[#c5a059]" />
            <span>Console Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('packages')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'packages' ? 'bg-[#5d100a] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Compass className="w-4 h-4 text-[#c5a059]" />
            <span>Packages CRUD</span>
          </button>

          <button
            onClick={() => setActiveTab('dates')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'dates' ? 'bg-[#5d100a] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#c5a059]" />
            <span>Departure Dates</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'bookings' ? 'bg-[#5d100a] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Ticket className="w-4 h-4 text-[#c5a059]" />
            <span>All Bookings ({bookings.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('verify');
              setVerifiedBooking(null);
              setVerificationError(null);
              setVerificationCode('');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 bg-amber-50 hover:bg-amber-100 ${
              activeTab === 'verify' ? 'bg-[#5d100a] text-white shadow-md' : 'text-amber-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
            <span>Onboarding Verification</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Card 1 */}
              <div className="bg-gradient-to-br from-amber-500 to-amber-700 text-white rounded-2xl p-5 shadow-md flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-xs font-bold uppercase tracking-wider">Gross Revenue</p>
                  <h3 className="text-3xl font-serif font-bold mt-1">₹{totalRevenue.toLocaleString('en-IN')}</h3>
                  <p className="text-[11px] text-amber-200 mt-1">Excludes cancelled packages</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-white/25 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-gradient-to-br from-[#5d100a] to-[#801810] text-white rounded-2xl p-5 shadow-md flex items-center justify-between">
                <div>
                  <p className="text-amber-200 text-xs font-bold uppercase tracking-wider">Total Bookings</p>
                  <h3 className="text-3xl font-serif font-bold mt-1">{bookings.length}</h3>
                  <p className="text-[11px] text-amber-100 mt-1">Verified devotee tickets</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                  <Ticket className="w-5 h-5 text-[#c5a059]" />
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white rounded-2xl p-5 shadow-md flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider">Active Packages</p>
                  <h3 className="text-3xl font-serif font-bold mt-1">{packages.filter((p) => p.isActive).length}</h3>
                  <p className="text-[11px] text-emerald-200 mt-1">Published on website</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Compass className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-gradient-to-br from-purple-700 to-indigo-900 text-white rounded-2xl p-5 shadow-md flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-xs font-bold uppercase tracking-wider">Checked In</p>
                  <h3 className="text-3xl font-serif font-bold mt-1">{bookings.filter((b) => b.status === 'Checked-In').length}</h3>
                  <p className="text-[11px] text-purple-200 mt-1">Devotees onboarded</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-amber-300" />
                </div>
              </div>
            </div>

            {/* Quick date lists view */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#5d100a]">Quick Departure Seats Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="border border-amber-100 p-4 rounded-xl bg-[#fffdfa] space-y-2">
                    <h4 className="font-bold text-xs text-gray-900 truncate">{pkg.name}</h4>
                    <div className="space-y-1">
                      {pkg.availableDates.map((d) => (
                        <div key={d.id} className="flex justify-between items-center text-[10px] text-gray-600">
                          <span>{d.date}</span>
                          <span className="font-bold text-[#5d100a]">
                            {d.bookedSeats} / {d.totalSeats} seats
                          </span>
                        </div>
                      ))}
                      {pkg.availableDates.length === 0 && (
                        <p className="text-[10px] text-gray-400 italic">No tour dates configured.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PACKAGES CRUD */}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
              <h3 className="font-serif font-bold text-lg text-[#5d100a]">Devotional Packages database</h3>
              
              <button
                onClick={() => {
                  resetForm();
                  setShowAddPackageModal(true);
                }}
                className="bg-[#5d100a] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-opacity-90 flex items-center gap-2 cursor-pointer border border-[#c5a059]/30"
              >
                <PlusCircle className="w-4 h-4 text-[#c5a059]" />
                <span>Create Package</span>
              </button>
            </div>

            {/* Packages Grid / List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {packages.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-[#c5a059] shadow-2xs p-5 flex gap-4">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-24 h-24 rounded-xl object-cover shrink-0 border border-gray-100"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="bg-[#fbf2ed] text-[#5d100a] text-[9px] font-bold px-2 py-0.5 rounded border border-[#c5a059]/10">
                          {pkg.category}
                        </span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${pkg.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'}`}>
                          {pkg.isActive ? 'Active' : 'Draft'}
                        </span>
                      </div>
                      
                      <h4 className="font-serif font-bold text-sm text-gray-900 mt-1 leading-snug">{pkg.name}</h4>
                      <p className="text-[10px] text-gray-500 font-semibold">{pkg.duration} • ₹{pkg.pricePerSeat}/seat</p>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-50 mt-2">
                      <button
                        onClick={() => openEditPackage(pkg)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors cursor-pointer"
                        title="Edit Details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePackage(pkg.id)}
                        className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors cursor-pointer"
                        title="Delete Package"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DEPARTURE DATES CONFIG */}
        {activeTab === 'dates' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Package Selector & Add Form */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs space-y-5 h-fit">
              <h3 className="font-serif font-bold text-base text-[#5d100a]">Select Package</h3>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-gray-500 block">Package</label>
                <select
                  value={selectedPackageIdForDates}
                  onChange={(e) => setSelectedPackageIdForDates(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl p-2.5 font-bold focus:outline-none focus:border-[#5d100a]"
                >
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} ({pkg.duration})
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-t border-gray-100 pt-5 space-y-4">
                <h4 className="font-bold text-xs text-gray-900">Add Departure date</h4>
                
                <form onSubmit={handleAddTourDate} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500">Date *</label>
                    <input
                      type="date"
                      required
                      value={newTourDate}
                      onChange={(e) => setNewTourDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5d100a] font-semibold text-gray-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500">Seat Capacity *</label>
                    <input
                      type="number"
                      required
                      value={newTotalSeats}
                      onChange={(e) => setNewTotalSeats(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5d100a] font-semibold text-gray-800"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#5d100a] text-white py-2 rounded-xl text-xs font-bold hover:bg-opacity-95 transition-all shadow-xs border border-[#c5a059]/30 cursor-pointer"
                  >
                    Add Date
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Dates Table for selected Package */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-base text-[#5d100a]">
                Dates for: <span className="text-gray-900 font-sans font-bold text-sm block sm:inline">{currentSelectedPkgForDates?.name}</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-700">
                  <thead className="bg-[#420a06] text-white uppercase text-[9px] font-bold tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Departure Date</th>
                      <th className="px-4 py-3">Total Seats</th>
                      <th className="px-4 py-3">Seats Booked</th>
                      <th className="px-4 py-3">Available</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {!currentSelectedPkgForDates || currentSelectedPkgForDates.availableDates.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-400 italic">
                          No departure dates configured for this package.
                        </td>
                      </tr>
                    ) : (
                      currentSelectedPkgForDates.availableDates.map((d) => (
                        <tr key={d.id} className="hover:bg-amber-50/20 transition-colors">
                          <td className="px-4 py-3 font-semibold text-gray-800">{d.date}</td>
                          <td className="px-4 py-3 text-gray-600">{d.totalSeats}</td>
                          <td className="px-4 py-3 font-bold text-[#5d100a]">{d.bookedSeats}</td>
                          <td className="px-4 py-3 text-gray-700">{d.totalSeats - d.bookedSeats}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                d.status === 'sold-out'
                                  ? 'bg-rose-100 text-rose-800'
                                  : d.status === 'filling-fast'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {d.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => handleRemoveTourDate(selectedPackageIdForDates, d.id)}
                              className="text-rose-600 hover:text-rose-800 hover:underline font-bold text-[10px] cursor-pointer"
                            >
                              Remove
                            </button>
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

        {/* TAB 4: ALL BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by Devotee Name, Booking ID, Unique Code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl pl-10 pr-3 py-2.5 focus:outline-none focus:border-[#5d100a] text-gray-800 font-medium"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#5d100a] text-gray-700"
                >
                  <option value="All">All Statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Checked-In">Checked-In</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-700">
                  <thead className="bg-[#420a06] text-white uppercase text-[9px] font-bold tracking-wider">
                    <tr>
                      <th className="px-4 py-3.5">Booking ID</th>
                      <th className="px-4 py-3.5">Unique Code</th>
                      <th className="px-4 py-3.5">Devotee Name</th>
                      <th className="px-4 py-3.5">Package & Tour Date</th>
                      <th className="px-4 py-3.5">Seats</th>
                      <th className="px-4 py-3.5">Total Amount</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-10 text-gray-400 italic">
                          No bookings matches the filter query.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => (
                        <tr key={b.bookingId} className="hover:bg-[#fffdfa] transition-colors">
                          <td className="px-4 py-3.5 font-mono font-bold text-[#5d100a]">{b.bookingId}</td>
                          <td className="px-4 py-3.5 font-mono font-extrabold text-gray-800 bg-amber-50/50">{b.uniqueCode}</td>
                          <td className="px-4 py-3.5">
                            <p className="font-bold text-gray-900">{b.userName}</p>
                            <p className="text-[10px] text-gray-500">{b.userPhone}</p>
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="font-semibold text-gray-900 leading-snug">{b.packageName}</p>
                            <p className="text-[10px] text-gray-500">Date: {b.tourDate}</p>
                            {b.selectedAddons && b.selectedAddons.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {b.selectedAddons.map((addon) => (
                                  <span key={addon.id} className="bg-amber-50 text-amber-850 border border-amber-200/60 text-[8px] font-semibold px-1 py-0.5 rounded leading-none">
                                    {addon.name} (+₹{addon.price})
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3.5 font-bold text-gray-700 text-center">{b.numberOfSeats}</td>
                          <td className="px-4 py-3.5 font-bold text-[#5d100a]">₹{b.totalAmount.toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                                b.status === 'Confirmed'
                                  ? 'bg-amber-50 text-amber-800 border-amber-300/40'
                                  : b.status === 'Checked-In'
                                  ? 'bg-purple-50 text-purple-800 border-purple-300/40'
                                  : b.status === 'Completed'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300/40'
                                  : 'bg-rose-50 text-rose-800 border-rose-300/40'
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {b.status === 'Confirmed' && (
                                <button
                                  onClick={() => handleCheckIn(b.bookingId)}
                                  className="bg-[#5d100a] text-white text-[9px] font-bold px-2 py-1 rounded cursor-pointer"
                                >
                                  Board Check-In
                                </button>
                              )}
                              {b.status !== 'Completed' && b.status !== 'Cancelled' && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(b.bookingId, 'Completed')}
                                  className="bg-emerald-600 text-white text-[9px] font-bold px-2 py-1 rounded cursor-pointer"
                                >
                                  Complete
                                </button>
                              )}
                              {b.status !== 'Cancelled' && b.status !== 'Completed' && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(b.bookingId, 'Cancelled')}
                                  className="bg-rose-600 text-white text-[9px] font-bold px-2 py-1 rounded cursor-pointer"
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

        {/* TAB 5: ONBOARDING VERIFICATION CONSOLE */}
        {activeTab === 'verify' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/50 shadow-md space-y-6">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-200">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#5d100a]">Onboarding verification console</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Scan the ticket QR or enter the devotee's 6-character Unique Code or Booking ID to verify status and allow onboarding.
                </p>
              </div>

              {/* Verify Form */}
              <form onSubmit={handleVerifyBooking} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Enter code (e.g. KPG459 or SWX-882194)"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-mono font-bold tracking-widest text-center uppercase focus:outline-none focus:border-[#5d100a] text-gray-800 bg-gray-50 focus:bg-white"
                />
                
                <button
                  type="submit"
                  className="bg-[#5d100a] hover:bg-[#801810] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs border border-[#c5a059]/30 shrink-0"
                >
                  Verify Ticket
                </button>
              </form>

              {verificationError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-xl flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{verificationError}</span>
                </div>
              )}

              {/* Verified Details display */}
              {verifiedBooking && (
                <div className="bg-[#fffdfa] border border-[#c5a059]/40 p-5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <div>
                      <h4 className="font-bold text-xs text-gray-500 uppercase tracking-wider">Pass details</h4>
                      <h5 className="font-serif font-bold text-sm text-[#5d100a] mt-0.5">{verifiedBooking.packageName}</h5>
                    </div>

                    <span
                      className={`text-[9px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                        verifiedBooking.status === 'Confirmed'
                          ? 'bg-amber-50 text-amber-800 border-amber-300/40'
                          : verifiedBooking.status === 'Checked-In'
                          ? 'bg-purple-50 text-purple-800 border-purple-300/40'
                          : verifiedBooking.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300/40'
                          : 'bg-rose-50 text-rose-800 border-rose-300/40'
                      }`}
                    >
                      {verifiedBooking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-xs">
                    <div>
                      <span className="text-gray-400 block text-[9px] uppercase font-bold">Devotee Name</span>
                      <span className="font-bold text-gray-800">{verifiedBooking.userName}</span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[9px] uppercase font-bold">Tour Date</span>
                      <span className="font-bold text-gray-800">{verifiedBooking.tourDate}</span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[9px] uppercase font-bold">Seats Booked</span>
                      <span className="font-bold text-gray-800">{verifiedBooking.numberOfSeats} Person(s)</span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[9px] uppercase font-bold">Total Dakshina</span>
                      <span className="font-bold text-[#5d100a]">₹{verifiedBooking.totalAmount.toLocaleString('en-IN')}</span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[9px] uppercase font-bold">Booking ID / Code</span>
                      <span className="font-mono font-bold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">
                        {verifiedBooking.bookingId} / {verifiedBooking.uniqueCode}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[9px] uppercase font-bold">Contact Phone</span>
                      <span className="font-bold text-gray-800">{verifiedBooking.userPhone}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex gap-2">
                    {verifiedBooking.status === 'Confirmed' ? (
                      <button
                        onClick={() => handleCheckIn(verifiedBooking.bookingId)}
                        className="flex-1 bg-[#5d100a] text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-opacity-95 transition-all shadow-xs border border-[#c5a059]/30 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-4 h-4 text-[#c5a059]" />
                        <span>Perform Board check-in</span>
                      </button>
                    ) : verifiedBooking.status === 'Checked-In' ? (
                      <div className="flex-1 bg-emerald-50 text-emerald-800 border border-emerald-300/40 p-2.5 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Devotee Already Checked In for Onboarding</span>
                      </div>
                    ) : (
                      <div className="flex-1 bg-gray-100 text-gray-600 p-2.5 rounded-xl text-center text-xs font-bold">
                        Ticket is {verifiedBooking.status} (Check-in Disabled)
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Package Creation/Edit Dialog */}
      {showAddPackageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-[#c5a059]/40 my-8 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-[#5d100a]">
                {editingPackage ? 'Edit Devotional Package' : 'Create Devotional Package'}
              </h3>
              <button
                onClick={() => {
                  setShowAddPackageModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">Package Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pancha Dwarka Sacred Yatra"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5d100a] text-gray-800 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the spiritual journey..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5d100a] text-gray-800 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">Duration *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 Days / 4 Nights"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5d100a] text-gray-800 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">Dakshina (Price/Seat) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 15000"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5d100a] text-gray-800 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-2 py-2 text-xs focus:outline-none focus:border-[#5d100a] text-gray-800 font-semibold"
                  >
                    <option value="South India">South India</option>
                    <option value="North India">North India</option>
                    <option value="Char Dham">Char Dham</option>
                    <option value="Himalayan Circuit">Himalayan Circuit</option>
                    <option value="Central & West India">Central & West India</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">Cover Image</label>
                  <div className="space-y-1.5">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-[#5d100a]/10 file:text-[#5d100a] hover:file:bg-[#5d100a]/20 cursor-pointer"
                    />
                    {uploadingImage && (
                      <span className="text-[10px] text-amber-600 block animate-pulse">Uploading to Supabase Storage...</span>
                    )}
                    {uploadError && (
                      <span className="text-[10px] text-rose-600 block">{uploadError}</span>
                    )}
                    <input
                      type="text"
                      placeholder="Or paste cover image URL..."
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5d100a] text-gray-800 font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">Highlights (comma separated)</label>
                <input
                  type="text"
                  placeholder="Ganga Aarti, Special Entry, Triveni dip..."
                  value={formHighlights}
                  onChange={(e) => setFormHighlights(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5d100a] text-gray-800 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">Inclusions (comma separated)</label>
                  <input
                    type="text"
                    placeholder="AC hotel, Veg meals, Guide..."
                    value={formInclusions}
                    onChange={(e) => setFormInclusions(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5d100a] text-gray-800 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">Exclusions (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Airfare, Personal pooja fees..."
                    value={formExclusions}
                    onChange={(e) => setFormExclusions(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5d100a] text-gray-800 font-semibold"
                  />
                </div>
              </div>

              {/* Devotional Add-ons Section */}
              <div className="border-t border-gray-100 pt-3 space-y-2">
                <h4 className="font-serif font-bold text-sm text-[#5d100a]">Devotional Add-ons (e.g. Pooja Sets)</h4>
                
                {/* Addons List */}
                {formAddons.length > 0 ? (
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {formAddons.map((addon) => (
                      <div key={addon.id} className="flex justify-between items-center bg-amber-50/50 border border-amber-200/45 rounded-xl p-2 text-[10px]">
                        <div>
                          <span className="font-bold text-gray-900">{addon.name}</span>
                          <span className="text-[#5d100a] font-bold ml-2">₹{addon.price}</span>
                          {addon.description && <p className="text-[9px] text-gray-500 italic mt-0.5">{addon.description}</p>}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAddon(addon.id)}
                          className="text-rose-600 hover:text-rose-800 font-bold hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-gray-400 italic">No add-ons created for this package yet.</p>
                )}

                {/* Add New Addon Form */}
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200/50 space-y-2">
                  <span className="text-[9px] uppercase font-bold text-gray-400 block">Add New Add-on Option</span>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <input
                        type="text"
                        placeholder="Add-on Name (e.g. Special Pooja Kit)"
                        value={newAddonName}
                        onChange={(e) => setNewAddonName(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1.5 text-[10px] focus:outline-none focus:border-[#5d100a] text-gray-800 font-medium"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Price (₹)"
                        value={newAddonPrice || ''}
                        onChange={(e) => setNewAddonPrice(Number(e.target.value))}
                        className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1.5 text-[10px] focus:outline-none focus:border-[#5d100a] text-gray-800 font-medium"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add-on description / notes (optional)"
                      value={newAddonDesc}
                      onChange={(e) => setNewAddonDesc(e.target.value)}
                      className="flex-1 bg-white border border-gray-300 rounded-lg px-2 py-1.5 text-[10px] focus:outline-none focus:border-[#5d100a] text-gray-800 font-medium"
                    />
                    <button
                      type="button"
                      onClick={handleAddAddon}
                      className="bg-[#c5a059] text-white font-bold text-[10px] px-3 py-1.5 rounded-lg hover:bg-opacity-95 cursor-pointer shrink-0"
                    >
                      + Add Item
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="accent-[#5d100a]"
                />
                <label htmlFor="isActive" className="font-bold text-gray-700">Publish immediately to website</label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddPackageModal(false);
                    resetForm();
                  }}
                  className="text-xs font-bold text-gray-500 hover:underline cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#5d100a] text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-opacity-95 transition-all shadow-md cursor-pointer border border-[#c5a059]/30"
                >
                  {editingPackage ? 'Save Changes' : 'Publish Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminDashboard;
