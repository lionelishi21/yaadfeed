import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

// Environment variables with fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

// Browser client for client-side operations
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Server client for server-side operations
export const createServerClient = () => {
  return createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
  );
};

// Database schema types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          first_name?: string;
          last_name?: string;
          avatar_url?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          first_name?: string;
          last_name?: string;
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          first_name?: string;
          last_name?: string;
          avatar_url?: string;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: 'free' | 'newsletter';
          status: 'active' | 'cancelled' | 'expired';
          stripe_subscription_id?: string;
          start_date: string;
          end_date?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan: 'free' | 'newsletter';
          status?: 'active' | 'cancelled' | 'expired';
          stripe_subscription_id?: string;
          start_date?: string;
          end_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          plan?: 'free' | 'newsletter';
          status?: 'active' | 'cancelled' | 'expired';
          stripe_subscription_id?: string;
          end_date?: string;
          updated_at?: string;
        };
      };
      news_items: {
        Row: {
          id: string;
          title: string;
          summary: string;
          content: string;
          image_url?: string;
          category: string;
          source: string;
          published_at: string;
          author?: string;
          tags: string[];
          is_popular: boolean;
          view_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          summary: string;
          content: string;
          image_url?: string;
          category: string;
          source: string;
          published_at: string;
          author?: string;
          tags?: string[];
          is_popular?: boolean;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          summary?: string;
          content?: string;
          image_url?: string;
          category?: string;
          author?: string;
          tags?: string[];
          is_popular?: boolean;
          view_count?: number;
          updated_at?: string;
        };
      };
      artists: {
        Row: {
          id: string;
          name: string;
          bio: string;
          image_url?: string;
          spotify_id?: string;
          genres: string[];
          popularity: number;
          followers: number;
          net_worth?: number;
          birth_date?: string;
          birth_place?: string;
          social_media: Record<string, string>;
          is_jamaican: boolean;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          bio: string;
          image_url?: string;
          spotify_id?: string;
          genres?: string[];
          popularity?: number;
          followers?: number;
          net_worth?: number;
          birth_date?: string;
          birth_place?: string;
          social_media?: Record<string, string>;
          is_jamaican?: boolean;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          bio?: string;
          image_url?: string;
          spotify_id?: string;
          genres?: string[];
          popularity?: number;
          followers?: number;
          net_worth?: number;
          birth_date?: string;
          birth_place?: string;
          social_media?: Record<string, string>;
          is_jamaican?: boolean;
          is_verified?: boolean;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          artist_id?: string;
          artist_name?: string;
          venue: string;
          location: string;
          date: string;
          time: string;
          ticket_url?: string;
          price?: string;
          image_url?: string;
          category: string;
          is_popular: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          artist_id?: string;
          artist_name?: string;
          venue: string;
          location: string;
          date: string;
          time: string;
          ticket_url?: string;
          price?: string;
          image_url?: string;
          category: string;
          is_popular?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          artist_id?: string;
          artist_name?: string;
          venue?: string;
          location?: string;
          date?: string;
          time?: string;
          ticket_url?: string;
          price?: string;
          image_url?: string;
          category?: string;
          is_popular?: boolean;
          updated_at?: string;
        };
      };
    };
  };
}

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, metadata?: Record<string, any>) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
  },

  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  signOut: async () => {
    return await supabase.auth.signOut();
  },

  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Database helpers
export const db = {
  // News operations
  news: {
    getAll: async (filters?: { category?: string; source?: string; limit?: number }) => {
      let query = supabase
        .from('news_items')
        .select('*')
        .order('published_at', { ascending: false });

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.source) {
        query = query.eq('source', filters.source);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      return await query;
    },

    getById: async (id: string) => {
      return await supabase
        .from('news_items')
        .select('*')
        .eq('id', id)
        .single();
    },

    getPopular: async (limit = 5) => {
      return await supabase
        .from('news_items')
        .select('*')
        .eq('is_popular', true)
        .order('view_count', { ascending: false })
        .limit(limit);
    },

    incrementViews: async (id: string) => {
      return await supabase.rpc('increment_news_views', { news_id: id });
    },
  },

  // Artist operations
  artists: {
    getAll: async (filters?: { isJamaican?: boolean; genre?: string; limit?: number }) => {
      let query = supabase
        .from('artists')
        .select('*')
        .order('popularity', { ascending: false });

      if (filters?.isJamaican !== undefined) {
        query = query.eq('is_jamaican', filters.isJamaican);
      }
      if (filters?.genre) {
        query = query.contains('genres', [filters.genre]);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      return await query;
    },

    getById: async (id: string) => {
      return await supabase
        .from('artists')
        .select('*')
        .eq('id', id)
        .single();
    },

    search: async (query: string) => {
      return await supabase
        .from('artists')
        .select('*')
        .ilike('name', `%${query}%`)
        .order('popularity', { ascending: false });
    },
  },

  // Event operations
  events: {
    getUpcoming: async (limit = 10) => {
      return await supabase
        .from('events')
        .select('*')
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .limit(limit);
    },

    getByArtist: async (artistId: string) => {
      return await supabase
        .from('events')
        .select('*')
        .eq('artist_id', artistId)
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true });
    },
  },

  // Subscription operations
  subscriptions: {
    getByUserId: async (userId: string) => {
      return await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();
    },

    create: async (subscription: Database['public']['Tables']['subscriptions']['Insert']) => {
      return await supabase
        .from('subscriptions')
        .insert(subscription)
        .select()
        .single();
    },

    update: async (id: string, updates: Database['public']['Tables']['subscriptions']['Update']) => {
      return await supabase
        .from('subscriptions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    },
  },
};
