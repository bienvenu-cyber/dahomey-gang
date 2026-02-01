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
import { WishlistProvider } from "@/contexts/WishlistContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartSidebar from "@/components/cart/CartSidebar";
import CookieConsent from "@/components/CookieConsent";
import PromoBanner from "@/components/home/PromoBanner";
import ContactWidget from "@/components/ContactWidget";
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

// Admin pages - imported directly to avoid lazy loading issues
import AdminLayout from "@/pages/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import Products from "@/pages/admin/Products";
import Categories from "@/pages/admin/Categories";
import Orders from "@/pages/admin/Orders";
import Customers from "@/pages/admin/Customers";
import Payments from "@/pages/admin/Payments";
import Emails from "@/pages/admin/Emails";
import Settings from "@/pages/admin/Settings";
import PromoCodes from "@/pages/admin/PromoCodes";
import Logs from "@/pages/admin/Logs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <AuthProvider>
          <CurrencyProvider>
            <WishlistProvider>
              <CartProvider>
            <Toaster />
          <Sonner />
          <BrowserRouter>
                <ScrollToTop />
            <Routes>
                {/* Admin Routes (lazy loaded) */}
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<Dashboard />} />
                      <Route path="products" element={<Products />} />
                      <Route path="categories" element={<Categories />} />
                      <Route path="promo-codes" element={<PromoCodes />} />
                      <Route path="orders" element={<Orders />} />
                      <Route path="customers" element={<Customers />} />
                      <Route path="payments" element={<Payments />} />
                      <Route path="emails" element={<Emails />} />
                      <Route path="logs" element={<Logs />} />
                      <Route path="settings" element={<Settings />} />
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
                    <ContactWidget />
                  </>
                }
              />
            </Routes>
            </BrowserRouter>
          </CartProvider>
            </WishlistProvider>
        </CurrencyProvider>
      </AuthProvider>
    </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
