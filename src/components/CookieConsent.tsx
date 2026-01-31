import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const COOKIE_CONSENT_KEY = "dahomey-gang-cookie-consent";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay for smooth entrance
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 md:bottom-6 md:left-6 md:right-auto md:max-w-md z-50",
        "bg-primary text-white p-6 md:rounded-xl shadow-2xl",
        "animate-fade-up"
      )}
    >
      <button
        onClick={handleDecline}
        className="absolute top-4 right-4 p-1 text-white/60 hover:text-white transition-colors"
        aria-label="Fermer"
      >
        <X className="w-4 h-4" />
      </button>

      <h3 className="font-montserrat font-bold text-lg mb-2">
        🍪 Nous utilisons des cookies
      </h3>
      <p className="text-white/70 text-sm mb-4">
        Ce site utilise des cookies pour améliorer votre expérience. 
        En continuant, vous acceptez notre politique de confidentialité.
      </p>

      <div className="flex gap-3">
        <button
          onClick={handleAccept}
          className="btn-secondary text-sm px-4 py-2"
        >
          Accepter
        </button>
        <button
          onClick={handleDecline}
          className="text-white/70 hover:text-white text-sm font-medium transition-colors"
        >
          Refuser
        </button>
      </div>
    </div>
  );
}
