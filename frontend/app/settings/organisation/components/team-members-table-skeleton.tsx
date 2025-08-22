import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
} from "@/components/ui/table";

/**
 * Skeleton loading component for team members table content only
 */
export function TeamMembersTableSkeleton() {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 3 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell className="flex items-center gap-3">
                <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
                <div className="space-y-1">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                </div>
              </TableCell>
              <TableCell>
                <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
              </TableCell>
              <TableCell>
                <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
              </TableCell>
              <TableCell>
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              </TableCell>
              <TableCell className="text-right">
                <div className="h-8 w-8 bg-muted rounded animate-pulse ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
