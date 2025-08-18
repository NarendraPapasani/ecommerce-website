import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import WishlistProductCard from "./WishlistProductCard";
import Cookies from "js-cookie";
import axios from "axios";

const Wishlist = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearingWishlist, setClearingWishlist] = useState(false);
  const jwt = Cookies.get("jwt1");

  useEffect(() => {
    if (!jwt) {
      navigate("/login");
      return;
    }
    fetchWishlist();
  }, [jwt, navigate]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/wishlist`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setWishlistItems(response.data.wishlist.products || []);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to fetch wishlist",
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = (productId) => {
    // Remove the item from local state
    setWishlistItems((prevItems) =>
      prevItems.filter((item) => item.productId._id !== productId)
    );
  };

  const handleClearWishlist = async () => {
    if (!jwt) {
      toast({
        title: "Authentication Required",
        description: "Please login to manage wishlist",
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
        duration: 2000,
      });
      navigate("/login");
      return;
    }

    setClearingWishlist(true);

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/wishlist/clear`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          withCredentials: true,
        }
      );

      setWishlistItems([]);
      toast({
        title: "Success",
        description: "Wishlist cleared successfully!",
        variant: "default",
        className: "bg-green-600 border-green-600 text-white",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear wishlist",
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
        duration: 2000,
      });
      console.error("Error clearing wishlist:", error);
    } finally {
      setClearingWishlist(false);
    }
  };

  const handleAddAllToCart = async () => {
    if (!jwt) {
      toast({
        title: "Authentication Required",
        description: "Please login to add items to cart",
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
        duration: 2000,
      });
      navigate("/login");
      return;
    }

    try {
      // Add all items to cart one by one
      const promises = wishlistItems.map((item) =>
        axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/cart/add`,
          {
            productId: item.productId._id,
            quantity: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
            withCredentials: true,
          }
        )
      );

      await Promise.all(promises);

      toast({
        title: "Success",
        description: `${wishlistItems.length} items added to cart!`,
        variant: "default",
        className: "bg-green-600 border-green-600 text-white",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add some items to cart",
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
        duration: 2000,
      });
      console.error("Error adding all to cart:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-400">Loading your wishlist...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-600/20 border border-red-600/30">
                  <Heart className="h-5 w-5 text-red-400 fill-current" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">
                    My Wishlist
                  </h1>
                  <p className="text-slate-400">
                    {wishlistItems.length}{" "}
                    {wishlistItems.length === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {wishlistItems.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={handleAddAllToCart}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add All to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClearWishlist}
                  disabled={clearingWishlist}
                  className="border-red-600/50 text-red-400 hover:bg-red-600/10 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {clearingWishlist ? "Clearing..." : "Clear All"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {wishlistItems.length === 0 ? (
          <Card className="bg-slate-800/30 border-slate-700/50">
            <CardContent className="p-12 text-center">
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="p-4 rounded-full bg-red-600/20 border border-red-600/30">
                    <Heart className="h-12 w-12 text-red-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Your wishlist is empty
                  </h3>
                  <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
                    Save items you love for later. Start browsing and add
                    products to your wishlist.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => navigate("/products")}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/")}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Back to Home
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {wishlistItems.map((item) => (
              <WishlistProductCard
                key={item.productId._id}
                product={item.productId}
                onRemove={handleRemoveFromWishlist}
                className="h-full"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
