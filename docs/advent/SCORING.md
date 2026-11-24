# Bodovanje — Adventska kviz liga

Dokument definira **MVP pravila**. Implementacija mora biti u **jednoj serverskoj funkciji** (i odgovarajućem Vitest testu) kako bi klijent i admin uvijek imali isti izvor istine.

## Pregled

Za svaki dan korisnik dobiva **jedan set bodova** (`score` u `advent_attempts`). **Ukupni rezultat sezone** = zbroj `score` po svim danima u kojima je korisnik odigrao. Ljestvica sortira po ukupnom zbroju.

## Struktura pitanja (MVP)

- **Jedno pitanje po danu**
- Tipovi dopušteni u MVP-u:
  - **Jedan točan izbor** (radio, 4 opcije)
  - **Točno / netočno** (2 opcije)
- Multi-select i slobodan unos — **nije** u MVP-u

## Sustav bodovanja

**FILOZOFIJA:** Znanje je primarno, brzina je sekundarna. Točan odgovor garantira većinu bodova, a brzina daje dodatnu prednost.

### Osnovni bodovi

| Ishod | Bodovi |
|-------|--------|
| Netočan odgovor | **0** bodova (bez obzira na brzinu) |
| Točan odgovor | **70–100** bodova (ovisno o brzini) |

**Maksimalni bodovi po pitanju:** 100

Točnost odlučuje server usporedbom s ključem iz `src/data/advent-league/` (ili serverskog cachea), **ne** klijentskim flagom.

## Timer i bodovna ljestvica

### Mjerenje vremena

- Klijent šalje `started_at` (ISO 8601) pri otvaranju pitanja
- `submitted_at` na serveru = vrijeme primitka zahtjeva (**server authoritative** za kraj)
- `duration_ms = submitted_at - started_at` (ograničeno na max **120 000 ms** / 2 min)

### Bodovna ljestvica za točan odgovor

**Linearna interpolacija** između ključnih točaka (deterministički sustav bez nasumičnosti):

| Trajanje | Bodovi | Obrazloženje |
|----------|--------|--------------|
| **≤ 5s** | **100** | Instant recall, izvrsno znanje |
| **≤ 15s** | **95** | Vrlo brzo, jako dobro |
| **≤ 30s** | **85** | Prosječna brzina, solidno znanje |
| **≤ 60s** | **75** | Sporije, ali točan odgovor |
| **> 60s** | **70** | Bazni minimum za znanje |

**Formula za interpolaciju:**
```python
if vrijeme <= 5s:     bodovi = 100
elif vrijeme <= 15s:  bodovi = 100 - (vrijeme - 5) / 10 * 5   # 100→95
elif vrijeme <= 30s:  bodovi = 95 - (vrijeme - 15) / 15 * 10  # 95→85
elif vrijeme <= 60s:  bodovi = 85 - (vrijeme - 30) / 30 * 10  # 85→75
else:                 bodovi = 70
```

Rezultat se zaokružuje na **cijeli broj**.

**Primjeri:**
- 3s → 100 bodova
- 10s → 98 bodova (interpolacija)
- 20s → 92 boda (interpolacija)
- 45s → 80 bodova (interpolacija)
- 90s → 70 bodova (minimum)

**Ključna razlika od prijašnjeg sustava:** Brzina više ne može dati 50% ukupnih bodova (bilo max 150). Sada je maksimum 100, pri čemu znanje daje 70% (garantiranih 70 za točan odgovor), a brzina samo do 30% prednosti (100 - 70).

### Zaštita od zloupotrebe timera

- Odbij predaju ako `started_at` nije unutar zadnjih **15 minuta** prije `submitted_at` (pitanje mora biti „svježe” otvoreno).
- Odbij predaju ako `duration_ms < 500` (anti-bot prag — prilagodivo u testu).
- Odbij predaju ako dan na serveru (`day_key`) ≠ dan iz zahtjeva.

## Dnevni rezultati

- Jedan red u `advent_attempts` po (`user_id`, `day_key`).
- Ponovna predaja istog dana → HTTP **409** s porukom „Današnji kviz je već odigran.”
- Prikaz korisniku nakon predaje:
  - točnost (da/ne)
  - bodovi dana
  - trajanje (sekunde, zaokruženo)
  - ukupni bodovi sezone (ponovno izračunati ili iz cache agregata)

Propušten dan: **0 bodova**, bez automatskog unosa reda — korisnik jednostavno nema zapis za taj `day_key`.

## Ukupni rezultati sezone

```sql
total_score(user) = SUM(total_score) FROM advent_day_attempts 
                    WHERE user_id = ? AND completed = 1 AND day_key IN season_days
```

- `season_days` = lista validnih datuma sezone (1.-24. prosinca)
- `days_played` = COUNT završenih dana u sezoni
- **Maksimalni mogući rezultat sezone:** 24 000 bodova (24 dana × 1000 bodova)
- **Realistični raspon za "savršen" rezultat:** 16 800 - 24 000 (sve točno, različite brzine)

## Ljestvica i tie-break pravila

**Sortiranje (deterministički, bez nasumičnosti):**

1. **`total_score` DESC** — veći ukupni broj bodova pobjeđuje
2. **`days_played` DESC** — pri izjednačenom rezultatu, više odigranih dana pobjeđuje (24/24 > 20/24 pri istom zbroju)
3. **`earliest_last_submit` ASC** — pri daljnjem izjednačenju, tko je ranije završio **zadnji** odigrani dan (`MAX(submitted_at)` manji = bolji)
4. **`user_id` ASC** — finalni deterministički red ako je i dalje izjednačeno

### Primjer tie-break scenarija

| Korisnik | Bodovi | Odigrano | Zadnji submit | Pozicija |
|----------|--------|----------|---------------|----------|
| Ana | 18500 | 24/24 | 2026-12-24 20:00 | **1.** |
| Marko | 18500 | 24/24 | 2026-12-24 21:30 | **2.** (kasnije završio) |
| Ivana | 18500 | 23/24 | 2026-12-23 19:00 | **3.** (manje dana) |
| Petar | 18400 | 24/24 | 2026-12-24 18:00 | **4.** (manje bodova) |

**Obrazloženje:** Ana i Marko imaju iste bodove i isti broj dana, ali Ana je završila zadnji dan ranije (20:00 vs 21:30) → Ana je viša.

### Prikaz na ljestvici (MVP)

- `username` iz tablice `users` (ne puni email)
- `total_score`, `days_played`
- Top 50; vlastita pozicija samo ako je korisnik prijavljen i API to podrži u MVP-u (opcionalno `GET /api/advent/me` s `rank`)

## Edge slučajevi

| Slučaj | Ponašanje |
|--------|-----------|
| Igra prije početka sezone | 403 / poruka „Liga još nije počela.” |
| Igra nakon kraja sezone | Pregled ljestvice i povijesti; nova predaja onemogućena |
| Korisnik bez `email_verified` | Uskladiti s ostatkom MojPuta (ako forum/kviz traži verifikaciju — provjeri `server.cjs` pri implementaciji) |
| Promjena `username` | Ljestvica pokazuje trenutno ime |

## Verzioniranje pravila

- Polje `scoring_version` u metapodacima sezone (JSON) ili u svakom pokušaju — omogućava analizu ako se pravila promijene mid-season (**izbjegavati** u produkciji).
- MVP: jedna verzija `1` za cijelu sezonu.