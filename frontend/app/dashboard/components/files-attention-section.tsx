"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { 
  FileText, 
  Check, 
  X, 
  Eye,
  AlertTriangle
} from "lucide-react";
import { useState } from "react";

interface FileAttention {
  id: string;
  fileName: string;
  issue: string;
  suggestion: string;
  uploadDate: string;
  fileType: string;
}

export function FilesAttentionSection() {
  // Mock data - in real implementation, this would come from your API
  const [files, setFiles] = useState<FileAttention[]>([
    {
      id: "1",
      fileName: "invoice_2024_Q3.pdf",
      issue: "Ambiguous category",
      suggestion: "Financial Documents > Invoices > 2024",
      uploadDate: "2024-08-15",
      fileType: "PDF"
    },
    {
      id: "2", 
      fileName: "contract_draft_v2.docx",
      issue: "Duplicate detected",
      suggestion: "Merge with existing contract_draft.docx",
      uploadDate: "2024-08-18",
      fileType: "DOCX"
    },
    {
      id: "3",
      fileName: "budget_spreadsheet.xlsx",
      issue: "Low confidence classification",
      suggestion: "Financial Documents > Budgets > 2024",
      uploadDate: "2024-08-19",
      fileType: "XLSX"
    }
  ]);

  const handleApprove = (fileId: string) => {
    setFiles(files.filter(file => file.id !== fileId));
    // In real implementation, this would call your API to approve the suggestion
  };

  const handleReject = (fileId: string) => {
    setFiles(files.filter(file => file.id !== fileId));
    // In real implementation, this would call your API to reject the suggestion
  };

  const handleView = (fileId: string) => {
    // In real implementation, this would open a modal or navigate to file details
    console.log("Viewing file:", fileId);
  };

  const getFileTypeColor = (fileType: string) => {
    switch (fileType.toUpperCase()) {
      // Documents
      case 'PDF': return 'red';
      case 'DOC':
      case 'DOCX': return 'blue';
      
      // Images & Spreadsheets
      case 'JPG':
      case 'JPEG':
      case 'PNG':
      case 'GIF': return 'green';
      case 'XLS':
      case 'XLSX': return 'green';
      
      // Default
      default: return 'grey';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Pending review
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Review AI suggestions and resolve filing issues
          </p>
        </div>
        {files.length > 0 && (
          <StatusBadge
            label={`${files.length} pending`}
            color="pending"
            className="w-auto"
          />
        )}
      </CardHeader>
      <CardContent>
        {files.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>All files are properly organized!</p>
            <p className="text-sm">No files require your attention at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {files.map((file) => (
              <div key={file.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{file.fileName}</span>
                      <StatusBadge
                        label={file.fileType}
                        color={getFileTypeColor(file.fileType)}
                        className="text-xs w-auto"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Uploaded {new Date(file.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-xs font-medium text-red-600">Issue: </span>
                    <span className="text-xs text-muted-foreground">{file.issue}</span>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-blue-600">Suggestion: </span>
                    <span className="text-xs text-muted-foreground">{file.suggestion}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(file.id)}
                  >
                    <Check className="h-3 w-3" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleReject(file.id)}
                  >
                    <X className="h-3 w-3" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleView(file.id)}
                  >
                    <Eye className="h-3 w-3" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
