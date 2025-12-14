"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SearchDialog } from "@/components/search-dialog"
import { AppPicker } from "@/components/app-picker"
import { useTheme } from "@/components/theme-provider"
import { useAuth } from "@/components/auth/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Search, Activity, MessageSquare, SettingsIcon, HelpCircle, Download, Sun, Moon, LogOut } from "lucide-react"
import Image from "next/image"

export default function DashboardPage() {
  const [searchOpen, setSearchOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { user, signOut, loading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

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

  if (loading) {
    return (
      <div className="min-h-screen bg-nature-dark flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
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

        {/* Enhanced Glassmorphic Sidebar */}
        <div
          className={`w-64 ${
            theme === "dark" ? "glass-sidebar" : "glass-sidebar-light"
          } flex flex-col relative z-10 transition-smooth shadow-2xl`}
        >
          <div className="p-4 border-b border-border transition-smooth">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 relative">
                <Image
                  src="/logo.png"
                  alt="planet computer"
                  width={32}
                  height={32}
                  className={`transition-smooth ${theme === "dark" ? "invert" : ""}`}
                />
              </div>
              <span className="font-semibold text-lg transition-smooth text-foreground">
                planet computer
              </span>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
<Button
	              variant="ghost"
	              className="w-full justify-start gap-3 px-3 py-2 h-auto rounded-xl text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-fluid"
	              onClick={() => setSearchOpen(true)}
	            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </Button>

            <div className="space-y-1 pt-4">
              <SidebarItem icon={Activity} label="My Activity" active onClick={() => {}} />
              <SidebarItem
                icon={MessageSquare}
                label="Context"
                nested
                onClick={() => handleNavigation("/context")}
              />
              <SidebarItem
                icon={SettingsIcon}
                label="Settings"
                onClick={() => handleNavigation("/settings")}
              />
            </div>
          </nav>

          <div className="p-4 border-t border-border transition-smooth space-y-2">
            <SidebarItem icon={HelpCircle} label="Help Center" onClick={() => {}} />
            <SidebarItem icon={Download} label="Download planet computer" onClick={() => {}} />

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8 ring-2 ring-white/20">
                  <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
<AvatarFallback
	                    className="transition-smooth bg-primary/80 text-primary-foreground backdrop-blur-sm"
	                  >
                    {displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium transition-smooth text-foreground">
                    {displayName}
                  </p>
                  <p className="text-xs truncate transition-smooth text-muted-foreground">
                    {user?.email || "demo@planetcomputer.com"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
<Button
	                  variant="ghost"
	                  size="sm"
	                  onClick={handleThemeToggle}
	                  className="rounded-full text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-fluid"
	                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
<Button
	                  variant="ghost"
	                  size="sm"
	                  onClick={handleSignOut}
	                  className="rounded-full text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-fluid"
	                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Main Content with Fluid Design */}
        <div className="flex-1 flex flex-col relative z-10">
          <div className="p-8">
            <div className="flex items-center justify-between mb-12">
              <div>
<h1
	                  className="text-4xl font-bold mb-2 text-foreground transition-smooth"
	                >
                  Good morning, {displayName}
                </h1>
<p
	                  className="text-lg text-muted-foreground transition-smooth"
	                >
                  Welcome back to your planet computer dashboard
                </p>
              </div>
            </div>

            {/* Enhanced Glassmorphic Search Bar */}
            <div className="max-w-3xl mx-auto mb-16">
<div
	                className="relative cursor-pointer group transition-fluid hover:scale-[1.01]"
	                onClick={() => setSearchOpen(true)}
	              >
<Search
	                  className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-muted-foreground group-hover:text-primary transition-smooth"
	                />
                <Input
                  placeholder="Search your activity, files, and more..."
className="pl-16 pr-6 py-7 text-lg rounded-3xl shadow-2xl cursor-pointer border-2 transition-fluid glass-effect-light dark:glass-effect placeholder:text-muted-foreground hover:border-primary/50 focus-glass group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
                  readOnly
                />
<div
	                  className="absolute right-6 top-1/2 transform -translate-y-1/2 flex items-center gap-3 text-sm text-muted-foreground"
	                >
                  <span className="hidden sm:inline">Type</span>
<kbd
	                    className="px-3 py-1.5 rounded-lg text-xs font-mono glass-effect-light dark:glass-effect text-foreground"
	                  >
                    #
                  </kbd>
                  <span className="hidden md:inline">for summaries,</span>
<kbd
	                    className="px-3 py-1.5 rounded-lg text-xs font-mono glass-effect-light dark:glass-effect text-foreground"
	                  >
                    ?
                  </kbd>
                  <span className="hidden sm:inline">for help</span>
                </div>
              </div>
            </div>

            {/* App Picker with Enhanced Glass Effect */}
            <div className="transition-smooth">
              <AppPicker />
            </div>
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
      flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm cursor-pointer transition-smooth
${
		        active
		          ? "bg-primary/10 text-primary font-medium shadow-lg ring-2 ring-primary/50"
		          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
		      }
      ${nested ? "ml-4" : ""}
      hover:translate-x-1 transition-fluid
    `}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </div>
  )
}
