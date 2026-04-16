import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const secties = [
  {
    sectie: "hero",
    inhoud: JSON.stringify({
      eyebrow: "Business-IT alignment · Digitalisering · Projectmanagement · Agile",
      titel_voor_accent: "Wij maken",
      titel_accent: "complexe",
      titel_na_accent: "verandering",
      titel_italic: "werkbaar.",
      beschrijving:
        "Wij verbinden business en IT in complexe, vaak bestuurlijk gevoelige omgevingen. Van digitalisering van bedrijfsprocessen en informatievoorziening tot strategische Business-IT alignment – wij vertalen ambitie naar resultaat.",
      cta_primair: "Ontdek onze diensten",
      cta_secundair: "Plan een gesprek →",
      marquee: [
        "Business-IT alignment", "Digitalisering", "Strategie", "Transformatie",
        "Scrum", "SAFe", "Projectmanagement", "Kanban",
        "Leiderschap", "Verandermanagement",
      ],
    }),
  },
  {
    sectie: "intro",
    inhoud: JSON.stringify({
      titel_voor_accent: "Wij verbinden",
      titel_accent: "business",
      titel_na_accent: "aan",
      titel_italic: "technologie.",
      alinea_1:
        "Trobuso staat voor resultaatgericht adviseren met een praktische instelling. Wij helpen organisaties hun business- en IT-strategie op één lijn te brengen, digitaliseren processen en informatievoorziening, en realiseren gedragen oplossingen die aansluiten bij de strategische doelen van de organisatie.",
      alinea_2:
        "Met ruim 15 jaar ervaring in financiële dienstverlening, overheid, verzekeren en onderwijs brengen wij structuur aan in digitale transformaties. Wij combineren een analytisch scherp oog met kennis van Business-IT alignment, Lean Six Sigma, agile werken (Scrum, SAFe) en ketenintegratie.",
    }),
  },
  {
    sectie: "diensten",
    inhoud: JSON.stringify({
      eyebrow: "01 — Diensten",
      titel: "Wat wij",
      titel_italic: "doen.",
      items: [
        {
          nummer: "01",
          titel: "Business\nConsultancy",
          beschrijving:
            "Wij analyseren processen, informatievoorziening en organisatie-inrichting. Met kennis van Business-IT alignment, Lean Six Sigma en business analysis brengen wij knelpunten in kaart en ontwerpen wij gedragen oplossingen – van digitalisering tot strategische transformatie.",
          bullets: [
            "Business-IT alignment & strategisch advies",
            "Digitalisering van bedrijfsprocessen",
            "Business analyse & requirementsmanagement",
            "Procesontwerp & -optimalisatie (Lean Six Sigma)",
            "Informatiemanagement & datalandschap",
            "Impactanalyse wet- en regelgeving",
          ],
        },
        {
          nummer: "02",
          titel: "Project­\nmanagement",
          beschrijving:
            "Wij leiden digitaliseringsprojecten en programma's waarin business, IT en ketenpartners samenkomen. Van projectplan en sturing tot leveranciersselectie en implementatie – met scherpe governance en heldere communicatie richting stakeholders en directie.",
          bullets: [
            "Digitale transformatieprogramma's",
            "Project- en programmamanagement",
            "Projectplan, planning & sturing",
            "Leveranciersselectie & contractering",
            "Verandermanagement & implementatie",
            "PMO & portfoliomanagement",
          ],
        },
        {
          nummer: "03",
          titel: "Agile\nWerken",
          beschrijving:
            "Wij begeleiden teams en organisaties in de transitie naar agile werken. Als scrummaster, product owner of coach zorgen wij voor voorspelbaar opleveren en continue verbetering – van enkele teams tot SAFe op schaal.",
          bullets: [
            "Scrum (PSPO) & SAFe",
            "Agile business analysis (BCS)",
            "Product ownership & backlogmanagement",
            "Scrummaster & teambegeleiding",
            "Agile transformatie & coaching",
          ],
        },
      ],
    }),
  },
  {
    sectie: "aanpak",
    inhoud: JSON.stringify({
      eyebrow: "02 — Aanpak",
      titel: "Hoe wij",
      titel_italic: "werken.",
      stappen: [
        { nummer: "/01", titel: "Luisteren", beschrijving: "Wij brengen de situatie in kaart via interviews en workshops met stakeholders uit alle lagen – van uitvoering tot MT. Zo ontstaat een scherp beeld van knelpunten, doelen en randvoorwaarden." },
        { nummer: "/02", titel: "Ontwerpen", beschrijving: "Op basis van requirements en analyses stellen wij een plan van aanpak, roadmap en oplossingsscenario's op. Met heldere keuzes en een gedragen business case als vertrekpunt." },
        { nummer: "/03", titel: "Uitvoeren", beschrijving: "Wij realiseren iteratief en pragmatisch – samen met scrumteams, leveranciers en de lijn. Sturen op voortgang, kwaliteit en doorlooptijd, en tijdig bijsturen waar nodig." },
        { nummer: "/04", titel: "Borgen", beschrijving: "Wij dragen kennis over aan medewerkers en management, coachen waar nodig en zorgen dat de nieuwe werkwijze verankert in processen, systemen en governance." },
      ],
    }),
  },
  {
    sectie: "over",
    inhoud: JSON.stringify({
      eyebrow: "03 — Over Trobuso",
      titel: "Mensen maken",
      titel_italic: "het verschil.",
      alinea_1: "Trobuso is opgericht vanuit de overtuiging dat échte digitale verandering ontstaat door mensen, processen en technologie met elkaar te verbinden. Wij geloven in een pragmatische aanpak waarin Business-IT alignment, ontwerp en uitvoering hand in hand gaan – en waarin draagvlak even belangrijk is als inhoud.",
      alinea_2: "Onze adviseurs beschikken over een academische achtergrond (MSc Management Consultancy, BSc Bedrijfskundige Informatica) en bewezen ervaring bij toonaangevende organisaties in overheid, financiële dienstverlening, verzekeren en onderwijs.",
      stats: [
        { waarde: "15+", label: "jaar ervaring" },
        { waarde: "20+", label: "grote opdrachten" },
        { waarde: "12+", label: "toonaangevende klanten" },
      ],
    }),
  },
  {
    sectie: "cases",
    inhoud: JSON.stringify({
      eyebrow: "04 — Cases",
      titel: "Bewezen",
      titel_italic: "resultaat.",
      items: [
        { tag: "Onderwijs · TU Delft · 2024–heden", titel: "Platform voor open cursussen", beschrijving: "Als projectleider/business analist de \"discover & design\"-fase geleid voor een nieuw platform om open cursussen en leermaterialen te delen. Requirements geïnventariseerd, LMS/CMS-oplossingen onderzocht en advies over solution architectuur en leverancierskeuze opgeleverd." },
        { tag: "Verzekeren · TVM · 2023–2024", titel: "Datalandschap bij applicatievervanging", beschrijving: "Als business analist / product owner de informatievoorziening heringericht bij vervanging van de verzekeringstechisnche applicatie (Axon) en het financiële systeem. Datamodellen ontworpen, scrumteams aangestuurd en dashboards met tactische en strategische informatie opgezet." },
        { tag: "Overheid · Belastingdienst · 2021–2022", titel: "Risicomanagement & informatiehuishouding", beschrijving: "Risicomanagement geïmplementeerd binnen Concern Communicatie, bijdragend aan het in-control statement. Daarnaast de informatiehuishouding op orde gebracht: volwassenheid vastgesteld, ordeningsstructuur opgezet en medewerkers gecoacht." },
        { tag: "Overheid · UWV · 2018–2021", titel: "Wet- en regelgeving & NOW", beschrijving: "UWV geadviseerd en begeleid bij de implementatie van nieuwe wet- en regelgeving en de digitalisering van handmatige processen. Coördinator van de implementatie NOW (Noodoverbrugging Werkgevers) binnen de divisie DIV en transformatie naar agile werken." },
        { tag: "Verzekeren · ARAG · 2017–2018", titel: "KEI – Digitaliseren Rechtspraak", beschrijving: "ARAG begeleid bij de implementatie van de nieuwe werkwijze van de Rechtspraak (KEI). Business- en IT-architectuur in Archimate ontworpen, digitale processen en koppeling met het IT-landschap opgezet, leveranciersselectie uitgevoerd en geadviseerd over CMS en website." },
        { tag: "Bank · de Volksbank (SNS) · 2014–2015", titel: "PERDARR – betrouwbare rapportageketens", beschrijving: "Verantwoordelijk voor de implementatie van PERDARR, wet- en regelgeving vanuit het Basel-comité. Ontwikkeling van een PERDARR-keurmerk voor rapportages gecoördineerd, impact op processen bepaald en ketenmanagement ingericht." },
        { tag: "Verzekeren · Aon · 2014", titel: "Digitalisering brokerproces", beschrijving: "Een grote intermediair geadviseerd over digitalisering en optimalisatie van het brokerproces, waar 80% van de gegevens viermaal werd ingevoerd. Gegevensanalyse en Fit/Gap over vier systemen uitgevoerd en een business case met doelsysteem opgeleverd." },
        { tag: "Bank · ABN AMRO · 2011–2012", titel: "Transitie naar digitale bank", beschrijving: "Het programma op tactisch en operationeel niveau geadviseerd over de inrichting van het Programma Management Office bij de transitie naar een digitale bank. Daarnaast voor de internationale uitrol referentieprocessen in Aris opgezet met een netwerk van experts." },
        { tag: "Verzekeren · a.s.r. · 2011", titel: "Outsourcing & nieuwe processen", beschrijving: "Als business analist de totstandkoming van nieuwe processen gecoördineerd toen deze pensioenverzekeraar zijn geoutsourcete activiteiten onderbracht bij een andere partij. Kennis van processen en aansturing van partijen samengebracht in een werkend geheel." },
        { tag: "Verzekeren · Achmea · 2010–2013", titel: "CRM-migratie & procesherontwerp", beschrijving: "Achmea geadviseerd bij migratie van twee CRM-systemen naar SAP CRM (requirements, Fit/Gap, gegevensanalyse, opleidingsplan) en processen van een nieuwe commerciële divisie ontworpen met Lean Six Sigma. Daarnaast de PGB-processen en financiële datakwaliteit verbeterd." },
      ],
    }),
  },
  {
    sectie: "specialisaties",
    inhoud: JSON.stringify({
      eyebrow: "05 — Specialisaties",
      titel: "Waar wij",
      titel_italic: "in uitblinken.",
      items: [
        {
          titel: "Business-IT alignment",
          beschrijving: "Wij brengen business en IT bij elkaar rond gedeelde doelen. Van strategische roadmaps en portfoliomanagement tot governance en samenwerking op de werkvloer – zodat investeringen in technologie aantoonbaar bijdragen aan organisatiedoelen en digitale ambities.",
          bullets: ["Enterprise- en domeinarchitectuur", "IT-strategie & roadmapping", "Portfolio- en demandmanagement", "Governance & besturing", "Ketensamenwerking"],
        },
        {
          titel: "Digitalisering & AI",
          beschrijving: "Wij helpen organisaties handmatige processen te digitaliseren, informatievoorziening te moderniseren en AI waardevol in te zetten. Van het vervangen van legacy-systemen en het inrichten van data-gedreven dashboards tot het identificeren en implementeren van AI-toepassingen – met oog voor adoptie, haalbaarheid, ethiek en een sluitende business case.",
          bullets: ["Procesdigitalisering & automatisering", "AI-strategie & use-case-selectie", "Applicatie- en systeemvervanging", "Data-architectuur & dashboarding", "Verantwoorde AI & AI Act compliance", "Digitale klantreizen", "Change management bij digitale transformatie"],
        },
        {
          titel: "Artificial Intelligence",
          beschrijving: "Wij helpen organisaties AI waardevol én verantwoord in te zetten. Van strategie en use-case-selectie tot implementatie, adoptie en governance – met oog voor ethiek, privacy en wetgeving.",
          bullets: ["AI-strategie & roadmap", "Use-case-portfolio", "Verantwoorde AI & AI Act", "Adoptie & change"],
        },
      ],
    }),
  },
  {
    sectie: "contact",
    inhoud: JSON.stringify({
      eyebrow: "06 — Contact",
      titel: "Klaar om te",
      titel_italic: "starten?",
      beschrijving: "Een vraagstuk, een project of gewoon eens sparren over mogelijkheden? Neem contact op – we plannen graag een vrijblijvende kennismaking.",
      email: "info@trobuso.nl",
      telefoon: "06 41 00 07 76",
      telefoon_link: "+31641000776",
      adres_regel_1: "Zeijerveen 5",
      adres_regel_2: "3825 RM Amersfoort",
      cta: "Stuur een bericht →",
    }),
  },
  {
    sectie: "footer",
    inhoud: JSON.stringify({
      beschrijving: "Complexe verandering werkbaar maken. Business consultancy, projectmanagement en agile.",
      kvk: "KvK 95333770",
      iban: "IBAN NL71 INGB 0110 2456 44",
      adres_regel_1: "Zeijerveen 5",
      adres_regel_2: "3825 RM Amersfoort",
      email: "info@trobuso.nl",
      telefoon: "06 41 00 07 76",
    }),
  },
  {
    sectie: "klanten",
    inhoud: JSON.stringify({
      eyebrow: "Vertrouwd door",
      items: [
        { naam: "UWV", logo: "logos/uwv.svg" },
        { naam: "Belastingdienst", logo: "logos/belastingdienst.svg" },
        { naam: "TU Delft", logo: "logos/tudelft.svg" },
        { naam: "DCMR", logo: "logos/dcmr.svg" },
        { naam: "TVM", logo: "logos/tvm.svg" },
        { naam: "Volksbank", logo: "logos/volksbank.svg" },
        { naam: "ASR", logo: "logos/asr.svg" },
        { naam: "ING", logo: "logos/ing.svg" },
        { naam: "ABN AMRO", logo: "logos/abnamro.svg" },
        { naam: "Arag", logo: "logos/arag.png" },
        { naam: "AON", logo: "logos/aon.svg" },
        { naam: "Achmea", logo: "logos/achmea.svg" },
      ],
    }),
  },
];

async function main() {
  console.log("🌱 Seeding Trobuso database...");

  // Admin user
  const email = process.env.ADMIN_EMAIL || "admin@trobuso.nl";
  const password = process.env.ADMIN_PASSWORD || "Trobuso2024!";
  const hash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash: hash },
    create: { email, name: "Admin", passwordHash: hash },
  });
  console.log(`  👤 Admin: ${email}`);

  // Website content
  for (const s of secties) {
    await prisma.websiteContent.upsert({
      where: { sectie: s.sectie },
      update: { inhoud: s.inhoud },
      create: s,
    });
    console.log(`  ✅ ${s.sectie}`);
  }

  console.log("\n🌱 Seed voltooid!");
  console.log(`  Admin login: ${email} / ${password}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
