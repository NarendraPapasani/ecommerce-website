import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import CartItem from "@/Pages/cart/CartItem";
import { useToast } from "@/hooks/use-toast";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Toaster } from "@/components/ui/toaster";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  Package,
  CreditCard,
  ArrowRight,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle2,
  Percent,
  DollarSign,
  TrendingUp,
  Star,
  BarChart3,
  Gift,
  Zap,
  Clock,
  Target,
  Truck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CartSkeletons from "@/Pages/skeletons/CartSkeletons";
import TotalPriceSkeleton from "@/Pages/skeletons/TotalPriceSkeleton";

const Cart = () => {
  const { toast } = useToast();
  const [cartList, setCartList] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(false);
  const [cartStatistics, setCartStatistics] = useState(null);
  const [priceUpdated, setPriceUpdated] = useState(false);
  const [activeTab, setActiveTab] = useState("cart");
  const discountPercentage = 2;
  const jwt = Cookies.get("jwt1");
  const navigate = useNavigate();

  useEffect(() => {
    getCartItems();
    getCartStatistics();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowDetails(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getCartStatistics = async () => {
    try {
      const resp = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/cart/statistics`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          withCredentials: true,
        }
      );
      setCartStatistics(resp.data.data.statistics);
    } catch (error) {
      console.log("Error fetching cart statistics:", error);
    }
  };

  const getCartItems = async () => {
    try {
      const resp = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/cart/all`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          withCredentials: true,
        }
      );
      const respData = resp.data.data.cart;
      setCartList(respData.items);
      calculateTotalPrice(respData.totalPrice);
      setPriceUpdated(respData.priceUpdated || false);

      // Show price update notification
      if (respData.priceUpdated) {
        toastWarning("Some product prices have been updated in your cart");
      }

      setLoading(false);
      getCartStatistics(); // Refresh statistics
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to load cart items",
        variant: "destructive",
      });
      setLoading(false);
      return error;
    }
  };

  const calculateTotalPrice = (totalPrice) => {
    setOriginalPrice(totalPrice.toFixed(2));
    const discountedTotal = totalPrice * (1 - discountPercentage / 100);
    setTotalPrice(discountedTotal.toFixed(2));
  };

  const increaseQuantity = async (_id) => {
    try {
      setLoading1(true);
      const resp = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/cart/increment/${_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          withCredentials: true,
        }
      );
      getCartItems();
      setLoading1(false);
    } catch (error) {
      console.log(error);
      setLoading1(false);
    }
  };

  const decreaseQuantity = async (_id) => {
    try {
      setLoading1(true);
      const resp = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/cart/decrement/${_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          withCredentials: true,
        }
      );

      getCartItems();
      setLoading1(false);
    } catch (error) {
      console.log(error);
      setLoading1(false);
    }
  };

  const deleteItem = async (_id) => {
    try {
      const resp = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/cart/remove/${_id}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          withCredentials: true,
        }
      );
      toastInfo("Item removed from cart");
      getCartItems();
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const handleShopNow = () => {
    navigate("/products/all");
  };

  const renderCartStatistics = () => {
    if (!cartStatistics) return null;

    return (
      <div className="space-y-4">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Package className="h-5 w-5 text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-white">
                {cartStatistics.totalItems}
              </p>
              <p className="text-xs text-slate-400">Total Items</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-5 w-5 text-yellow-400" />
              </div>
              <p className="text-2xl font-bold text-white">
                {cartStatistics.averageRating}
              </p>
              <p className="text-xs text-slate-400">Avg Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        {cartStatistics.categories.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Category Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cartStatistics.categories.slice(0, 3).map((category, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">{category.name}</span>
                    <span className="text-slate-400">
                      {category.count} items
                    </span>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Savings & Recommendations */}
        {parseFloat(cartStatistics.totalSavings) > 0 && (
          <Alert className="bg-emerald-900/20 border-emerald-600/30">
            <Gift className="h-4 w-4 text-emerald-400" />
            <AlertDescription className="text-emerald-200 text-sm">
              You could save ₹{cartStatistics.totalSavings} with available
              discounts!
            </AlertDescription>
          </Alert>
        )}

        {/* Free Shipping Progress */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-white">Free Shipping Progress</span>
            </div>
            {parseFloat(cartStatistics.cartValue) >= 1000 ? (
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm">You qualify for free shipping!</span>
              </div>
            ) : (
              <div className="space-y-2">
                <Progress
                  value={(parseFloat(cartStatistics.cartValue) / 1000) * 100}
                  className="h-2"
                />
                <p className="text-xs text-slate-400">
                  Add ₹
                  {(1000 - parseFloat(cartStatistics.cartValue)).toFixed(2)}{" "}
                  more for free shipping
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="relative z-10">
        {/* Header with Enhanced Stats */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-blue-500" />
            <h1 className="text-xl md:text-xl font-bold text-white">
              Shopping Cart
            </h1>
            {cartList.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 bg-slate-700 text-slate-200"
              >
                {cartList.length} item{cartList.length !== 1 ? "s" : ""}
              </Badge>
            )}
            {priceUpdated && (
              <Badge
                variant="outline"
                className="border-orange-500 text-orange-400"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                Prices Updated
              </Badge>
            )}
          </div>

          {cartStatistics && cartList.length > 0 && (
            <div className="hidden md:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-slate-300">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>{cartStatistics.averageRating}/5 avg rating</span>
              </div>
              <div className="flex items-center gap-1 text-slate-300">
                <Target className="h-4 w-4 text-emerald-400" />
                <span>₹{cartStatistics.cartValue} cart value</span>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CartSkeletons count={4} />
            </div>
            <div className="lg:col-span-1">
              <TotalPriceSkeleton />
            </div>
          </div>
        ) : cartList.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="rounded-full bg-slate-700/50 p-6 mb-6">
                <Package className="h-16 w-16 text-slate-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                Your cart is empty
              </h2>
              <p className="text-slate-400 text-center mb-8 max-w-md">
                Looks like you haven't added any items to your cart yet. Start
                shopping to fill it up!
              </p>
              <Button
                onClick={handleShopNow}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                size="lg"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content with Tabs */}
            <div className="lg:col-span-2">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-slate-700">
                  <TabsTrigger
                    value="cart"
                    className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Cart Items ({cartList.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="stats"
                    className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Insights
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="cart" className="mt-4">
                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardContent className="p-0">
                      <Scrollbars
                        autoHide
                        style={{
                          height: "calc(100vh - 280px)",
                          minHeight: "550px",
                        }}
                        renderThumbVertical={(props) => (
                          <div {...props} className="bg-slate-600 rounded" />
                        )}
                      >
                        <div className="p-4 space-y-3">
                          {cartList.map((each, index) => (
                            <div key={each._id}>
                              <CartItem
                                each={each}
                                increaseQuantity={increaseQuantity}
                                decreaseQuantity={decreaseQuantity}
                                deleteItem={deleteItem}
                                loading1={loading1}
                              />
                              {index < cartList.length - 1 && (
                                <Separator className="bg-slate-700 mt-3" />
                              )}
                            </div>
                          ))}
                        </div>
                      </Scrollbars>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="stats" className="mt-4">
                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Shopping Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>{renderCartStatistics()}</CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Enhanced Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-4">
                {/* Price Update Alert */}
                {priceUpdated && (
                  <Alert className="bg-orange-900/20 border-orange-600/30">
                    <AlertCircle className="h-4 w-4 text-orange-400" />
                    <AlertDescription className="text-orange-200 text-sm">
                      Some product prices have been updated. Your cart total has
                      been recalculated.
                    </AlertDescription>
                  </Alert>
                )}

                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Mobile collapsible details */}
                    <div className="lg:hidden">
                      <Button
                        variant="ghost"
                        onClick={() => setShowDetails(!showDetails)}
                        className="w-full justify-between text-white hover:bg-slate-700/50"
                      >
                        <span className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Total:{" "}
                          <span className="text-emerald-400 font-bold">
                            ₹{totalPrice}
                          </span>
                        </span>
                        {showDetails ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {/* Desktop always show, mobile conditional */}
                    <div
                      className={`${showDetails ? "block" : "hidden"} lg:block`}
                    >
                      <>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-slate-300">
                            <span>Original Price:</span>
                            <span className="line-through text-red-400">
                              ₹{originalPrice}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-slate-300">
                            <span className="flex items-center gap-1">
                              <Percent className="h-4 w-4" />
                              Discount ({discountPercentage}%):
                            </span>
                            <span className="text-amber-400 font-medium">
                              -₹
                              {(
                                (originalPrice * discountPercentage) /
                                100
                              ).toFixed(2)}
                            </span>
                          </div>

                          <Separator className="bg-slate-700" />

                          <div className="flex justify-between items-center text-lg font-semibold">
                            <span className="text-white">Total Price:</span>
                            <span className="text-emerald-400">
                              ₹{totalPrice}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">You Save:</span>
                            <span className="text-blue-400 font-medium">
                              ₹{(originalPrice - totalPrice).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <Alert className="bg-emerald-900/20 border-emerald-600/30">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          <AlertDescription className="text-emerald-200 text-sm">
                            You're saving {discountPercentage}% on your entire
                            order!
                          </AlertDescription>
                        </Alert>
                      </>
                    </div>

                    <Separator className="bg-slate-700" />

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button
                        onClick={() => navigate("/checkout")}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 text-lg"
                        size="lg"
                      >
                        <CreditCard className="mr-2 h-5 w-5" />
                        Proceed to Checkout
                      </Button>

                      <Button
                        variant="outline"
                        onClick={handleShopNow}
                        className="w-full border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-white"
                      >
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Continue Shopping
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
