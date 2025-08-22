"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function ProfileSection() {
  const { user, isLoaded } = useUser();
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // Initialize form values when user data loads
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.primaryEmailAddress?.emailAddress || "");
    }
  }, [user]);

  // Check if any field has changed
  const hasChanges = 
    firstName !== (user?.firstName || "") ||
    lastName !== (user?.lastName || "") ||
    email !== (user?.primaryEmailAddress?.emailAddress || "");

  const handleSave = async () => {
    if (!user || !hasChanges) return;

    setSaving(true);
    try {
      // Update name fields
      await user.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      // Update email if changed
      if (email.trim() && email !== user.primaryEmailAddress?.emailAddress) {
        const newEmail = await user.createEmailAddress({ email: email.trim() });
        await user.update({ primaryEmailAddressId: newEmail.id });
      }

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      console.error("Profile update error:", error);
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-80" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-18" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-4 border-t">
          <Skeleton className="h-8 w-28" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile information</CardTitle>
        <CardDescription>
          Update your personal information and contact details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                disabled={saving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                disabled={saving}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              disabled={saving}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pt-4 border-t">
        <Button 
          onClick={handleSave} 
          disabled={saving || !hasChanges}
          size="sm"
        >
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}
