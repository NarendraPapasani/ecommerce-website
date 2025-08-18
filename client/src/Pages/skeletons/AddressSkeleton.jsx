import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const AddressSkeleton = () => {
  return (
    <Card className="bg-zinc-950 border-slate-700/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-slate-700/50">
              <Skeleton className="h-4 w-4 bg-slate-600" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-slate-600" />
              <Skeleton className="h-3 w-20 bg-slate-600" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded bg-slate-600" />
            <Skeleton className="h-8 w-8 rounded bg-slate-600" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="space-y-2">
          {/* Building */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 bg-slate-600" />
            <Skeleton className="h-4 w-32 bg-slate-600" />
          </div>

          {/* Area */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 bg-slate-600" />
            <Skeleton className="h-4 w-40 bg-slate-600" />
          </div>

          {/* Landmark */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 bg-slate-600" />
            <Skeleton className="h-4 w-28 bg-slate-600" />
          </div>

          {/* City, State, Pincode */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 bg-slate-600" />
            <Skeleton className="h-4 w-48 bg-slate-600" />
          </div>

          {/* Country */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 bg-slate-600" />
            <Skeleton className="h-4 w-24 bg-slate-600" />
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 bg-slate-600" />
            <Skeleton className="h-4 w-32 bg-slate-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressSkeleton;
