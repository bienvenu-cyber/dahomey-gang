import SEO from "@/components/SEO";
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function Returns() {
  return (
    <main className="pt-24 pb-20 min-h-screen bg-background">
      <SEO
        title="Retours & Échanges | Dahomey-Gang"
        description="Politique de retours et échanges Dahomey-Gang. Retours gratuits sous 30 jours."
        url="https://dahomeyboy.maxiimarket.com/returns"
      />
      
      <div className="container-custom max-w-4xl">
        <h1 className="font-montserrat text-4xl font-bold text-primary mb-8">
          Retours & Échanges
        </h1>

        <div className="space-y-8">
          <section className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-6 h-6 text-secondary" />
              <h2 className="font-montserrat text-2xl font-bold text-primary">
                Politique de retour
              </h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Vous disposez de 30 jours à compter de la réception de votre commande pour nous retourner un article.
            </p>
            <p className="text-muted-foreground">
              Les articles doivent être retournés dans leur état d'origine, non portés, non lavés, avec toutes les étiquettes attachées.
            </p>
          </section>

          <section className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h2 className="font-montserrat text-2xl font-bold text-primary">
                Articles éligibles
              </h2>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Vêtements non portés avec étiquettes</li>
              <li>• Accessoires dans leur emballage d'origine</li>
              <li>• Articles défectueux ou endommagés</li>
              <li>• Erreur de taille ou de couleur</li>
            </ul>
          </section>

          <section className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="w-6 h-6 text-red-600" />
              <h2 className="font-montserrat text-2xl font-bold text-primary">
                Articles non éligibles
              </h2>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Articles portés ou lavés</li>
              <li>• Articles sans étiquettes</li>
              <li>• Articles en promotion finale</li>
              <li>• Articles personnalisés</li>
            </ul>
          </section>

          <section className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-secondary" />
              <h2 className="font-montserrat text-2xl font-bold text-primary">
                Procédure de retour
              </h2>
            </div>
            <ol className="space-y-3 text-muted-foreground list-decimal list-inside">
              <li>Contactez notre service client à contact@dahomey-gang.com</li>
              <li>Indiquez votre numéro de commande et le motif du retour</li>
              <li>Recevez votre étiquette de retour par email</li>
              <li>Emballez soigneusement l'article</li>
              <li>Déposez le colis dans un point relais</li>
              <li>Remboursement sous 7-10 jours après réception</li>
            </ol>
          </section>

          <section className="bg-secondary/10 rounded-lg p-6">
            <h3 className="font-montserrat text-lg font-bold text-primary mb-3">
              Frais de retour
            </h3>
            <p className="text-muted-foreground">
              Les retours sont gratuits pour les articles défectueux ou en cas d'erreur de notre part. Pour les autres cas, les frais de retour sont à la charge du client.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
