import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import OrderItemSkeleton from "./OrderItemSkeleton";

const OrdersSkeleton = () => {
  return (
    <div className="min-h-screen bg-zinc-950 py-4">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Skeleton */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 bg-slate-700 rounded-lg" />
              <div>
                <Skeleton className="h-5 w-24 bg-slate-700 mb-1" />
                <Skeleton className="h-3 w-20 bg-slate-700" />
              </div>
            </div>
            <Skeleton className="h-8 w-16 bg-slate-700 rounded" />
          </div>

          {/* Statistics Grid Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700/50">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Skeleton className="h-3 w-16 bg-slate-600 mb-1" />
                      <Skeleton className="h-4 w-12 bg-slate-600" />
                    </div>
                    <Skeleton className="h-4 w-4 bg-slate-600 rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filter Bar Skeleton */}
          <Card className="bg-slate-800/30 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-3">
                <Skeleton className="h-9 flex-1 bg-slate-700" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-40 bg-slate-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Pills Skeleton */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-20 bg-slate-700 rounded" />
          ))}
        </div>

        {/* Orders List Skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <OrderItemSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersSkeleton;
