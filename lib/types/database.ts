export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'reader' | 'admin' | 'partner';
          is_blocked: boolean;
          stripe_customer_id: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'reader' | 'admin' | 'partner';
          is_blocked?: boolean;
          stripe_customer_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'reader' | 'admin' | 'partner';
          is_blocked?: boolean;
          stripe_customer_id?: string | null;
          created_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string | null;
          cover_image: string | null;
          category_id: string | null;
          author_id: string | null;
          status: 'draft' | 'published' | 'archived';
          featured: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: string;
          excerpt?: string | null;
          cover_image?: string | null;
          category_id?: string | null;
          author_id?: string | null;
          status?: 'draft' | 'published' | 'archived';
          featured?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          excerpt?: string | null;
          cover_image?: string | null;
          category_id?: string | null;
          author_id?: string | null;
          status?: 'draft' | 'published' | 'archived';
          featured?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          images: string[];
          stock: number;
          type: 'book' | 'bouquet' | 'other';
          status: 'active' | 'inactive';
          featured: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price: number;
          images?: string[];
          stock?: number;
          type?: 'book' | 'bouquet' | 'other';
          status?: 'active' | 'inactive';
          featured?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          images?: string[];
          stock?: number;
          type?: 'book' | 'bouquet' | 'other';
          status?: 'active' | 'inactive';
          featured?: boolean;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          total: number;
          status: 'pending' | 'processing' | 'completed' | 'cancelled';
          stripe_payment_intent: string | null;
          items: Json;
          shipping_address: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          total: number;
          status?: 'pending' | 'processing' | 'completed' | 'cancelled';
          stripe_payment_intent?: string | null;
          items: Json;
          shipping_address?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          total?: number;
          status?: 'pending' | 'processing' | 'completed' | 'cancelled';
          stripe_payment_intent?: string | null;
          items?: Json;
          shipping_address?: Json | null;
          created_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          plan: 'monthly' | 'annual' | null;
          status: 'active' | 'cancelled' | 'expired' | 'trialing';
          current_period_end: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          plan?: 'monthly' | 'annual' | null;
          status?: 'active' | 'cancelled' | 'expired' | 'trialing';
          current_period_end?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          plan?: 'monthly' | 'annual' | null;
          status?: 'active' | 'cancelled' | 'expired' | 'trialing';
          current_period_end?: string | null;
          created_at?: string;
        };
      };
      site_config: {
        Row: {
          key: string;
          value: string | null;
          updated_at: string;
        };
        Insert: {
          key: string;
          value?: string | null;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: string | null;
          updated_at?: string;
        };
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          subscribed_at: string;
          active: boolean;
        };
        Insert: {
          id?: string;
          email: string;
          subscribed_at?: string;
          active?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          subscribed_at?: string;
          active?: boolean;
        };
      };
    };
  };
}
