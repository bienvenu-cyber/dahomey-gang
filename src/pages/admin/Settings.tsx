import { useState, useEffect } from "react";
import { Save, Store, Truck, Bell, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ShippingOption {
  id: string;
  name: string;
  description: string | null;
  price: number;
  delivery_days_min: number;
  delivery_days_max: number;
  free_threshold: number | null;
  is_active: boolean;
}

export default function Settings() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [storeSettings, setStoreSettings] = useState({
    name: "Dahomey-Gang",
    email: "contact@dahomey-gang.com",
    phone: "+229 XX XX XX XX",
    address: "Cotonou",
    city: "Cotonou",
    postalCode: "",
    country: "Bénin",
    description: "Streetwear premium inspiré du Royaume du Dahomey",
  });

  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);

  const [notificationSettings, setNotificationSettings] = useState({
    orderConfirmation: true,
    orderShipped: true,
    orderDelivered: true,
    lowStockAlert: true,
    newCustomer: false,
  });

  useEffect(() => {
    fetchShippingSettings();
  }, []);

  const fetchShippingSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("shipping_settings")
        .select("*")
        .order("price");

      if (error) throw error;
      setShippingOptions(data || []);
    } catch (error) {
      console.error("Error fetching shipping settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShippingChange = (id: string, field: keyof ShippingOption, value: string | number | boolean) => {
    setShippingOptions((prev) =>
      prev.map((option) =>
        option.id === id ? { ...option, [field]: value } : option
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save shipping settings
      for (const option of shippingOptions) {
        const { error } = await supabase
          .from("shipping_settings")
          .update({
            name: option.name,
            description: option.description,
            price: option.price,
            delivery_days_min: option.delivery_days_min,
            delivery_days_max: option.delivery_days_max,
            free_threshold: option.free_threshold,
            is_active: option.is_active,
          })
          .eq("id", option.id);

        if (error) throw error;
      }

      toast({ title: "Paramètres enregistrés" });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({ title: "Erreur lors de l'enregistrement", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-montserrat text-2xl md:text-3xl font-bold text-primary">
            Paramètres
          </h1>
          <p className="text-muted-foreground">
            Configurez votre boutique
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>

      <Tabs defaultValue="store" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="store" className="gap-2">
            <Store className="w-4 h-4 hidden sm:block" />
            Boutique
          </TabsTrigger>
          <TabsTrigger value="shipping" className="gap-2">
            <Truck className="w-4 h-4 hidden sm:block" />
            Livraison
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4 hidden sm:block" />
            Notifs
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4 hidden sm:block" />
            Sécurité
          </TabsTrigger>
        </TabsList>

        {/* Store Settings */}
        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle>Informations de la boutique</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="storeName">Nom de la boutique</Label>
                  <Input
                    id="storeName"
                    value={storeSettings.name}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="storeEmail">Email</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={storeSettings.email}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="storePhone">Téléphone</Label>
                  <Input
                    id="storePhone"
                    value={storeSettings.phone}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="storeAddress">Adresse</Label>
                  <Input
                    id="storeAddress"
                    value={storeSettings.address}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, address: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="storeCity">Ville</Label>
                  <Input
                    id="storeCity"
                    value={storeSettings.city}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, city: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="storeCountry">Pays</Label>
                  <Input
                    id="storeCountry"
                    value={storeSettings.country}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, country: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="storeDescription">Description</Label>
                <Textarea
                  id="storeDescription"
                  value={storeSettings.description}
                  onChange={(e) =>
                    setStoreSettings({ ...storeSettings, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle>Options de livraison</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                shippingOptions.map((option) => (
                  <div key={option.id} className="p-4 bg-muted rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{option.name}</h4>
                      <Switch
                        checked={option.is_active}
                        onCheckedChange={(checked) =>
                          handleShippingChange(option.id, "is_active", checked)
                        }
                      />
                    </div>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div>
                        <Label>Nom</Label>
                        <Input
                          value={option.name}
                          onChange={(e) =>
                            handleShippingChange(option.id, "name", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label>Prix (€)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={option.price}
                          onChange={(e) =>
                            handleShippingChange(option.id, "price", parseFloat(e.target.value))
                          }
                        />
                      </div>
                      <div>
                        <Label>Seuil gratuit (€)</Label>
                        <Input
                          type="number"
                          value={option.free_threshold || ""}
                          onChange={(e) =>
                            handleShippingChange(
                              option.id,
                              "free_threshold",
                              e.target.value ? parseFloat(e.target.value) : null as unknown as number
                            )
                          }
                          placeholder="Pas de seuil"
                        />
                      </div>
                      <div>
                        <Label>Délai (jours)</Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={option.delivery_days_min}
                            onChange={(e) =>
                              handleShippingChange(option.id, "delivery_days_min", parseInt(e.target.value))
                            }
                            placeholder="Min"
                          />
                          <Input
                            type="number"
                            value={option.delivery_days_max}
                            onChange={(e) =>
                              handleShippingChange(option.id, "delivery_days_max", parseInt(e.target.value))
                            }
                            placeholder="Max"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  key: "orderConfirmation",
                  label: "Confirmation de commande",
                  desc: "Envoyer un email lors d'une nouvelle commande",
                },
                {
                  key: "orderShipped",
                  label: "Commande expédiée",
                  desc: "Notifier le client quand sa commande est expédiée",
                },
                {
                  key: "orderDelivered",
                  label: "Commande livrée",
                  desc: "Notifier le client quand sa commande est livrée",
                },
                {
                  key: "lowStockAlert",
                  label: "Alerte stock bas",
                  desc: "Recevoir une alerte quand un produit est en rupture",
                },
                {
                  key: "newCustomer",
                  label: "Nouveau client",
                  desc: "Recevoir une notification pour chaque inscription",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{item.label}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={
                      notificationSettings[
                        item.key as keyof typeof notificationSettings
                      ]
                    }
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        [item.key]: checked,
                      })
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Authentification</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  L'authentification est gérée par Supabase Auth. Les mots de passe 
                  sont hashés et sécurisés automatiquement.
                </p>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Shield className="w-4 h-4" />
                  Authentification sécurisée activée
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Rôles et permissions</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Les rôles admin sont gérés dans la table user_roles avec des 
                  politiques RLS pour sécuriser l'accès aux données.
                </p>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Shield className="w-4 h-4" />
                  Row Level Security activée
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
