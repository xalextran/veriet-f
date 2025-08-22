"use client";
import { useOrganizationList, useOrganization } from "@clerk/nextjs";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import * as React from "react";
import type { OrganizationResource } from "@clerk/types";
import { useRouter } from "next/navigation";

export function OrgSwitcher() {
  const { organization: activeOrg } = useOrganization();
  const { userMemberships, setActive, isLoaded } = useOrganizationList({ userMemberships: true });

  const orgs: OrganizationResource[] = Array.isArray(userMemberships.data) ? userMemberships.data.map((m) => m.organization) : [];

  // Only render when loaded, org context is ready, and the value is valid
  if (
    !isLoaded ||
    (typeof activeOrg === "undefined" && orgs.length > 0) ||
    (activeOrg && !orgs.some(org => org.id === activeOrg.id))
  ) {
    return null;
  }

  return (
    <div className="ml-2 w-full max-w-xs sm:max-w-none sm:w-auto">
      <OrgCombobox orgs={orgs} activeOrg={activeOrg ?? null} setActive={setActive} />
    </div>
  );
}

type OrgComboboxProps = {
  orgs: OrganizationResource[];
  activeOrg: OrganizationResource | null;
  setActive: (args: { organization: string | null }) => Promise<void>;
};

function OrgCombobox({ orgs, activeOrg, setActive }: OrgComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(activeOrg ? activeOrg.id : "none");
  const router = useRouter();

  React.useEffect(() => {
    setValue(activeOrg ? activeOrg.id : "none");
  }, [activeOrg]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[170px] justify-between"
        >
          {value === "none"
            ? "Personal"
            : orgs.find((org: OrganizationResource) => org.id === value)?.name || "Select organization..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[170px] p-0 z-50 left-0 right-0">
        <Command>
          <CommandList>
            <CommandEmpty>No organization found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                key="none"
                value="none"
                onSelect={async () => {
                  setValue("none");
                  await setActive({ organization: null });
                  setOpen(false);
                  router.refresh();
                }}
              >
                <Check className={cn("mr-2 h-4 w-4", value === "none" ? "opacity-100" : "opacity-0")} />
                Personal
              </CommandItem>
              {orgs.map((org: OrganizationResource) => (
                <CommandItem
                  key={org.id}
                  value={org.id}
                  onSelect={async () => {
                    setValue(org.id);
                    await setActive({ organization: org.id });
                    setOpen(false);
                    router.refresh();
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === org.id ? "opacity-100" : "opacity-0")} />
                  {org.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 