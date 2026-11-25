# MojPut Adventska kviz liga

## Opis projekta

**Adventska kviz liga** je sezonski kviz unutar postojećeg MojPut sustava. Kviz traje **5.–24. prosinca**: prijavljeni korisnici svaki dan rješavaju **10 pitanja**, skupljaju bodove i natječu se na **ljestvici**. Projekt je **dodatak** monorepu MojPuta — ne zasebna aplikacija.

Tehnički se oslanja na:

- **Frontend:** React + Vite (`src/`), rute u `App.tsx`, API preko `src/lib/api.ts` i `src/config/apiBase.ts`
- **Backend:** Express u `server.cjs`, migracije i pristup bazi u `server/appDb.cjs`
- **App baza:** SQLite lokalno ili PostgreSQL (`MOJPUT_DATABASE_URL`) — **ne** Prisma katalog (`prisma/schema.prisma` služi samo za fakultete/studije)
- **Auth:** postojeći JWT (`authMiddleware`), registracija/prijava (`src/lib/auth.ts`), redirect `?next=`

Referentni uzorci u kodu:

- Kampanja s obaveznom prijavom: `src/pages/BozicniGiveaway.tsx`, `POST /api/giveaway`
- Perzistentni kviz rezultat: `career_quiz_results`, `/api/career-quiz/*`
- Dnevni ključ u `Europe/Zagreb`: `getChatDayKey()` u `server/appDb.cjs`, chatbot dnevni limit u `server.cjs`

## Ciljevi

1. **Angažman** — dnevni povratak na MojPut tijekom adventa.
2. **Rast zajednice** — poticaj registracije (slično giveawayu).
3. **Edukacija u kontekstu MojPuta** — pitanja vezana uz školovanje, studij, karijeru i platformu (sadržaj definira uredništvo, ne ovaj dokument).
4. **Minimalan rizik za postojeći sustav** — izolirani API prefiks, nove tablice, bez refaktora jezgrenih modula.
5. **Produkcijska pouzdanost** — svi pokušaji u app bazi (ne JSON datoteke kao giveaway na Renderu).

## Ciljana publika

| Segment | Zašto |
|---------|--------|
| **Srednjoškolci** (`user_type: srednjoskolac`) | Primarna publika MojPut junior iskustva |
| **Studenti** | Sekundarno; ista registracija |
| **Roditelji i profesori** | Mogu sudjelovati; ljestvica jedinstvena po računu |
| **Neregistrirani** | Mogu vidjeti promociju i ljestvicu (ako MVP to dopusti), ali **igranje zahtijeva MojPut račun** |

## Osnovna funkcionalnost

- **Adventski kalendar** — 24 dana; prošli dani pregledni, budući zaključani dok ne nastupi odgovarajući `day_key` u `Europe/Zagreb`.
- **Dnevni kviz** — 10 pitanja, jedan pokušaj po korisniku po danu; bodovi se računaju na serveru.
- **Timer** — mjereno vrijeme od početka do predaje (detalji u [SCORING.md](./SCORING.md)).
- **Ljestvica** — ranking po ukupnim bodovima sezone (agregacija iz pokušaja).
- **Moj rezultat** — stanje dana (odigrano / ne), bodovi dana, ukupno, pozicija (ograničen prikaz u MVP-u dopušten).

## Korisničko iskustvo

### Prvi posjet (neregistriran)

1. Ulaz s početne ili promotivnog linka (npr. `/adventska-liga`).
2. Vidi opis lige, kalendar (zaključana polja bez pitanja), ljestvicu (javni prikaz ako je u MVP-u).
3. Klik na „Igraj danas“ → preusmjerenje na `/prijava?next=/adventska-liga` (isti obrazac kao `BozicniGiveaway`).

### Prijavljeni korisnik

1. Na stranici lige vidi koji je **danas** dan adventa i je li današnji kviz već odigran.
2. Otvara pitanje dana → odgovara unutar vremenskog limita → predaja.
3. Trenutni feedback: točnost, bodovi dana, bonus vremena (ako vrijedi), kratka poruka.
4. Kalendar označava odigrane dane; propušteni dan **ne može** se naknadno igrati u MVP-u (samo trenutni `day_key`).
5. Ljestvica se osvježava nakon predaje (ili na ručno osvježavanje).

### Vizualni i UX standardi

- `Layout`, `PageSeo`, postojeći Tailwind/shadcn uzorci (`components/ui/*`).
- Ton sličan sezonskim kampanjama (giveaway boje dopuštene, ali nije obavezno kopirati 1:1).
- Učitavanje: jasne poruke greške preko `ApiResponse` (`success: false`, `message`).
- PWA i mobilni: tap-friendly gumbi (min. visina kao na giveaway formi).

### Što korisnik ne radi u MVP-u

- Uređivanje pitanja u UI-u
- Timski turniri, privatne lige, dijeljenje na društvene mreže s automatskim slikama
- Integracija u `/profil` (opcionalna kasnija faza)