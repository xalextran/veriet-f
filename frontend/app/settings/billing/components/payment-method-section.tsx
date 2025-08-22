"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export function PaymentMethodSection() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1.5">
          <CardTitle>Payment method</CardTitle>
          <CardDescription>Your saved payment information</CardDescription>
        </div>
        <Button size="sm">
          <CreditCard className="h-4 w-4 mr-2" />
          Add payment method
        </Button>
      </CardHeader>
      <CardContent>
        <div className="p-4 border rounded-md bg-muted/30">
          <p className="text-sm text-muted-foreground">
            No payment method added yet.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
