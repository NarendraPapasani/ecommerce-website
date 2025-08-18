import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const CartSkeletons = ({ count = 4 }) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="p-4 space-y-3">
          {Array.from({ length: count }).map((_, index) => (
            <div key={index}>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-700/30 animate-pulse">
                {/* Product Image Skeleton */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-slate-600 rounded-lg"></div>
                </div>

                {/* Product Info Skeleton */}
                <div className="flex-1 space-y-3">
                  {/* Product Title */}
                  <div className="h-4 bg-slate-600 rounded-md w-3/4 max-w-xs"></div>

                  {/* Product Details */}
                  <div className="flex items-center gap-4">
                    <div className="h-3 bg-slate-600 rounded w-16"></div>
                    <div className="h-3 bg-slate-600 rounded w-20"></div>
                  </div>

                  {/* Mobile: Price and Actions */}
                  <div className="lg:hidden flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="h-4 bg-slate-600 rounded w-16"></div>
                      <div className="h-3 bg-slate-600 rounded w-12"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-slate-600 rounded"></div>
                      <div className="w-8 h-6 bg-slate-600 rounded"></div>
                      <div className="w-8 h-8 bg-slate-600 rounded"></div>
                    </div>
                  </div>
                </div>

                {/* Desktop: Quantity Controls */}
                <div className="hidden lg:flex items-center gap-3">
                  <div className="flex items-center bg-slate-600/50 rounded-lg">
                    <div className="w-10 h-10 bg-slate-600 rounded-l-lg"></div>
                    <div className="w-12 h-10 bg-slate-600"></div>
                    <div className="w-10 h-10 bg-slate-600 rounded-r-lg"></div>
                  </div>
                </div>

                {/* Desktop: Price Section */}
                <div className="hidden lg:flex flex-col items-end gap-2 min-w-[120px]">
                  <div className="space-y-1">
                    <div className="h-5 bg-slate-600 rounded w-16"></div>
                    <div className="h-3 bg-slate-600 rounded w-12 ml-auto"></div>
                  </div>
                  <div className="w-8 h-8 bg-slate-600 rounded"></div>
                </div>
              </div>

              {/* Separator except for last item */}
              {index < count - 1 && <Separator className="bg-slate-700 mt-3" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CartSkeletons;
