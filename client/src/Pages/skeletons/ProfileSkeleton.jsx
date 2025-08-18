import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-zinc-950 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Profile Header Skeleton */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm mb-8 animate-pulse">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
              {/* Avatar Section */}
              <div className="relative">
                <div className="w-32 h-32 lg:w-40 lg:h-40 bg-slate-600 rounded-full border-4 border-slate-600"></div>
                <div className="absolute bottom-0 right-0 w-10 h-10 bg-slate-600 rounded-full"></div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center lg:text-left space-y-4">
                <div className="space-y-3">
                  <div className="h-8 bg-slate-600 rounded w-64 mx-auto lg:mx-0"></div>
                  <div className="flex justify-center lg:justify-start gap-2">
                    <div className="h-6 bg-emerald-600/50 rounded w-20"></div>
                    <div className="h-6 bg-blue-600/50 rounded w-24"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="h-4 bg-slate-600 rounded w-48 mx-auto lg:mx-0"></div>
                  <div className="h-4 bg-slate-600 rounded w-56 mx-auto lg:mx-0"></div>
                  <div className="h-4 bg-slate-600 rounded w-40 mx-auto lg:mx-0"></div>
                </div>

                <div className="h-16 bg-slate-600 rounded w-full max-w-2xl mx-auto lg:mx-0"></div>

                {/* Social Links */}
                <div className="flex justify-center lg:justify-start gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 bg-slate-600 rounded"></div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                <div className="bg-slate-700/30 rounded-lg p-4 text-center">
                  <div className="h-6 bg-slate-600 rounded w-8 mx-auto mb-2"></div>
                  <div className="h-3 bg-slate-600 rounded w-16 mx-auto"></div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-4 text-center">
                  <div className="h-6 bg-slate-600 rounded w-8 mx-auto mb-2"></div>
                  <div className="h-3 bg-slate-600 rounded w-16 mx-auto"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 bg-slate-800/50 border border-slate-700/50 rounded-xl p-1">
            {["Profile", "Settings", "Privacy", "Activity"].map(
              (tab, index) => (
                <div
                  key={index}
                  className={`h-10 rounded-lg ${
                    index === 0 ? "bg-slate-700" : "bg-slate-800/50"
                  }`}
                ></div>
              )
            )}
          </div>
        </div>

        {/* Profile Content Skeleton */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm animate-pulse">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-slate-600 rounded"></div>
                <div className="h-6 bg-slate-600 rounded w-40"></div>
              </div>
              <div className="h-10 bg-blue-600/50 rounded w-32"></div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-slate-600 rounded w-20"></div>
                  <div className="h-10 bg-slate-700/50 rounded"></div>
                </div>
              ))}
            </div>

            {/* Bio Section */}
            <div className="space-y-2">
              <div className="h-4 bg-slate-600 rounded w-12"></div>
              <div className="h-24 bg-slate-700/50 rounded"></div>
              <div className="h-3 bg-slate-600 rounded w-16 ml-auto"></div>
            </div>

            {/* More Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-slate-600 rounded w-24"></div>
                  <div className="h-10 bg-slate-700/50 rounded"></div>
                </div>
              ))}
            </div>

            <Separator className="bg-slate-700" />

            {/* Action Buttons */}
            <div className="flex gap-3">
              <div className="h-10 bg-slate-600 rounded w-20"></div>
              <div className="h-10 bg-green-600/50 rounded w-32"></div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm animate-pulse"
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-slate-600 rounded mx-auto mb-4"></div>
                <div className="h-6 bg-slate-600 rounded w-12 mx-auto mb-2"></div>
                <div className="h-4 bg-slate-600 rounded w-20 mx-auto"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
