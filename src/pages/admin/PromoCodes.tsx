import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Tag,
  Percent,
  DollarSign,
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface PromoCode {
  id: string;
  code: string;
  description: string | null;
  discount_type: string;
  discount_value: number;
  min_order_amount: number;
  max_uses: number | null;
  current_uses: number;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;
  created_at: string;
}

const defaultPromoCode: Partial<PromoCode> = {
  code: "",
  description: "",
  discount_type: "percentage",
  discount_value: 10,
  min_order_amount: 0,
  max_uses: null,
  is_active: true,
};

export default function PromoCodes() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<Partial<PromoCode> | null>(null);
  const [formData, setFormData] = useState<Partial<PromoCode>>(defaultPromoCode);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPromoCodes(data || []);
    } catch (error) {
      console.error("Error fetching promo codes:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les codes promo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const promoData = {
        code: formData.code?.toUpperCase(),
        description: formData.description,
        discount_type: formData.discount_type,
        discount_value: formData.discount_value,
        min_order_amount: formData.min_order_amount || 0,
        max_uses: formData.max_uses || null,
        valid_until: formData.valid_until || null,
        is_active: formData.is_active,
      };

      if (editingCode?.id) {
        const { error } = await supabase
          .from("promo_codes")
          .update(promoData)
          .eq("id", editingCode.id);

        if (error) throw error;
        toast({ title: "Code promo mis à jour" });
      } else {
        const { error } = await supabase.from("promo_codes").insert(promoData);
        if (error) throw error;
        toast({ title: "Code promo créé" });
      }

      setDialogOpen(false);
      setEditingCode(null);
      setFormData(defaultPromoCode);
      fetchPromoCodes();
    } catch (error: any) {
      console.error("Error saving promo code:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de sauvegarder le code promo",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce code promo ?")) return;

    try {
      const { error } = await supabase.from("promo_codes").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Code promo supprimé" });
      fetchPromoCodes();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le code promo",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (code: PromoCode) => {
    setEditingCode(code);
    setFormData(code);
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingCode(null);
    setFormData(defaultPromoCode);
    setDialogOpen(true);
  };

  const filteredCodes = promoCodes.filter((p) =>
    p.code.toLowerCase().includes(search.toLowerCase())
  );

  const isCodeExpired = (code: PromoCode) => {
    if (!code.valid_until) return false;
    return new Date(code.valid_until) < new Date();
  };

  const isCodeMaxedOut = (code: PromoCode) => {
    if (!code.max_uses) return false;
    return code.current_uses >= code.max_uses;
  };

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
            Codes Promo
          </h1>
          <p className="text-muted-foreground">
            Gérez vos codes promotionnels
          </p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="w-4 h-4" />
          Créer un code
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Promo Codes List */}
      {filteredCodes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Tag className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              {search ? "Aucun code trouvé" : "Aucun code promo pour le moment"}
            </p>
            {!search && (
              <Button onClick={openCreateDialog} className="mt-4">
                Créer votre premier code
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredCodes.map((code) => (
            <Card key={code.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  {code.discount_type === "percentage" ? (
                    <Percent className="w-6 h-6 text-secondary" />
                  ) : (
                    <DollarSign className="w-6 h-6 text-secondary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-foreground font-mono">
                      {code.code}
                    </h3>
                    {!code.is_active && (
                      <Badge variant="secondary">Inactif</Badge>
                    )}
                    {isCodeExpired(code) && (
                      <Badge variant="destructive">Expiré</Badge>
                    )}
                    {isCodeMaxedOut(code) && (
                      <Badge variant="outline">Limite atteinte</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {code.discount_type === "percentage"
                      ? `${code.discount_value}% de réduction`
                      : `${code.discount_value}€ de réduction`}
                    {code.min_order_amount > 0 && (
                      <span> • Min. {code.min_order_amount}€</span>
                    )}
                    {code.max_uses && (
                      <span> • {code.current_uses}/{code.max_uses} utilisations</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => openEditDialog(code)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(code.id)}
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

      {/* Promo Code Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingCode?.id ? "Modifier le code" : "Nouveau code promo"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="code">Code *</Label>
              <Input
                id="code"
                value={formData.code || ""}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value.toUpperCase() })
                }
                placeholder="SUMMER2025"
                className="font-mono"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Réduction été 2025"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type de réduction</Label>
                <Select
                  value={formData.discount_type}
                  onValueChange={(value: "percentage" | "fixed") =>
                    setFormData({ ...formData, discount_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Pourcentage (%)</SelectItem>
                    <SelectItem value="fixed">Montant fixe (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="discount_value">Valeur *</Label>
                <Input
                  id="discount_value"
                  type="number"
                  step="0.01"
                  value={formData.discount_value || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discount_value: parseFloat(e.target.value),
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min_order_amount">Commande minimum (€)</Label>
                <Input
                  id="min_order_amount"
                  type="number"
                  step="0.01"
                  value={formData.min_order_amount || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      min_order_amount: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="max_uses">Utilisations max</Label>
                <Input
                  id="max_uses"
                  type="number"
                  value={formData.max_uses || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_uses: e.target.value ? parseInt(e.target.value) : null,
                    })
                  }
                  placeholder="Illimité"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="valid_until">Date d'expiration</Label>
              <Input
                id="valid_until"
                type="datetime-local"
                value={
                  formData.valid_until
                    ? new Date(formData.valid_until).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    valid_until: e.target.value || null,
                  })
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                checked={formData.is_active ?? true}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
              <Label htmlFor="is_active" className="font-normal">
                Code actif
              </Label>
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
