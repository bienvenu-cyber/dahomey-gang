import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Menu,
  LogOut,
  ChevronRight,
  Mail,
  CreditCard,
  Tag,
  FolderOpen,
  Activity,
  Bell,
  Search,
  Globe,
  User,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import "@/styles/admin-theme.css";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Package, label: "Produits", path: "/admin/products" },
  { icon: FolderOpen, label: "Catégories", path: "/admin/categories" },
  { icon: Tag, label: "Codes Promo", path: "/admin/promo-codes" },
  { icon: ShoppingCart, label: "Commandes", path: "/admin/orders" },
  { icon: Users, label: "Clients", path: "/admin/customers" },
  { icon: CreditCard, label: "Paiements", path: "/admin/payments" },
  { icon: Mail, label: "Emails", path: "/admin/emails" },
  { icon: Activity, label: "Logs", path: "/admin/logs" },
  { icon: Settings, label: "Paramètres", path: "/admin/settings" },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, isAdmin, isLoading, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="admin-theme min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground animate-pulse">Chargement sécurisé...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated or not admin
  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-theme min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-sidebar/80 backdrop-blur-xl border-r border-sidebar-border transform transition-all duration-500 ease-in-out lg:translate-x-0 shadow-2xl lg:shadow-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-8 border-b border-sidebar-border/50">
            <Link to="/" className="group flex flex-col gap-1">
              <span className="font-montserrat text-2xl font-black tracking-tighter text-primary group-hover:scale-105 transition-transform duration-300 inline-block">
                DAHOMEY<span className="text-white">GANG</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="h-px w-8 bg-primary/50" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-sidebar-foreground/40">
                  Management Suite
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "group relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 overflow-hidden",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-white/5"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 w-1 h-full bg-white/30" />
                  )}
                  <item.icon className={cn(
                    "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                    isActive ? "text-primary-foreground" : "text-primary/70"
                  )} />
                  <span className="font-semibold tracking-wide">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto animate-pulse" />}
                </Link>
              );
            })}
          </nav>

          {/* User info & Logout */}
          <div className="p-6 mt-auto border-t border-sidebar-border/50 bg-white/[0.02]">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 mb-4 group cursor-default">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/10">
                  <User className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-sidebar-background ring-1 ring-green-500/50" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sidebar-foreground text-sm font-bold truncate">
                  {user.email?.split('@')[0]}
                </p>
                <p className="text-primary/60 text-[10px] font-black uppercase tracking-wider">
                  Super Admin
                </p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="group flex items-center gap-3 px-4 py-3 w-full text-sidebar-foreground/50 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all duration-300"
            >
              <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="font-bold">Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72 transition-all duration-500">
        {/* Top bar */}
        <header 
          className={cn(
            "sticky top-0 z-30 px-6 py-4 lg:px-10 transition-all duration-300 border-b",
            scrolled 
              ? "bg-background/80 backdrop-blur-md border-border/50 py-3 shadow-xl" 
              : "bg-transparent border-transparent"
          )}
        >
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 bg-sidebar-border/30 hover:bg-sidebar-border/50 text-foreground rounded-xl transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Desktop Search */}
            <div className="hidden md:flex items-center flex-1 max-w-md relative group">
              <Search className="absolute left-3 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Rechercher une commande, un produit..." 
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-sm"
              />
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <Link
                to="/"
                target="_blank"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold transition-all border border-border/20 group"
              >
                <Globe className="w-3.5 h-3.5 text-primary group-hover:rotate-12 transition-transform" />
                <span>Voir le site</span>
              </Link>
              
              <button className="relative p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-border/20 group">
                <Bell className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background animate-pulse" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Outlet />
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(212, 165, 116, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 165, 116, 0.2);
        }
      `}} />
    </div>
  );
}

