import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PackageGrid } from './components/PackageGrid';
import { PackageCard } from './components/PackageCard';
import { PackageDetailModal } from './components/PackageDetailModal';
import { BookingConfirmation } from './components/BookingConfirmation';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { StatsBar } from './components/StatsBar';
import { AppFooter } from './components/AppFooter';
import { DevotionalPackage, Booking, UserSession } from './types';
import { ArrowRight } from 'lucide-react';
import { supabase } from './lib/supabase';

// Real-time polling interval (10 seconds)
const POLL_INTERVAL_MS = 10000;

// Map URL pathname to internal tab ID
function pathnameToTab(pathname: string): string {
  switch (pathname) {
    case '/packages': return 'packages';
    case '/my-bookings': return 'my-bookings';
    case '/admin': return 'admin';
    default: return 'home';
  }
}

// Map internal tab ID to URL pathname
function tabToPathname(tab: string): string {
  switch (tab) {
    case 'packages': return '/packages';
    case 'my-bookings': return '/my-bookings';
    case 'admin': return '/admin';
    default: return '/';
  }
}

export function App() {
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return pathnameToTab(window.location.pathname);
    }
    return 'home';
  });

  const [packages, setPackages] = useState<DevotionalPackage[]>([]);
  const [user, setUser] = useState<UserSession | null>(null);
  
  // Modals / Detail states
  const [selectedPackage, setSelectedPackage] = useState<DevotionalPackage | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);

  // Search/Filter state in Hero
  const [heroSearchQuery, setHeroSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Polling reference
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load user session on mount and listen to realtime Auth changes
  useEffect(() => {
    // 1. Initial session load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user) {
        const userSession: UserSession = {
          name: session.user.user_metadata.full_name || session.user.email || 'Devotee',
          email: session.user.email || '',
          avatar: session.user.user_metadata.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          isLoggedIn: true
        };
        setUser(userSession);
        localStorage.setItem('swaxthika_user_session', JSON.stringify(userSession));
      } else {
        // Fallback to localStorage for mock/admin user if no active Supabase Auth session
        const localSession = localStorage.getItem('swaxthika_user_session');
        if (localSession) {
          try {
            setUser(JSON.parse(localSession));
          } catch (e) {
            console.error(e);
          }
        }
      }
    });

    // 2. Real-time auth subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && session.user) {
        const userSession: UserSession = {
          name: session.user.user_metadata.full_name || session.user.email || 'Devotee',
          email: session.user.email || '',
          avatar: session.user.user_metadata.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          isLoggedIn: true
        };
        setUser(userSession);
        localStorage.setItem('swaxthika_user_session', JSON.stringify(userSession));
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('swaxthika_user_session');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch packages from server
  const fetchPackages = useCallback(() => {
    fetch('/api/packages')
      .then((r) => r.json())
      .then((d) => {
        if (d.packages) setPackages(d.packages);
      })
      .catch((e) => console.log('Package fetch error', e));
  }, []);

  // Fetch user bookings
  const fetchUserBookings = useCallback(() => {
    if (!user || !user.isLoggedIn) return;
    
    fetch('/api/admin/bookings')
      .then((r) => r.json())
      .then((d) => {
        if (d.bookings) {
          const filtered = d.bookings.filter(
            (b: Booking) => b.userEmail.toLowerCase() === user.email.toLowerCase()
          );
          setUserBookings(filtered);
        }
      })
      .catch((e) => console.error(e));
  }, [user]);

  // Initial data fetch
  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  useEffect(() => {
    fetchUserBookings();
  }, [fetchUserBookings]);

  // Real-time polling: refresh packages and bookings every POLL_INTERVAL_MS
  useEffect(() => {
    pollTimerRef.current = setInterval(() => {
      fetchPackages();
      if (user && user.isLoggedIn) {
        fetchUserBookings();
      }
    }, POLL_INTERVAL_MS);

    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
      }
    };
  }, [fetchPackages, fetchUserBookings, user]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(pathnameToTab(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const targetPath = tabToPathname(tab);
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignInSuccess = (mockUser: UserSession) => {
    setUser(mockUser);
    setShowAuthModal(false);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Sign out error:", e);
    }
    localStorage.removeItem('swaxthika_user_session');
    setUser(null);
    setUserBookings([]);
    handleTabChange('home');
  };

  const handleBookingComplete = (booking: Booking) => {
    setSelectedPackage(null);
    setConfirmedBooking(booking);
    // Immediately refresh data after booking
    fetchPackages();
    fetchUserBookings();
  };

  // Get categories dynamically
  const categories = ['All', ...Array.from(new Set(packages.map((p) => p.category)))];

  // Search filter for packages page
  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.name.toLowerCase().includes(heroSearchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(heroSearchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || pkg.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Admin Dashboard - only accessible via /admin URL, no button in the UI
  if (activeTab === 'admin') {
    return <AdminDashboard onExitAdmin={() => handleTabChange('home')} />;
  }

  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#534341] flex flex-col font-sans transition-all">
      {/* Header — no admin button, admin only via URL */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        user={user}
        onOpenAuth={() => setShowAuthModal(true)}
        onSignOut={handleSignOut}
      />

      <main className="flex-1">
        {activeTab === 'home' && (
          <div className="space-y-8 sm:space-y-12">
            {/* Hero Section */}
            <HeroSection
              categories={categories}
              selectedCategory={selectedCategory}
              onSearch={(query) => {
                setHeroSearchQuery(query);
                handleTabChange('packages');
              }}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                handleTabChange('packages');
              }}
            />

            {/* Featured Packages Row */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 border-b border-gray-200 pb-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#5d100a]">
                    Featured Devotional Packages
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Select a curated holy tour plan scheduled for departure
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setHeroSearchQuery('');
                    handleTabChange('packages');
                  }}
                  className="text-xs font-bold text-[#5d100a] hover:underline flex items-center gap-1 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-[#c5a059]/30 self-start sm:self-auto"
                >
                  <span>Explore All Packages</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#c5a059]" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {packages.slice(0, 3).map((pkg) => (
                  <div key={pkg.id}>
                    <PackageCard pkg={pkg} onViewDetails={(p) => setSelectedPackage(p)} />
                  </div>
                ))}
              </div>

              {packages.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-200/60 shadow-xs space-y-3">
                  <p className="text-gray-400 font-serif italic text-base sm:text-lg">Loading sacred packages from cloud...</p>
                  <p className="text-xs text-gray-500">If this persists, check that your Supabase connection is configured in the .env file.</p>
                </div>
              )}
            </div>

            {/* Stats Bar */}
            <StatsBar />
          </div>
        )}

        {/* TAB: PACKAGES LISTING */}
        {activeTab === 'packages' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-6 sm:py-10 space-y-6 sm:space-y-8">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#5d100a]">
                Sacred Yatra Packages
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Browse our scheduled pilgrimage packages, select departure dates and book seats.
              </p>
            </div>

            <PackageGrid
              packages={packages}
              onViewDetails={(p) => setSelectedPackage(p)}
            />
          </div>
        )}

        {/* TAB: MY BOOKINGS / Passes */}
        {activeTab === 'my-bookings' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#5d100a]">
                My Devotional Boarding Passes
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Present these digital tickets at the boarding point for verification before yatra onboarding.
              </p>
            </div>

            {userBookings.length === 0 ? (
              <div className="text-center py-12 sm:py-16 bg-white rounded-2xl border border-gray-200/60 shadow-xs space-y-4">
                <p className="text-gray-400 font-serif italic text-base sm:text-lg">No tour packages booked yet.</p>
                <button
                  onClick={() => handleTabChange('packages')}
                  className="bg-[#5d100a] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-opacity-95 cursor-pointer shadow-xs border border-[#c5a059]/30"
                >
                  Explore Holy Tours
                </button>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {userBookings.map((b) => (
                  <div
                    key={b.bookingId}
                    className="bg-white border border-[#c5a059]/30 rounded-2xl overflow-hidden p-4 sm:p-5 shadow-2xs relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5d100a] to-[#c5a059]"></div>
                    
                    <div className="flex-1 space-y-3 sm:space-y-3.5 w-full">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-[#5d100a] text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                          {b.bookingId}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase border ${
                            b.status === 'Confirmed'
                              ? 'bg-amber-50 text-amber-800 border-amber-300/40'
                              : b.status === 'Checked-In'
                              ? 'bg-purple-50 text-purple-800 border-purple-300/40'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-300/40'
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-serif font-bold text-gray-900 leading-snug">{b.packageName}</h3>

                      <div className="grid grid-cols-2 gap-y-2 gap-x-3 sm:gap-x-4 text-xs">
                        <div>
                          <span className="text-gray-400 block text-[9px] uppercase font-bold">Departure Date</span>
                          <span className="font-semibold text-gray-800">{b.tourDate}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[9px] uppercase font-bold">Seats</span>
                          <span className="font-semibold text-gray-800">{b.numberOfSeats} Devotee(s)</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[9px] uppercase font-bold">Devotee Name</span>
                          <span className="font-semibold text-gray-800">{b.userName}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[9px] uppercase font-bold">Unique Code</span>
                          <span className="font-mono font-bold text-[#5d100a] bg-amber-50 px-1.5 rounded">{b.uniqueCode}</span>
                        </div>
                      </div>
                      {b.selectedAddons && b.selectedAddons.length > 0 && (
                        <div className="pt-2.5 border-t border-gray-100 mt-2.5 w-full">
                          <span className="text-gray-400 block text-[9px] uppercase font-bold tracking-wider">Devotional Add-ons</span>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {b.selectedAddons.map((addon) => (
                              <span key={addon.id} className="bg-amber-50 text-amber-850 border border-amber-200/60 text-[9px] px-2 py-0.5 rounded font-bold">
                                {addon.name} (+₹{addon.price})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* QR code verification box */}
                    <div className="shrink-0 flex flex-col items-center bg-[#fffdfa] border border-[#c5a059]/20 p-2.5 rounded-xl shadow-3xs text-center w-full md:w-36">
                      <img src={b.qrCodeUrl} alt="Boarding QR" className="w-20 h-20 mx-auto" />
                      <span className="text-[8px] font-bold text-gray-500 mt-1 uppercase tracking-wider">Onboarding Pass</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <AppFooter onNavClick={(tab) => handleTabChange(tab)} />

      {/* MODALS */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSignInSuccess={handleSignInSuccess}
        />
      )}

      {selectedPackage && (
        <PackageDetailModal
          pkg={selectedPackage}
          user={user}
          onClose={() => setSelectedPackage(null)}
          onOpenAuth={() => setShowAuthModal(true)}
          onBookingComplete={handleBookingComplete}
        />
      )}

      {confirmedBooking && (
        <BookingConfirmation
          booking={confirmedBooking}
          onClose={() => {
            setConfirmedBooking(null);
            handleTabChange('my-bookings');
          }}
        />
      )}
    </div>
  );
}

export default App;
