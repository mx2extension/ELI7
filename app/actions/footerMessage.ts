'use server'

import { createClient } from '@supabase/supabase-js'

// Initialize Supabase using your Environment Variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role key bypasses RLS securely on the server
)

export async function submitFooterMessage(email: string) {
  if (!email || !email.includes('@')) {
    return { error: 'Please enter a valid email address.' }
  }

  const { error } = await supabase
    .from('footer_messages')
    .insert([{ email }])

  if (error) {
    console.error('Supabase error:', error)
    return { error: 'Something went wrong. Please try again.' }
  }

  return { success: 'Message sent successfully!' }
}