import React, { useState, useEffect } from "react";
import { Star, Heart, ShoppingCart, Eye } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import Cookies from "js-cookie";

const ProductCard = ({ product, className }) => {
  const { toast, success, error } = useToast();
  const { _id, title, price, images, rating, category } = product;
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [checkingWishlist, setCheckingWishlist] = useState(false);
  const jwt = Cookies.get("jwt1");

  // Check if product is in wishlist on component mount
  useEffect(() => {
    if (jwt && _id) {
      checkProductInWishlist();
    }
  }, [jwt, _id]);

  const checkProductInWishlist = async () => {
    try {
      setCheckingWishlist(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/wishlist/check/${_id}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setIsWishlisted(response.data.inWishlist);
      }
    } catch (error) {
      console.error("Error checking wishlist:", error);
    } finally {
      setCheckingWishlist(false);
    }
  };

  const handleProductClick = () => {
    // Navigate to product details page
    // Use category slug if available, otherwise use category name or default
    const categorySlug =
      category?.[0]?.slug ||
      category?.[0]?.name ||
      category?.slug ||
      category?.name ||
      "general";
    navigate(`/product/${categorySlug}/${_id}`);
    window.scrollTo(0, 0);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (!jwt) {
      error("Authentication Required", "Please login to add items to cart");
      navigate("/login");
      return;
    }

    setIsAddingToCart(true);

    try {
      const cartItem = {
        productId: _id,
        quantity: 1,
      };

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/cart/add`,
        cartItem,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          withCredentials: true,
        }
      );

      success("Success", `${title} added to cart!`);
    } catch (err) {
      error("Error", "Failed to add to cart");
      console.error("Error adding to cart:", err);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToWishlist = async (e) => {
    e.stopPropagation();

    if (!jwt) {
      error("Authentication Required", "Please login to add items to wishlist");
      navigate("/login");
      return;
    }

    try {
      if (!isWishlisted) {
        // Add to wishlist
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/wishlist/add`,
          { productId: _id },
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
            withCredentials: true,
          }
        );

        setIsWishlisted(true);
        success("Success", `${title} added to wishlist!`);
      } else {
        // Remove from wishlist
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/api/wishlist/remove/${_id}`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
            withCredentials: true,
          }
        );

        setIsWishlisted(false);
        success("Success", `${title} removed from wishlist!`);
      }
    } catch (err) {
      error(
        "Error",
        `Failed to ${isWishlisted ? "remove from" : "add to"} wishlist`
      );
      console.error("Error updating wishlist:", err);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating?.rate || 0);
    const hasHalfStar = (rating?.rate || 0) % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={cn(
            "h-3 w-3",
            i < fullStars ? "fill-yellow-400 text-yellow-400" : "text-zinc-600"
          )}
        />
      );
    }

    return stars;
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-zinc-800 bg-zinc-900/50 backdrop-blur transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:border-blue-500/50 cursor-pointer flex flex-col h-full",
        className
      )}
      onClick={handleProductClick}
    >
      {/* Category Badge */}
      {category?.name && (
        <Badge
          variant="secondary"
          className="absolute top-2 left-2 z-10 bg-blue-600/90 text-white text-xs"
        >
          {category.name}
        </Badge>
      )}

      {/* Wishlist Button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 bg-zinc-800/80",
          isWishlisted ? "bg-red-600/80 hover:bg-red-700" : "hover:bg-red-600"
        )}
        onClick={handleAddToWishlist}
      >
        <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
      </Button>

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={images[0]}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/90 text-black hover:bg-white"
          >
            <Eye className="h-4 w-4 mr-2" />
            Quick View
          </Button>
        </div>
      </div>

      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="font-semibold text-white text-sm line-clamp-2 mb-2 font-['Montserrat']">
            {title}
          </h3>

          {/* Rating */}
          {rating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">{renderStars(rating)}</div>
              <span className="text-xs text-zinc-400 ml-1">
                ({rating.count})
              </span>
            </div>
          )}
        </div>

        {/* Price - Always at bottom */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-blue-400 font-['Montserrat']">
            {formatPrice(price)}
          </span>

          {/* Add to Cart Button */}
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:scale-100"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            {isAddingToCart ? "Adding..." : "Add"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
