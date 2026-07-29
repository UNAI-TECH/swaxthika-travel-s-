export type CrowdLevel = 'Low' | 'Moderate' | 'High';

export interface Temple {
  id: string;
  name: string;
  deity: string;
  location: string;
  state: string;
  image: string;
  crowdLevel: CrowdLevel;
  waitTimeMinutes: number;
  description: string;
  timing: string;
  specialty: string;
  sevasAvailable: string[];
  builtInCentury?: string;
  architectureStyle?: string;
  sthalaPuranaShort?: string;
}

export interface LiveDarshanStatus {
  templeId: string;
  templeName: string;
  crowdLevel: CrowdLevel;
  waitTimeMinutes: number;
  statusText: string;
  queueStatusText: string;
  recommendedTimeSlot: string;
  lastUpdated: string;
}

export interface Festival {
  id: string;
  name: string;
  month: string;
  dateNumber: number;
  fullDate: string;
  templeName: string;
  location: string;
  status: 'Upcoming' | 'Ongoing' | 'Past';
  description: string;
  auspiciousTithi?: string;
}

export interface PuranaStory {
  id: string;
  templeName: string;
  title: string;
  summary: string;
  fullStory: string;
  image: string;
  significance: string;
  associatedDeity: string;
}

export interface Journal {
  id: string;
  authorName: string;
  authorAvatar: string;
  templeVisited: string;
  dateVisited: string;
  rating: number;
  title: string;
  content: string;
  tipsForPilgrims: string;
  images: string[];
  likesCount: number;
}

export interface SevaOption {
  id: string;
  templeName: string;
  sevaName: string;
  price: number;
  timing: string;
  prasadamIncluded: boolean;
  description: string;
}

export interface YatraStop {
  id: number;
  name: string;
  city: string;
  description: string;
  recommendedDuration: string;
  latitude?: number;
  longitude?: number;
}

export interface YatraPlanRequest {
  startingCity: string;
  durationDays: number;
  preferredState: string;
  travelerType: 'family' | 'senior' | 'solo' | 'group';
  specialRequirements?: string;
}

export interface YatraPlanResponse {
  title: string;
  summary: string;
  stops: YatraStop[];
  auspiciousTimings: string;
  travelTips: string[];
}

export interface BookingRecord {
  bookingId: string;
  templeName: string;
  sevaName: string;
  devoteeName: string;
  phone: string;
  date: string;
  numberOfDevotees: number;
  totalAmount: number;
  specialWishes?: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt?: string;
}
