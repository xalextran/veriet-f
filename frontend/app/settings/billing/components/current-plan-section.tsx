"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

export function CurrentPlanSection() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1.5">
          <CardTitle>Current plan</CardTitle>
          <CardDescription>Your current subscription details</CardDescription>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Upgrade plan
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-border/50">
            <span className="text-sm font-medium">Plan</span>
            <span className="text-sm text-muted-foreground">Free tier</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border/50">
            <span className="text-sm font-medium">Status</span>
            <span className="text-sm text-muted-foreground">Active</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-sm font-medium">Next billing date</span>
            <span className="text-sm text-muted-foreground">-</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
