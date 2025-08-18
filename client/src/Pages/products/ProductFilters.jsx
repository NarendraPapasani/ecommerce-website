import React, { useState, useEffect } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const ProductFilters = ({
  filters,
  onFiltersChange,
  onSearch,
  totalProducts = 0,
  className,
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(
    filters?.search || ""
  );
  const [localPriceRange, setLocalPriceRange] = useState([
    filters?.minPrice || 0,
    filters?.maxPrice || 100, // Match backend default
  ]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Mock data for categories - replace with actual API call
  const categories = [
    { _id: "electronics", count: 25 },
    { _id: "clothes", count: 45 },
    { _id: "furniture", count: 12 },
    { _id: "shoes", count: 18 },
    { _id: "miscellaneous", count: 20 },
  ];

  const priceRange = { minPrice: 0, maxPrice: 100 }; // Match backend default

  // Update local state when filters change
  useEffect(() => {
    setLocalSearchQuery(filters?.search || "");
    setLocalPriceRange([filters?.minPrice || 0, filters?.maxPrice || 100]); // Match backend default
  }, [filters]);

  // Debounced search
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchQuery(value);

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      if (onSearch) {
        onSearch(value);
      } else if (onFiltersChange) {
        onFiltersChange({ search: value });
      }
    }, 500); // 500ms debounce

    setSearchTimeout(timeout);
  };

  const handlePriceChange = (value) => {
    setLocalPriceRange(value);
    if (onFiltersChange) {
      onFiltersChange({
        minPrice: value[0],
        maxPrice: value[1],
      });
    }
  };

  const handleCategoryChange = (category) => {
    if (onFiltersChange) {
      onFiltersChange({ category });
    }
  };

  const handleSortChange = (sortBy) => {
    const [field, order] = sortBy.includes("-")
      ? sortBy.split("-")
      : [sortBy, "desc"];
    if (onFiltersChange) {
      onFiltersChange({
        sortBy:
          field === "price" ? "price" : field === "name" ? "title" : field,
        sortOrder: order === "low" ? "asc" : order === "high" ? "desc" : order,
      });
    }
  };

  const clearFilters = () => {
    setLocalPriceRange([0, priceRange.maxPrice || 100]); // Match backend default
    setLocalSearchQuery("");
    if (onFiltersChange) {
      onFiltersChange({
        search: "",
        category: "all",
        minPrice: 0,
        maxPrice: priceRange.maxPrice || 100, // Match backend default
        sortBy: "creationAt", // Match backend field name
        sortOrder: "desc",
      });
    }
  };

  const getSortValue = () => {
    if (!filters) return "newest";
    const { sortBy, sortOrder } = filters;
    if (sortBy === "price") {
      return sortOrder === "asc" ? "price-low" : "price-high";
    }
    if (sortBy === "title" || sortBy === "name") {
      return "name";
    }
    if (sortBy === "rating.rate") {
      return "rating";
    }
    return "newest";
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range Filter */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-white">
            Price Range
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={localPriceRange}
            onValueChange={handlePriceChange}
            max={100}
            min={0}
            step={10}
            className="w-full"
          />
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>₹{localPriceRange[0]}</span>
            <span>₹{localPriceRange[1]}</span>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-white">
            Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={filters?.category || "all"}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="all" className="text-white">
                All Categories
              </SelectItem>
              {categories.map((cat) => (
                <SelectItem
                  key={cat._id}
                  value={cat._id.toLowerCase()}
                  className="text-white"
                >
                  {cat._id} ({cat.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Sort Options */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-white">
            Sort By
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={getSortValue()} onValueChange={handleSortChange}>
            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="newest" className="text-white">
                Newest First
              </SelectItem>
              <SelectItem value="price-low" className="text-white">
                Price: Low to High
              </SelectItem>
              <SelectItem value="price-high" className="text-white">
                Price: High to Low
              </SelectItem>
              <SelectItem value="rating" className="text-white">
                Highest Rated
              </SelectItem>
              <SelectItem value="name" className="text-white">
                Name A-Z
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
        onClick={clearFilters}
      >
        <X className="h-4 w-4 mr-2" />
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className={className}>
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <Input
          type="search"
          placeholder="Search products..."
          value={localSearchQuery}
          onChange={handleSearchChange}
          className="pl-10 bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-400 focus:border-blue-500 h-12 text-lg font-['Montserrat']"
        />
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-zinc-400">{totalProducts} products found</p>
      </div>

      {/* Mobile Filter Button */}
      <div className="flex items-center justify-between mb-4 md:hidden">
        <h2 className="text-lg font-semibold text-white">Filters</h2>
        <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-700 text-zinc-300"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="bg-zinc-950 border-zinc-800 w-80"
          >
            <SheetHeader>
              <SheetTitle className="text-white">Filters</SheetTitle>
              <SheetDescription className="text-zinc-400">
                Refine your product search
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:block">
        <FilterContent />
      </div>

      {/* Active Filters */}
      {(filters?.category !== "all" ||
        filters?.search ||
        getSortValue() !== "newest") && (
        <div className="flex flex-wrap gap-2 mt-4">
          {filters?.category !== "all" && (
            <Badge variant="secondary" className="bg-blue-600 text-white">
              {filters.category}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => handleCategoryChange("all")}
              />
            </Badge>
          )}
          {filters?.search && (
            <Badge variant="secondary" className="bg-green-600 text-white">
              "{filters.search}"
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => {
                  setLocalSearchQuery("");
                  if (onFiltersChange) {
                    onFiltersChange({ search: "" });
                  }
                }}
              />
            </Badge>
          )}
          {getSortValue() !== "newest" && (
            <Badge variant="secondary" className="bg-purple-600 text-white">
              Sort: {getSortValue().replace("-", " ")}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => handleSortChange("newest")}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
