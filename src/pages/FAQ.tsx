import SEO from "@/components/SEO";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Comment passer une commande ?",
    answer: "Parcourez notre boutique, ajoutez les articles à votre panier, puis cliquez sur 'Passer commande'. Suivez les étapes pour renseigner vos informations de livraison et de paiement."
  },
  {
    question: "Quels sont les moyens de paiement acceptés ?",
    answer: "Nous acceptons les cartes bancaires (Visa, Mastercard), Mobile Money (MTN, Moov) et les virements bancaires pour les commandes importantes."
  },
  {
    question: "Puis-je modifier ma commande après validation ?",
    answer: "Vous pouvez modifier votre commande dans les 2 heures suivant la validation en contactant notre service client. Passé ce délai, la commande est en cours de préparation."
  },
  {
    question: "Comment choisir ma taille ?",
    answer: "Consultez notre guide des tailles disponible sur chaque fiche produit. En cas de doute, contactez-nous pour des conseils personnalisés."
  },
  {
    question: "Les couleurs sont-elles fidèles aux photos ?",
    answer: "Nous faisons de notre mieux pour représenter fidèlement les couleurs. Cependant, elles peuvent légèrement varier selon votre écran."
  },
  {
    question: "Proposez-vous la livraison internationale ?",
    answer: "Oui, nous livrons dans toute l'Afrique et en Europe. Les délais varient selon la destination (voir notre page Livraison)."
  },
  {
    question: "Comment suivre ma commande ?",
    answer: "Vous recevrez un email avec un numéro de suivi dès l'expédition de votre colis. Vous pourrez suivre votre commande en temps réel."
  },
  {
    question: "Que faire si je reçois un article défectueux ?",
    answer: "Contactez immédiatement notre service client avec des photos. Nous organiserons un échange ou un remboursement dans les plus brefs délais."
  },
  {
    question: "Puis-je échanger un article ?",
    answer: "Oui, les échanges sont possibles sous 30 jours. Contactez notre service client pour organiser l'échange."
  },
  {
    question: "Combien de temps prend un remboursement ?",
    answer: "Les remboursements sont traités sous 7-10 jours ouvrés après réception et vérification de l'article retourné."
  },
  {
    question: "Proposez-vous des codes promo ?",
    answer: "Oui ! Inscrivez-vous à notre newsletter pour recevoir des offres exclusives et des codes promo réguliers."
  },
  {
    question: "Comment entretenir mes vêtements Dahomey-Gang ?",
    answer: "Lavage en machine à 30°C, séchage à l'air libre recommandé. Consultez l'étiquette d'entretien sur chaque article pour des instructions spécifiques."
  }
];

export default function FAQ() {
  return (
    <main className="pt-24 pb-20 min-h-screen bg-background">
      <SEO
        title="FAQ | Dahomey-Gang"
        description="Questions fréquentes sur Dahomey-Gang. Livraison, retours, paiement et plus."
        url="https://dahomeyboy.maxiimarket.com/faq"
      />
      
      <div className="container-custom max-w-4xl">
        <h1 className="font-montserrat text-4xl font-bold text-primary mb-4">
          Questions Fréquentes
        </h1>
        <p className="text-muted-foreground mb-12">
          Trouvez rapidement les réponses à vos questions. Si vous ne trouvez pas ce que vous cherchez, contactez-nous à contact@dahomey-gang.com
        </p>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white rounded-lg px-6 border-0 shadow-sm"
            >
              <AccordionTrigger className="text-left font-semibold text-primary hover:text-secondary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 bg-secondary/10 rounded-lg p-8 text-center">
          <h2 className="font-montserrat text-2xl font-bold text-primary mb-4">
            Vous avez d'autres questions ?
          </h2>
          <p className="text-muted-foreground mb-6">
            Notre équipe est là pour vous aider
          </p>
          <a
            href="mailto:contact@dahomey-gang.com"
            className="btn-secondary inline-block"
          >
            Contactez-nous
          </a>
        </div>
      </div>
    </main>
  );
}
