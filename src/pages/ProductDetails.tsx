import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Minus, Plus, Heart, Truck, Shield, RefreshCw, Star, Loader2, AlertCircle } from "lucide-react";
import { useProductBySlug, useProductsByCategory } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import ProductCard from "@/components/products/ProductCard";
import ShareButton from "@/components/ShareButton";
import { cn } from "@/lib/utils";

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  
  const { data: product, isLoading } = useProductBySlug(slug || "");
  const { data: relatedProducts = [] } = useProductsByCategory(product?.category || "");
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // Auto-select if only one option
  useEffect(() => {
    if (product) {
      if (product.sizes.length === 1 && !selectedSize) {
        setSelectedSize(product.sizes[0]);
      }
      if (product.colors.length === 1 && !selectedColor) {
        setSelectedColor(product.colors[0].name);
      }
    }
  }, [product, selectedSize, selectedColor]);

  // Hide warning when user selects
  useEffect(() => {
    if (showWarning && ((product?.sizes.length === 1 || selectedSize) && (product?.colors.length === 1 || selectedColor))) {
      setShowWarning(false);
    }
  }, [selectedSize, selectedColor, showWarning, product]);

  if (isLoading) {
    return (
      <main className="pt-24 pb-20 min-h-screen bg-background">
        <div className="container-custom flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="pt-24 pb-20 min-h-screen bg-background">
        <div className="container-custom text-center py-20">
          <h1 className="font-montserrat text-2xl font-bold text-primary mb-4">
            Produit non trouvé
          </h1>
          <Link to="/shop" className="btn-primary">
            Retour à la boutique
          </Link>
        </div>
      </main>
    );
  }

  const handleAddToCart = () => {
    // Check if selection is needed
    const needsSize = product.sizes.length > 1 && !selectedSize;
    const needsColor = product.colors.length > 1 && !selectedColor;

    if (needsSize || needsColor) {
      setShowWarning(true);
      return;
    }

    // Auto-select if empty but only one option
    const finalSize = selectedSize || (product.sizes.length === 1 ? product.sizes[0] : "") || "Standard";
    const finalColor = selectedColor || (product.colors.length === 1 ? product.colors[0].name : "") || "Défaut";

    addItem(product, finalSize, finalColor, quantity);
    setShowWarning(false);
  };

  const filteredRelated = relatedProducts.filter((p) => p.id !== product.id).slice(0, 4);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <main className="pt-24 pb-20 min-h-screen bg-background">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
            Accueil
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors">
            Boutique
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-primary font-medium">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-muted rounded-xl overflow-hidden">
              {product.images.length > 0 ? (
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover animate-fade-in"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  Pas d'image
                </div>
              )}
              
              {/* Navigation */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === 0 ? product.images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === product.images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.new && (
                  <span className="px-3 py-1 bg-highlight text-white text-sm font-bold uppercase rounded">
                    Nouveau
                  </span>
                )}
                {discount > 0 && (
                  <span className="px-3 py-1 bg-accent text-white text-sm font-bold rounded">
                    -{discount}%
                  </span>
                )}
              </div>

              {/* Share button */}
              <div className="absolute top-4 right-4">
                <ShareButton title={product.name} />
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={cn(
                      "w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors",
                      currentImageIndex === index
                        ? "border-secondary"
                        : "border-transparent hover:border-border"
                    )}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - Vue ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-4 h-4",
                      i < Math.floor(product.rating)
                        ? "fill-secondary text-secondary"
                        : "text-muted"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({product.reviews} avis)
              </span>
            </div>

            {/* Title & Price */}
            <h1 className="font-montserrat text-2xl md:text-3xl font-bold text-primary mb-4">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-montserrat text-3xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div className="mb-6">
                <label className="text-sm font-medium text-primary mb-3 block">
                  Couleur: {selectedColor || "Choisir une couleur"}
                </label>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={cn(
                        "w-10 h-10 rounded-full border-2 transition-all",
                        selectedColor === color.name
                          ? "border-secondary scale-110"
                          : "border-border hover:border-primary"
                      )}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div className="mb-6">
                <label className="text-sm font-medium text-primary mb-3 block">
                  Taille: {selectedSize || "Choisir une taille"}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "min-w-[48px] px-4 py-2 border rounded-lg font-medium transition-all",
                        selectedSize === size
                          ? "border-secondary bg-secondary text-secondary-foreground"
                          : "border-border hover:border-primary"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col gap-4 mb-8">
              {/* Error message if selection needed */}
              {showWarning && ((product.sizes.length > 1 && !selectedSize) ||
                (product.colors.length > 1 && !selectedColor)) && (
                  <div className="flex items-center gap-2 p-3 bg-accent/10 border border-accent/20 rounded-lg text-sm text-accent">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>
                      Veuillez sélectionner
                      {product.sizes.length > 1 && !selectedSize && " une taille"}
                      {product.sizes.length > 1 && !selectedSize && product.colors.length > 1 && !selectedColor && " et"}
                      {product.colors.length > 1 && !selectedColor && " une couleur"}
                    </span>
                  </div>
                )}

              <div className="flex flex-col sm:flex-row gap-4">
                {/* Quantity */}
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-3 hover:bg-muted transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-3 font-medium min-w-[48px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-4 py-3 hover:bg-muted transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 btn-secondary"
                >
                  Ajouter au panier
                </button>

                {/* Favorite */}
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={cn(
                    "p-3 border rounded-lg transition-all",
                    isFavorite
                      ? "border-accent bg-accent text-white"
                      : "border-border hover:border-accent hover:text-accent"
                  )}
                >
                  <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="border-t border-border pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-secondary" />
                <span className="text-sm">Livraison disponible partout en Afrique et Europe</span>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-secondary" />
                <span className="text-sm">Retours sous 30 jours</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-secondary" />
                <span className="text-sm">Paiement sécurisé</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {filteredRelated.length > 0 && (
          <section className="mt-20">
            <h2 className="font-montserrat text-2xl font-bold text-primary mb-8">
              Vous aimerez aussi
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredRelated.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
