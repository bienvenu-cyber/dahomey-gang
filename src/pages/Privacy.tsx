import SEO from "@/components/SEO";

export default function Privacy() {
  return (
    <main className="pt-24 pb-20 min-h-screen bg-background">
      <SEO
        title="Politique de Confidentialité | Dahomey-Gang"
        description="Politique de confidentialité et protection des données personnelles Dahomey-Gang"
        url="https://dahomeyboy.maxiimarket.com/privacy"
      />
      
      <div className="container-custom max-w-4xl">
        <h1 className="font-montserrat text-4xl font-bold text-primary mb-8">
          Politique de Confidentialité
        </h1>

        <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="font-montserrat text-2xl font-bold text-primary mb-4">1. Collecte des données</h2>
            <p>
              Dahomey-Gang collecte les données personnelles nécessaires au traitement de vos commandes: nom, prénom, adresse email, adresse de livraison, numéro de téléphone et informations de paiement.
            </p>
          </section>

          <section>
            <h2 className="font-montserrat text-2xl font-bold text-primary mb-4">2. Utilisation des données</h2>
            <p>Vos données sont utilisées pour:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Traiter et livrer vos commandes</li>
              <li>Vous envoyer des confirmations et suivis de commande</li>
              <li>Améliorer nos services</li>
              <li>Vous informer de nos offres (avec votre consentement)</li>
              <li>Respecter nos obligations légales</li>
            </ul>
          </section>

          <section>
            <h2 className="font-montserrat text-2xl font-bold text-primary mb-4">3. Protection des données</h2>
            <p>
              Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données contre tout accès non autorisé, perte ou divulgation.
            </p>
          </section>

          <section>
            <h2 className="font-montserrat text-2xl font-bold text-primary mb-4">4. Partage des données</h2>
            <p>
              Vos données ne sont jamais vendues à des tiers. Elles peuvent être partagées avec nos prestataires de services (paiement, livraison) uniquement dans le cadre de l'exécution de votre commande.
            </p>
          </section>

          <section>
            <h2 className="font-montserrat text-2xl font-bold text-primary mb-4">5. Cookies</h2>
            <p>
              Notre site utilise des cookies pour améliorer votre expérience de navigation. Vous pouvez gérer vos préférences de cookies via notre bannière de consentement.
            </p>
          </section>

          <section>
            <h2 className="font-montserrat text-2xl font-bold text-primary mb-4">6. Vos droits</h2>
            <p>Conformément au RGPD, vous disposez des droits suivants:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit à la portabilité</li>
              <li>Droit d'opposition</li>
            </ul>
            <p className="mt-4">
              Pour exercer ces droits, contactez-nous à: contact@dahomey-gang.com
            </p>
          </section>

          <section>
            <h2 className="font-montserrat text-2xl font-bold text-primary mb-4">7. Conservation des données</h2>
            <p>
              Vos données sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées, conformément aux obligations légales.
            </p>
          </section>

          <section>
            <h2 className="font-montserrat text-2xl font-bold text-primary mb-4">8. Modifications</h2>
            <p>
              Nous nous réservons le droit de modifier cette politique de confidentialité. Les modifications seront publiées sur cette page avec une nouvelle date de mise à jour.
            </p>
          </section>

          <div className="bg-secondary/10 rounded-lg p-6 mt-8">
            <p className="text-sm">
              Dernière mise à jour: Janvier 2025<br />
              Contact DPO: contact@dahomey-gang.com
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
