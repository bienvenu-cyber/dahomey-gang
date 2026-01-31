import { Link } from "react-router-dom";
import { ArrowRight, Truck, Shield, RefreshCw, Star } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { categories, products } from "@/data/products";
import { getFeaturedProducts } from "@/data/products";
import ProductCard from "@/components/products/ProductCard";
import CollectionSection from "@/components/home/CollectionSection";

const features = [
  {
    icon: Truck,
    title: "Livraison Gratuite",
    description: "Dès 100€ d'achat",
  },
  {
    icon: Shield,
    title: "Paiement Sécurisé",
    description: "100% sécurisé",
  },
  {
    icon: RefreshCw,
    title: "Retours Gratuits",
    description: "Sous 30 jours",
  },
];

const instagramPosts = [
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400",
  "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=400",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400",
  "https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=400",
];

// Get products by category slug
const getProductsByCategory = (slug: string) => 
  products.filter((p) => p.category === slug);

export default function Home() {
  const featuredProducts = getFeaturedProducts();

  // Collection data with descriptions
  const collectionsData = [
    {
      slug: "t-shirts",
      name: "T-Shirts",
      description: "T-shirts premium en coton avec designs uniques inspirés du Dahomey",
      variant: "grid" as const,
      bgClass: "bg-background",
    },
    {
      slug: "hoodies",
      name: "Hoodies",
      description: "Hoodies oversized ultra-confortables avec broderies royales",
      variant: "carousel" as const,
      bgClass: "bg-muted/50",
    },
    {
      slug: "pantalons",
      name: "Pantalons",
      description: "Pantalons cargo et joggers pour un style streetwear authentique",
      variant: "grid" as const,
      bgClass: "bg-background",
    },
    {
      slug: "accessoires",
      name: "Accessoires",
      description: "Casquettes, sacs et accessoires pour compléter votre look",
      variant: "carousel" as const,
      bgClass: "bg-muted/50",
    },
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="overlay-dark" />
        
        <div className="container-custom relative z-10 pt-24">
          <div className="max-w-2xl animate-fade-up">
            <span className="inline-block px-4 py-2 bg-secondary/20 text-secondary rounded-full text-sm font-semibold mb-6">
              Nouvelle Collection 2025
            </span>
            <h1 className="font-montserrat text-5xl md:text-7xl font-black text-white leading-tight mb-6">
              L'Héritage du{" "}
              <span className="text-gradient">Dahomey</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-lg">
              Streetwear premium inspiré des guerriers amazones. 
              Chaque pièce raconte une histoire de force et d'authenticité.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop" className="btn-secondary inline-flex items-center gap-2">
                Explorer la boutique
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/#about" className="btn-outline">
                Notre histoire
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-secondary rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-primary py-6">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex items-center gap-4 justify-center py-4"
              >
                <feature.icon className="w-8 h-8 text-secondary" />
                <div>
                  <h4 className="font-semibold text-white">{feature.title}</h4>
                  <p className="text-white/60 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Overview */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-montserrat text-3xl md:text-4xl font-bold text-primary mb-4">
              Nos Collections
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Découvrez nos catégories de vêtements et accessoires inspirés de l'héritage africain
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/collection/${category.slug}`}
                className="group relative aspect-[3/4] rounded-xl overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-montserrat text-xl font-bold text-white mb-2">
                    {category.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-secondary text-sm font-medium group-hover:gap-2 transition-all">
                    Découvrir
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-muted/50">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="font-montserrat text-3xl md:text-4xl font-bold text-primary mb-4">
                Produits Vedettes
              </h2>
              <p className="text-muted-foreground max-w-md">
                Les pièces les plus populaires de notre collection
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-secondary transition-colors"
            >
              Voir tout
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Collection Sections */}
      {collectionsData.map((collection) => (
        <CollectionSection
          key={collection.slug}
          title={collection.name}
          slug={collection.slug}
          description={collection.description}
          products={getProductsByCategory(collection.slug)}
          variant={collection.variant}
          bgClass={collection.bgClass}
        />
      ))}

      {/* About Section */}
      <section id="about" className="py-20 bg-primary">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <span className="inline-block px-4 py-2 bg-secondary/20 text-secondary rounded-full text-sm font-semibold mb-6">
                Notre Histoire
              </span>
              <h2 className="font-montserrat text-3xl md:text-4xl font-bold text-white mb-6">
                L'Esprit du <span className="text-secondary">Dahomey</span>
              </h2>
              <p className="text-white/70 mb-6 leading-relaxed">
                Dahomey-Gang est né d'une passion pour l'histoire et la culture du 
                Royaume du Dahomey. Nos créations s'inspirent des légendaires Amazones 
                du Dahomey, ces guerrières intrépides qui ont marqué l'histoire africaine.
              </p>
              <p className="text-white/70 mb-8 leading-relaxed">
                Chaque pièce est conçue avec soin, alliant qualité premium et designs 
                uniques qui célèbrent notre héritage tout en embrassant le streetwear contemporain.
              </p>
              <div className="flex items-center gap-8">
                <div>
                  <span className="font-montserrat text-4xl font-bold text-secondary">
                    500+
                  </span>
                  <p className="text-white/60 text-sm">Clients satisfaits</p>
                </div>
                <div>
                  <span className="font-montserrat text-4xl font-bold text-secondary">
                    50+
                  </span>
                  <p className="text-white/60 text-sm">Designs uniques</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-6 h-6 fill-secondary text-secondary" />
                  <span className="font-montserrat text-4xl font-bold text-secondary">
                    4.9
                  </span>
                  <p className="text-white/60 text-sm ml-1">Avis</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800"
                    alt="Dahomey-Gang Style"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary rounded-xl flex items-center justify-center">
                  <span className="font-montserrat text-2xl font-black text-secondary-foreground text-center leading-tight">
                    EST.<br />2024
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-montserrat text-3xl md:text-4xl font-bold text-primary mb-4">
              @dahomey.gang
            </h2>
            <p className="text-muted-foreground">
              Suivez-nous sur Instagram pour les dernières tendances
            </p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4">
            {instagramPosts.map((post, index) => (
              <a
                key={index}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square overflow-hidden rounded-lg group"
              >
                <img
                  src={post}
                  alt={`Instagram post ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-primary via-primary to-accent">
        <div className="container-custom text-center">
          <h2 className="font-montserrat text-3xl md:text-4xl font-bold text-white mb-4">
            Rejoignez le <span className="text-secondary">Gang</span>
          </h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            Inscrivez-vous pour recevoir 10% de réduction sur votre première commande
          </p>
          <Link to="/shop" className="btn-secondary">
            Commander maintenant
          </Link>
        </div>
      </section>
    </main>
  );
}
