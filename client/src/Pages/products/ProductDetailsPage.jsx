import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";
import {
  Star,
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Award,
  Package,
  Clock,
  Users,
  CheckCircle,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/toaster";
import ProductDetailsPageSkeleton from "@/Pages/skeletons/ProductDetailsPageSkeleton";
import ProductCard from "@/Pages/products/ProductCard";
import { jwtDecode } from "jwt-decode";

const ProductDetailsPage = () => {
  const { toast } = useToast();
  const { id, category } = useParams();
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState({});
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    comment: "",
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  const jwt = Cookies.get("jwt1");

  const getCurrentUserId = () => {
    try {
      if (!jwt) return null;
      const decoded = jwtDecode(jwt);
      return decoded.userId;
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  };

  // Submit a new review
  const submitReview = async () => {
    if (!jwt) {
      toast({
        title: "Authentication Required",
        description: "Please login to write a review",
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
      });
      return;
    }

    if (!newReview.comment.trim()) {
      toast({
        title: "Validation Error",
        description: "Please write a review comment",
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
      });
      return;
    }

    setSubmittingReview(true);
    try {
      const reviewData = {
        productId: id,
        rating: newReview.rating,
        title: newReview.title.trim(),
        comment: newReview.comment.trim(),
      };

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/reviews/add`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          withCredentials: true,
        }
      );

      toast({
        title: "Success",
        description: "Review submitted successfully!",
        variant: "success",
        className: "bg-green-600 border-green-600 text-white",
      });
      setShowReviewModal(false);
      setNewReview({ rating: 5, title: "", comment: "" });
      fetchReviews(); // Refresh reviews
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to submit review";
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
      });
      console.error("Error submitting review:", error);
    } finally {
      setSubmittingReview(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/reviews/${id}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          withCredentials: true,
        }
      );

      console.log(response.data.reviews[0].userId._id);
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      // Don't show error toast for reviews as it's not critical
    }
  };

  // Handle review like
  const handleLikeReview = async (reviewId) => {
    if (!jwt) {
      toast({
        title: "Error",
        description: "Please login to like reviews",
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
      });
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/reviews/${reviewId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          withCredentials: true,
        }
      );

      // Update the reviews state with the new like count
      setReviews(
        reviews.map((review) =>
          review._id === reviewId
            ? {
                ...review,
                likes: response.data.review.likes,
                dislikes: response.data.review.dislikes,
                userLiked: response.data.userLiked,
                userDisliked: response.data.userDisliked,
              }
            : review
        )
      );

      toast({
        title: "Success",
        description: response.data.userLiked
          ? "Review liked!"
          : "Like removed!",
        variant: "success",
        className: "bg-green-600 border-green-600 text-white",
      });
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to like review";
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
      });
      console.error("Error liking review:", error);
    }
  };

  // Handle review dislike
  const handleDislikeReview = async (reviewId) => {
    if (!jwt) {
      toast({
        title: "Error",
        description: "Please login to dislike reviews",
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
      });
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/reviews/${reviewId}/dislike`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          withCredentials: true,
        }
      );

      // Update the reviews state with the new dislike count
      setReviews(
        reviews.map((review) =>
          review._id === reviewId
            ? {
                ...review,
                likes: response.data.review.likes,
                dislikes: response.data.review.dislikes,
                userLiked: response.data.userLiked,
                userDisliked: response.data.userDisliked,
              }
            : review
        )
      );

      toast({
        title: "Success",
        description: response.data.userDisliked
          ? "Review disliked!"
          : "Dislike removed!",
        variant: "success",
        className: "bg-green-600 border-green-600 text-white",
      });
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to dislike review";
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
      });
      console.error("Error disliking review:", error);
    }
  };

  // Calculate average rating from reviews
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  // Get rating distribution
  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  useEffect(() => {
    const getProductDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`
        );
        setProductDetails(response.data.product);

        // Set first image as selected
        if (
          response.data.product.images &&
          response.data.product.images.length > 0
        ) {
          setSelectedImage(0);
        }

        // Fetch related products from same category
        if (response.data.product.category?.name) {
          fetchRelatedProducts(response.data.product.category.name);
        }
      } catch (error) {
        console.error("Error fetching product details:", error.message);
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
          className: "bg-red-600 border-red-600 text-white",
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchRelatedProducts = async (categoryName) => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/products?category=${categoryName}&limit=4`
        );

        // Filter out current product
        const filtered = response.data.products.filter(
          (product) => product._id !== id
        );
        setRelatedProducts(filtered.slice(0, 4));
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };

    fetchRelatedProducts(category);
    getProductDetails();
  }, [id, category]);

  const handleQuantityChange = (amount) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + amount));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const rate = rating?.rate || rating || 0;

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= rate ? "fill-yellow-400 text-yellow-400" : "text-zinc-600"
          }`}
        />
      );
    }
    return stars;
  };

  const clickBuyNow = async () => {
    if (!jwt) {
      toast({
        title: "Error",
        description: "Please login to buy now",
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
      });
      return;
    }

    try {
      const cartItem = {
        productId: productDetails._id,
        quantity: quantity,
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

      toast({
        title: "Success",
        description: "Added to cart! Redirecting to checkout...",
        variant: "success",
        className: "bg-green-600 border-green-600 text-white",
      });
      setTimeout(() => {
        navigate("/cart");
      }, 1500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
      });
      console.error("Error:", error);
    }
  };

  const addToCart = async () => {
    if (!jwt) {
      toast({
        title: "Error",
        description: "Please login to add to cart",
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
      });
      return;
    }

    try {
      const cartItem = {
        productId: productDetails._id,
        quantity: quantity,
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

      toast({
        title: "Success",
        description: "Added to cart successfully!",
        variant: "success",
        className: "bg-green-600 border-green-600 text-white",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
      });
      console.error("Error:", error);
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: "Success",
      description: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      variant: "success",
      className: "bg-green-600 border-green-600 text-white",
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: productDetails.title,
      text: `Check out this amazing product: ${productDetails.title}`,
      url: window.location.href,
    };

    try {
      // Check if Web Share API is supported
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Success",
          description: "Product shared successfully!",
          variant: "success",
          className: "bg-green-600 border-green-600 text-white",
        });
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Success",
          description: "Product link copied to clipboard!",
          variant: "success",
          className: "bg-green-600 border-green-600 text-white",
        });
      }
    } catch (error) {
      // If everything fails, try clipboard again or show error
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Success",
          description: "Product link copied to clipboard!",
          variant: "success",
          className: "bg-green-600 border-green-600 text-white",
        });
      } catch (clipboardError) {
        toast({
          title: "Error",
          description: "Unable to share product. Please copy the URL manually.",
          variant: "destructive",
          className: "bg-red-600 border-red-600 text-white",
        });
      }
    }
  };

  if (loading) {
    return <ProductDetailsPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Header with breadcrumb */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 text-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-slate-400 hover:text-white -ml-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <span className="text-slate-600">/</span>
            <span
              className="text-slate-400 cursor-pointer hover:text-white"
              onClick={() => navigate(`/products/all`)}
            >
              Products
            </span>
            <span className="text-slate-600">/</span>
            <span
              className="text-slate-400  cursor-pointer hover:text-white"
              onClick={() => navigate(`/products/${category}`)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-white font-medium truncate max-w-xs">
              {productDetails.title}
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 lg:gap-8 mb-8 lg:mb-12">
            {/* Product Images - 3 columns */}
            <div className="xl:col-span-3 space-y-4 lg:space-y-6">
              {/* Main Image with enhanced styling */}
              <div className="relative group">
                <div className="aspect-square lg:aspect-[4/3] overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 shadow-xl lg:shadow-2xl">
                  <img
                    src={
                      productDetails.images?.[selectedImage] ||
                      productDetails.image
                    }
                    alt={productDetails.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Image overlay with gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                  {/* Navigation arrows */}
                  {productDetails.images &&
                    productDetails.images.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/50 hover:bg-black/70 text-white border-0 h-8 w-8 lg:h-10 lg:w-10"
                          onClick={() =>
                            setSelectedImage(
                              selectedImage > 0
                                ? selectedImage - 1
                                : productDetails.images.length - 1
                            )
                          }
                        >
                          <ChevronLeft className="h-4 w-4 lg:h-5 lg:w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/50 hover:bg-black/70 text-white border-0 h-8 w-8 lg:h-10 lg:w-10"
                          onClick={() =>
                            setSelectedImage(
                              selectedImage < productDetails.images.length - 1
                                ? selectedImage + 1
                                : 0
                            )
                          }
                        >
                          <ChevronRight className="h-4 w-4 lg:h-5 lg:w-5" />
                        </Button>
                      </>
                    )}

                  {/* Image counter */}
                  {productDetails.images &&
                    productDetails.images.length > 1 && (
                      <div className="absolute bottom-2 lg:bottom-4 right-2 lg:right-4 bg-black/60 text-white px-2 py-1 lg:px-3 lg:py-1 rounded-full text-xs lg:text-sm backdrop-blur-sm">
                        {selectedImage + 1} / {productDetails.images.length}
                      </div>
                    )}
                </div>

                {/* Thumbnail gallery */}
                {productDetails.images && productDetails.images.length > 1 && (
                  <div className="flex gap-2 lg:gap-3 mt-3 lg:mt-4 overflow-x-auto pb-2">
                    {productDetails.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 relative overflow-hidden rounded-lg lg:rounded-xl transition-all duration-300 ${
                          selectedImage === index
                            ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900 scale-105"
                            : "hover:scale-105 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${productDetails.title} ${index + 1}`}
                          className="w-16 h-16 lg:w-20 lg:h-20 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Customer Reviews Summary - Desktop Only */}
                <div className="hidden lg:block mt-6">
                  <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        Customer Reviews
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        {/* Overall Rating */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {renderStars({ rate: calculateAverageRating() })}
                            </div>
                            <span className="text-2xl font-bold text-white">
                              {calculateAverageRating()}
                            </span>
                          </div>
                          <div className="text-slate-400 text-sm">
                            ({reviews.length}{" "}
                            {reviews.length === 1 ? "review" : "reviews"})
                          </div>
                        </div>

                        {/* Rating Distribution */}
                        <div className="space-y-2">
                          {[5, 4, 3, 2, 1].map((rating) => {
                            const count = getRatingDistribution()[rating];
                            const percentage =
                              reviews.length > 0
                                ? (count / reviews.length) * 100
                                : 0;
                            return (
                              <div
                                key={rating}
                                className="flex items-center gap-2 text-sm"
                              >
                                <span className="text-slate-400 w-8">
                                  {rating}★
                                </span>
                                <div className="flex-1 bg-slate-700 rounded-full h-2">
                                  <div
                                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span className="text-slate-400 w-8 text-right">
                                  {count}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Write Review Button */}
                        <Button
                          onClick={() => setShowReviewModal(true)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Write a Review
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Product Info - 2 columns */}
            <div className="xl:col-span-2 space-y-6 lg:space-y-8">
              {/* Category and availability */}
              <div className="flex items-center justify-between">
                {productDetails.category[0].name && (
                  <Badge className="bg-gradient-to-r bg-blue-600 hover:bg-blue-700 text-white border-0 px-3 py-1">
                    <Package className="h-3 w-3 mr-1" />
                    {productDetails.category[0].name}
                  </Badge>
                )}
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">In Stock</span>
                </div>
              </div>

              {/* Title */}
              <div>
                <h1 className="text-2xl lg:text-4xl font-bold text-white leading-tight mb-3 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  {productDetails.title}
                </h1>
              </div>

              {/* Price section with enhanced styling */}
              <Card className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-blue-500/30 backdrop-blur-sm">
                <CardContent className="p-4 lg:p-6">
                  <div className="space-y-3 lg:space-y-4">
                    <div className="flex items-baseline gap-2 lg:gap-4 flex-wrap">
                      <div className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        {formatPrice(productDetails.price)}
                      </div>
                      <div className="text-slate-400 line-through text-base lg:text-lg">
                        {formatPrice(productDetails.price * 1.2)}
                      </div>
                      <Badge className="bg-emerald-600 text-white hover:text-black">
                        20% OFF
                      </Badge>
                    </div>

                    <Alert className="bg-emerald-600/10 border-emerald-600/30">
                      <Zap className="h-4 w-4 text-emerald-400" />
                      <AlertDescription className="text-emerald-300">
                        <ul className="list-disc pl-5 space-y-1 text-left text-sm lg:text-base">
                          <li>Free shipping on orders over ₹1,000</li>
                          <li>Express delivery available</li>
                        </ul>
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>

              {/* Quantity and Actions */}
              <Card className="bg-slate-800/30 border-slate-700/50">
                <CardContent className="p-4 lg:p-6 space-y-4 lg:space-y-6">
                  {/* Quantity Selector */}
                  <div className="space-y-3">
                    <label className="text-base lg:text-lg font-semibold text-white flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Quantity
                    </label>
                    <div className="flex items-center gap-3 lg:gap-4">
                      <div className="flex items-center bg-slate-700/50 rounded-xl border border-slate-600">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(-1)}
                          disabled={quantity <= 1}
                          className="h-10 w-10 lg:h-12 lg:w-12 rounded-l-xl hover:bg-slate-600 disabled:opacity-50"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 lg:w-16 text-center text-lg lg:text-xl font-bold text-white">
                          {quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(1)}
                          className="h-10 w-10 lg:h-12 lg:w-12 rounded-r-xl hover:bg-slate-600"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-base lg:text-lg text-slate-300">
                        Total:{" "}
                        <span className="font-bold text-white">
                          {formatPrice(productDetails.price * quantity)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 lg:space-y-4">
                    <Button
                      onClick={clickBuyNow}
                      size="lg"
                      className="w-full h-12 lg:h-14 text-base lg:text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/25"
                    >
                      <ShoppingCart className="h-4 w-4 lg:h-5 lg:w-5 mr-2 lg:mr-3" />
                      Buy Now - {formatPrice(productDetails.price * quantity)}
                    </Button>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={addToCart}
                        variant="outline"
                        size="lg"
                        className="h-10 lg:h-12 border-slate-600 text-white hover:bg-slate-700 hover:border-slate-500 rounded-xl transition-all duration-300"
                      >
                        <ShoppingCart className="h-4 w-4 mr-1 lg:mr-2" />
                        <span className="hidden sm:inline">Add to Cart</span>
                        <span className="sm:hidden">Cart</span>
                      </Button>
                      <Button
                        onClick={toggleWishlist}
                        variant="outline"
                        size="lg"
                        className={`h-10 lg:h-12 rounded-xl transition-all duration-300 ${
                          isWishlisted
                            ? "bg-red-600 border-red-600 text-white hover:bg-red-700"
                            : "border-slate-600 text-white hover:bg-slate-700"
                        }`}
                      >
                        <Heart
                          className={`h-4 w-4 mr-1 lg:mr-2 ${
                            isWishlisted ? "fill-current" : ""
                          }`}
                        />
                        <span className="hidden sm:inline">
                          {isWishlisted ? "Saved" : "Save"}
                        </span>
                        <span className="sm:hidden">♡</span>
                      </Button>
                    </div>

                    <Button
                      onClick={handleShare}
                      variant="ghost"
                      size="lg"
                      className="w-full h-10 lg:h-12 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-300"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share this product
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 lg:gap-4">
                <Card className="bg-slate-800/30 border-slate-700/50 text-center">
                  <CardContent className="p-3 lg:p-4">
                    <div className="w-8 h-8 lg:w-12 lg:h-12 mx-auto mb-2 lg:mb-3 rounded-full bg-blue-600/20 flex items-center justify-center">
                      <Truck className="h-4 w-4 lg:h-5 lg:w-5 text-blue-400" />
                    </div>
                    <div className="text-xs lg:text-sm font-semibold text-white">
                      Free Shipping
                    </div>
                    <div className="text-xs text-slate-400 hidden lg:block">
                      Orders over ₹1,000
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/30 border-slate-700/50 text-center">
                  <CardContent className="p-3 lg:p-4">
                    <div className="w-8 h-8 lg:w-12 lg:h-12 mx-auto mb-2 lg:mb-3 rounded-full bg-emerald-600/20 flex items-center justify-center">
                      <Shield className="h-4 w-4 lg:h-5 lg:w-5 text-emerald-400" />
                    </div>
                    <div className="text-xs lg:text-sm font-semibold text-white">
                      Secure Payment
                    </div>
                    <div className="text-xs text-slate-400 hidden lg:block">
                      100% Protected
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/30 border-slate-700/50 text-center">
                  <CardContent className="p-3 lg:p-4">
                    <div className="w-8 h-8 lg:w-12 lg:h-12 mx-auto mb-2 lg:mb-3 rounded-full bg-amber-600/20 flex items-center justify-center">
                      <RotateCcw className="h-4 w-4 lg:h-5 lg:w-5 text-amber-400" />
                    </div>
                    <div className="text-xs lg:text-sm font-semibold text-white">
                      Easy Returns
                    </div>
                    <div className="text-xs text-slate-400 hidden lg:block">
                      30-day policy
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Enhanced Product Details Section */}
          <div className="space-y-8 lg:space-y-12">
            {/* Tabs with modern design */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full grid-cols-2 lg:grid-cols-5 flex justify-around bg-slate-800/50 border border-slate-700/50 rounded-xl lg:rounded-2xl p-1 mb-5 lg:mb-8 gap-1 lg:gap-0">
                <TabsTrigger
                  value="description"
                  className="data-[state=active]:bg-blue-600 w-full data-[state=active]:text-white rounded-lg lg:rounded-xl font-medium text-xs lg:text-sm px-2 lg:px-4 py-2"
                >
                  <span className="lg:hidden">Details</span>
                  <span className="hidden lg:inline">Description</span>
                </TabsTrigger>
                <TabsTrigger
                  value="specifications"
                  className="data-[state=active]:bg-blue-600 w-full data-[state=active]:text-white rounded-lg lg:rounded-xl font-medium text-xs lg:text-sm px-2 lg:px-4 py-2"
                >
                  <span className="lg:hidden">Specs</span>
                  <span className="hidden lg:inline">Specifications</span>
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  onClick={fetchReviews}
                  className="data-[state=active]:bg-blue-600 w-full data-[state=active]:text-white rounded-lg lg:rounded-xl font-medium text-xs lg:text-sm px-2 lg:px-4 py-2 lg:col-span-1"
                >
                  <span className="lg:hidden">Reviews</span>
                  <span className="hidden lg:inline">
                    Reviews ({reviews.length})
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="ratings"
                  className="data-[state=active]:bg-blue-600 w-full data-[state=active]:text-white rounded-lg lg:rounded-xl font-medium text-xs lg:text-sm px-2 lg:px-4 py-2 lg:hidden"
                >
                  Ratings
                </TabsTrigger>
                <TabsTrigger
                  value="shipping"
                  className="data-[state=active]:bg-blue-600 w-full data-[state=active]:text-white rounded-lg lg:rounded-xl font-medium text-xs lg:text-sm px-2 lg:px-4 py-2 col-span-2 lg:col-span-1"
                >
                  Shipping
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-0">
                <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl lg:text-2xl text-white flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 lg:h-5 lg:w-5 text-blue-400" />
                      Product Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 lg:p-6 pt-0">
                    <p className="text-slate-300 leading-relaxed text-base lg:text-lg">
                      {productDetails.description}
                    </p>
                    <div className="mt-4 lg:mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
                      {[
                        { label: "Premium Quality", icon: Award },
                        { label: "Fast Delivery", icon: Clock },
                        { label: "Trusted Brand", icon: Users },
                        { label: "Secure Payment", icon: Shield },
                      ].map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-slate-400"
                        >
                          <feature.icon className="h-3 w-3 lg:h-4 lg:w-4" />
                          <span className="text-xs lg:text-sm">
                            {feature.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="specifications" className="mt-0">
                <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl lg:text-2xl text-white flex items-center gap-2">
                      <Package className="h-4 w-4 lg:h-5 lg:w-5 text-blue-400" />
                      Technical Specifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 lg:p-6 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                      <div className="space-y-3 lg:space-y-4">
                        <h4 className="font-semibold text-white text-base lg:text-lg border-b border-slate-700 pb-2">
                          Product Details
                        </h4>
                        {[
                          {
                            label: "Category",
                            value: productDetails.category[0].name || "N/A",
                          },
                          { label: "Product ID", value: productDetails._id },
                          {
                            label: "Availability",
                            value: "In Stock",
                            highlight: true,
                          },
                          { label: "Weight", value: "1.2 kg" },
                        ].map((spec, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-1 lg:py-2 border-b border-slate-800/50 last:border-0"
                          >
                            <span className="text-slate-400 text-sm lg:text-base">
                              {spec.label}:
                            </span>
                            <span
                              className={`font-medium text-sm lg:text-base ${
                                spec.highlight
                                  ? "text-emerald-400"
                                  : "text-white"
                              }`}
                            >
                              {spec.value}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-3 lg:space-y-4">
                        <h4 className="font-semibold text-white text-base lg:text-lg border-b border-slate-700 pb-2">
                          Quality & Care
                        </h4>
                        {[
                          { label: "Brand", value: "BlinkShop Premium" },
                          { label: "Warranty", value: "1 Year International" },
                          { label: "Material", value: "Premium Grade A" },
                          {
                            label: "Care Instructions",
                            value: "Machine Washable",
                          },
                        ].map((spec, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-1 lg:py-2 border-b border-slate-800/50 last:border-0"
                          >
                            <span className="text-slate-400 text-sm lg:text-base">
                              {spec.label}:
                            </span>
                            <span className="text-white font-medium text-sm lg:text-base">
                              {spec.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Mobile-specific ratings tab */}
              <TabsContent value="ratings" className="mt-0 lg:hidden">
                <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center">
                          {renderStars({ rate: calculateAverageRating() })}
                        </div>
                        <div className="text-xl font-bold text-white">
                          {calculateAverageRating()}
                        </div>
                        <div className="text-slate-400 text-sm">
                          ({reviews.length} reviews)
                        </div>
                      </div>
                    </div>

                    {/* Rating distribution */}
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count = getRatingDistribution()[rating];
                        const percentage =
                          reviews.length > 0
                            ? (count / reviews.length) * 100
                            : 0;
                        return (
                          <div key={rating} className="flex items-center gap-3">
                            <span className="text-sm text-slate-400 w-4">
                              {rating}
                            </span>
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <Progress
                              value={percentage}
                              className="flex-1 h-2"
                            />
                            <span className="text-sm text-slate-400 w-8">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                        onClick={() => setShowReviewModal(true)}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Write Review
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-0">
                <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl lg:text-2xl text-white flex items-center gap-2">
                        <Star className="h-4 w-4 lg:h-5 lg:w-5 text-yellow-400 fill-current" />
                        Customer Reviews
                      </CardTitle>
                      <Button
                        className="bg-blue-600 text-white border-0 hover:bg-blue-700 text-xs lg:text-sm px-3 lg:px-4"
                        onClick={() => setShowReviewModal(true)}
                      >
                        <MessageCircle className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                        <span className="hidden sm:inline">Write Review</span>
                        <span className="sm:hidden">Write</span>
                      </Button>
                    </div>
                    <CardDescription className="text-slate-400 text-sm lg:text-base">
                      Real reviews from verified customers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 lg:p-6 pt-0">
                    {/* Mobile rating summary */}
                    <div className="lg:hidden mb-6">
                      <Card className="bg-slate-700/30 border-slate-600/50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center">
                                {renderStars({
                                  rate: calculateAverageRating(),
                                })}
                              </div>
                              <div className="text-xl font-bold text-white">
                                {calculateAverageRating()}
                              </div>
                              <div className="text-slate-400 text-sm">
                                ({reviews.length}{" "}
                                {reviews.length === 1 ? "review" : "reviews"})
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-4 lg:space-y-6">
                      {reviews.length === 0 ? (
                        <div className="text-center py-8">
                          <MessageCircle className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-white mb-2">
                            No Reviews Yet
                          </h3>
                          <p className="text-slate-400 mb-4">
                            Be the first to review this product!
                          </p>
                          <Button
                            onClick={() => setShowReviewModal(true)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Write First Review
                          </Button>
                        </div>
                      ) : (
                        reviews.map((review) => {
                          const currentUserId = getCurrentUserId();
                          const hasUserLiked =
                            review.likedBy?.includes(currentUserId);
                          const hasUserDisliked =
                            review.dislikedBy?.includes(currentUserId);

                          return (
                            <div
                              key={review._id}
                              className="bg-slate-700/30 rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-slate-600/30"
                            >
                              <div className="flex items-start gap-3 lg:gap-4">
                                <Avatar className="w-10 h-10 lg:w-14 lg:h-14 ring-2 ring-slate-600">
                                  <AvatarImage
                                    src={
                                      review.userId?.avatar ||
                                      `https://ui-avatars.com/api/?name=${review.userId?.firstName}+${review.userId?.lastName}&background=3b82f6&color=fff`
                                    }
                                    alt={`${review.userId?.firstName} ${review.userId?.lastName}`}
                                  />
                                  <AvatarFallback className="bg-blue-600 text-white font-semibold text-sm">
                                    {review.userId?.firstName?.[0]}
                                    {review.userId?.lastName?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-3 flex-wrap">
                                    <h4 className="font-semibold text-white text-sm lg:text-lg">
                                      {review.userId?.firstName}{" "}
                                      {review.userId?.lastName}
                                    </h4>
                                    <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-600/30 text-xs">
                                      <CheckCircle className="h-2 w-2 lg:h-3 lg:w-3 mr-1" />
                                      Verified Purchase
                                    </Badge>
                                    <span className="text-slate-400 text-xs lg:text-sm">
                                      {new Date(
                                        review.createdAt
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
                                    <div className="flex">
                                      {renderStars(review.rating)}
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className="border-slate-600 text-slate-300 text-xs"
                                    >
                                      {review.rating}/5
                                    </Badge>
                                  </div>
                                  {review.title && (
                                    <h5 className="font-semibold text-white text-sm lg:text-base mb-2">
                                      {review.title}
                                    </h5>
                                  )}
                                  <p className="text-slate-300 text-left leading-relaxed text-sm lg:text-base mb-3 lg:mb-4">
                                    {review.comment}
                                  </p>
                                  <div className="flex items-center gap-3 lg:gap-4">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleLikeReview(review._id)
                                      }
                                      className={`text-xs lg:text-sm p-2 lg:p-3 transition-all duration-200 ${
                                        hasUserLiked
                                          ? "text-blue-400 hover:text-blue-300 bg-blue-400/10 hover:bg-blue-400/20"
                                          : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                                      }`}
                                    >
                                      <ThumbsUp
                                        className={`h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2 transition-all ${
                                          hasUserLiked
                                            ? "fill-current scale-110"
                                            : ""
                                        }`}
                                      />
                                      <span className="font-medium">
                                        {review.likes || 0}
                                      </span>
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleDislikeReview(review._id)
                                      }
                                      className={`text-xs lg:text-sm p-2 lg:p-3 transition-all duration-200 ${
                                        hasUserDisliked
                                          ? "text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20"
                                          : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                                      }`}
                                    >
                                      <ThumbsDown
                                        className={`h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2 transition-all ${
                                          hasUserDisliked
                                            ? "fill-current scale-110"
                                            : ""
                                        }`}
                                      />
                                      <span className="font-medium">
                                        {review.dislikes || 0}
                                      </span>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                    {reviews.length > 0 && (
                      <div className="mt-6 lg:mt-8 text-center">
                        <Button
                          variant="outline"
                          size="lg"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          Load More Reviews
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="shipping" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-lg lg:text-xl text-white flex items-center gap-2">
                        <Truck className="h-4 w-4 lg:h-5 lg:w-5 text-blue-400" />
                        Shipping Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 lg:p-6 pt-0">
                      <div className="space-y-3 lg:space-y-4">
                        {[
                          "Free shipping on orders over ₹1,000",
                          "Standard delivery: 3-5 business days",
                          "Express delivery: 1-2 business days",
                          "Same day delivery in select cities",
                        ].map((info, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4 text-emerald-400 flex-shrink-0" />
                            <span className="text-slate-300 text-sm lg:text-base">
                              {info}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-lg lg:text-xl text-white flex items-center gap-2">
                        <RotateCcw className="h-4 w-4 lg:h-5 lg:w-5 text-orange-400" />
                        Return Policy
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 lg:p-6 pt-0">
                      <div className="space-y-3 lg:space-y-4">
                        {[
                          "30-day return window",
                          "Free returns for defective items",
                          "Original packaging required",
                          "Refund processing: 5-7 business days",
                        ].map((info, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4 text-emerald-400 flex-shrink-0" />
                            <span className="text-slate-300 text-sm lg:text-base">
                              {info}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
            {/* Related Products with enhanced design */}
            {relatedProducts.length > 0 && (
              <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
                    <Package className="h-5 w-5 lg:h-6 lg:w-6 text-blue-400" />
                    You Might Also Like
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-base lg:text-lg">
                    Curated products from the same category
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 lg:p-6 pt-0">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {relatedProducts.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        className="hover:scale-105 transition-transform duration-300"
                      />
                    ))}
                  </div>
                  <div className="mt-6 lg:mt-8 text-center">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => navigate(`/products/${category}`)}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      View All{" "}
                      {category.charAt(0).toUpperCase() + category.slice(1)}{" "}
                      Products
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Write Review Modal */}
        <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
          <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                Write a Review
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Rating Selector */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-300">
                  Your Rating *
                </Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setNewReview((prev) => ({ ...prev, rating: star }))
                      }
                      className="transition-colors"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= newReview.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-slate-600 hover:text-yellow-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-slate-400">
                  {newReview.rating === 1 && "😞 Poor - Really disappointed"}
                  {newReview.rating === 2 && "😕 Fair - Not what I expected"}
                  {newReview.rating === 3 && "😐 Good - It's okay"}
                  {newReview.rating === 4 &&
                    "😊 Very Good - Pretty happy with it"}
                  {newReview.rating === 5 && "🤩 Excellent - Love it!"}
                </p>
              </div>

              {/* Review Title */}
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-sm font-medium text-slate-300"
                >
                  Review Title (Optional)
                </Label>
                <Input
                  id="title"
                  value={newReview.title}
                  onChange={(e) =>
                    setNewReview((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Summarize your review in a few words"
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                  maxLength={100}
                />
                <p className="text-xs text-slate-400 text-right">
                  {newReview.title.length}/100
                </p>
              </div>

              {/* Review Comment */}
              <div className="space-y-2">
                <Label
                  htmlFor="comment"
                  className="text-sm font-medium text-slate-300"
                >
                  Your Review *
                </Label>
                <Textarea
                  id="comment"
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  placeholder="Share your thoughts about this product... What did you like or dislike? How was the quality, delivery, packaging?"
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 min-h-[120px] resize-none"
                  maxLength={1000}
                />
                <p className="text-xs text-slate-400 text-right">
                  {newReview.comment.length}/1000
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-700">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowReviewModal(false);
                    setNewReview({
                      rating: 5,
                      title: "",
                      comment: "",
                    });
                  }}
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
                  disabled={submittingReview}
                >
                  Cancel
                </Button>
                <Button
                  onClick={submitReview}
                  disabled={!newReview.comment.trim() || submittingReview}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {submittingReview ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Submit Review
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
