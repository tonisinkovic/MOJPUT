# Pravila natječaja — MojPut Adventska kviz liga (DRAFT)

> **Status:** radni nacrt za **pravnu provjeru**. Ne objavljivati kao konačan pravni dokument dok advokat ne pregleda sadržaj.  
> **Napomena:** ovaj draft **ne tvrdi** usklađenost s hrvatskim ili EU propisima o nagradnim natječajima, GDPR-om ili potrošačkim pravom.

---

## 0. Pregled postojećeg MojPuta (stanje na današnji dan)

### Politika privatnosti (`/privatnost`)

- Opće kategorije podataka (email, tehnički, analitika).
- GA4 (G-9N7061Q2JN), consent prekidač, bez oglasa.
- **Maloljetni korisnici:** račun od 16 godina ili uz pristanak roditelja/skrbnika; forum bez PII; prava roditelja putem emaila (`mojputhr@gmail.com`).
- **Nema** posebnog poglavlja o natječajima, kviz ligi, ljestvici, referral praćenju ni nagradama.

### Uvjeti korištenja (`/uvjeti`)

- Opća pravila korištenja stranice, ograničenje odgovornosti, link na privatnost.
- **Nema** posebnih odredbi o natječaju, nagradama, ljestvici ili sudjelovanju u igri s elementima nagrade.

### Consent mehanizam

- Analitika: `mojput_analytics_consent` (deny/grant), GA4 consent mode.
- Registracija: potvrda dobi / roditeljskog pristanka (checkbox, nije zasebna verificirana privola za ligu).
- Kviz liga: **nema** zasebnog privola checkboxa pri sudjelovanju (osim općih uvjeta registracije).

### Korisnički podaci relevantni za ligu (tehnički)

| Podatak | Svrha | PII? |
|--------|--------|------|
| MojPut račun (username, email, verifikacija) | Sudjelovanje | Da |
| `advent_day_attempts`, odgovori, bodovi | Bodovanje, ljestvica | Povezano s računom |
| Javna ljestvica (username, bodovi) | Transparentnost | Username je pseudonim; može biti prepoznatljiv |
| Referral: hash posjetitelja, kod, brojevi | Statistika dijeljenja | Ne izravno; hash |
| GA4 advent eventi | Analitika | Agregati; bez emaila u GA |

### Što treba **dodatno definirati** za adventsku ligu

1. Je li ligu **formalno** prikazati kao nagradni natječaj / promotivnu nagradnu igru (prema hrvatskim pravilima) ili kao **edukativnu aktivnost** uz moguće nagrade.
2. **Organizator** — pravna osoba, sjedište, OIB/PDV (trenutno u javnom UI-u nije eksplicitno navedeno).
3. **Nagrade** — stvarni opis, vrijednost, porez, PDV, uvjeti ispunjivosti; trenutno JSON s demo placeholderima (`isDemo: true`).
4. **Objava pobjednika** (ime/nadimak), rok, način kontakta, rok preuzimanja nagrade.
5. **Ljestvica i privatnost** — što je javno, pravo na brisanje vs. integritet natječaja.
6. **Maloljetnici** — može li dijete 12–15 sudjelovati s pristankom roditelja; može li dobiti nagradu; dodatni upiti od pobjednika mlađeg od 18.
7. Povezivanje s **Općim uvjetima** i **Privatnošću** (cross-link ili aneks).
8. **Referral** — transparentnost da ne utječe na bodove.
9. **Izmjene pravila** tijekom sezone (mogu li se mijenjati bodovanje / dani).

---

## 1. Organizator natječaja

**[POTVRDITI S PRAVNIKOM]**

- Naziv organizatora: **MojPut** [dopuniti puni pravni naziv, ako postoji]
- Adresa sjedišta: [dopuniti]
- OIB / matični broj: [dopuniti]
- Kontakt za natječaj: `mojputhr@gmail.com` (isti kao privatnost/kontakt stranica)
- Voditelj obrade podataka u smislu GDPR-a: [dopuniti ako se razlikuje od organizatora]

---

## 2. Naziv i predmet natječaja

- **Naziv:** MojPut Adventska kviz liga [godina iz `season.json`, npr. 2026]
- **Predmet:** Online kviz natjecanje na platformi MojPut — dnevna pitanja o srednjim školama, fakultetima i karijeri, bodovanje i rangiranje na ljestvici.
- **Nagradni / ne-nagradni karakter:** [PRAVNO DOVRŠITI — odabir kategorije natječaja]

---

## 3. Trajanje natječaja

- **Početak:** 1. prosinca [godina] (00:00, vremenska zona `Europe/Zagreb`)
- **Završetak:** 24. prosinca [godina] (23:59, `Europe/Zagreb`)
- **Broj adventskih dana:** 24
- **Pitanja po danu:** 10
- Trenutno otvoreni je **samo današnji dan** (nema nadoknade propuštenih dana u MVP-u).
- Organizator zadržava pravo **produljiti, skratiti ili obustaviti** sezonu u slučaju tehničkih problema ili više sile, uz objavu na `/adventska-liga`. **[POTVRDITI obvezujući način obavijesti]**

---

## 4. Tko može sudjelovati (uvjeti sudjelovanja)

- Fizička osoba s **valjanim MojPut računom** i **potvrđenom e-mail adresom**.
- **Jedan račun = jedna osoba.** Dijeljenje računa, više računa iste osobe ili lažni podaci — razlog diskvalifikacije.
- **Dobna granica:** prema trenutnoj registraciji MojPuta — **16+ godina ili pristanak roditelja/skrbnika** za kreiranje računa. Natječaj **nema dodatnu** dobnu provjeru pri ulasku u kviz.
  - **[PRAVNO DOVRŠITI]** Je li sudjelovanje u natječaju s nagradama dozvoljeno mlađima od 16 uz roditeljski pristanak pri registraciji?
  - **[PRAVNO DOVRŠITI]** Može li sudjelovati korisnik tipa „roditelj” / druge kategorije?
- Sudjelovanje je **dobrovoljno** i **besplatno** (nema kotizacije u MVP-u).
- Zaposlenici organizatora i osobe koje izravno upravljaju sadržajem kviza mogu biti isključeni — **[dopuniti popis ili kriterij]**.

**Povezanost s MojPut uvjetima:** sudionik se obvezuje poštovati opće Uvjete korištenja i Politiku privatnosti.

---

## 5. Način prijave / sudjelovanja

1. Registracija ili prijava na MojPut (`/registracija`, `/prijava`), opcionalno `?next=/adventska-liga`.
2. Potvrda e-maila računa.
3. Ulaz na `/adventska-liga` i pokretanje **današnjeg** kviza (`/adventska-liga/kviz`).
4. Nema zasebne „prijave na natječaj” osim aktivacije računa i igranja dana.

---

## 6. Pravila kviza

- Svaki adventski dan dostupno je **točno 10 pitanja** s **jednim točnim odgovorom** (4 opcije).
- **Jedan završeni pokušaj po korisniku i danu** (ponovno igranje istog dana nije moguće nakon završetka).
- Pitanja se odgovaraju **redom**; preskakanje nije dozvoljeno (server validacija).
- Odgovori se procjenjuju **na serveru**; korisnik ne dobiva točne odgovore prije slanja.
- Maksimalno trajanje po pitanju u sustavu: **15 minuta** od trenutka kada je dopušten odgovor na to pitanje; prebrzi odgovori (< 500 ms) mogu biti odbijeni.
- Korisnik mora imati **stabilnu internet vezu**; gubitak veze nije osnova za ponovni pokušaj osim uz odluku organizatora.

---

## 7. Bodovanje

- **Netočan odgovor:** 0 bodova.
- **Točan odgovor:** 70–100 bodova ovisno o vremenu odgovora (brži točan odgovor može donijeti više bodova, prema formulama objavljenim u tehničkoj dokumentaciji organizatora).
- **Dnevni rezultat:** zbroj bodova svih pitanja tog dana (teoretski raspon 0–1000 za savršen dan).
- **Sezonski rezultat:** zbroj bodova **završenih** dnevnih kvizova tijekom sezone.
- Bodovi se **ne mogu** ručno mijenjati od strane korisnika.

---

## 8. Način određivanja pobjednika

**[PRAVNO DOVRŠITI — definirati kategorije nagrada]**

Predložena struktura (uskladiti s partnerima i stvarnim nagradama):

| Kategorija | Kriterij (nacrt) |
|-----------|------------------|
| Ukupna ljestvica sezone | Najviši zbroj bodova na kraju sezone među kvalificiranim sudionicima |
| Dnevna ljestvica | Najbolji rezultat određenog dana [ako postoje dnevne nagrade] |
| Nagradno izvlačenje | Među svim sudionicima koji ispunjavaju uvjete [npr. završili min. X dana] — **[PRAVNO DOVRŠITI mehanizam izvlačenja]** |

Sudionik mora biti **kvalificiran**: račun u dobrom stanju, bez diskvalifikacije, nagrade nisu demo — **[dopuniti listu uvjeta]**.

---

## 9. Tie-break pravila (uredbe o izjednačenju)

**Ukupna (sezonska) ljestvica** (implementacija u bazi):

1. Veći ukupni broj bodova.
2. Ako je izjednačeno: veći broj **odigranih (završenih) dana**.
3. Ako je izjednačeno: **raniji** završetak zadnjeg odigranog dana.
4. Ako je i dalje izjednačeno: deterministički red po internom ID-u korisnika (korisnik ne vidi ID).

**Dnevna ljestvica:**

1. Veći dnevni broj bodova.
2. Kraće ukupno trajanje odgovora tog dana.
3. Raniji trenutak završetka kviza.
4. Deterministički red po internom ID-u.

Nema nasumičnog ždrijeba pri rangiranju na ljestvici.

---

## 10. Nagrade

- Opis nagrada objavljen je na `/adventska-liga` (sekcija nagrada i partnera), upravljiv kroz admin sustav.
- **Trenutno stanje sustava:** mogući **demo** podaci označeni kao takvi dok organizator ne unese stvarne nagrade i partnere.
- **[PRAVNO DOVRŠITI]** Vrijednost nagrada, PDV, prijava ministarstvu / porezna, rok isporuke.
- Nagrade nisu zamjenjive za gotovinu osim ako organizator izričito ne navede drugačije.
- Partneri koji dodjeljuju nagrade navedeni su uz nagradu (logo, link) kad je dostupno.

---

## 11. Obavještavanje pobjednika

- Pobjednike organizator kontaktira putem **e-mail adrese** povezane s MojPut računom u roku **[X radnih dana]** nakon završetka sezone.
- Pobjednik mora odgovoriti u roku **[Y dana]**; inače organizator može ponuditi nagradu sljedećem rangiranom ili je ne dodijeliti — **[PRAVNO DOVRŠITI]**.
- Javna objava: [ime/nadimak/username na ljestvici / webu — **ograničiti prema dobi i privoli**].

---

## 12. Provjera pobjednika

Organizator može tražiti:

- Potvrdu identiteta (npr. osobna iskaznica — **minimizirati podatke, ne čuvati duže nego nužno**).
- Potvrdu dobi / roditeljski pristanak za mlađe od 18.
- Potvrdu da korisnik nije diskvalificiran (jedan račun, bez manipulacije).

**[PRAVNO DOVRŠITI]** rok čuvanja dokumenata i osnova obrade (ugovor / zakonska obveza).

---

## 13. Diskvalifikacija

Razlozi (neograničen popis — organizator može dopuniti):

- Manipulacija bodova, više računa, dijeljenje odgovora u masovnom obujmu.
- Lažni podaci pri registraciji ili provjeri pobjednika.
- Zloupotreba tehničkih ranjivosti.
- Kršenje Uvjeta korištenja ili ovih Pravila.
- Odbijanje suradnje pri provjeri pobjednika u razumnom roku.

Odluka o diskvalifikaciji može pomicati rang na ljestvici.

---

## 14. Zaštita od manipulacije

Organizator primjenjuje tehničke mjere, uključujući:

- Bodovanje i provjera točnosti **samo na serveru**.
- Jedan pokušaj po danu po korisniku.
- Jedan odgovor po pitanju; redoslijed pitanja.
- Vremenska validacija odgovora.
- Zaštita referral praćenja (rate limit, bez utjecaja na bodove).

Organizator ne jamči da je manipulacija nemoguća, ali zadržava pravo ispitivanja sumnjivih rezultata.

---

## 15. Privatnost i transparentnost

- Javna ljestvica prikazuje **korisničko ime (username)** i bodove, ne e-mail.
- Korisnik bira username pri registraciji — ne bi trebao biti puno ime ako želi privatnost; organizator može savjetovati pseudonim.
- Detalji obrade u **Politici privatnosti** i, ako pravnik preporuči, **Aneksu — Adventska kviz liga**.
- Referral: praćenje dijeljenja linkova **ne mijenja bodove**; posjete se bilježe agregirano / hashirano.

---

## 16. Obrada podataka (sažetak za sudionike)

| Aktivnost | Podaci | Pravna osnova [DOPUNITI] | Rok čuvanja [DOPUNITI] |
|-----------|--------|---------------------------|------------------------|
| Igra kviza | Odgovori, bodovi, trajanje | Izvršenje natječaja / ugovor | Trajanje sezone + [X] |
| Ljestvica | Username, bodovi | Legitimni interes / natječaj | [X] |
| Referral | Hash posjetitelja, kod | Legitimni interes / statistika | [X] |
| Analitika (GA4) | Eventi bez PII | Privola (isključivo) | Prema GA / privola |
| Dodjela nagrade | Identitet, kontakt | Izvršenje nagrade / zakon | [X] |

Kontakt za privatnost: `mojputhr@gmail.com`.

---

## 17. Kontakt

- Pitanja o natječaju i pravilima: `mojputhr@gmail.com`
- Web: `https://mojput.com/adventska-liga`

---

## 18. Moguće izmjene pravila

Organizator može izmijeniti ova Pravila u razumnom roku uz objavu na webu. **[PRAVNO DOVRŠITI]**:

- Mogu li se mijenjati bodovanje ili kriteriji nakon početka?
- Je li potrebna ponovna privola sudionika?
- Vrijede li izmjene samo za buduće dane?

Sudionik koji nastavi sudjelovati nakon objave smatra se upoznatim s izmjenama — **[POTVRDITI s pravnikom]**.

---

## 19. Maloljetnici — posebna pitanja za pravnu provjeru

| # | Pitanje | Kontekst u MojPutu |
|---|---------|-------------------|
| 1 | Je li nagradni natječaj dopušten sudionicima **mlađim od 16** uz roditeljski pristanak pri registraciji, bez dodatnog obrasca? | Registracija ima jedan checkbox, nema dokaza pristanka. |
| 2 | Može li maloljetnik **primiti nagradu** (npr. voucher, roba) i tko potpisuje primopredaju? | Nije definirano. |
| 3 | Treba li **zasebna informacija roditeljima** (privacy notice za djecu) za ligu? | GDPR čl. 8, transparentnost. |
| 4 | Može li se **javno objaviti username** maloljetnika na ljestvici bez roditeljske privole? | Username je javan na leaderboardu. |
| 5 | Referral linkovi — može li dijete **dijeliti** pozivnicu i što se bilježi? | Nema PII u share tekstu; GA eventi. |
| 6 | Pravo na **brisanje računa** vs. integritet ljestvice i arhiva natječaja. | Tehnički podaci u SQLite/Postgres. |
| 7 | Minimalna dob **samo edukacija bez nagrade** vs. puna sudjelovanja s nagradom. | Alternativa za usklađenje. |

Preporuka za proizvod (ne pravni savjet): razmotriti na landing jasno natuknuti dobne uvjete natječaja, link na puna Pravila i status nagrada (demo/stvarno).

---

## 20. Poveznice na postojeće dokumente

- [Politika privatnosti](https://mojput.com/privatnost)
- [Uvjeti korištenja](https://mojput.com/uvjeti)
- Adventska liga (informativna pravila u UI): `/adventska-liga` → sekcija „Kako ligu igraš”

**Planirano (nakon pravne provjere):**

- Javna stranica `/adventska-liga/pravila` ili PDF s ovim tekstom (konačna verzija)
- Kratki link u `AdventRulesSection` i prije prvog kviza
- Aneks u Politici privatnosti samo uz odobrenje pravnika

---

*Verzija drafta: 2026-11-24. Izvor tehničkih činjenica: `season.json`, `adventLeagueLeaderboard.cjs`, `adventLeagueScoring.cjs`, registracija (dobna potvrda), `Privatnost.tsx`, `UvjetiKoristenja.tsx`.*