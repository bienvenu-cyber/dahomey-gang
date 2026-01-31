import SEO from "@/components/SEO";
import { Truck, Package, Clock, MapPin } from "lucide-react";

export default function Shipping() {
  return (
    <main className="pt-24 pb-20 min-h-screen bg-background">
      <SEO
        title="Livraison | Dahomey-Gang"
        description="Informations sur la livraison de vos commandes Dahomey-Gang. Livraison en Afrique et Europe."
        url="https://dahomeyboy.maxiimarket.com/shipping"
      />
      
      <div className="container-custom max-w-4xl">
        <h1 className="font-montserrat text-4xl font-bold text-primary mb-8">
          Livraison
        </h1>

        <div className="space-y-8">
          <section className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="w-6 h-6 text-secondary" />
              <h2 className="font-montserrat text-2xl font-bold text-primary">
                Zones de livraison
              </h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Nous livrons dans toute l'Afrique et en Europe. Nos partenaires logistiques assurent un suivi complet de votre colis.
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Bénin: 2-3 jours ouvrés</li>
              <li>• Afrique de l'Ouest (CEDEAO): 5-7 jours ouvrés</li>
              <li>• Afrique Centrale: 7-10 jours ouvrés</li>
              <li>• Europe: 10-15 jours ouvrés</li>
            </ul>
          </section>

          <section className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-6 h-6 text-secondary" />
              <h2 className="font-montserrat text-2xl font-bold text-primary">
                Frais de livraison
              </h2>
            </div>
            <div className="space-y-3 text-muted-foreground">
              <p>• Livraison gratuite dès 100€ d'achat</p>
              <p>• Bénin: 5€</p>
              <p>• Afrique de l'Ouest: 15€</p>
              <p>• Afrique Centrale: 20€</p>
              <p>• Europe: 25€</p>
            </div>
          </section>

          <section className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-secondary" />
              <h2 className="font-montserrat text-2xl font-bold text-primary">
                Délais de traitement
              </h2>
            </div>
            <p className="text-muted-foreground">
              Toutes les commandes sont traitées sous 24-48h. Vous recevrez un email de confirmation avec le numéro de suivi dès l'expédition de votre colis.
            </p>
          </section>

          <section className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-secondary" />
              <h2 className="font-montserrat text-2xl font-bold text-primary">
                Suivi de commande
              </h2>
            </div>
            <p className="text-muted-foreground">
              Suivez votre colis en temps réel grâce au numéro de suivi fourni par email. Pour toute question, contactez notre service client à contact@dahomey-gang.com
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
