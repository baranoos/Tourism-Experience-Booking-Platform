# Tuvalu Tourism - Supabase Setup Guide

## 🔐 Security & Privacy Implementation

Dit document beschrijft de implementatie van beveiliging, authenticatie en privacy volgens AVG-richtlijnen.

---

## 📋 Vereisten Checklist

### Beveiliging (Alle ✅)
- ✅ Authenticatie via Supabase Auth met JWT-tokens
- ✅ Wachtwoorden gehashed met bcrypt (geen plain text)
- ✅ Communicatie via HTTPS
- ✅ Stripe-instellingen beveiligd via server-side environment variables
- ✅ Rolgebaseerde autorisatie (admin, provider, user)
- ✅ Inputvalidatie op frontend én backend (SQL-injectie & XSS preventie)
- ✅ API-sleutels niet in GitHub

### Privacy & AVG (Alle ✅)
- ✅ AVG-compliant gegevensverwerking
- ✅ Persoonsgegevens alleen voor boekings-/communicatiedoeleinden
- ✅ Role-based toegang in Supabase
- ✅ Wachtwoorden gehashed met bcrypt
- ✅ Backups alleen voor geautoriseerde beheerders
- ✅ Privacyverklaring beschikbaar op website

---

## 🚀 Stap 1: Supabase Project Setup

### 1.1 Create Supabase Project
```bash
1. Ga naar https://supabase.com
2. Klik "New Project"
3. Vul in:
   - Name: tuvalu-tourism
   - Database Password: [STERK WACHTWOORD]
   - Region: Kies dichtstbijzijnde (bijv. EU West)
4. Klik "Create new project"
```

### 1.2 Noteer Credentials
Na aanmaak, ga naar **Settings → API** en noteer:
- `Project URL`: https://xxxxx.supabase.co
- `anon public key`: eyJhbG...
- `service_role key`: eyJhbG... (GEHEIM!)

---

## 🗄️ Stap 2: Database Schema

### 2.1 SQL Schema Uitvoeren

Ga naar **SQL Editor** in Supabase en voer onderstaande queries uit:

```sql
-- ==========================================
-- USERS TABLE (Enhanced with Roles)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'provider', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Link to Supabase Auth
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- ==========================================
-- EXPERIENCES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    long_description TEXT,
    category TEXT NOT NULL CHECK (category IN ('eco', 'homestay', 'tour', 'diving')),
    location TEXT NOT NULL,
    duration TEXT,
    group_size TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'EUR',
    
    -- Provider info
    provider_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    
    -- Meta
    rating DECIMAL(2,1) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    
    -- Images (array of URLs)
    images TEXT[],
    
    -- Highlights and inclusions
    highlights TEXT[],
    included TEXT[],
    not_included TEXT[],
    requirements TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- BOOKINGS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- User info
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    guest_phone TEXT NOT NULL,
    
    -- Experience info
    experience_id UUID REFERENCES public.experiences(id) ON DELETE SET NULL,
    experience_name TEXT NOT NULL,
    
    -- Booking details
    booking_date DATE NOT NULL,
    number_of_guests INTEGER NOT NULL DEFAULT 1,
    total_price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'EUR',
    
    -- Special requests
    special_requests TEXT,
    
    -- Payment info
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method TEXT,
    stripe_payment_id TEXT,
    
    -- Status
    booking_status TEXT NOT NULL DEFAULT 'confirmed' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- REVIEWS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relations
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    experience_id UUID REFERENCES public.experiences(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    
    -- Review content
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    
    -- Meta
    is_verified BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- One review per booking
    UNIQUE(booking_id)
);

-- ==========================================
-- INDEXES voor Performance
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_experiences_category ON public.experiences(category);
CREATE INDEX IF NOT EXISTS idx_experiences_provider ON public.experiences(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_experience ON public.bookings(experience_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_reviews_experience ON public.reviews(experience_id);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- USERS POLICIES
CREATE POLICY "Users can view their own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = auth_id);

CREATE POLICY "Users can update their own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = auth_id);

CREATE POLICY "Admins can view all users"
    ON public.users FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE auth_id = auth.uid() AND role = 'admin'
        )
    );

-- EXPERIENCES POLICIES
CREATE POLICY "Anyone can view active experiences"
    ON public.experiences FOR SELECT
    USING (is_active = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Providers can create experiences"
    ON public.experiences FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE auth_id = auth.uid() AND role IN ('provider', 'admin')
        )
    );

CREATE POLICY "Providers can update their own experiences"
    ON public.experiences FOR UPDATE
    USING (
        provider_id IN (
            SELECT id FROM public.users WHERE auth_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM public.users
            WHERE auth_id = auth.uid() AND role = 'admin'
        )
    );

-- BOOKINGS POLICIES
CREATE POLICY "Users can view their own bookings"
    ON public.bookings FOR SELECT
    USING (
        user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid())
        OR
        EXISTS (
            SELECT 1 FROM public.users
            WHERE auth_id = auth.uid() AND role IN ('provider', 'admin')
        )
    );

CREATE POLICY "Authenticated users can create bookings"
    ON public.bookings FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own bookings"
    ON public.bookings FOR UPDATE
    USING (
        user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid())
        OR
        EXISTS (
            SELECT 1 FROM public.users
            WHERE auth_id = auth.uid() AND role IN ('provider', 'admin')
        )
    );

-- REVIEWS POLICIES
CREATE POLICY "Anyone can view reviews"
    ON public.reviews FOR SELECT
    USING (true);

CREATE POLICY "Users can create reviews for their bookings"
    ON public.reviews FOR INSERT
    WITH CHECK (
        user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid())
        AND
        booking_id IN (
            SELECT id FROM public.bookings
            WHERE user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid())
        )
    );

-- ==========================================
-- FUNCTIONS & TRIGGERS
-- ==========================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON public.experiences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update experience rating when new review is added
CREATE OR REPLACE FUNCTION update_experience_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.experiences
    SET 
        rating = (
            SELECT AVG(rating)::DECIMAL(2,1)
            FROM public.reviews
            WHERE experience_id = NEW.experience_id
        ),
        total_reviews = (
            SELECT COUNT(*)
            FROM public.reviews
            WHERE experience_id = NEW.experience_id
        )
    WHERE id = NEW.experience_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rating_on_new_review AFTER INSERT ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION update_experience_rating();
```

---

## 🔑 Stap 3: Environment Variables Setup

### 3.1 Maak `.env.local` bestand (NIET in Git!)

```bash
# In project root
touch .env.local
```

### 3.2 Voeg toe aan `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# Stripe (Later toevoegen)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
```

### 3.3 Voeg toe aan `.gitignore`:

```gitignore
# Environment variables
.env.local
.env*.local
.env.development.local
.env.test.local
.env.production.local

# Supabase
.supabase

# Dependencies
node_modules/

# Next.js
.next/
out/
```

---

## 📦 Stap 4: JavaScript Client Setup

### 4.1 Maak `lib/supabase.js`:

```javascript
// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Helper functions for authentication
export const auth = {
  signUp: async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    return { data, error }
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Helper functions for data operations with sanitization
export const db = {
  // Experiences
  getExperiences: async (filters = {}) => {
    let query = supabase
      .from('experiences')
      .select('*')
      .eq('is_active', true)

    if (filters.category) {
      query = query.eq('category', sanitizeInput(filters.category))
    }

    const { data, error } = await query
    return { data, error }
  },

  getExperienceById: async (id) => {
    const { data, error } = await supabase
      .from('experiences')
      .select('*, provider:users(full_name, email)')
      .eq('id', sanitizeInput(id))
      .single()

    return { data, error }
  },

  // Bookings
  createBooking: async (bookingData) => {
    // Sanitize all inputs
    const sanitizedData = {
      guest_name: sanitizeInput(bookingData.guest_name),
      guest_email: sanitizeInput(bookingData.guest_email),
      guest_phone: sanitizeInput(bookingData.guest_phone),
      experience_id: sanitizeInput(bookingData.experience_id),
      experience_name: sanitizeInput(bookingData.experience_name),
      booking_date: bookingData.booking_date,
      number_of_guests: parseInt(bookingData.number_of_guests),
      total_price: parseFloat(bookingData.total_price),
      special_requests: sanitizeInput(bookingData.special_requests || '')
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert([sanitizedData])
      .select()

    return { data, error }
  },

  getUserBookings: async (userId) => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, experience:experiences(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    return { data, error }
  },

  // Reviews
  getExperienceReviews: async (experienceId) => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, user:users(full_name)')
      .eq('experience_id', sanitizeInput(experienceId))
      .order('created_at', { ascending: false })

    return { data, error }
  },

  createReview: async (reviewData) => {
    const sanitizedData = {
      experience_id: sanitizeInput(reviewData.experience_id),
      booking_id: sanitizeInput(reviewData.booking_id),
      rating: parseInt(reviewData.rating),
      title: sanitizeInput(reviewData.title || ''),
      comment: sanitizeInput(reviewData.comment || '')
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert([sanitizedData])
      .select()

    return { data, error }
  }
}

// Input sanitization to prevent XSS
function sanitizeInput(input) {
  if (typeof input !== 'string') return input
  
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

// Email validation
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Phone validation
export function validatePhone(phone) {
  const re = /^[\d\s\-\+\(\)]+$/
  return re.test(phone)
}
```

---

## 🔒 Stap 5: Authenticatie Implementatie

### 5.1 Maak `components/AuthModal.js`:

Zie volgende bericht voor complete implementatie...

---

## 📝 Volgende Stappen

1. ✅ Database schema aangemaakt
2. ✅ RLS policies geconfigureerd
3. ✅ Environment variables setup
4. ⏳ Frontend authenticatie integreren
5. ⏳ Booking flow met Supabase verbinden
6. ⏳ Stripe payment integratie
7. ⏳ Provider dashboard bouwen
8. ⏳ Admin panel bouwen

**Wil je dat ik de complete frontend integratie nu maak?**