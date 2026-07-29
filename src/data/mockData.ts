import { Temple, LiveDarshanStatus, Festival, PuranaStory, Journal, SevaOption, YatraStop } from '../types';

export const MOCK_TEMPLES: Temple[] = [
  {
    id: 'tirupati-balaji',
    name: 'Tirupati Balaji Temple',
    deity: 'Lord Venkateswara',
    location: 'Tirupati',
    state: 'Andhra Pradesh',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQBTW8V_o2JWIjVg3vQQ2kotIrP2nTJyYk1ubnINbTv3R2PMmUTqqvb3haWPJ31erxSL9bZ8SodOzGfqEuSPgf0LN8Cn-cyTwr3LCQV6hP5wLwrfO5WK3JwNR8yf2wdcISqMbYx7wseV0OL7lB33nj0cq-T86xyLd86gEnykh68Vov50GjZ6MBlHnPP56c70DKFH2Dgo43copgSF-liBd3kmX4heljTbMtd1Q9ocrmi2MiIYFsu5I',
    crowdLevel: 'Low',
    waitTimeMinutes: 45,
    description: 'Situated atop the sacred Seven Hills of Tirumala, Sri Venkateswara Swamy Temple is one of the most visited and revered pilgrimage destinations in the world.',
    timing: '03:00 AM - 11:30 PM',
    specialty: 'Laddu Prasadam & Suprabhatam Seva',
    sevasAvailable: ['Suprabhatam', 'Thomala Seva', 'Kalyanotsavam', 'Special Entry Darshan (Rs. 300)'],
    builtInCentury: '3rd Century AD',
    architectureStyle: 'Dravidian Architecture',
    sthalaPuranaShort: 'Lord Vishnu manifested as Lord Venkateswara to save humanity from the trials of Kali Yuga.'
  },
  {
    id: 'meenakshi-amman',
    name: 'Meenakshi Amman Temple',
    deity: 'Goddess Meenakshi & Lord Sundareswarar',
    location: 'Madurai',
    state: 'Tamil Nadu',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBN_NZu4kNNtnqzG5xCawL6n7PFDUOHFMi3ayoFCr9ARhdDhUcGo2IAZYTrX43ldZPhWFYdwYSkhcEDvZ-3lWwsXqf1NEgS9P3y-eSidkgpF_lCO50Os7fyQsdoeE9RGwyk-AQ5dUFS_SfVWQq60hg97lggEocPFOd56VOSzc8I0Waop-JiMh_TiCNK8KpdxhnROHxrfyEbGr8IVMqPTBcs0TNZOTfsCsMQnZX2bUoCJ1vfNSpiGvE',
    crowdLevel: 'Moderate',
    waitTimeMinutes: 90,
    description: 'A historic Hindu temple located on the southern bank of the Vaigai River, famous for its towering gopurams adorned with thousands of colorful mythological statues.',
    timing: '05:00 AM - 12:30 PM, 04:00 PM - 09:30 PM',
    specialty: '1000 Pillar Hall & Sacred Golden Lotus Tank',
    sevasAvailable: ['Gold Chariot Procession', 'Abhishekam', 'Thiru Kalyanam', 'Special Archana'],
    builtInCentury: '6th Century BC (Expanded 16th Century)',
    architectureStyle: 'Dravidian Gopuram Architecture',
    sthalaPuranaShort: 'Goddess Parvati took avatar as Meenakshi with three breasts, which merged into two upon meeting Lord Shiva.'
  },
  {
    id: 'sabarimala',
    name: 'Sabarimala Temple',
    deity: 'Lord Ayyappa',
    location: 'Pathanamthitta',
    state: 'Kerala',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmw2taLr89_kfwZ7KkM8HRJoT8rtKspWEzLAAiMlYG8ZZE6iu_Ie93uzHaHjQRvOqxYwakNFAJTS-Lk6ogAgT6pQRjiILg7H8MEiIt3odmMhJoq3L-j44SL2aq6_Jt9SUWpwQoAfJRQpBqQAp2_er6-8ps2vWrhX6i9AeGPFy0T2JufCKgsuT-hEex3U8ehrlmttyi9lRSu4dYJQ4U21R984SCrp91w3U0gXZgS09vzkc89mV9lE8',
    crowdLevel: 'High',
    waitTimeMinutes: 180,
    description: 'Nestled in the Western Ghats mountain ranges of Pathanamthitta district, Sabarimala is surrounded by 18 hills and dense reserve forests.',
    timing: '04:00 AM - 01:00 PM, 04:00 PM - 11:00 PM (Season Open)',
    specialty: '18 Sacred Steps (Pathinettam Padi) & Neyyabhishekam',
    sevasAvailable: ['Neyyabhishekam', 'Padi Pooja', 'Udayastamana Pooja', 'Pushpabhishekam'],
    builtInCentury: '12th Century AD',
    architectureStyle: 'Traditional Kerala Style',
    sthalaPuranaShort: 'Born from the union of Lord Shiva and Mohini (Vishnu avatar) to vanquish Mahishi.'
  },
  {
    id: 'ranganathaswamy',
    name: 'Ranganathaswamy Temple',
    deity: 'Lord Ranganatha (Vishnu in reclining posture)',
    location: 'Srirangam',
    state: 'Tamil Nadu',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9miIAIlpAbTMJVbe6_tDsH12ghJtFnFdjT_svnJFuM_Gt-Ci2hpzBQCqB2M4AozupyhpxrT6Mb2JiF5bYLkAN2yj936NAy6NI7_4UtqWSsh898QiiOucu4GeEnfmyEmrYcq1oi5Xu70eiZ5-Oia_w7k840vL23a4aL4J1GmLKxckOuHZLrFNOPZbcWaY3L4r5em4hxpIb7ZR4VpAkud1HZNUrR0W7vulPkfJ6bh1CPE5-m9qI_UA',
    crowdLevel: 'Low',
    waitTimeMinutes: 30,
    description: 'The largest operating Hindu temple complex in the world, spanning 156 acres surrounded by 7 concentric wall enclosures and 21 gopurams.',
    timing: '06:00 AM - 01:00 PM, 03:15 PM - 09:00 PM',
    specialty: 'Rajagopuram (13 tiers, 236 ft tall) & Viswaroopa Seva',
    sevasAvailable: ['Viswaroopa Seva', 'Thirumanjanam', 'Veena Seva', 'Sahasranama Archana'],
    builtInCentury: '10th Century AD',
    architectureStyle: 'Dravidian Architecture',
    sthalaPuranaShort: 'Vibhishana received the idol from Lord Rama; it became permanently consecrated on the banks of Cauvery.'
  },
  {
    id: 'rameshwaram',
    name: 'Ramanathaswamy Temple',
    deity: 'Lord Shiva (Ramanathaswamy)',
    location: 'Rameswaram',
    state: 'Tamil Nadu',
    image: 'https://images.unsplash.com/photo-1609946782701-7033527b1405?auto=format&fit=crop&w=800&q=80',
    crowdLevel: 'Moderate',
    waitTimeMinutes: 75,
    description: 'One of the 12 Jyotirlingas, home to the longest temple corridor in the world with over 1,200 carved stone pillars and 22 sacred teerthams.',
    timing: '05:00 AM - 01:00 PM, 03:00 PM - 09:00 PM',
    specialty: '22 Holy Water Bathing Wells & Spatika Linga Darshan',
    sevasAvailable: ['Spatika Linga Pooja', '108 Teertham Snanam', 'Rudrabhishekam'],
    builtInCentury: '12th Century AD',
    architectureStyle: 'Dravidian Corridor Style',
    sthalaPuranaShort: 'Lord Rama established and worshipped the Shiva Linga here to absolve sins after defeating Ravana.'
  },
  {
    id: 'kanchipuram-kamakshi',
    name: 'Kamakshi Amman Temple',
    deity: 'Goddess Kamakshi',
    location: 'Kanchipuram',
    state: 'Tamil Nadu',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    crowdLevel: 'Low',
    waitTimeMinutes: 20,
    description: 'One of the 51 Shakti Peethas, where the Goddess is seated in Padmasana posture with a sugar cane bow and parrot.',
    timing: '05:30 AM - 12:30 PM, 04:00 PM - 08:30 PM',
    specialty: 'Sri Chakra Consecrated by Adi Shankara',
    sevasAvailable: ['Kumkumarchana', 'Lalitha Sahasranama Archana', 'Navavarana Pooja'],
    builtInCentury: '7th Century AD',
    architectureStyle: 'Pallava Architecture',
    sthalaPuranaShort: 'Adi Shankara established the Sri Chakra in front of the deity to calm down her fierce form into benevolent Kamakshi.'
  }
];

export const MOCK_LIVE_CROWD: LiveDarshanStatus[] = [
  {
    templeId: 'tirupati-balaji',
    templeName: 'Tirupati Balaji Temple',
    crowdLevel: 'Low',
    waitTimeMinutes: 45,
    statusText: 'Fewer than usual pilgrims in queue. Fast moving compartments.',
    queueStatusText: 'Vaikuntam Compartment 2 & 4 Open',
    recommendedTimeSlot: '2:00 PM - 4:00 PM today',
    lastUpdated: 'Updated 5 mins ago'
  },
  {
    templeId: 'meenakshi-amman',
    templeName: 'Meenakshi Amman Temple',
    crowdLevel: 'Moderate',
    waitTimeMinutes: 90,
    statusText: 'Expect moderate wait time at East Gopuram entrance.',
    queueStatusText: 'General Line 45 mins; Special Line 20 mins',
    recommendedTimeSlot: '04:30 PM - 06:00 PM today',
    lastUpdated: 'Updated 10 mins ago'
  },
  {
    templeId: 'sabarimala',
    templeName: 'Sabarimala Temple',
    crowdLevel: 'High',
    waitTimeMinutes: 180,
    statusText: 'Long wait expected at Pathinettam Padi (18 Sacred Steps).',
    queueStatusText: 'Virtual Q Slots filling rapidly. Pamba trek line smooth.',
    recommendedTimeSlot: '08:00 PM - 10:00 PM',
    lastUpdated: 'Updated 2 mins ago'
  },
  {
    templeId: 'ranganathaswamy',
    templeName: 'Ranganathaswamy Temple',
    crowdLevel: 'Low',
    waitTimeMinutes: 30,
    statusText: 'Smooth queue movement through Garuda Mandapam.',
    queueStatusText: 'Direct sanctum entry running smoothly',
    recommendedTimeSlot: '03:30 PM - 05:00 PM today',
    lastUpdated: 'Updated 12 mins ago'
  }
];

export const MOCK_FESTIVALS: Festival[] = [
  {
    id: 'rath-yatra',
    name: 'Rath Yatra',
    month: 'Jun',
    dateNumber: 20,
    fullDate: 'June 20, 2026',
    templeName: 'Puri Jagannath Temple',
    location: 'Puri, Odisha',
    status: 'Upcoming',
    description: 'The monumental Chariot Festival where Lord Jagannath, Balabhadra, and Subhadra emerge on grand wooden chariots drawn by thousands of devotees.',
    auspiciousTithi: 'Shukla Paksha Dwitiya'
  },
  {
    id: 'aadi-pooram',
    name: 'Aadi Pooram',
    month: 'Jul',
    dateNumber: 10,
    fullDate: 'July 10, 2026',
    templeName: 'Meenakshi Amman Temple',
    location: 'Madurai, Tamil Nadu',
    status: 'Upcoming',
    description: 'Grand celebration commemorating the incarnation of Goddess Andal. Glass bangles are offered in thousands to the divine Mother.',
    auspiciousTithi: 'Pooram Nakshatram'
  },
  {
    id: 'krishna-jayanthi',
    name: 'Krishna Jayanthi',
    month: 'Aug',
    dateNumber: 15,
    fullDate: 'August 15, 2026',
    templeName: 'All Krishna Temples',
    location: 'Pan-India',
    status: 'Upcoming',
    description: 'The divine birth of Lord Krishna, marked by midnight abhishekams, butter offerings, and tiny baby footsteps drawn leading into homes.',
    auspiciousTithi: 'Rohini Nakshatram Ashtami'
  },
  {
    id: 'brahmotsavam',
    name: 'Srivari Brahmotsavam',
    month: 'Sep',
    dateNumber: 24,
    fullDate: 'September 24 - October 2, 2026',
    templeName: 'Tirupati Balaji Temple',
    location: 'Tirumala, Andhra Pradesh',
    status: 'Upcoming',
    description: 'Nine-day annual festival featuring vehicle processions including Garuda Vahanam, Hanumantha Vahanam, and Rathotsavam.',
    auspiciousTithi: 'Kanya Masa Navaratri'
  }
];

export const MOCK_PURANA_STORIES: PuranaStory[] = [
  {
    id: 'story-1',
    templeName: 'Ranganathaswamy Temple, Srirangam',
    title: 'The Divine Journey of Sri Ranganatha Idol',
    summary: 'The divine stories behind every temple. How Vibhishana received the idol from Lord Rama and why it stayed in Srirangam.',
    fullStory: `According to Sthala Purana, during the Treta Yuga, Lord Rama presented the sacred idol of Sri Ranganatha (worshipped by the Ikshvaku dynasty for generations) to Vibhishana as a token of gratitude after the victory in Lanka.

However, the celestial beings were concerned that if the supreme deity resided permanently in Lanka, South India would lose his divine presence. Lord Ganesha took the form of a young cowherd boy to assist Vibhishana on his journey back to Lanka.

When Vibhishana stopped at the banks of River Cauvery to perform his evening prayers (Sandhyavandanam), he requested the young boy to hold the idol without placing it on the ground. The boy agreed, but playfully called out Vibhishana's name three times and placed the idol gently on the sacred land of Srirangam.

When Vibhishana returned and tried to lift the idol, it had taken deep roots into the earth! Sri Ranganatha promised Vibhishana that while his idol would face southwards toward Lanka to bless Vibhishana, his permanent abode would remain at Srirangam amidst the soothing breeze of the Cauvery.`,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPBVaqnwHWpmEMn_6XlMiiJ_Lfxfe8vgF0yf6CFVCFcPYuzvdJLzsSJM3y32Rxpv2k2tC_s2QZsl3OjVkjlbxyt7qDaMtX7Nh7yaihCL3D3qgKxfxnjPRTcuvrjE6gmLvZ7Flb2r06CIrNjC6Ox2X-4977df-dgzaZvAyzHb5EC3jsQ94N_1EDlDKtVRitzX_lXzyepnF5g0sjJvmCKOJ7ogVSSuKoj4Y_FA8nfANnep0LjzzGVNA',
    significance: 'First and premier of the 108 Divya Desams in Vaishnavism.',
    associatedDeity: 'Lord Sri Ranganatha'
  },
  {
    id: 'story-2',
    templeName: 'Tirupati Balaji Temple',
    title: 'The Miracle of Srinivasa & Vakula Devi',
    summary: 'How Lord Vishnu manifested on Seshachalam hills and fulfilled Yashoda’s wish to see his divine marriage.',
    fullStory: `In Kali Yuga, Lord Vishnu descended to earth as Srinivasa. Reaching the Seshachalam hills, he sought refuge under the motherly care of Vakula Devi (who was Yashoda in her previous birth, granted a boon by Krishna to witness his wedding).

Vakula Devi arranged the marriage of Srinivasa with Princess Padmavathi, daughter of King Akasa Raja. To pay for the celestial wedding feast and jewelry, Lord Srinivasa borrowed wealth from Kubera, pledging to repay the interest until the end of Kali Yuga.

To this day, millions of pilgrims offer devotions and contributions at Tirumala, participating in this timeless divine leela of devotion and grace.`,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQBTW8V_o2JWIjVg3vQQ2kotIrP2nTJyYk1ubnINbTv3R2PMmUTqqvb3haWPJ31erxSL9bZ8SodOzGfqEuSPgf0LN8Cn-cyTwr3LCQV6hP5wLwrfO5WK3JwNR8yf2wdcISqMbYx7wseV0OL7lB33nj0cq-T86xyLd86gEnykh68Vov50GjZ6MBlHnPP56c70DKFH2Dgo43copgSF-liBd3kmX4heljTbMtd1Q9ocrmi2MiIYFsu5I',
    significance: 'Bhookailasa - Heaven on Earth in Kali Yuga.',
    associatedDeity: 'Lord Venkateswara'
  }
];

export const MOCK_JOURNALS: Journal[] = [
  {
    id: 'journal-1',
    authorName: 'Ramanathan Iyer',
    authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-0GIytrUgSEfQqv7_uA3VGBMB7gs-tFhCHM3JLSsr6Oc6A2SFwqULVggVGscMxoPeJ1jY6vFXXfGXpxas0hln5dtc16cW4wARjrOz4QAx9bwus394Favi5DfiJYzibAkGt_JzN1OFzFkzcf_sQyAb4a_uHrJ_gj3OOGdd2yu_p1pPDVZAOYpu5kMrSwF5rGBjS2mpEuiZWdEU23SJISCiZkZvqkIO_b9u2UCyUxllqnePQNJWCuw',
    templeVisited: 'Tirupati & Kanchipuram Yatra',
    dateVisited: 'June 2026',
    rating: 5,
    title: 'Blessed Senior Yatra with Wheelchair Assistance',
    content: 'Our trip with elderly parents was remarkably peaceful. Swaxthika Travel’s crowd estimator was spot on. We availed the Senior Citizen Special Entry queue at Tirumala with zero hassles. The battery buggy at Kanchipuram Kamakshi temple saved my mother from walking in the sun.',
    tipsForPilgrims: 'Book the 300 Rs ticket at least 3 weeks in advance. Carry original Aadhaar cards for senior citizen counter verification.',
    images: ['https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80'],
    likesCount: 248
  },
  {
    id: 'journal-2',
    authorName: 'Lakshmi Sundaram',
    authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIryHEeqHjD2mDjzpBRic02hQ0_hmvj0Nlc4e_Wv_HbYsdVrbk0PXmoa14RW4tbm3eM_kwSV0kFsozO-0dTP6HnGJkUs1htmX_r5s4FIJ8xfEAh2MYk-AxN5SMjcL7qfOpLYV--x85yugfUk8GLPGrascQaVshsjgE6jAhWiq0XrQqrBXmJMu1YTI3LQ9ywYfIggE0sl1m6ymz0aRFTb-7XngL5r7PJiGKrhu-hlvaxtRqqSfGnlQ',
    templeVisited: 'Meenakshi Amman Temple, Madurai',
    dateVisited: 'May 2026',
    rating: 5,
    title: 'Sunrise Darshan & Divine Chanting in Hall of 1000 Pillars',
    content: 'Entering the West Tower at 5:15 AM was an ethereal experience. The morning suprabhatam and the aroma of fresh jasmine garlands made me tear up in joy. The architecture is divine perfection!',
    tipsForPilgrims: 'Mobile phones are strictly not allowed inside. Use the official clock room near East Tower. Wear traditional dhoti/saree.',
    images: [],
    likesCount: 189
  },
  {
    id: 'journal-3',
    authorName: 'Siddharth Rao',
    authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0NaD2ZrELKPOv0NLvNLvUJBE-ukla5pOOxltrcoJ6Ol-JU-MmtxVhadzHl1y7EsRNmDY0woYouo3xUKt24mdY18na1LjJOm2a8y5MqGd-yKyw6JzFEmtX3Mg3lcSLeuKkLUs7jXsLJLqX7NFa9iof-9x6u0kLvONmqSlGlFP2BkWpAeLE90Vc6x3cT5Q-mbI24181Ps66O328kg9nTDab3J4J4MXGbsYdNo6YnsZ0r_lM8OxIM8UwAE',
    templeVisited: 'Rameswaram 22 Teertham Yatra',
    dateVisited: 'April 2026',
    rating: 5,
    title: 'Purifying Bath in 22 Sacred Wells',
    content: 'Completed the holy bathing ritual across all 22 teerthams in order. Each well has water of different temperatures and taste, said to cure various ailments and sins.',
    tipsForPilgrims: 'Carry a dry set of clothes in a waterproof bag. Changing rooms are conveniently located right after the 22nd well.',
    images: [],
    likesCount: 312
  }
];

export const MOCK_YATRA_STOPS: YatraStop[] = [
  {
    id: 1,
    name: 'Tirupati Balaji Temple',
    city: 'Tirupati, AP',
    description: 'Start your yatra seeking the blessings of Lord Venkateswara at Tirumala hills.',
    recommendedDuration: '1 Day (Morning Darshan & Evening Departure)'
  },
  {
    id: 2,
    name: 'Kanchipuram',
    city: 'Kanchipuram, TN',
    description: 'City of 1000 Temples. Visit Kamakshi Amman, Ekambareswarar, and Varadharaja Perumal.',
    recommendedDuration: '1 Day'
  },
  {
    id: 3,
    name: 'Chidambaram',
    city: 'Chidambaram, TN',
    description: 'Home of Nataraja, the cosmic dancer representing the Akasha (Ether) Pancha Bhoota element.',
    recommendedDuration: 'Half Day'
  },
  {
    id: 4,
    name: 'Rameswaram',
    city: 'Rameswaram, TN',
    description: 'Holy Jyotirlinga, 22 Teertham holy wells bath, Dhanushkodi, and Agni Teertham.',
    recommendedDuration: '1-2 Days'
  }
];

export const MOCK_SEVAS: SevaOption[] = [
  {
    id: 's1',
    templeName: 'Tirupati Balaji Temple',
    sevaName: 'Special Entry Darshan (Rs. 300)',
    price: 300,
    timing: '09:00 AM - 06:00 PM',
    prasadamIncluded: true,
    description: 'Accelerated queue entrance with 2 Tirumala Laddus included per ticket.'
  },
  {
    id: 's2',
    templeName: 'Meenakshi Amman Temple',
    sevaName: 'Navadhanya Sahasranama Archana',
    price: 150,
    timing: '07:00 AM - 11:00 AM',
    prasadamIncluded: true,
    description: 'Special archana performed with 1000 divine names of Goddess Meenakshi.'
  },
  {
    id: 's3',
    templeName: 'Ranganathaswamy Temple',
    sevaName: 'Viswaroopa Seva',
    price: 250,
    timing: '06:00 AM - 07:15 AM',
    prasadamIncluded: true,
    description: 'First morning darshan of Sri Ranganatha amidst veena music and Vedic chanting.'
  },
  {
    id: 's4',
    templeName: 'Ramanathaswamy Temple',
    sevaName: 'Spatika Linga Abhishekam',
    price: 200,
    timing: '05:00 AM - 06:00 AM',
    prasadamIncluded: true,
    description: 'Sacred morning abhishekam performed on the pure crystal linga.'
  }
];
