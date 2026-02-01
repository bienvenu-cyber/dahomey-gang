import { useCurrency } from "@/contexts/CurrencyContext";
import { cn } from "@/lib/utils";

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex gap-3">
      <button
        onClick={() => setCurrency("EUR")}
        className={cn(
          "flex-1 px-6 py-3 border-2 rounded-lg font-medium transition-all",
          currency === "EUR"
            ? "border-secondary bg-secondary text-secondary-foreground"
            : "border-border hover:border-secondary"
        )}
      >
        <span className="text-2xl mr-2">🇪🇺</span>
        <div className="text-left">
          <div className="font-semibold">EUR (€)</div>
          <div className="text-xs text-muted-foreground">Euro</div>
        </div>
      </button>

      <button
        onClick={() => setCurrency("XOF")}
        className={cn(
          "flex-1 px-6 py-3 border-2 rounded-lg font-medium transition-all",
          currency === "XOF"
            ? "border-secondary bg-secondary text-secondary-foreground"
            : "border-border hover:border-secondary"
        )}
      >
        <span className="text-2xl mr-2">🇧🇯</span>
        <div className="text-left">
          <div className="font-semibold">XOF (FCFA)</div>
          <div className="text-xs text-muted-foreground">Franc CFA</div>
        </div>
      </button>
    </div>
  );
}
