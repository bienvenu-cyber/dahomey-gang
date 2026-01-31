import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Si il y a un hash (#about), scroll vers l'élément
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // Sinon scroll en haut
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}
