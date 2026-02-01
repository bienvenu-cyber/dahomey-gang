import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Package, MapPin, Mail, Phone, LogOut, Loader2, Heart, Trash2, Globe, Eye, X, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import CurrencySelector from "@/components/CurrencySelector";
import SEO from "@/components/SEO";

interface Profile {
  full_name: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
}

interface OrderDetails extends Order {
  items: {
    product_name: string;
    product_image: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
  }[];
  shipping_address: string;
  shipping_city: string;
  shipping_country: string;
  payment_method: string;
  tracking_number?: string;
}

const COUNTRIES = [
  "France", "Bénin", "Togo", "Côte d'Ivoire", "Sénégal", "Burkina Faso", "Mali", "Niger",
  "Belgique", "Suisse", "Luxembourg", "Allemagne", "Angleterre"
];

export default function Profile() {
  const { user, signOut } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { formatPrice } = useCurrency();
  
  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    country: "Bénin",
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "wishlist">("profile");
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchProfile();
    fetchOrders();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setProfile({
          full_name: data.full_name || "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          postal_code: data.postal_code || "",
          country: data.country || "Bénin",
        });
      }
    } catch (error) {
      // Error fetching profile
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("id, order_number, status, total, created_at")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      // Error fetching orders
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update(profile)
        .eq("user_id", user?.id);

      if (error) throw error;

      toast({ title: "Profil mis à jour !" });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const fetchOrderDetails = async (orderId: string) => {
    setLoadingOrderDetails(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            product_name,
            product_image,
            size,
            color,
            quantity,
            price
          )
        `)
        .eq("id", orderId)
        .single();

      if (error) throw error;

      setSelectedOrder({
        id: data.id,
        order_number: data.order_number,
        status: data.status,
        total: data.total,
        created_at: data.created_at,
        items: data.order_items || [],
        shipping_address: data.shipping_address || "",
        shipping_city: data.shipping_city || "",
        shipping_country: data.shipping_country || "",
        payment_method: data.payment_method || "",
        tracking_number: data.tracking_number,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails",
        variant: "destructive",
      });
    } finally {
      setLoadingOrderDetails(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive",
      });
      return;
    }

    setChangingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) throw error;

      toast({ title: "Mot de passe modifié ! 🔒" });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de changer le mot de passe",
        variant: "destructive",
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    const labels: Record<string, string> = {
      pending: "En attente",
      confirmed: "Confirmée",
      processing: "En cours",
      shipped: "Expédiée",
      delivered: "Livrée",
      cancelled: "Annulée",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="pt-24 pb-20 min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <main className="pt-24 pb-20 min-h-screen bg-background">
      <SEO
        title="Mon Compte | Dahomey-Gang"
        description="Gérez votre profil et vos commandes Dahomey-Gang"
      />

      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-montserrat text-3xl font-bold text-primary mb-2">
                Mon Compte
              </h1>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b">
            <button
              onClick={() => setActiveTab("profile")}
              className={`pb-3 px-4 font-medium transition-colors ${
                activeTab === "profile"
                  ? "text-primary border-b-2 border-secondary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Profil
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`pb-3 px-4 font-medium transition-colors ${
                activeTab === "orders"
                  ? "text-primary border-b-2 border-secondary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Package className="w-4 h-4 inline mr-2" />
              Commandes ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab("wishlist")}
              className={`pb-3 px-4 font-medium transition-colors ${activeTab === "wishlist"
                ? "text-primary border-b-2 border-secondary"
                : "text-muted-foreground hover:text-primary"
                }`}
            >
              <Heart className="w-4 h-4 inline mr-2" />
              Favoris ({wishlist.length})
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <form onSubmit={handleSaveProfile} className="bg-white rounded-xl p-6 md:p-8 shadow-sm space-y-6">
              {/* Currency Selector */}
              <div className="pb-6 border-b">
                <label className="block text-sm font-medium text-primary mb-3">
                  <Globe className="w-4 h-4 inline mr-1" />
                  Devise préférée
                </label>
                <CurrencySelector />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  placeholder="Jean Dupont"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full px-4 py-3 border border-border rounded-lg bg-muted cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50"
                    placeholder="+229 XX XX XX XX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Adresse
                </label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  placeholder="Rue et numéro"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Ville
                  </label>
                  <input
                    type="text"
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Code postal
                  </label>
                  <input
                    type="text"
                    value={profile.postal_code}
                    onChange={(e) => setProfile({ ...profile, postal_code: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Pays
                  </label>
                  <select
                    value={profile.country}
                    onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  >
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn-secondary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  "Enregistrer les modifications"
                )}
              </button>

              {/* Password Change Section */}
              <div className="pt-6 border-t">
                <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Changer le mot de passe
                </h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50"
                      placeholder="Minimum 6 caractères"
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Confirmer le mot de passe
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50"
                      placeholder="Retapez le mot de passe"
                      minLength={6}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={changingPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                    className="btn-outline w-full flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {changingPassword ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Modification...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        Modifier le mot de passe
                      </>
                    )}
                  </button>
                </form>
              </div>
            </form>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Aucune commande pour le moment</p>
                  <button
                    onClick={() => navigate("/shop")}
                    className="btn-secondary"
                  >
                    Découvrir la boutique
                  </button>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-primary mb-1">
                          {order.order_number}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        {getStatusBadge(order.status)}
                        <span className="font-bold text-primary">
                          {formatPrice(order.total)}
                        </span>
                        <button
                          onClick={() => fetchOrderDetails(order.id)}
                          className="btn-outline py-2 px-4 text-sm flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Détails
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === "wishlist" && (
            <div className="space-y-4">
              {wishlist.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                  <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Aucun favori pour le moment</p>
                  <button
                    onClick={() => navigate("/shop")}
                    className="btn-secondary"
                  >
                    Découvrir la boutique
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {wishlist.map((product) => (
                    <div key={product.id} className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex gap-4">
                        <Link to={`/product/${product.slug}`} className="flex-shrink-0">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link to={`/product/${product.slug}`}>
                            <h3 className="font-semibold text-primary hover:text-secondary transition-colors truncate">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground capitalize mb-2">
                            {product.category}
                          </p>
                          <p className="font-bold text-primary">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                        <button
                          onClick={() => toggleWishlist(product)}
                          className="p-2 text-accent hover:bg-accent/10 rounded-full transition-colors self-start"
                          title="Retirer des favoris"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="bg-primary p-6 flex items-center justify-between">
              <div>
                <h2 className="font-montserrat text-xl font-bold text-white">
                  Commande {selectedOrder.order_number}
                </h2>
                <p className="text-white/70 text-sm">
                  {new Date(selectedOrder.created_at).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {loadingOrderDetails ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Status */}
                  <div className="flex items-center justify-between pb-4 border-b">
                    <span className="text-sm font-medium text-muted-foreground">Statut</span>
                    {getStatusBadge(selectedOrder.status)}
                  </div>

                  {/* Products */}
                  <div>
                    <h3 className="font-semibold text-primary mb-4">Produits</h3>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-primary">{item.product_name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Taille: {item.size} • Couleur: {item.color}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Quantité: {item.quantity}
                            </p>
                          </div>
                          <span className="font-bold text-primary">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Adresse de livraison
                    </h3>
                    <p className="text-muted-foreground">
                      {selectedOrder.shipping_address}
                      <br />
                      {selectedOrder.shipping_city}, {selectedOrder.shipping_country}
                    </p>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h3 className="font-semibold text-primary mb-2">Méthode de paiement</h3>
                    <p className="text-muted-foreground capitalize">
                      {selectedOrder.payment_method || "Non spécifié"}
                    </p>
                  </div>

                  {/* Tracking Number */}
                  {selectedOrder.tracking_number && (
                    <div>
                      <h3 className="font-semibold text-primary mb-2">Numéro de suivi</h3>
                      <p className="text-muted-foreground font-mono">
                        {selectedOrder.tracking_number}
                      </p>
                    </div>
                  )}

                  {/* Total */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-primary text-lg">Total</span>
                      <span className="font-bold text-primary text-2xl">
                        {formatPrice(selectedOrder.total)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
