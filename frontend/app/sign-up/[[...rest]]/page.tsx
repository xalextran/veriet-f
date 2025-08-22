"use client";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  // Redirect to the root page after sign-up.
  return (
    <div style={{ minHeight: '100vh' }} className="flex items-center justify-center">
      <SignUp
        fallbackRedirectUrl="/"
        forceRedirectUrl="/"
      />
    </div>
  );
} 