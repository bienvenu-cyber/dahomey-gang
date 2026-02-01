import { useState } from "react";
import { Send, Mail } from "lucide-react";
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
              { name: "Commande livrée", status: "active" },
              { name: "Bienvenue", status: "active" },
              { name: "Newsletter", status: "active" },
            ].map((template) => (
              <div
                key={template.name}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <span className="font-medium">{template.name}</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  Actif
                </span>
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
    </div>
  );
}
