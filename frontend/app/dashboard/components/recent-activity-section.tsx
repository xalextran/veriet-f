"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { formatTimestamp } from "@/lib/utils";
import { 
  Clock,
  FileText,
  FolderPlus,
  Archive,
  Edit3,
  User,
  Bot
} from "lucide-react";

interface Activity {
  id: string;
  action: "Filed" | "Created" | "Archived" | "Renamed";
  timestamp: string;
  fileName: string;
  oldLocation?: string;
  newLocation: string;
  performedBy: "user" | "agent";
  userEmail?: string;
}

export function RecentActivitySection() {
  // Mock data - in real implementation, this would come from your API
  const activities: Activity[] = [
    {
      id: "1",
      action: "Filed",
      timestamp: "2024-08-20T14:30:00Z",
      fileName: "invoice_Q3_2024.pdf",
      oldLocation: "Downloads",
      newLocation: "Financial Documents > Invoices > 2024",
      performedBy: "agent"
    },
    {
      id: "2",
      action: "Created",
      timestamp: "2024-08-20T14:25:00Z",
      fileName: "Q3 Financial Reports",
      newLocation: "Financial Documents > Reports",
      performedBy: "agent"
    },
    {
      id: "3",
      action: "Renamed",
      timestamp: "2024-08-20T13:45:00Z",
      fileName: "contract_final_v2.docx",
      oldLocation: "contract_draft.docx",
      newLocation: "Legal Documents > Contracts > 2024",
      performedBy: "user",
      userEmail: "john@company.com"
    },
    {
      id: "4",
      action: "Filed",
      timestamp: "2024-08-20T12:20:00Z",
      fileName: "receipt_office_supplies.jpg",
      oldLocation: "Photos",
      newLocation: "Expenses > Office Supplies > August 2024",
      performedBy: "agent"
    },
    {
      id: "5",
      action: "Archived",
      timestamp: "2024-08-20T11:15:00Z",
      fileName: "old_project_notes.txt",
      oldLocation: "Projects > Legacy",
      newLocation: "Archive > 2024",
      performedBy: "user",
      userEmail: "sarah@company.com"
    }
  ];

  const getActionIcon = (action: Activity["action"]) => {
    switch (action) {
      case "Filed": return FileText;
      case "Created": return FolderPlus;
      case "Archived": return Archive;
      case "Renamed": return Edit3;
      default: return FileText;
    }
  };

  const getActionColor = (action: Activity["action"]) => {
    switch (action) {
      case "Filed": return "blue";
      case "Created": return "green";
      case "Archived": return "grey";
      case "Renamed": return "purple";
      default: return "grey";
    }
  };

  const handleFileClick = (fileName: string) => {
    // In real implementation, this would open the file
    console.log("Opening file:", fileName);
  };

  const handleLocationClick = (location: string) => {
    // In real implementation, this would navigate to the folder
    console.log("Navigating to folder:", location);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            Recent activity
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Latest filing actions and system updates
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const IconComponent = getActionIcon(activity.action);
            return (
              <div key={activity.id} className="space-y-3 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <StatusBadge
                      label={activity.action}
                      color={getActionColor(activity.action)}
                      icon={IconComponent}
                      className="w-auto"
                    />
                  </div>
                  
                  <div className="text-sm">
                    <Button
                      variant="link"
                      onClick={() => handleFileClick(activity.fileName)}
                      className="h-auto p-0 font-medium"
                    >
                      {activity.fileName}
                    </Button>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    {activity.action === "Renamed" && activity.oldLocation ? (
                      <>
                        from <span className="font-medium">{activity.oldLocation}</span> to{" "}
                        <Button
                          variant="link"
                          onClick={() => handleLocationClick(activity.newLocation)}
                          className="h-auto p-0 font-medium text-xs"
                        >
                          {activity.newLocation}
                        </Button>
                      </>
                    ) : activity.action === "Created" ? (
                      <>
                        folder created at{" "}
                        <Button
                          variant="link"
                          onClick={() => handleLocationClick(activity.newLocation)}
                          className="h-auto p-0 font-medium text-xs"
                        >
                          {activity.newLocation}
                        </Button>
                      </>
                    ) : activity.oldLocation ? (
                      <>
                        from{" "}
                        <Button
                          variant="link"
                          onClick={() => activity.oldLocation && handleLocationClick(activity.oldLocation)}
                          className="h-auto p-0 font-medium text-xs"
                        >
                          {activity.oldLocation}
                        </Button>{" "}
                        to{" "}
                        <Button
                          variant="link"
                          onClick={() => handleLocationClick(activity.newLocation)}
                          className="h-auto p-0 font-medium text-xs"
                        >
                          {activity.newLocation}
                        </Button>
                      </>
                    ) : (
                      <>
                        to{" "}
                        <Button
                          variant="link"
                          onClick={() => handleLocationClick(activity.newLocation)}
                          className="h-auto p-0 font-medium text-xs"
                        >
                          {activity.newLocation}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                  <span>{formatTimestamp(activity.timestamp)}</span>
                  <div className="flex items-center gap-1">
                    {activity.performedBy === "agent" ? (
                      <>
                        <Bot className="h-3 w-3 text-blue-500" />
                        <span className="text-blue-600">Agent</span>
                      </>
                    ) : (
                      <>
                        <User className="h-3 w-3 text-green-500" />
                        <span className="text-green-600">
                          {activity.userEmail || "User"}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
