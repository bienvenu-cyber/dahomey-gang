import { useCurrency } from "@/contexts/CurrencyContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-sm text-white/80 hover:text-secondary hover:bg-white/10">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currency === "EUR" ? "EUR €" : "FCFA"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-primary border-white/20">
        <DropdownMenuItem
          onClick={() => setCurrency("EUR")}
          className={currency === "EUR" ? "bg-secondary/20 text-white" : "text-white/80 hover:text-secondary hover:bg-white/10"}
        >
          <span className="mr-2">🇪🇺</span>
          EUR (€) - Euro
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setCurrency("XOF")}
          className={currency === "XOF" ? "bg-secondary/20 text-white" : "text-white/80 hover:text-secondary hover:bg-white/10"}
        >
          <span className="mr-2">🇧🇯</span>
          XOF (FCFA) - Franc CFA
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
