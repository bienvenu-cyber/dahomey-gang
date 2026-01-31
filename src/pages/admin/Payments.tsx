import { useEffect, useState } from "react";
import {
  CreditCard,
  Euro,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Payment {
  id: string;
  order_number: string;
  total: number;
  payment_status: string;
  payment_method: string;
  created_at: string;
}

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    paidCount: 0,
    pendingCount: 0,
    failedCount: 0,
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("id, order_number, total, payment_status, payment_method, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const paymentData = data || [];
      setPayments(paymentData);

      // Calculate stats
      const totalRevenue = paymentData
        .filter((p) => p.payment_status === "paid")
        .reduce((sum, p) => sum + Number(p.total), 0);
      const paidCount = paymentData.filter((p) => p.payment_status === "paid").length;
      const pendingCount = paymentData.filter((p) => p.payment_status === "pending").length;
      const failedCount = paymentData.filter((p) => p.payment_status === "failed").length;

      setStats({ totalRevenue, paidCount, pendingCount, failedCount });
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <span className="flex items-center gap-1 text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs">
            <CheckCircle className="w-3 h-3" />
            Payé
          </span>
        );
      case "pending":
        return (
          <span className="flex items-center gap-1 text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs">
            <Clock className="w-3 h-3" />
            En attente
          </span>
        );
      case "failed":
        return (
          <span className="flex items-center gap-1 text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs">
            <XCircle className="w-3 h-3" />
            Échoué
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-muted-foreground bg-muted px-2 py-1 rounded-full text-xs">
            {status}
          </span>
        );
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
    <div className="space-y-6">
      <div>
        <h1 className="font-montserrat text-2xl md:text-3xl font-bold text-primary">
          Paiements
        </h1>
        <p className="text-muted-foreground">
          Gérez et suivez les paiements
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total encaissé</p>
                <h3 className="text-2xl font-bold text-primary mt-1">
                  {stats.totalRevenue.toFixed(2)} €
                </h3>
              </div>
              <Euro className="w-8 h-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Payés</p>
                <h3 className="text-2xl font-bold text-green-600 mt-1">
                  {stats.paidCount}
                </h3>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En attente</p>
                <h3 className="text-2xl font-bold text-yellow-600 mt-1">
                  {stats.pendingCount}
                </h3>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Échoués</p>
                <h3 className="text-2xl font-bold text-red-600 mt-1">
                  {stats.failedCount}
                </h3>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info about Stripe */}
      <Card className="bg-primary text-white">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <CreditCard className="w-8 h-8 text-secondary flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Intégration Stripe
              </h3>
              <p className="text-white/70 mb-4">
                Pour accepter les paiements en ligne, vous pouvez intégrer Stripe. 
                Cela vous permettra de recevoir des paiements par carte bancaire en toute sécurité.
              </p>
              <Button variant="secondary" className="gap-2">
                <ExternalLink className="w-4 h-4" />
                Configurer Stripe
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments List */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des paiements</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Aucun paiement pour le moment
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Commande
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Méthode
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Statut
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                      Montant
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">
                        {payment.order_number}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(payment.created_at).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="py-3 px-4">
                        {payment.payment_method || "—"}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(payment.payment_status)}
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        {Number(payment.total).toFixed(2)} €
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
