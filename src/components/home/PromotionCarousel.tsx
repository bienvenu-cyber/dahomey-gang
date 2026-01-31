import { Link } from "react-router-dom";
import { ArrowRight, Flame, Loader2 } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { usePromotionProducts } from "@/hooks/useProducts";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function PromotionCarousel() {
  const { data: products = [], isLoading } = usePromotionProducts();

  // Don't render if no products on promotion
  if (!isLoading && products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-accent/10 via-background to-secondary/10">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <Flame className="w-6 h-6 text-accent animate-pulse" />
            <h2 className="font-montserrat text-2xl md:text-3xl font-bold text-primary">
              Promotions
            </h2>
          </div>
          <Link
            to="/shop?promo=true"
            className="inline-flex items-center gap-2 text-accent font-semibold hover:text-accent/80 transition-colors text-sm md:text-base"
          >
            <span className="hidden sm:inline">Voir tout</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {products.map((product) => (
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
        )}
      </div>
    </section>
  );
}
