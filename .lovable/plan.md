

## Plan: Gör plattformen komplett -- träningsdata och rensning

Genomgång av vad som saknas/är statiskt och behöver bli funktionellt.

---

### Problem idag

1. **PerformanceTests-sidan** -- helt statisk informationssida, ingen faktisk datainmatning
2. **NutritionPlan-sidan** -- helt statisk med hårdkodade värden, ingen koppling till databasen
3. **Statistik** finns och fungerar redan (player_statistics-tabellen + formulär i MyProfile)
4. Sidorna Performance och Nutrition tillför inget användbart -- de är bara "förklaringssidor"

### Lösning: Integrera träningsdata direkt i spelarprofilen

Istället för separata sidor som inte gör något -- flytta in allt värdefullt i spelarprofilen där det faktiskt används.

**Steg 1 -- Ny databastabell `player_performance`**
```
player_performance:
  user_id (uuid), test_type (text), test_name (text),
  value (numeric), unit (text), verified_by (text),
  created_at (timestamptz)
```
RLS: alla kan läsa, spelare kan skriva sin egen data.

**Steg 2 -- Lägg till "Fysik"-flik i MyProfile**
- Ny flik bredvid Statistik i MyProfile
- Formulär för att mata in fysiska testresultat: sprint (40m), Yo-Yo, hopptest, etc.
- Dropdown för testtyp, input för resultat + enhet
- Spara till `player_performance`-tabellen

**Steg 3 -- Visa fysisk data på PlayerProfile**
- Ny flik "Fysik" på den publika spelarprofilen
- Visar alla testresultat i en snygg grid med ikoner
- Sorterat på testtyp

**Steg 4 -- Rensa bort statiska sidor**
- Ta bort PerformanceTests och NutritionPlan från routing och navigation (de tillför inget som funktionella sidor)
- Alternativt: behåll Performance som en "info"-länk men ta bort den från huvudnavigationen

### Tekniska detaljer

```text
Ny tabell:
  player_performance: user_id, test_type, test_name, value, unit,
                      verified_by (default 'self'), created_at

Filer som ändras:
  src/pages/MyProfile.tsx         -- ny "Fysik"-flik med formulär
  src/pages/PlayerProfile.tsx     -- ny "Fysik"-flik som visar data
  src/App.tsx                     -- ta bort /performance och /nutrition routes
  src/components/layout/Header.tsx -- ta bort Performance/Nutrition från nav
```

Resultatet: spelaren fyller i sin träningsdata (sprint, hopp, uthållighet) direkt i sin profil, och klubbar ser det direkt på spelarens publika profil -- allt på ett ställe, enkelt och komplett.

