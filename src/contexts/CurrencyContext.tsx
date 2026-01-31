import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type CurrencyCode = "EUR" | "XOF";

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  formatPrice: (priceInEur: number) => string;
  convertPrice: (priceInEur: number) => number;
  symbol: string;
  rate: number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Taux de conversion fixe EUR -> XOF (1 EUR = 655.957 XOF, taux fixe FCFA)
const EUR_TO_XOF_RATE = 655.957;

const CURRENCY_STORAGE_KEY = "dahomey-gang-currency";

// Pays de la zone CFA (UEMOA et CEMAC)
const CFA_COUNTRIES = [
  "BJ", // Bénin
  "BF", // Burkina Faso
  "CI", // Côte d'Ivoire
  "GW", // Guinée-Bissau
  "ML", // Mali
  "NE", // Niger
  "SN", // Sénégal
  "TG", // Togo
  "CM", // Cameroun
  "CF", // République centrafricaine
  "TD", // Tchad
  "CG", // Congo
  "GQ", // Guinée équatoriale
  "GA", // Gabon
];

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("EUR");
  const [isDetected, setIsDetected] = useState(false);

  // Détection automatique basée sur la géolocalisation
  useEffect(() => {
    const savedCurrency = localStorage.getItem(CURRENCY_STORAGE_KEY) as CurrencyCode | null;
    
    if (savedCurrency && (savedCurrency === "EUR" || savedCurrency === "XOF")) {
      setCurrencyState(savedCurrency);
      setIsDetected(true);
      return;
    }

    // Détection via API de géolocalisation gratuite
    const detectLocation = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/", {
          signal: AbortSignal.timeout(5000)
        });
        
        if (!response.ok) throw new Error("Failed to fetch location");
        
        const data = await response.json();
        const countryCode = data.country_code;
        
        if (CFA_COUNTRIES.includes(countryCode)) {
          setCurrencyState("XOF");
          localStorage.setItem(CURRENCY_STORAGE_KEY, "XOF");
        } else {
          setCurrencyState("EUR");
          localStorage.setItem(CURRENCY_STORAGE_KEY, "EUR");
        }
      } catch (error) {
        console.log("Géolocalisation échouée, utilisation de l'EUR par défaut");
        setCurrencyState("EUR");
      } finally {
        setIsDetected(true);
      }
    };

    detectLocation();
  }, []);

  const setCurrency = (newCurrency: CurrencyCode) => {
    setCurrencyState(newCurrency);
    localStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency);
  };

  const convertPrice = (priceInEur: number): number => {
    if (currency === "XOF") {
      return Math.round(priceInEur * EUR_TO_XOF_RATE);
    }
    return priceInEur;
  };

  const formatPrice = (priceInEur: number): string => {
    const converted = convertPrice(priceInEur);
    
    if (currency === "XOF") {
      return new Intl.NumberFormat("fr-FR", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(converted) + " FCFA";
    }
    
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(converted);
  };

  const symbol = currency === "EUR" ? "€" : "FCFA";
  const rate = currency === "EUR" ? 1 : EUR_TO_XOF_RATE;

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        convertPrice,
        symbol,
        rate,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
