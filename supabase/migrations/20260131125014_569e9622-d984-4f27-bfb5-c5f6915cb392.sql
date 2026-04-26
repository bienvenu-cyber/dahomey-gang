-- Ajouter le rôle admin à l'utilisateur existant (si présent)
INSERT INTO public.user_roles (user_id, role)
SELECT 'a7f652d5-282d-4c14-9659-0cf750b65f8b', 'admin'
WHERE EXISTS (SELECT 1 FROM auth.users WHERE id = 'a7f652d5-282d-4c14-9659-0cf750b65f8b')
ON CONFLICT DO NOTHING;