import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Home,
  ArrowLeft,
  Search,
  ShoppingBag,
  AlertTriangle,
} from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 relative flex items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
        <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-8 sm:p-12 text-center">
            <div className="space-y-8">
              {/* Icon and Error Code */}
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 rounded-full bg-red-600/20 border border-red-600/30">
                  <AlertTriangle className="h-10 w-10 text-red-400" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    404
                  </h1>
                  <h2 className="text-xl sm:text-3xl font-bold text-white">
                    Page Not Found
                  </h2>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={() => navigate("/")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 w-full sm:w-auto"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 font-semibold px-8 py-3 w-full sm:w-auto"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate("/products")}
                  className="border-blue-600/50 text-blue-400 hover:bg-blue-600/10 hover:text-blue-300 font-semibold px-8 py-3 w-full sm:w-auto"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Browse Products
                </Button>
              </div>

              {/* Search Suggestion */}
              <div className="pt-6 border-t border-slate-700/50">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <div className="flex items-center text-slate-400">
                    <Search className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      Looking for something specific?
                    </span>
                  </div>
                  <Button
                    variant="link"
                    onClick={() => navigate("/products")}
                    className="text-blue-400 hover:text-blue-300 p-0 h-auto text-sm underline"
                  >
                    Try our search feature
                  </Button>
                </div>
              </div>

              {/* Brand */}
              <div className="pt-4">
                <div className="flex items-center justify-center space-x-2">
                  <ShoppingBag className="h-6 w-6 text-blue-500" />
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    BlinkShop
                  </span>
                </div>
                <p className="text-slate-500 text-sm mt-2">
                  Your Ultimate Shopping Destination
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
