import { useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Email invalide",
        description: "Veuillez entrer une adresse email valide",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Insert into newsletter_subscribers
      const { error: insertError } = await supabase
        .from("newsletter_subscribers")
        .insert({ email });

      if (insertError) {
        if (insertError.code === "23505") {
          toast({
            title: "Déjà inscrit",
            description: "Cet email est déjà inscrit à la newsletter",
          });
          setEmail("");
          return;
        }
        throw insertError;
      }

      // Send welcome email via edge function
      const { error: emailError } = await supabase.functions.invoke(
        "send-newsletter-welcome",
        { body: { email } }
      );

      if (emailError) {
        // Email failed but subscription succeeded
      }

      toast({
        title: "Inscription réussie ! 🎉",
        description: "Vérifiez votre email pour votre code promo",
      });
      setEmail("");
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de s'inscrire",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full md:w-auto gap-3">
      <input
        type="email"
        placeholder="Votre email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        className="flex-1 md:w-72 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-secondary transition-colors disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={loading}
        className="btn-secondary whitespace-nowrap flex items-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="hidden sm:inline">Inscription...</span>
          </>
        ) : (
          "S'inscrire"
        )}
      </button>
    </form>
  );
}
