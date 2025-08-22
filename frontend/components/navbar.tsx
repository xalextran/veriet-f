"use client";

import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Menu, Zap, X, HelpCircle, Settings, LogOut, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { usePathname } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { OrgSwitcher } from "@/components/org-switcher";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isSettingsPage = pathname === "/settings";
  const { resolvedTheme, setTheme } = useTheme();
  const { user } = useUser();
  const initials = user?.fullName?.split(" ").map(n => n[0]).join("") || "U";

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Mobile top bar component
  const MobileTopBar = () => (
    <div
      className={`bg-background flex h-14 items-center justify-between container-padding-x relative ${
        !isMenuOpen ? "border-border border-b" : ""
      }`}
    >
      {/* Mobile menu toggle button */}
      <div className="absolute left-4 flex items-center gap-3">
        <Button
          variant="ghost"
          onClick={toggleMenu}
          className="h-9 w-9 p-0 [&_svg]:size-5"
        >
          <span
            className={`absolute transition-all duration-300 ${
              isMenuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
            }`}
          >
            <Menu />
          </span>
          <span
            className={`absolute transition-all duration-300 ${
              isMenuOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
            }`}
          >
            <X />
          </span>
        </Button>
      </div>

      {/* Logo */}
      <div className="flex items-center gap-2 mx-auto" style={{ maxWidth: 320 }}>
        <Link href="/">
          <Logo height={16} />
        </Link>
        <Badge variant="secondary">Beta</Badge>
        <OrgSwitcher />

      </div>

      {/* Mobile upgrade button */}
      <div className="absolute right-4 flex items-center gap-3">
        <Button className="h-9 w-9 p-0 [&_svg]:size-5">
          <Zap />
        </Button>
      </div>
    </div>
  );

  // Navigation items component
  const NavItems = ({ isMobile = false }) => {
    const linkClasses = `font-medium ${isMobile ? "text-base" : "text-sm"} ${
      isMobile
        ? "text-muted-foreground"
        : "text-muted-foreground hover:bg-primary/5"
    } px-3 py-2 rounded-md`;

    // Hide main navigation items on settings page
    if (isSettingsPage) {
      return null;
    }

    return (
      <>
        {/* Main navigation links */}
        <Link
          href="/dashboard"
          className={`${linkClasses} ${
            pathname === "/dashboard" ? "text-primary" : ""
          }`}
        >
          Dashboard
        </Link>
        <Link 
          href="/library" 
          className={`${linkClasses} ${
            pathname === "/library" ? "text-primary" : ""
          }`}
        >
          Library
        </Link>
        <Link 
          href="/rules" 
          className={`${linkClasses} ${
            pathname === "/rules" ? "text-primary" : ""
          }`}
        >
          Rules
        </Link>
      </>
    );
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="border-border bg-background hidden border-b shadow-sm lg:block">
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6 py-3.5 md:py-4 navbar-padding-x">
          {/* Three-column grid layout for desktop */}
          <div className="hidden w-full lg:grid lg:grid-cols-3 lg:items-center">
            {/* Left: Logo */}
            <div className="flex items-center gap-2 mr-4">
              <Link href="/">
                <Logo height={16} />
              </Link>
              <Badge variant="secondary">Beta</Badge>
              <OrgSwitcher />
            </div>
            {/* Center: Navigation */}
            <div className="flex justify-center">
              <NavItems />
            </div>
            {/* Right: Actions */}
            <div className="flex justify-end items-center gap-x-4">
              <Button>
                <Zap className="h-4 w-4" /> Upgrade
              </Button>
              {/* User menu popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer">
                    {user?.imageUrl ? (
                      <AvatarImage src={user.imageUrl} alt={user.fullName || "Account"} />
                    ) : (
                      <AvatarFallback>{initials}</AvatarFallback>
                    )}
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-44 p-1.5"
                  onOpenAutoFocus={event => event.preventDefault()}
                >
                  <div className="flex flex-col gap-0.5">
                    <Link href="/help" className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-accent cursor-pointer text-sm">
                      <HelpCircle className="h-4 w-4" />
                      Help
                    </Link>
                    <Link href="/settings" className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-accent cursor-pointer text-sm">
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <div className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-accent cursor-pointer text-sm">
                      <span className="flex items-center gap-2">
                        {resolvedTheme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                        {resolvedTheme === "dark" ? "Dark mode" : "Light mode"}
                      </span>
                      <Switch
                        checked={resolvedTheme === "dark"}
                        onCheckedChange={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                      />
                    </div>
                    <Separator className="my-1" />
                    <SignOutButton>
                      <button className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-accent cursor-pointer text-sm w-full">
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </SignOutButton>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="lg:hidden">
        <MobileTopBar />
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="border-border bg-background border-b lg:hidden">
          <div className="flex flex-col">
            {/* Mobile menu content */}
            <div className="flex-grow overflow-y-auto p-2">
              <div className="flex flex-col">
                <NavItems isMobile={true} />
              </div>
            </div>
            <Separator />
            {/* Mobile user profile section */}
            <div className="p-2">
              {/* User info */}
              <div className="flex items-center space-x-3 p-2">
                <Avatar>
                  {user?.imageUrl ? (
                    <AvatarImage src={user.imageUrl} alt={user.fullName || "Account"} />
                  ) : (
                    <AvatarFallback>{initials}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="font-medium">{user?.fullName || "User"}</p>
                  <p className="text-muted-foreground text-sm">
                    {user?.primaryEmailAddress?.emailAddress || "No email"}
                  </p>
                </div>
              </div>
              {/* User-related links */}
              <div>
                <Link
                  href="/help"
                  className="text-muted-foreground block rounded-md px-2 py-2 font-medium flex items-center gap-2"
                >
                  <HelpCircle className="h-4 w-4" />
                  Help
                </Link>
                <Link
                  href="/settings"
                  className="text-muted-foreground block rounded-md px-2 py-2 font-medium flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <div className="flex items-center justify-between px-2 py-2 rounded-md">
                  <span className="text-muted-foreground font-medium flex items-center gap-2">
                    {resolvedTheme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    {resolvedTheme === "dark" ? "Dark mode" : "Light mode"}
                  </span>
                  <Switch
                    checked={resolvedTheme === "dark"}
                    onCheckedChange={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                  />
                </div>
                <SignOutButton>
                  <button className="text-muted-foreground block rounded-md px-2 py-2 font-medium w-full text-left flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </SignOutButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 