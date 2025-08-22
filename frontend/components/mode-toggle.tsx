"use client";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ModeToggle() {

  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use resolvedTheme for actual active theme
  const isDark = resolvedTheme === "dark";

  if (!mounted) return null;
  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <Sun className={`h-[1.2rem] w-[1.2rem] transition-all ${isDark ? "scale-0 -rotate-90" : "scale-100 rotate-0"}`} />
      <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${isDark ? "scale-100 rotate-0" : "scale-0 rotate-90"}`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
} 