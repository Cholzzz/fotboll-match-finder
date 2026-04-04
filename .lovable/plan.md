

## Plan: Aktivitetsflöde

Bygga en ny sida `/activity` som visar ett realtidsflöde med händelser på plattformen.

---

### Vad visas i flödet

- Nya provträningar utlagda i din region
- Nya spelare registrerade
- Nya bokningar (dina egna)
- Kontaktförfrågningar du fått/skickat

### Implementering

**Steg 1 -- Ny sida `src/pages/ActivityFeed.tsx`**
- Hämtar data från befintliga tabeller (trials, bookings, connections, player_profiles) med `useQuery`
- Slår ihop alla händelser till en tidslinje sorterad på `created_at`
- Varje händelse visas som ett kort med ikon, beskrivning och tidsstämpel
- Filtrera provträningar på spelarens region

**Steg 2 -- Route i App.tsx**
- Lägg till `/activity` route

**Steg 3 -- Navigation i Header.tsx**
- Lägg till "Aktivitet"-länk med `Activity`-ikonen (redan importerad)

### Tekniska detaljer

Ingen ny databastabell behövs -- allt byggs på befintliga tabeller. Sidan aggregerar data klientsidigt från trials, bookings, connections och profiles. Kräver inloggning för att visa personlig data.

```text
Filer som skapas/ändras:
  src/pages/ActivityFeed.tsx    -- ny sida
  src/App.tsx                   -- ny route
  src/components/layout/Header.tsx -- ny nav-länk
```

