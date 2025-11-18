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