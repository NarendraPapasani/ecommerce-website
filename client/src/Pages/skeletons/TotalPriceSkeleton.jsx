import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const TotalPriceSkeleton = () => {
  return (
    <div className="sticky top-6 space-y-4">
      {/* Price Update Alert Skeleton */}
      <div className="bg-orange-900/20 border border-orange-600/30 rounded-lg p-3 animate-pulse">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-400/50 rounded"></div>
          <div className="h-3 bg-orange-400/50 rounded w-3/4"></div>
        </div>
      </div>

      {/* Order Summary Card */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm animate-pulse">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-slate-600 rounded"></div>
            <div className="h-5 bg-slate-600 rounded w-32"></div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Mobile collapsible details skeleton */}
          <div className="lg:hidden">
            <div className="flex justify-between items-center w-full p-3 bg-slate-700/30 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-slate-600 rounded"></div>
                <div className="h-4 bg-slate-600 rounded w-20"></div>
                <div className="h-4 bg-emerald-400/50 rounded w-16"></div>
              </div>
              <div className="w-4 h-4 bg-slate-600 rounded"></div>
            </div>
          </div>

          {/* Desktop details / Mobile conditional */}
          <div className="space-y-3">
            {/* Original Price */}
            <div className="flex justify-between items-center">
              <div className="h-4 bg-slate-600 rounded w-24"></div>
              <div className="h-4 bg-red-400/50 rounded w-16"></div>
            </div>

            {/* Discount */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-slate-600 rounded"></div>
                <div className="h-4 bg-slate-600 rounded w-20"></div>
              </div>
              <div className="h-4 bg-amber-400/50 rounded w-12"></div>
            </div>

            <Separator className="bg-slate-700" />

            {/* Total Price */}
            <div className="flex justify-between items-center">
              <div className="h-5 bg-slate-600 rounded w-20"></div>
              <div className="h-5 bg-emerald-400/50 rounded w-20"></div>
            </div>

            {/* You Save */}
            <div className="flex justify-between items-center">
              <div className="h-3 bg-slate-600 rounded w-16"></div>
              <div className="h-3 bg-blue-400/50 rounded w-14"></div>
            </div>
          </div>

          {/* Success Alert Skeleton */}
          <div className="bg-emerald-900/20 border border-emerald-600/30 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-400/50 rounded"></div>
              <div className="h-3 bg-emerald-400/50 rounded w-4/5"></div>
            </div>
          </div>

          <Separator className="bg-slate-700" />

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="w-full h-12 bg-emerald-600/50 rounded-lg"></div>
            <div className="w-full h-10 bg-slate-700/50 rounded-lg border border-slate-600/50"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TotalPriceSkeleton;
