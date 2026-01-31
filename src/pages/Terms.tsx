import SEO from "@/components/SEO";

export default function Terms() {
  return (
    <main className="pt-24 pb-20 min-h-screen bg-background">
      <SEO
        title="Conditions Générales de Vente | Dahomey-Gang"
        description="Conditions générales de vente de Dahomey-Gang"
        url="https://dahomeyboy.maxiimarket.com/terms"
      />
      
      <div className="container-custom max-w-4xl">
        <h1 className="font-montserrat text-4xl font-bold text-primary mb-8">
          Conditions Générales de Vente
        </h1>

        <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="font-montserrat text-2xl font-bold text-primary mb-4">1. Objet</h2>
            <p>
              Les présentes conditions générales de vente (CGV) régissent les ventes de produits Dahomey-Gang effectuées sur le site dahomeyboy.maxiimarket.com. Toute commande implique l'acceptation sans réserve des présentes CGV.
            </p>
          </section>

          <section>
            <h2 className="font-montserrat text-2xl font-bold text-primary mb-4">2. Produits</h2>
            <p>
              Les produits proposés sont ceux figurant sur le site dans la limite des stocks disponibles. Les photographies et descriptions sont aussi précises que possible mais ne peuvent garantir une reproduction exacte.
            </p>
          </section>

          <section>
            <h2 className="font-montserrat text-2xl font-bold text-primary mb-4">3. Prix</h2>
            <p>
              Les prix sont indiqués en euros (EUR) et en francs CFA (XOF), toutes taxes comprises. Dahomey-Gang se réserve le droit de modifier ses prix à tout moment, les produits étant facturés au tarif en vigueur lors de la commande.
            </p>
          </section>

          <section>
            <h2 className="font-montserrat text-2xl font-bold text-primary mb-4">4. Commande</h2>
            <p>
              Le client passe commande en ligne en suivant le processus d'achat. La vente est considérée comme définitive après envoi de la confirmation de commande par email et encaissement du paiement.
            </p>
          </section>

          <section>
            <h2 className="font-montserrat text-2xl font-bold text-primary mb-4">5. Paiement</h2>
            <p>
              Le paiement s'effectue par carte bancaire, Mobile Money ou virement bancaire. Les transactions sont sécurisées. En cas de refus de paiement, la commande est automatiquement annulée.
            </p>
          </section>

          <section>
            <h2 className="font-montserrat text-2xl font-bold text-primary mb-4">6. Livraison</h2>
            <p>
              Les délais de livraison varient selon la destination. Dahomey-Gang ne peut être tenu responsable des retards dus aux transporteurs ou aux services douaniers.
            </p>
          </section>

          <section>
            <h2 className="font-montserrat text-2xl font-bold text-primary mb-4">7. Droit de rétractation</h2>
            <p>
              Conformément à la législation, le client dispose d'un délai de 30 jours pour retourner un produit ne convenant pas, dans son état d'origine avec toutes les étiquettes.
            </p>
          </section>

          <section>
            <h2 className="font-montserrat text-2xl font-bold text-primary mb-4">8. Garanties</h2>
            <p>
              Tous nos produits bénéficient de la garantie légale de conformité et de la garantie contre les vices cachés. En cas de défaut, contactez notre service client.
            </p>
          </section>

          <section>
            <h2 className="font-montserrat text-2xl font-bold text-primary mb-4">9. Propriété intellectuelle</h2>
            <p>
              Tous les éléments du site (textes, images, logos) sont protégés par le droit d'auteur. Toute reproduction est interdite sans autorisation préalable.
            </p>
          </section>

          <section>
            <h2 className="font-montserrat text-2xl font-bold text-primary mb-4">10. Données personnelles</h2>
            <p>
              Les données collectées sont nécessaires au traitement de votre commande. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données.
            </p>
          </section>

          <section>
            <h2 className="font-montserrat text-2xl font-bold text-primary mb-4">11. Litiges</h2>
            <p>
              En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. À défaut, les tribunaux compétents seront ceux du siège social de Dahomey-Gang.
            </p>
          </section>

          <div className="bg-secondary/10 rounded-lg p-6 mt-8">
            <p className="text-sm">
              Dernière mise à jour: Janvier 2025<br />
              Pour toute question: contact@dahomey-gang.com
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
