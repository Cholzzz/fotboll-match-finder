

## Plan: Fixa alla kärnfunktioner

Genomgång av alla punkter du listade, med status och vad som behöver åtgärdas.

---

### Redan fungerande (behöver inga eller minimala ändringar)
- Registrering spelare/klubb/fysio/tränare/etc -- fungerar
- Glömt lösenord -- finns, fungerar
- Email-bekräftelse vid registrering -- default-inställning, fungerar
- Utloggning -- fungerar
- Spelarprofil: fylla i info, redigera, profilbild, status -- fungerar
- Profilsynlighet (synlig/dold) -- finns i MyProfile
- Spelarlistning med sökfunktion, filter (position, ålder, region, fot) -- fungerar i SearchPlayers
- Provträningar: klubb lägger ut, spelare anmäler sig -- fungerar
- Bokningssystem: fysio/tränare tillgängliga tider, spelare bokar, godkänn/neka -- fungerar
- Meddelanden (real-time chat) -- fungerar
- Notifikationer (bell-ikon i headern) -- finns
- Connections/nätverk -- finns

---

### Buggar och problem att åtgärda

#### 1. Login-redirect pekar på fel route för klubbar
**Problem:** Login.tsx navigerar till `/club-dashboard` men App.tsx har route `/dashboard`.
**Fix:** Ändra Login.tsx rad 42 från `'/club-dashboard'` till `'/dashboard'`.

#### 2. Login-redirect för staff pekar på fel sida
**Problem:** Staff-roller dirigeras till `/search-staff` istället för sin egen profil.
**Fix:** Ändra redirect till `/my-staff-profile` för staff-roller.

#### 3. "Min profil"-länk i header alltid pekar till spelarprofil
**Problem:** Header visar alltid "Min profil" som pekar till `/my-profile` (spelarprofil). Klubbar och staff har egna sidor.
**Fix:** Lägg till rollbaserad redirect i header-dropdown. Klubbar -> `/dashboard`, Staff -> `/my-staff-profile`, Spelare -> `/my-profile`.

#### 4. Avbokningsfunktion saknas
**Problem:** Spelare kan inte avboka sina bokningar.
**Fix:** Lägg till avbokningsknapp i MyProfile dashboard-bokningslistan.

#### 5. Klubbens egen profil/redigeringssida saknas
**Problem:** Klubbar har ingen sida för att redigera sin egen profil (bio, logga, plats). ClubProfile.tsx visar bara publik profil.
**Fix:** Skapa redigerbara fält i ClubDashboard (eller ny flik) för klubbens profilinformation.

#### 6. Sparade spelare persisteras inte
**Problem:** Bevakningslistan i ClubDashboard lagras bara i state (försvinner vid sidladdning).
**Fix:** Skapa en `saved_players`-tabell i databasen och koppla till klubbens dashboard.

---

### Saknade funktioner att bygga

#### 7. Dashboard per roll (saknas delvis)
- **Spelare:** Dashboard finns i MyProfile med bokningar, anmälningar, profilvisningar -- OK
- **Klubb:** Dashboard finns med sökning, bevakningslista, provträningar -- OK (utom sparade spelare-bug ovan)
- **Staff:** Bokningar och intäkter finns i MyStaffProfile -- OK

#### 8. Statistik-fliken på spelarprofilen
**Problem:** Statistik-fliken visar bara "Statistik kommer snart."
**Fix:** Skapa en `player_statistics`-tabell och formulär i MyProfile för att fylla i matcher, mål, assist, gula/röda kort. Visa data i PlayerProfile statistik-fliken.

---

### Implementeringsplan (steg för steg)

**Steg 1 -- Databasmigrering**
- Skapa `saved_players`-tabell (club_user_id, player_user_id, created_at) med RLS
- Skapa `player_statistics`-tabell (user_id, season, matches, goals, assists, yellow_cards, red_cards, minutes_played) med RLS

**Steg 2 -- Fix login-redirect** (Login.tsx)
- Klubb -> `/dashboard`
- Staff -> `/my-staff-profile`
- Spelare -> `/my-profile`

**Steg 3 -- Fix header rollbaserad navigation** (Header.tsx)
- Hämta användarens roll med useQuery
- "Min profil"-länken pekar rätt beroende på roll

**Steg 4 -- Sparade spelare med databas** (ClubDashboard.tsx)
- Ersätt lokal state med Supabase-queries för `saved_players`
- Bookmark-knappen gör insert/delete i tabellen

**Steg 5 -- Klubbprofilredigering** (ClubDashboard.tsx)
- Lägg till en ny flik "Klubbprofil" med formulär för bio, plats, telefon, avatar

**Steg 6 -- Spelarstatistik** (MyProfile.tsx + PlayerProfile.tsx)
- Formulär i MyProfile för att lägga till/redigera säsongsstatistik
- Visa statistiken i PlayerProfile statistik-fliken med snygga kort

**Steg 7 -- Avbokningsfunktion** (MyProfile.tsx)
- Lägg till "Avboka"-knapp på väntande/bekräftade bokningar i spelarens dashboard

**Steg 8 -- Mailnotifikationer**
- Skippar tills du konfigurerat epostdomän (som du nämnde)

---

### Tekniska detaljer

```text
Nya tabeller:
  saved_players: club_user_id (uuid), player_user_id (uuid), created_at
  player_statistics: user_id (uuid), season (text), matches (int), goals (int),
                     assists (int), yellow_cards (int), red_cards (int),
                     minutes_played (int)

Filer som ändras:
  src/pages/Login.tsx           -- fix redirect
  src/components/layout/Header.tsx -- rollbaserad "Min profil"
  src/pages/ClubDashboard.tsx   -- sparade spelare + klubbprofil-flik
  src/pages/MyProfile.tsx       -- statistikformulär + avbokning
  src/pages/PlayerProfile.tsx   -- visa statistik
```

