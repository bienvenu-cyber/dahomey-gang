-- Create shipping settings table for admin-defined shipping prices
CREATE TABLE public.shipping_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0,
  delivery_days_min integer NOT NULL DEFAULT 3,
  delivery_days_max integer NOT NULL DEFAULT 7,
  is_active boolean NOT NULL DEFAULT true,
  free_threshold numeric DEFAULT NULL,
  regions text[] DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shipping_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can view active shipping settings
CREATE POLICY "Anyone can view active shipping settings" 
ON public.shipping_settings 
FOR SELECT 
USING (is_active = true);

-- Admins can manage shipping settings
CREATE POLICY "Admins can manage shipping settings" 
ON public.shipping_settings 
FOR ALL 
USING (is_admin(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_shipping_settings_updated_at
  BEFORE UPDATE ON public.shipping_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Insert default shipping options
INSERT INTO public.shipping_settings (name, description, price, delivery_days_min, delivery_days_max, free_threshold, regions)
VALUES 
  ('Standard', 'Livraison standard', 5.90, 5, 7, 100, ARRAY['France', 'Bénin', 'Togo', 'Côte d''Ivoire', 'Sénégal']),
  ('Express', 'Livraison express', 12.90, 2, 3, NULL, ARRAY['France', 'Bénin', 'Togo', 'Côte d''Ivoire', 'Sénégal']);