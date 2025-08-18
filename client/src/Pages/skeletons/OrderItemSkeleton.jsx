import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const OrderItemSkeleton = () => {
  return (
    <Card className="bg-slate-800/50 border-slate-700/50 animate-pulse">
      <CardHeader className="pb-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 bg-slate-600 rounded-lg" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-24 bg-slate-600" />
                <Skeleton className="h-5 w-16 bg-slate-600 rounded" />
              </div>
              <Skeleton className="h-3 w-32 bg-slate-600" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <Skeleton className="h-5 w-20 bg-slate-600 mb-1" />
              <Skeleton className="h-3 w-16 bg-slate-600" />
            </div>
            <Skeleton className="h-8 w-16 bg-slate-600 rounded" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Info Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-3 bg-slate-700/30 rounded-lg">
            <Skeleton className="h-6 w-6 bg-slate-600 rounded-lg" />
            <div className="flex-1">
              <Skeleton className="h-3 w-12 bg-slate-600 mb-1" />
              <Skeleton className="h-3 w-20 bg-slate-600" />
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-slate-700/30 rounded-lg">
            <Skeleton className="h-6 w-6 bg-slate-600 rounded-lg" />
            <div className="flex-1">
              <Skeleton className="h-3 w-12 bg-slate-600 mb-1" />
              <Skeleton className="h-3 w-24 bg-slate-600" />
            </div>
          </div>
        </div>

        <Skeleton className="h-px w-full bg-slate-600" />

        {/* Products Skeleton */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 bg-slate-600" />
              <Skeleton className="h-4 w-16 bg-slate-600" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 bg-slate-700/20 rounded-lg"
              >
                <div className="relative">
                  <Skeleton className="h-10 w-10 bg-slate-600 rounded-full" />
                  <Skeleton className="absolute -bottom-1 -right-1 h-4 w-4 bg-slate-600 rounded-full" />
                </div>
                <div className="flex-1">
                  <Skeleton className="h-3 w-20 bg-slate-600 mb-1" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-16 bg-slate-600" />
                    <Skeleton className="h-3 w-12 bg-slate-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderItemSkeleton;
