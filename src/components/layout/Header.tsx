import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, User, Search } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import CurrencySelector from "@/components/CurrencySelector";
import SearchModal from "@/components/SearchModal";

const navLinks = [
  { name: "Accueil", path: "/" },
  { name: "Boutique", path: "/shop" },
  { name: "Collections", path: "/shop?featured=true" },
  { name: "À propos", path: "/#about" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { toggleCart, totalItems } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "top-0 bg-primary/95 backdrop-blur-md shadow-lg py-3"
            : "top-10 bg-transparent py-5"
        )}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="font-montserrat text-2xl md:text-3xl font-bold text-secondary tracking-tight"
            >
              DAHOMEY<span className="text-white">-GANG</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "text-sm font-medium uppercase tracking-wider transition-colors duration-300",
                    location.pathname === link.path
                      ? "text-secondary"
                      : "text-white/80 hover:text-secondary"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <CurrencySelector />
              
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-white/80 hover:text-secondary transition-colors"
                aria-label="Rechercher"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                to="/auth"
                className="p-2 text-white/80 hover:text-secondary transition-colors hidden sm:block"
                aria-label="Mon compte"
              >
                <User className="w-5 h-5" />
              </Link>

              <button
                onClick={toggleCart}
                className="p-2 text-white/80 hover:text-secondary transition-colors relative"
                aria-label="Panier"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-secondary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-white lg:hidden"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div
            className={cn(
              "lg:hidden overflow-hidden transition-all duration-300",
              isMobileMenuOpen ? "max-h-96 mt-4" : "max-h-0"
            )}
          >
            <nav className="flex flex-col gap-4 pb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "text-base font-medium uppercase tracking-wider transition-colors duration-300 py-2",
                    location.pathname === link.path
                      ? "text-secondary"
                      : "text-white/80 hover:text-secondary"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/auth"
                className="text-base font-medium uppercase tracking-wider text-white/80 hover:text-secondary transition-colors py-2"
              >
                Mon Compte
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
