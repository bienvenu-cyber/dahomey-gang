-- Ajouter le rôle admin à l'utilisateur existant
INSERT INTO public.user_roles (user_id, role)
VALUES ('d1c56800-2138-40db-8dbf-5aac9173d588', 'admin')
ON CONFLICT DO NOTHING;