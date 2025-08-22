import { Badge } from "@/components/ui/badge";
import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

// Generic color variant mapping for outline badges
const badgeColorVariants: Record<string, string> = {
  green: "border-green-600 text-green-600 dark:border-green-400 dark:text-green-400 [a&]:hover:bg-green-600/10 [a&]:hover:text-green-600/90 dark:[a&]:hover:bg-green-400/10 dark:[a&]:hover:text-green-400/90",
  grey: "border-gray-500 text-gray-500 dark:border-gray-400 dark:text-gray-400 [a&]:hover:bg-gray-500/10 [a&]:hover:text-gray-500/90 dark:[a&]:hover:bg-gray-400/10 dark:[a&]:hover:text-gray-400/90",
  blue: "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 [a&]:hover:bg-blue-600/10 [a&]:hover:text-blue-600/90 dark:[a&]:hover:bg-blue-400/10 dark:[a&]:hover:text-blue-400/90",
  red: "text-red-600 border-red-600 dark:text-red-400 dark:border-red-400 [a&]:hover:bg-red-600/10 [a&]:hover:text-red-600/90 dark:[a&]:hover:bg-red-400/10 dark:[a&]:hover:text-red-400/90",
  purple: "border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400 [a&]:hover:bg-purple-600/10 [a&]:hover:text-purple-600/90 dark:[a&]:hover:bg-purple-400/10 dark:[a&]:hover:text-purple-400/90",
  pending: "border-gray-500 text-gray-500 dark:border-gray-400 dark:text-gray-400 [a&]:hover:bg-gray-500/10 [a&]:hover:text-gray-500/90 dark:[a&]:hover:bg-gray-400/10 dark:[a&]:hover:text-gray-400/90",
};

// Generic StatusBadge component
export function StatusBadge({
  label,
  color = "grey",
  icon: Icon,
  iconClass,
  className,
}: {
  label: string;
  color?: keyof typeof badgeColorVariants;
  icon?: ComponentType<{ className?: string }>;
  iconClass?: string;
  className?: string;
}) {
  return (
    <Badge variant="outline" className={cn(badgeColorVariants[color] || badgeColorVariants["grey"], "w-24 justify-center", className)}>
      {Icon && <Icon className={cn("size-3", iconClass)} />} {label}
    </Badge>
  );
}
