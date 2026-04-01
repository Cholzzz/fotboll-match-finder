ALTER TABLE public.player_profiles ADD COLUMN contract_status text DEFAULT 'free_agent';
ALTER TABLE public.player_profiles ADD COLUMN visibility text DEFAULT 'visible';