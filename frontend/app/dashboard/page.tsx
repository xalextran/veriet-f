import { SummarySection, FilesAttentionSection, RecentActivitySection } from "./components";
import { UploadButton } from "@/components/upload-button";

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Page-level heading */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your intelligent filing system.
          </p>
        </div>
        <UploadButton />
      </div>
      
      <SummarySection />
      
      {/* Two-column layout for main content sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FilesAttentionSection />
        <RecentActivitySection />
      </div>
    </div>
  );
}