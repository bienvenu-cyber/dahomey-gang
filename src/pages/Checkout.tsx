import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, CreditCard, Truck, Check, Tag, X, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useShippingSettings } from "@/hooks/useProducts";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

// African countries where address is optional
const africanCountries = ["Bénin", "Togo", "Côte d'Ivoire", "Sénégal", "Mali", "Burkina Faso", "Niger"];

interface FormData {
  email: string;
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  deliveryMethod: string;
  paymentMethod: "card" | "paypal" | "cash_on_delivery";
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  saveInfo: boolean;
}

const initialFormData: FormData = {
  email: "",
  fullName: "",
  address: "",
  city: "",
  postalCode: "",
  country: "France",
  phone: "",
  deliveryMethod: "",
  paymentMethod: "card",
  cardNumber: "",
  cardExpiry: "",
  cardCvc: "",
  saveInfo: false,
};

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { formatPrice, currency } = useCurrency();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: shippingOptions = [], isLoading: shippingLoading } = useShippingSettings();
  
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  // Promo code state
  const [promoCode, setPromoCode] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discount_type: string;
    discount_value: number;
  } | null>(null);
  const [promoError, setPromoError] = useState("");

  // Set default shipping method when options load
  useEffect(() => {
    if (shippingOptions.length > 0 && !formData.deliveryMethod) {
      setFormData(prev => ({ ...prev, deliveryMethod: shippingOptions[0].id }));
    }
  }, [shippingOptions, formData.deliveryMethod]);

  const isAfrican = africanCountries.includes(formData.country);

  if (items.length === 0) {
    return (
      <main className="pt-24 pb-20 min-h-screen bg-background">
        <div className="container-custom text-center py-20">
          <h1 className="font-montserrat text-2xl font-bold text-primary mb-4">
            Votre panier est vide
          </h1>
          <Link to="/shop" className="btn-secondary">
            Retour à la boutique
          </Link>
        </div>
      </main>
    );
  }

  // Get selected shipping option
  const selectedShipping = shippingOptions.find(s => s.id === formData.deliveryMethod);
  
  // Calculate discount
  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    
    if (appliedPromo.discount_type === "percentage") {
      return (totalPrice * appliedPromo.discount_value) / 100;
    } else {
      return Math.min(appliedPromo.discount_value, totalPrice);
    }
  };

  const discount = calculateDiscount();
  const subtotalAfterDiscount = totalPrice - discount;
  
  // Calculate shipping based on admin settings
  const getShippingCost = () => {
    if (!selectedShipping) return 0;
    if (selectedShipping.free_threshold && subtotalAfterDiscount >= selectedShipping.free_threshold) {
      return 0;
    }
    return selectedShipping.price;
  };
  
  const shipping = getShippingCost();
  const finalTotal = subtotalAfterDiscount + shipping;

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;
    
    setPromoLoading(true);
    setPromoError("");
    
    try {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("code", promoCode.toUpperCase())
        .eq("is_active", true)
        .single();
      
      if (error || !data) {
        setPromoError("Code promo invalide");
        return;
      }
      
      // Check expiration
      if (data.valid_until && new Date(data.valid_until) < new Date()) {
        setPromoError("Ce code promo a expiré");
        return;
      }
      
      // Check min order amount
      if (data.min_order_amount && totalPrice < data.min_order_amount) {
        setPromoError(`Commande minimum de ${data.min_order_amount}€ requise`);
        return;
      }
      
      // Check max uses
      if (data.max_uses && data.current_uses && data.current_uses >= data.max_uses) {
        setPromoError("Ce code promo a atteint sa limite d'utilisation");
        return;
      }
      
      setAppliedPromo({
        code: data.code,
        discount_type: data.discount_type,
        discount_value: data.discount_value,
      });
      setPromoCode("");
      toast({ title: "Code promo appliqué !" });
    } catch (error) {
      setPromoError("Erreur lors de la vérification du code");
    } finally {
      setPromoLoading(false);
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    toast({ title: "Code promo retiré" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.email) newErrors.email = "Email requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }
    if (!formData.fullName) newErrors.fullName = "Nom complet requis";
    if (!formData.city) newErrors.city = "Ville requise";
    if (!formData.phone) newErrors.phone = "Téléphone requis";
    
    // Address is optional in Africa
    if (!isAfrican && !formData.address) {
      newErrors.address = "Adresse requise";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (formData.paymentMethod === "card") {
      if (!formData.cardNumber) newErrors.cardNumber = "Numéro de carte requis";
      if (!formData.cardExpiry) newErrors.cardExpiry = "Date d'expiration requise";
      if (!formData.cardCvc) newErrors.cardCvc = "CVC requis";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep3()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    toast({
      title: "Commande confirmée !",
      description: "Vous recevrez un email de confirmation sous peu.",
    });
    
    clearCart();
    navigate("/");
    
    setIsSubmitting(false);
  };

  return (
    <main className="pt-24 pb-20 min-h-screen bg-muted/30">
      <div className="container-custom">
        {/* Back Link */}
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour au panier
        </Link>

        {/* Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[
            { num: 1, label: "Livraison" },
            { num: 2, label: "Méthode" },
            { num: 3, label: "Paiement" },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center gap-4">
              <button
                onClick={() => s.num < step && setStep(s.num as 1 | 2 | 3)}
                className={cn(
                  "flex items-center gap-2",
                  s.num <= step ? "text-primary" : "text-muted-foreground"
                )}
              >
                <span
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                    s.num < step
                      ? "bg-secondary text-secondary-foreground"
                      : s.num === step
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {s.num < step ? <Check className="w-4 h-4" /> : s.num}
                </span>
                <span className="hidden sm:inline font-medium">{s.label}</span>
              </button>
              {i < 2 && (
                <div
                  className={cn(
                    "w-12 h-0.5",
                    s.num < step ? "bg-secondary" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Shipping Info */}
              {step === 1 && (
                <div className="bg-white rounded-xl p-6 shadow-sm animate-fade-in">
                  <h2 className="font-montserrat text-xl font-bold text-primary mb-6">
                    Informations de livraison
                  </h2>

                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-medium text-primary mb-1.5 block">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={cn(
                          "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50",
                          errors.email ? "border-accent" : "border-border"
                        )}
                        placeholder="votre@email.com"
                      />
                      {errors.email && (
                        <p className="text-accent text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-primary mb-1.5 block">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={cn(
                          "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50",
                          errors.fullName ? "border-accent" : "border-border"
                        )}
                        placeholder="Jean Dupont"
                      />
                      {errors.fullName && (
                        <p className="text-accent text-sm mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-primary mb-1.5 block">
                          Pays *
                        </label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50"
                        >
                          <option>France</option>
                          <option>Bénin</option>
                          <option>Togo</option>
                          <option>Côte d'Ivoire</option>
                          <option>Sénégal</option>
                          <option>Burkina Faso</option>
                          <option>Mali</option>
                          <option>Niger</option>
                          <option>Belgique</option>
                          <option>Suisse</option>
                          <option>Luxembourg</option>
                          <option>Allemagne</option>
                          <option>Angleterre</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-primary mb-1.5 block">
                          Téléphone *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={cn(
                            "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50",
                            errors.phone ? "border-accent" : "border-border"
                          )}
                          placeholder="+229 XX XX XX XX"
                        />
                        {errors.phone && (
                          <p className="text-accent text-sm mt-1">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-primary mb-1.5 block">
                        Adresse {isAfrican ? "(optionnel)" : "*"}
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={cn(
                          "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50",
                          errors.address ? "border-accent" : "border-border"
                        )}
                        placeholder="Rue et numéro"
                      />
                      {errors.address && (
                        <p className="text-accent text-sm mt-1">{errors.address}</p>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-primary mb-1.5 block">
                          Ville *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className={cn(
                            "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50",
                            errors.city ? "border-accent" : "border-border"
                          )}
                        />
                        {errors.city && (
                          <p className="text-accent text-sm mt-1">{errors.city}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-primary mb-1.5 block">
                          Code postal (optionnel)
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="btn-secondary w-full mt-8"
                  >
                    Continuer
                  </button>
                </div>
              )}

              {/* Step 2: Delivery Method */}
              {step === 2 && (
                <div className="bg-white rounded-xl p-6 shadow-sm animate-fade-in">
                  <h2 className="font-montserrat text-xl font-bold text-primary mb-6">
                    Mode de livraison
                  </h2>

                  {shippingLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {shippingOptions.map((option) => {
                        const isFree = option.free_threshold && subtotalAfterDiscount >= option.free_threshold;
                        return (
                          <label
                            key={option.id}
                            className={cn(
                              "flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors",
                              formData.deliveryMethod === option.id
                                ? "border-secondary bg-secondary/5"
                                : "border-border hover:border-primary"
                            )}
                          >
                            <input
                              type="radio"
                              name="deliveryMethod"
                              value={option.id}
                              checked={formData.deliveryMethod === option.id}
                              onChange={handleChange}
                              className="sr-only"
                            />
                            <div
                              className={cn(
                                "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                formData.deliveryMethod === option.id
                                  ? "border-secondary"
                                  : "border-muted-foreground"
                              )}
                            >
                              {formData.deliveryMethod === option.id && (
                                <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                              )}
                            </div>
                            <Truck className={cn(
                              "w-6 h-6",
                              formData.deliveryMethod === option.id ? "text-secondary" : "text-muted-foreground"
                            )} />
                            <div className="flex-1">
                              <p className="font-medium">{option.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {option.delivery_days_min}-{option.delivery_days_max} jours ouvrés
                              </p>
                            </div>
                            <span className="font-bold">
                              {isFree ? "Gratuit" : formatPrice(option.price)}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex gap-4 mt-8">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="btn-outline flex-1"
                    >
                      Retour
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="btn-secondary flex-1"
                    >
                      Continuer
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="bg-white rounded-xl p-6 shadow-sm animate-fade-in">
                  <h2 className="font-montserrat text-xl font-bold text-primary mb-6">
                    Paiement
                  </h2>

                  <div className="space-y-4 mb-6">
                    <label
                      className={cn(
                        "flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors",
                        formData.paymentMethod === "card"
                          ? "border-secondary bg-secondary/5"
                          : "border-border hover:border-primary"
                      )}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === "card"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                          formData.paymentMethod === "card"
                            ? "border-secondary"
                            : "border-muted-foreground"
                        )}
                      >
                        {formData.paymentMethod === "card" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                        )}
                      </div>
                      <CreditCard className="w-6 h-6 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium">Carte bancaire</p>
                        <p className="text-sm text-muted-foreground">
                          Visa, Mastercard, etc.
                        </p>
                      </div>
                    </label>

                    {isAfrican && (
                      <label
                        className={cn(
                          "flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors",
                          formData.paymentMethod === "cash_on_delivery"
                            ? "border-secondary bg-secondary/5"
                            : "border-border hover:border-primary"
                        )}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash_on_delivery"
                          checked={formData.paymentMethod === "cash_on_delivery"}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div
                          className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                            formData.paymentMethod === "cash_on_delivery"
                              ? "border-secondary"
                              : "border-muted-foreground"
                          )}
                        >
                          {formData.paymentMethod === "cash_on_delivery" && (
                            <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                          )}
                        </div>
                        <Truck className="w-6 h-6 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-medium">Paiement à la livraison</p>
                          <p className="text-sm text-muted-foreground">
                            Payez en espèces à la réception
                          </p>
                        </div>
                      </label>
                    )}
                  </div>

                  {formData.paymentMethod === "card" && (
                    <div className="space-y-4 p-4 bg-muted rounded-lg">
                      <div>
                        <label className="text-sm font-medium text-primary mb-1.5 block">
                          Numéro de carte *
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          className={cn(
                            "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 bg-white",
                            errors.cardNumber ? "border-accent" : "border-border"
                          )}
                          placeholder="1234 5678 9012 3456"
                        />
                        {errors.cardNumber && (
                          <p className="text-accent text-sm mt-1">{errors.cardNumber}</p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-primary mb-1.5 block">
                            Date d'expiration *
                          </label>
                          <input
                            type="text"
                            name="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={handleChange}
                            className={cn(
                              "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 bg-white",
                              errors.cardExpiry ? "border-accent" : "border-border"
                            )}
                            placeholder="MM/AA"
                          />
                          {errors.cardExpiry && (
                            <p className="text-accent text-sm mt-1">{errors.cardExpiry}</p>
                          )}
                        </div>
                        <div>
                          <label className="text-sm font-medium text-primary mb-1.5 block">
                            CVC *
                          </label>
                          <input
                            type="text"
                            name="cardCvc"
                            value={formData.cardCvc}
                            onChange={handleChange}
                            className={cn(
                              "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 bg-white",
                              errors.cardCvc ? "border-accent" : "border-border"
                            )}
                            placeholder="123"
                          />
                          {errors.cardCvc && (
                            <p className="text-accent text-sm mt-1">{errors.cardCvc}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 mt-8">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="btn-outline flex-1"
                    >
                      Retour
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-secondary flex-1 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Traitement...
                        </>
                      ) : (
                        `Payer ${formatPrice(finalTotal)}`
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h3 className="font-montserrat text-lg font-bold text-primary mb-4">
                Récapitulatif
              </h3>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.size} • {item.color} • x{item.quantity}
                      </p>
                    </div>
                    <p className="font-medium text-sm">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div className="border-t pt-4 mb-4">
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-secondary/10 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-secondary" />
                      <span className="font-medium text-sm">{appliedPromo.code}</span>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-muted-foreground hover:text-accent"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Code promo"
                      className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
                    />
                    <button
                      onClick={applyPromoCode}
                      disabled={promoLoading || !promoCode}
                      className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium disabled:opacity-50"
                    >
                      {promoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Appliquer"}
                    </button>
                  </div>
                )}
                {promoError && (
                  <p className="text-accent text-xs mt-2">{promoError}</p>
                )}
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-secondary">
                    <span>Réduction</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Livraison</span>
                  <span>{shipping === 0 ? "Gratuit" : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
