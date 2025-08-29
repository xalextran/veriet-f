"use client";

import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useInvalidateFiles } from "@/hooks/use-files";
import { toast } from "sonner";

export function UploadButton() {
  const { uploadFile, uploading } = useFileUpload();
  const invalidateFiles = useInvalidateFiles();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFile(file);
      toast.success("File uploaded successfully!", {
        description: `${result.data.originalName} has been uploaded to your library.`,
      });
      
      // Invalidate files cache to refresh the library
      invalidateFiles();
      console.log("Upload successful:", result);
    } catch (error) {
      toast.error("Upload failed", {
        description: error instanceof Error ? error.message : "Something went wrong during upload.",
      });
      console.error("Upload failed:", error);
    } finally {
      // Reset the input so the same file can be uploaded again
      event.target.value = "";
    }
  };

  return (
    <div>
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileUpload}
        accept=".pdf,.doc,.docx,.xlsx,.xls,.jpg,.jpeg,.png,.gif"
        disabled={uploading}
      />
      <Button 
        asChild 
        disabled={uploading}
        className="cursor-pointer"
      >
        <label htmlFor="file-upload">
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload File
            </>
          )}
        </label>
      </Button>
    </div>
  );
}
