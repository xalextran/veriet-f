"use client";

import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Download, Plus } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { BillingSectionSkeleton } from "./billing-section-skeleton";

export function BillingSection() {
  return (
    <div className="space-y-6">
      {/* Current Plan Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1.5">
            <CardTitle>Current plan</CardTitle>
            <CardDescription>Your current subscription details</CardDescription>
          </div>
          <div className="flex items-center justify-between">
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Upgrade plan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <span className="text-sm font-medium">Plan</span>
              <span className="text-sm text-muted-foreground">Free Tier</span>
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

      {/* Payment Method Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1.5">
            <CardTitle>Payment method</CardTitle>
            <CardDescription>Your saved payment information</CardDescription>
          </div>
          <div className="flex items-center justify-between">
            <Button size="sm">
              <CreditCard className="h-4 w-4" />
              Add payment method
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-md bg-muted/30">
            <p className="text-sm text-muted-foreground">
              No payment method added yet.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Billing History Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1.5">
            <CardTitle>Billing history</CardTitle>
            <CardDescription>Your past invoices and payments</CardDescription>
          </div>
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
              Download invoices
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-md bg-muted/30">
            <p className="text-sm text-muted-foreground">
              No billing history available.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main export with Suspense boundary
export function BillingSectionWithSuspense() {
  return (
    <Suspense fallback={<BillingSectionSkeleton />}>
      <BillingSection />
    </Suspense>
  );
} 