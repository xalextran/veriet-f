/**
 * Skeleton loading component for billing section
 * Maintains card structure while data is loading
 */
export function BillingSectionSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Current Plan Card */}
      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6">
        <div className="px-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-5 w-24 bg-muted rounded" />
              <div className="h-4 w-48 bg-muted rounded" />
            </div>
            <div className="h-9 w-28 bg-muted rounded" />
          </div>
        </div>
        <div className="px-6">
          <div className="space-y-4">
            <div className="p-4 border rounded-md space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-5 w-20 bg-muted rounded" />
                <div className="h-6 w-16 bg-muted rounded-full" />
              </div>
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-3/4 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Billing History Card */}
      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6">
        <div className="px-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-5 w-28 bg-muted rounded" />
              <div className="h-4 w-56 bg-muted rounded" />
            </div>
            <div className="h-9 w-32 bg-muted rounded" />
          </div>
        </div>
        <div className="px-6">
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center p-3 border rounded">
                <div className="space-y-1">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-3 w-16 bg-muted rounded" />
                </div>
                <div className="text-right space-y-1">
                  <div className="h-4 w-12 bg-muted rounded ml-auto" />
                  <div className="h-3 w-16 bg-muted rounded ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Method Card */}
      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6">
        <div className="px-6">
          <div className="space-y-2">
            <div className="h-5 w-32 bg-muted rounded" />
            <div className="h-4 w-48 bg-muted rounded" />
          </div>
        </div>
        <div className="px-6">
          <div className="p-4 border rounded-md flex items-center gap-4">
            <div className="h-8 w-8 bg-muted rounded" />
            <div className="flex-1 space-y-1">
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-3 w-20 bg-muted rounded" />
            </div>
            <div className="h-8 w-16 bg-muted rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
