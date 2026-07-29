import { createClient } from '@supabase/supabase-js'
import type { Ratings } from './criteria'

// Récupérer les variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Vérifier que les variables existent
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables Supabase manquantes!')
  console.error('URL:', supabaseUrl)
  console.error('Key:', supabaseAnonKey)
  throw new Error('Missing Supabase environment variables')
}

console.log('✅ Supabase configuré avec succès!')
console.log('📍 URL:', supabaseUrl)

// Créer et exporter le client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Exporter également les variables pour utilisation éventuelle
export { supabaseUrl, supabaseAnonKey }

// ============================================
// TYPES
// ============================================

export type Company = {
  id: number
  name: string
  description?: string
  sector?: string
  created_at?: string
  ratings?: Ratings
}

export type Rating = {
  id: number
  company_id: number
  user_id?: string
  criteria_key: string
  value: number | null
  created_at?: string
}

export type Evaluation = {
  id: number
  company_id: number
  user_id?: string
  score: number
  created_at?: string
}

export type Favorite = {
  id: number
  company_id: number
  user_id?: string
  created_at?: string
}