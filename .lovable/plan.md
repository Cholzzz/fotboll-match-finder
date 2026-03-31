

## SportsIN — Roadmap mot "LinkedIn för fotboll"

Plattformen har grunderna: registrering, profiler, sökning, highlights och bokning. Men för att bli ett riktigt ekosystem saknas flera kritiska delar. Här är en prioriterad lista:

---

### 1. Meddelandesystem (databaskopplat)
Messages-sidan är helt hårdkodad. Behöver en `messages`/`conversations`-tabell i databasen med realtime-stöd så att spelare, klubbar och personal faktiskt kan kommunicera.

### 2. Spelarprofil från databas
`/player/:id` visar fortfarande mock-data. Ska hämta från `player_profiles` + `profiles` + `highlights` via Supabase, precis som söksidan nu gör.

### 3. Nätverksfunktion (connections/följare)
Kärnan i ett LinkedIn-liknande system. En `connections`-tabell där användare kan skicka kontaktförfrågningar, följa varandra och bygga nätverk. Visar "X kontakter" på profilen.

### 4. Aktivitetsflöde / Nyhetsflöde
En feed på startsidan (för inloggade) som visar: nya highlights uppladdade, profiländringar, provträningar publicerade, nya kontakter. Tabell `activity_feed` eller genereras från andra tabellers ändringar.

### 5. Provträningar (databaskopplade)
`/trials` är hårdkodad. Klubbar ska kunna skapa provträningar, spelare anmäla sig. Tabeller: `trials` + `trial_applications`.

### 6. Rekommendationer & Endorsements
Personal och klubbar ska kunna skriva rekommendationer om spelare (som LinkedIn-endorsements). Tabell `recommendations` med synlighet på spelarprofilen.

### 7. Notifikationer
Realtime-notiser för nya meddelanden, kontaktförfrågningar, bokningsbekräftelser, provträningsinbjudningar. Tabell `notifications` + bell-ikon i headern.

### 8. Statistik & Prestationsdata från databas
Säsongsstatistik och fysiska tester på spelarprofilen är hårdkodade. Tabeller `season_stats` + `physical_tests` med verifieringsnivåer.

### 9. Sök personal från databas
`/search-staff` använder troligen mock-data. Koppla till `staff_profiles` + `profiles` precis som spelarsökningen.

### 10. Profilsynlighet & Integritetsinställningar
Spelare ska kunna välja vad som är publikt vs. privat (t.ex. visa statistik bara för klubbar som de har kontakt med).

---

### Rekommenderad ordning

| Prio | Funktion | Varför |
|------|----------|--------|
| 1 | Spelarprofil från DB | Grundläggande — profiler måste visa riktig data |
| 2 | Meddelandesystem | Kärnan i kommunikation |
| 3 | Connections/nätverk | Det som gör det till "LinkedIn" |
| 4 | Provträningar från DB | Koppling spelare ↔ klubbar |
| 5 | Aktivitetsflöde | Engagemang och återbesök |
| 6 | Notifikationer | Håller användare aktiva |
| 7 | Rekommendationer | Social proof |
| 8 | Statistik från DB | Datadriven differentiering |
| 9 | Sök personal från DB | Komplett ekosystem |
| 10 | Integritetsinställningar | Mognadsfunktion |

Vilken/vilka vill du börja med?

