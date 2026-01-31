import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";

interface DBProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  description: string | null;
  category_id: string | null;
  images: string[] | null;
  sizes: string[] | null;
  colors: unknown;
  stock: number | null;
  featured: boolean | null;
  new: boolean | null;
  rating: number | null;
  reviews_count: number | null;
  on_promotion: boolean | null;
  promotion_price: number | null;
  categories?: { slug: string; name: string } | null;
}

const transformProduct = (p: DBProduct): Product => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  price: p.on_promotion && p.promotion_price ? p.promotion_price : p.price,
  originalPrice: p.on_promotion && p.promotion_price ? p.price : p.original_price ?? undefined,
  description: p.description || "",
  category: p.categories?.slug || "",
  images: p.images || [],
  sizes: p.sizes || [],
  colors: Array.isArray(p.colors) ? p.colors as { name: string; hex: string }[] : [],
  stock: p.stock || 0,
  featured: p.featured || false,
  new: p.new || false,
  rating: p.rating || 0,
  reviews: p.reviews_count || 0,
  onPromotion: p.on_promotion || false,
});

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories:category_id(slug, name)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []).map(transformProduct);
    },
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories:category_id(slug, name)")
        .eq("featured", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []).map(transformProduct);
    },
  });
};

export const usePromotionProducts = () => {
  return useQuery({
    queryKey: ["products", "promotions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories:category_id(slug, name)")
        .eq("on_promotion", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []).map(transformProduct);
    },
  });
};

export const useProductsByCategory = (categorySlug: string) => {
  return useQuery({
    queryKey: ["products", "category", categorySlug],
    queryFn: async () => {
      // First get the category ID
      const { data: category } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .single();

      if (!category) return [];

      const { data, error } = await supabase
        .from("products")
        .select("*, categories:category_id(slug, name)")
        .eq("category_id", category.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []).map(transformProduct);
    },
    enabled: !!categorySlug,
  });
};

export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories:category_id(slug, name)")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return transformProduct(data);
    },
    enabled: !!slug,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      return data || [];
    },
  });
};

export const useShippingSettings = () => {
  return useQuery({
    queryKey: ["shipping-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shipping_settings")
        .select("*")
        .eq("is_active", true)
        .order("price");

      if (error) throw error;
      return data || [];
    },
  });
};
