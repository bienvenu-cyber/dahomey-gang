import { useState, useMemo } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  sizes: string[];
  colors: { name: string; hex: string }[];
}

interface AdvancedFiltersProps {
  products: Product[];
  selectedSizes: string[];
  selectedColors: string[];
  onSizesChange: (sizes: string[]) => void;
  onColorsChange: (colors: string[]) => void;
}

export default function AdvancedFilters({
  products,
  selectedSizes,
  selectedColors,
  onSizesChange,
  onColorsChange,
}: AdvancedFiltersProps) {
  // Extract unique sizes and colors from products
  const availableSizes = useMemo(() => {
    const sizes = new Set<string>();
    products.forEach((p) => p.sizes?.forEach((s) => sizes.add(s)));
    return Array.from(sizes).sort();
  }, [products]);

  const availableColors = useMemo(() => {
    const colorsMap = new Map<string, string>();
    products.forEach((p) => {
      p.colors?.forEach((c) => {
        if (!colorsMap.has(c.name)) {
          colorsMap.set(c.name, c.hex);
        }
      });
    });
    return Array.from(colorsMap.entries()).map(([name, hex]) => ({ name, hex }));
  }, [products]);

  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      onSizesChange(selectedSizes.filter((s) => s !== size));
    } else {
      onSizesChange([...selectedSizes, size]);
    }
  };

  const toggleColor = (color: string) => {
    if (selectedColors.includes(color)) {
      onColorsChange(selectedColors.filter((c) => c !== color));
    } else {
      onColorsChange([...selectedColors, color]);
    }
  };

  if (availableSizes.length === 0 && availableColors.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Sizes */}
      {availableSizes.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-primary mb-3">Tailles</h3>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={cn(
                  "px-4 py-2 border rounded-lg text-sm font-medium transition-all",
                  selectedSizes.includes(size)
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-primary border-border hover:border-primary"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Colors */}
      {availableColors.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-primary mb-3">Couleurs</h3>
          <div className="flex flex-wrap gap-3">
            {availableColors.map((color) => (
              <button
                key={color.name}
                onClick={() => toggleColor(color.name)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition-all",
                  selectedColors.includes(color.name)
                    ? "bg-primary/10 border-primary"
                    : "bg-white border-border hover:border-primary"
                )}
                title={color.name}
              >
                <span
                  className={cn(
                    "w-5 h-5 rounded-full border-2",
                    selectedColors.includes(color.name) ? "border-primary" : "border-border"
                  )}
                  style={{ backgroundColor: color.hex }}
                />
                <span className="capitalize">{color.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
