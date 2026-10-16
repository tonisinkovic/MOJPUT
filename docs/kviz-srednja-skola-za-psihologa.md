# Kviz "Koja je srednja škola za mene?" - stručni opis za psihologa

## Svrha dokumenta

Ovaj dokument opisuje kako na MojPut platformi funkcionira kviz "Koja je srednja škola za mene?", s naglaskom na logiku pitanja, način bodovanja, prikaz rezultata i stručne granice interpretacije. Namijenjen je školskom psihologu, pedagogu ili drugom stručnjaku koji treba procijeniti je li kviz primjeren kao alat za orijentaciju učenika osmih razreda i što bi trebalo promijeniti prije šire uporabe.

Kratka ocjena: kviz je koristan orijentacijski alat za razgovor o interesima, stilovima učenja i mogućim srednjoškolskim smjerovima. Nije psihometrijski standardiziran test, ne daje dijagnozu sposobnosti i ne bi se trebao koristiti kao samostalna odluka o upisu.

## Gdje se kviz nalazi u aplikaciji

Kviz se prikazuje na stranici `src/pages/KvizSrednja.tsx`, a stvarni tijek kviza vodi komponenta `src/components/junior-quiz/JuniorQuizFlow.tsx`.

Glavna logika je podijeljena ovako:

- `src/lib/juniorQuizModel.ts`: tipovi, katalog pitanja, programi, izračun profila učenika.
- `src/lib/juniorQuizEngine.ts`: bodovanje programa, odabir preporuka, razina sigurnosti i objašnjenja.
- `src/lib/juniorQuizSequence.ts`: adaptivni redoslijed pitanja.
- `src/components/junior-quiz/JuniorQuizResults.tsx`: prikaz rezultata učeniku.
- `src/data/junior-quiz/questions.json`: pitanja i učinci odgovora.
- `src/data/junior-quiz/high-school-programs.json`: katalog 39 obitelji srednjoškolskih programa.
- `src/data/junior-quiz/program-profiles.json`: detaljni profili tih programa.

## Što kviz pokušava mjeriti

Kviz ne mjeri "sposobnost" u kliničkom ili psihometrijskom smislu. On prikuplja signale o tome što učeniku trenutno zvuči blisko i uspoređuje ih s profilima srednjoškolskih programa.

Kviz gradi profil učenika kroz nekoliko skupina podataka:

- interesi: tehnologija, matematika, priroda i pokusi, ljudi, jezici, društvo, ekonomija, kreativnost, praktičan rad, priroda i životinje, sport, mediji;
- način razmišljanja: analitičko, praktično, kreativno, verbalno, socijalno, organizacijsko, tehničko, istraživačko;
- način učenja: teorija, praksa, projekti, pokusi, samostalno učenje, grupni rad, ponavljanje, čitanje, zadaci;
- okruženje koje učeniku odgovara: ured, laboratorij, radionica, računalo, teren, priroda, zdravstvo, ljudi, trgovina, studio, učionica, dinamično okruženje;
- vrijednosti: sigurnost, plaća, kreativnost, pomaganje, sloboda, fleksibilnost, stabilno radno vrijeme, napredovanje, poduzetništvo, utjecaj, prestiž, inozemstvo;
- tolerancije ili zahtjevnost: matematika, čitanje, memoriranje, javni nastup, koncentracija, rad s ljudima, fizički napor, preciznost, odgovornost, pritisak;
- namjera nakon srednje škole: rad, fakultet, nesigurnost ili oboje;
- školski kontekst: razred, grad, opći raspon ocjena, omiljeni predmeti, predmeti koji teže idu.

Važno: ovo su konstrukti iz proizvoda, ne validirane psihologijske skale. Nazivi su funkcionalni za algoritam i korisničko objašnjenje.

## Struktura kviza

U katalogu postoji 54 pitanja. Učenik obično ne dobiva svih 54 jer je kviz adaptivan.

Trenutno stanje kataloga:

- 16 početnih "core" pitanja;
- 9 kontekstualnih pitanja;
- 29 pitanja u granama i dodatnim provjerama;
- 39 pitanja s jednim izborom;
- 4 pitanja s višestrukim izborom;
- 9 pitanja na skali 1-5;
- 2 tekstualna pitanja.

Kviz učeniku na uvodu kaže da traje oko 8 minuta i da ima oko 33 pitanja. Testovi u kodu očekuju tipičnu duljinu 31-36 pitanja.

### Sekcije pitanja

Pitanja su podijeljena u četiri korisnički vidljive cjeline:

1. "Što te zanima?"
2. "Kako voliš učiti?"
3. "Još malo o tebi"
4. "O tebi u školi"

Poruka učeniku je namjerno niskog pritiska: nema točnih i netočnih odgovora, ocjene se mogu preskočiti, a rezultat nije odluka.

## Adaptivni tijek

Kviz prvo postavlja široki početni blok od 16 pitanja. Nakon toga sustav izračuna privremeni profil i bira grane koje najviše odgovaraju odgovorima učenika.

Postoji šest glavnih grana:

- zdravstvo i pomaganje;
- tehnologija;
- kreativnost;
- praktičan rad;
- akademski ili gimnazijski smjerovi;
- ljudi, posao, turizam, ekonomija i organizacija.

Grane se biraju prema već prikupljenim signalima. Primjerice, ako učenik pokazuje interes za računala, tehničko razmišljanje i rad za računalom, kviz će uključiti tehnička pitanja. Ako je učenik bliže ljudima, zdravstvu ili turizmu, dobit će pitanja koja razlikuju njegu, medicinu, laboratorij, rad s gostima, sport ili razred.

Na kraju kviz može dodati najviše dva pitanja za razjašnjenje. Ta pitanja se koriste kad su dva programa blizu, kad pripadaju sličnoj obitelji ili kad je učenik napisao konkretnu ideju koju treba potvrditi. Primjer: "Što ti je bliže: Bravar ili strojar?"

## Formati odgovora

Kviz koristi četiri formata:

- izbor jedne opcije;
- izbor više opcija, najčešće s ograničenjem broja odabira;
- ljestvica 1-5;
- kratki tekst.

Ljestvica 1-5 učeniku se ne prikazuje kao broj nego riječima:

- 1: "Baš ne"
- 2: "Malo"
- 3: "Tako-tako"
- 4: "Da"
- 5: "Jako da"

Interno se skala pretvara u raspon 0-100 formulom:

`((odgovor - 1) / 4) * 100`

To znači:

- 1 postaje 0;
- 3 postaje 50;
- 5 postaje 100.

## Kako se iz odgovora gradi profil učenika

Svako pitanje ili opcija može imati učinke na jednu ili više dimenzija profila. Primjerice, odgovor o izradi igre ili aplikacije pojačava interes za tehnologiju i okruženje rada za računalom. Odgovor o pomaganju nekome pojačava interes za rad s ljudima i vrijednost pomaganja.

Učinci se ne zbrajaju jednostavno kao bodovi, nego se ponderirano prosječe. Svaka dimenzija ima zbroj vrijednosti i zbroj težina. Na kraju se izračuna prosjek na skali 0-100.

Važna zaštita u sustavu: dimenzija koju nijedno pitanje nije dotaknulo ostaje "nepoznata" odnosno neutralna, ali se kod slaganja interesa može ignorirati. To smanjuje rizik da nedostajući odgovor umjetno djeluje kao srednji interes.

Kod nekih odgovora sustav sprema i posebne signale, primjerice:

- tech_computers;
- health_medicine;
- art_visual;
- hands_on_craft;
- cooking_food;
- baking_food;
- sport_active;
- logistics_transport;
- business_entrepreneur.

Ti signali služe za grane, pojačanja i ograničenja vidljivosti programa.

## Što je "program" u ovom kvizu

Rezultat ne preporučuje pojedinačnu školu kao prvi sloj, nego obitelj programa. U katalogu ima 39 obitelji programa:

- 6 gimnazijskih;
- 19 tehničkih ili četverogodišnjih strukovnih;
- 3 umjetnička;
- 11 obrtničkih ili trogodišnjih.

Svaki program ima:

- naziv;
- tip programa;
- trajanje;
- opis;
- što slijedi nakon škole;
- grube težine interesa i predmeta;
- razinu akademskog opterećenja;
- signale koji ga pojačavaju;
- signale koji su uvjet;
- ključne riječi za povezivanje sa stvarnim školama;
- napomenu o pragu upisa.

Uz osnovne podatke, svaki program ima detaljniji profil u `program-profiles.json`, gdje su definirani interesi, razmišljanje, učenje, okruženje, vrijednosti, zahtjevi i odnos prema fakultetu ili radu.

## Kako se boduje slaganje programa

Za svaki od 39 programa sustav izračuna više podrezultata, zatim ih spaja u poredak.

Glavni dijelovi bodovanja su:

- interesni fit;
- fit učenja i razmišljanja;
- fit radnog okruženja;
- fit zahtjeva programa;
- motivacijski fit;
- fit ograničenja i školskog konteksta;
- posebna pojačanja ili kazne.

Osnovna formula za poredak programa je:

```text
rankScore =
  interestScore * 0.32
  + learningFitScore * 0.22
  + workStyleScore * 0.14
  + requirementFitScore * 0.10
  + motivationScore * 0.12
  + constraintScore * 0.10
  + posebne prilagodbe
```

Posebne prilagodbe uključuju:

- pojačanja za jasne signale, primjerice računala, zdravstvo, kreativnost ili rad rukama;
- kazne kad učenik jasno odbija signal koji program traži;
- prilagodbe za konkretno napisanu ideju učenika;
- prilagodbe za rad s ljudima, zdravstvo, laboratorij, životinje, goste, sport ili ples;
- odvajanje sličnih praktičnih smjerova, primjerice kuhar i pekar, automehatroničar i strojar, bravar i limar;
- smanjenje programa ako se oslanja na predmet koji učeniku trenutno teško ide;
- dodatno podizanje četverogodišnjih programa ako učenik želi fakultet.

Konačni `matchPercentage` je zaokruženi `rankScore`, ograničen na raspon 1-99. To nije vjerojatnost upisa, nije procjena uspjeha i nije službeni postotak prikladnosti. To je unutarnji indeks slaganja između odgovora i kriterija alata.

## Kako kviz izbjegava pregrube preporuke

U kodu postoji više zaštita koje su psihološki korisne:

- ako učenik ima premalo odgovora, rezultat se označava kao nedovoljno pouzdan;
- ako su odgovori neodlučni, sustav ne forsira jako visok postotak i može ograničiti vodeći rezultat na 78;
- programi koji zahtijevaju vrlo specifičan signal ne prikazuju se samo zato što su "susjedi" drugog interesa;
- težak predmet spušta programe koji se jako oslanjaju na taj predmet;
- "teško mi ide" ne znači zabrana, nego upozorenje u tekstu rezultata;
- ako učenik napiše konkretnu ideju, sustav je može staviti u vrh, ali je uspoređuje s ostalim odgovorima;
- ako učenik želi fakultet, sustav može ponuditi opću gimnaziju kao dodatna "vrata", ali je ne forsira kod jakog praktičnog profila;
- najviše dva programa istog tipa ostaju u vrhu ako je druga vrsta programa blizu.

Primjeri stručne logike:

- "Želim biti liječnik" uz fakultet i zdravstvo diže prirodoslovnu gimnaziju ispred medicinske sestre.
- "Želim biti medicinska sestra" ili fokus na njegu može držati medicinsku sestru u vrhu.
- Računala uz izbjegavanje matematike ne smiju automatski dati prirodoslovno-matematičku gimnaziju.
- Kuhanje i pečenje se razdvajaju; pekar ne smije automatski postati kuhar.
- Životinje ne smiju automatski povući medicinsku sestru.

## Kako se prikazuje rezultat

Rezultat učeniku ne kaže "ti si za X" ili "moraš upisati X". Prikaz koristi formulacije poput:

- "Tri smjera koja vrijedi pogledati";
- "Ovo nisu upute za upis";
- "Smjerovi koje možeš razmotriti";
- "Vrijedi usporediti";
- "To nije zabrana".

Učenik vidi:

- vodeću orijentaciju, primjerice više za tehniku, struku, umjetničku školu, učenje ili kombinaciju;
- razinu sigurnosti: visoka, srednja ili niska;
- tri glavna smjera za razmotriti;
- obrazloženja zašto su ti smjerovi prikazani;
- upozorenja ako je neki dio zahtjevniji;
- škole u blizini ako je unesen grad;
- dodatne opcije za usporedbu smjerova;
- plan za razgovor s roditeljem ili nastavnikom.

Ako učenik unese grad, aplikacija traži škole u blizini do 30 km. To je logistički dodatak, ne dio psihološkog bodovanja.

## Povjerenje u rezultat

Kviz računa razinu sigurnosti kroz tri elementa:

- koliko se interesi međusobno razlikuju;
- koliko je učenik odlučan u odgovorima, odnosno koliko često bira sredinu ili "oboje";
- koliko je vodeći rezultat odvojen od trećeg rezultata.

Ako učenik ima manje od 8 odgovora, rezultat se označava kao nizak i sustav kaže da je prerano za prijedlog. Ako je sigurnost niska i učenik je neodlučan, rezultat se prikazuje opreznije.

Ovo je dobra orijentacijska zaštita, ali nije zamjena za stručnu procjenu pouzdanosti.

## Podaci, privatnost i razredni način

Kviz sprema stanje lokalno u preglednik (`localStorage`, uz pokušaj `sessionStorage` ako treba), kako bi učenik mogao nastaviti kasnije na istom uređaju.

Kod rezultata se spremaju i pomoćni sažeci za nastavak puta kroz aplikaciju, primjerice preporuka programa i kratki roditeljski sažetak. Ako se kviz otvara kroz razredni kod, učeniku se kaže da na ploču ide samo smjer, ne ime.

Za stručnu i školsku uporabu treba dodatno provjeriti:

- koje se informacije prikazuju nastavniku ili razredniku;
- postoji li jasna privola učenika i roditelja;
- koliko dugo se podaci čuvaju;
- može li se rezultat jednostavno izbrisati;
- je li učeniku jasno da rezultat nije službena preporuka škole.

## Što je dobro u trenutnoj verziji

Kviz ima nekoliko jakih strana:

1. Jezik je prilagođen učeniku. Testovi u kodu provjeravaju da pitanja ne koriste stručni žargon poput "kognitivno" ili "verbalno izražavanje".

2. Nema točnih i netočnih odgovora. Uvod i rezultat jasno smanjuju pritisak.

3. Rezultat nije prikazan kao presuda. Sustav koristi formulacije "vrijedi pogledati" i "nije odluka".

4. Kviz pokušava razlikovati slične smjerove. Primjeri su kuhar/pekar, računarstvo/elektrotehnika, medicina/njega/laboratorij, sport/ples.

5. Postoje testovi za rubne slučajeve. U kodu se provjerava da, primjerice, psihologija ostaje na gimnazijskom putu, a ne na sestri ili hotelu.

6. Teži predmeti se tretiraju oprezno. Ako učeniku matematika ide teško, to spušta programe s visokim matematičkim zahtjevom, ali tekst ne ponižava učenika.

7. Učenik može preskočiti ocjene. To je važno jer ocjene nisu psihološki konstrukt, a u aplikaciji su pomoćni kontekst.

8. Programi su povezani sa stvarnim školama. Testovi provjeravaju da svaki program postoji u bazi srednjih škola.

## Što treba znati prije stručne validacije

Najvažnija stručna granica: kviz trenutno nema dokaze psihometrijske valjanosti. Postoji dobro osmišljena heuristika, ali nema dokaza o:

- konstruktnoj valjanosti;
- kriterijskoj valjanosti;
- pouzdanosti kroz vrijeme;
- normama za učenike 8. razreda;
- osjetljivosti na socioekonomski status, regiju, spol ili dostupnost škola;
- usporedbi s vanjskim mjerama interesa ili školskim uspjehom.

Drugim riječima, kviz je dobar kao strukturirani razgovorni alat, ali nije "test profesionalne orijentacije" u stručnom smislu.

## Rizici i mjesta za promjenu

### 1. Postotak slaganja može izgledati previše precizno

`matchPercentage` izgleda kao službeni postotak, iako je zapravo interni indeks poretka. Psiholog bi mogao preporučiti da se umjesto postotka prikažu kategorije:

- jako se slaže;
- djelomično se slaže;
- vrijedi istražiti;
- manje se slaže.

Ako se postotak zadrži, treba jasno pisati: "Ovo nije vjerojatnost upisa ni procjena uspjeha."

### 2. Konstrukti nisu stručne skale

Nazivi poput "tolerancija na matematiku", "theoryPractice" ili "motivationScore" korisni su za kod, ali nisu validirane skale. Za psihologa ih treba prevesti u neutralnije nazive:

- "samoprocjena odnosa prema matematici";
- "preferencija učenja kroz praksu ili teoriju";
- "izražena trenutna namjera nakon srednje škole".

### 3. Pitanja miješaju interese, stil učenja, vrijednosti i školski uspjeh

To je korisno za preporuku, ali može otežati stručno tumačenje. Bilo bi dobro u stručnom izvještaju razdvojiti:

- interesi;
- školski kontekst;
- preferirani način učenja;
- vrijednosti;
- logistika i dostupnost.

### 4. Ocjene i teški predmeti mogu nenamjerno pojačati samosumnju

Iako su ocjene neobavezne i tekst je pažljiv, učenici u 8. razredu mogu "teško mi ide" doživjeti kao zabranu. Dobro je dodatno naglasiti:

"Težak predmet nije razlog da odustaneš, nego informacija gdje bi trebala podrška."

### 5. Regionalna dostupnost može utjecati na doživljaj rezultata

Kviz prvo preporučuje programe, zatim škole u blizini. Ako u blizini nema škole, učenik može doživjeti da je rezultat "loš". Treba jasno odvojiti:

- što mi se slaže;
- što postoji blizu mene;
- što je realno zbog bodova i prijevoza.

### 6. Nema ručnog stručnog komentara

Za psihološku uporabu bilo bi korisno dodati "stručni pogled" koji prikazuje:

- koji odgovori najviše nose rezultat;
- gdje su proturječja;
- koliko je rezultat stabilan;
- što treba provjeriti u razgovoru.

### 7. Nema validacijskog uzorka

Bez probnog uzorka ne znamo:

- razumiju li učenici pitanja jednako;
- postoje li pitanja koja sustavno zbunjuju;
- jesu li preporuke u skladu s kasnijim zadovoljstvom;
- dobivaju li različite skupine učenika jednako korisne rezultate.

## Preporučene izmjene prije stručne uporabe

### Prioritet 1: jasnije stručno označiti status kviza

Dodati tekst:

"Ovaj kviz je orijentacijski alat. Ne mjeri sposobnosti, ne zamjenjuje razgovor sa školskim psihologom i ne odlučuje o upisu."

To bi trebalo stajati na početku i na rezultatu.

### Prioritet 2: preimenovati postotak u "slaganje"

Umjesto "87%" prikazati, primjerice:

- "Jako se slaže";
- "Djelomično se slaže";
- "Vrijedi istražiti".

Ako broj ostaje, neka bude sekundaran i objašnjen.

### Prioritet 3: napraviti stručni izvještaj

Za psihologa bi bilo korisno dodati zaseban prikaz:

- top interesi;
- top stilovi učenja;
- najjači signali;
- teži predmeti koji utječu na rezultat;
- programi koje sustav nije prikazao i zašto;
- pitanja za razgovor s učenikom.

### Prioritet 4: dodati pilot evaluaciju

Provesti pilot na manjem broju učenika 8. razreda. Mjeriti:

- razumljivost pitanja;
- vrijeme rješavanja;
- osjećaj pritiska;
- slaže li se učenik s opisom;
- slaže li se psiholog s interpretacijom;
- jesu li roditelji razumjeli da rezultat nije odluka.

### Prioritet 5: stručno pregledati težine

Ponderi u formuli su razumni za proizvod, ali ih treba stručnije pregledati. Posebno:

- je li interes 32% prevelik ili premalen;
- je li školski kontekst dovoljno pažljivo korišten;
- treba li motivacija prema fakultetu/radu biti odvojena od interesa;
- jesu li kazne za teške predmete dovoljno blage.

### Prioritet 6: dodati "ne znam" kao legitimniji izbor

Kviz već ima sredinu i mogućnost neodlučnosti, ali psihološki bi bilo dobro dodatno normalizirati neodlučnost:

"Ako ne znaš, to je važan odgovor, ne greška."

## Preporuka psihologu za procjenu

Ako psiholog procjenjuje kviz, predlažem da ne pita samo "pogađa li prvi smjer", nego:

1. Razumije li učenik pitanja?
2. Osjeća li se učenik pod pritiskom?
3. Je li rezultat dobar početak razgovora?
4. Jesu li objašnjenja razumljiva i nenametljiva?
5. Daje li rezultat više opcija, a ne jednu presudu?
6. Prepoznaje li kviz proturječne odgovore bez posramljivanja?
7. Jesu li učenici s lošijim ocjenama zaštićeni od poruke "ovo nije za tebe"?
8. Jesu li roditelji i nastavnici svjesni da rezultat nije službena profesionalna orijentacija?

## Zaključak

Kviz je dobro postavljen kao digitalni alat za orijentacijski razgovor. Ima adaptivni tijek, pažljiv jezik, objašnjenja na temelju odgovora i više zaštita od pregrubih zaključaka. Najveća vrijednost mu je u tome što učeniku i odrasloj osobi daje strukturirani početak razgovora: što te zanima, kako učiš, koji programi vrijede pogledati i što treba dodatno provjeriti.

Za stručnu uporabu treba jasno ukloniti dojam da je riječ o validiranom psihološkom testu. Najvažnije promjene su smanjiti preciznost postotaka, dodati stručni izvještaj, provesti pilot validaciju i jasno označiti da je kviz orijentacijski, a ne dijagnostički ili selekcijski alat.

