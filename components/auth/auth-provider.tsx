"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import type { User, Session } from "@supabase/supabase-js"
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase"
import type { Database } from "@/lib/database.types"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

type AuthContextType = {
  user: (User & { profile?: Profile }) | null
  session: Session | null
  loading: boolean
  isConfigured: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<(User & { profile?: Profile }) | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const configured = isSupabaseConfigured()
  const supabase = getSupabaseClient()

  const fetchUserProfile = useCallback(
    async (userId: string): Promise<Profile | null> => {
      if (!supabase) return null
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()
      if (error) {
        console.error("Error fetching profile:", error)
        return null
      }
      return data
    },
    [supabase]
  )

  useEffect(() => {
    if (!configured || !supabase) {
      // Demo mode - create a mock user immediately
      setUser({
        id: "demo-user",
        email: "demo@queuecx.com",
        user_metadata: {
          display_name: "Demo User",
        },
        profile: {
          id: "demo-user",
          display_name: "Demo User",
          avatar_url: null,
          email: "demo@queuecx.com",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      } as User & { profile: Profile })
      setLoading(false)
      return
    }

    const updateUserProfile = async (authUser: User | null) => {
      if (authUser) {
        const profile = await fetchUserProfile(authUser.id)
        setUser({ ...authUser, profile: profile ?? undefined })
      } else {
        setUser(null)
      }
      setLoading(false)
    }

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      await updateUserProfile(session?.user ?? null)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      await updateUserProfile(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [configured, supabase, fetchUserProfile])

  const signIn = async (email: string, password: string) => {
    if (!configured || !supabase) {
      // Demo mode - simulate successful sign in
      setUser({
        id: "demo-user",
        email: email,
        user_metadata: {
          display_name: email.split("@")[0],
        },
      } as User)
      return {}
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error: error?.message }
  }

  const signUp = async (email: string, password: string) => {
    if (!configured || !supabase) {
      // Demo mode - simulate successful sign up
      setUser({
        id: "demo-user",
        email: email,
        user_metadata: {
          display_name: email.split("@")[0],
        },
      } as User)
      return {}
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { error: error?.message }
  }

  const signOut = async () => {
    if (!configured || !supabase) {
      // Demo mode - just clear user
      setUser(null)
      setSession(null)
      return
    }

    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isConfigured: configured,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
