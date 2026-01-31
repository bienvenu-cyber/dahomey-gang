import { useState } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: "1",
    text: "👋 Bienvenue chez Dahomey-Gang ! Comment puis-je vous aider aujourd'hui ?",
    isBot: true,
    timestamp: new Date(),
  },
];

const quickReplies = [
  "Suivi de commande",
  "Tailles disponibles",
  "Modes de paiement",
  "Délais de livraison",
];

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("suivi") || lowerMessage.includes("commande")) {
      return "Pour suivre votre commande, rendez-vous dans votre espace client avec l'email utilisé lors de l'achat. Vous recevrez également des emails à chaque étape de la livraison. 📦";
    }
    if (lowerMessage.includes("taille")) {
      return "Nos tailles vont du XS au XXL. Consultez le guide des tailles sur chaque fiche produit pour trouver votre taille idéale. Si vous hésitez, n'hésitez pas à nous contacter ! 📏";
    }
    if (lowerMessage.includes("paiement") || lowerMessage.includes("payer")) {
      return "Nous acceptons les cartes bancaires (Visa, Mastercard), PayPal, et le paiement à la livraison pour certaines zones en Afrique. 💳";
    }
    if (lowerMessage.includes("livraison") || lowerMessage.includes("délai")) {
      return "La livraison standard prend 5-7 jours ouvrés. La livraison express est disponible en 2-3 jours. Les délais varient selon votre zone géographique. 🚚";
    }
    if (lowerMessage.includes("retour") || lowerMessage.includes("rembours")) {
      return "Vous disposez de 30 jours après réception pour retourner un article non porté. Contactez-nous à contact@dahomey-gang.com pour initier un retour. ↩️";
    }
    if (lowerMessage.includes("promo") || lowerMessage.includes("code") || lowerMessage.includes("réduction")) {
      return "Inscrivez-vous à notre newsletter pour recevoir 10% de réduction sur votre première commande ! Suivez-nous sur Instagram @dahomey.gang pour les offres exclusives. 🎁";
    }
    
    return "Merci pour votre message ! Pour une assistance personnalisée, vous pouvez nous contacter à contact@dahomey-gang.com ou par téléphone au +229 XX XX XX XX. Nous sommes là pour vous aider ! 💬";
  };

  const handleSend = (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate bot typing
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(messageText),
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-secondary text-secondary-foreground shadow-lg",
          "flex items-center justify-center hover:scale-110 transition-transform",
          isOpen && "hidden"
        )}
        aria-label="Ouvrir le chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="bg-primary p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <span className="text-lg font-bold">DG</span>
              </div>
              <div>
                <h3 className="font-semibold text-white">Dahomey-Gang</h3>
                <p className="text-xs text-white/70">En ligne • Répond rapidement</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-muted/30">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.isBot ? "justify-start" : "justify-end"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                    message.isBot
                      ? "bg-white text-primary shadow-sm"
                      : "bg-secondary text-secondary-foreground"
                  )}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-2 shadow-sm">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>

          {/* Quick Replies */}
          <div className="px-4 py-2 flex gap-2 overflow-x-auto bg-white border-t">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => handleSend(reply)}
                className="flex-shrink-0 px-3 py-1.5 text-xs font-medium bg-muted rounded-full hover:bg-secondary hover:text-secondary-foreground transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Écrivez votre message..."
                className="flex-1 px-4 py-2 bg-muted rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/90 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
