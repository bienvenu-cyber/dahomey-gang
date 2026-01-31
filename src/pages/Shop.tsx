import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, X, ChevronDown, Grid, LayoutGrid, Loader2 } from "lucide-react";
import { useProducts, useCategories } from "@/hooks/useProducts";
import ProductCard from "@/components/products/ProductCard";
import { cn } from "@/lib/utils";

const priceRanges = [
  { label: "Tous les prix", min: 0, max: Infinity },
  { label: "Moins de 50€", min: 0, max: 50 },
  { label: "50€ - 80€", min: 50, max: 80 },
  { label: "80€ - 100€", min: 80, max: 100 },
  { label: "Plus de 100€", min: 100, max: Infinity },
];

const sortOptions = [
  { label: "Popularité", value: "popular" },
  { label: "Nouveautés", value: "newest" },
  { label: "Prix croissant", value: "price-asc" },
  { label: "Prix décroissant", value: "price-desc" },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [gridCols, setGridCols] = useState<2 | 3>(3);

  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();

  // Get filter values from URL
  const categoryFilter = searchParams.get("category") || "";
  const priceFilter = searchParams.get("price") || "";
  const sortBy = searchParams.get("sort") || "popular";
  const featured = searchParams.get("featured") === "true";

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchQuery("");
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Featured filter
    if (featured) {
      filtered = filtered.filter((p) => p.featured);
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    // Price filter
    if (priceFilter) {
      const range = priceRanges.find((r) => r.label === priceFilter);
      if (range) {
        filtered = filtered.filter(
          (p) => p.price >= range.min && p.price < range.max
        );
      }
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Sorting
    switch (sortBy) {
      case "newest":
        filtered = filtered.filter((p) => p.new).concat(filtered.filter((p) => !p.new));
        break;
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "popular":
      default:
        filtered.sort((a, b) => b.reviews - a.reviews);
    }

    return filtered;
  }, [products, categoryFilter, priceFilter, sortBy, searchQuery, featured]);

  const activeFiltersCount = [categoryFilter, priceFilter, featured].filter(Boolean).length;

  return (
    <main className="pt-24 pb-20 min-h-screen bg-background">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-montserrat text-3xl md:text-4xl font-bold text-primary mb-2">
            {featured ? "Collections Vedettes" : "Boutique"}
          </h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""}
          </p>
        </div>

        {/* Search & Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-shadow"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Toggle (Mobile) */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden flex items-center justify-center gap-2 px-4 py-3 bg-white border border-border rounded-lg"
          >
            <Filter className="w-5 h-5" />
            Filtres
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 bg-secondary text-secondary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Desktop Filters */}
          <div className="hidden md:flex items-center gap-4">
            {/* Category */}
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => updateFilter("category", e.target.value)}
                className="appearance-none bg-white border border-border rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-secondary/50 cursor-pointer"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
            </div>

            {/* Price */}
            <div className="relative">
              <select
                value={priceFilter}
                onChange={(e) => updateFilter("price", e.target.value)}
                className="appearance-none bg-white border border-border rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-secondary/50 cursor-pointer"
              >
                {priceRanges.map((range) => (
                  <option key={range.label} value={range.label === "Tous les prix" ? "" : range.label}>
                    {range.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => updateFilter("sort", e.target.value)}
                className="appearance-none bg-white border border-border rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-secondary/50 cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    Trier: {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
            </div>

            {/* Grid Toggle */}
            <div className="flex items-center gap-1 bg-white border border-border rounded-lg p-1">
              <button
                onClick={() => setGridCols(2)}
                className={cn(
                  "p-2 rounded transition-colors",
                  gridCols === 2 ? "bg-primary text-white" : "text-muted-foreground hover:text-primary"
                )}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridCols(3)}
                className={cn(
                  "p-2 rounded transition-colors",
                  gridCols === 3 ? "bg-primary text-white" : "text-muted-foreground hover:text-primary"
                )}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Filters Panel */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 mb-6",
            isFilterOpen ? "max-h-96" : "max-h-0"
          )}
        >
          <div className="bg-white border border-border rounded-lg p-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-primary mb-2 block">
                Catégorie
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => updateFilter("category", e.target.value)}
                className="w-full bg-muted border-0 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/50"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-2 block">
                Prix
              </label>
              <select
                value={priceFilter}
                onChange={(e) => updateFilter("price", e.target.value)}
                className="w-full bg-muted border-0 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/50"
              >
                {priceRanges.map((range) => (
                  <option key={range.label} value={range.label === "Tous les prix" ? "" : range.label}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-2 block">
                Trier par
              </label>
              <select
                value={sortBy}
                onChange={(e) => updateFilter("sort", e.target.value)}
                className="w-full bg-muted border-0 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/50"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {categoryFilter && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-primary rounded-full text-sm">
                {categories.find((c) => c.slug === categoryFilter)?.name}
                <button onClick={() => updateFilter("category", "")}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {priceFilter && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-primary rounded-full text-sm">
                {priceFilter}
                <button onClick={() => updateFilter("price", "")}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-accent hover:text-accent/80 font-medium"
            >
              Effacer tout
            </button>
          </div>
        )}

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div
            className={cn(
              "grid gap-4 md:gap-6",
              gridCols === 2
                ? "grid-cols-2 lg:grid-cols-3"
                : "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            )}
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-4">
              Aucun produit ne correspond à votre recherche
            </p>
            <button onClick={clearFilters} className="btn-primary">
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
