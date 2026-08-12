import { DevotionalPackage, Booking } from '../types';

export const MOCK_PACKAGES: DevotionalPackage[] = [
  {
    id: 'kashi-prayag-gaya',
    name: 'Kashi Prayag Gaya Sacred Yatra',
    description: 'Experience the ultimate spiritual liberation tour across the holy triad of Kashi (Varanasi), Prayagraj (Triveni Sangam), and Gaya. Perform sacred rituals, witness the grand Ganga Aarti, and explore the oldest living city in the world.',
    highlights: [
      'Ganga Aarti at Dashashwamedh Ghat in Varanasi',
      'Holy bath at Triveni Sangam in Prayagraj',
      'Pinda Daan rituals at Vishnupad Temple in Gaya',
      'Special Kashi Vishwanath Temple VIP Darshan',
      'Visit to historic Sarnath where Lord Buddha gave his first sermon'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Varanasi & Ganga Aarti',
        description: 'Arrive at Varanasi airport/railway station. Check-in to the hotel. In the evening, witness the breathtaking and grand Ganga Aarti ceremony from a private boat.',
        temples: ['Dashashwamedh Ghat']
      },
      {
        day: 2,
        title: 'Kashi Vishwanath Darshan & Local Temples',
        description: 'Early morning VIP Darshan at Kashi Vishwanath Temple, followed by visits to Vishalakshi Shaktipeeth, Annapurna Temple, and Kaal Bhairav Temple. Afternoon visit to Sarnath.',
        temples: ['Kashi Vishwanath Temple', 'Vishalakshi Temple', 'Annapurna Temple', 'Kaal Bhairav Temple']
      },
      {
        day: 3,
        title: 'Prayagraj Triveni Sangam Visit',
        description: 'Drive to Prayagraj. Take a holy dip at Triveni Sangam (confluence of Ganga, Yamuna, and Saraswati). Visit the reclining Hanuman Temple and Alopi Devi Shaktipeeth. Return to Varanasi.',
        temples: ['Bade Hanuman Temple', 'Alopi Devi Temple']
      },
      {
        day: 4,
        title: 'Gaya Excursion & Rituals',
        description: 'Drive to Gaya. Perform ancestral rituals at the sacred Vishnupad Temple on the banks of Falgu River. Visit Mangla Gauri Shaktipeeth and the UNESCO site Mahabodhi Temple in Bodhgaya. Return to Varanasi.',
        temples: ['Vishnupad Temple', 'Mangla Gauri Temple', 'Mahabodhi Temple']
      },
      {
        day: 5,
        title: 'Departure from Varanasi',
        description: 'Morning free for shopping (Banarasi Silk sarees and local crafts). Transfer to the airport or railway station for your onward journey.',
        temples: []
      }
    ],
    duration: '5 Days / 4 Nights',
    pricePerSeat: 14500,
    image: 'https://images.unsplash.com/photo-1561361068-61690a201b5f?auto=format&fit=crop&w=800&q=80',
    category: 'North India',
    inclusions: [
      '3-Star Hotel AC accommodation on twin sharing basis',
      'Pure Vegetarian Breakfast & Dinner',
      'AC Transport for sightseeing and transfers',
      'VIP Darshan entry tickets at Kashi Vishwanath',
      'Boat ride charges in Varanasi and Prayagraj',
      'Experienced spiritual tour guide'
    ],
    exclusions: [
      'Airfare or Train tickets to/from Varanasi',
      'Lunch and personal expenses',
      'Pooja/Ritual dakshina charges',
      'GST & travel insurance'
    ],
    availableDates: [
      { id: 'kpg-d1', date: '2026-09-15', totalSeats: 40, bookedSeats: 28, status: 'filling-fast' },
      { id: 'kpg-d2', date: '2026-10-10', totalSeats: 40, bookedSeats: 12, status: 'available' },
      { id: 'kpg-d3', date: '2026-11-05', totalSeats: 40, bookedSeats: 40, status: 'sold-out' }
    ],
    isActive: true,
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'arupadai-veedu',
    name: 'Arupadai Veedu (Six Abodes of Lord Murugan)',
    description: 'Embark on a sacred pilgrimage to the six holy abodes of Lord Murugan nestled across Tamil Nadu. This spiritual tour covers Thiruparankundram, Thiruchendur, Palani, Swamimalai, Thiruthani, and Pazhamudircholai.',
    highlights: [
      'Complete darshan of all six abodes (Arupadai Veedu) of Lord Murugan',
      'Beachside Darshan at Thiruchendur Subrahmanya Swamy Temple',
      'Rope car/Winch ride to the hilltop temple in Palani',
      'Swamimalai where Lord Murugan taught the Pranava Mantra to Lord Shiva',
      'Beautiful forest hill shrine of Pazhamudircholai'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Chennai to Thiruthani & Swamimalai',
        description: 'Start from Chennai. Drive to Thiruthani (5th abode) situated on a beautiful hill. Post darshan, drive to Swamimalai (4th abode) near Kumbakonam. Check-in to hotel.',
        temples: ['Thiruthani Murugan Temple']
      },
      {
        day: 2,
        title: 'Swamimalai & Drive to Madurai',
        description: 'Morning darshan at Swamimalai Murugan Temple. Check-out and drive to Madurai. In the evening, visit Pazhamudircholai (6th abode) located amidst scenic hills and Thiruparankundram (1st abode).',
        temples: ['Swamimalai Murugan Temple', 'Pazhamudircholai Murugan Temple', 'Thiruparankundram Murugan Temple']
      },
      {
        day: 3,
        title: 'Palani Hill Temple Darshan',
        description: 'Drive to Palani (3rd abode), one of the most powerful shrines. Ascend the hill via winch/rope car for a blissful Darshan of Lord Dandayudhapani. Overnight stay in Madurai.',
        temples: ['Palani Dandayudhapani Swamy Temple']
      },
      {
        day: 4,
        title: 'Thiruchendur Sea-shore Temple',
        description: 'Drive to Thiruchendur (2nd abode), the only abode located on the seashore. Witness the majestic temple towers and perform special archana. Drive to Trichy for overnight stay.',
        temples: ['Thiruchendur Subramanya Swamy Temple']
      },
      {
        day: 5,
        title: 'Trichy Local Sightseeing & Return to Chennai',
        description: 'Morning visit to Samayapuram Mariamman Temple or Rockfort Temple. Check-out and drive back to Chennai. Drop at Chennai Airport/Railway station.',
        temples: ['Samayapuram Mariamman Temple', 'Rockfort Uchchi Pillayar Temple']
      }
    ],
    duration: '5 Days / 4 Nights',
    pricePerSeat: 12800,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    category: 'South India',
    inclusions: [
      'AC Accommodation on twin sharing basis',
      'South Indian Vegetarian Breakfast, Lunch & Dinner',
      'AC Bus transport for the entire circuit',
      'Special entry darshan tickets in Palani & Thiruchendur',
      'Dedicated spiritual tour operator coordinator'
    ],
    exclusions: [
      'Personal offerings, tonsure and special archanas',
      'Camera fee and telephone calls',
      'Any items not mentioned in inclusions'
    ],
    availableDates: [
      { id: 'av-d1', date: '2026-09-20', totalSeats: 30, bookedSeats: 15, status: 'available' },
      { id: 'av-d2', date: '2026-10-18', totalSeats: 30, bookedSeats: 29, status: 'filling-fast' },
      { id: 'av-d3', date: '2026-11-12', totalSeats: 30, bookedSeats: 0, status: 'available' }
    ],
    isActive: true,
    createdAt: '2026-08-02T11:00:00.000Z'
  },
  {
    id: 'chardham-himalayas',
    name: 'Chardham Yatra Himalayan Circuit',
    description: 'A life-transforming pilgrimage to the four sacred Himalayan shrines: Yamunotri, Gangotri, Kedarnath, and Badrinath. Undertake this ultimate yatra to cleanse your soul amidst breathtaking landscapes.',
    highlights: [
      'Darshan at Kedarnath Jyotirlinga after an epic scenic trek',
      'Badrinath Temple visit with holy bath at Tapt Kund',
      'Yamunotri origin of River Yamuna and holy hot springs',
      'Gangotri temple located at the source of holy River Bhagirathi Ganga',
      'Scenic drives along Alaknanda, Mandakini, and Bhagirathi rivers'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Haridwar to Barkot',
        description: 'Drive from Haridwar to Barkot via Mussoorie and Kempty Falls. On arrival, check-in to your hotel/camp. Relax and prepare for the Yamunotri trek.',
        temples: []
      },
      {
        day: 2,
        title: 'Yamunotri Darshan',
        description: 'Drive to Janki Chatti, then begin the 6km trek to Yamunotri. Take a holy bath in Surya Kund hot springs and cook rice in it as prasadam. Return to Barkot.',
        temples: ['Yamunotri Temple']
      },
      {
        day: 3,
        title: 'Barkot to Uttarkashi',
        description: 'Drive to Uttarkashi on the banks of River Bhagirathi. Check-in to the hotel. Visit the ancient Vishwanath Temple and Shakti Temple in the evening.',
        temples: ['Kashi Vishwanath Temple Uttarkashi']
      },
      {
        day: 4,
        title: 'Gangotri Darshan',
        description: 'Drive to Gangotri. Take a holy dip in the icy cold Ganga (Bhagirathi) and perform prayers at the Gangotri Temple. Return to Uttarkashi.',
        temples: ['Gangotri Temple']
      },
      {
        day: 5,
        title: 'Uttarkashi to Guptkashi / Phata',
        description: 'Drive to Guptkashi along the beautiful Mandakini River. Get medical checkups done for the Kedarnath trek. Check-in to the hotel.',
        temples: ['Vishwanath Temple Guptkashi']
      },
      {
        day: 6,
        title: 'Trek to Kedarnath Dham',
        description: 'Drive to Sonprayag/Gaurikund and start the 16km trek to Kedarnath. Alternatively, take a helicopter flight (optional, extra charges). Check-in to guest house near temple. Witness the evening aarti.',
        temples: ['Kedarnath Temple']
      },
      {
        day: 7,
        title: 'Kedarnath Darshan & Descent to Guptkashi',
        description: 'Wake up early for Abhishek Darshan of Lord Kedarnath. Trek back down to Gaurikund and drive back to Guptkashi/Phata for overnight stay.',
        temples: ['Kedarnath Temple']
      },
      {
        day: 8,
        title: 'Guptkashi to Badrinath Dham',
        description: 'Scenic drive to Badrinath via Joshimath. Check-in to the hotel. Take a holy bath in the natural hot spring Tapt Kund. Attend evening prayers at Badrinath Temple.',
        temples: ['Badrinath Temple']
      },
      {
        day: 9,
        title: 'Badrinath Darshan & Return to Srinagar / Rishikesh',
        description: 'Early morning darshan of Badrinarayan. Visit Mana Village, the last Indian village before Tibet. Drive back to Srinagar (Garhwal) or Rishikesh.',
        temples: ['Badrinath Temple', 'Vyas Gufa']
      },
      {
        day: 10,
        title: 'Rishikesh to Haridwar & Departure',
        description: 'Morning sightseeing in Rishikesh (Laxman Jhula, Ram Jhula, Triveni Ghat). Drive to Haridwar for departure transfer.',
        temples: []
      }
    ],
    duration: '10 Days / 9 Nights',
    pricePerSeat: 32000,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    category: 'Char Dham',
    inclusions: [
      '9 Nights accommodation in standard deluxe hotels/guesthouses/camps',
      'Breakfast & Dinner (Pure Vegetarian nutritious meals)',
      'AC Transport from Haridwar to Haridwar (AC switched off in hill areas)',
      'Trek guides, oxygen cylinder backups, and permits'
    ],
    exclusions: [
      'Helicopter tickets for Kedarnath (can be booked in advance)',
      'Pony/Doli/Porter charges for trekking',
      'Lunch, mineral water, and personal tips'
    ],
    availableDates: [
      { id: 'cd-d1', date: '2026-09-10', totalSeats: 25, bookedSeats: 25, status: 'sold-out' },
      { id: 'cd-d2', date: '2026-10-01', totalSeats: 25, bookedSeats: 18, status: 'filling-fast' }
    ],
    isActive: true,
    createdAt: '2026-08-03T12:00:00.000Z'
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    bookingId: 'SWX-882194',
    uniqueCode: 'KPG459',
    packageId: 'kashi-prayag-gaya',
    packageName: 'Kashi Prayag Gaya Sacred Yatra',
    tourDateId: 'kpg-d1',
    tourDate: '2026-09-15',
    userName: 'Sundararajan M',
    userEmail: 'sundar.m@gmail.com',
    userPhone: '+91 98401 23456',
    numberOfSeats: 2,
    totalAmount: 29000,
    status: 'Confirmed',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SWX-882194',
    createdAt: '2026-08-05T10:15:00.000Z'
  },
  {
    bookingId: 'SWX-551029',
    uniqueCode: 'AVM781',
    packageId: 'arupadai-veedu',
    packageName: 'Arupadai Veedu (Six Abodes of Lord Murugan)',
    tourDateId: 'av-d2',
    tourDate: '2026-10-18',
    userName: 'Lakshmi Narayanan',
    userEmail: 'lakshminarayan@outlook.com',
    userPhone: '+91 94440 98765',
    numberOfSeats: 4,
    totalAmount: 51200,
    status: 'Confirmed',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SWX-551029',
    createdAt: '2026-08-10T11:45:00.000Z'
  },
  {
    bookingId: 'SWX-310492',
    uniqueCode: 'CDM294',
    packageId: 'chardham-himalayas',
    packageName: 'Chardham Yatra Himalayan Circuit',
    tourDateId: 'cd-d1',
    tourDate: '2026-09-10',
    userName: 'Kaveri Ammal',
    userEmail: 'kaveriammal@yahoo.co.in',
    userPhone: '+91 97890 12345',
    numberOfSeats: 1,
    totalAmount: 32000,
    status: 'Checked-In',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SWX-310492',
    createdAt: '2026-08-08T09:30:00.000Z'
  }
];
