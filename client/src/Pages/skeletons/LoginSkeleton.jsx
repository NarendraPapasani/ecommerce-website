import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LoginSkeleton = () => {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-zinc-900/90 border-zinc-700 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <Skeleton className="h-8 w-48 mx-auto bg-zinc-700 mb-2" />
            <Skeleton className="h-5 w-64 mx-auto bg-zinc-700" />
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Tabs */}
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-zinc-800 p-1">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-zinc-700"
                >
                  <Skeleton className="h-4 w-12 bg-zinc-600" />
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-zinc-700"
                >
                  <Skeleton className="h-4 w-16 bg-zinc-600" />
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4 mt-6">
                {/* Email field */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16 bg-zinc-700" />
                  <Skeleton className="h-10 w-full bg-zinc-700" />
                </div>

                {/* Password field */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20 bg-zinc-700" />
                  <Skeleton className="h-10 w-full bg-zinc-700" />
                </div>

                {/* Remember me checkbox */}
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 bg-zinc-700" />
                  <Skeleton className="h-4 w-24 bg-zinc-700" />
                </div>

                {/* Login button */}
                <Skeleton className="h-10 w-full bg-zinc-700" />

                {/* Forgot password */}
                <div className="text-center">
                  <Skeleton className="h-4 w-32 mx-auto bg-zinc-700" />
                </div>
              </TabsContent>

              {/* Signup Tab */}
              <TabsContent value="signup" className="space-y-4 mt-6">
                {/* Name fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16 bg-zinc-700" />
                    <Skeleton className="h-10 w-full bg-zinc-700" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16 bg-zinc-700" />
                    <Skeleton className="h-10 w-full bg-zinc-700" />
                  </div>
                </div>

                {/* Email field */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16 bg-zinc-700" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1 bg-zinc-700" />
                    <Skeleton className="h-10 w-20 bg-zinc-700" />
                  </div>
                </div>

                {/* Additional fields */}
                {[
                  "Phone",
                  "Date of Birth",
                  "Gender",
                  "Address",
                  "City",
                  "Country",
                ].map((field) => (
                  <div key={field} className="space-y-2">
                    <Skeleton className="h-4 w-20 bg-zinc-700" />
                    <Skeleton className="h-10 w-full bg-zinc-700" />
                  </div>
                ))}

                {/* Category selection */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32 bg-zinc-700" />
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className="flex items-center space-x-2 p-2 border border-zinc-700 rounded"
                      >
                        <Skeleton className="h-4 w-4 bg-zinc-700" />
                        <Skeleton className="h-4 w-16 bg-zinc-700" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Password fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20 bg-zinc-700" />
                    <Skeleton className="h-10 w-full bg-zinc-700" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24 bg-zinc-700" />
                    <Skeleton className="h-10 w-full bg-zinc-700" />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 bg-zinc-700" />
                    <Skeleton className="h-4 w-40 bg-zinc-700" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 bg-zinc-700" />
                    <Skeleton className="h-4 w-48 bg-zinc-700" />
                  </div>
                </div>

                {/* Signup button */}
                <Skeleton className="h-10 w-full bg-zinc-700" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginSkeleton;
