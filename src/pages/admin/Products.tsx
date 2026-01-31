import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Package,
  X,
  Star,
  Flame,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/admin/ImageUpload";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price: number | null;
  promotion_price: number | null;
  category_id: string | null;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  stock: number;
  featured: boolean;
  new: boolean;
  on_promotion: boolean;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const defaultProduct: Partial<Product> = {
  name: "",
  slug: "",
  description: "",
  price: 0,
  original_price: null,
  promotion_price: null,
  category_id: null,
  images: [],
  sizes: [],
  colors: [],
  stock: 0,
  featured: false,
  new: false,
  on_promotion: false,
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>(defaultProduct);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      const transformedData = data?.map(p => ({
        ...p,
        colors: (Array.isArray(p.colors) ? p.colors : []) as { name: string; hex: string }[]
      })) || [];
      
      setProducts(transformedData);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les produits",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await supabase.from("categories").select("id, name, slug");
      setCategories(data || []);
    } catch (error) {
      // Error fetching categories
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const productData = {
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name || ""),
        description: formData.description,
        price: formData.price,
        original_price: formData.original_price,
        promotion_price: formData.on_promotion ? formData.promotion_price : null,
        category_id: formData.category_id,
        images: formData.images || [],
        sizes: formData.sizes || [],
        colors: formData.colors || [],
        stock: formData.stock,
        featured: formData.featured,
        new: formData.new,
        on_promotion: formData.on_promotion,
      };

      if (editingProduct?.id) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);

        if (error) throw error;
        toast({ title: "Produit mis à jour" });
      } else {
        const { error } = await supabase.from("products").insert(productData);
        if (error) throw error;
        toast({ title: "Produit créé" });
      }

      setDialogOpen(false);
      setEditingProduct(null);
      setFormData(defaultProduct);
      fetchProducts();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de sauvegarder le produit",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;

    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Produit supprimé" });
      fetchProducts();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le produit",
        variant: "destructive",
      });
    }
  };

  const toggleFeatured = async (product: Product) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ featured: !product.featured })
        .eq("id", product.id);
      
      if (error) throw error;
      toast({ title: product.featured ? "Retiré des vedettes" : "Ajouté aux vedettes" });
      fetchProducts();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le produit",
        variant: "destructive",
      });
    }
  };

  const togglePromotion = async (product: Product) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ on_promotion: !product.on_promotion })
        .eq("id", product.id);
      
      if (error) throw error;
      toast({ title: product.on_promotion ? "Retiré des promos" : "Ajouté aux promos" });
      fetchProducts();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le produit",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingProduct(null);
    setFormData(defaultProduct);
    setDialogOpen(true);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-montserrat text-2xl md:text-3xl font-bold text-foreground">
            Produits
          </h1>
          <p className="text-muted-foreground">
            Gérez votre catalogue de produits
          </p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="w-4 h-4" />
          Ajouter un produit
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              {search ? "Aucun produit trouvé" : "Aucun produit pour le moment"}
            </p>
            {!search && (
              <Button onClick={openCreateDialog} className="mt-4">
                Ajouter votre premier produit
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {product.price.toFixed(2)} € • Stock: {product.stock}
                  </p>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {product.featured && (
                      <span className="text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded">
                        Vedette
                      </span>
                    )}
                    {product.new && (
                      <span className="text-xs bg-highlight/20 text-highlight px-2 py-0.5 rounded">
                        Nouveau
                      </span>
                    )}
                    {product.on_promotion && (
                      <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded">
                        Promo
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleFeatured(product)}
                    className={product.featured ? "text-secondary" : ""}
                    title="Vedette"
                  >
                    <Star className={`w-4 h-4 ${product.featured ? "fill-secondary" : ""}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => togglePromotion(product)}
                    className={product.on_promotion ? "text-accent" : ""}
                    title="Promotion"
                  >
                    <Flame className={`w-4 h-4 ${product.on_promotion ? "fill-accent" : ""}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => openEditDialog(product)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(product.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Product Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct?.id ? "Modifier le produit" : "Nouveau produit"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Nom du produit *</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Prix (€) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseFloat(e.target.value) })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="original_price">Prix barré (€)</Label>
                <Input
                  id="original_price"
                  type="number"
                  step="0.01"
                  value={formData.original_price || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      original_price: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Select
                  value={formData.category_id || ""}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock || 0}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: parseInt(e.target.value) })
                  }
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              
              {/* Image Upload */}
              <div className="col-span-2">
                <Label>Images du produit</Label>
                <ImageUpload
                  images={formData.images || []}
                  onImagesChange={(images) => setFormData({ ...formData, images })}
                  maxImages={5}
                />
              </div>

              <div>
                <Label htmlFor="sizes">Tailles (séparées par virgule)</Label>
                <Input
                  id="sizes"
                  value={formData.sizes?.join(", ") || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sizes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="XS, S, M, L, XL"
                />
              </div>
              <div>
                <Label>Options</Label>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="featured"
                      checked={formData.featured || false}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, featured: checked })
                      }
                    />
                    <Label htmlFor="featured" className="font-normal">
                      Vedette
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="new"
                      checked={formData.new || false}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, new: checked })
                      }
                    />
                    <Label htmlFor="new" className="font-normal">
                      Nouveau
                    </Label>
                  </div>
                </div>
              </div>

              {/* Promotion Section */}
              <div className="col-span-2 border-t pt-4">
                <div className="flex items-center gap-2 mb-4">
                  <Switch
                    id="on_promotion"
                    checked={formData.on_promotion || false}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, on_promotion: checked })
                    }
                  />
                  <Label htmlFor="on_promotion" className="font-semibold flex items-center gap-2">
                    <Flame className="w-4 h-4 text-accent" />
                    En promotion
                  </Label>
                </div>
                {formData.on_promotion && (
                  <div>
                    <Label htmlFor="promotion_price">Prix promo (€) *</Label>
                    <Input
                      id="promotion_price"
                      type="number"
                      step="0.01"
                      value={formData.promotion_price || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          promotion_price: parseFloat(e.target.value),
                        })
                      }
                      placeholder="Prix réduit"
                      required={formData.on_promotion}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
