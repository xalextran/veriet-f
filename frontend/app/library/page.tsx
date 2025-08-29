import { LibraryTable } from "./components";
import { UploadButton } from "@/components/upload-button";

export default function LibraryPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Page-level heading */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Library</h1>
          <p className="text-muted-foreground">
            Manage and organize all your files in one place.
          </p>
        </div>
        <UploadButton />
      </div>
      
      <LibraryTable />
    </div>
  );
}