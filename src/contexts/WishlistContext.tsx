import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  category: string;
}

interface WishlistContextType {
  wishlist: Product[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("wishlist")
        .select(`
          product_id,
          products (
            id,
            name,
            slug,
            price,
            images,
            category_id,
            categories (slug)
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;

      const products = data?.map((item: any) => ({
        id: item.products.id,
        name: item.products.name,
        slug: item.products.slug,
        price: item.products.price,
        images: item.products.images,
        category: item.products.categories?.slug || "",
      })) || [];

      setWishlist(products);
    } catch (error) {
      // Error fetching wishlist
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  const toggleWishlist = async (product: Product) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous pour ajouter des produits à vos favoris",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const inWishlist = isInWishlist(product.id);

      if (inWishlist) {
        // Remove from wishlist
        const { error } = await supabase
          .from("wishlist")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", product.id);

        if (error) throw error;

        setWishlist(wishlist.filter((item) => item.id !== product.id));
        toast({ title: "Retiré des favoris" });
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from("wishlist")
          .insert({
            user_id: user.id,
            product_id: product.id,
          });

        if (error) throw error;

        setWishlist([...wishlist, product]);
        toast({ title: "Ajouté aux favoris ❤️" });
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de modifier les favoris",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, isInWishlist, toggleWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
