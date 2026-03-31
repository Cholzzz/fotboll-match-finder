

## Plan: Koppla sökspelare-sidan till databasen

Ersätter den hårdkodade listan med riktiga spelarprofiler från `player_profiles` + `profiles`-tabellerna.

### Hur det fungerar

Data hämtas genom att joina `player_profiles` (position, age, region) med `profiles` (full_name, avatar_url) via `user_id`. Filtreringen (namn, position, region, ålder) sker klientside som idag men på riktig data.

### Ändringar

**`src/pages/SearchPlayers.tsx`**
- Ta bort `mockPlayers`-arrayen
- Lägg till `useQuery` (react-query) som hämtar spelare från Supabase:
  - Query: `supabase.from('player_profiles').select('*, profiles!inner(full_name, avatar_url, user_id)')` 
- Mappa resultatet till samma format som PlayerCard förväntar sig (`id` = `user_id`, `name` = `profiles.full_name`, etc.)
- Lägg till loading-state (skeleton/spinner) och error-state
- Filtreringen fortsätter klientside på det hämtade resultatet

**`src/components/PlayerCard.tsx`**
- Inga ändringar behövs -- interfacet matchar redan

### Dataflöde

```text
player_profiles (position, age, region, user_id)
       ↓ join via user_id
profiles (full_name, avatar_url)
       ↓ map
PlayerCard props (id, name, position, age, region, imageUrl)
```

### Förutsättningar

Tabellerna `player_profiles` och `profiles` har redan SELECT-policies för authenticated users, så inga RLS-ändringar behövs. Inga migrationer krävs.

