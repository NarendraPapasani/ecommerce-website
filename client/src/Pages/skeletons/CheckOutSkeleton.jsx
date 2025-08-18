import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CheckOutSkeleton = () => {
  return (
    <div className="min-h-screen bg-zinc-950 relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Skeleton className="h-8 w-32 bg-zinc-700 mb-2" />
          <Skeleton className="h-6 w-64 bg-zinc-700" />
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <Skeleton className="h-10 w-10 rounded-full bg-zinc-700" />
                {step < 3 && (
                  <Skeleton className="h-0.5 w-16 bg-zinc-700 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Address & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Section */}
            <Card className="bg-zinc-900/50 border-zinc-700">
              <CardHeader>
                <Skeleton className="h-6 w-48 bg-zinc-700" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-12 w-full bg-zinc-700" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full bg-zinc-700" />
                  <Skeleton className="h-4 w-3/4 bg-zinc-700" />
                  <Skeleton className="h-4 w-1/2 bg-zinc-700" />
                </div>
              </CardContent>
            </Card>

            {/* Payment Section */}
            <Card className="bg-zinc-900/50 border-zinc-700">
              <CardHeader>
                <Skeleton className="h-6 w-32 bg-zinc-700" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex items-center space-x-3 p-3 border border-zinc-700 rounded-lg"
                  >
                    <Skeleton className="h-4 w-4 rounded-full bg-zinc-700" />
                    <Skeleton className="h-5 w-24 bg-zinc-700" />
                    <Skeleton className="h-4 w-32 bg-zinc-700" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Coupon Section */}
            <Card className="bg-zinc-900/50 border-zinc-700">
              <CardHeader>
                <Skeleton className="h-6 w-40 bg-zinc-700" />
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Skeleton className="h-10 flex-1 bg-zinc-700" />
                  <Skeleton className="h-10 w-24 bg-zinc-700" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="bg-zinc-900/50 border-zinc-700">
                <CardHeader>
                  <Skeleton className="h-6 w-32 bg-zinc-700" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  {[1, 2].map((item) => (
                    <div
                      key={item}
                      className="flex items-center space-x-3 p-3 border border-zinc-700 rounded-lg"
                    >
                      <Skeleton className="h-16 w-16 bg-zinc-700" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full bg-zinc-700" />
                        <Skeleton className="h-4 w-2/3 bg-zinc-700" />
                        <Skeleton className="h-4 w-1/3 bg-zinc-700" />
                      </div>
                    </div>
                  ))}

                  <div className="border-t border-zinc-700 pt-4 space-y-3">
                    {/* Price breakdown */}
                    {[
                      "Subtotal",
                      "Discount",
                      "Platform Fee",
                      "Delivery Fee",
                      "Total",
                    ].map((label) => (
                      <div key={label} className="flex justify-between">
                        <Skeleton className="h-4 w-20 bg-zinc-700" />
                        <Skeleton className="h-4 w-16 bg-zinc-700" />
                      </div>
                    ))}
                  </div>

                  {/* Terms checkbox */}
                  <div className="flex items-start space-x-2 pt-4">
                    <Skeleton className="h-4 w-4 bg-zinc-700" />
                    <Skeleton className="h-4 w-full bg-zinc-700" />
                  </div>

                  {/* Place Order Button */}
                  <Skeleton className="h-12 w-full bg-zinc-700 mt-6" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOutSkeleton;
