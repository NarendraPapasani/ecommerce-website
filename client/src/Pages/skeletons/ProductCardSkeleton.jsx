import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const ProductCardSkeleton = () => {
  return (
    <Card className="group bg-zinc-900 border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 hover:shadow-lg">
      <div className="relative">
        {/* Image skeleton */}
        <Skeleton className="aspect-square w-full bg-zinc-800" />

        {/* Overlay buttons skeleton */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <Skeleton className="h-9 w-9 rounded-full bg-zinc-700" />
          <Skeleton className="h-9 w-9 rounded-full bg-zinc-700" />
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Category skeleton */}
        <Skeleton className="h-4 w-20 bg-zinc-800" />

        {/* Title skeleton */}
        <Skeleton className="h-5 w-full bg-zinc-800" />
        <Skeleton className="h-5 w-3/4 bg-zinc-800" />

        {/* Price skeleton */}
        <Skeleton className="h-6 w-24 bg-zinc-800" />

        {/* Rating skeleton */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-4 bg-zinc-800" />
          ))}
          <Skeleton className="h-4 w-12 ml-2 bg-zinc-800" />
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-10 w-full bg-zinc-800" />
      </CardFooter>
    </Card>
  );
};

export default ProductCardSkeleton;
