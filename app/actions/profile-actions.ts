"use server"

import { revalidatePath } from "next/cache"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Database } from "@/lib/database.types"

export async function updateProfile(formData: FormData) {
  const supabase = createServerActionClient<Database>({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated" }
  }

  const displayName = formData.get("displayName") as string

  if (!displayName || displayName.length === 0 || displayName.length > 32) {
    return { error: "Display name must be between 1 and 32 characters" }
  }

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: displayName, updated_at: new Date().toISOString() })
    .eq("id", user.id)

  if (error) {
    console.error("Error updating profile:", error)
    return { error: "Failed to update profile. " + error.message }
  }

  revalidatePath("/settings")
  revalidatePath("/dashboard") // Also revalidate dashboard if display name is shown there
  return { message: "Profile updated successfully" }
}

export async function uploadAvatar(formData: FormData) {
  const supabase = createServerActionClient<Database>({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated" }
  }

  const file = formData.get("avatar") as File

  if (!file || file.size === 0) {
    return { error: "No file selected" }
  }

  if (file.size > 2 * 1024 * 1024) {
    return { error: "File size must be less than 2MB" }
  }

  if (!file.type.startsWith("image/")) {
    return { error: "File must be an image" }
  }

  const fileExtension = file.name.split(".").pop()
  const fileName = `${user.id}-${Date.now()}.${fileExtension}`
  const filePath = `avatars/${fileName}` // Ensure 'avatars' bucket has public read access or signed URLs are used.

  const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file)

  if (uploadError) {
    console.error("Error uploading avatar:", uploadError)
    return { error: "Failed to upload avatar. " + uploadError.message }
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(filePath)

  if (!publicUrl) {
    console.error("Error getting public URL for avatar")
    return { error: "Failed to get avatar URL." }
  }

  const { error: dbError } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
    .eq("id", user.id)

  if (dbError) {
    console.error("Error updating avatar URL in profile:", dbError)
    // Attempt to delete the orphaned file from storage
    await supabase.storage.from("avatars").remove([filePath])
    return { error: "Failed to update profile with new avatar. " + dbError.message }
  }

  revalidatePath("/settings")
  revalidatePath("/dashboard") // Also revalidate dashboard if avatar is shown there
  return { message: "Avatar updated successfully", avatarUrl: publicUrl }
}

export async function getConnectedAccounts() {
  const supabase = createServerActionClient<Database>({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated", accounts: [] }
  }

  const { data, error } = await supabase
    .from("connected_accounts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching connected accounts:", error)
    return { error: "Failed to fetch connected accounts. " + error.message, accounts: [] }
  }
  return { accounts: data || [] }
}

export async function updatePersonalization(data: { systemPrompt: string; notes: string }) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (data.systemPrompt.length > 1000) {
    return { error: "System prompt must be 1000 characters or less" }
  }

  if (data.notes.length > 2000) {
    return { error: "Notes must be 2000 characters or less" }
  }

  // Here you would save to your actual data source
  // For now, just return success
  revalidatePath("/settings")
  return { success: true, message: "Personalization settings updated successfully" }
}

export async function searchActivity(query: string) {
  // Simulate search delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Mock search results
  const mockResults = [
    {
      id: "1",
      title: "QueueCX Integration Setup",
      description: "Configured QueueCX integration with production environment",
      activity_type: "session",
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Environment Aware Configuration",
      description: "Updated environment awareness settings for better monitoring",
      activity_type: "document",
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "3",
      title: "Fluidity Index Analysis",
      description: "Analyzed system fluidity metrics and performance indicators",
      activity_type: "meeting",
      created_at: new Date(Date.now() - 172800000).toISOString(),
    },
  ]

  if (!query) {
    return { results: mockResults }
  }

  const filtered = mockResults.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description?.toLowerCase().includes(query.toLowerCase()),
  )

  return { results: filtered }
}
