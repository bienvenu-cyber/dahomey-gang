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
        <Button variant="ghost" size="sm" className="gap-2 text-sm">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currency === "EUR" ? "EUR €" : "FCFA"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setCurrency("EUR")}
          className={currency === "EUR" ? "bg-muted" : ""}
        >
          <span className="mr-2">🇪🇺</span>
          EUR (€) - Euro
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setCurrency("XOF")}
          className={currency === "XOF" ? "bg-muted" : ""}
        >
          <span className="mr-2">🇧🇯</span>
          XOF (FCFA) - Franc CFA
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
