import { useState } from "react";
import { Send, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Emails() {
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    message: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    // For now, just show a message about Resend integration
    toast({
      title: "Configuration requise",
      description: "L'envoi d'emails nécessite la configuration de Resend. Contactez l'administrateur.",
    });

    setSending(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-montserrat text-2xl md:text-3xl font-bold text-primary">
          Emails
        </h1>
        <p className="text-muted-foreground">
          Envoyez des emails à vos clients
        </p>
      </div>

      {/* Resend Info */}
      <Card className="border-secondary">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Mail className="w-8 h-8 text-secondary flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Intégration Resend
              </h3>
              <p className="text-muted-foreground mb-4">
                Pour envoyer des emails (confirmations de commande, notifications, etc.), 
                vous devez configurer Resend avec votre clé API et un domaine vérifié.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Emails transactionnels automatiques</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Confirmations de commande</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Notifications d'expédition</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Templates */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Templates disponibles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Confirmation de commande", status: "active" },
              { name: "Commande expédiée", status: "active" },
              { name: "Commande livrée", status: "inactive" },
              { name: "Bienvenue", status: "inactive" },
              { name: "Récupération de panier", status: "inactive" },
            ].map((template) => (
              <div
                key={template.name}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <span className="font-medium">{template.name}</span>
                {template.status === "active" ? (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    Actif
                  </span>
                ) : (
                  <span className="text-xs bg-muted-foreground/20 text-muted-foreground px-2 py-1 rounded">
                    Inactif
                  </span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Send Custom Email */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Envoyer un email</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="to">Destinataire</Label>
                <Input
                  id="to"
                  type="email"
                  value={formData.to}
                  onChange={(e) =>
                    setFormData({ ...formData, to: e.target.value })
                  }
                  placeholder="client@example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="subject">Sujet</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  placeholder="Sujet de l'email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Votre message..."
                  rows={5}
                  required
                />
              </div>
              <Button type="submit" disabled={sending} className="w-full gap-2">
                <Send className="w-4 h-4" />
                {sending ? "Envoi en cours..." : "Envoyer"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-secondary" />
            Configuration requise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li>Créez un compte sur <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">resend.com</a></li>
            <li>Vérifiez votre domaine email</li>
            <li>Générez une clé API</li>
            <li>Ajoutez la clé API comme secret dans le projet</li>
            <li>Configurez les templates d'emails</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
