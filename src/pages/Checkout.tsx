import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, CreditCard, Truck, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  addressComplement: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  deliveryMethod: "standard" | "express";
  paymentMethod: "card" | "paypal";
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  saveInfo: boolean;
}

const initialFormData: FormData = {
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  addressComplement: "",
  city: "",
  postalCode: "",
  country: "Bénin",
  phone: "",
  deliveryMethod: "standard",
  paymentMethod: "card",
  cardNumber: "",
  cardExpiry: "",
  cardCvc: "",
  saveInfo: false,
};

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

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

  const shipping = formData.deliveryMethod === "express" ? 12.90 : totalPrice >= 100 ? 0 : 5.90;
  const finalTotal = totalPrice + shipping;

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
    if (!formData.firstName) newErrors.firstName = "Prénom requis";
    if (!formData.lastName) newErrors.lastName = "Nom requis";
    if (!formData.address) newErrors.address = "Adresse requise";
    if (!formData.city) newErrors.city = "Ville requise";
    if (!formData.postalCode) newErrors.postalCode = "Code postal requis";
    if (!formData.phone) newErrors.phone = "Téléphone requis";
    
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

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-primary mb-1.5 block">
                          Prénom *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={cn(
                            "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50",
                            errors.firstName ? "border-accent" : "border-border"
                          )}
                        />
                        {errors.firstName && (
                          <p className="text-accent text-sm mt-1">{errors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-primary mb-1.5 block">
                          Nom *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={cn(
                            "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50",
                            errors.lastName ? "border-accent" : "border-border"
                          )}
                        />
                        {errors.lastName && (
                          <p className="text-accent text-sm mt-1">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-primary mb-1.5 block">
                        Adresse *
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

                    <div>
                      <label className="text-sm font-medium text-primary mb-1.5 block">
                        Complément d'adresse
                      </label>
                      <input
                        type="text"
                        name="addressComplement"
                        value={formData.addressComplement}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50"
                        placeholder="Appartement, étage, etc."
                      />
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
                          Code postal *
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          className={cn(
                            "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50",
                            errors.postalCode ? "border-accent" : "border-border"
                          )}
                        />
                        {errors.postalCode && (
                          <p className="text-accent text-sm mt-1">{errors.postalCode}</p>
                        )}
                      </div>
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
                          <option>Bénin</option>
                          <option>France</option>
                          <option>Togo</option>
                          <option>Côte d'Ivoire</option>
                          <option>Sénégal</option>
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

                  <div className="space-y-4">
                    <label
                      className={cn(
                        "flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors",
                        formData.deliveryMethod === "standard"
                          ? "border-secondary bg-secondary/5"
                          : "border-border hover:border-primary"
                      )}
                    >
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="standard"
                        checked={formData.deliveryMethod === "standard"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                          formData.deliveryMethod === "standard"
                            ? "border-secondary"
                            : "border-muted-foreground"
                        )}
                      >
                        {formData.deliveryMethod === "standard" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                        )}
                      </div>
                      <Truck className="w-6 h-6 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium">Livraison Standard</p>
                        <p className="text-sm text-muted-foreground">5-7 jours ouvrés</p>
                      </div>
                      <span className="font-bold">
                        {totalPrice >= 100 ? "Gratuit" : "5,90 €"}
                      </span>
                    </label>

                    <label
                      className={cn(
                        "flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors",
                        formData.deliveryMethod === "express"
                          ? "border-secondary bg-secondary/5"
                          : "border-border hover:border-primary"
                      )}
                    >
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="express"
                        checked={formData.deliveryMethod === "express"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                          formData.deliveryMethod === "express"
                            ? "border-secondary"
                            : "border-muted-foreground"
                        )}
                      >
                        {formData.deliveryMethod === "express" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                        )}
                      </div>
                      <Truck className="w-6 h-6 text-secondary" />
                      <div className="flex-1">
                        <p className="font-medium">Livraison Express</p>
                        <p className="text-sm text-muted-foreground">2-3 jours ouvrés</p>
                      </div>
                      <span className="font-bold">12,90 €</span>
                    </label>
                  </div>

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
                      <CreditCard className="w-6 h-6" />
                      <span className="font-medium">Carte bancaire</span>
                    </label>

                    <label
                      className={cn(
                        "flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors",
                        formData.paymentMethod === "paypal"
                          ? "border-secondary bg-secondary/5"
                          : "border-border hover:border-primary"
                      )}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={formData.paymentMethod === "paypal"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                          formData.paymentMethod === "paypal"
                            ? "border-secondary"
                            : "border-muted-foreground"
                        )}
                      >
                        {formData.paymentMethod === "paypal" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                        )}
                      </div>
                      <span className="text-xl font-bold text-highlight">PayPal</span>
                    </label>
                  </div>

                  {formData.paymentMethod === "card" && (
                    <div className="space-y-4 mb-6">
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
                            "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50",
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
                              "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50",
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
                              "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50",
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
                      className="btn-secondary flex-1"
                    >
                      {isSubmitting ? "Traitement..." : `Payer ${finalTotal.toFixed(2)} €`}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-28">
              <h2 className="font-montserrat text-lg font-bold text-primary mb-6">
                Votre commande
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size}-${item.color}`}
                    className="flex gap-3"
                  >
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.size} / {item.color}
                      </p>
                    </div>
                    <span className="font-medium text-sm">
                      {(item.product.price * item.quantity).toFixed(2)} €
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{totalPrice.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Livraison</span>
                  <span>{shipping === 0 ? "Gratuit" : `${shipping.toFixed(2)} €`}</span>
                </div>
              </div>

              <div className="border-t border-border mt-4 pt-4">
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-montserrat font-bold text-primary">
                    {finalTotal.toFixed(2)} €
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
