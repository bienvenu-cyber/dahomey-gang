import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/types/product";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface CollectionSectionProps {
  title: string;
  slug: string;
  description: string;
  products: Product[];
  variant?: "grid" | "carousel";
  bgClass?: string;
}

export default function CollectionSection({
  title,
  slug,
  description,
  products,
  variant = "grid",
  bgClass = "bg-background",
}: CollectionSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className={`py-16 ${bgClass}`}>
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="font-montserrat text-2xl md:text-3xl font-bold text-primary mb-2">
              {title}
            </h2>
            <p className="text-muted-foreground max-w-md">{description}</p>
          </div>
          <Link
            to={`/collection/${slug}`}
            className="inline-flex items-center gap-2 text-primary font-semibold hover:text-secondary transition-colors"
          >
            Voir la collection
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {variant === "carousel" ? (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {products.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4" />
            <CarouselNext className="hidden md:flex -right-4" />
          </Carousel>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
