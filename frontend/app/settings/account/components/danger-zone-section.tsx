"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CONFIRMATION_TEXT = "delete account for real";

export function DangerZoneSection() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const isConfirmationValid = confirmationInput === CONFIRMATION_TEXT;

  const handleDeleteAccount = async () => {
    if (!user || !isConfirmationValid) return;

    setIsDeleting(true);
    try {
      await user.delete();
      toast.success("Account deleted successfully");
      router.push("/");
    } catch (error) {
      toast.error("Failed to delete account. Please try again.");
      console.error("Account deletion error:", error);
      setIsDeleting(false);
    }
  };

  const handleDialogClose = () => {
    setIsOpen(false);
    setConfirmationInput("");
  };

  if (!isLoaded) {
    return (
      <Card className="border-destructive/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-lg bg-destructive/5 border-destructive/20">
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-80" />
              </div>
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
    <Card className="border-destructive/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <CardTitle className="text-destructive">Danger zone</CardTitle>
        </div>
        <CardDescription>
          Permanently delete your account and all associated data. This action cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 border rounded-lg bg-destructive/5 border-destructive/20">
          <div className="space-y-2">
            <p className="text-sm font-medium text-destructive">
              ⚠️ This action is irreversible
            </p>
            <p className="text-xs text-muted-foreground">
              All your data, traces, API keys, and account information will be permanently deleted.
              Any active subscriptions will be cancelled immediately.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pt-4 border-t">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm">
              Delete account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Delete account
              </DialogTitle>
              <DialogDescription className="space-y-2">
                <p>This action cannot be undone. This will permanently delete your account and remove all data.</p>
                <p>
                  To confirm, type{" "}
                  <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">
                    {CONFIRMATION_TEXT}
                  </code>{" "}
                  in the box below:
                </p>
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <Input
                value={confirmationInput}
                onChange={(e) => setConfirmationInput(e.target.value)}
                placeholder="Type confirmation text here..."
                disabled={isDeleting}
                className="font-mono text-sm"
              />
            </div>

            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDialogClose}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteAccount}
                disabled={!isConfirmationValid || isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete account"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}