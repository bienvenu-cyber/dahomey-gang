import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star, Loader2 } from "lucide-react";
import { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const { isInWishlist, toggleWishlist, loading: wishlistLoading } = useWishlist();
  const { toast } = useToast();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    // Add with first available size and color
    addItem(product, product.sizes[0], product.colors[0].name);
    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(product);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link
      to={`/product/${product.slug}`}
      className="card-product block group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        {/* Blur placeholder */}
        <div
          className={cn(
            "absolute inset-0 bg-muted transition-opacity duration-500",
            isImageLoaded ? "opacity-0" : "opacity-100"
          )}
        />
        
        {/* Main image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className={cn(
            "w-full h-full object-cover transition-all duration-500",
            isImageLoaded ? "animate-blur-load" : "opacity-0",
            isHovered && product.images[1] ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => setIsImageLoaded(true)}
          loading="lazy"
        />

        {/* Hover image */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} - Vue 2`}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
              isHovered ? "opacity-100" : "opacity-0"
            )}
            loading="lazy"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.new && (
            <span className="px-2 py-1 bg-highlight text-white text-xs font-bold uppercase rounded">
              Nouveau
            </span>
          )}
          {discount > 0 && (
            <span className="px-2 py-1 bg-accent text-white text-xs font-bold rounded">
              -{discount}%
            </span>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={handleFavorite}
          disabled={wishlistLoading}
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full transition-all duration-300",
            isInWishlist(product.id)
              ? "bg-accent text-white"
              : "bg-white/80 text-primary hover:bg-accent hover:text-white",
            wishlistLoading && "opacity-50 cursor-not-allowed"
          )}
          aria-label={isInWishlist(product.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart className={cn("w-4 h-4", isInWishlist(product.id) && "fill-current")} />
        </button>

        {/* Quick add button */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent",
            "translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          )}
        >
          <button
            onClick={handleQuickAdd}
            disabled={isAdding}
            className="w-full bg-secondary text-secondary-foreground py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-secondary/90 transition-colors disabled:opacity-50"
          >
            {isAdding ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Ajouté !
              </>
            ) : (
              <>
                  <ShoppingBag className="w-4 h-4" />
                  Ajouter au panier
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 fill-secondary text-secondary" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-sm text-muted-foreground">({product.reviews})</span>
        </div>

        <h3 className="font-semibold text-primary mb-1 line-clamp-1">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-montserrat font-bold text-lg text-primary">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-muted-foreground line-through text-sm">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Colors */}
        <div className="flex gap-1 mt-3">
          {product.colors.map((color) => (
            <span
              key={color.name}
              className="w-4 h-4 rounded-full border border-border"
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
      </div>
    </Link>
  );
}
