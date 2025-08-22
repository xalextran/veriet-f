import { AvatarSection, ProfileSection, DangerZoneSection } from "./components";

function AccountPageContent() {
  return (
    <>
      <div className="space-y-1 mb-6">
        <h1>Account</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      
      <div className="space-y-6">
        <AvatarSection />
        <ProfileSection />
        <DangerZoneSection />
      </div>
    </>
  );
}

export default function AccountPage() {
  return <AccountPageContent />;
}
