"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  FolderPlus 
} from "lucide-react";

export function SummarySection() {
  // Mock data - in real implementation, this would come from your API
  const summaryData = {
    totalFiles: 1247,
    autoFiled: 892,
    pendingReview: 45,
    foldersCreated: 128
  };

  const summaryCards = [
    {
      title: "Total Files",
      value: summaryData.totalFiles.toLocaleString(),
      icon: FileText,
      description: "Files in your library"
    },
    {
      title: "Auto Filed",
      value: summaryData.autoFiled.toLocaleString(),
      icon: CheckCircle,
      description: "Automatically organized"
    },
    {
      title: "Pending Review",
      value: summaryData.pendingReview.toLocaleString(),
      icon: Clock,
      description: "Awaiting your confirmation"
    },
    {
      title: "Folders Created",
      value: summaryData.foldersCreated.toLocaleString(),
      icon: FolderPlus,
      description: "Smart folder structure"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryCards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <IconComponent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
