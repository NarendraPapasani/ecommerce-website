import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Navbar from "@/Pages/home/Navbar";
import HeroSection from "@/Pages/home/HeroSection";

import ProductGrid from "@/Pages/products/ProductGrid";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useInfiniteProducts } from "@/Pages/products/useInfiniteProducts";
import HomeSkeleton from "@/Pages/skeletons/HomeSkeleton";

const carouselItems = [
  {
    src: "https://bfasset.costco-static.com/56O3HXZ9/at/cks9hhpn2v9wsztfxn769b8t/d_25w03268_hero_shark_flexstyle.jpg?auto=webp&format=jpg",
    link: "/products/all",
    title: "Latest Electronics",
    description: "Discover cutting-edge technology",
  },
  {
    src: "https://bfasset.costco-static.com/56O3HXZ9/at/wv5k9x5252s8mz8g9brrs7/d_25w03261_cat_dell_inspiron.jpg",
    link: "/products?category=electronics",
    title: "Computing Solutions",
    description: "Power up your productivity",
  },
  {
    src: "https://cdn.bfldr.com/56O3HXZ9/at/x47gxtps4k5c44nrnw69w5/d-25w03151__homepage_hero_LG_appliance.jpg?auto=webp&format=jpg",
    link: "/products?category=home",
    title: "Home Appliances",
    description: "Smart living starts here",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const { products, loading } = useInfiniteProducts();
  // Get featured products (first 8 products)
  const featuredProducts = products.slice(0, 6);

  if (loading && products.length === 0) {
    return <HomeSkeleton />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative z-10">
        {/* Hero Section */}
        <HeroSection /> {/* Carousel Section */}
        {/* Featured Products Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-['Montserrat']">
                  Featured Products
                </h2>
                <p className="text-zinc-400 font-['Montserrat']">
                  Discover our most popular and trending items
                </p>
              </div>
              <Button
                variant="outline"
                className="border-zinc-700 text-white hover:bg-zinc-800"
                onClick={() => navigate("/products/all")}
              >
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <ProductGrid
              products={featuredProducts}
              loading={loading}
              isHomePage={true}
            />
            <Link to="/products/all">
              <div className="text-center py-8 text-zinc-500">
                <p>View more...</p>
              </div>
            </Link>
          </div>
        </section>
        <section className="py-16 bg-zinc-900/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-['Montserrat']">
                Featured Collections
              </h2>
              <p className="text-zinc-400 font-['Montserrat']">
                Explore our handpicked collections just for you
              </p>
            </div>

            <Carousel
              plugins={[
                Autoplay({
                  delay: 4000,
                }),
              ]}
              className="w-full max-w-6xl mx-auto"
            >
              <CarouselContent>
                {carouselItems.map((item, index) => (
                  <CarouselItem key={index}>
                    <div
                      className="relative overflow-hidden rounded-2xl cursor-pointer group"
                      onClick={() => navigate(item.link)}
                    >
                      <img
                        src={item.src}
                        className="w-full h-64 md:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                        alt={item.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-6 left-6 text-white">
                        <h3 className="text-2xl md:text-3xl font-bold mb-2 font-['Montserrat']">
                          {item.title}
                        </h3>
                        <p className="text-zinc-200 mb-4 font-['Montserrat']">
                          {item.description}
                        </p>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          Shop Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 bg-zinc-800/80 border-zinc-700 text-white hover:bg-zinc-700" />
              <CarouselNext className="right-4 bg-zinc-800/80 border-zinc-700 text-white hover:bg-zinc-700" />
            </Carousel>
          </div>
        </section>
        {/* Newsletter Section */}
        <section className="py-16 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-t border-zinc-800">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-['Montserrat']">
              Stay Updated with BlinkShop
            </h2>
            <p className="text-zinc-400 mb-8 font-['Montserrat'] max-w-2xl mx-auto">
              Get the latest updates on new arrivals, exclusive deals, and
              special offers directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-400 focus:outline-none focus:border-blue-500"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 px-8">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
