import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ArrowRight, RotateCcw } from "lucide-react";

const PriceRangeFilter = ({
  value = [0, 100],
  onChange,
  min = 0,
  max = 100,
  step = 1,
  currency = "₹",
  className = "",
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [minInput, setMinInput] = useState(value[0].toString());
  const [maxInput, setMaxInput] = useState(value[1].toString());
  const [errors, setErrors] = useState({ min: false, max: false });

  useEffect(() => {
    setLocalValue(value);
    setMinInput(value[0].toString());
    setMaxInput(value[1].toString());
  }, [value]);

  const validateAndUpdate = (newMin, newMax) => {
    const parsedMin = Math.max(min, Math.min(newMin, max));
    const parsedMax = Math.max(min, Math.min(newMax, max));
    const finalMin = Math.min(parsedMin, parsedMax);
    const finalMax = Math.max(parsedMin, parsedMax);

    const newValue = [finalMin, finalMax];
    setLocalValue(newValue);
    setMinInput(finalMin.toString());
    setMaxInput(finalMax.toString());

    if (onChange) {
      onChange(newValue);
    }

    // Clear errors
    setErrors({ min: false, max: false });
  };

  const handleSliderChange = (newValue) => {
    setLocalValue(newValue);
    setMinInput(newValue[0].toString());
    setMaxInput(newValue[1].toString());

    if (onChange) {
      onChange(newValue);
    }
  };

  const handleMinInputChange = (e) => {
    const value = e.target.value;
    setMinInput(value);

    if (value === "" || isNaN(value)) {
      setErrors((prev) => ({ ...prev, min: true }));
      return;
    }

    const numValue = parseFloat(value);
    if (numValue >= min && numValue <= max) {
      validateAndUpdate(numValue, localValue[1]);
    } else {
      setErrors((prev) => ({ ...prev, min: true }));
    }
  };

  const handleMaxInputChange = (e) => {
    const value = e.target.value;
    setMaxInput(value);

    if (value === "" || isNaN(value)) {
      setErrors((prev) => ({ ...prev, max: true }));
      return;
    }

    const numValue = parseFloat(value);
    if (numValue >= min && numValue <= max) {
      validateAndUpdate(localValue[0], numValue);
    } else {
      setErrors((prev) => ({ ...prev, max: true }));
    }
  };

  const handleInputBlur = () => {
    // On blur, ensure valid values
    const newMin = Math.max(min, Math.min(parseFloat(minInput) || min, max));
    const newMax = Math.max(min, Math.min(parseFloat(maxInput) || max, max));
    validateAndUpdate(newMin, newMax);
  };

  const resetRange = () => {
    validateAndUpdate(min, max);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const isActive = localValue[0] !== min || localValue[1] !== max;

  return (
    <Card className={`border-zinc-800 bg-zinc-900/50 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-400" />
            Price Range
          </CardTitle>
          {isActive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetRange}
              className="h-6 w-6 p-0 text-zinc-400 hover:text-white"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Current Range Display */}
        <div className="flex items-center justify-center gap-2 text-center">
          <Badge
            variant="outline"
            className="bg-blue-600/20 border-blue-600/50 text-blue-300 font-medium"
          >
            {formatPrice(localValue[0])}
          </Badge>
          <ArrowRight className="h-3 w-3 text-zinc-500" />
          <Badge
            variant="outline"
            className="bg-blue-600/20 border-blue-600/50 text-blue-300 font-medium"
          >
            {formatPrice(localValue[1])}
          </Badge>
        </div>

        {/* Slider */}
        <div className="px-2">
          <Slider
            value={localValue}
            onValueChange={handleSliderChange}
            max={max}
            min={min}
            step={step}
            className="w-full"
          />
          <div className="flex items-center justify-between text-xs text-zinc-400 mt-2">
            <span>
              {currency}
              {min}
            </span>
            <span>
              {currency}
              {max}
            </span>
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="min-price" className="text-xs text-zinc-400">
              Min Price
            </Label>
            <Input
              id="min-price"
              type="number"
              value={minInput}
              onChange={handleMinInputChange}
              onBlur={handleInputBlur}
              min={min}
              max={max}
              step={step}
              className={`bg-zinc-800 border-zinc-700 text-white text-sm h-9 ${
                errors.min
                  ? "border-red-500 focus:border-red-500"
                  : "focus:border-blue-500"
              }`}
              placeholder={min.toString()}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="max-price" className="text-xs text-zinc-400">
              Max Price
            </Label>
            <Input
              id="max-price"
              type="number"
              value={maxInput}
              onChange={handleMaxInputChange}
              onBlur={handleInputBlur}
              min={min}
              max={max}
              step={step}
              className={`bg-zinc-800 border-zinc-700 text-white text-sm h-9 ${
                errors.max
                  ? "border-red-500 focus:border-red-500"
                  : "focus:border-blue-500"
              }`}
              placeholder={max.toString()}
            />
          </div>
        </div>

        {/* Quick Preset Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Under ₹25", range: [min, 25] },
            { label: "₹25-₹50", range: [25, 50] },
            { label: "₹50+", range: [50, max] },
          ].map((preset, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() =>
                validateAndUpdate(preset.range[0], preset.range[1])
              }
              className={`text-xs h-8 transition-all duration-200 ${
                localValue[0] === preset.range[0] &&
                localValue[1] === preset.range[1]
                  ? "bg-blue-600/20 border-blue-600/50 text-blue-300"
                  : "border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"
              }`}
            >
              {preset.label}
            </Button>
          ))}
        </div>

        {/* Error Messages */}
        {(errors.min || errors.max) && (
          <div className="text-xs text-red-400 mt-1">
            Please enter valid prices between {currency}
            {min} and {currency}
            {max}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PriceRangeFilter;
