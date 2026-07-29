import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PopularTemples } from './components/PopularTemples';
import { LiveDarshanWidget } from './components/LiveDarshanWidget';
import { PlanYourYatra } from './components/PlanYourYatra';
import { FestivalCalendar } from './components/FestivalCalendar';
import { TamilCalendarSection } from './components/TamilCalendarSection';
import { SthalaPuranaStories } from './components/SthalaPuranaStories';
import { CommunityJournals } from './components/CommunityJournals';
import { StatsBar } from './components/StatsBar';
import { AppFooter } from './components/AppFooter';

// Modals
import { SevaBookingModal } from './components/SevaBookingModal';
import { TripPlannerModal } from './components/TripPlannerModal';
import { PuranaModal } from './components/PuranaModal';
import { LiveStatusModal } from './components/LiveStatusModal';
import { JournalsModal } from './components/JournalsModal';
import { TempleDetailModal } from './components/TempleDetailModal';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';

// Data Types & Fallbacks
import { Temple, LiveDarshanStatus, Festival, PuranaStory, Journal, SevaOption, YatraStop } from './types';
import {
  MOCK_TEMPLES,
  MOCK_LIVE_CROWD,
  MOCK_FESTIVALS,
  MOCK_PURANA_STORIES,
  MOCK_JOURNALS,
  MOCK_SEVAS,
  MOCK_YATRA_STOPS
} from './data/mockData';

export function App() {
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined' && (window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin'))) {
      return 'admin';
    }
    return 'home';
  });
  const [seniorMode, setSeniorMode] = useState<boolean>(false);
  const [selectedLang, setSelectedLang] = useState<string>('EN');

  // Dynamic Data
  const [temples, setTemples] = useState<Temple[]>(
    MOCK_TEMPLES.filter((t) => t.id !== 'rameshwaram' && !t.name.toLowerCase().includes('ramanathaswamy'))
  );
  const [liveStatuses, setLiveStatuses] = useState<LiveDarshanStatus[]>(MOCK_LIVE_CROWD);
  const [festivals, setFestivals] = useState<Festival[]>(MOCK_FESTIVALS);
  const [puranaStories, setPuranaStories] = useState<PuranaStory[]>(MOCK_PURANA_STORIES);
  const [journals, setJournals] = useState<Journal[]>(MOCK_JOURNALS);
  const [sevas, setSevas] = useState<SevaOption[]>(MOCK_SEVAS);

  // Modals state
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showSevaModal, setShowSevaModal] = useState<boolean>(false);
  const [sevaTempleTarget, setSevaTempleTarget] = useState<string>('Tirupati Balaji Temple');

  const [showTripPlannerModal, setShowTripPlannerModal] = useState<boolean>(false);
  const [showPuranaModal, setShowPuranaModal] = useState<boolean>(false);
  const [activePuranaStory, setActivePuranaStory] = useState<PuranaStory>(MOCK_PURANA_STORIES[0]);

  const [showLiveStatusModal, setShowLiveStatusModal] = useState<boolean>(false);
  const [showJournalsModal, setShowJournalsModal] = useState<boolean>(false);
  const [journalsWriteMode, setJournalsWriteMode] = useState<boolean>(false);

  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);

  // Fetch initial data from server APIs
  useEffect(() => {
    fetch('/api/temples')
      .then((r) => r.json())
      .then((d) => {
        if (d.temples) {
          setTemples(d.temples.filter((t: Temple) => t.id !== 'rameshwaram' && !t.name.toLowerCase().includes('ramanathaswamy')));
        }
      })
      .catch((e) => console.log('Using local temples fallback', e));

    fetch('/api/live-crowd')
      .then((r) => r.json())
      .then((d) => d.liveCrowd && setLiveStatuses(d.liveCrowd))
      .catch((e) => console.log('Using local live crowd fallback', e));

    fetch('/api/festivals')
      .then((r) => r.json())
      .then((d) => d.festivals && setFestivals(d.festivals))
      .catch((e) => console.log('Using local festivals fallback', e));

    fetch('/api/puranas')
      .then((r) => r.json())
      .then((d) => d.puranaStories && setPuranaStories(d.puranaStories))
      .catch((e) => console.log('Using local purana stories fallback', e));

    fetch('/api/sevas')
      .then((r) => r.json())
      .then((d) => d.sevas && setSevas(d.sevas))
      .catch((e) => console.log('Using local sevas fallback', e));

    fetch('/api/journals')
      .then((r) => r.json())
      .then((d) => d.journals && setJournals(d.journals))
      .catch((e) => console.log('Using local journals fallback', e));
  }, []);

  // Listen for browser navigation changes (/admin)
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === '/admin') {
        setActiveTab('admin');
      } else {
        setActiveTab('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'admin') {
      if (window.location.pathname !== '/admin') {
        window.history.pushState({}, '', '/admin');
      }
    } else {
      if (window.location.pathname === '/admin') {
        window.history.pushState({}, '', '/');
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Search handler from Hero Section
  const handleHeroSearch = (query: string, state: string, festival: string) => {
    let filtered = [...MOCK_TEMPLES];
    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.deity.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q)
      );
    }
    if (state && state !== 'All States') {
      filtered = filtered.filter((t) => t.state === state);
    }
    setTemples(filtered);
    setActiveTab('temples');
  };

  const handleOpenSevaModal = (templeName?: string) => {
    if (templeName) setSevaTempleTarget(templeName);
    setShowSevaModal(true);
  };

  const handleOpenPuranaModalForStory = (story: PuranaStory) => {
    setActivePuranaStory(story);
    setShowPuranaModal(true);
  };

  const handleOpenPuranaForTemple = (templeName: string) => {
    const found = puranaStories.find((p) =>
      p.templeName.toLowerCase().includes(templeName.toLowerCase())
    );
    setActivePuranaStory(found || puranaStories[0]);
    setShowPuranaModal(true);
  };

  const handleAddJournalEntry = (newJ: Journal) => {
    setJournals((prev) => [newJ, ...prev]);
  };

  if (activeTab === 'admin') {
    return (
      <AdminDashboard
        temples={temples}
        liveStatuses={liveStatuses}
        festivals={festivals}
        journals={journals}
        onExitAdmin={() => handleTabChange('home')}
      />
    );
  }

  return (
    <div
      className={`min-h-screen bg-[#fff8f5] text-[#534341] flex flex-col font-sans transition-all ${
        seniorMode ? 'text-lg leading-relaxed font-semibold' : ''
      }`}
    >
      {/* Top Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenAdmin={() => handleTabChange('admin')}
        seniorMode={seniorMode}
        setSeniorMode={setSeniorMode}
        selectedLang={selectedLang}
        setSelectedLang={setSelectedLang}
      />

      {/* Main Body Layout */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            {/* Hero Section */}
            <HeroSection
              onSearch={handleHeroSearch}
              onQuickLinkClick={(target) => {
                if (target === 'purana') setShowPuranaModal(true);
                else if (target === 'seva') handleOpenSevaModal();
                else if (target === 'planner') setShowTripPlannerModal(true);
                else if (target === 'temples') setShowLiveStatusModal(true);
                else setActiveTab(target);
              }}
              onToggleSeniorMode={() => setSeniorMode(!seniorMode)}
            />

            {/* Main Content Sections */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12 space-y-12">
              {/* Row 1: Popular Temples (3 cols) + Live Darshan Load Widget (1 col) */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-stretch">
                <div className="lg:col-span-3">
                  <PopularTemples
                    temples={temples}
                    onSelectTemple={(t) => setSelectedTemple(t)}
                    onViewAllTemples={() => setActiveTab('temples')}
                    onBookSeva={(tName) => handleOpenSevaModal(tName)}
                  />
                </div>

                <div className="lg:col-span-1">
                  <LiveDarshanWidget
                    liveStatuses={liveStatuses}
                    onOpenFullLiveModal={() => setShowLiveStatusModal(true)}
                  />
                </div>
              </div>

              {/* Row 2: Plan Your Yatra Section */}
              <PlanYourYatra
                stops={MOCK_YATRA_STOPS}
                onOpenTripPlannerModal={() => setShowTripPlannerModal(true)}
                onSelectStop={(stop) => {
                  const t = temples.find((x) => x.name.includes(stop.name)) || temples[0];
                  setSelectedTemple(t);
                }}
              />

              {/* Row 3: Festival Calendar (1 col) + Sthala Purana Stories (1 col) + Community Journals (1 col) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                <FestivalCalendar
                  festivals={festivals}
                  onOpenCalendarModal={() => setActiveTab('festivals')}
                  onSelectFestival={() => setActiveTab('festivals')}
                />

                <SthalaPuranaStories
                  story={puranaStories[0] || MOCK_PURANA_STORIES[0]}
                  onOpenPuranaModal={(s) => handleOpenPuranaModalForStory(s)}
                  onExploreStories={() => setShowPuranaModal(true)}
                />

                <CommunityJournals
                  journals={journals}
                  onOpenJournalsModal={() => {
                    setJournalsWriteMode(false);
                    setShowJournalsModal(true);
                  }}
                  onWriteJournalModal={() => {
                    setJournalsWriteMode(true);
                    setShowJournalsModal(true);
                  }}
                />
              </div>
            </div>

            {/* Stats Bar */}
            <StatsBar />
          </>
        )}

        {/* Tab 2: Temples Directory View */}
        {activeTab === 'temples' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-10 space-y-8">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-3xl font-serif font-bold text-[#5d100a]">
                Sacred Temple Directory
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Explore thousands of ancient shrines, live queue statuses, darshan timings, and Sthala Puranas.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {temples.map((temple) => (
                <div
                  key={temple.id}
                  onClick={() => setSelectedTemple(temple)}
                  className="bg-white rounded-xl overflow-hidden card-shadow border border-gray-200 hover:border-[#c5a059] transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={temple.image}
                        alt={temple.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        ~{temple.waitTimeMinutes}m wait
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <h3 className="font-serif font-bold text-base text-gray-900 group-hover:text-[#5d100a] transition-colors">
                        {temple.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {temple.location}, {temple.state}
                      </p>
                      <p className="text-xs text-gray-700 line-clamp-2 italic font-serif">
                        "{temple.specialty}"
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenSevaModal(temple.name);
                      }}
                      className="flex-1 bg-[#5d100a] text-white py-2 rounded text-xs font-bold hover:bg-opacity-90"
                    >
                      Book Seva
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenPuranaForTemple(temple.name);
                      }}
                      className="flex-1 bg-white border border-[#c5a059] text-[#5d100a] py-2 rounded text-xs font-bold hover:bg-[#fff8f5]"
                    >
                      Sthala Purana
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Trip Planner View */}
        {activeTab === 'planner' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-10 space-y-8">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-3xl font-serif font-bold text-[#5d100a]">
                AI Panchangam Yatra Trip Planner
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Customize auspicious pilgrimage routes based on family senior needs, crowd levels, and tithis.
              </p>
            </div>

            <PlanYourYatra
              stops={MOCK_YATRA_STOPS}
              onOpenTripPlannerModal={() => setShowTripPlannerModal(true)}
              onSelectStop={(stop) => {
                const t = temples.find((x) => x.name.includes(stop.name)) || temples[0];
                setSelectedTemple(t);
              }}
            />
          </div>
        )}

        {/* Tab 4: Festivals & Tamil Calendar View */}
        {activeTab === 'festivals' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-10 space-y-10">
            {/* Tamil Calendar & Panchangam Interactive Section */}
            <TamilCalendarSection />

            {/* General Festivals Overview */}
            <div className="space-y-6 pt-4 border-t border-gray-200">
              <div className="border-b border-gray-200 pb-3">
                <h3 className="text-2xl font-serif font-bold text-[#5d100a]">
                  Pan-Indian Sacred Festival Calendar
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  Panchangam-verified divine festivals, Brahmotsavams, and Rath Yatras.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {festivals.map((fest) => (
                  <div
                    key={fest.id}
                    className="bg-white p-6 rounded-xl card-shadow border border-gray-200 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <span className="bg-[#fbf2ed] text-[#5d100a] font-bold text-xs px-3 py-1 rounded-md">
                        {fest.month} {fest.dateNumber}
                      </span>
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {fest.status}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-lg text-gray-900">
                      {fest.name}
                    </h3>
                    <p className="text-xs text-[#5d100a] font-semibold">
                      {fest.templeName}
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {fest.description}
                    </p>
                    <div className="bg-[#fff8f5] p-2.5 rounded-lg border border-[#c5a059]/20 text-xs font-semibold text-gray-800">
                      ✨ Auspicious Tithi: {fest.tithi}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Seva Booking View */}
        {activeTab === 'seva' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-10 space-y-8">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-3xl font-serif font-bold text-[#5d100a]">
                Official Seva & Archanai Booking
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Book fast-track e-passes for Special Entry Darshan, Abhishekam, and Sahasranama Archana.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sevas.map((seva) => (
                <div
                  key={seva.id}
                  className="bg-white p-6 rounded-xl card-shadow border border-gray-200 space-y-4 flex flex-col justify-between"
                >
                  <div>
                    <span className="bg-[#5d100a] text-white text-[10px] font-bold px-2.5 py-0.5 rounded uppercase">
                      {seva.templeName}
                    </span>
                    <h3 className="text-lg font-bold font-serif text-gray-900 mt-2">
                      {seva.sevaName}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {seva.description}
                    </p>
                    <p className="text-xs text-gray-500 font-semibold mt-2">
                      🕒 Timing: {seva.timing}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-bold block">Dakshina</span>
                      <span className="text-lg font-bold text-[#5d100a]">Rs. {seva.price}</span>
                    </div>
                    <button
                      onClick={() => handleOpenSevaModal(seva.templeName)}
                      className="bg-[#5d100a] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-opacity-90 cursor-pointer"
                    >
                      Book E-Pass
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Pilgrim Journals View */}
        {activeTab === 'journals' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-10 space-y-8">
            <div className="border-b border-gray-200 pb-4 flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-serif font-bold text-[#5d100a]">
                  Community Yatra Journals & Pilgrim Notes
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Read honest pilgrim tips, senior citizen accessibility reviews, and spiritual moments.
                </p>
              </div>
              <button
                onClick={() => {
                  setJournalsWriteMode(true);
                  setShowJournalsModal(true);
                }}
                className="bg-[#5d100a] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-opacity-90 cursor-pointer"
              >
                Write a Note
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {journals.map((journal) => (
                <div
                  key={journal.id}
                  className="bg-white p-6 rounded-xl card-shadow border border-gray-200 space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <img
                        src={journal.authorAvatar}
                        alt={journal.authorName}
                        className="w-10 h-10 rounded-full object-cover border border-[#c5a059]"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">
                          {journal.authorName}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Visited {journal.templeVisited}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#c5a059]">
                      ★ {journal.rating}/5
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-[#5d100a]">
                    {journal.title}
                  </h3>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {journal.content}
                  </p>
                  {journal.tipsForPilgrims && (
                    <div className="bg-[#fff8f5] p-3 rounded-lg border border-[#c5a059]/30 text-xs text-gray-800">
                      <strong>💡 Pilgrim Tip: </strong>
                      {journal.tipsForPilgrims}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 7: Sthala Purana Library View */}
        {activeTab === 'purana' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-10 space-y-8">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-3xl font-serif font-bold text-[#5d100a]">
                Sacred Sthala Purana Library
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Authentic Puranic legends, origin stories, and spiritual secrets of ancient shrines.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {puranaStories.map((s) => (
                <div
                  key={s.id}
                  onClick={() => handleOpenPuranaModalForStory(s)}
                  className="bg-white rounded-xl overflow-hidden card-shadow border border-gray-200 hover:border-[#c5a059] transition-all cursor-pointer group"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 flex items-end">
                      <p className="text-white text-xs font-serif italic">
                        "{s.significance}"
                      </p>
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="text-[10px] text-[#c5a059] font-bold uppercase tracking-wider">
                      {s.templeName}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-[#5d100a]">
                      {s.title}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed font-serif">
                      {s.summary}
                    </p>
                    <button className="text-xs font-bold text-[#5d100a] group-hover:underline pt-2 block">
                      Read Full Story & Audio Narration →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <AppFooter onNavClick={(tab) => handleTabChange(tab)} />

      {/* Modals Container */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      {showSevaModal && (
        <SevaBookingModal
          sevas={sevas}
          preselectedTempleName={sevaTempleTarget}
          onClose={() => setShowSevaModal(false)}
        />
      )}

      {showTripPlannerModal && (
        <TripPlannerModal
          initialStops={MOCK_YATRA_STOPS}
          onClose={() => setShowTripPlannerModal(false)}
        />
      )}

      {showPuranaModal && (
        <PuranaModal
          story={activePuranaStory}
          allStories={puranaStories}
          onSelectStory={(s) => setActivePuranaStory(s)}
          onClose={() => setShowPuranaModal(false)}
        />
      )}

      {showLiveStatusModal && (
        <LiveStatusModal
          statuses={liveStatuses}
          onBookSevaForTemple={(tName) => handleOpenSevaModal(tName)}
          onClose={() => setShowLiveStatusModal(false)}
        />
      )}

      {showJournalsModal && (
        <JournalsModal
          journals={journals}
          onAddJournal={handleAddJournalEntry}
          onClose={() => setShowJournalsModal(false)}
          startInWriteMode={journalsWriteMode}
        />
      )}

      {selectedTemple && (
        <TempleDetailModal
          temple={selectedTemple}
          onBookSeva={(tName) => handleOpenSevaModal(tName)}
          onReadPurana={(tName) => handleOpenPuranaForTemple(tName)}
          onClose={() => setSelectedTemple(null)}
        />
      )}
    </div>
  );
}

export default App;
