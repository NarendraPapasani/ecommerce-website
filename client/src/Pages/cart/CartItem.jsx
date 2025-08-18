import {
  Truck,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  Package,
  ShieldCheck,
  Star,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Tag,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RotatingLines } from "react-loader-spinner";

const CartItem = (props) => {
  const { each, loading1 } = props;
  const {
    image,
    images,
    price: rawPrice,
    productId,
    quantity: rawQuantity,
    title,
    _id,
    description,
    category,
    rating,
    tags,
    latestPrice: rawLatestPrice,
    priceChanged,
    currentPrice,
    originalPrice,
    priceDifference: rawPriceDifference,
    product,
    addedAt,
    stock,
  } = each;

  // Ensure numeric values are properly converted
  const price = parseFloat(rawPrice) || 0;
  const quantity = parseInt(rawQuantity) || 1;
  const latestPrice = rawLatestPrice ? parseFloat(rawLatestPrice) : null;
  const priceDifference = parseFloat(rawPriceDifference) || 0;

  const navigate = useNavigate();

  const discountedPrice = (price * 1.15).toFixed(2);
  const roundedPrice = price.toFixed(2);
  const actualLatestPrice = latestPrice || price / quantity;
  const hasMultipleImages = images && images.length > 1;

  const imageClick = () => {
    // Get category name for routing, fallback to 'all' if not available
    const categoryName = category?.name || category?.slug || "all";
    navigate(`/product/${categoryName}/${productId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    const rate = rating.rate || rating;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-3 w-3 ${
            i <= Math.floor(rate)
              ? "text-yellow-400 fill-current"
              : "text-slate-600"
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <Card className="bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/20 group">
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Product Image with Gallery Preview */}
          <div
            className="flex-shrink-0 cursor-pointer group/image relative"
            onClick={imageClick}
          >
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={image}
                alt={title}
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover transition-transform duration-300 group-hover/image:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 transition-colors duration-300 rounded-lg flex items-center justify-center">
                <Eye className="h-5 w-5 text-white opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
              </div>
              {hasMultipleImages && (
                <Badge className="absolute top-1 right-1 bg-blue-600/80 text-white text-xs px-1 py-0.5">
                  +{images.length - 1}
                </Badge>
              )}
              {priceChanged && (
                <Badge className="absolute bottom-1 left-1 bg-orange-600/80 text-white text-xs px-1 py-0.5">
                  <TrendingUp className="h-2 w-2 mr-1" />
                  Price Updated
                </Badge>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
              <div className="flex-1 space-y-2 sm:space-y-3">
                {/* Title and Category */}
                <div>
                  <h3
                    className="text-white font-semibold text-sm sm:text-base line-clamp-2 cursor-pointer hover:text-blue-400 transition-colors duration-200 mb-1"
                    onClick={imageClick}
                  >
                    {title}
                  </h3>
                  {category && (
                    <p className="text-slate-400 text-xs">{category.name}</p>
                  )}
                  {description && (
                    <p className="text-slate-500 text-xs line-clamp-1 sm:line-clamp-2">
                      {description}
                    </p>
                  )}
                </div>

                {/* Rating and Tags */}
                <div className="flex flex-wrap items-center gap-2">
                  {rating && (
                    <div className="flex items-center gap-1">
                      <div className="flex">{renderStars(rating)}</div>
                      <span className="text-slate-400 text-xs">
                        {typeof rating === "object" ? rating.rate : rating}/5
                      </span>
                    </div>
                  )}
                  {tags && tags.length > 0 && (
                    <Badge
                      variant="outline"
                      className="border-slate-600 text-slate-300 text-xs"
                    >
                      <Tag className="h-2 w-2 mr-1" />
                      {tags[0]}
                    </Badge>
                  )}
                  {addedAt && (
                    <Badge
                      variant="outline"
                      className="border-slate-600 text-slate-300 text-xs"
                    >
                      <Calendar className="h-2 w-2 mr-1" />
                      Added {formatDate(addedAt)}
                    </Badge>
                  )}
                </div>

                {/* Quantity Controls and Status Badges */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 text-sm">Qty:</span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => props.decreaseQuantity(productId)}
                        disabled={loading1 || quantity <= 1}
                        className="h-7 w-7 p-0 border-slate-600 hover:bg-slate-600 hover:text-white disabled:opacity-50"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>

                      <div className="flex items-center justify-center min-w-[35px] h-7 px-2">
                        {loading1 ? (
                          <RotatingLines
                            visible={true}
                            height="14"
                            width="14"
                            color="#3b82f6"
                            strokeWidth="5"
                            animationDuration="0.75"
                            ariaLabel="rotating-lines-loading"
                          />
                        ) : (
                          <span className="text-white font-medium text-sm">
                            {quantity}
                          </span>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => props.increaseQuantity(productId)}
                        disabled={loading1 || (stock && quantity >= stock)}
                        className="h-7 w-7 p-0 border-slate-600 hover:bg-slate-600 hover:text-white disabled:opacity-50"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-blue-600/20 text-blue-400 border-blue-600/30 text-xs"
                    >
                      <Truck className="w-3 h-3 mr-1" />
                      Free Delivery
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-emerald-600/20 text-emerald-400 border-emerald-600/30 text-xs"
                    >
                      <ShieldCheck className="w-3 h-3 mr-1" />
                      Quality Assured
                    </Badge>
                    {stock && stock < 10 && (
                      <Badge
                        variant="destructive"
                        className="bg-red-600/20 text-red-400 border-red-600/30 text-xs"
                      >
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Only {stock} left
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Price Change Alert */}
                {priceChanged && priceDifference !== 0 && (
                  <Alert
                    className={`${
                      priceDifference > 0
                        ? "bg-red-900/20 border-red-600/30"
                        : "bg-green-900/20 border-green-600/30"
                    }`}
                  >
                    <TrendingUp
                      className={`h-4 w-4 ${
                        priceDifference > 0 ? "text-red-400" : "text-green-400"
                      }`}
                    />
                    <AlertDescription
                      className={`text-xs ${
                        priceDifference > 0 ? "text-red-200" : "text-green-200"
                      }`}
                    >
                      Price {priceDifference > 0 ? "increased" : "decreased"} by
                      ₹{Math.abs(priceDifference).toFixed(2)}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Price and Actions */}
              <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-2">
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-emerald-400">
                      ₹{roundedPrice}
                    </span>
                    <span className="text-sm text-slate-400 line-through">
                      ₹{discountedPrice}
                    </span>
                  </div>
                  {priceChanged && (
                    <p className="text-xs text-amber-400 mt-1">
                      Latest: ₹{(actualLatestPrice || 0).toFixed(2)}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 mt-1">
                    {Math.round(
                      ((discountedPrice - roundedPrice) / discountedPrice) * 100
                    )}
                    % off
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => props.deleteItem(_id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartItem;
