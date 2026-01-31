import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Flame } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "@/components/products/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface PromotionProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  promotion_price: number | null;
  images: string[];
  featured: boolean;
  new: boolean;
  on_promotion: boolean;
  category_id: string | null;
}

export default function PromotionCarousel() {
  const [products, setProducts] = useState<PromotionProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromotionProducts();
  }, []);

  const fetchPromotionProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("on_promotion", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching promotion products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || products.length === 0) {
    return null;
  }

  // Transform to format expected by ProductCard
  const transformedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.promotion_price || p.price,
    originalPrice: p.on_promotion ? p.price : p.original_price || undefined,
    description: "",
    category: "",
    images: p.images || [],
    sizes: [],
    colors: [],
    stock: 0,
    featured: p.featured || false,
    new: p.new || false,
    rating: 0,
    reviews: 0,
  }));

  return (
    <section className="py-20 bg-gradient-to-br from-accent/10 via-background to-secondary/10">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-6 h-6 text-accent animate-pulse" />
              <span className="inline-block px-4 py-1 bg-accent/20 text-accent rounded-full text-sm font-semibold">
                Promotions
              </span>
            </div>
            <h2 className="font-montserrat text-3xl md:text-4xl font-bold text-primary mb-4">
              Offres Spéciales
            </h2>
            <p className="text-muted-foreground max-w-md">
              Profitez de nos réductions exceptionnelles sur une sélection de produits
            </p>
          </div>
          <Link
            to="/shop?promo=true"
            className="inline-flex items-center gap-2 text-accent font-semibold hover:text-accent/80 transition-colors"
          >
            Voir toutes les promos
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {transformedProducts.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <div className="relative">
                  <div className="absolute -top-2 -right-2 z-10 bg-accent text-white text-xs font-bold px-2 py-1 rounded-full">
                    PROMO
                  </div>
                  <ProductCard product={product} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4" />
          <CarouselNext className="hidden md:flex -right-4" />
        </Carousel>
      </div>
    </section>
  );
}
