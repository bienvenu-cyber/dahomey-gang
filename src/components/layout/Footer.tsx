import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone, ExternalLink } from "lucide-react";
import NewsletterForm from "@/components/NewsletterForm";

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
    { name: "Contact", path: "/contact" },
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
];export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-20 pb-10">
      <div className="container-custom">
        {/* Top Brand Section - Centered */}
        <div className="flex flex-col items-center text-center mb-16 animate-fade-up">
          <Link to="/" className="group flex flex-col items-center gap-2 mb-6">
            <span className="font-brand text-4xl md:text-5xl font-normal text-secondary tracking-widest group-hover:scale-105 transition-transform duration-500">
              DAHOMEY<span className="text-white">GANG</span>
            </span>
            <div className="h-px w-20 bg-secondary/50" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-bold">
              Streetwear Royale Heritage
            </span>
          </Link>
          
          <p className="text-white/60 text-sm md:text-base max-w-xl mb-10 leading-relaxed italic">
            "Porter Dahomey-Gang, c'est s'approprier une histoire de force, d'authenticité et d'élégance guerrière. Une fusion entre l'héritage du Dahomey et le streetwear moderne."
          </p>
          
          <div className="flex gap-8">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
                aria-label={social.label}
              >
                <div className="absolute -inset-2 bg-secondary/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
                <social.icon className="w-6 h-6 text-white/70 group-hover:text-secondary transition-colors duration-300" />
              </a>
            ))}
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-16" />

        {/* 3 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          {/* Column 1: Shop */}
          <div className="space-y-6">
            <h4 className="font-montserrat font-black text-secondary uppercase tracking-widest text-sm">
              Collections
            </h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/50 hover:text-white hover:pl-2 transition-all duration-300 text-sm block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Info & Legal */}
          <div className="space-y-6">
            <h4 className="font-montserrat font-black text-secondary uppercase tracking-widest text-sm">
              L'Expérience
            </h4>
            <ul className="space-y-3">
              {[...footerLinks.info, ...footerLinks.legal].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/50 hover:text-white hover:pl-2 transition-all duration-300 text-sm block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Newsletter */}
          <div className="space-y-6">
            <h4 className="font-montserrat font-black text-secondary uppercase tracking-widest text-sm">
              Restons Connectés
            </h4>
            <div className="space-y-4">
              <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Inscription Newsletter</p>
              <NewsletterForm />
              <div className="pt-4 space-y-3">
                <a href="mailto:contact@dahomey-gang.com" className="text-white/50 hover:text-secondary text-sm block transition-colors">
                  contact@dahomey-gang.com
                </a>
                <p className="text-white/50 text-sm">Cotonou, Bénin</p>
                {footerLinks.partners.map((partner) => (
                  <a
                    key={partner.href}
                    href={partner.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-white/30 hover:text-secondary transition-colors"
                  >
                    Partenaire: {partner.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
          <p className="text-white/20 text-[10px] uppercase tracking-[0.2em] font-bold">
            © {new Date().getFullYear()} DAHOMEY-GANG • TOUS DROITS RÉSERVÉS
          </p>
          <div className="flex gap-4 text-[10px] text-white/10 uppercase tracking-widest">
            <span>Kamex Partner</span>
            <span>•</span>
            <span>Premium Quality</span>
          </div>
        </div>
      </div>
    </footer>
  );
}