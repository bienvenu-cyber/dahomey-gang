import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone, ExternalLink } from "lucide-react";

const footerLinks = {
  shop: [
    { name: "T-Shirts", path: "/shop?category=t-shirts" },
    { name: "Hoodies", path: "/shop?category=hoodies" },
    { name: "Pantalons", path: "/shop?category=pantalons" },
    { name: "Accessoires", path: "/shop?category=accessoires" },
  ],
  info: [
    { name: "À propos", path: "/#about" },
    { name: "Livraison", path: "/shipping" },
    { name: "Retours", path: "/returns" },
    { name: "FAQ", path: "/faq" },
  ],
  legal: [
    { name: "CGV", path: "/terms" },
    { name: "Confidentialité", path: "/privacy" },
    { name: "Cookies", path: "/cookies" },
  ],
  partners: [
    { name: "KamexTrading", href: "https://kamextrading.com", description: "Trading & Investissement" },
  ],
};

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container-custom py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-montserrat text-xl font-bold mb-2">
                Rejoignez le <span className="text-secondary">Gang</span>
              </h3>
              <p className="text-white/70 text-sm">
                Recevez les dernières nouveautés et offres exclusives
              </p>
            </div>
            <form className="flex w-full md:w-auto gap-3">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 md:w-72 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-secondary transition-colors"
              />
              <button type="submit" className="btn-secondary whitespace-nowrap">
                S'inscrire
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="font-montserrat text-2xl font-bold text-secondary inline-block mb-4">
              DAHOMEY<span className="text-white">-GANG</span>
            </Link>
            <p className="text-white/70 text-sm mb-6 max-w-sm">
              Streetwear premium inspiré de l'héritage royal du Dahomey. 
              Chaque pièce raconte une histoire de force et d'authenticité.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-montserrat font-bold text-secondary mb-4">Boutique</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/70 hover:text-secondary text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Links */}
          <div>
            <h4 className="font-montserrat font-bold text-secondary mb-4">Informations</h4>
            <ul className="space-y-3">
              {footerLinks.info.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/70 hover:text-secondary text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              {footerLinks.legal.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/70 hover:text-secondary text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h4 className="font-montserrat font-bold text-secondary mb-4">Partenaires</h4>
            <ul className="space-y-3">
              {footerLinks.partners.map((partner) => (
                <li key={partner.href}>
                  <a
                    href={partner.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-secondary text-sm transition-colors flex items-center gap-1"
                  >
                    {partner.name}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <p className="text-white/50 text-xs mt-1">{partner.description}</p>
                </li>
              ))}
              <li className="mt-4">
                <a
                  href="https://kamextrading.com/formations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary hover:text-secondary/80 text-sm transition-colors flex items-center gap-1"
                >
                  Formations Trading
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://kamextrading.com/signaux"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-secondary text-sm transition-colors flex items-center gap-1"
                >
                  Signaux Crypto
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-montserrat font-bold text-secondary mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-white/70 text-sm">
                <Mail className="w-4 h-4 text-secondary" />
                contact@dahomey-gang.com
              </li>
              <li className="flex items-center gap-2 text-white/70 text-sm">
                <Phone className="w-4 h-4 text-secondary" />
                +229 XX XX XX XX
              </li>
              <li className="flex items-start gap-2 text-white/70 text-sm">
                <MapPin className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                Cotonou, Bénin
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Partner Banner */}
      <div className="border-t border-white/10 bg-white/5">
        <div className="container-custom py-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
            <span className="text-white/60 text-sm">Apprenez à investir avec notre partenaire</span>
            <a
              href="https://kamextrading.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-secondary/80 font-semibold text-sm flex items-center gap-1 transition-colors"
            >
              KamexTrading.com
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-sm">
              © {new Date().getFullYear()} Dahomey-Gang. Tous droits réservés.
            </p>
            <div className="flex gap-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-white/50 hover:text-secondary text-sm transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}