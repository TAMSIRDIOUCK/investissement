import { createClient } from '@supabase/supabase-js'

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
