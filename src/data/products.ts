import { Product, Category } from "@/types/product";

export const categories: Category[] = [
  {
    id: "1",
    name: "T-Shirts",
    slug: "t-shirts",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
  },
  {
    id: "2",
    name: "Hoodies",
    slug: "hoodies",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600",
  },
  {
    id: "3",
    name: "Pantalons",
    slug: "pantalons",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600",
  },
  {
    id: "4",
    name: "Accessoires",
    slug: "accessoires",
    image: "https://images.unsplash.com/photo-1523779105320-d1cd346ff52b?w=600",
  },
];

export const products: Product[] = [
  {
    id: "1",
    name: "T-Shirt Dahomey Classic",
    slug: "t-shirt-dahomey-classic",
    price: 45,
    originalPrice: 55,
    description: "T-shirt en coton premium avec le logo emblématique Dahomey-Gang brodé. Coupe moderne et confortable pour un style urbain authentique.",
    category: "t-shirts",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Noir", hex: "#111827" },
      { name: "Blanc", hex: "#F8FAFC" },
      { name: "Navy", hex: "#0A1A2F" },
    ],
    stock: 50,
    featured: true,
    new: false,
    rating: 4.8,
    reviews: 124,
  },
  {
    id: "2",
    name: "Hoodie Royaume",
    slug: "hoodie-royaume",
    price: 89,
    description: "Hoodie oversized avec imprimé royal inspiré du Royaume du Dahomey. Intérieur molletonné ultra-doux.",
    category: "hoodies",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Noir", hex: "#111827" },
      { name: "Or", hex: "#FFD700" },
    ],
    stock: 35,
    featured: true,
    new: true,
    rating: 4.9,
    reviews: 89,
  },
  {
    id: "3",
    name: "Pantalon Cargo Heritage",
    slug: "pantalon-cargo-heritage",
    price: 75,
    description: "Pantalon cargo avec poches multiples et détails dorés. Coupe ajustée moderne.",
    category: "pantalons",
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800",
    ],
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: [
      { name: "Noir", hex: "#111827" },
      { name: "Kaki", hex: "#6B7280" },
    ],
    stock: 40,
    featured: false,
    new: true,
    rating: 4.7,
    reviews: 56,
  },
  {
    id: "4",
    name: "Casquette Amazone",
    slug: "casquette-amazone",
    price: 35,
    description: "Casquette snapback avec broderie dorée. Ajustable, taille unique.",
    category: "accessoires",
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800",
      "https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=800",
    ],
    sizes: ["Unique"],
    colors: [
      { name: "Noir", hex: "#111827" },
      { name: "Navy", hex: "#0A1A2F" },
    ],
    stock: 100,
    featured: true,
    new: false,
    rating: 4.6,
    reviews: 78,
  },
  {
    id: "5",
    name: "T-Shirt Warrior",
    slug: "t-shirt-warrior",
    price: 49,
    description: "T-shirt avec imprimé guerrier Dahomey. Coton bio, sérigraphie premium.",
    category: "t-shirts",
    images: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800",
      "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Noir", hex: "#111827" },
      { name: "Bordeaux", hex: "#A4161A" },
    ],
    stock: 45,
    featured: false,
    new: true,
    rating: 4.8,
    reviews: 34,
  },
  {
    id: "6",
    name: "Hoodie Gold Edition",
    slug: "hoodie-gold-edition",
    price: 110,
    originalPrice: 130,
    description: "Édition limitée avec broderies dorées sur tout le design. Pièce collector.",
    category: "hoodies",
    images: [
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800",
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Noir/Or", hex: "#111827" },
    ],
    stock: 15,
    featured: true,
    new: false,
    rating: 5.0,
    reviews: 45,
  },
  {
    id: "7",
    name: "Sac Banane Royal",
    slug: "sac-banane-royal",
    price: 55,
    description: "Sac banane en cuir synthétique avec fermoirs dorés et logo embossé.",
    category: "accessoires",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
    ],
    sizes: ["Unique"],
    colors: [
      { name: "Noir", hex: "#111827" },
      { name: "Marron", hex: "#78350F" },
    ],
    stock: 60,
    featured: false,
    new: false,
    rating: 4.5,
    reviews: 67,
  },
  {
    id: "8",
    name: "Jogger Confort",
    slug: "jogger-confort",
    price: 65,
    description: "Jogger en molleton avec bandes latérales dorées. Parfait pour le streetwear.",
    category: "pantalons",
    images: [
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Noir", hex: "#111827" },
      { name: "Gris", hex: "#6B7280" },
    ],
    stock: 55,
    featured: true,
    new: true,
    rating: 4.7,
    reviews: 92,
  },
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find((p) => p.slug === slug);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter((p) => p.category === category);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter((p) => p.featured);
};

export const getNewProducts = (): Product[] => {
  return products.filter((p) => p.new);
};
