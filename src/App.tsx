import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartSidebar from "@/components/cart/CartSidebar";
import CookieConsent from "@/components/CookieConsent";
import PromoBanner from "@/components/home/PromoBanner";
import ChatAssistant from "@/components/ChatAssistant";
import ScrollToTop from "@/components/ScrollToTop";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import Collection from "@/pages/Collection";
import ProductDetails from "@/pages/ProductDetails";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Auth from "@/pages/Auth";
import Shipping from "@/pages/Shipping";
import Returns from "@/pages/Returns";
import FAQ from "@/pages/FAQ";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import Cookies from "@/pages/Cookies";
import Contact from "@/pages/Contact";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

// Lazy load admin pages
const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const Products = lazy(() => import("@/pages/admin/Products"));
const Orders = lazy(() => import("@/pages/admin/Orders"));
const Stats = lazy(() => import("@/pages/admin/Stats"));
const Customers = lazy(() => import("@/pages/admin/Customers"));
const Payments = lazy(() => import("@/pages/admin/Payments"));
const Emails = lazy(() => import("@/pages/admin/Emails"));
const Settings = lazy(() => import("@/pages/admin/Settings"));
const PromoCodes = lazy(() => import("@/pages/admin/PromoCodes"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <AuthProvider>
          <CurrencyProvider>
            <CartProvider>
            <Toaster />
          <Sonner />
          <BrowserRouter>
                <ScrollToTop />
            <Routes>
                {/* Admin Routes (lazy loaded) */}
                <Route
                  path="/admin"
                  element={
                    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Chargement...</div>}>
                      <AdminLayout />
                    </Suspense>
                  }
                >
                  <Route index element={<Suspense fallback={<div>Chargement...</div>}><Dashboard /></Suspense>} />
                  <Route path="products" element={<Suspense fallback={<div>Chargement...</div>}><Products /></Suspense>} />
                  <Route path="promo-codes" element={<Suspense fallback={<div>Chargement...</div>}><PromoCodes /></Suspense>} />
                  <Route path="orders" element={<Suspense fallback={<div>Chargement...</div>}><Orders /></Suspense>} />
                  <Route path="stats" element={<Suspense fallback={<div>Chargement...</div>}><Stats /></Suspense>} />
                  <Route path="customers" element={<Suspense fallback={<div>Chargement...</div>}><Customers /></Suspense>} />
                  <Route path="payments" element={<Suspense fallback={<div>Chargement...</div>}><Payments /></Suspense>} />
                  <Route path="emails" element={<Suspense fallback={<div>Chargement...</div>}><Emails /></Suspense>} />
                  <Route path="settings" element={<Suspense fallback={<div>Chargement...</div>}><Settings /></Suspense>} />
              </Route>

              {/* Public Routes (with header/footer) */}
              <Route
                path="*"
                element={
                  <>
                    <PromoBanner />
                    <Header />
                    <CartSidebar />
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/collection/:slug" element={<Collection />} />
                      <Route path="/product/:slug" element={<ProductDetails />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/shipping" element={<Shipping />} />
                      <Route path="/returns" element={<Returns />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/cookies" element={<Cookies />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <Footer />
                    <CookieConsent />
                    <ChatAssistant />
                  </>
                }
              />
            </Routes>
            </BrowserRouter>
          </CartProvider>
        </CurrencyProvider>
      </AuthProvider>
    </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
