import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  FolderOpen,
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

const defaultCategory: Partial<Category> = {
  name: "",
  slug: "",
  description: "",
};

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [formData, setFormData] = useState<Partial<Category>>(defaultCategory);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
    
    if (!formData.name?.trim()) {
      toast({ title: "Erreur", description: "Le nom est requis", variant: "destructive" });
      return;
    }

    setSaving(true);

    try {
      const slug = formData.slug || generateSlug(formData.name || "");
      
      // Vérifier unicité du slug
      if (!editingCategory?.id || slug !== editingCategory.slug) {
        const { data: existing } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", slug)
          .maybeSingle();
        
        if (existing) {
          toast({ title: "Erreur", description: "Ce slug existe déjà", variant: "destructive" });
          setSaving(false);
          return;
        }
      }

      const categoryData = {
        name: formData.name,
        slug,
        description: formData.description,
      };

      if (editingCategory?.id) {
        const { error } = await supabase
          .from("categories")
          .update(categoryData)
          .eq("id", editingCategory.id);

        if (error) throw error;
        toast({ title: "Catégorie mise à jour" });
      } else {
        const { error } = await supabase.from("categories").insert(categoryData);
        if (error) throw error;
        toast({ title: "Catégorie créée" });
      }

      setDialogOpen(false);
      setEditingCategory(null);
      setFormData(defaultCategory);
      fetchCategories();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de sauvegarder la catégorie",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) return;

    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Catégorie supprimée" });
      fetchCategories();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la catégorie",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData(category);
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingCategory(null);
    setFormData(defaultCategory);
    setDialogOpen(true);
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
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
            Catégories
          </h1>
          <p className="text-muted-foreground">
            Gérez les catégories de produits
          </p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="w-4 h-4" />
          Ajouter une catégorie
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher une catégorie..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FolderOpen className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              {search ? "Aucune catégorie trouvée" : "Aucune catégorie pour le moment"}
            </p>
            {!search && (
              <Button onClick={openCreateDialog} className="mt-4">
                Ajouter votre première catégorie
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category) => (
            <Card key={category.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground font-mono">
                      /{category.slug}
                    </p>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditDialog(category)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(category.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Category Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingCategory?.id ? "Modifier la catégorie" : "Nouvelle catégorie"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nom *</Label>
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
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug || ""}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="Généré automatiquement"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Laissez vide pour générer automatiquement
              </p>
            </div>

            <div>
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
