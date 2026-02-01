-- Migration pour système de zones de livraison

-- 1. Créer la table des zones géographiques
CREATE TABLE IF NOT EXISTS public.shipping_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  countries TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Modifier shipping_settings pour lier aux zones
ALTER TABLE public.shipping_settings 
  DROP COLUMN IF EXISTS regions,
  ADD COLUMN IF NOT EXISTS zone_id UUID REFERENCES public.shipping_zones(id) ON DELETE SET NULL;

-- 3. RLS pour shipping_zones
ALTER TABLE public.shipping_zones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active zones" ON public.shipping_zones;
CREATE POLICY "Anyone can view active zones" 
  ON public.shipping_zones FOR SELECT 
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage zones" ON public.shipping_zones;
CREATE POLICY "Admins can manage zones" 
  ON public.shipping_zones FOR ALL 
  USING (is_admin(auth.uid()));

-- 4. Trigger pour updated_at
DROP TRIGGER IF EXISTS update_shipping_zones_updated_at ON public.shipping_zones;
CREATE TRIGGER update_shipping_zones_updated_at
  BEFORE UPDATE ON public.shipping_zones
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- 5. Insérer les zones par défaut
INSERT INTO public.shipping_zones (name, description, countries) VALUES
  ('Zone 1 - Local', 'Bénin et Togo', ARRAY['Bénin', 'Togo']),
  ('Zone 2 - Afrique de l''Ouest', 'Pays limitrophes', ARRAY['Côte d''Ivoire', 'Ghana', 'Burkina Faso', 'Niger', 'Nigeria', 'Sénégal', 'Mali']),
  ('Zone 3 - Afrique', 'Reste de l''Afrique', ARRAY['Cameroun', 'Gabon', 'Congo', 'RDC', 'Kenya', 'Tanzanie', 'Afrique du Sud', 'Maroc', 'Algérie', 'Tunisie', 'Égypte']),
  ('Zone 4 - Europe', 'Union Européenne et Royaume-Uni', ARRAY['France', 'Belgique', 'Suisse', 'Allemagne', 'Italie', 'Espagne', 'Portugal', 'Pays-Bas', 'Royaume-Uni', 'Luxembourg']),
  ('Zone 5 - International', 'Reste du monde', ARRAY['USA', 'Canada', 'Brésil', 'Chine', 'Japon', 'Australie', 'Nouvelle-Zélande'])
ON CONFLICT (name) DO NOTHING;

-- 6. Mettre à jour les options de livraison existantes avec les zones
DO $$
DECLARE
  zone1_id UUID;
  zone2_id UUID;
  zone3_id UUID;
  zone4_id UUID;
  zone5_id UUID;
BEGIN
  -- Récupérer les IDs des zones
  SELECT id INTO zone1_id FROM public.shipping_zones WHERE name = 'Zone 1 - Local';
  SELECT id INTO zone2_id FROM public.shipping_zones WHERE name = 'Zone 2 - Afrique de l''Ouest';
  SELECT id INTO zone3_id FROM public.shipping_zones WHERE name = 'Zone 3 - Afrique';
  SELECT id INTO zone4_id FROM public.shipping_zones WHERE name = 'Zone 4 - Europe';
  SELECT id INTO zone5_id FROM public.shipping_zones WHERE name = 'Zone 5 - International';

  -- Supprimer les anciennes options
  DELETE FROM public.shipping_settings;

  -- Créer les nouvelles options par zone
  -- Zone 1 - Local
  INSERT INTO public.shipping_settings (name, description, price, delivery_days_min, delivery_days_max, free_threshold, zone_id)
  VALUES 
    ('Standard Local', 'Livraison standard Bénin/Togo', 2.50, 2, 4, 50, zone1_id),
    ('Express Local', 'Livraison express Bénin/Togo', 5.00, 1, 2, NULL, zone1_id);

  -- Zone 2 - Afrique de l'Ouest
  INSERT INTO public.shipping_settings (name, description, price, delivery_days_min, delivery_days_max, free_threshold, zone_id)
  VALUES 
    ('Standard Afrique Ouest', 'Livraison Afrique de l''Ouest', 8.00, 5, 10, 100, zone2_id),
    ('Express Afrique Ouest', 'Livraison express Afrique de l''Ouest', 15.00, 3, 5, NULL, zone2_id);

  -- Zone 3 - Afrique
  INSERT INTO public.shipping_settings (name, description, price, delivery_days_min, delivery_days_max, free_threshold, zone_id)
  VALUES 
    ('Standard Afrique', 'Livraison Afrique', 12.00, 7, 14, 150, zone3_id),
    ('Express Afrique', 'Livraison express Afrique', 25.00, 4, 7, NULL, zone3_id);

  -- Zone 4 - Europe
  INSERT INTO public.shipping_settings (name, description, price, delivery_days_min, delivery_days_max, free_threshold, zone_id)
  VALUES 
    ('Standard Europe', 'Livraison Europe', 15.00, 7, 14, 150, zone4_id),
    ('Express Europe', 'Livraison express Europe', 30.00, 3, 5, NULL, zone4_id);

  -- Zone 5 - International
  INSERT INTO public.shipping_settings (name, description, price, delivery_days_min, delivery_days_max, free_threshold, zone_id)
  VALUES 
    ('Standard International', 'Livraison internationale', 25.00, 14, 21, 200, zone5_id),
    ('Express International', 'Livraison express internationale', 50.00, 7, 10, NULL, zone5_id);
END $$;

-- 7. Fonction pour obtenir les options de livraison selon le pays
CREATE OR REPLACE FUNCTION get_shipping_options_for_country(country_name TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  price NUMERIC,
  delivery_days_min INTEGER,
  delivery_days_max INTEGER,
  free_threshold NUMERIC,
  zone_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ss.id,
    ss.name,
    ss.description,
    ss.price,
    ss.delivery_days_min,
    ss.delivery_days_max,
    ss.free_threshold,
    sz.name as zone_name
  FROM public.shipping_settings ss
  JOIN public.shipping_zones sz ON ss.zone_id = sz.id
  WHERE sz.is_active = true 
    AND ss.is_active = true
    AND country_name = ANY(sz.countries)
  ORDER BY ss.price ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Fonction pour obtenir la zone d'un pays
CREATE OR REPLACE FUNCTION get_zone_for_country(country_name TEXT)
RETURNS UUID AS $$
DECLARE
  zone_id UUID;
BEGIN
  SELECT id INTO zone_id
  FROM public.shipping_zones
  WHERE is_active = true 
    AND country_name = ANY(countries)
  LIMIT 1;
  
  RETURN zone_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
