

## Plan: Roadmap till produktionsklar SportsIN inom 4 månader

### Nuläge

Plattformen har en solid grund med ~20 sidor, databaskoppling, roller och grundläggande funktionalitet. Men mycket är fortfarande halvfärdigt eller saknar den polish som krävs för riktiga användare.

---

### Fas 1 -- Kärnfunktionalitet & UX-polish (Månad 1-2)

**1. Design-pass: Modern & enkel**
- Förenkla alla sidor -- ta bort visuellt brus, öka whitespace
- Konsekvent typografi och spacing genom hela appen
- Mobilanpassning på varje sida (flera sidor ser klumpiga på mobil nu)
- Förbättra landningssidan med tydligare CTA och snabbare onboarding-flöde
- Dark mode som default för inloggade användare

**2. Registrering & Onboarding**
- Steg-för-steg onboarding efter registrering beroende på roll (spelare fyller i position/ålder, klubb fyller i klubbinfo, personal fyller i tjänster)
- Profilkompletthetsindikator ("Din profil är 60% klar")
- Automatisk redirect till rätt dashboard efter registrering

**3. Spelarprofil (MyProfile + PlayerProfile)**
- Rensa och förenkla layouten -- tydliga sektioner för info, statistik, fysik, highlights
- GPS-västimport (CSV) för fysisk data som diskuterats
- Visa prestationsdata visuellt med grafer istället för bara tabeller
- Profilbild-cropping och bättre avatar-hantering

**4. Klubbdashboard**
- Spelarsökning med avancerade filter direkt i dashboarden
- Sparade spelare med anteckningar
- Hantera provträningar och se ansökningar tydligare
- Klubbens publika profil med laguppställning och kontaktinfo

**5. Personalvy (Fysio/Tränare)**
- Schema-systemet som redan byggts -- polisha och testa
- Bokningshantering: personal ser inkommande bokningar, kan godkänna/neka
- Ärendebeskrivning synlig för personalen

---

### Fas 2 -- Kommunikation & Interaktion (Månad 2-3)

**6. Meddelanden**
- Realtidsmeddelanden (websockets redan uppsatta)
- Olästa meddelanden-räknare i headern
- Push-notifikationer (browser notifications)
- Möjlighet att skicka bilder/filer i chatten

**7. Connections-systemet**
- Polisha connect/accept-flödet
- Visa gemensamma kontakter
- "Nätverket växer"-notifikationer

**8. Highlights-sidan**
- TikTok-stil vertikal scroll -- redan delvis på plats, behöver polish
- Gilla och kommentera highlights
- Tagga position och klubb i highlights

---

### Fas 3 -- Avancerade features (Månad 3-4)

**9. Notifikationer**
- Centralt notifikationssystem: nya meddelanden, bokningsbekräftelser, connection-requests, provträningsinbjudningar
- E-postnotifikationer för viktiga händelser

**10. Sök & Discovery**
- Förbättrad sökning med autosuggest
- Filtrera spelare på prestationsdata (t.ex. "visa spelare med sprint under 5s")
- Kartvy för klubbar och provträningar

**11. Admin/Moderation**
- Rapportera olämpligt innehåll
- Verifiera profiler (coach-verified, GPS-verified badges som redan designats i CSS)

**12. Provträningar**
- Kalendervy istället för lista
- Automatiska påminnelser
- Resultat/feedback efter provträning

---

### Fas 4 -- Produktionsredo (Månad 4)

**13. Prestanda & Säkerhet**
- Lazy loading på alla sidor
- Bildoptimering (WebP, rätt storlekar)
- RLS-policies audit på alla tabeller
- Rate limiting på API-anrop

**14. SEO & Tillgänglighet**
- Meta-taggar och Open Graph för delning
- Aria-labels och keyboard-navigation
- Sitemap och robots.txt

**15. Lansering**
- Custom domän
- Analytics-integration
- Feedbackformulär för tidiga användare
- Onboarding-guide/tutorial för nya användare

---

### Tekniska detaljer

```text
Prioritetsordning:
┌─────────────────────────────────────┐
│ 1. UX-polish & mobilanpassning     │  ← Gör störst skillnad snabbast
│ 2. Onboarding-flöde                │
│ 3. GPS-import & prestationsgrafer  │
│ 4. Meddelanden & notifikationer    │
│ 5. Sök-förbättringar              │
│ 6. Produktionshärdning            │
└─────────────────────────────────────┘
```

**Sidor att ta bort** (redan statiska/oanvända):
- `/performance` (PerformanceTests.tsx) -- integrerat i profilen
- `/nutrition` (NutritionPlan.tsx) -- ej i scope

**Nya komponenter som behövs:**
- `OnboardingWizard` -- steg-för-steg efter registrering
- `PerformanceChart` -- grafer för fysisk data
- `CSVImporter` -- GPS-västdataimport
- `NotificationCenter` -- centralt notifikationssystem
- `ProfileCompleteness` -- progressbar för profilstatus

Vi tar det steg för steg, en fas i taget. Vilken del vill du börja med?

