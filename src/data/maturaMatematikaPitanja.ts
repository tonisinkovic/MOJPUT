/**
 * Tekstovi zadataka višestrukog izbora (1–20) prema ispitnoj knjižici D-S072,
 * šk. god. 2024./2025. Matematički zapisi pojednostavljeni su za web (bez TeX-a).
 * Zadaci koji u originalu ovise o slici imaju napomenu uz tekst.
 */

export type McOptionLetter = "A" | "B" | "C" | "D";

export type McQuestion = {
  /** Redni broj 1–20 */
  n: number;
  stem: string;
  options: Record<McOptionLetter, string>;
};

export const MC_QUESTIONS_MAT_B: McQuestion[] = [
  {
    n: 1,
    stem: "Vrijednost kojega od navedenih izraza pripada skupu iracionalnih brojeva?",
    options: {
      A: "−√12 + 2",
      B: "−2/7",
      C: "√12 · √3",
      D: "√7 + 3",
    },
  },
  {
    n: 2,
    stem: "Koja je od navedenih tvrdnji točna?",
    options: {
      A: "Razlika dvaju prirodnih brojeva uvijek je prirodan broj.",
      B: "Količnik dvaju cijelih brojeva uvijek je cijeli broj.",
      C: "Zbroj dvaju racionalnih brojeva uvijek je racionalan broj.",
      D: "Umnožak dvaju iracionalnih brojeva uvijek je iracionalan broj.",
    },
  },
  {
    n: 3,
    stem: "Čemu je jednako a · ∛a za svaki realni broj a?",
    options: {
      A: "a^(1/3)",
      B: "a^(2/3)",
      C: "a^(4/3)",
      D: "a^(5/3)",
    },
  },
  {
    n: 4,
    stem:
      "Jedna kapljica tekućine sastoji se od 3 · 10^22 čestica. U koliko takvih kapljica tekućine ima 1,5 · 10^26 čestica?",
    options: {
      A: "2000",
      B: "5000",
      C: "20 000",
      D: "50 000",
    },
  },
  {
    n: 5,
    stem:
      "Sonjina i Matijina zarada u omjeru su 2 : 3, a Matija je zaradio 2 puta više od Ivana. U kakvome su odnosu Sonjina i Ivanova zarada?",
    options: {
      A: "Sonja i Ivan zaradili su jednako.",
      B: "Sonja je zaradila manje od Ivana.",
      C: "Sonjina i Ivanova zarada u omjeru su 2 : 1.",
      D: "Sonjina i Ivanova zarada u omjeru su 4 : 3.",
    },
  },
  {
    n: 6,
    stem:
      "Postotak prodanih ulaznica po danima u nekome tjednu prikazan je tablicom (ponedjeljak–nedjelja: 40 %, 75 %, 75 %, 75 %, 80 %, 80 %, 40 %). Koliko je prosječno ulaznica prodano dnevno u tome tjednu ako je svakoga dana u prodaji 420 ulaznica?",
    options: {
      A: "238",
      B: "273",
      C: "279",
      D: "315",
    },
  },
  {
    n: 7,
    stem: "Koliko iznosi x ako je izraz x²a² + 12ab + 4b² kvadrat binoma?",
    options: {
      A: "1",
      B: "3",
      C: "9",
      D: "81",
    },
  },
  {
    n: 8,
    stem:
      "Linearna funkcija f(x) = ax + b zadana je tablicom: kada je x = −1, f(x) = 7; kada je x = 7, f(x) = 5. Što od navedenoga vrijedi za koeficijente a i b?",
    options: {
      A: "a < 0 i b < 0",
      B: "a < 0 i b > 0",
      C: "a > 0 i b < 0",
      D: "a > 0 i b > 0",
    },
  },
  {
    n: 9,
    stem: "Koji je interval skup svih rješenja nejednadžbe (5 − x) / x < 0?",
    options: {
      A: "⟨−∞, 0⟩",
      B: "⟨0, 1⟩",
      C: "⟨1, 5⟩",
      D: "⟨5, +∞⟩",
    },
  },
  {
    n: 10,
    stem: "Čemu je jednako a² ako je log₂ a = b?",
    options: {
      A: "b²",
      B: "b⁴",
      C: "2^b",
      D: "4^b",
    },
  },
  {
    n: 11,
    stem:
      "Na kojoj je slici prikazan graf kvadratne funkcije f(x) = −x² + bx + c kojoj je koeficijent c < 0? (U originalu su dane četiri slike grafova.)",
    options: {
      A: "Slika A",
      B: "Slika B",
      C: "Slika C",
      D: "Slika D",
    },
  },
  {
    n: 12,
    stem:
      "Graf funkcije f prikazan je na slici. Koliko iznosi najmanja vrijednost funkcije f na intervalu [−4, 6]? (U originalu je priložena skica grafa.)",
    options: {
      A: "−4",
      B: "−2",
      C: "1",
      D: "4",
    },
  },
  {
    n: 13,
    stem:
      "Potrebno je iskopati bunar dubok 20 m. Za kopanje prvoga metra cijena je 30 eura, a za svaki sljedeći 8 eura više od prethodnoga metra. Kolika je cijena cijeloga iskopa?",
    options: {
      A: "752 eura",
      B: "1140 eura",
      C: "1520 eura",
      D: "2120 eura",
    },
  },
  {
    n: 14,
    stem: "Koja od navedenih tvrdnji vrijedi za svaka dva slična trokuta?",
    options: {
      A: "Opsezi su im jednaki.",
      B: "Površine su im jednake.",
      C: "Mjere unutarnjih kutova su im jednake.",
      D: "Odgovarajuće visine su im jednakih duljina.",
    },
  },
  {
    n: 15,
    stem:
      "Na skici je prikazana kružnica sa središtem u točki O. Dužina AB je promjer te kružnice, a trokut OBC je jednakostraničan. Koliko iznosi mjera kuta x? (U originalu je priložena skica.)",
    options: {
      A: "30°",
      B: "35°",
      C: "45°",
      D: "60°",
    },
  },
  {
    n: 16,
    stem:
      "Na skici je prikazan kvadar ABCDEFGH. Koji od navedenih pravaca siječe pravac BH? (U originalu je priložena skica.)",
    options: {
      A: "AC",
      B: "AD",
      C: "AE",
      D: "AG",
    },
  },
  {
    n: 17,
    stem:
      "Volumen valjka iznosi 24π cm³, a njegova je visina jednaka duljini promjera osnovke. Kolika je visina toga valjka zaokružena na dva decimalna mjesta?",
    options: {
      A: "3,46 cm",
      B: "4,58 cm",
      C: "5,77 cm",
      D: "9,79 cm",
    },
  },
  {
    n: 18,
    stem:
      "Na slici su prikazani vektori a⃗ i b⃗. Čemu je jednako a⃗ + b⃗? (U originalu je priložena skica.)",
    options: {
      A: "−3i⃗ − 3j⃗",
      B: "−5i⃗",
      C: "−2i⃗ + j⃗",
      D: "6i⃗ − 4j⃗",
    },
  },
  {
    n: 19,
    stem: "Koliko iznosi medijan skupa podataka 12, 14, 11, 15, 15, 13, 15, 11, 14?",
    options: {
      A: "12",
      B: "13",
      C: "14",
      D: "15",
    },
  },
  {
    n: 20,
    stem:
      "U Larinome je razredu 20 učenika. Nastavnik slučajnim odabirom proziva jednoga učenika. Koliko iznosi vjerojatnost da nije prozvana Lara?",
    options: {
      A: "0,8",
      B: "0,9",
      C: "0,95",
      D: "0,99",
    },
  },
];

export const MC_QUESTIONS_MAT_A: McQuestion[] = [
  {
    n: 1,
    stem:
      "Kojoj je od navedenih točaka u Gaussovoj ravnini pridružen kompleksan broj kojemu argument iznosi 3π/2?",
    options: {
      A: "(−4, 0)",
      B: "(0, −4)",
      C: "(0, 4)",
      D: "(4, 0)",
    },
  },
  {
    n: 2,
    stem: "Čemu je jednako a · ∛a za svaki realni broj a?",
    options: {
      A: "a^(1/3)",
      B: "a^(2/3)",
      C: "a^(4/3)",
      D: "a^(5/3)",
    },
  },
  {
    n: 3,
    stem:
      "Koliko iznosi x ako je za svaki realni broj a izraz (3a − 1)³ − (a + x)³ razlika kubova?",
    options: {
      A: "−6",
      B: "−3",
      C: "3",
      D: "6",
    },
  },
  {
    n: 4,
    stem:
      "Sonjina i Matijina zarada u omjeru su 2 : 3, a Matija je zaradio 2 puta više od Ivana. U kakvome su odnosu Sonjina i Ivanova zarada?",
    options: {
      A: "Sonja i Ivan zaradili su jednako.",
      B: "Sonja je zaradila manje od Ivana.",
      C: "Sonjina i Ivanova zarada u omjeru su 2 : 1.",
      D: "Sonjina i Ivanova zarada u omjeru su 4 : 3.",
    },
  },
  {
    n: 5,
    stem:
      "Postotak prodanih ulaznica po danima u nekome tjednu prikazan je tablicom (ponedjeljak–nedjelja: 40 %, 75 %, 75 %, 75 %, 80 %, 80 %, 40 %). Koliko je prosječno ulaznica prodano dnevno u tome tjednu ako je svakoga dana u prodaji 420 ulaznica?",
    options: {
      A: "238",
      B: "273",
      C: "279",
      D: "315",
    },
  },
  {
    n: 6,
    stem:
      "Potrebno je iskopati bunar dubok 20 m. Za kopanje prvoga metra cijena je 30 eura, a za svaki sljedeći 8 eura više od prethodnoga metra. Kolika je cijena cijeloga iskopa?",
    options: {
      A: "752 eura",
      B: "1140 eura",
      C: "1520 eura",
      D: "2120 eura",
    },
  },
  {
    n: 7,
    stem:
      "Linearna funkcija f(x) = ax + b zadana je tablicom: kada je x = −1, f(x) = 7; kada je x = 7, f(x) = 5. Što od navedenoga vrijedi za koeficijente a i b?",
    options: {
      A: "a < 0 i b < 0",
      B: "a < 0 i b > 0",
      C: "a > 0 i b < 0",
      D: "a > 0 i b > 0",
    },
  },
  {
    n: 8,
    stem: "Koliko iznosi najveća vrijednost funkcije g(x) = −x² + 8x + 16?",
    options: {
      A: "16",
      B: "24",
      C: "32",
      D: "48",
    },
  },
  {
    n: 9,
    stem:
      "Koji je od prikazanih grafova graf funkcije koja je inverzna funkciji f(x) = 1/(x − 1)? (U originalu su dane četiri slike grafova.)",
    options: {
      A: "Slika A",
      B: "Slika B",
      C: "Slika C",
      D: "Slika D",
    },
  },
  {
    n: 10,
    stem: "Koja je od navedenih funkcija parna?",
    options: {
      A: "f(x) = −x⁷ − 2",
      B: "f(x) = −x² − 7",
      C: "f(x) = −x − 7",
      D: "f(x) = −7",
    },
  },
  {
    n: 11,
    stem:
      "Koja od navedenih tvrdnji vrijedi za broj pridružen točki E(t) sa slike jedinične kružnice? (U originalu je priložena skica.)",
    options: {
      A: "5/3 = sin t",
      B: "5/4 = sin t",
      C: "5/3 = cos t",
      D: "5/4 = cos t",
    },
  },
  {
    n: 12,
    stem:
      "Procijenjeno je da se broj jedinki neke populacije mijenja prema formuli S(n) = 14 000 · 2^(0,05n), gdje je n broj godina od početka praćenja. Koja je od navedenih tvrdnji istinita?",
    options: {
      A: "Broj jedinki će se tijekom vremena smanjivati.",
      B: "Nakon jedne godine bit će 14 000 jedinki.",
      C: "Nakon dvije godine povećat će se broj jedinki za 1500.",
      D: "Nakon 20 godina udvostručit će se broj jedinki.",
    },
  },
  {
    n: 13,
    stem:
      "Četverokut ABCD prikazan na skici je paralelogram. Točka E pripada pravcu AB i vrijedi |BE| = |BC|. Kolika je mjera kuta y? (U originalu je priložena skica.)",
    options: {
      A: "45°",
      B: "50°",
      C: "55°",
      D: "70°",
    },
  },
  {
    n: 14,
    stem: "Koliki dio kružnice odsjecaju krajnje točke tetive koja odgovara obodnomu kutu mjere 36°?",
    options: {
      A: "petinu",
      B: "šestinu",
      C: "devetinu",
      D: "desetinu",
    },
  },
  {
    n: 15,
    stem:
      "Na skici je prikazan kvadar ABCDEFGH. Koji od navedenih pravaca siječe pravac BH? (U originalu je priložena skica.)",
    options: {
      A: "AC",
      B: "AD",
      C: "AE",
      D: "AG",
    },
  },
  {
    n: 16,
    stem:
      "Kolika je duljina stranice kvadrata koji, rotirajući oko jedne svoje stranice, čini valjak volumena 64π cm³?",
    options: {
      A: "4 cm",
      B: "8 cm",
      C: "12 cm",
      D: "16 cm",
    },
  },
  {
    n: 17,
    stem:
      "Na skici je prikazan pravilan šesterokut ABCDEF. Koji je od navedenih vektora jednak AD⃗ + FA⃗? (U originalu je priložena skica.)",
    options: {
      A: "AC⃗",
      B: "CE⃗",
      C: "DF⃗",
      D: "FB⃗",
    },
  },
  {
    n: 18,
    stem:
      "Koja od navedenih tvrdnji vrijedi za koeficijente A i B pravaca Ax + y − 4 = 0 i x + By − 1 = 0 ako je mjera kuta između tih pravaca 90°?",
    options: {
      A: "A + B = 5",
      B: "A + 4B = 0",
      C: "AB = 4",
      D: "5AB − 1 = 0",
    },
  },
  {
    n: 19,
    stem:
      "Koja je od navedenih tvrdnji istinita za skup podataka 1, 1, 2, 2, 2, 2, 3, 3, 3, 4, 5, 5, 5?",
    options: {
      A: "Mod iznosi 3.",
      B: "Medijan iznosi 2.",
      C: "Donji kvartil iznosi 2.",
      D: "Gornji kvartil iznosi 5.",
    },
  },
  {
    n: 20,
    stem:
      "U razredu koji ima 20 učenika bira se tročlani tim koji se sastoji od voditelja i dvaju ravnopravnih članova. Na koliko se različitih načina može izabrati takav tim?",
    options: {
      A: "1140",
      B: "2280",
      C: "3420",
      D: "6840",
    },
  },
];
