# Adventska liga — referral tracking

## Svrha

Mjerimo koliko korisnika dolazi dijeljenjem rezultata i pozivnih linkova. **Ne utječe na bodovanje kviza** i nema financijskih nagrada.

## Referral link

1. Prijavljeni korisnik: `GET /api/advent/referral/me` (auth) → `{ code, shareUrl }`
2. Kod je nasumičan alfanumerički niz (nije user ID ni email)
3. Link: `https://mojput.com/adventska-liga?ref=<code>&utm_source=advent_share&utm_medium=referral`
4. Ugrađeno u share tekst nakon kviza (kad je korisnik prijavljen)

## Tok posjetitelja

1. Posjetitelj otvara link s `?ref=`
2. Frontend (`AdventskaLiga`, `AdventQuiz`) sprema kod u `localStorage` (30 dana) i poziva  
   `POST /api/advent/referral/track-visit` (javno, opcionalna prijava)
3. Jedan visit po sesiji + hash posjetitelja (HMAC IP + UA) — **ne sprema se sirovi IP**

## Registracija / prijava

1. Nakon uspješne prijave ili verifikacije koda (`rememberAuthResponse` u `auth.ts`) poziva se  
   `POST /api/advent/referral/claim` s kodom iz storagea
2. Jedan referral po novom korisniku (`advent_referral_signups.referred_user_id` UNIQUE)
3. Samoreferecija blokirana; claim samo u prvih **72 h** nakon kreiranja računa
4. Ne mijenja bodove ni rang u ligi

## Zaštita od manipulacije

| Mjera | Opis |
|--------|------|
| Anonimni visitor_hash | HMAC(SALT, IP + skraćeni UA) |
| Rate limit | Max 8 visita / hash / dan / kod |
| Dedup | Isti hash + kod unutar 1 h |
| Self-referral | Odbijeno na visit i claim |
| Jedan claim | Jedan referred user ikad |

## Privatnost

- Javni linkovi ne sadrže email ili user ID
- Visit tablica čuva samo hash, ne IP
- Admin vidi zbirne brojeve i **username** referrera (postojeći admin pristup), ne emailove pozvanih

## Admin

- `GET /api/admin/advent/stats` — uključuje `referrals` blok
- `GET /api/admin/advent/referrals/stats` — samo referral metrike + top 25 referrera

## Tablice (SQLite / Postgres)

- `advent_referral_codes` — user_id ↔ code
- `advent_referral_visits` — zapisani posjeti
- `advent_referral_signups` — uspješno povezane nove registracije

## Testiranje

```bash
node --test server/adventLeagueReferral.test.cjs
npm run test -- src/lib/adventLeagueReferral.test.ts
```

**Ručni smoke test**

1. Korisnik A završi kviz → share link sadrži `ref=`
2. Inkognito prozor → otvori link → provjeri mrežni poziv `track-visit`
3. Registracija novog korisnika B unutar 72 h → `claim` → admin stats +1 signup
4. Korisnik A otvara vlastiti link → visit nije zabilježen (self)