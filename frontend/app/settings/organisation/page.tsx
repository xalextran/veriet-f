import { TeamMembersSection } from "./components";

function OrganisationPageContent() {
  return (
    <>
      <div className="space-y-1 mb-6">
        <h1>Organisation</h1>
        <p className="text-muted-foreground">
          Manage your team members and organisation settings.
        </p>
      </div>
      
      <div className="space-y-6">
        <TeamMembersSection />
      </div>
    </>
  );
}

export default function OrganisationPage() {
  return <OrganisationPageContent />;
}
