"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRef, useState } from "react";
import { toast } from "sonner";

export function AvatarSection() {
  const { user, isLoaded } = useUser();
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PNG, JPEG, JPG, WebP, or GIF image.");
      return;
    }

    setAvatarPreview(URL.createObjectURL(file));
    setSaving(true);

    try {
      if (user) {
        await user.setProfileImage({ file });
        toast.success("Avatar updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update avatar. Please try again.");
      console.error("Avatar update error:", error);
    } finally {
      setSaving(false);
      setAvatarPreview(null);
    }
  };

  if (!isLoaded) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-[1.25rem] w-16" />
          <Skeleton className="h-[1.25rem] w-72" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 py-4">
            <div className="relative">
              <Skeleton className="h-16 w-16 rounded-full" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-[1.25rem] w-52" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avatar</CardTitle>
        <CardDescription>
          Your profile picture that others will see when they visit your profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 py-4">
          <div className="relative">
            <Avatar className="h-16 w-16">
              {saving && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full z-10">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              )}
              {avatarPreview ? (
                <AvatarImage src={avatarPreview} alt="Avatar preview" />
              ) : user?.imageUrl ? (
                <AvatarImage src={user.imageUrl} alt="Current avatar" />
              ) : (
                <AvatarFallback>
                  {user?.firstName?.[0]?.toUpperCase() || 
                   user?.lastName?.[0]?.toUpperCase() || 
                   "U"}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
          
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              disabled={saving}
            />
            <Button
              variant="outline"
              size="sm"
              className="w-fit"
              onClick={() => fileInputRef.current?.click()}
              disabled={saving}
            >
              <Upload className="h-4 w-4" />
              {saving ? "Uploading..." : "Upload"}
            </Button>
            <p className="text-xs text-muted-foreground">
              Click to change your profile picture
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
