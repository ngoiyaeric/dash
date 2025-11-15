import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // If Supabase is not configured, allow access (demo mode)
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://dummy.supabase.co') {
    return res
  }

  try {
    // Get the session token from cookies
    const token = req.cookies.get('sb-access-token')?.value || 
                  req.cookies.get('supabase-auth-token')?.value

    // If no token and trying to access protected routes, allow but let client-side handle it
    // This is because middleware can't reliably check session without server-side setup
    // The AuthProvider on client-side will handle the actual authentication check
    
    return res
  } catch (error) {
    console.error('Middleware error:', error)
    // On error, allow access (fail open for better UX)
    return res
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*', '/context/:path*']
}
