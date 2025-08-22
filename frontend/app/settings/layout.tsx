"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

const settingsNavItems = [
  { label: "Account", href: "/settings/account" },
  { label: "Organisation", href: "/settings/organisation" },
  // { label: "Billing", href: "/settings/billing" },
  //{ label: "API keys", href: "/settings/api-keys" },
  // { label: "Notifications", href: "/settings/notifications" },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleMobileNavChange = (value: string) => {
    router.push(value);
  };

  return (
    <div className="bg-background">
      <div className="bg-background min-h-screen relative">
        {/* Header */}
        <div className="border-border bg-background border-b">
          <div className="container-fluid container-padding-x py-4 md:py-6">
            {/* Main content */}
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div className="space-y-2">
                <h1>Settings</h1>
              </div>
              {/* Search */}
              <div className="relative w-full md:max-w-xs">
                <Search className="text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 transform" />
                <Input type="search" placeholder="Search" className="pl-8" />
              </div>
              {/* Mobile-only dropdown */}
              <div className="md:hidden">
                <Select value={pathname} onValueChange={handleMobileNavChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select setting" />
                  </SelectTrigger>
                  <SelectContent>
                    {settingsNavItems.map((item) => (
                      <SelectItem key={item.href} value={item.href}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar - hidden on mobile, no border */}
            <aside className="hidden w-64 container-padding-x py-6 md:block">
              <ul className="-ml-3 space-y-1">
                {settingsNavItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        pathname === item.href
                          ? "bg-accent-foreground/8 text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent-foreground/10 hover:text-accent-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto">
              <div className="container-padding-x py-4 md:py-6 md:pl-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
