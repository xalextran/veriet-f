"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";

export function BillingHistorySection() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1.5">
          <CardTitle>Billing history</CardTitle>
          <CardDescription>Your past invoices and payments</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download invoices
        </Button>
      </CardHeader>
      <CardContent>
        <div className="p-4 border rounded-md bg-muted/30">
          <p className="text-sm text-muted-foreground">
            No billing history available.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
