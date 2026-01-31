import { useState } from "react";
import { Save, Store, Truck, CreditCard, Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [storeSettings, setStoreSettings] = useState({
    name: "Dahomey-Gang",
    email: "contact@dahomey-gang.com",
    phone: "+33 1 23 45 67 89",
    address: "123 Rue du Commerce",
    city: "Paris",
    postalCode: "75001",
    country: "France",
    description: "Streetwear premium inspiré du Royaume du Dahomey",
  });

  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: 100,
    standardShippingCost: 5.99,
    expressShippingCost: 12.99,
    enableFreeShipping: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    orderConfirmation: true,
    orderShipped: true,
    orderDelivered: true,
    lowStockAlert: true,
    newCustomer: false,
  });

  const handleSave = async () => {
    setSaving(true);
    // Simulate saving
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({ title: "Paramètres enregistrés" });
    setSaving(false);
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
          <Save className="w-4 h-4" />
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
                  <Label htmlFor="storePostal">Code postal</Label>
                  <Input
                    id="storePostal"
                    value={storeSettings.postalCode}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, postalCode: e.target.value })
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
              <CardTitle>Paramètres de livraison</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <h4 className="font-medium">Livraison gratuite</h4>
                  <p className="text-sm text-muted-foreground">
                    Activer la livraison gratuite au-dessus d'un certain montant
                  </p>
                </div>
                <Switch
                  checked={shippingSettings.enableFreeShipping}
                  onCheckedChange={(checked) =>
                    setShippingSettings({
                      ...shippingSettings,
                      enableFreeShipping: checked,
                    })
                  }
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="freeThreshold">Seuil livraison gratuite (€)</Label>
                  <Input
                    id="freeThreshold"
                    type="number"
                    value={shippingSettings.freeShippingThreshold}
                    onChange={(e) =>
                      setShippingSettings({
                        ...shippingSettings,
                        freeShippingThreshold: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="standardShipping">Livraison standard (€)</Label>
                  <Input
                    id="standardShipping"
                    type="number"
                    step="0.01"
                    value={shippingSettings.standardShippingCost}
                    onChange={(e) =>
                      setShippingSettings({
                        ...shippingSettings,
                        standardShippingCost: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="expressShipping">Livraison express (€)</Label>
                  <Input
                    id="expressShipping"
                    type="number"
                    step="0.01"
                    value={shippingSettings.expressShippingCost}
                    onChange={(e) =>
                      setShippingSettings({
                        ...shippingSettings,
                        expressShippingCost: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
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
