

## Plan: Add All Registration Roles to the Landing Page

Currently the hero section only shows two CTA buttons: "Jag ar spelare" and "Jag representerar en klubb". The professional roles (coach, physiotherapist, analyst, scout, nutritionist, mental coach) are hidden on the registration page behind a toggle.

### Changes

**File: `src/pages/Index.tsx`**

1. Add a new section after the "For Clubs" section (or replace the final CTA section's content) with a "For Professionals" block that shows all staff roles as clickable cards linking to `/register?role=<role>`.

2. Each card will display the role's icon, Swedish label, and short description — matching the style already used in `Register.tsx`. Cards link directly to `/register?role=coach`, `/register?role=physiotherapist`, etc.

3. Add the missing icon imports (`Stethoscope`, `Search`, `Apple`, `Brain`).

4. Style: Use the existing `card-premium` or `card-dark` styling with the neon accent hover effects already in the design system. Grid layout: 2 columns on mobile, 3 on tablet, 4 on desktop.

### Section Structure

```text
[Badge: "For professionals"]
[Headline: "Professionell personal" or similar]
[Subtitle: short text about joining as staff]

[Coach]  [Physio]  [Analyst]  [Scout]
[Nutritionist]  [Mental Coach]
```

Each card links to `/register?role=<id>` so the registration form pre-selects the correct role.

