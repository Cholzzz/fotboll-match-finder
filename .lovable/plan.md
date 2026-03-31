

## Plan: Rankingsystem — Topplista mest visade spelare

### Översikt
Skapa en `profile_views`-tabell som loggar varje profilbesök, sedan en ny `/rankings`-sida som visar en topplista sorterad på antal visningar.

### 1. Databasmigrering
Ny tabell `profile_views`:
```sql
CREATE TABLE public.profile_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_user_id uuid NOT NULL,
  viewer_user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;

-- Alla inloggade kan logga visningar
CREATE POLICY "Anyone can insert views" ON public.profile_views
  FOR INSERT TO authenticated WITH CHECK (true);

-- Alla inloggade kan läsa (för topplistan)
CREATE POLICY "Anyone can read views" ON public.profile_views
  FOR SELECT TO authenticated USING (true);
```

### 2. Logga visningar (`src/pages/PlayerProfile.tsx`)
Lägg till en `useEffect` som insertar en rad i `profile_views` varje gång en spelarprofil laddas (en gång per session/besök). Förhindrar dubbelräkning genom att bara logga en gång per komponent-mount.

### 3. Ny sida: `src/pages/Rankings.tsx`
- Hämtar visningar med en aggregerad query: räkna antal rader per `player_user_id`, joina med `profiles` och `player_profiles` för namn/position/region/avatar
- Visar en tabell med kolumner: Rank, Spelare (avatar + namn), Position, Region, Antal visningar
- Responsiv design med befintliga UI-komponenter (Table, Skeleton)
- Topp 50 spelare visas

### 4. Routing (`src/App.tsx`)
Lägg till `/rankings`-route som pekar på Rankings-sidan.

### 5. Navigation (`src/components/layout/Header.tsx`)
Lägg till en "Topplista"-länk i navigationen.

### Tekniska detaljer
- Query: `supabase.from('profile_views').select('player_user_id').then()` → gruppera klientsidigt, eller använda en RPC-funktion för aggregering
- Alternativt: skapa en DB-funktion `get_player_rankings()` som returnerar aggregerad data direkt — snabbare och renare
- Rankingsidan använder `useQuery` med React Query för caching

