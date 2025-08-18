import React from "react";
import { ShoppingBag, Zap, Heart, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const quotes = [
    {
      text: "Shop with Speed, Shop with Style!",
      subtitle: "Discover amazing products in a blink",
      icon: Zap,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
    },
    {
      text: "Where Every Purchase Sparks Joy",
      subtitle: "Find what you love, love what you find",
      icon: Heart,
      color: "text-pink-400",
      bgColor: "bg-pink-500/20",
    },
    {
      text: "Your Favorite Products, Just a Blink Away",
      subtitle: "Experience shopping like never before",
      icon: Star,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
    },
  ];

  const features = [
    "Lightning Fast Delivery",
    "Premium Quality Products",
    "24/7 Customer Support",
    "Secure Payment Gateway",
  ];

  return (
    <div className="relative overflow-hidden bg-zinc-950 py-16 md:py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Main Heading */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-blue-400 font-semibold">
                <ShoppingBag className="h-5 w-5" />
                <span className="font-['Montserrat']">
                  Welcome to BlinkShop
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl text-left font-bold text-white leading-tight font-['Montserrat']">
                Shop Smart,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                  Shop Fast
                </span>
              </h1>

              <p className="text-xl text-left text-zinc-400 leading-relaxed font-['Montserrat']">
                Discover premium products with lightning-fast delivery. Your
                one-stop destination for all your shopping needs.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white font-['Montserrat'] text-lg px-8"
                onClick={() => navigate("/products/all")}
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-zinc-700 text-white hover:bg-zinc-800 font-['Montserrat'] text-lg px-8"
                onClick={() => navigate("/products/all")}
              >
                Browse Categories
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-zinc-300"
                >
                  <div className="h-2 w-2 bg-blue-500 rounded-full" />
                  <span className="text-sm font-['Montserrat']">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Quote Cards */}
          <div className="space-y-6 hidden md:block">
            {quotes.map((quote, index) => (
              <Card
                key={index}
                className={`border-zinc-800 bg-zinc-900/50 backdrop-blur transition-all duration-300 hover:scale-105 ${quote.bgColor} border-l-4 border-l-current`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-3 rounded-full bg-zinc-800 ${quote.color}`}
                    >
                      <quote.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`text-lg font-semibold ${quote.color} font-['Montserrat'] mb-2`}
                      >
                        {quote.text}
                      </h3>
                      <p className="text-zinc-400 font-['Montserrat']">
                        {quote.subtitle}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mobile Center Text */}
          <div className="md:hidden text-center space-y-4">
            <h2 className="text-2xl font-bold text-white font-['Montserrat']">
              Experience shopping like never before
            </h2>
            <p className="text-zinc-400 font-['Montserrat']">
              Your Favorite Products, Just a Blink Away
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-zinc-800">
          <div className="text-center">
            <div className="text-3xl font-bold text-white font-['Montserrat']">
              100+
            </div>
            <div className="text-zinc-400 font-['Montserrat']">
              Happy Customers
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white font-['Montserrat']">
              50+
            </div>
            <div className="text-zinc-400 font-['Montserrat']">Products</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white font-['Montserrat']">
              24/7
            </div>
            <div className="text-zinc-400 font-['Montserrat']">Support</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white font-['Montserrat']">
              99%
            </div>
            <div className="text-zinc-400 font-['Montserrat']">
              Satisfaction
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
