import { useState, useEffect } from "react";
import { Star, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  user_name: string;
  rating: number;
  title: string | null;
  comment: string;
  verified_purchase: boolean;
  created_at: string;
}

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

export default function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    rating: 5,
    title: "",
    comment: "",
  });

  useEffect(() => {
    if (isOpen) {
      fetchReviews();
    }
  }, [isOpen, productId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("product_reviews")
        .select("*")
        .eq("product_id", productId)
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      // Error fetching reviews
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous pour laisser un avis",
        variant: "destructive",
      });
      return;
    }

    if (!formData.comment.trim()) {
      toast({
        title: "Commentaire requis",
        description: "Veuillez écrire un commentaire",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      // Get user profile for name
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", user.id)
        .single();

      const { error } = await supabase.from("product_reviews").insert({
        product_id: productId,
        user_id: user.id,
        user_name: profile?.full_name || user.email?.split("@")[0] || "Utilisateur",
        rating: formData.rating,
        title: formData.title || null,
        comment: formData.comment,
      });

      if (error) throw error;

      toast({ title: "Avis publié ! ⭐" });
      setFormData({ rating: 5, title: "", comment: "" });
      setShowForm(false);
      fetchReviews();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de publier l'avis",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={() => interactive && onChange?.(star)}
            disabled={!interactive}
            className={cn(
              interactive && "hover:scale-110 transition-transform cursor-pointer",
              !interactive && "cursor-default"
            )}
          >
            <Star
              className={cn(
                "w-5 h-5",
                star <= rating ? "fill-secondary text-secondary" : "text-muted-foreground"
              )}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="border-t pt-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Star className="w-5 h-5 text-secondary" />
          <h3 className="font-semibold text-primary">
            Avis clients ({reviews.length})
          </h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {isOpen && (
        <div className="mt-6 space-y-6">
          {/* Add Review Button */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-outline w-full"
            >
              Laisser un avis
            </button>
          )}

          {/* Review Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="bg-muted/30 rounded-lg p-6 space-y-4">
              <h4 className="font-semibold text-primary">Votre avis sur {productName}</h4>
              
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Note *
                </label>
                {renderStars(formData.rating, true, (rating) =>
                  setFormData({ ...formData, rating })
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Titre (optionnel)
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  placeholder="Résumez votre expérience"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Commentaire *
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 resize-none"
                  placeholder="Partagez votre expérience avec ce produit..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-outline flex-1"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-secondary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Publication...
                    </>
                  ) : (
                    "Publier l'avis"
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucun avis pour le moment. Soyez le premier à donner votre avis !
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-primary">{review.user_name}</span>
                        {review.verified_purchase && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                            Achat vérifié
                          </span>
                        )}
                      </div>
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  {review.title && (
                    <h5 className="font-semibold text-primary mb-2">{review.title}</h5>
                  )}
                  <p className="text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
