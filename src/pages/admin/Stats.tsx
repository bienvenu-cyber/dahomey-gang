import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Euro,
  ShoppingCart,
  Package,
  Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#FFD700", "#0A1A2F", "#A4161A", "#1E90FF", "#6B7280"];

export default function Stats() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    totalProducts: 0,
  });
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [ordersByStatus, setOrdersByStatus] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch orders for revenue
      const { data: orders } = await supabase
        .from("orders")
        .select("total, status, created_at");

      // Fetch products count
      const { count: productsCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      if (orders) {
        const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
        const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

        setStats({
          totalRevenue,
          totalOrders: orders.length,
          averageOrderValue,
          totalProducts: productsCount || 0,
        });

        // Group orders by date for chart
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return date.toISOString().split("T")[0];
        });

        const revenueByDay = last7Days.map((date) => {
          const dayOrders = orders.filter(
            (o) => o.created_at.split("T")[0] === date
          );
          return {
            date: new Date(date).toLocaleDateString("fr-FR", {
              weekday: "short",
              day: "numeric",
            }),
            revenue: dayOrders.reduce((sum, o) => sum + Number(o.total), 0),
            orders: dayOrders.length,
          };
        });
        setRevenueData(revenueByDay);

        // Group orders by status
        const statusCounts: Record<string, number> = {};
        orders.forEach((o) => {
          statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
        });
        const statusLabels: Record<string, string> = {
          pending: "En attente",
          confirmed: "Confirmées",
          processing: "En préparation",
          shipped: "Expédiées",
          delivered: "Livrées",
          cancelled: "Annulées",
        };
        setOrdersByStatus(
          Object.entries(statusCounts).map(([status, count]) => ({
            name: statusLabels[status] || status,
            value: count,
          }))
        );
      }

      // Fetch top products (mock data since we don't have order_items data yet)
      const { data: products } = await supabase
        .from("products")
        .select("name, stock")
        .order("stock", { ascending: false })
        .limit(5);

      if (products) {
        setTopProducts(
          products.map((p) => ({
            name: p.name.length > 20 ? p.name.substring(0, 20) + "..." : p.name,
            stock: p.stock,
          }))
        );
      }
    } catch (error) {
      // Error fetching stats
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-montserrat text-2xl md:text-3xl font-bold text-primary">
          Statistiques
        </h1>
        <p className="text-muted-foreground">
          Analyses et performances de votre boutique
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Chiffre d'affaires</p>
                <h3 className="text-2xl font-bold text-primary mt-1">
                  {stats.totalRevenue.toFixed(2)} €
                </h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Euro className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Commandes</p>
                <h3 className="text-2xl font-bold text-primary mt-1">
                  {stats.totalOrders}
                </h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Panier moyen</p>
                <h3 className="text-2xl font-bold text-primary mt-1">
                  {stats.averageOrderValue.toFixed(2)} €
                </h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Produits</p>
                <h3 className="text-2xl font-bold text-primary mt-1">
                  {stats.totalProducts}
                </h3>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenus (7 derniers jours)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [`${value.toFixed(2)} €`, "Revenus"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#FFD700"
                    fill="#FFD700"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Orders by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Commandes par statut</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {ordersByStatus.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ordersByStatus}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {ordersByStatus.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Aucune donnée disponible
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Stock par produit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {topProducts.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProducts} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={150} />
                    <Tooltip />
                    <Bar dataKey="stock" fill="#0A1A2F" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Aucun produit
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
