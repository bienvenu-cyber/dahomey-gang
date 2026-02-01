import { useEffect, useState } from "react";
import { Activity, Filter, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface AdminLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: any;
  created_at: string;
  profiles?: {
    email: string;
    full_name: string | null;
  };
}

export default function Logs() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [entityFilter, setEntityFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 50;
  const { toast } = useToast();

  useEffect(() => {
    fetchLogs();
  }, [page, entityFilter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      let query = supabase
        .from("admin_logs")
        .select("*, profiles!admin_logs_user_id_fkey(email, full_name)", { count: "exact" })
        .order("created_at", { ascending: false });

      if (entityFilter !== "all") {
        query = query.eq("entity_type", entityFilter);
      }

      const { data, error, count } = await query.range(from, to);

      if (error) throw error;
      setLogs(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action: string) => {
    const styles: Record<string, string> = {
      create: "bg-green-100 text-green-800",
      update: "bg-blue-100 text-blue-800",
      delete: "bg-red-100 text-red-800",
      view: "bg-gray-100 text-gray-800",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[action] || styles.view}`}>
        {action}
      </span>
    );
  };

  const getEntityIcon = (entityType: string) => {
    const icons: Record<string, string> = {
      product: "📦",
      order: "🛒",
      customer: "👤",
      category: "📁",
      promo_code: "🏷️",
      settings: "⚙️",
    };
    return icons[entityType] || "📄";
  };

  if (loading && logs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-montserrat text-2xl md:text-3xl font-bold text-primary">
            Logs d'activité
          </h1>
          <p className="text-muted-foreground">
            Historique des actions administrateurs
          </p>
        </div>
        <Button onClick={fetchLogs} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Actualiser
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={entityFilter} onValueChange={(value) => { setEntityFilter(value); setPage(1); }}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Type d'entité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="product">Produits</SelectItem>
            <SelectItem value="order">Commandes</SelectItem>
            <SelectItem value="customer">Clients</SelectItem>
            <SelectItem value="category">Catégories</SelectItem>
            <SelectItem value="promo_code">Codes promo</SelectItem>
            <SelectItem value="settings">Paramètres</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Logs List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Activité récente
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Aucune activité enregistrée
            </p>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div className="text-2xl flex-shrink-0">
                    {getEntityIcon(log.entity_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getActionBadge(log.action)}
                      <span className="text-sm font-medium">
                        {log.entity_type}
                      </span>
                      {log.entity_id && (
                        <span className="text-xs text-muted-foreground font-mono">
                          #{log.entity_id.slice(0, 8)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Par{" "}
                      <span className="font-medium">
                        {log.profiles?.full_name || log.profiles?.email || "Utilisateur inconnu"}
                      </span>
                    </p>
                    {log.details && Object.keys(log.details).length > 0 && (
                      <details className="mt-2">
                        <summary className="text-xs text-muted-foreground cursor-pointer hover:text-primary">
                          Voir les détails
                        </summary>
                        <pre className="text-xs bg-background p-2 rounded mt-1 overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground text-right flex-shrink-0">
                    {new Date(log.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {logs.length > 0 && totalCount > itemsPerPage && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Affichage de {(page - 1) * itemsPerPage + 1} à{" "}
            {Math.min(page * itemsPerPage, totalCount)} sur {totalCount} logs
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(Math.ceil(totalCount / itemsPerPage), p + 1))}
              disabled={page >= Math.ceil(totalCount / itemsPerPage)}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
