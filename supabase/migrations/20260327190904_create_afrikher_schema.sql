/*
  # AFRIKHER Magazine Platform Database Schema

  ## Overview
  Complete database schema for AFRIKHER editorial magazine platform with
  profiles, articles, products, orders, subscriptions, and site configuration.

  ## Tables Created
  
  1. **profiles** - User profiles extending auth.users
     - id (uuid, references auth.users)
     - full_name (text)
     - avatar_url (text)
     - role (text) - 'reader', 'admin', or 'partner'
     - is_blocked (boolean)
     - stripe_customer_id (text) - for Stripe integration
     - created_at (timestamptz)

  2. **categories** - Article categories
     - id (uuid, primary key)
     - name (text)
     - slug (text, unique)
     - description (text)
     - created_at (timestamptz)

  3. **articles** - Magazine articles
     - id (uuid, primary key)
     - title (text)
     - slug (text, unique)
     - content (text)
     - excerpt (text)
     - cover_image (text)
     - category_id (uuid, references categories)
     - author_id (uuid, references profiles)
     - status (text) - 'draft', 'published', 'archived'
     - featured (boolean)
     - published_at (timestamptz)
     - created_at (timestamptz)
     - updated_at (timestamptz)

  4. **products** - Boutique products (books, bouquets, etc.)
     - id (uuid, primary key)
     - name (text)
     - description (text)
     - price (numeric)
     - images (text[])
     - stock (integer)
     - type (text) - 'book', 'bouquet', 'other'
     - status (text) - 'active', 'inactive'
     - featured (boolean)
     - created_at (timestamptz)

  5. **orders** - Customer orders
     - id (uuid, primary key)
     - user_id (uuid, references profiles)
     - total (numeric)
     - status (text) - 'pending', 'processing', 'completed', 'cancelled'
     - stripe_payment_intent (text)
     - items (jsonb)
     - shipping_address (jsonb)
     - created_at (timestamptz)

  6. **subscriptions** - User subscriptions
     - id (uuid, primary key)
     - user_id (uuid, unique, references profiles)
     - stripe_customer_id (text)
     - stripe_subscription_id (text)
     - plan (text) - 'monthly', 'annual'
     - status (text) - 'active', 'cancelled', 'expired'
     - current_period_end (timestamptz)
     - created_at (timestamptz)

  7. **site_config** - CMS configuration (admin controls all site content)
     - key (text, primary key)
     - value (text)
     - updated_at (timestamptz)

  8. **newsletter_subscribers** - Newsletter subscription list
     - id (uuid, primary key)
     - email (text, unique)
     - subscribed_at (timestamptz)
     - active (boolean)

  ## Security
  - RLS enabled on all tables
  - Restrictive policies requiring authentication
  - Users can only read/write their own data
  - Public read access for published articles, products, and site config
  - Admin role has elevated permissions
*/

-- Create profiles table extending auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  role text DEFAULT 'reader' CHECK (role IN ('reader', 'admin', 'partner')),
  is_blocked boolean DEFAULT false,
  stripe_customer_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  cover_image text,
  category_id uuid REFERENCES categories(id),
  author_id uuid REFERENCES profiles(id),
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published articles are viewable by everyone"
  ON articles FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authors can view own articles"
  ON articles FOR SELECT
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Admins can manage all articles"
  ON articles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  images text[] DEFAULT '{}',
  stock integer DEFAULT 0 CHECK (stock >= 0),
  type text DEFAULT 'other' CHECK (type IN ('book', 'bouquet', 'other')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active products are viewable by everyone"
  ON products FOR SELECT
  USING (status = 'active');

CREATE POLICY "Only admins can manage products"
  ON products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  total numeric NOT NULL CHECK (total >= 0),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  stripe_payment_intent text,
  items jsonb NOT NULL DEFAULT '[]',
  shipping_address jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES profiles(id) NOT NULL,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text CHECK (plan IN ('monthly', 'annual')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'trialing')),
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own subscription"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create site_config table
CREATE TABLE IF NOT EXISTS site_config (
  key text PRIMARY KEY,
  value text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site config is viewable by everyone"
  ON site_config FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage site config"
  ON site_config FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now(),
  active boolean DEFAULT true
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view newsletter subscribers"
  ON newsletter_subscribers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

-- Insert default site configuration
INSERT INTO site_config (key, value) VALUES
  ('site_name', 'AFRIKHER'),
  ('site_tagline', 'L''élégance hors du commun. Le Business au féminin.'),
  ('hero_title', 'Découvrez AFRIKHER'),
  ('hero_subtitle', 'Le magazine des femmes entrepreneures africaines et de la diaspora'),
  ('hero_image', '/images/hero-default.jpg'),
  ('about_text', 'AFRIKHER est une plateforme éditoriale premium dédiée aux femmes entrepreneures africaines et de la diaspora. Nous célébrons l''excellence, l''innovation et le leadership féminin à travers des contenus inspirants et des produits exclusifs.'),
  ('primary_color', '#C9A84C'),
  ('contact_email', 'contact@afrikher.com'),
  ('social_facebook', ''),
  ('social_instagram', ''),
  ('social_linkedin', '')
ON CONFLICT (key) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for articles updated_at
DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for site_config updated_at
DROP TRIGGER IF EXISTS update_site_config_updated_at ON site_config;
CREATE TRIGGER update_site_config_updated_at
  BEFORE UPDATE ON site_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();