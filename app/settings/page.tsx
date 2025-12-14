"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { SearchDialog } from "@/components/search-dialog"
import { useTheme } from "@/components/theme-provider"
import { useAuth } from "@/components/auth/auth-provider"
import { updateProfile, uploadAvatar } from "@/app/actions/profile-actions"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Search,
  Activity,
  MessageSquare,
  SettingsIcon,
  User,
  Shield,
  Lock,
  CreditCard,
  HelpCircle,
  Download,
  Upload,
  Loader2,
  Sun,
  Moon,
  LogOut,
} from "lucide-react"
import Image from "next/image"

const mockConnectedAccounts = [
  {
    id: "1",
    user_id: "1",
    provider: "x",
    provider_account_id: "alexchen",
    provider_email: "alex.chen@company.com",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "1",
    provider: "google",
    provider_account_id: "alexchen",
    provider_email: "alex.chen@gmail.com",
    created_at: new Date().toISOString(),
  },
]

export default function SettingsPage() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get("tab") || "profile"
  const [activeTab, setActiveTab] = useState(initialTab)
  const [searchOpen, setSearchOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const { user, signOut, loading } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <div className="min-h-screen bg-nature-dark flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/backgrounds/nature-bg-2.jpg"
            alt="Background"
            fill
            className="object-cover blur-3xl"
            priority
          />
        </div>
        <div className={`animate-spin rounded-full h-12 w-12 border-b-3 border-primary glass-effect p-3`}></div>
      </div>
    )
  }

  const handleProfileUpdate = async (formData: FormData) => {
    startTransition(async () => {
      const result = await updateProfile(formData)
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: result.message,
        })
      }
    })
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("avatar", file)

    const result = await uploadAvatar(formData)
    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: result.message,
      })
    }
    setIsUploading(false)
  }

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)

    document.documentElement.classList.remove("light", "dark")
    document.documentElement.classList.add(newTheme)

    toast({
      title: "Theme Changed",
      description: `Switched to ${newTheme} mode`,
    })
  }

  const handleSignOut = async () => {
    await signOut()
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully",
    })
  }

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Demo User"

  return (
    <>
      <div className="flex min-h-screen relative overflow-hidden">
        {/* Nature-Inspired Background Layer */}
        <div className="fixed inset-0 z-0 transition-colors duration-500">
          {theme === "dark" ? (
            <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/10 to-background">
              <div className="absolute inset-0 opacity-15">
                <Image
                  src="/backgrounds/nature-bg-2.jpg"
                  alt="Nature Background"
                  fill
                  className="object-cover blur-3xl"
                  priority
                />
              </div>
              {/* Organic floating shapes */}
              <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float-slow"></div>
              <div className="absolute bottom-40 left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float"></div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/10 to-background">
              <div className="absolute inset-0 opacity-30">
                <Image
                  src="/backgrounds/nature-bg-1.jpg"
                  alt="Nature Background"
                  fill
                  className="object-cover blur-2xl"
                  priority
                />
              </div>
              {/* Organic floating shapes */}
              <div className="absolute top-20 right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float-slow"></div>
              <div className="absolute bottom-40 left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-float"></div>
              <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-primary/15 rounded-full blur-3xl animate-float"></div>
            </div>
          )}
        </div>
        {/* Sidebar */}
        <div
          className={`w-64 ${
            theme === "dark" ? "glass-sidebar" : "glass-sidebar-light"
          } flex flex-col relative z-10 transition-smooth shadow-2xl`}
        >
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 relative">
                <Image
                  src="/logo.png"
                  alt="planet computer"
                  width={32}
                  height={32}
                  className={theme === "dark" ? "invert" : ""}
                />
              </div>
              <span className="font-semibold text-lg text-foreground">
                planet computer
              </span>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-3 py-2 h-auto text-muted-foreground hover:bg-secondary/50 hover:text-foreground backdrop-blur-sm transition-all duration-200"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </Button>

            <div className="space-y-1 pt-4">
              <SidebarItem
                icon={Activity}
                label="My Activity"
                onClick={() => handleNavigation("/dashboard")}
              />
              <SidebarItem
                icon={MessageSquare}
                label="Context"
                nested
                onClick={() => handleNavigation("/context")}
              />
              <SidebarItem icon={SettingsIcon} label="Settings" active onClick={() => {}} />
              <SidebarItem
                icon={User}
                label="Personal Profile"
                nested
                onClick={() => setActiveTab("profile")}
              />
              <SidebarItem
                icon={Shield}
                label="Security & access"
                nested
                onClick={() => setActiveTab("security")}
              />
              <SidebarItem icon={Lock} label="Data & privacy" nested onClick={() => {}} />
              <SidebarItem
                icon={CreditCard}
                label="Billing"
                nested
                onClick={() => setActiveTab("billing")}
              />
            </div>
          </nav>

          <div className="p-4 border-t border-border space-y-2">
            <SidebarItem icon={HelpCircle} label="Help Center" onClick={() => {}} />
            <SidebarItem icon={Download} label="Download planet computer" onClick={() => {}} />

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback
                    className={`${
                      theme === "dark" ? "bg-emerald-600/60 text-white" : "bg-emerald-600/80 text-white"
                    } backdrop-blur-sm`}
                  >
                    {displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {displayName}
                  </p>
                  <p className="text-xs truncate text-muted-foreground">
                    {user?.email || "demo@planetcomputer.com"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleThemeToggle}
                  className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col relative z-10 overflow-auto">
          <div className="max-w-4xl mx-auto p-8">
            <div className="mb-8">
              <p className={`text-sm mb-2 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>Settings</p>
              <h1 className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                Personal settings
              </h1>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList
                className={`grid w-full grid-cols-3 ${
                  theme === "dark" ? "bg-black/20 border-white/10" : "bg-white/20 border-black/10"
                } backdrop-blur-xl border rounded-xl h-auto p-1`}
              >
                <TabsTrigger
                  value="profile"
                  className={`border-0 rounded-lg py-3 ${
                    theme === "dark"
                      ? "data-[state=active]:bg-emerald-600/30 text-slate-300 data-[state=active]:text-white"
                      : "data-[state=active]:bg-emerald-600/20 text-slate-700 data-[state=active]:text-slate-900"
                  } data-[state=active]:backdrop-blur-sm`}
                >
                  Personal profile
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className={`border-0 rounded-lg py-3 ${
                    theme === "dark"
                      ? "data-[state=active]:bg-emerald-600/30 text-slate-300 data-[state=active]:text-white"
                      : "data-[state=active]:bg-emerald-600/20 text-slate-700 data-[state=active]:text-slate-900"
                  } data-[state=active]:backdrop-blur-sm`}
                >
                  Security & access
                </TabsTrigger>
                <TabsTrigger
                  value="billing"
                  className={`border-0 rounded-lg py-3 ${
                    theme === "dark"
                      ? "data-[state=active]:bg-emerald-600/30 text-slate-300 data-[state=active]:text-white"
                      : "data-[state=active]:bg-emerald-600/20 text-slate-700 data-[state=active]:text-slate-900"
                  } data-[state=active]:backdrop-blur-sm`}
                >
                  Billing
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-8">
                {/* Avatar Section */}
                <Card
                  className="bg-background/50 border-border backdrop-blur-xl"
                >
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">
                      Avatar
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      This is your avatar. Click on the avatar to upload a custom one from your files.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar
                        className="w-16 h-16 cursor-pointer transition-all duration-200 hover:scale-105"
                        onClick={() => document.getElementById("avatar-upload")?.click()}
                      >
                        <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback
                          className={`text-lg ${
                            theme === "dark" ? "bg-emerald-600/60 text-white" : "bg-emerald-600/80 text-white"
                          } backdrop-blur-sm`}
                        >
                          {displayName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Loader2 className="w-6 h-6 text-white animate-spin" />
                        </div>
                      )}
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                        disabled={isUploading}
                      />
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm mb-2 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                        An avatar is optional but strongly recommended.
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById("avatar-upload")?.click()}
                        disabled={isUploading}
                        className={`${
                          theme === "dark"
                            ? "border-white/20 text-slate-300 hover:bg-white/10 hover:text-white"
                            : "border-emerald-500/30 text-emerald-700 hover:bg-emerald-500/10 hover:text-emerald-800"
                        } backdrop-blur-sm transition-all duration-200 hover:scale-105`}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Avatar
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Display Name Section */}
                <Card
                  className="bg-background/50 border-border backdrop-blur-xl"
                >
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">
                      Display Name
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Please enter your full name, or a display name you are comfortable with.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form action={handleProfileUpdate} className="space-y-4">
                      <div className="space-y-2">
                        <Input
                          name="displayName"
                          defaultValue={displayName}
                          className={`max-w-md ${
                            theme === "dark"
                              ? "bg-black/20 border-white/20 text-white placeholder:text-slate-400"
                              : "bg-white/60 border-black/20 text-slate-900 placeholder:text-slate-600"
                          } backdrop-blur-sm`}
                          maxLength={32}
                          required
                        />
                        <p className="text-sm text-muted-foreground">
                          Please use 32 characters at maximum.
                        </p>
                      </div>
                      <Button
                        type="submit"
                        disabled={isPending}
                        className={`${
                          theme === "dark"
                            ? "bg-emerald-600/80 hover:bg-emerald-600 text-white"
                            : "bg-emerald-600/80 hover:bg-emerald-600 text-white"
                        } backdrop-blur-sm transition-all duration-200 hover:scale-105`}
                      >
                        {isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Change"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Connected Accounts Section */}
                <Card
                  className="bg-background/50 border-border backdrop-blur-xl"
                >
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">
                      Connected accounts
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      External services currently linked to your account for simplified sign-in.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockConnectedAccounts.map((account) => (
                      <div
                        key={account.id}
                        className="flex items-center gap-3 p-3 border border-border rounded-lg backdrop-blur-sm transition-all duration-200 hover:scale-[1.01] bg-secondary/50"
                      >
                        {account.provider === "x" ? (
                          <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                            <span className="text-black text-xs font-bold">𝕏</span>
                          </div>
                        ) : (
                          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">G</span>
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-medium capitalize text-foreground">
                            {account.provider === "x" ? "X (Twitter)" : account.provider}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {account.provider_email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-8">
                <Card
                  className="bg-background/50 border-border backdrop-blur-xl"
                >
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">
                      Security Settings
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Manage your account security and access preferences.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Security settings will be available here.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="billing" className="space-y-8">
                <Card
                  className="bg-background/50 border-border backdrop-blur-xl"
                >
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">
                      Billing Information
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Manage your subscription and billing details.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Billing information will be available here.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}

interface SidebarItemProps {
  icon: React.ElementType
  label: string
  active?: boolean
  nested?: boolean
  onClick: () => void
}

function SidebarItem({ icon: Icon, label, active = false, nested = false, onClick }: SidebarItemProps) {
  return (
    <div
      onClick={onClick}
      className={`
      flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer transition-all duration-200
      ${
        active
          ? "bg-primary/20 text-primary font-medium backdrop-blur-sm"
          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground hover:backdrop-blur-sm"
      }
      ${nested ? "ml-4" : ""}
    `}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </div>
  )
}
