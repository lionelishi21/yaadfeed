// News Types
export interface NewsItem {
  id: string;
  title: string;
  slug?: string;
  summary: string;
  content: string;
  imageUrl?: string;
  category: NewsCategory;
  source: NewsSource;
  publishedAt: string;
  author?: string;
  tags: string[];
  keywords?: string[];
  isPopular?: boolean;
  viewCount?: number;
  readTime?: number;
}

export interface RSSFeed {
  title: string;
  url: string;
  category?: string;
}

export type NewsCategory = 
  | 'politics' 
  | 'entertainment' 
  | 'sports' 
  | 'business' 
  | 'culture' 
  | 'health' 
  | 'international' 
  | 'local'
  | 'music'
  | 'dancehall'
  | 'reggae'
  | 'afrobeats';

export type NewsSource = 
  | 'jamaica-gleaner' 
  | 'jamaica-observer' 
  | 'jamaica-star' 
  | 'jis' 
  | 'sports-jamaica';

// Artist Types
export interface Artist {
  id: string;
  name: string;
  bio: string;
  imageUrl?: string;
  spotifyId?: string;
  genres: string[];
  popularity: number;
  followers: number;
  netWorth?: number;
  birthDate?: string;
  birthPlace?: string;
  socialMedia: SocialMediaLinks;
  discography: Album[];
  upcomingEvents: Event[];
  isJamaican: boolean;
  isVerified?: boolean;
}

export interface Album {
  id: string;
  name: string;
  artistId: string;
  releaseDate: string;
  imageUrl?: string;
  spotifyUrl?: string;
  tracks: Track[];
  genre: string;
}

export interface Track {
  id: string;
  name: string;
  albumId: string;
  duration: number;
  previewUrl?: string;
  spotifyUrl?: string;
  popularity: number;
}

export interface SocialMediaLinks {
  instagram?: string;
  twitter?: string;
  facebook?: string;
  youtube?: string;
  spotify?: string;
  website?: string;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  artistId?: string;
  artistName?: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  ticketUrl?: string;
  price?: string;
  imageUrl?: string;
  category: EventCategory;
  isPopular?: boolean;
}

export type EventCategory = 
  | 'concert' 
  | 'festival' 
  | 'club-night' 
  | 'cultural-event' 
  | 'music-competition' 
  | 'workshop';

// Subscription Types
export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

export type SubscriptionPlan = 'free' | 'newsletter';

export type SubscriptionStatus = 
  | 'active' 
  | 'cancelled' 
  | 'expired' 
  | 'pending';

// User Types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  subscription?: Subscription;
  preferences: UserPreferences;
  createdAt: string;
  lastLoginAt?: string;
}

export interface UserPreferences {
  newsCategories: NewsCategory[];
  favoriteArtists: string[];
  emailNotifications: boolean;
  pushNotifications: boolean;
  location?: string;
}

// API Response Types
export interface APIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Component Props Types
export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent' | 'soft' | 'glamour';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  category?: NewsCategory;
  source?: NewsSource;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface ArtistFilters {
  query?: string;
  genre?: string;
  isJamaican?: boolean;
  popularityRange?: {
    min: number;
    max: number;
  };
}

// Social Media Automation Types
export interface SocialMediaPost {
  id: string;
  platform: 'instagram' | 'twitter' | 'facebook';
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  scheduledFor?: string;
  publishedAt?: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  metrics?: {
    likes: number;
    shares: number;
    comments: number;
    reach: number;
  };
}

// Video Generation Types
export interface VideoRequest {
  id: string;
  newsItemId: string;
  title: string;
  script: string;
  voiceType?: 'male' | 'female';
  duration?: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  thumbnailUrl?: string;
  createdAt: string;
}

// Analytics Types
export interface Analytics {
  newsViews: {
    total: number;
    byCategory: Record<NewsCategory, number>;
    bySource: Record<NewsSource, number>;
    trending: NewsItem[];
  };
  artistViews: {
    total: number;
    mostPopular: Artist[];
    byGenre: Record<string, number>;
  };
  subscriptions: {
    total: number;
    active: number;
    revenue: number;
    churnRate: number;
  };
  userEngagement: {
    dailyActiveUsers: number;
    averageSessionTime: number;
    bounceRate: number;
  };
}
