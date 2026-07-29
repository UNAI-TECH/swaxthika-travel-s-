import React, { useState } from 'react';
import { Calendar, Sparkles, Clock, Sun, Moon, MapPin, ChevronRight, CheckCircle2, Search } from 'lucide-react';

export interface TamilFestivalItem {
  id: string;
  nameTamil: string;
  nameEng: string;
  tamilMonth: string;
  tamilDate: string;
  englishDate: string;
  templeName: string;
  location: string;
  tithi: string;
  significance: string;
  badge?: string;
}

export const TAMIL_MONTHS = [
  { id: 'chithirai', nameTamil: 'சித்திரை', nameEng: 'Chithirai', season: 'ஏப்ரல் - மே' },
  { id: 'vaikasi', nameTamil: 'வைகாசி', nameEng: 'Vaikasi', season: 'மே - ஜூன்' },
  { id: 'aani', nameTamil: 'ஆனி', nameEng: 'Aani', season: 'ஜூன் - ஜூலை' },
  { id: 'aadi', nameTamil: 'ஆடி', nameEng: 'Aadi', season: 'ஜூலை - ஆகஸ்ட்' },
  { id: 'aavani', nameTamil: 'ஆவணி', nameEng: 'Aavani', season: 'ஆகஸ்ட் - செப்டம்பர்' },
  { id: 'purattasi', nameTamil: 'புரட்டாசி', nameEng: 'Purattasi', season: 'செப்டம்பர் - அக்டோபர்' },
  { id: 'aippasi', nameTamil: 'ஐப்பசி', nameEng: 'Aippasi', season: 'அக்டோபர் - நவம்பர்' },
  { id: 'karthigai', nameTamil: 'கார்த்திகை', nameEng: 'Karthigai', season: 'நவம்பர் - டிசம்பர்' },
  { id: 'margazhi', nameTamil: 'மார்கழி', nameEng: 'Margazhi', season: 'டிசம்பர் - ஜனவரி' },
  { id: 'thai', nameTamil: 'தை', nameEng: 'Thai', season: 'ஜனவரி - பிப்ரவரி' },
  { id: 'masi', nameTamil: 'மாசி', nameEng: 'Masi', season: 'பிப்ரவரி - மார்ச்' },
  { id: 'panguni', nameTamil: 'பங்குனி', nameEng: 'Panguni', season: 'மார்ச் - ஏப்ரல்' },
];

export const MOCK_TAMIL_FESTIVALS: TamilFestivalItem[] = [
  {
    id: 'aadi-perukku',
    nameTamil: 'ஆடிப் பெருக்கு (18ஆம் பெருக்கு)',
    nameEng: 'Aadi Perukku (18th Day of Aadi)',
    tamilMonth: 'aadi',
    tamilDate: 'ஆடி 18',
    englishDate: 'ஆகஸ்ட் 3',
    templeName: 'ஸ்ரீரங்கம் ரங்கநாதர் & காவிரி நதிக்கரைகள்',
    location: 'Srirangam & Trichy, Tamil Nadu',
    tithi: 'சுக்ல பக்ஷ சப்தமி',
    significance: 'புனித காவிரி அன்னைக்கு நன்றி தெரிவித்து வளம் பெற நீர் வழிபாடு மற்றும் ஸ்ரீரங்கம் பெருமாள் வஸ்திர சமர்ப்பணம்.',
    badge: 'சிறப்பு திருவிழா'
  },
  {
    id: 'aadi-pooram',
    nameTamil: 'ஆடிப் பூரம் (ஆண்டாள் ஜெயந்தி)',
    nameEng: 'Aadi Pooram (Andal Jayanthi)',
    tamilMonth: 'aadi',
    tamilDate: 'ஆடி 24',
    englishDate: 'ஆகஸ்ட் 9',
    templeName: 'ஸ்ரீவில்லிபுத்தூர் ஆண்டாள் திருக்கோயில்',
    location: 'Srivilliputhur, Tamil Nadu',
    tithi: 'பூர நட்சத்திரம்',
    significance: 'பூமிதேவியின் அவதாரமான ஶ்ரீஆண்டாள் அவதார திருநாள். ஆயிரக்கணக்கில் வளையல்கள் சாற்றி அம்மன் அருள் பெறல்.',
    badge: 'முக்கிய விரதம்'
  },
  {
    id: 'chithirai-vishu',
    nameTamil: 'தமிழர் புத்தாண்டு (சித்திரை விஷு)',
    nameEng: 'Tamil New Year (Chithirai Vishu)',
    tamilMonth: 'chithirai',
    tamilDate: 'சித்திரை 1',
    englishDate: 'ஏப்ரல் 14',
    templeName: 'அனைத்து தமிழ் திருக்கோயில்கள்',
    location: 'Pan-Tamil Nadu',
    tithi: 'மேஷ ரவி சங்ரமணம்',
    significance: 'புதிய தமிழ் ஆண்டின் தொடக்கம். மங்களகரமான கனி காணுதல் மற்றும் பஞ்சாங்கம் வாசித்தல்.',
    badge: 'புத்தாண்டு'
  },
  {
    id: 'chithirai-thiruvizha',
    nameTamil: 'மதுரை சித்திரை திருவிழா & கள்ளழகர் வைகை ஆற்றில் இறங்குதல்',
    nameEng: 'Madurai Chithirai Thiruvizha & Kallazhagar',
    tamilMonth: 'chithirai',
    tamilDate: 'சித்திரை 15',
    englishDate: 'ஏப்ரல் 28',
    templeName: 'மதுரை மீனாட்சி சுந்தரேஸ்வரர் & அழகர்கோவில்',
    location: 'Madurai, Tamil Nadu',
    tithi: 'பௌர்ணமி',
    significance: 'மீனாட்சி திருக்கல்யாணம் மற்றும் கள்ளழகர் தங்கக் குதிரை வாகனத்தில் வைகை ஆற்றில் எழுந்தருளும் வைபவம்.',
    badge: 'மகா உத்ஸவம்'
  },
  {
    id: 'vaikasi-visakam',
    nameTamil: 'வைகாசி விசாகம் (முருகன் அவதாரம்)',
    nameEng: 'Vaikasi Visakam (Lord Murugan Avatharam)',
    tamilMonth: 'vaikasi',
    tamilDate: 'வைகாசி 20',
    englishDate: 'ஜூன் 3',
    templeName: 'திருச்செந்தூர் & சுவாமிமலை ஆறுபடை வீடுகள்',
    location: 'Tiruchendur & Swamimalai, Tamil Nadu',
    tithi: 'விசாக நட்சத்திரம் பௌர்ணமி',
    significance: 'சிவபெருமானின் நெற்றிக்கண்ணிலிருந்து முருகப்பெருமான் அவதரித்த திருநாள். பால்குட ஆட்டம் மற்றும் சிறப்பு அபிஷேகம்.',
    badge: 'முருகன் உத்ஸவம்'
  },
  {
    id: 'aani-thirumanjanam',
    nameTamil: 'ஆனி திருமஞ்சனம் (நடராஜர் மகா அபிஷேகம்)',
    nameEng: 'Aani Thirumanjanam (Chidambaram Natarajar)',
    tamilMonth: 'aani',
    tamilDate: 'ஆனி 25',
    englishDate: 'ஜூலை 9',
    templeName: 'சிதம்பரம் நடராஜர் திருக்கோயில்',
    location: 'Chidambaram, Tamil Nadu',
    tithi: 'உத்திர நட்சத்திரம்',
    significance: 'ஆனந்த தாண்டவ மூர்த்தியான ஸ்ரீ நடராஜ பெருமானுக்கு நடைபெறும் ஆண்டின் முக்கிய மகா அபிஷேகம்.',
    badge: 'சிவன் உத்ஸவம்'
  },
  {
    id: 'aavani-avittam',
    nameTamil: 'ஆவணி அவிட்டம் & காயத்ரி ஜபம்',
    nameEng: 'Aavani Avittam & Gayathri Japam',
    tamilMonth: 'aavani',
    tamilDate: 'ஆவணி 12',
    englishDate: 'ஆகஸ்ட் 28',
    templeName: 'அனைத்து சிவாலயங்கள் & வைணவ க்ஷேத்திரங்கள்',
    location: 'Tamil Nadu & South India',
    tithi: 'அவிட்ட நட்சத்திரம்',
    significance: 'புனித பூணூல் மாற்றுதல் மற்றும் உலக நன்மைக் காக 1008 காயத்ரி மகா மந்திர ஜபம் செய்தல்.',
    badge: 'வேத விரதம்'
  },
  {
    id: 'purattasi-saturday',
    nameTamil: 'புரட்டாசி சனிக்கிழமை விரதம்',
    nameEng: 'Purattasi Saturday Viratham (Srivari Pilgrimage)',
    tamilMonth: 'purattasi',
    tamilDate: 'புரட்டாசி சனி',
    englishDate: 'செப்டம்பர் 26',
    templeName: 'திருப்பதி ஸ்ரீ வெங்கடாஜலபதி திருக்கோயில்',
    location: 'Tirumala & All Vishnu Temples',
    tithi: 'புரட்டாசி மாசம்',
    significance: 'ஸ்ரீனிவாச பெருமாளுக்கு மாவிளக்கு ஏற்றி, தளிகை படைத்து வெங்கடாஜலபதி அருள் பெறும் உன்னத விரதம்.',
    badge: 'பெருமாள் விரதம்'
  },
  {
    id: 'kandha-sashti',
    nameTamil: 'கந்த சஷ்டி சூரசம்ஹாரம்',
    nameEng: 'Kanda Sashti Soorasamharam',
    tamilMonth: 'aippasi',
    tamilDate: 'ஐப்பசி 6',
    englishDate: 'நவம்பர் 15',
    templeName: 'திருச்செந்தூர் சுப்பிரமணியசுவாமி திருக்கோயில்',
    location: 'Tiruchendur, Tamil Nadu',
    tithi: 'சஷ்டி திதி',
    significance: 'சூரபத்மனை ஆட்கொண்டு சேவலும் மயிலுமாக மாற்றிய முருகப்பெருமானின் வீர பராக்கிரம சூரசம்ஹார லீலை.',
    badge: 'வெற்றி விழா'
  },
  {
    id: 'karthigai-deepam',
    nameTamil: 'திருவண்ணாமலை மகா கார்த்திகை தீபம்',
    nameEng: 'Thiruvannamalai Maha Karthigai Deepam',
    tamilMonth: 'karthigai',
    tamilDate: 'கார்த்திகை 10',
    englishDate: 'நவம்பர் 25',
    templeName: 'திருவண்ணாமலை அண்ணாமலையார் திருக்கோயில்',
    location: 'Tiruvannamalai, Tamil Nadu',
    tithi: 'கார்த்திகை நட்சத்திரம் பௌர்ணமி',
    significance: 'அருணாசல மலையின் உச்சியில் ஜோதி வடிவாக இறைவன் காட்சியளிக்கும் மகா தீபத் திருவிழா.',
    badge: 'மகா தீபம்'
  },
  {
    id: 'vaituunda-ekadashi',
    nameTamil: 'ஸ்ரீரங்கம் & திருப்பதி வைகுண்ட ஏகாதசி (பரமபத வாசல் திறப்பு)',
    nameEng: 'Vaikunda Ekadashi (Paramapada Vasal Opening)',
    tamilMonth: 'margazhi',
    tamilDate: 'மார்கழி 15',
    englishDate: 'டிசம்பர் 30',
    templeName: 'ஸ்ரீரங்கம் ரங்கநாதர் & 108 திவ்யதேசங்கள்',
    location: 'Srirangam & Tirupati',
    tithi: 'சுக்ல பக்ஷ ஏகாதசி',
    significance: 'சொர்க்கவாசல் திறப்பு வைபவம். பெருமாளின் திருப்பாதம் தரிசித்து வைகுண்ட பதவி அடையும் பெரும் பேறு.',
    badge: 'ஏகாதசி'
  },
  {
    id: 'thai-pongal',
    nameTamil: 'தைப்பொங்கல் & தைப்பூசம்',
    nameEng: 'Thai Pongal & Thaipusam Festival',
    tamilMonth: 'thai',
    tamilDate: 'தை 1 & தை 15',
    englishDate: 'ஜனவரி 15 & 28',
    templeName: 'பழனி தண்டாயுதபாணி & சுப்பிரமணிய சுவாமி கோயில்கள்',
    location: 'Palani, Swamimalai & Tamil Nadu',
    tithi: 'பூச நட்சத்திரம்',
    significance: 'சூரிய பகவானுக்கு நன்றி செலுத்தும் அறுவடைத் திருநாள் மற்றும் பழனியில் பால்குட பாதயாத்திரை.',
    badge: 'தைப்பூசம்'
  },
];

export const TamilCalendarSection: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('aadi');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentMonthData = TAMIL_MONTHS.find((m) => m.id === selectedMonth) || TAMIL_MONTHS[3];

  const filteredFestivals = MOCK_TAMIL_FESTIVALS.filter((fest) => {
    const matchesMonth = fest.tamilMonth === selectedMonth || selectedMonth === 'all';
    const matchesSearch =
      !searchQuery.trim() ||
      fest.nameTamil.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fest.nameEng.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fest.templeName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMonth && matchesSearch;
  });

  return (
    <div className="bg-[#fffcf7] border border-[#c5a059]/30 rounded-2xl p-6 sm:p-8 space-y-8 shadow-sm">
      {/* Header Title with Tamil Panchangam Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#c5a059]/20 pb-6">
        <div>
          <div className="flex items-center gap-2 text-[#c5a059] font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-[#c5a059]" />
            <span>தமிழ் ஆன்மீக நாட்காட்டி & பஞ்சாங்கம்</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#5d100a]">
            Tamil Calendar & Sacred Temple Festivals
          </h2>
          <p className="text-xs text-[#534341] mt-1 italic">
            Authentic Tamil Panchangam dates, Nalla Neram, Tithis, and Temple Uthsavams.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="தேடு (Search Festival / Temple)..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#c5a059]/40 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5d100a]/20"
          />
          <Search className="w-4 h-4 text-[#c5a059] absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Today's Tamil Panchangam Summary Card */}
      <div className="bg-gradient-to-r from-[#5d100a] to-[#7c1d14] text-white p-5 rounded-xl shadow-md border border-[#c5a059]/40 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-[#c5a059] text-white px-4 py-2.5 rounded-xl text-center shadow-inner font-serif shrink-0">
            <p className="text-[10px] uppercase font-bold tracking-widest opacity-90">தமிழ் மாதம்</p>
            <p className="text-xl font-bold leading-tight">ஆடி 18</p>
            <p className="text-[9px] text-amber-100 font-sans">Aadi Month</p>
          </div>
          <div>
            <span className="bg-[#c5a059]/30 text-amber-200 text-[9px] font-bold px-2 py-0.5 rounded border border-[#c5a059]/40 uppercase tracking-wider">
              இன்றைய பஞ்சாங்கம் • Today's Panchangam
            </span>
            <h3 className="text-lg font-serif font-bold text-white mt-1">
              ஆடிப் பெருக்கு & காவிரி நதி சிறப்பு வழிபாடு
            </h3>
            <p className="text-xs text-amber-100/90 mt-0.5 italic">
              ஸ்ரீரங்கம் ரங்கநாதர் காவிரி நதிக்கரை எழுந்தருளல் • பூசம் நட்சத்திரம் சுக்ல பக்ஷம்
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto text-xs bg-black/20 p-3 rounded-lg border border-white/10 shrink-0">
          <div className="flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-[#c5a059] shrink-0" />
            <div>
              <p className="text-[9px] text-white/60 font-bold uppercase">நல்ல நேரம்</p>
              <p className="font-bold text-amber-100 text-[11px]">09:15 AM - 10:15 AM</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <p className="text-[9px] text-white/60 font-bold uppercase">ராகு காலம்</p>
              <p className="font-bold text-amber-200 text-[11px]">12:00 PM - 01:30 PM</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
            <Moon className="w-4 h-4 text-amber-300 shrink-0" />
            <div>
              <p className="text-[9px] text-white/60 font-bold uppercase">எமகண்டம்</p>
              <p className="font-bold text-white text-[11px]">07:30 AM - 09:00 AM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tamil Months Tabs Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-[#5d100a] uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#c5a059]" />
            <span>தமிழ் மாதங்கள் (Select Tamil Month)</span>
          </h4>
          <span className="text-[10px] text-gray-500 font-medium">
            தற்போதைய மாதம்: <strong className="text-[#5d100a]">{currentMonthData.nameTamil} ({currentMonthData.nameEng})</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setSelectedMonth('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
              selectedMonth === 'all'
                ? 'bg-[#5d100a] text-white border-[#5d100a] shadow-xs'
                : 'bg-white text-gray-700 border-gray-200 hover:border-[#c5a059]'
            }`}
          >
            அனைத்து மாதங்களும் (All Months)
          </button>
          {TAMIL_MONTHS.map((month) => (
            <button
              key={month.id}
              onClick={() => setSelectedMonth(month.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                selectedMonth === month.id
                  ? 'bg-[#5d100a] text-white border-[#5d100a] shadow-xs'
                  : 'bg-white text-[#534341] border-[#c5a059]/30 hover:bg-[#fff8f5]'
              }`}
            >
              <span>{month.nameTamil}</span>
              <span className="text-[10px] ml-1 font-normal opacity-80">({month.nameEng})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tamil Festivals Grid List */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-serif font-bold text-[#5d100a]">
            {selectedMonth === 'all'
              ? 'அனைத்து தமிழ் ஆன்மீகத் திருவிழாக்கள்'
              : `${currentMonthData.nameTamil} மாத ஆன்மீக விசேஷங்கள் (${currentMonthData.nameEng} Festivals)`}
          </h4>
          <span className="text-[10px] bg-[#fbf2ed] text-[#5d100a] font-bold px-2 py-0.5 rounded">
            {filteredFestivals.length} விசேஷங்கள்
          </span>
        </div>

        {filteredFestivals.length === 0 ? (
          <div className="bg-white p-8 rounded-xl text-center border border-dashed border-gray-300">
            <p className="text-sm text-gray-500 italic">
              இந்த தேடலுக்கு திருவிழாக்கள் கிடைக்கவில்லை. வேறு தமிழ் மாதத்தை தேர்ந்தெடுக்கவும்.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFestivals.map((fest) => (
              <div
                key={fest.id}
                className="bg-white p-5 rounded-xl border border-gray-200/80 hover:border-[#c5a059] shadow-xs hover:shadow-md transition-all space-y-3 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#5d100a] text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-2xs">
                      {fest.tamilDate}
                    </span>
                    <span className="text-xs font-semibold text-gray-500">
                      ({fest.englishDate})
                    </span>
                  </div>

                  {fest.badge && (
                    <span className="bg-[#fbf2ed] text-[#5d100a] border border-[#c5a059]/30 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                      {fest.badge}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-serif font-bold text-base text-gray-900 group-hover:text-[#5d100a] transition-colors leading-snug">
                    {fest.nameTamil}
                  </h3>
                  <p className="text-xs text-[#c5a059] font-medium mt-0.5">
                    {fest.nameEng}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-600 border-t border-gray-100 pt-2.5">
                  <MapPin className="w-3.5 h-3.5 text-[#5d100a] shrink-0" />
                  <span className="font-medium truncate">{fest.templeName}</span>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed bg-[#fffcf7] p-2.5 rounded-lg border border-[#c5a059]/20 italic">
                  "{fest.significance}"
                </p>

                <div className="flex items-center justify-between text-[11px] text-[#5d100a] font-bold pt-1">
                  <span className="flex items-center gap-1 text-gray-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>திதி: {fest.tithi}</span>
                  </span>
                  <span className="flex items-center gap-0.5 group-hover:translate-x-1 transition-transform cursor-pointer">
                    தரிசன விவரங்கள்
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
