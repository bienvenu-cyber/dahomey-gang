import SEO from "@/components/SEO";

export default function Cookies() {
  return (
    <main className="pt-24 pb-20 min-h-screen bg-background">
      <SEO
        title="Politique des Cookies | Dahomey-Gang"
        description="Politique d'utilisation des cookies sur Dahomey-Gang"
        url="https://dahomeyboy.maxiimarket.com/cookies"
      />
      
      <div className="container-custom max-w-4xl">
        <h1 className="font-montserrat text-4xl font-bold text-primary mb-8">
          Politique des Cookies
        </h1>

        <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="font-montserrat text-2xl font-bold text-primary mb-4">Qu'est-ce qu'un cookie ?</h2>
            <p>
              Un cookie est un petit fichier texte déposé sur votre appareil lors de la visite d'un site web. Il permet de mémoriser des informations sur votre navigation.
            </p>
          </section>

          <section>
            <h2 className="font-montserrat text-2xl font-bold text-primary mb-4">Types de cookies utilisés</h2>
            
            <h3 className="font-semibold text-primary mt-4 mb-2">Cookies essentiels</h3>
            <p>
              Nécessaires au fonctionnement du site (panier, authentification, préférences de langue). Ces cookies ne peuvent pas être désactivés.
            </p>

            <h3 className="font-semibold text-primary mt-4 mb-2">Cookies de performance</h3>
            <p>
              Permettent d'analyser l'utilisation du site pour améliorer nos services (Google Analytics). Vous pouvez les refuser.
            </p>

            <h3 className="font-semibold text-primary mt-4 mb-2">Cookies marketing</h3>
            <p>
              Utilisés pour personnaliser les publicités et mesurer l'efficacité des campagnes. Vous pouvez les refuser.
            </p>
          </section>

          <section>
            <h2 className="font-montserrat text-2xl font-bold text-primary mb-4">Gestion des cookies</h2>
            <p>
              Vous pouvez gérer vos préférences de cookies via la bannière qui apparaît lors de votre première visite. Vous pouvez également configurer votre navigateur pour refuser les cookies.
            </p>
            <p className="mt-4">
              <strong>Attention:</strong> Le refus de certains cookies peut limiter votre expérience sur le site.
            </p>
          </section>

          <section>
            <h2 className="font-montserrat text-2xl font-bold text-primary mb-4">Durée de conservation</h2>
            <p>
              Les cookies sont conservés pour une durée maximale de 13 mois, conformément aux recommandations de la CNIL.
            </p>
          </section>

          <section>
            <h2 className="font-montserrat text-2xl font-bold text-primary mb-4">Cookies tiers</h2>
            <p>
              Certains cookies sont déposés par des services tiers (Google Analytics, réseaux sociaux). Ces services ont leur propre politique de confidentialité.
            </p>
          </section>

          <div className="bg-secondary/10 rounded-lg p-6 mt-8">
            <p className="text-sm">
              Pour toute question sur notre utilisation des cookies:<br />
              contact@dahomey-gang.com
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
