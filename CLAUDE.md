# CLAUDE.md — Trobuso

Instructies voor Claude Code bij werk in deze repository. Lees ARCHITECTURE.md voor de volledige technische beschrijving.

## Project in één zin

Bedrijfswebsite voor Trobuso (adviesbureau voor business consultancy, projectmanagement en agile transformaties) — combineert een **statische publieke website** (`public/index.html` + `cms.js`) met een **admin-CMS** (Next.js) waarmee alle 11 secties dynamisch beheerd worden.

## Communicatie

- **Antwoord altijd in het Nederlands** — gebruiker, code, comments, commits en UI zijn allemaal Nederlands.
- Domeintaal is Nederlands: `sectie`, `inhoud`, `gebruiker`. Vertaal niet naar Engels in nieuwe code.

## Stack & belangrijke architectuurkeuzes

- **Next.js 15 App Router + React 18 + TypeScript 5** — Server Components voor data-fetching, `"use client"` alleen waar nodig.
- **Database = SQLite via Prisma ORM 6.19** (`prisma/dev.db`, niet in git). Prisma Client wordt wél gebruikt in runtime-code via singleton in [src/lib/prisma.ts](src/lib/prisma.ts).
- **NextAuth 5 beta** (Credentials provider) + `bcryptjs` voor wachtwoord-hashing. Config in [src/lib/auth.ts](src/lib/auth.ts).
- **Publieke website is statisch** — `public/index.html` wordt direct geserveerd; `public/cms.js` haalt content op via `GET /api/website-content` (60s cache) en vult de DOM. Bij API-fout valt het terug op de statische HTML-fallback.
- **Admin-CMS** zit op `/admin`, alle 11 secties worden bewerkt via één component: [src/components/WebsiteEditor.tsx](src/components/WebsiteEditor.tsx).
- **Deployment = eigen VPS** via PM2 + Nginx (zie [deploy/](deploy/) — `deploy.sh`, `ecosystem.config.js`, `nginx.conf`, `setup-vps.sh`).

## Werkwijze

- **Houd het beknopt.** Geen extra abstracties, helpers of "future-proofing" toevoegen tenzij gevraagd. Drie vergelijkbare regels > voorbarige abstractie.
- **Geen comments** tenzij het *waarom* niet uit de code blijkt. Geen JSDoc/docstrings standaard.
- **Edit bestaande bestanden** liever dan nieuwe aanmaken. Geen losse `*.md` documenten zonder verzoek.
- **Geen emoji's** in code, commits of UI tenzij expliciet gevraagd.
- Bij UI-wijzigingen: test in browser via `npm run dev` voordat je klaar meldt — zowel de publieke `/` als `/admin`. Typecheck alleen ≠ feature-correct.

## Conventies

- **Datamodel is bewust minimaal**: `User` (admin login) + `WebsiteContent` (één rij per sectie, `inhoud` is een JSON-string-blob). Voeg geen extra tabellen toe zonder overleg — de hele site draait op die ene generieke contentstructuur.
- **`sectie` is een unieke string-key** (`hero`, `klanten`, `intro`, `diensten`, `aanpak`, `over`, `cases`, `specialisaties`, `contact`, `footer`, hero-marquee). Wijzig keys niet zonder de bijbehorende `cms.js`-selectors en `WebsiteEditor` UI mee aan te passen.
- **Mutatie-API**: alleen `PUT /api/website-content` met `{ sectie, inhoud }`. Auth-check in de route is verplicht (NextAuth `auth()`).
- **Wachtwoorden**: bcrypt via `bcryptjs`, admin wordt geseed via `prisma/seed.ts` met `ADMIN_EMAIL` / `ADMIN_PASSWORD` uit `.env`.
- **Branding**: kleuren in [tailwind.config.ts](tailwind.config.ts) — `trobuso.900` = `#163E5C` (navy), `800` `#1f5a85`, `700` `#2874a6`. Geen Prospectief- of eHealth-tokens hier.
- **Statische website-styling** staat in `public/styles.css` (geen Tailwind); Tailwind is alleen voor het admin-paneel onder `src/`.

## Wat NIET aanraken zonder overleg

- `public/index.html`, `public/cms.js`, `public/script.js`, `public/styles.css` zijn de live website. Wijzigingen hier zijn direct zichtbaar in productie na deploy.
- `deploy/`-scripts zijn afgestemd op de huidige VPS — pas niets aan zonder bevestiging.
- De JSON-structuur van `inhoud` per sectie ligt vast door zowel `cms.js` (consumer) als `WebsiteEditor.tsx` (producer). Een veld toevoegen vereist beide kanten + een data-migratie voor bestaande rijen.

## Commands

```bash
npm run dev          # dev server (Next.js, /admin én /)
npm run build        # productiebuild
npm run start        # productieserver
npm run setup        # prisma db push + seed (admin + initiële content)
npm run db:push      # schema → SQLite pushen
npm run db:seed      # alleen seeden
npm run db:studio    # Prisma Studio
```

## Omgevingsvariabelen

Zie `.env.example`:
- `NEXTAUTH_URL` — base-URL van de applicatie
- `NEXTAUTH_SECRET` — geheim voor JWT-signing
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — credentials voor de standaard admin-user (gebruikt door seed)

## Gerelateerde projecten (hier NIET aanraken)

- **Onboarding Portaal** — apart project (Prospectief arbodienst), Supabase + Postgres, eigen huisstijl (`#0C1A2C` + `#7D6FCB`).
- **eHealth Innovations** — apart Express-project, geen branding-overlap.
- **AIdvocaat**, **DatamodelEditor**, **Receptenbuddy** — staan elders in `C:/Users/Troos/Documents/`.

## Bij twijfel

- ARCHITECTURE.md is leidend voor bestaande structuur.
- Onbekende state (lock files, vreemde branches, niet-herkende bestanden) → eerst onderzoeken, niet wegmieren.
- Risicovolle of moeilijk omkeerbare acties (force-push, schema-drop, deploy-script aanpassen, mass-delete in `WebsiteContent`) → eerst bevestigen.
