export interface ItineraryStop {
  day: number;
  title: string;
  description: string;
  temples: string[];
}

export interface TourDate {
  id: string;
  date: string;
  totalSeats: number;
  bookedSeats: number;
  status: 'available' | 'filling-fast' | 'sold-out';
}

export interface PackageAddon {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface DevotionalPackage {
  id: string;
  name: string;
  description: string;
  highlights: string[];
  itinerary: ItineraryStop[];
  duration: string;
  pricePerSeat: number;
  image: string;
  category: string;
  inclusions: string[];
  exclusions: string[];
  availableDates: TourDate[];
  isActive: boolean;
  createdAt: string;
  addons?: PackageAddon[];
}

export interface Booking {
  bookingId: string;
  uniqueCode: string;
  packageId: string;
  packageName: string;
  tourDateId: string;
  tourDate: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  numberOfSeats: number;
  totalAmount: number;
  status: 'Confirmed' | 'Checked-In' | 'Completed' | 'Cancelled';
  qrCodeUrl: string;
  createdAt: string;
  selectedAddons?: PackageAddon[];
}

export interface UserSession {
  name: string;
  email: string;
  avatar: string;
  isLoggedIn: boolean;
}
