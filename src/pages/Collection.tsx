import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { useProductsByCategory, useCategories } from "@/hooks/useProducts";

export default function Collection() {
  const { slug } = useParams<{ slug: string }>();
  const { data: categories = [] } = useCategories();
  const { data: products = [], isLoading } = useProductsByCategory(slug || "");
  
  const category = categories.find((c) => c.slug === slug);

  if (!category && !isLoading) {
    return (
      <main className="min-h-screen pt-24 pb-16">
        <div className="container-custom text-center">
          <h1 className="text-3xl font-bold text-primary mb-4">
            Collection introuvable
          </h1>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-secondary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la boutique
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={category?.image_url || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"}
          alt={category?.name || "Collection"}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-montserrat text-4xl md:text-5xl font-black text-white mb-2">
              {category?.name || "Collection"}
            </h1>
            <p className="text-white/80 text-lg">
              {products.length} produit{products.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="bg-muted/50 py-4">
        <div className="container-custom">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary">
              Accueil
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/shop" className="text-muted-foreground hover:text-primary">
              Boutique
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-primary font-medium">{category?.name}</span>
          </nav>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container-custom">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">
                Aucun produit dans cette collection pour le moment.
              </p>
              <Link to="/shop" className="btn-secondary">
                Voir tous les produits
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
