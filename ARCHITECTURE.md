# Architectuur — Trobuso

**Laatste update:** 2026-04-16

## Projectdoel

Trobuso is een bedrijfswebsite voor een adviesbureau gespecialiseerd in business consultancy, projectmanagement en agile transformaties. Het project combineert een **publieke website** (statische HTML) met een **admin-paneel** (CMS) waarmee alle websitecontent dynamisch beheerd wordt.

## Technologieën

| Laag           | Technologie                          |
|----------------|--------------------------------------|
| Framework      | Next.js 15 (React 18, TypeScript 5)  |
| Styling        | Tailwind CSS 3.4 + custom kleurenpalet |
| Database       | SQLite via Prisma ORM 6.19           |
| Authenticatie  | NextAuth 5 (beta) + bcryptjs         |
| Iconen         | Lucide React                         |
| Build tooling  | PostCSS, Autoprefixer, tsx           |

## Mappenstructuur

```
├── public/                     # Statische website (geserveerd op /)
│   ├── index.html              # Hoofdpagina HTML-template
│   ├── cms.js                  # Haalt content op van API en vult pagina
│   ├── script.js               # Client-side interactie (scroll, menu)
│   ├── styles.css              # Website-styling
│   └── logos/                  # Klant-/partnerlogo's (SVG)
│
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root-layout
│   │   ├── globals.css         # Tailwind CSS imports
│   │   ├── admin/
│   │   │   ├── layout.tsx      # Admin-layout met navigatie en auth-check
│   │   │   ├── page.tsx        # Admin dashboard — laadt WebsiteEditor
│   │   │   └── login/page.tsx  # Inlogpagina (e-mail + wachtwoord)
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts  # NextAuth handler
│   │       └── website-content/route.ts     # Content-API (GET/PUT)
│   │
│   ├── components/
│   │   └── WebsiteEditor.tsx   # CMS-editor: alle 11 secties bewerkbaar
│   │
│   └── lib/
│       ├── auth.ts             # NextAuth-configuratie (credentials provider)
│       └── prisma.ts           # Prisma client singleton
│
├── prisma/
│   ├── schema.prisma           # Databaseschema (User, WebsiteContent)
│   ├── seed.ts                 # Seedscript (admin-gebruiker + initiële content)
│   └── dev.db                  # SQLite-database (niet in git)
│
├── next.config.ts              # Next.js-configuratie
├── tailwind.config.ts          # Tailwind thema met Trobuso-kleuren
├── tsconfig.json               # TypeScript-instellingen (pad-alias @/*)
└── package.json                # Afhankelijkheden en scripts
```

## Databasemodellen

**User** — Admin-gebruikers voor het CMS.
- `id`, `email` (uniek), `name`, `passwordHash`, `createdAt`

**WebsiteContent** — Websitecontent per sectie.
- `id`, `sectie` (uniek), `inhoud` (JSON-blob), `updatedAt`

Er zijn 11 secties: `hero`, `klanten`, `intro`, `diensten`, `aanpak`, `over`, `cases`, `specialisaties`, `contact`, `footer`, en hero-marquee.

## Dataflow

### Publieke website
1. Bezoeker opent `/` → `public/index.html` wordt geserveerd
2. `cms.js` doet een `GET /api/website-content` → haalt alle secties op als JSON
3. Content wordt dynamisch in de HTML geplaatst; bij een fout wordt de statische fallback getoond

### Admin-paneel
1. Beheerder gaat naar `/admin` → wordt doorgestuurd naar `/admin/login` als niet ingelogd
2. Na inloggen (NextAuth credentials) → JWT-sessie wordt aangemaakt
3. `WebsiteEditor` toont alle 11 secties met bewerkbare velden
4. Bij opslaan → `PUT /api/website-content` met `{ sectie, inhoud }` → database wordt bijgewerkt
5. Wijzigingen zijn direct zichtbaar op de publieke website

## API-endpoints

| Methode | Pad                      | Auth  | Beschrijving                    |
|---------|--------------------------|-------|---------------------------------|
| GET     | `/api/website-content`   | Nee   | Alle secties ophalen (60s cache)|
| PUT     | `/api/website-content`   | Ja    | Eén sectie bijwerken            |
| *       | `/api/auth/[...nextauth]`| —     | NextAuth login/sessie-afhandeling|

## Scripts

```bash
npm run dev        # Ontwikkelserver starten
npm run build      # Productiebuild maken
npm run start      # Productieserver starten
npm run setup      # Database initialiseren + seeden
npm run db:studio  # Visuele database-browser openen
```

## Afhankelijkheden (productie)

- `next`, `react`, `react-dom` — Framework
- `@prisma/client` — Database-client
- `next-auth` — Authenticatie
- `bcryptjs` — Wachtwoord-hashing
- `lucide-react` — Iconen

## Omgevingsvariabelen

Zie `.env.example`:
- `NEXTAUTH_URL` — Base-URL van de applicatie
- `NEXTAUTH_SECRET` — Geheim voor JWT-signing
- `ADMIN_EMAIL` — E-mailadres voor de standaard admin
- `ADMIN_PASSWORD` — Wachtwoord voor de standaard admin
