import { useState, useEffect } from "react";
import { Phone, Tag, Truck } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const promoMessages = [
  { icon: Tag, text: "🔥 -20% sur toute la collection avec le code DAHOMEY20" },
  { icon: Phone, text: "📞 Service client: +229 XX XX XX XX" },
  { icon: Truck, text: "🚚 Livraison gratuite dès 100€ d'achat" },
];

export default function PromoBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isManuallyHidden, setIsManuallyHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isOpen: isCartOpen } = useCart();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promoMessages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isVisible = !isManuallyHidden && !isScrolled && !isCartOpen;

  if (!isVisible) return null;

  const currentMessage = promoMessages[currentIndex];

  return (
    <div className="bg-primary text-white py-2 px-4 fixed top-0 left-0 right-0 z-[60] transition-transform duration-300">
      <div className="container-custom flex items-center justify-center gap-2">
        <currentMessage.icon className="w-4 h-4 text-secondary flex-shrink-0" />
        <p className="text-sm font-medium text-center">
          {currentMessage.text}
        </p>
      </div>
    </div>
  );
}
