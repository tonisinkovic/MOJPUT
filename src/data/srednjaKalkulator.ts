// Automatski generirano iz https://www.srednja.hr/srednja-kalkulator — ne uređivati ručno.
// Regeneracija: node scripts/fetch-srednja-pragovi.cjs
// Pragovi se odnose na ljetni upisni rok navedene školske godine.

export type KalkulatorPrag = {
  year: string;
  kvota: number | null;
  upisani: number | null;
  min: number | null;
  avg: number | null;
  max: number | null;
};

export type KalkulatorProgram = {
  id: number;
  name: string;
  sector: string | null;
  prag: KalkulatorPrag | null;
};

export type KalkulatorSchool = {
  id: number;
  name: string;
  city: string;
  county: string;
  programs: KalkulatorProgram[];
};

export const kalkulatorSchools: KalkulatorSchool[] = [
 {
  "id": 2242,
  "name": "Obrtnička škola",
  "city": "",
  "county": "",
  "programs": [
   {
    "id": 3581,
    "name": "Modni krojač/Modna krojačica",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 24.28,
     "avg": 28.11,
     "max": 47.13
    }
   },
   {
    "id": 3582,
    "name": "Tehničar za očnu optiku / Tehničarka za očnu optiku",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 55.25,
     "avg": 59.93,
     "max": 70.39
    }
   }
  ]
 },
 {
  "id": 169,
  "name": "Ekonomska i birotehnička škola Bjelovar",
  "city": "Bjelovar",
  "county": "Bjelovarsko-bilogorska",
  "programs": [
   {
    "id": 2796,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 60,
     "upisani": 60,
     "min": 44.77,
     "avg": 59.87,
     "max": 80
    }
   },
   {
    "id": 2797,
    "name": "Upravno-poslovni referent / Upravno-poslovna referentica",
    "sector": "Pravo, politologija, sociologija, državna uprava i javni poslovi",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 65.22,
     "avg": 70.41,
     "max": 74.65
    }
   }
  ]
 },
 {
  "id": 166,
  "name": "Gimnazija Bjelovar",
  "city": "Bjelovar",
  "county": "Bjelovarsko-bilogorska",
  "programs": [
   {
    "id": 2926,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 25,
     "upisani": 17,
     "min": 41.48,
     "avg": 60.83,
     "max": 80
    }
   },
   {
    "id": 2927,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 72,
     "upisani": 52,
     "min": 36.48,
     "avg": 69.2,
     "max": 80
    }
   },
   {
    "id": 2928,
    "name": "Opća gimnazija (odjel za sportaše) (320104-S)",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 120.81,
     "avg": 74.33,
     "max": 160
    }
   },
   {
    "id": 2929,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 18,
     "min": 63.05,
     "avg": 76.59,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 2218,
  "name": "Glazbena škola Vatroslava Lisinskog Bjelovar",
  "city": "Bjelovar",
  "county": "Bjelovarsko-bilogorska",
  "programs": [
   {
    "id": 3212,
    "name": "Glazbenik - pripremno obrazovanje",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3213,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 15,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3214,
    "name": "Glazbenik kornist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": 1,
     "min": 258.93,
     "avg": 88.93,
     "max": 258.93
    }
   },
   {
    "id": 3215,
    "name": "Glazbenik trombonist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 233.73,
     "avg": 75.73,
     "max": 233.73
    }
   }
  ]
 },
 {
  "id": 168,
  "name": "Komercijalna i trgovačka škola Bjelovar",
  "city": "Bjelovar",
  "county": "Bjelovarsko-bilogorska",
  "programs": [
   {
    "id": 3438,
    "name": "Komercijalist / Komercijalistica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 39,
     "upisani": 39,
     "min": 51.4,
     "avg": 55.96,
     "max": 72.71
    }
   },
   {
    "id": 3439,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 24.79,
     "avg": 28.91,
     "max": 37.01
    }
   }
  ]
 },
 {
  "id": 167,
  "name": "Medicinska škola Bjelovar",
  "city": "Bjelovar",
  "county": "Bjelovarsko-bilogorska",
  "programs": [
   {
    "id": 3447,
    "name": "Farmaceutski tehničar",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 23,
     "min": 76.78,
     "avg": 78.63,
     "max": 80.24
    }
   },
   {
    "id": 3448,
    "name": "Medicinska sestra opće njege/medicinski tehničar opće njege",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 55,
     "upisani": 55,
     "min": 61.64,
     "avg": 69.25,
     "max": 79.92
    }
   }
  ]
 },
 {
  "id": 171,
  "name": "Obrtnička škola Bjelovar",
  "city": "Bjelovar",
  "county": "Bjelovarsko-bilogorska",
  "programs": [
   {
    "id": 3525,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 19,
     "min": 28.71,
     "avg": 32.23,
     "max": 44.67
    }
   },
   {
    "id": 3526,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 7,
     "min": 36.62,
     "avg": 37.38,
     "max": 43.68
    }
   },
   {
    "id": 3527,
    "name": "Elektromehaničar/Elektromehaničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 5,
     "min": 28.54,
     "avg": 31.49,
     "max": 38.95
    }
   },
   {
    "id": 3528,
    "name": "Elektroničar/Elektroničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 4,
     "upisani": 4,
     "min": 25.99,
     "avg": 30.79,
     "max": 40.04
    }
   },
   {
    "id": 3529,
    "name": "Građevinski radnik u zgradarstvu/Građevinska radnica u zgradarstvu",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 8,
     "min": 23.24,
     "avg": 24.6,
     "max": 27.94
    }
   },
   {
    "id": 3530,
    "name": "Izrađivač-monter strojarskih konstrukcija/Izrađivačica-monterka strojarskih konstrukcija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 24.02,
     "avg": 25.06,
     "max": 28.58
    }
   },
   {
    "id": 3531,
    "name": "Monter drvenih konstrukcija i krovova / Monterka drvenih konstrukcija i krovova",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 6,
     "min": 23.15,
     "avg": 24.22,
     "max": 27.23
    }
   },
   {
    "id": 3532,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 28.4,
     "avg": 32.49,
     "max": 39.68
    }
   },
   {
    "id": 3533,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 27.16,
     "avg": 31.85,
     "max": 41.41
    }
   },
   {
    "id": 3534,
    "name": "Zavarivač/Zavarivačica",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 7,
     "min": 25.03,
     "avg": 25.36,
     "max": 26.81
    }
   }
  ]
 },
 {
  "id": 170,
  "name": "Tehnička škola Bjelovar",
  "city": "Bjelovar",
  "county": "Bjelovarsko-bilogorska",
  "programs": [
   {
    "id": 4621,
    "name": "Građevinski tehničar / Građevinska tehničarka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 63.66,
     "avg": 71.42,
     "max": 80
    }
   },
   {
    "id": 4622,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 57.93,
     "avg": 65.4,
     "max": 73.78
    }
   },
   {
    "id": 4623,
    "name": "Tehničar za elektroniku i komunikacije / Tehničarka za elektroniku i komunikacije",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 19,
     "min": 68.3,
     "avg": 72.49,
     "max": 80
    }
   },
   {
    "id": 4624,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 71.45,
     "avg": 74.49,
     "max": 81
    }
   }
  ]
 },
 {
  "id": 172,
  "name": "Turističko-ugostiteljska i prehrambena škola Bjelovar",
  "city": "Bjelovar",
  "county": "Bjelovarsko-bilogorska",
  "programs": [
   {
    "id": 4765,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 17,
     "upisani": 14,
     "min": 23.25,
     "avg": 28.75,
     "max": 36.51
    }
   },
   {
    "id": 4766,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 28,
     "upisani": 26,
     "min": 23.23,
     "avg": 29.79,
     "max": 47.23
    }
   },
   {
    "id": 4767,
    "name": "Pomoćni konobar/Pomoćna konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 3,
     "min": 1.026,
     "avg": 36.28,
     "max": 49.06
    }
   },
   {
    "id": 4768,
    "name": "Pomoćni kuhar/Pomoćna kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 6,
     "min": 1.033,
     "avg": 38.2,
     "max": 45.59
    }
   },
   {
    "id": 4769,
    "name": "Slastičar/Slastičarka",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 11,
     "min": 25.38,
     "avg": 29.3,
     "max": 33.65
    }
   },
   {
    "id": 4770,
    "name": "Tehničar za ugostiteljstvo / Tehničarka za ugostiteljstvo",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 55.24,
     "avg": 60.95,
     "max": 73.54
    }
   },
   {
    "id": 4771,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 64.16,
     "avg": 69.56,
     "max": 76.15
    }
   }
  ]
 },
 {
  "id": 173,
  "name": "Srednja škola Čazma",
  "city": "Čazma",
  "county": "Bjelovarsko-bilogorska",
  "programs": [
   {
    "id": 4033,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 13,
     "min": 25.85,
     "avg": 31.12,
     "max": 40.88
    }
   },
   {
    "id": 4034,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 3,
     "min": 23.9,
     "avg": 25.58,
     "max": 27.57
    }
   },
   {
    "id": 4035,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 6,
     "min": 25.72,
     "avg": 30.99,
     "max": 38.2
    }
   },
   {
    "id": 4036,
    "name": "Tehničar cestovnog prometa / Tehničarka cestovnog prometa",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 19,
     "min": 43.39,
     "avg": 52.82,
     "max": 71.63
    }
   },
   {
    "id": 4037,
    "name": "Vozač motornog vozila/Vozačica motornog vozila",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 20,
     "min": 24.31,
     "avg": 29.12,
     "max": 39.15
    }
   }
  ]
 },
 {
  "id": 176,
  "name": "Ekonomska i turistička škola Daruvar",
  "city": "Daruvar",
  "county": "Bjelovarsko-bilogorska",
  "programs": [
   {
    "id": 2810,
    "name": "Agroturistički tehničar / Agroturistička tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 11,
     "min": 38.39,
     "avg": 46.78,
     "max": 59.2
    }
   },
   {
    "id": 2811,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 23.97,
     "avg": 25.6,
     "max": 29.64
    }
   },
   {
    "id": 2812,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 9,
     "min": 23.44,
     "avg": 27.47,
     "max": 35
    }
   },
   {
    "id": 2813,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 24.55,
     "avg": 28.58,
     "max": 37.63
    }
   },
   {
    "id": 2814,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 52.75,
     "avg": 64.44,
     "max": 75.14
    }
   },
   {
    "id": 2815,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 54.51,
     "avg": 67.6,
     "max": 78.72
    }
   }
  ]
 },
 {
  "id": 175,
  "name": "Gimnazija Daruvar",
  "city": "Daruvar",
  "county": "Bjelovarsko-bilogorska",
  "programs": [
   {
    "id": 2930,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 43,
     "upisani": 27,
     "min": 63.7,
     "avg": 75.81,
     "max": 80
    }
   },
   {
    "id": 2931,
    "name": "Opća gimnazija (nastava na češkom jeziku) (320104-MC)",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 6,
     "min": 71.11,
     "avg": 75.04,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 2209,
  "name": "Glazbena škola Brune Bjelinskog Daruvar",
  "city": "Daruvar",
  "county": "Bjelovarsko-bilogorska",
  "programs": [
   {
    "id": 3083,
    "name": "Glazbenik - pripremno obrazovanje",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3084,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3085,
    "name": "Glazbenik flautist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 236.76,
     "avg": 66.76,
     "max": 236.76
    }
   }
  ]
 },
 {
  "id": 174,
  "name": "Tehnička škola Daruvar",
  "city": "Daruvar",
  "county": "Bjelovarsko-bilogorska",
  "programs": [
   {
    "id": 4633,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 33.05,
     "avg": 35.75,
     "max": 42.02
    }
   },
   {
    "id": 4634,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 25.95,
     "avg": 30.36,
     "max": 35.17
    }
   },
   {
    "id": 4635,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 31.02,
     "avg": 36.79,
     "max": 43.96
    }
   },
   {
    "id": 4636,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 25.35,
     "avg": 29.33,
     "max": 33.56
    }
   },
   {
    "id": 4637,
    "name": "Pomoćni kuhar/Pomoćna kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 6,
     "min": 1.028,
     "avg": 38.46,
     "max": 44.31
    }
   },
   {
    "id": 4638,
    "name": "Pomoćni radnik za uređenje interijera/Pomoćna radnica za uređenje interijera",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 1,
     "min": 1.028,
     "avg": 28.1,
     "max": 28.1
    }
   },
   {
    "id": 4639,
    "name": "Pomoćni stolar/Pomoćna stolarica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 2,
     "min": 1.036,
     "avg": 37.98,
     "max": 39.45
    }
   },
   {
    "id": 4640,
    "name": "Tehničar cestovnog prometa / Tehničarka cestovnog prometa",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 44.19,
     "avg": 53.39,
     "max": 69.59
    }
   },
   {
    "id": 4641,
    "name": "Tehničar za elektroniku i komunikacije / Tehničarka za elektroniku i komunikacije",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 53.05,
     "avg": 60.64,
     "max": 70.36
    }
   },
   {
    "id": 4642,
    "name": "Tehničar za mehatroniku / Tehničarka za mehatroniku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 19,
     "min": 42.49,
     "avg": 51.02,
     "max": 68.71
    }
   },
   {
    "id": 4643,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 57.35,
     "avg": 71.2,
     "max": 81
    }
   },
   {
    "id": 4644,
    "name": "Vozač motornog vozila/Vozačica motornog vozila",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 19,
     "min": 26.81,
     "avg": 32.49,
     "max": 41.71
    }
   }
  ]
 },
 {
  "id": 177,
  "name": "Srednja škola \"August Šenoa\" Garešnica",
  "city": "Garešnica",
  "county": "Bjelovarsko-bilogorska",
  "programs": [
   {
    "id": 3913,
    "name": "Dizajner grafičkih proizvoda / Dizajnerica grafičkih proizvoda",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 13,
     "min": 41.94,
     "avg": 55.3,
     "max": 77.52
    }
   },
   {
    "id": 3914,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 18,
     "upisani": 17,
     "min": 26.93,
     "avg": 32.22,
     "max": 41.8
    }
   },
   {
    "id": 3915,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 4,
     "min": 23.48,
     "avg": 26.02,
     "max": 27.6
    }
   },
   {
    "id": 3916,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 10,
     "min": 22.91,
     "avg": 27.63,
     "max": 44.98
    }
   },
   {
    "id": 3917,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 24.64,
     "avg": 27.82,
     "max": 36.02
    }
   },
   {
    "id": 3918,
    "name": "Stolar/Stolarica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 6,
     "min": 22.97,
     "avg": 30.53,
     "max": 48.36
    }
   },
   {
    "id": 3919,
    "name": "Tehničar za ugostiteljstvo / Tehničarka za ugostiteljstvo",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 8,
     "min": 37.11,
     "avg": 46.07,
     "max": 67.01
    }
   }
  ]
 },
 {
  "id": 178,
  "name": "Srednja škola Bartola Kašića Grubišno Polje",
  "city": "Grubišno Polje",
  "county": "Bjelovarsko-bilogorska",
  "programs": [
   {
    "id": 3979,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 11,
     "min": 23.63,
     "avg": 27.37,
     "max": 38.08
    }
   },
   {
    "id": 3980,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 2,
     "min": 30.04,
     "avg": 30.77,
     "max": 31.49
    }
   },
   {
    "id": 3981,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 3,
     "min": 27.1,
     "avg": 31.6,
     "max": 39.61
    }
   },
   {
    "id": 3982,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 6,
     "min": 23.8,
     "avg": 34.49,
     "max": 43.83
    }
   },
   {
    "id": 3983,
    "name": "Poljoprivredni gospodarstvenik/Poljoprivredna gospodarstvenica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 2,
     "min": 28.49,
     "avg": 33.59,
     "max": 38.69
    }
   },
   {
    "id": 3984,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 10,
     "min": 44.03,
     "avg": 63,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 2195,
  "name": "Elektrotehnička i ekonomska škola",
  "city": "Nova Gradiška",
  "county": "Brodsko-posavska",
  "programs": [
   {
    "id": 2887,
    "name": "Komercijalist / Komercijalistica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 36.99,
     "avg": 58.98,
     "max": 73.8
    }
   },
   {
    "id": 2888,
    "name": "Tehničar za elektroniku i komunikacije / Tehničarka za elektroniku i komunikacije",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 11,
     "upisani": 8,
     "min": 44.75,
     "avg": 57.2,
     "max": 71.46
    }
   },
   {
    "id": 2889,
    "name": "Tehničar za mehatroniku / Tehničarka za mehatroniku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 11,
     "upisani": 11,
     "min": 55.88,
     "avg": 61.51,
     "max": 68.19
    }
   },
   {
    "id": 2890,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 15,
     "min": 39.99,
     "avg": 57.75,
     "max": 75.06
    }
   }
  ]
 },
 {
  "id": 232,
  "name": "Gimnazija Nova Gradiška",
  "city": "Nova Gradiška",
  "county": "Brodsko-posavska",
  "programs": [
   {
    "id": 2983,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 40,
     "upisani": 27,
     "min": 44.63,
     "avg": 70.04,
     "max": 80
    }
   },
   {
    "id": 2984,
    "name": "Prirodoslovna gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 65.06,
     "avg": 76.19,
     "max": 80
    }
   },
   {
    "id": 2985,
    "name": "Umjetnička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 9,
     "min": 50.15,
     "avg": 60.05,
     "max": 76.78
    }
   }
  ]
 },
 {
  "id": 2228,
  "name": "Industrijsko obrtnička škola",
  "city": "Nova Gradiška",
  "county": "Brodsko-posavska",
  "programs": [
   {
    "id": 3354,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 29.61,
     "avg": 32.94,
     "max": 38.3
    }
   },
   {
    "id": 3355,
    "name": "Izrađivač-monter strojarskih konstrukcija/Izrađivačica-monterka strojarskih konstrukcija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 7,
     "min": 25.02,
     "avg": 26.42,
     "max": 29.65
    }
   },
   {
    "id": 3356,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 13,
     "min": 23.6,
     "avg": 26.63,
     "max": 36.1
    }
   },
   {
    "id": 3357,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 17,
     "min": 22.31,
     "avg": 27.29,
     "max": 32.84
    }
   },
   {
    "id": 3358,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 28.71,
     "avg": 31.61,
     "max": 39.32
    }
   },
   {
    "id": 3359,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 27,
     "avg": 29.18,
     "max": 35.27
    }
   },
   {
    "id": 3360,
    "name": "Pomoćni bravar/Pomoćna bravarica",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 2,
     "min": 1.037,
     "avg": 41.93,
     "max": 46.07
    }
   },
   {
    "id": 3361,
    "name": "Pomoćni kuhar/Pomoćna kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 4,
     "min": 1.027,
     "avg": 36.63,
     "max": 41.29
    }
   },
   {
    "id": 3362,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 14,
     "min": 23.78,
     "avg": 30.02,
     "max": 38.19
    }
   },
   {
    "id": 3363,
    "name": "Stolar/Stolarica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 7,
     "min": 23.76,
     "avg": 26.75,
     "max": 31.13
    }
   }
  ]
 },
 {
  "id": 240,
  "name": "Ekonomsko-birotehnička škola Slavonski Brod",
  "city": "Slavonski Brod",
  "county": "Brodsko-posavska",
  "programs": [
   {
    "id": 2856,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 9,
     "min": 24.25,
     "avg": 27.81,
     "max": 33.84
    }
   },
   {
    "id": 2857,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 15,
     "min": 52.16,
     "avg": 61.59,
     "max": 68.96
    }
   },
   {
    "id": 2858,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 40,
     "upisani": 35,
     "min": 40.96,
     "avg": 54.39,
     "max": 72.25
    }
   },
   {
    "id": 2859,
    "name": "Upravno-poslovni referent / Upravno-poslovna referentica",
    "sector": "Pravo, politologija, sociologija, državna uprava i javni poslovi",
    "prag": {
     "year": "2025/2026",
     "kvota": 39,
     "upisani": 39,
     "min": 53.21,
     "avg": 60.47,
     "max": 72.05
    }
   }
  ]
 },
 {
  "id": 1730,
  "name": "Gimnazija Matija Mesić",
  "city": "Slavonski Brod",
  "county": "Brodsko-posavska",
  "programs": [
   {
    "id": 2972,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 21,
     "upisani": 13,
     "min": 51.37,
     "avg": 61.86,
     "max": 73.84
    }
   },
   {
    "id": 2973,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 57,
     "upisani": 45,
     "min": 46.34,
     "avg": 69.42,
     "max": 80.63
    }
   },
   {
    "id": 2974,
    "name": "Prirodoslovna gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 20,
     "min": 58.34,
     "avg": 72.38,
     "max": 80
    }
   },
   {
    "id": 2975,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 48,
     "upisani": 30,
     "min": 68.84,
     "avg": 77.49,
     "max": 82.67
    }
   }
  ]
 },
 {
  "id": 1884,
  "name": "Glazbena škola Slavonski Brod",
  "city": "Slavonski Brod",
  "county": "Brodsko-posavska",
  "programs": [
   {
    "id": 3190,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3191,
    "name": "Glazbenik harmonikaš",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 238,
     "avg": 80,
     "max": 238
    }
   },
   {
    "id": 3192,
    "name": "Glazbenik pjevač",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": 2,
     "min": 169.17,
     "avg": 75.63,
     "max": 218.08
    }
   },
   {
    "id": 3193,
    "name": "Glazbenik tamburaš",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   }
  ]
 },
 {
  "id": 238,
  "name": "Industrijsko-obrtnička škola Slavonski Brod",
  "city": "Slavonski Brod",
  "county": "Brodsko-posavska",
  "programs": [
   {
    "id": 3406,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 30,
     "upisani": 30,
     "min": 26.24,
     "avg": 33.2,
     "max": 46.54
    }
   },
   {
    "id": 3407,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 28.38,
     "avg": 32.68,
     "max": 39.23
    }
   },
   {
    "id": 3408,
    "name": "Elektromehaničar/Elektromehaničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 3,
     "min": 24.39,
     "avg": 25.27,
     "max": 25.85
    }
   },
   {
    "id": 3409,
    "name": "Elektroničar/Elektroničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 26.12,
     "avg": 29.77,
     "max": 35.69
    }
   },
   {
    "id": 3410,
    "name": "Izrađivač-monter strojarskih konstrukcija/Izrađivačica-monterka strojarskih konstrukcija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 17,
     "upisani": 9,
     "min": 21.92,
     "avg": 23.81,
     "max": 29.65
    }
   },
   {
    "id": 3411,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 32.1,
     "avg": 34.06,
     "max": 38.67
    }
   },
   {
    "id": 3412,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 40,
     "upisani": 39,
     "min": 22.96,
     "avg": 27.82,
     "max": 45.75
    }
   },
   {
    "id": 3413,
    "name": "Pomoćni bravar/Pomoćna bravarica",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 1,
     "min": 1.046,
     "avg": 46.46,
     "max": 46.46
    }
   },
   {
    "id": 3414,
    "name": "Serviser karoserije motornih vozila/Serviserka karoserije motornih vozila",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 23.56,
     "avg": 27.91,
     "max": 39.45
    }
   },
   {
    "id": 3415,
    "name": "Vozač motornog vozila/Vozačica motornog vozila",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 19,
     "min": 26.96,
     "avg": 30.77,
     "max": 39.34
    }
   },
   {
    "id": 3416,
    "name": "Zavarivač/Zavarivačica",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 23.37,
     "avg": 26.13,
     "max": 33.66
    }
   }
  ]
 },
 {
  "id": 1833,
  "name": "Klasična gimnazija fra Marijana Lanosovića s pravom javnosti",
  "city": "Slavonski Brod",
  "county": "Brodsko-posavska",
  "programs": [
   {
    "id": 3432,
    "name": "Klasična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 40,
     "upisani": 40,
     "min": 74.91,
     "avg": 78.05,
     "max": 80
    }
   },
   {
    "id": 3433,
    "name": "Opća gimnazija (odjel za sportaše) (320104-S)",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 127.09,
     "avg": 74.48,
     "max": 143.39
    }
   }
  ]
 },
 {
  "id": 2244,
  "name": "Obrtničko-tehnička škola",
  "city": "Slavonski Brod",
  "county": "Brodsko-posavska",
  "programs": [
   {
    "id": 3605,
    "name": "Drvodjeljski tehničar i dizajner / Drvodjeljska tehničarka i dizajnerica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 43.24,
     "avg": 46.32,
     "max": 58.21
    }
   },
   {
    "id": 3606,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 40,
     "upisani": 40,
     "min": 30.18,
     "avg": 33.52,
     "max": 47.77
    }
   },
   {
    "id": 3607,
    "name": "Građevinski radnik u održivoj gradnji/Građevinska radnica u održivoj gradnji",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 3,
     "min": 24.6,
     "avg": 24.88,
     "max": 25.24
    }
   },
   {
    "id": 3608,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 8,
     "min": 23.04,
     "avg": 26.42,
     "max": 28.79
    }
   },
   {
    "id": 3609,
    "name": "Kozmetičar / Kozmetičarka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 57.12,
     "avg": 59.91,
     "max": 70.67
    }
   },
   {
    "id": 3610,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 30,
     "upisani": 28,
     "min": 22.92,
     "avg": 28.45,
     "max": 35.94
    }
   },
   {
    "id": 3611,
    "name": "Mesar/Mesarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 2,
     "min": 22.99,
     "avg": 24.66,
     "max": 26.32
    }
   },
   {
    "id": 3612,
    "name": "Modni krojač/Modna krojačica",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 5,
     "min": 26.06,
     "avg": 26.93,
     "max": 29.14
    }
   },
   {
    "id": 3613,
    "name": "Modni tehničar / Modna tehničarka",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 45.88,
     "avg": 50.43,
     "max": 64.61
    }
   },
   {
    "id": 3614,
    "name": "Oblagač podova i zidova/Oblagačica podova i zidova",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 30.27,
     "avg": 30.66,
     "max": 36.59
    }
   },
   {
    "id": 3615,
    "name": "Pekar-slastičar/Pekarica-slastičarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 12,
     "min": 25.4,
     "avg": 29.87,
     "max": 43.67
    }
   },
   {
    "id": 3616,
    "name": "Pomoćni radnik za uređenje interijera/Pomoćna radnica za uređenje interijera",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 2,
     "min": 1.037,
     "avg": 37.67,
     "max": 39.89
    }
   },
   {
    "id": 3617,
    "name": "Soboslikar ličilac dekorater/Soboslikarica ličiteljica dekoraterka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 8,
     "min": 22.85,
     "avg": 25.33,
     "max": 27.52
    }
   }
  ]
 },
 {
  "id": 1439,
  "name": "Srednja medicinska škola",
  "city": "Slavonski Brod",
  "county": "Brodsko-posavska",
  "programs": [
   {
    "id": 3773,
    "name": "Dentalna asistentica/asistent",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 65.29,
     "avg": 70,
     "max": 78.93
    }
   },
   {
    "id": 3774,
    "name": "Farmaceutski tehničar",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 71.57,
     "avg": 75.63,
     "max": 79.92
    }
   },
   {
    "id": 3775,
    "name": "Fizioterapeutski tehničar / fizioterapeutska tehničarka",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 64.12,
     "avg": 66.75,
     "max": 74.19
    }
   },
   {
    "id": 3776,
    "name": "Medicinska sestra opće njege/medicinski tehničar opće njege",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 66.79,
     "avg": 70.67,
     "max": 78.85
    }
   },
   {
    "id": 3777,
    "name": "Pomoćni njegovatelj/Pomoćna njegovateljica",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 3,
     "min": 1.04,
     "avg": 42.73,
     "max": 44.99
    }
   }
  ]
 },
 {
  "id": 235,
  "name": "Srednja škola Matije Antuna Reljkovića Slavonski Brod",
  "city": "Slavonski Brod",
  "county": "Brodsko-posavska",
  "programs": [
   {
    "id": 4246,
    "name": "Agrotehničar / Agrotehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 42.56,
     "avg": 58.94,
     "max": 74.91
    }
   },
   {
    "id": 4247,
    "name": "Cvjećar/Cvjećarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 5,
     "min": 24.97,
     "avg": 29.6,
     "max": 35.39
    }
   },
   {
    "id": 4248,
    "name": "Fitomedicinski tehničar / Fitomedicinska tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 43.7,
     "avg": 52,
     "max": 65.98
    }
   },
   {
    "id": 4249,
    "name": "Mehaničar poljoprivredne mehanizacije/Mehaničarka poljoprivredne mehanizacije",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 13,
     "min": 23.19,
     "avg": 27.28,
     "max": 38.43
    }
   },
   {
    "id": 4250,
    "name": "Poljoprivredni gospodarstvenik/Poljoprivredna gospodarstvenica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 3,
     "min": 23.95,
     "avg": 29.5,
     "max": 38.84
    }
   },
   {
    "id": 4251,
    "name": "Šumarski tehničar / Šumarska tehničarka",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 52.4,
     "avg": 58.53,
     "max": 76.94
    }
   },
   {
    "id": 4252,
    "name": "Tehničar nutricionist / Tehničarka nutricionistica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 44.69,
     "avg": 53.2,
     "max": 59.64
    }
   },
   {
    "id": 4253,
    "name": "Veterinarski tehničar / Veterinarska tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 17,
     "min": 38.65,
     "avg": 55.44,
     "max": 76
    }
   }
  ]
 },
 {
  "id": 239,
  "name": "Tehnička škola Slavonski Brod",
  "city": "Slavonski Brod",
  "county": "Brodsko-posavska",
  "programs": [
   {
    "id": 4900,
    "name": "Arhitektonski tehničar / Arhitektonska tehničarka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 62.26,
     "avg": 71.44,
     "max": 80
    }
   },
   {
    "id": 4740,
    "name": "Tehničar prometne logistike / Tehničarka prometne logistike",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 19,
     "min": 56.04,
     "avg": 60.98,
     "max": 78.77
    }
   },
   {
    "id": 4895,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 56.44,
     "avg": 63.53,
     "max": 71.49
    }
   },
   {
    "id": 4741,
    "name": "Tehničar za 3D tehnologije / Tehničarka za 3D tehnologije",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 57.73,
     "avg": 65.23,
     "max": 79.87
    }
   },
   {
    "id": 4907,
    "name": "Tehničar za električne strojeve i elektroenergetiku / Tehničarka za električne strojeve i elektroenergetiku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 58.17,
     "avg": 67.73,
     "max": 79.6
    }
   },
   {
    "id": 4911,
    "name": "Tehničar za mehatroniku / Tehničarka za mehatroniku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 60.66,
     "avg": 66.12,
     "max": 71.74
    }
   },
   {
    "id": 4737,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 60.47,
     "avg": 70.93,
     "max": 79.69
    }
   }
  ]
 },
 {
  "id": 2276,
  "name": "Srednja škola \"Ivo Padovan\" Blato",
  "city": "Blato",
  "county": "Dubrovačko-neretvanska",
  "programs": [
   {
    "id": 3941,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 4,
     "min": 24.71,
     "avg": 27.8,
     "max": 36.59
    }
   },
   {
    "id": 3942,
    "name": "Elektromehaničar/Elektromehaničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 5,
     "min": 29.05,
     "avg": 35.42,
     "max": 45.21
    }
   },
   {
    "id": 3943,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 6,
     "min": 26.73,
     "avg": 31.51,
     "max": 40.21
    }
   },
   {
    "id": 3944,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 18,
     "upisani": 13,
     "min": 52.9,
     "avg": 69.35,
     "max": 80
    }
   },
   {
    "id": 3945,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 18,
     "upisani": 8,
     "min": 51.31,
     "avg": 60.24,
     "max": 68.57
    }
   }
  ]
 },
 {
  "id": 1830,
  "name": "Biskupijska klasična gimnazija Ruđera Boškovića s pravom javnosti",
  "city": "Dubrovnik",
  "county": "Dubrovačko-neretvanska",
  "programs": [
   {
    "id": 2722,
    "name": "Klasična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 21,
     "min": 71.14,
     "avg": 76.66,
     "max": 82
    }
   }
  ]
 },
 {
  "id": 1716,
  "name": "Dubrovačka privatna gimnazija",
  "city": "Dubrovnik",
  "county": "Dubrovačko-neretvanska",
  "programs": [
   {
    "id": 2793,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 27,
     "upisani": 27,
     "min": 55.35,
     "avg": 63.89,
     "max": 78.12
    }
   }
  ]
 },
 {
  "id": 354,
  "name": "Ekonomska i trgovačka škola Dubrovnik",
  "city": "Dubrovnik",
  "county": "Dubrovačko-neretvanska",
  "programs": [
   {
    "id": 2803,
    "name": "Komercijalist / Komercijalistica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 23,
     "min": 52.15,
     "avg": 57.24,
     "max": 71.29
    }
   },
   {
    "id": 2805,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 48,
     "upisani": 26,
     "min": 23.32,
     "avg": 27.9,
     "max": 44.92
    }
   },
   {
    "id": 2806,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 22,
     "min": 57.23,
     "avg": 64.19,
     "max": 75.52
    }
   },
   {
    "id": 2809,
    "name": "Tehničar za razvoj i dizajn web sučelja / Tehničarka za razvoj i dizajn web sučelja",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 20,
     "min": 59.57,
     "avg": 67.09,
     "max": 80
    }
   },
   {
    "id": 2808,
    "name": "Upravno-poslovni referent / Upravno-poslovna referentica",
    "sector": "Pravo, politologija, sociologija, državna uprava i javni poslovi",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 22,
     "min": 57.13,
     "avg": 60.48,
     "max": 72.41
    }
   }
  ]
 },
 {
  "id": 355,
  "name": "Gimnazija Dubrovnik",
  "city": "Dubrovnik",
  "county": "Dubrovačko-neretvanska",
  "programs": [
   {
    "id": 2936,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 28,
     "upisani": 20,
     "min": 68.01,
     "avg": 71.3,
     "max": 78.13
    }
   },
   {
    "id": 2937,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 112,
     "upisani": 112,
     "min": 69.53,
     "avg": 76.57,
     "max": 83
    }
   },
   {
    "id": 2938,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 28,
     "upisani": 26,
     "min": 68.11,
     "avg": 76.42,
     "max": 82
    }
   }
  ]
 },
 {
  "id": 356,
  "name": "Medicinska škola Dubrovnik",
  "city": "Dubrovnik",
  "county": "Dubrovačko-neretvanska",
  "programs": [
   {
    "id": 3449,
    "name": "Medicinska sestra opće njege/medicinski tehničar opće njege",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 55,
     "upisani": 53,
     "min": 50.22,
     "avg": 60.56,
     "max": 75.16
    }
   }
  ]
 },
 {
  "id": 352,
  "name": "Obrtnička i tehnička škola Dubrovnik",
  "city": "Dubrovnik",
  "county": "Dubrovačko-neretvanska",
  "programs": [
   {
    "id": 3508,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 9,
     "min": 28.71,
     "avg": 31.55,
     "max": 36.31
    }
   },
   {
    "id": 3509,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 14,
     "min": 27.78,
     "avg": 29.95,
     "max": 33.91
    }
   },
   {
    "id": 3510,
    "name": "Elektromehaničar/Elektromehaničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 29.83,
     "avg": 33.1,
     "max": 38.31
    }
   },
   {
    "id": 3511,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 28.63,
     "avg": 33.12,
     "max": 42.98
    }
   },
   {
    "id": 3512,
    "name": "Kozmetičar / Kozmetičarka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 65.17,
     "avg": 62.38,
     "max": 74.97
    }
   },
   {
    "id": 3513,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 6,
     "min": 29.76,
     "avg": 32.83,
     "max": 43.69
    }
   },
   {
    "id": 3514,
    "name": "Pomoćni cvjećar/Pomoćna cvjećarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 2,
     "min": 1.05,
     "avg": 50,
     "max": 50
    }
   },
   {
    "id": 3515,
    "name": "Serviser karoserije motornih vozila/Serviserka karoserije motornih vozila",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 26.59,
     "avg": 27.19,
     "max": 27.82
    }
   },
   {
    "id": 3516,
    "name": "Tehničar geodezije i geoinformatike / Tehničarka geodezije i geoinformatike",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 16,
     "min": 62.73,
     "avg": 67.4,
     "max": 76.3
    }
   }
  ]
 },
 {
  "id": 357,
  "name": "Pomorsko-tehnička škola Dubrovnik",
  "city": "Dubrovnik",
  "county": "Dubrovačko-neretvanska",
  "programs": [
   {
    "id": 3654,
    "name": "Pomorski nautičar / Pomorska nautičarka",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 45,
     "upisani": 45,
     "min": 47.84,
     "avg": 56.76,
     "max": 76.29
    }
   },
   {
    "id": 3655,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 14,
     "min": 50.74,
     "avg": 59.33,
     "max": 70.49
    }
   },
   {
    "id": 3656,
    "name": "Tehničar za brodostrojarstvo / Tehničarka za brodostrojarstvo",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 23,
     "min": 46.25,
     "avg": 53.49,
     "max": 66.04
    }
   },
   {
    "id": 3657,
    "name": "Tehničar za elektroniku i komunikacije / Tehničarka za elektroniku i komunikacije",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 66.03,
     "avg": 71.98,
     "max": 82
    }
   }
  ]
 },
 {
  "id": 358,
  "name": "Turistička i ugostiteljska škola Dubrovnik",
  "city": "Dubrovnik",
  "county": "Dubrovačko-neretvanska",
  "programs": [
   {
    "id": 4758,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 19,
     "min": 22.8,
     "avg": 25.91,
     "max": 28.73
    }
   },
   {
    "id": 4759,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 32,
     "upisani": 30,
     "min": 22.91,
     "avg": 27.78,
     "max": 38.15
    }
   },
   {
    "id": 4760,
    "name": "Kuharski tehničar / Kuharska tehničarka",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 25,
     "upisani": 25,
     "min": 48.33,
     "avg": 51.97,
     "max": 64.43
    }
   },
   {
    "id": 4761,
    "name": "Pomoćni kuhar/Pomoćna kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 2,
     "min": 1.031,
     "avg": 39.41,
     "max": 49.15
    }
   },
   {
    "id": 4762,
    "name": "Slastičar/Slastičarka",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 23.21,
     "avg": 27.86,
     "max": 35.08
    }
   },
   {
    "id": 4763,
    "name": "Tehničar za ugostiteljstvo / Tehničarka za ugostiteljstvo",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 23,
     "min": 53.84,
     "avg": 56.76,
     "max": 67.08
    }
   },
   {
    "id": 4764,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 78,
     "upisani": 78,
     "min": 61.43,
     "avg": 68.42,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 359,
  "name": "Umjetnička škola Luke Sorkočevića Dubrovnik",
  "city": "Dubrovnik",
  "county": "Dubrovačko-neretvanska",
  "programs": [
   {
    "id": 4813,
    "name": "Glazbenik - pripremno obrazovanje: Glazbenik teorijski smjer (290002:10660)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 4814,
    "name": "Glazbenik - pripremno obrazovanje: Oboa - temeljni predmet (290002:1851)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 4815,
    "name": "Glazbenik - pripremno obrazovanje: Orgulje - temeljni predmet (290002:1862)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 4816,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 4817,
    "name": "Glazbenik - teorijski smjer",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": 1,
     "min": 233.79,
     "avg": 78.79,
     "max": 233.79
    }
   },
   {
    "id": 4818,
    "name": "Glazbenik gitarist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 257.09,
     "avg": 88.09,
     "max": 257.09
    }
   },
   {
    "id": 4819,
    "name": "Glazbenik klavirist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 220.12,
     "avg": 63.12,
     "max": 220.12
    }
   },
   {
    "id": 4820,
    "name": "Glazbenik kontrabasist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 4821,
    "name": "Glazbenik trubač",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 1.141,
     "avg": 61.54,
     "max": 141.54
    }
   },
   {
    "id": 4822,
    "name": "Slikarski dizajner",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 10,
     "min": 130.75,
     "avg": 59.67,
     "max": 156.16
    }
   }
  ]
 },
 {
  "id": 2289,
  "name": "Srednja škola Petra Šegedina",
  "city": "Korčula",
  "county": "Dubrovačko-neretvanska",
  "programs": [
   {
    "id": 4300,
    "name": "Elektromehaničar/Elektromehaničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 6,
     "min": 24.47,
     "avg": 26.33,
     "max": 32.48
    }
   },
   {
    "id": 4301,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 3,
     "min": 28.76,
     "avg": 30.14,
     "max": 32.65
    }
   },
   {
    "id": 4302,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 6,
     "min": 29.01,
     "avg": 33.59,
     "max": 39.08
    }
   },
   {
    "id": 4303,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 3,
     "min": 28.36,
     "avg": 31.59,
     "max": 36.81
    }
   },
   {
    "id": 4304,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 46.08,
     "avg": 70.6,
     "max": 83
    }
   },
   {
    "id": 4305,
    "name": "Pomoćni konobar/Pomoćna konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 1,
     "min": 1.049,
     "avg": 49.63,
     "max": 49.63
    }
   },
   {
    "id": 4306,
    "name": "Slastičar/Slastičarka",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 6,
     "min": 25.95,
     "avg": 31.05,
     "max": 43.78
    }
   },
   {
    "id": 4307,
    "name": "Tehničar za brodostrojarstvo / Tehničarka za brodostrojarstvo",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 14,
     "min": 45.72,
     "avg": 61.02,
     "max": 77.02
    }
   },
   {
    "id": 4308,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 50.23,
     "avg": 61.55,
     "max": 74.82
    }
   }
  ]
 },
 {
  "id": 363,
  "name": "Gimnazija Metković",
  "city": "Metković",
  "county": "Dubrovačko-neretvanska",
  "programs": [
   {
    "id": 2980,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 25,
     "min": 52.6,
     "avg": 67.45,
     "max": 76.61
    }
   },
   {
    "id": 2981,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 52,
     "min": 61.92,
     "avg": 74.68,
     "max": 80
    }
   },
   {
    "id": 2982,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 28,
     "upisani": 18,
     "min": 43.18,
     "avg": 73.83,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 362,
  "name": "Srednja škola Metković",
  "city": "Metković",
  "county": "Dubrovačko-neretvanska",
  "programs": [
   {
    "id": 4254,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 28.65,
     "avg": 32.82,
     "max": 46.72
    }
   },
   {
    "id": 4255,
    "name": "Elektromehaničar/Elektromehaničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 27.84,
     "avg": 31.26,
     "max": 41.78
    }
   },
   {
    "id": 4256,
    "name": "Građevinski tehničar / Građevinska tehničarka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 15,
     "min": 35.31,
     "avg": 51.34,
     "max": 73.58
    }
   },
   {
    "id": 4257,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 3,
     "min": 25.5,
     "avg": 29.07,
     "max": 31.81
    }
   },
   {
    "id": 4258,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 11,
     "min": 22.92,
     "avg": 25.05,
     "max": 28.32
    }
   },
   {
    "id": 4259,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 32.29,
     "avg": 34.6,
     "max": 36.35
    }
   },
   {
    "id": 4260,
    "name": "Tehničar za električne strojeve i elektroenergetiku / Tehničarka za električne strojeve i elektroenergetiku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 55.56,
     "avg": 65.35,
     "max": 80
    }
   },
   {
    "id": 4261,
    "name": "Tehničar za ugostiteljstvo / Tehničarka za ugostiteljstvo",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 17,
     "min": 35.86,
     "avg": 49.35,
     "max": 67.71
    }
   },
   {
    "id": 4262,
    "name": "Upravno-poslovni referent / Upravno-poslovna referentica",
    "sector": "Pravo, politologija, sociologija, državna uprava i javni poslovi",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 19,
     "min": 48.11,
     "avg": 54.31,
     "max": 74.07
    }
   },
   {
    "id": 4263,
    "name": "Vozač motornog vozila/Vozačica motornog vozila",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 16,
     "min": 23.97,
     "avg": 25.83,
     "max": 32.24
    }
   }
  ]
 },
 {
  "id": 2268,
  "name": "Srednja poljoprivredna i tehnička škola",
  "city": "Opuzen",
  "county": "Dubrovačko-neretvanska",
  "programs": [
   {
    "id": 3778,
    "name": "Agroturistički tehničar / Agroturistička tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 9,
     "min": 37.74,
     "avg": 42.68,
     "max": 46.94
    }
   },
   {
    "id": 3779,
    "name": "Komercijalist / Komercijalistica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 11,
     "upisani": 9,
     "min": 40.62,
     "avg": 54.64,
     "max": 77.68
    }
   },
   {
    "id": 3780,
    "name": "Tehničar za razvoj i dizajn web sučelja / Tehničarka za razvoj i dizajn web sučelja",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 23,
     "min": 42.45,
     "avg": 56.8,
     "max": 78.85
    }
   }
  ]
 },
 {
  "id": 364,
  "name": "Srednja škola fra Andrije Kačića Miošića Ploče",
  "city": "Ploče",
  "county": "Dubrovačko-neretvanska",
  "programs": [
   {
    "id": 4083,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 2,
     "min": 23.51,
     "avg": 25.01,
     "max": 26.5
    }
   },
   {
    "id": 4080,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 55.25,
     "avg": 70.54,
     "max": 80
    }
   },
   {
    "id": 4084,
    "name": "Pomoćni kuhar/Pomoćna kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 4085,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 6,
     "min": 50.45,
     "avg": 57.56,
     "max": 68.97
    }
   },
   {
    "id": 4082,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 40,
     "upisani": 28,
     "min": 41.92,
     "avg": 56.61,
     "max": 72.7
    }
   }
  ]
 },
 {
  "id": 361,
  "name": "Srednja škola Vela Luka",
  "city": "Vela Luka",
  "county": "Dubrovačko-neretvanska",
  "programs": [
   {
    "id": 4367,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 2,
     "min": 25.17,
     "avg": 32.93,
     "max": 40.68
    }
   },
   {
    "id": 4368,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 18,
     "upisani": 4,
     "min": 39.88,
     "avg": 57.54,
     "max": 71.37
    }
   },
   {
    "id": 4369,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 16,
     "min": 40.48,
     "avg": 60.91,
     "max": 76.33
    }
   },
   {
    "id": 4370,
    "name": "Slastičar/Slastičarka",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 3,
     "min": 31.25,
     "avg": 35.12,
     "max": 37.91
    }
   }
  ]
 },
 {
  "id": 1917,
  "name": "Glazbena škola Zlatka Grgoševića",
  "city": "Sesvete",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3224,
    "name": "Glazbenik - pripremno obrazovanje",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 15,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3225,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 30,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3226,
    "name": "Glazbenik gitarist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3227,
    "name": "Glazbenik klavirist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3228,
    "name": "Glazbenik pjevač",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3229,
    "name": "Glazbenik trombonist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 180.19,
     "avg": 68.19,
     "max": 180.19
    }
   },
   {
    "id": 3230,
    "name": "Glazbenik violončelist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 187.41,
     "avg": 80.41,
     "max": 187.41
    }
   }
  ]
 },
 {
  "id": 2076,
  "name": "Srednja škola Jelkovec",
  "city": "Sesvete",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4160,
    "name": "Tehničar za električne strojeve i elektroenergetiku / Tehničarka za električne strojeve i elektroenergetiku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 23,
     "min": 60.11,
     "avg": 65.26,
     "max": 72.42
    }
   },
   {
    "id": 4161,
    "name": "Tehničar za elektroniku i komunikacije / Tehničarka za elektroniku i komunikacije",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 25,
     "upisani": 24,
     "min": 60.07,
     "avg": 65.88,
     "max": 72.71
    }
   },
   {
    "id": 4162,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 78,
     "upisani": 61,
     "min": 64.17,
     "avg": 69.14,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 38,
  "name": "Agronomska škola Zagreb",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 2716,
    "name": "Agrotehničar / Agrotehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 25,
     "min": 47.25,
     "avg": 54.88,
     "max": 75.64
    }
   },
   {
    "id": 2717,
    "name": "Agroturistički tehničar / Agroturistička tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 25,
     "upisani": 24,
     "min": 50.35,
     "avg": 55.79,
     "max": 73.67
    }
   },
   {
    "id": 2718,
    "name": "Cvjećar/Cvjećarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 25.71,
     "avg": 30.6,
     "max": 49.67
    }
   },
   {
    "id": 2719,
    "name": "Fitomedicinski tehničar / Fitomedicinska tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 45.58,
     "avg": 51.7,
     "max": 56.62
    }
   },
   {
    "id": 2720,
    "name": "Hortikulturni tehničar dizajner / Hortikulturna tehničarka dizajnerica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 25,
     "min": 47.58,
     "avg": 53.04,
     "max": 61.53
    }
   },
   {
    "id": 2721,
    "name": "Poljoprivredni gospodarstvenik/Poljoprivredna gospodarstvenica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 23,
     "min": 24.89,
     "avg": 28.02,
     "max": 38.81
    }
   }
  ]
 },
 {
  "id": 2179,
  "name": "Centar za odgoj i obrazovanje Slave Raškaj",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 2740,
    "name": "Autolimar (prilagođeni program)",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 1,
     "min": 1.044,
     "avg": 44.58,
     "max": 44.58
    }
   },
   {
    "id": 2741,
    "name": "Bravar (prilagođeni program)",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": 2,
     "min": 1.025,
     "avg": 36.07,
     "max": 48.92
    }
   },
   {
    "id": 2742,
    "name": "Krojač (prilagođeni program)",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 2743,
    "name": "Kuhar (prilagođeni program)",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 5,
     "min": 1.029,
     "avg": 38.43,
     "max": 48.52
    }
   },
   {
    "id": 2744,
    "name": "Pomoćni krojač/Pomoćna krojačica",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 2745,
    "name": "Pomoćni kuhar/Pomoćna kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 6,
     "min": 1.028,
     "avg": 35.82,
     "max": 46.05
    }
   },
   {
    "id": 2746,
    "name": "Slastičar (prilagođeni program)",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 2,
     "min": 1.025,
     "avg": 27.58,
     "max": 31.29
    }
   }
  ]
 },
 {
  "id": 1292,
  "name": "Centar za odgoj i obrazovanje Vinko Bek",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 2752,
    "name": "Pomoćni administrator/Pomoćna administratorica",
    "sector": "Pravo, politologija, sociologija, državna uprava i javni poslovi",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 2,
     "min": 1.04,
     "avg": 41.3,
     "max": 42.24
    }
   },
   {
    "id": 2753,
    "name": "Poslovni tajnik (prilagođeni program)",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 4,
     "min": 1.043,
     "avg": 48.08,
     "max": 51.88
    }
   },
   {
    "id": 2754,
    "name": "Telefonski operater (prilagođeni program)",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   }
  ]
 },
 {
  "id": 2183,
  "name": "Druga ekonomska škola",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 2772,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 23,
     "min": 70.13,
     "avg": 72.11,
     "max": 80
    }
   },
   {
    "id": 2773,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 78,
     "upisani": 78,
     "min": 65.75,
     "avg": 70.22,
     "max": 77.71
    }
   },
   {
    "id": 2774,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju (odjel za sportaše) (060500-S)",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 127.49,
     "avg": 69.78,
     "max": 152.7
    }
   }
  ]
 },
 {
  "id": 2194,
  "name": "Elektrostrojarska obrtnička škola",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 2870,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 126,
     "upisani": 126,
     "min": 28.18,
     "avg": 33.42,
     "max": 45.23
    }
   },
   {
    "id": 2871,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 37,
     "upisani": 36,
     "min": 28.15,
     "avg": 32.03,
     "max": 40.76
    }
   },
   {
    "id": 2872,
    "name": "Elektromehaničar/Elektromehaničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 24,
     "min": 24.16,
     "avg": 28.88,
     "max": 44.1
    }
   },
   {
    "id": 2873,
    "name": "Elektroničar/Elektroničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 14,
     "min": 26.02,
     "avg": 32.61,
     "max": 39.78
    }
   },
   {
    "id": 2874,
    "name": "Mehaničar poljoprivredne mehanizacije/Mehaničarka poljoprivredne mehanizacije",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 11,
     "min": 22.96,
     "avg": 24.51,
     "max": 26.03
    }
   },
   {
    "id": 2875,
    "name": "Serviser karoserije motornih vozila/Serviserka karoserije motornih vozila",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 38,
     "upisani": 33,
     "min": 24.58,
     "avg": 28.12,
     "max": 38.79
    }
   }
  ]
 },
 {
  "id": 1363,
  "name": "Elektrotehnička škola",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 2902,
    "name": "Tehničar za električne strojeve i elektroenergetiku / Tehničarka za električne strojeve i elektroenergetiku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 50,
     "upisani": 50,
     "min": 55.61,
     "avg": 60.43,
     "max": 70.39
    }
   },
   {
    "id": 2903,
    "name": "Tehničar za elektroniku i komunikacije / Tehničarka za elektroniku i komunikacije",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 53,
     "upisani": 53,
     "min": 57.71,
     "avg": 62.01,
     "max": 76.69
    }
   },
   {
    "id": 2904,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 78,
     "upisani": 77,
     "min": 61.6,
     "avg": 65.81,
     "max": 73.78
    }
   }
  ]
 },
 {
  "id": 2196,
  "name": "Epoha, privatna gimnazija s pravom javnosti",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 2905,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 0,
     "min": 56.49,
     "avg": 63.89,
     "max": 71.28
    }
   }
  ]
 },
 {
  "id": 2199,
  "name": "Geodetska škola",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 2909,
    "name": "Tehničar geodezije i geoinformatike / Tehničarka geodezije i geoinformatike",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 89,
     "upisani": 87,
     "min": 59.92,
     "avg": 63.61,
     "max": 77.26
    }
   }
  ]
 },
 {
  "id": 2203,
  "name": "Gimnazija i ekonomska škola Benedikta Kotruljevića, s pravom javnosti",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 2944,
    "name": "Farmaceutski tehničar",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 20,
     "min": 61.31,
     "avg": 66.65,
     "max": 79.78
    }
   },
   {
    "id": 2945,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 72,
     "upisani": 72,
     "min": 66.6,
     "avg": 72.96,
     "max": 82
    }
   }
  ]
 },
 {
  "id": 1334,
  "name": "Gimnazija Lucijana Vranjanina",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 2968,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 112,
     "upisani": 112,
     "min": 80.89,
     "avg": 78.88,
     "max": 89.5
    }
   },
   {
    "id": 2969,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 84,
     "upisani": 84,
     "min": 84.42,
     "avg": 79.61,
     "max": 91
    }
   }
  ]
 },
 {
  "id": 376,
  "name": "Gimnazija Sesvete",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 2994,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 130,
     "upisani": 131,
     "min": 72.89,
     "avg": 77,
     "max": 81.7
    }
   }
  ]
 },
 {
  "id": 1848,
  "name": "Gimnazija Tituša Brezovačkog",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 2998,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 129,
     "upisani": 129,
     "min": 84.15,
     "avg": 79.72,
     "max": 90.25
    }
   }
  ]
 },
 {
  "id": 1912,
  "name": "Glazbena škola Blagoja Berse",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3015,
    "name": "Glazbenik - pripremno obrazovanje",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3016,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 30,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3017,
    "name": "Glazbenik pjevač",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 234.75,
     "avg": 81.75,
     "max": 234.75
    }
   }
  ]
 },
 {
  "id": 414,
  "name": "Glazbena škola Bonar",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3019,
    "name": "Glazbenik - pripremno obrazovanje",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 40,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3020,
    "name": "Glazbenik - pripremno obrazovanje: Flauta - temeljni predmet (290002:1757)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3021,
    "name": "Glazbenik - pripremno obrazovanje: Gitara - temeljni predmet (290002:1765)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3022,
    "name": "Glazbenik - pripremno obrazovanje: Glazbenik pjevač (290002:10659)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3023,
    "name": "Glazbenik - pripremno obrazovanje: Harfa - temeljni predmet (290002:1775)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3024,
    "name": "Glazbenik - pripremno obrazovanje: Harmonika - temeljni predmet (290002:1777)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3025,
    "name": "Glazbenik - pripremno obrazovanje: Klarinet - temeljni predmet (290002:1797)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3026,
    "name": "Glazbenik - pripremno obrazovanje: Klavir - temeljni predmet (290002:10364)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3027,
    "name": "Glazbenik - pripremno obrazovanje: Oboa - temeljni predmet (290002:1851)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3028,
    "name": "Glazbenik - pripremno obrazovanje: Saksofon - temeljni predmet (290002:1931)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3029,
    "name": "Glazbenik - pripremno obrazovanje: Solfeggio (290002:1939)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3030,
    "name": "Glazbenik - pripremno obrazovanje: Truba - temeljni predmet (290002:1992)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3031,
    "name": "Glazbenik - pripremno obrazovanje: Udaraljke - temeljni predmet (290002:1994)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3032,
    "name": "Glazbenik - pripremno obrazovanje: Violina - temeljni predmet (290002:1997)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3033,
    "name": "Glazbenik - pripremno obrazovanje: Violončelo - temeljni predmet (290002:1998)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3034,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 40,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3035,
    "name": "Glazbenik - teorijski smjer",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3036,
    "name": "Glazbenik flautist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3037,
    "name": "Glazbenik gitarist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3038,
    "name": "Glazbenik harfist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3039,
    "name": "Glazbenik harmonikaš",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3040,
    "name": "Glazbenik klavirist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3041,
    "name": "Glazbenik oboist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3042,
    "name": "Glazbenik pjevač",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3043,
    "name": "Glazbenik saksofonist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3044,
    "name": "Glazbenik trubač",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3045,
    "name": "Glazbenik udaraljkaš",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3046,
    "name": "Glazbenik violinist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3047,
    "name": "Glazbenik violončelist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   }
  ]
 },
 {
  "id": 411,
  "name": "Glazbena škola Brkanović",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3048,
    "name": "Glazbenik - pripremno obrazovanje",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 40,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3049,
    "name": "Glazbenik - pripremno obrazovanje: Flauta - temeljni predmet (290002:1757)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3050,
    "name": "Glazbenik - pripremno obrazovanje: Gitara - temeljni predmet (290002:1765)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3051,
    "name": "Glazbenik - pripremno obrazovanje: Glazbenik pjevač (290002:10659)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3052,
    "name": "Glazbenik - pripremno obrazovanje: Glazbenik teorijski smjer (290002:10660)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3053,
    "name": "Glazbenik - pripremno obrazovanje: Harmonika - temeljni predmet (290002:1777)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3054,
    "name": "Glazbenik - pripremno obrazovanje: Klarinet - temeljni predmet (290002:1797)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3055,
    "name": "Glazbenik - pripremno obrazovanje: Klavir - temeljni predmet (290002:10364)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3056,
    "name": "Glazbenik - pripremno obrazovanje: Kontrabas - temeljni predmet (290002:1806)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3057,
    "name": "Glazbenik - pripremno obrazovanje: Saksofon - temeljni predmet (290002:1931)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3058,
    "name": "Glazbenik - pripremno obrazovanje: Tambure - temeljni predmet (290002:10557)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3059,
    "name": "Glazbenik - pripremno obrazovanje: Trombon - temeljni predmet (290002:1991)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3060,
    "name": "Glazbenik - pripremno obrazovanje: Truba - temeljni predmet (290002:1992)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3061,
    "name": "Glazbenik - pripremno obrazovanje: Viola - temeljni predmet (290002:1996)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3062,
    "name": "Glazbenik - pripremno obrazovanje: Violina - temeljni predmet (290002:1997)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3063,
    "name": "Glazbenik - pripremno obrazovanje: Violončelo - temeljni predmet (290002:1998)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3064,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 60,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3065,
    "name": "Glazbenik - teorijski smjer",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3066,
    "name": "Glazbenik flautist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3067,
    "name": "Glazbenik gitarist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 4,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3068,
    "name": "Glazbenik harmonikaš",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 4,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3069,
    "name": "Glazbenik klarinetist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3070,
    "name": "Glazbenik klavirist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3071,
    "name": "Glazbenik kontrabasist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3072,
    "name": "Glazbenik kornist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3073,
    "name": "Glazbenik orguljaš",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3074,
    "name": "Glazbenik pjevač",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 4,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3075,
    "name": "Glazbenik saksofonist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3076,
    "name": "Glazbenik tamburaš",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3077,
    "name": "Glazbenik trombonist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3078,
    "name": "Glazbenik trubač",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3079,
    "name": "Glazbenik tubist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3080,
    "name": "Glazbenik violinist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3081,
    "name": "Glazbenik violist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3082,
    "name": "Glazbenik violončelist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   }
  ]
 },
 {
  "id": 2216,
  "name": "Glazbena škola Ladislav Račić",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3161,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 15,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3162,
    "name": "Glazbenik bas gitarist popularne i jazz glazbe",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3163,
    "name": "Glazbenik bubnjar i udaraljkaš popularne i jazz glazbe",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3164,
    "name": "Glazbenik gitarist popularne i jazz glazbe",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3165,
    "name": "Glazbenik klavirist popularne i jazz glazbe",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3166,
    "name": "Glazbenik pjevač popularne i jazz glazbe",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3167,
    "name": "Glazbenik saksofonist popularne i jazz glazbe",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   }
  ]
 },
 {
  "id": 1908,
  "name": "Glazbena škola Pavla Markovca",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3170,
    "name": "Glazbenik - pripremno obrazovanje",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 15,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3171,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 45,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3172,
    "name": "Glazbenik - teorijski smjer",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3173,
    "name": "Glazbenik flautist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 185.6,
     "avg": 76.6,
     "max": 185.6
    }
   },
   {
    "id": 3174,
    "name": "Glazbenik gitarist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 202.98,
     "avg": 73.98,
     "max": 202.98
    }
   },
   {
    "id": 3175,
    "name": "Glazbenik klavirist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 220.1,
     "avg": 74.1,
     "max": 220.1
    }
   },
   {
    "id": 3176,
    "name": "Glazbenik udaraljkaš",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3177,
    "name": "Graditelj i restaurator glazbala",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 214.63,
     "avg": 70.63,
     "max": 214.63
    }
   }
  ]
 },
 {
  "id": 1909,
  "name": "Glazbena škola Vatroslava Lisinskog",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3216,
    "name": "Glazbenik - pripremno obrazovanje",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 25,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3217,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 50,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3218,
    "name": "Glazbenik - teorijski smjer",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": 3,
     "min": 179.31,
     "avg": 81.44,
     "max": 226.75
    }
   },
   {
    "id": 3219,
    "name": "Glazbenik harfist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3220,
    "name": "Glazbenik klavirist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 237.27,
     "avg": 84.27,
     "max": 237.27
    }
   },
   {
    "id": 3221,
    "name": "Glazbenik kornist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 197.94,
     "avg": 68.94,
     "max": 197.94
    }
   }
  ]
 },
 {
  "id": 2046,
  "name": "Glazbena škola Zlatka Balokovića",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3222,
    "name": "Glazbenik - pripremno obrazovanje",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3223,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 28,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   }
  ]
 },
 {
  "id": 1898,
  "name": "Glazbeno učilište Elly Bašić",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3231,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 42,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3232,
    "name": "Glazbenik - teorijski smjer",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": 2,
     "min": 151.68,
     "avg": 83.53,
     "max": 256.38
    }
   },
   {
    "id": 3233,
    "name": "Glazbenik harmonikaš",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3234,
    "name": "Glazbenik klavirist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": 2,
     "min": 246,
     "avg": 83.39,
     "max": 246
    }
   },
   {
    "id": 3235,
    "name": "Glazbenik kontrabasist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 188.46,
     "avg": 69.46,
     "max": 188.46
    }
   },
   {
    "id": 3236,
    "name": "Glazbenik pjevač",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 174.23,
     "avg": 75.23,
     "max": 174.23
    }
   },
   {
    "id": 3237,
    "name": "Glazbenik saksofonist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 208.47,
     "avg": 74.47,
     "max": 208.47
    }
   },
   {
    "id": 3238,
    "name": "Glazbenik udaraljkaš",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 196.07,
     "avg": 73.07,
     "max": 196.07
    }
   },
   {
    "id": 3239,
    "name": "Glazbenik violončelist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 171.63,
     "avg": 80.63,
     "max": 171.63
    }
   }
  ]
 },
 {
  "id": 2219,
  "name": "Gornjogradska gimnazija",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3240,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 160,
     "upisani": 160,
     "min": 76.4,
     "avg": 78.22,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 2222,
  "name": "Graditeljska tehnička škola",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3292,
    "name": "Arhitektonski tehničar / Arhitektonska tehničarka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 77,
     "upisani": 77,
     "min": 71.52,
     "avg": 73.71,
     "max": 80.25
    }
   },
   {
    "id": 3293,
    "name": "Građevinski tehničar / Građevinska tehničarka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 51,
     "upisani": 51,
     "min": 68.4,
     "avg": 70.8,
     "max": 79.75
    }
   }
  ]
 },
 {
  "id": 33,
  "name": "Hotelijersko-turistička škola u Zagrebu",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3326,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 45,
     "min": 64.4,
     "avg": 68.16,
     "max": 74.95
    }
   },
   {
    "id": 3327,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacija (odjel za sportaše) (070108-S)",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 54,
     "min": 122.51,
     "avg": 68.25,
     "max": 154.86
    }
   },
   {
    "id": 3328,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 104,
     "upisani": 103,
     "min": 67.11,
     "avg": 71.04,
     "max": 79.85
    }
   }
  ]
 },
 {
  "id": 2089,
  "name": "Humanistička gimnazija",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3330,
    "name": "Klasična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 48,
     "upisani": 43,
     "min": 43.41,
     "avg": 64.56,
     "max": 77.57
    }
   }
  ]
 },
 {
  "id": 2225,
  "name": "I. gimnazija",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3335,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 112,
     "upisani": 112,
     "min": 83.14,
     "avg": 79.66,
     "max": 90.75
    }
   },
   {
    "id": 3336,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 28,
     "upisani": 28,
     "min": 86.92,
     "avg": 79.71,
     "max": 91.75
    }
   }
  ]
 },
 {
  "id": 1419,
  "name": "I. tehnička škola Tesla",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3337,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 51,
     "upisani": 45,
     "min": 58.46,
     "avg": 64.2,
     "max": 80
    }
   },
   {
    "id": 3338,
    "name": "Tehničar za električne strojeve i elektroenergetiku / Tehničarka za električne strojeve i elektroenergetiku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 76,
     "upisani": 63,
     "min": 60.28,
     "avg": 66.74,
     "max": 80
    }
   },
   {
    "id": 3339,
    "name": "Tehničar za elektroniku i komunikacije / Tehničarka za elektroniku i komunikacije",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 121,
     "upisani": 121,
     "min": 60.64,
     "avg": 66.83,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 55,
  "name": "II. gimnazija Zagreb",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3342,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 168,
     "upisani": 168,
     "min": 76.12,
     "avg": 79.02,
     "max": 82
    }
   }
  ]
 },
 {
  "id": 1319,
  "name": "III. gimnazija",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3345,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 104,
     "upisani": 104,
     "min": 75.19,
     "avg": 78.12,
     "max": 81
    }
   },
   {
    "id": 3344,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 52,
     "min": 79.26,
     "avg": 78.18,
     "max": 87.5
    }
   }
  ]
 },
 {
  "id": 2226,
  "name": "Industrijska strojarska škola",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3346,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 51,
     "upisani": 51,
     "min": 26.93,
     "avg": 31.15,
     "max": 41.09
    }
   },
   {
    "id": 3347,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 55,
     "upisani": 55,
     "min": 26.24,
     "avg": 31.04,
     "max": 37.23
    }
   },
   {
    "id": 3348,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 79,
     "upisani": 72,
     "min": 23.06,
     "avg": 27.07,
     "max": 39.02
    }
   },
   {
    "id": 3349,
    "name": "Serviser karoserije motornih vozila/Serviserka karoserije motornih vozila",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 25,
     "min": 23.76,
     "avg": 26.37,
     "max": 35.41
    }
   }
  ]
 },
 {
  "id": 2229,
  "name": "Islamska gimnazija dr. Ahmeda Smajlovića",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3417,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 21,
     "upisani": 6,
     "min": 52.98,
     "avg": 56.29,
     "max": 59.18
    }
   }
  ]
 },
 {
  "id": 1300,
  "name": "IV. gimnazija",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3420,
    "name": "Dvojezični program jezične gimnazije na engleskom jeziku",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 77.27,
     "avg": 78.76,
     "max": 80.87
    }
   },
   {
    "id": 3421,
    "name": "Dvojezični program jezične gimnazije na francuskom jeziku",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 11,
     "min": 69.39,
     "avg": 73.8,
     "max": 80
    }
   },
   {
    "id": 3422,
    "name": "Dvojezični program jezične gimnazije na njemačkom jeziku",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 6,
     "min": 69.16,
     "avg": 73.11,
     "max": 79.83
    }
   },
   {
    "id": 3423,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 78,
     "upisani": 78,
     "min": 71.84,
     "avg": 74.81,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 1820,
  "name": "IX. gimnazija",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3424,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 112,
     "upisani": 103,
     "min": 72.02,
     "avg": 75.09,
     "max": 80.69
    }
   },
   {
    "id": 3425,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 28,
     "upisani": 28,
     "min": 76.6,
     "avg": 76.23,
     "max": 86.84
    }
   }
  ]
 },
 {
  "id": 1296,
  "name": "Klasična gimnazija",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3434,
    "name": "Klasična gimnazija - nastavljači (320404-N)",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 22,
     "min": 62.08,
     "avg": 70.5,
     "max": 80
    }
   },
   {
    "id": 3435,
    "name": "Klasična gimnazija - početnici (320404-K)",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 89,
     "upisani": 89,
     "min": 57.47,
     "avg": 68.41,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 2233,
  "name": "LINIGRA-privatna škola s pravom javnosti",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3443,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 40,
     "upisani": 32,
     "min": 44.4,
     "avg": 54.51,
     "max": 64.15
    }
   }
  ]
 },
 {
  "id": 2234,
  "name": "Međunarodna britanska škola \"Vedri obzori\"",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3470,
    "name": "Međunarodni program za srednje škole",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 15,
     "min": 46.44,
     "avg": 74.32,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 2238,
  "name": "Nadbiskupska klasična gimnazija s pravom javnosti",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3486,
    "name": "Klasična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 98,
     "upisani": 98,
     "min": 59.51,
     "avg": 68.51,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 2240,
  "name": "Obrtnička i industrijska graditeljska škola",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3498,
    "name": "Dimnjačar/Dimnjačarka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 3,
     "min": 22.01,
     "avg": 23.28,
     "max": 24.54
    }
   },
   {
    "id": 3499,
    "name": "Građevinski radnik u održivoj gradnji/Građevinska radnica u održivoj gradnji",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 21,
     "min": 22.73,
     "avg": 27.09,
     "max": 37.41
    }
   },
   {
    "id": 3500,
    "name": "Građevinski radnik u zgradarstvu/Građevinska radnica u zgradarstvu",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 7,
     "min": 22.5,
     "avg": 25.22,
     "max": 34.74
    }
   },
   {
    "id": 3501,
    "name": "Monter drvenih konstrukcija i krovova / Monterka drvenih konstrukcija i krovova",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 4,
     "min": 22.83,
     "avg": 24.21,
     "max": 27.19
    }
   },
   {
    "id": 3502,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 30.65,
     "avg": 34.15,
     "max": 40.49
    }
   },
   {
    "id": 3503,
    "name": "Oblagač podova i zidova/Oblagačica podova i zidova",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 28.99,
     "avg": 33.33,
     "max": 44.63
    }
   },
   {
    "id": 3504,
    "name": "Rukovatelj građevinskim strojevima/Rukovateljica građevinskim strojevima",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 15,
     "min": 24.72,
     "avg": 28.39,
     "max": 46.94
    }
   },
   {
    "id": 3505,
    "name": "Serviser karoserije motornih vozila/Serviserka karoserije motornih vozila",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 14,
     "min": 26.06,
     "avg": 28.6,
     "max": 33.91
    }
   },
   {
    "id": 3506,
    "name": "Soboslikar ličilac dekorater/Soboslikarica ličiteljica dekoraterka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 20,
     "min": 23.21,
     "avg": 28.9,
     "max": 36.81
    }
   },
   {
    "id": 3507,
    "name": "Staklar/Staklarica",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 1,
     "min": 24.53,
     "avg": 25.9,
     "max": 28.8
    }
   }
  ]
 },
 {
  "id": 2241,
  "name": "Obrtnička škola za osobne usluge",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3568,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 181,
     "upisani": 177,
     "min": 31.36,
     "avg": 34.81,
     "max": 49.83
    }
   },
   {
    "id": 3569,
    "name": "Kozmetičar / Kozmetičarka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 78,
     "upisani": 77,
     "min": 63.1,
     "avg": 66.58,
     "max": 75.34
    }
   }
  ]
 },
 {
  "id": 2245,
  "name": "Opća privatna gimnazija",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3618,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 15,
     "min": 56.14,
     "avg": 66.02,
     "max": 78.44
    }
   }
  ]
 },
 {
  "id": 2250,
  "name": "Prehrambeno-tehnološka škola",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3658,
    "name": "Mesar/Mesarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 8,
     "min": 23.41,
     "avg": 28.17,
     "max": 39.36
    }
   },
   {
    "id": 3659,
    "name": "Pekar-slastičar/Pekarica-slastičarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 25,
     "upisani": 24,
     "min": 25.53,
     "avg": 29.52,
     "max": 41.25
    }
   },
   {
    "id": 3660,
    "name": "Prehrambeni tehničar / Prehrambena tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 51,
     "upisani": 47,
     "min": 52.31,
     "avg": 55.29,
     "max": 62.96
    }
   },
   {
    "id": 3661,
    "name": "Tehničar nutricionist / Tehničarka nutricionistica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 47,
     "min": 58.09,
     "avg": 62.86,
     "max": 77.34
    }
   },
   {
    "id": 3662,
    "name": "Tehničar nutricionist / Tehničarka nutricionistica (odjel za sportaše) (090305-S)",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 116.52,
     "avg": 63.45,
     "max": 144.02
    }
   }
  ]
 },
 {
  "id": 1980,
  "name": "Prirodoslovna škola Vladimira Preloga",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3677,
    "name": "Kemijski tehničar / Kemijska tehničarka",
    "sector": "Geologija, rudarstvo, nafta i kemijska tehnologija",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 36,
     "min": 73.32,
     "avg": 76.12,
     "max": 80
    }
   },
   {
    "id": 3678,
    "name": "Kozmetičar / Kozmetičarka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 52,
     "min": 69.31,
     "avg": 74.18,
     "max": 79.84
    }
   },
   {
    "id": 3679,
    "name": "Prirodoslovna gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 130,
     "upisani": 130,
     "min": 83.17,
     "avg": 79.73,
     "max": 90.5
    }
   },
   {
    "id": 3680,
    "name": "Prirodoslovna gimnazija (odjel za sportaše) (320804-S)",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 28,
     "min": 147,
     "avg": 79.1,
     "max": 160.93
    }
   },
   {
    "id": 3681,
    "name": "Prirodoslovna gimnazija uz skupinu predmeta na stranom jeziku",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 25,
     "upisani": 26,
     "min": 81.8,
     "avg": 79.23,
     "max": 88.25
    }
   }
  ]
 },
 {
  "id": 2252,
  "name": "Privatna gimnazija Dr. Časl, s pravom javnosti",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3686,
    "name": "Program međunarodne gimnazije na engleskom jeziku",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 1,
     "min": 64.98,
     "avg": 64.98,
     "max": 64.98
    }
   }
  ]
 },
 {
  "id": 2253,
  "name": "Privatna gimnazija i ekonomska škola \"Katarina Zrinski\"",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3687,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 10,
     "min": 42.08,
     "avg": 61.64,
     "max": 79.91
    }
   },
   {
    "id": 3688,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 40,
     "upisani": 38,
     "min": 41.17,
     "avg": 56.01,
     "max": 78.76
    }
   }
  ]
 },
 {
  "id": 2254,
  "name": "Privatna gimnazija i strukovna škola Svijet s pravom javnosti",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3689,
    "name": "Fizioterapeutski tehničar / fizioterapeutska tehničarka",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 40,
     "upisani": 29,
     "min": 42.55,
     "avg": 57.88,
     "max": 68.31
    }
   },
   {
    "id": 3690,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3691,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 7,
     "min": 43.42,
     "avg": 54.8,
     "max": 73.31
    }
   },
   {
    "id": 3692,
    "name": "Tehničar za razvoj i dizajn web sučelja / Tehničarka za razvoj i dizajn web sučelja",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 12,
     "min": 45.59,
     "avg": 58.38,
     "max": 69.35
    }
   }
  ]
 },
 {
  "id": 387,
  "name": "Privatna gimnazija i turističko-ugostiteljska škola Jure Kuprešak",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3693,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3694,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 0,
     "min": 29.57,
     "avg": 29.57,
     "max": 29.57
    }
   },
   {
    "id": 3695,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 0,
     "min": 24,
     "avg": 24.77,
     "max": 25.53
    }
   },
   {
    "id": 3696,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 1,
     "min": 38.52,
     "avg": 47.57,
     "max": 56.62
    }
   },
   {
    "id": 3697,
    "name": "Slastičar/Slastičarka",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3698,
    "name": "Tehničar za ugostiteljstvo / Tehničarka za ugostiteljstvo",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3699,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   }
  ]
 },
 {
  "id": 407,
  "name": "Privatna Gimnazija Marul",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 2970,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 17,
     "min": 45.99,
     "avg": 58.61,
     "max": 74.59
    }
   },
   {
    "id": 2971,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 9,
     "min": 53.71,
     "avg": 67.53,
     "max": 77.88
    }
   }
  ]
 },
 {
  "id": 2256,
  "name": "Privatna glazbena škola \"Iva Kuprešak\"",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3701,
    "name": "Glazbenik - pripremno obrazovanje",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 36,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3702,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 193,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   }
  ]
 },
 {
  "id": 2258,
  "name": "Privatna klasična gimnazija s pravom javnosti",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3705,
    "name": "Hrvatsko-europska gimnazija s usmjerenjima",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 40,
     "upisani": 16,
     "min": 53.82,
     "avg": 63.63,
     "max": 77.32
    }
   }
  ]
 },
 {
  "id": 2259,
  "name": "Privatna sportska i jezična gimnazija Franjo Bučar",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3706,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 7,
     "min": 51.29,
     "avg": 63.17,
     "max": 78.84
    }
   },
   {
    "id": 3707,
    "name": "Jezična gimnazija (odjel za sportaše) (320304-S)",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 6,
     "min": 100.94,
     "avg": 60,
     "max": 127.92
    }
   }
  ]
 },
 {
  "id": 2260,
  "name": "Privatna srednja škola AMAC međunarodna škola",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3708,
    "name": "Američki gimnazijski program",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 25,
     "upisani": 7,
     "min": 59.89,
     "avg": 72.15,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 2078,
  "name": "Privatna škola Futura",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3717,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 16,
     "min": 46.31,
     "avg": 58.08,
     "max": 70.33
    }
   },
   {
    "id": 3718,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 23,
     "min": 45.88,
     "avg": 61.54,
     "max": 77.39
    }
   }
  ]
 },
 {
  "id": 2264,
  "name": "Privatna umjetnička gimnazija, s pravom javnosti",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3719,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 1,
     "min": 1.055,
     "avg": 55.36,
     "max": 55.36
    }
   },
   {
    "id": 3720,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 1,
     "min": 1.067,
     "avg": 67.81,
     "max": 67.81
    }
   },
   {
    "id": 3721,
    "name": "Umjetnička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 46,
     "upisani": 35,
     "min": 45.53,
     "avg": 63.55,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 1817,
  "name": "Prva ekonomska škola",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3733,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 43,
     "min": 70.1,
     "avg": 72.49,
     "max": 79.77
    }
   },
   {
    "id": 3734,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 170,
     "upisani": 169,
     "min": 63.27,
     "avg": 68.02,
     "max": 78.86
    }
   }
  ]
 },
 {
  "id": 384,
  "name": "Prva privatna gimnazija s pravom javnosti",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3739,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 11,
     "min": 66.19,
     "avg": 68.67,
     "max": 72.32
    }
   },
   {
    "id": 3740,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 64.43,
     "avg": 70.27,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 2273,
  "name": "Srednja škola - Centar za odgoj i obrazovanje",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 3897,
    "name": "Kuhar (prilagođeni program)",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 3,
     "min": 1.024,
     "avg": 32.7,
     "max": 40.41
    }
   },
   {
    "id": 3898,
    "name": "Pomoćni autolakirer/Pomoćna autolakirerica",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 4,
     "upisani": 2,
     "min": 1.033,
     "avg": 38.85,
     "max": 43.94
    }
   },
   {
    "id": 3899,
    "name": "Pomoćni autolimar/Pomoćna autolimarica",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 6,
     "min": 1.038,
     "avg": 44.85,
     "max": 49.83
    }
   },
   {
    "id": 3900,
    "name": "Pomoćni cvjećar/Pomoćna cvjećarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 3,
     "min": 1.042,
     "avg": 46.18,
     "max": 48.36
    }
   },
   {
    "id": 3901,
    "name": "Pomoćni grafički radnik dorade/Pomoćna grafička radnica dorade",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 3,
     "min": 1.037,
     "avg": 41.5,
     "max": 50
    }
   },
   {
    "id": 3902,
    "name": "Pomoćni konobar/Pomoćna konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 7,
     "min": 45.04,
     "avg": 37.64,
     "max": 47.04
    }
   },
   {
    "id": 3903,
    "name": "Pomoćni kuhar/Pomoćna kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 17,
     "upisani": 11,
     "min": 41.54,
     "avg": 42.9,
     "max": 50
    }
   },
   {
    "id": 3904,
    "name": "Pomoćni vodoinstalater/Pomoćna vodoinstalaterka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 4,
     "upisani": 3,
     "min": 1.038,
     "avg": 43.45,
     "max": 45.44
    }
   },
   {
    "id": 3905,
    "name": "Pomoćni vrtlar/Pomoćna vrtlarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 5,
     "min": 1.044,
     "avg": 47.1,
     "max": 50
    }
   }
  ]
 },
 {
  "id": 2297,
  "name": "SREDNJA WALDORFSKA ŠKOLA U ZAGREBU",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4418,
    "name": "Srednja škola - alternativni program waldorfske škole",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 25,
     "upisani": 2,
     "min": 68.92,
     "avg": 74.46,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 2298,
  "name": "Srpska pravoslavna opća gimnazija Kantakuzina-Katarina Branković ustanova \"s pravom javnosti\"",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4419,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 11,
     "min": 57.51,
     "avg": 70.03,
     "max": 79.93
    }
   }
  ]
 },
 {
  "id": 2301,
  "name": "Strojarska tehnička škola Fausta Vrančića",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4435,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 25,
     "upisani": 25,
     "min": 27.04,
     "avg": 30.86,
     "max": 38.92
    }
   },
   {
    "id": 4436,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 73,
     "upisani": 73,
     "min": 46.03,
     "avg": 53.99,
     "max": 69.09
    }
   },
   {
    "id": 4437,
    "name": "Tehničar za mehatroniku / Tehničarka za mehatroniku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 51,
     "min": 54.14,
     "avg": 61.33,
     "max": 74.44
    }
   },
   {
    "id": 4438,
    "name": "Tehničar za vozila / Tehničarka za vozila",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 49.41,
     "avg": 54.17,
     "max": 61.11
    }
   }
  ]
 },
 {
  "id": 31,
  "name": "Strojarska tehnička škola Frana Bošnjakovića",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4439,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 52,
     "min": 50.27,
     "avg": 54.74,
     "max": 62.48
    }
   },
   {
    "id": 4440,
    "name": "Tehničar za mehatroniku / Tehničarka za mehatroniku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 59.69,
     "avg": 63.94,
     "max": 75.43
    }
   }
  ]
 },
 {
  "id": 2303,
  "name": "Škola drvne tehnologije i šumarstva",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4520,
    "name": "Drvodjeljski tehničar i dizajner / Drvodjeljska tehničarka i dizajnerica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 51,
     "upisani": 50,
     "min": 46.73,
     "avg": 58.56,
     "max": 72.46
    }
   },
   {
    "id": 4521,
    "name": "Stolar/Stolarica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 75,
     "upisani": 63,
     "min": 22.96,
     "avg": 28.98,
     "max": 40.12
    }
   },
   {
    "id": 4522,
    "name": "Šumarski tehničar / Šumarska tehničarka",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 40,
     "min": 40.23,
     "avg": 50.37,
     "max": 69.68
    }
   }
  ]
 },
 {
  "id": 36,
  "name": "Škola primijenjene umjetnosti i dizajna Zagreb",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4525,
    "name": "Likovna umjetnost i dizajn do izbora zanimanja (program A) (300100-A)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 153,
     "upisani": 138,
     "min": 128.07,
     "avg": 68.16,
     "max": 196.95
    }
   }
  ]
 },
 {
  "id": 409,
  "name": "Škola suvremenog plesa Ane Maletić",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4529,
    "name": "Plesač suvremenog plesa",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 4,
     "min": 139.11,
     "avg": 72.99,
     "max": 191.6
    }
   }
  ]
 },
 {
  "id": 1418,
  "name": "Škola za cestovni promet",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4530,
    "name": "Tehničar cestovnog prometa / Tehničarka cestovnog prometa",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 91,
     "upisani": 88,
     "min": 54.8,
     "avg": 59.82,
     "max": 73.74
    }
   },
   {
    "id": 4531,
    "name": "Tehničar prometne logistike / Tehničarka prometne logistike",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 25,
     "min": 54.62,
     "avg": 59.54,
     "max": 69.1
    }
   },
   {
    "id": 4532,
    "name": "Vozač motornog vozila/Vozačica motornog vozila",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 82,
     "upisani": 78,
     "min": 29.09,
     "avg": 32.33,
     "max": 46.78
    }
   }
  ]
 },
 {
  "id": 2307,
  "name": "Škola za grafiku, dizajn i medijsku produkciju",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4545,
    "name": "Dizajner grafičkih proizvoda / Dizajnerica grafičkih proizvoda",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 52,
     "min": 122.4,
     "avg": 66.79,
     "max": 195.9
    }
   },
   {
    "id": 4546,
    "name": "Grafički tehničar dorade / Grafička tehničarka dorade",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 19,
     "min": 58.67,
     "avg": 62.25,
     "max": 69.21
    }
   },
   {
    "id": 4547,
    "name": "Grafički tehničar tiska / Grafička tehničarka tiska",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 18,
     "upisani": 18,
     "min": 57.03,
     "avg": 63.07,
     "max": 72.48
    }
   },
   {
    "id": 4548,
    "name": "Medijski tehničar / Medijska tehničarka",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 72.95,
     "avg": 74.62,
     "max": 79.69
    }
   },
   {
    "id": 4549,
    "name": "Tehničar za razvoj i dizajn web sučelja / Tehničarka za razvoj i dizajn web sučelja",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 161.01,
     "avg": 66.87,
     "max": 194.45
    }
   }
  ]
 },
 {
  "id": 52,
  "name": "Škola za klasični balet",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4550,
    "name": "Plesač klasičnog baleta",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 1,
     "min": 198,
     "avg": 80,
     "max": 198
    }
   },
   {
    "id": 4551,
    "name": "Plesač narodnih plesova",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 3,
     "min": 162.04,
     "avg": 63.4,
     "max": 185.59
    }
   }
  ]
 },
 {
  "id": 2308,
  "name": "Škola za medicinske sestre Mlinarska",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4552,
    "name": "Medicinska sestra opće njege/medicinski tehničar opće njege",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 102,
     "upisani": 90,
     "min": 57.23,
     "avg": 64.48,
     "max": 80
    }
   },
   {
    "id": 4553,
    "name": "Pomoćni njegovatelj/Pomoćna njegovateljica",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 0,
     "min": 1.049,
     "avg": 49.63,
     "max": 49.63
    }
   }
  ]
 },
 {
  "id": 2309,
  "name": "Škola za medicinske sestre Vinogradska",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4554,
    "name": "Medicinska sestra opće njege/medicinski tehničar opće njege",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 104,
     "upisani": 104,
     "min": 58.59,
     "avg": 64.68,
     "max": 77.86
    }
   }
  ]
 },
 {
  "id": 2310,
  "name": "Škola za medicinske sestre Vrapče",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4555,
    "name": "Medicinska sestra opće njege/medicinski tehničar opće njege",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 67,
     "upisani": 38,
     "min": 57.13,
     "avg": 63.84,
     "max": 73.99
    }
   }
  ]
 },
 {
  "id": 2311,
  "name": "Škola za modu i dizajn",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4556,
    "name": "Dizajner cipela i modnih dodataka / Dizajnerica cipela i modnih dodataka",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 54.4,
     "avg": 57.99,
     "max": 64.18
    }
   },
   {
    "id": 4557,
    "name": "Dizajner odjeće",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 127.97,
     "avg": 61.79,
     "max": 180.62
    }
   },
   {
    "id": 4558,
    "name": "Modni galanterist/Modna galanteristica",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 12,
     "min": 26.68,
     "avg": 32.22,
     "max": 42.35
    }
   },
   {
    "id": 4559,
    "name": "Modni krojač/Modna krojačica",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 12,
     "min": 30.09,
     "avg": 31.9,
     "max": 34.65
    }
   },
   {
    "id": 4560,
    "name": "Modni laboratorijski tehničar / Modna laboratorijska tehničarka",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 18,
     "upisani": 18,
     "min": 53.91,
     "avg": 56.47,
     "max": 60.96
    }
   },
   {
    "id": 4561,
    "name": "Modni tehničar / Modna tehničarka",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 44,
     "upisani": 42,
     "min": 58.35,
     "avg": 62.85,
     "max": 76.25
    }
   },
   {
    "id": 4562,
    "name": "Računalni dizajner tekstila / Računalna dizajnerica tekstila",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 57.03,
     "avg": 61.58,
     "max": 77.53
    }
   }
  ]
 },
 {
  "id": 2312,
  "name": "Škola za montažu instalacija i metalnih konstrukcija",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4563,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 111,
     "upisani": 77,
     "min": 25.05,
     "avg": 30.5,
     "max": 45.15
    }
   },
   {
    "id": 4564,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 17,
     "min": 23.11,
     "avg": 25.81,
     "max": 29.35
    }
   },
   {
    "id": 4565,
    "name": "Rukovatelj građevinskim strojevima/Rukovateljica građevinskim strojevima",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 14,
     "min": 23.32,
     "avg": 25.98,
     "max": 32.38
    }
   },
   {
    "id": 4566,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 17,
     "min": 46.2,
     "avg": 49.98,
     "max": 59.34
    }
   }
  ]
 },
 {
  "id": 2313,
  "name": "Škola za primalje",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4572,
    "name": "Primalja-asistentica/asistent",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 56,
     "upisani": 56,
     "min": 55.34,
     "avg": 61.92,
     "max": 79.35
    }
   }
  ]
 },
 {
  "id": 2316,
  "name": "Športska gimnazija",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4589,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 96,
     "upisani": 96,
     "min": 127.7,
     "avg": 74.97,
     "max": 160.92
    }
   }
  ]
 },
 {
  "id": 2322,
  "name": "Tehnička škola Ruđera Boškovića",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4699,
    "name": "Tehničar za elektroniku i komunikacije / Tehničarka za elektroniku i komunikacije",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 46,
     "upisani": 46,
     "min": 70.94,
     "avg": 73.56,
     "max": 79.92
    }
   },
   {
    "id": 4700,
    "name": "Tehničar za mehatroniku / Tehničarka za mehatroniku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 72,
     "upisani": 73,
     "min": 75.3,
     "avg": 77.65,
     "max": 81
    }
   },
   {
    "id": 4701,
    "name": "Tehničar za očnu optiku / Tehničarka za očnu optiku",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 69.36,
     "avg": 72.37,
     "max": 77.87
    }
   },
   {
    "id": 4702,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 104,
     "upisani": 101,
     "min": 72.06,
     "avg": 75.71,
     "max": 82.92
    }
   }
  ]
 },
 {
  "id": 2323,
  "name": "Tehnička škola za računalstvo i mrežne djelatnosti",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4717,
    "name": "Tehničar za elektroniku i komunikacije / Tehničarka za elektroniku i komunikacije",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 37,
     "min": 55.03,
     "avg": 57.53,
     "max": 66.42
    }
   },
   {
    "id": 4718,
    "name": "Tehničar za poštu i poštansku logistiku  / Tehničarka za poštu i poštansku logistiku",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 12,
     "min": 55.23,
     "avg": 57.04,
     "max": 59.84
    }
   },
   {
    "id": 4719,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 45,
     "min": 60.07,
     "avg": 64.14,
     "max": 72.03
    }
   }
  ]
 },
 {
  "id": 28,
  "name": "Tehnička škola Zagreb",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4722,
    "name": "Prometnik vlakova / Prometnica vlakova",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 46.39,
     "avg": 51.37,
     "max": 67.01
    }
   },
   {
    "id": 4723,
    "name": "Strojovođa / Strojovotkinja",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 28,
     "upisani": 28,
     "min": 53.58,
     "avg": 60.31,
     "max": 79.34
    }
   },
   {
    "id": 4724,
    "name": "Tehničar prometne logistike / Tehničarka prometne logistike",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 52.44,
     "avg": 59.1,
     "max": 66.52
    }
   },
   {
    "id": 4725,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 22,
     "min": 70.29,
     "avg": 73.43,
     "max": 80.73
    }
   },
   {
    "id": 4726,
    "name": "Željeznički prometni radnik/Željeznička prometna radnica",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 24,
     "min": 24.58,
     "avg": 29.06,
     "max": 40.08
    }
   }
  ]
 },
 {
  "id": 1434,
  "name": "Treća ekonomska škola",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4745,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 3,
     "min": 70.26,
     "avg": 71.17,
     "max": 71.9
    }
   },
   {
    "id": 4746,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 101,
     "upisani": 101,
     "min": 62.37,
     "avg": 67.18,
     "max": 79.77
    }
   }
  ]
 },
 {
  "id": 2326,
  "name": "Trgovačka škola",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4750,
    "name": "Komercijalist / Komercijalistica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 77,
     "upisani": 75,
     "min": 53.87,
     "avg": 58.2,
     "max": 76.61
    }
   },
   {
    "id": 4751,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 130,
     "upisani": 125,
     "min": 26.96,
     "avg": 30.76,
     "max": 49.76
    }
   }
  ]
 },
 {
  "id": 2330,
  "name": "Ugostiteljsko-turističko učilište",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4798,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 40,
     "upisani": 36,
     "min": 26.62,
     "avg": 30.67,
     "max": 37.33
    }
   },
   {
    "id": 4799,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 162,
     "upisani": 156,
     "min": 23.23,
     "avg": 30.39,
     "max": 47.12
    }
   },
   {
    "id": 4800,
    "name": "Slastičar/Slastičarka",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 39,
     "upisani": 38,
     "min": 30.35,
     "avg": 34.92,
     "max": 44.49
    }
   },
   {
    "id": 4801,
    "name": "Tehničar za ugostiteljstvo / Tehničarka za ugostiteljstvo",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 52,
     "min": 52.55,
     "avg": 59.68,
     "max": 73.89
    }
   }
  ]
 },
 {
  "id": 1922,
  "name": "Umjetnička plesna škola Silvije Hercigonje",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4802,
    "name": "Scenski plesač",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": 1,
     "min": 148.39,
     "avg": 64.39,
     "max": 148.39
    }
   }
  ]
 },
 {
  "id": 9,
  "name": "Upravna škola Zagreb",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4823,
    "name": "Upravno-poslovni referent / Upravno-poslovna referentica",
    "sector": "Pravo, politologija, sociologija, državna uprava i javni poslovi",
    "prag": {
     "year": "2025/2026",
     "kvota": 155,
     "upisani": 144,
     "min": 62.01,
     "avg": 66.03,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 1297,
  "name": "V. gimnazija",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4826,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 182,
     "upisani": 154,
     "min": 77.24,
     "avg": 79.11,
     "max": 90.5
    }
   }
  ]
 },
 {
  "id": 2332,
  "name": "Veterinarska škola",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4827,
    "name": "Veterinarski tehničar / Veterinarska tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 102,
     "upisani": 102,
     "min": 54.63,
     "avg": 61.48,
     "max": 79.85
    }
   }
  ]
 },
 {
  "id": 1326,
  "name": "VII. gimnazija",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4828,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 168,
     "upisani": 168,
     "min": 73.18,
     "avg": 76.38,
     "max": 80.49
    }
   }
  ]
 },
 {
  "id": 1711,
  "name": "X. gimnazija Ivan Supek",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4829,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 130,
     "upisani": 130,
     "min": 76.61,
     "avg": 79.04,
     "max": 83
    }
   },
   {
    "id": 4830,
    "name": "Opća gimnazija uz skupinu predmeta na stranom jeziku",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 78.71,
     "avg": 79.54,
     "max": 80
    }
   },
   {
    "id": 4831,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 78,
     "upisani": 78,
     "min": 83.35,
     "avg": 79.36,
     "max": 90
    }
   },
   {
    "id": 4832,
    "name": "Prirodoslovno-matematička gimnazija uz skupinu predmeta na stranom jeziku",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 52,
     "min": 79.94,
     "avg": 78.37,
     "max": 89
    }
   }
  ]
 },
 {
  "id": 1313,
  "name": "XI. gimnazija",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4833,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 111,
     "upisani": 111,
     "min": 75.5,
     "avg": 77.69,
     "max": 82
    }
   }
  ]
 },
 {
  "id": 2333,
  "name": "XII. gimnazija",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4834,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 100,
     "upisani": 89,
     "min": 70.08,
     "avg": 74.14,
     "max": 80.67
    }
   },
   {
    "id": 4835,
    "name": "Opća gimnazija (odjel za sportaše) (320104-S)",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 25,
     "min": 129.46,
     "avg": 75.31,
     "max": 157.84
    }
   },
   {
    "id": 4836,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 23,
     "min": 70.21,
     "avg": 73.62,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 2334,
  "name": "XIII. gimnazija",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4837,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 130,
     "upisani": 130,
     "min": 70.23,
     "avg": 73.53,
     "max": 80
    }
   },
   {
    "id": 4838,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 72.57,
     "avg": 75.33,
     "max": 81
    }
   }
  ]
 },
 {
  "id": 2335,
  "name": "XV. gimnazija",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4839,
    "name": "IBMYP program",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 40,
     "upisani": 40,
     "min": 86.12,
     "avg": 76.75,
     "max": 89.95
    }
   },
   {
    "id": 4840,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 224,
     "upisani": 225,
     "min": 85,
     "avg": 79.78,
     "max": 92.5
    }
   }
  ]
 },
 {
  "id": 1301,
  "name": "XVI. gimnazija",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4841,
    "name": "Dvojezični program jezične gimnazije na engleskom jeziku",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 75.7,
     "avg": 78.22,
     "max": 80
    }
   },
   {
    "id": 4842,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 104,
     "upisani": 104,
     "min": 73.98,
     "avg": 76.25,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 1327,
  "name": "XVIII. gimnazija",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4843,
    "name": "Dvojezični program jezične gimnazije na francuskom jeziku",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 9,
     "min": 67.33,
     "avg": 71.47,
     "max": 78.37
    }
   },
   {
    "id": 4844,
    "name": "Dvojezični program jezične gimnazije na njemačkom jeziku",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 17,
     "upisani": 17,
     "min": 67.86,
     "avg": 71.87,
     "max": 78.73
    }
   },
   {
    "id": 4845,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 78,
     "upisani": 78,
     "min": 71.29,
     "avg": 73.11,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 2337,
  "name": "Zdravstveno učilište",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4855,
    "name": "Dentalna asistentica/asistent",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 23,
     "min": 72.91,
     "avg": 74.28,
     "max": 79.77
    }
   },
   {
    "id": 4856,
    "name": "Dentalni tehničar/Dentalna tehničarka",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 23,
     "min": 75.88,
     "avg": 77.03,
     "max": 80.87
    }
   },
   {
    "id": 4857,
    "name": "Farmaceutski tehničar",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 53,
     "min": 74,
     "avg": 77.27,
     "max": 81
    }
   },
   {
    "id": 4858,
    "name": "Fizioterapeutski tehničar / fizioterapeutska tehničarka",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 74.14,
     "avg": 77.02,
     "max": 80
    }
   },
   {
    "id": 4859,
    "name": "Sanitarni tehničar",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 24,
     "min": 61.17,
     "avg": 65.37,
     "max": 72.4
    }
   },
   {
    "id": 4860,
    "name": "Zdravstveno-laboratorijski tehničar",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 52,
     "min": 68.22,
     "avg": 71.49,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 2339,
  "name": "Ženska opća gimnazija Družbe sestara milosrdnica - s pravom javnosti",
  "city": "Zagreb",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 4867,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 78,
     "upisani": 53,
     "min": 60.23,
     "avg": 66.99,
     "max": 77.8
    }
   }
  ]
 },
 {
  "id": 1288,
  "name": "Centar za odgoj i obrazovanje Dubrava",
  "city": "Zagreb-Dubrava",
  "county": "Grad Zagreb",
  "programs": [
   {
    "id": 2726,
    "name": "Dizajner cipela i modnih dodataka / Dizajnerica cipela i modnih dodataka",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 5,
     "min": 47.65,
     "avg": 59.45,
     "max": 75.17
    }
   },
   {
    "id": 2727,
    "name": "Ekonomist (prilagođeni program)",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 3,
     "min": 1.041,
     "avg": 50.72,
     "max": 59.75
    }
   },
   {
    "id": 2728,
    "name": "Galanterist (prilagođeni program)",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 2729,
    "name": "Grafički tehničar pripreme - prilagođeni program (prilagođeni program)",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 2,
     "min": 1.052,
     "avg": 55.22,
     "max": 57.54
    }
   },
   {
    "id": 2730,
    "name": "Krojač (prilagođeni program)",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 4,
     "upisani": 1,
     "min": 1.026,
     "avg": 26.78,
     "max": 26.78
    }
   },
   {
    "id": 2731,
    "name": "Pomoćni administrator/Pomoćna administratorica",
    "sector": "Pravo, politologija, sociologija, državna uprava i javni poslovi",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 7,
     "min": 1.029,
     "avg": 43.36,
     "max": 50
    }
   },
   {
    "id": 2732,
    "name": "Pomoćni grafički radnik tiska / Pomoćna grafička radnica tiska",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 5,
     "min": 1.038,
     "avg": 45.99,
     "max": 49.92
    }
   },
   {
    "id": 2733,
    "name": "Pomoćni kožni galanterist/Pomoćna kožna galanteristica",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 4,
     "min": 1.042,
     "avg": 48.09,
     "max": 50
    }
   },
   {
    "id": 2734,
    "name": "Pomoćni krojač/Pomoćna krojačica",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 1,
     "min": 1.05,
     "avg": 50,
     "max": 50
    }
   },
   {
    "id": 2735,
    "name": "Upravni referent (prilagođeni program)",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 5,
     "min": 1.05,
     "avg": 66.12,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 1790,
  "name": "Gospodarska škola Istituto Professionale",
  "city": "Buje",
  "county": "Istarska",
  "programs": [
   {
    "id": 3241,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 9,
     "min": 32.17,
     "avg": 36.8,
     "max": 47.19
    }
   },
   {
    "id": 3242,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 9,
     "min": 31.91,
     "avg": 35.33,
     "max": 41.15
    }
   },
   {
    "id": 3243,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 22,
     "min": 59.14,
     "avg": 70.59,
     "max": 79.53
    }
   },
   {
    "id": 3244,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 3,
     "min": 23.93,
     "avg": 24.94,
     "max": 27.77
    }
   },
   {
    "id": 3245,
    "name": "Kozmetičar / Kozmetičarka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 42.5,
     "avg": 51.54,
     "max": 61.19
    }
   },
   {
    "id": 3246,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 4,
     "min": 24.35,
     "avg": 27.6,
     "max": 29.52
    }
   },
   {
    "id": 3247,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 9,
     "min": 28.53,
     "avg": 30.63,
     "max": 34.57
    }
   },
   {
    "id": 3248,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 16,
     "min": 51.33,
     "avg": 67.58,
     "max": 80
    }
   },
   {
    "id": 3249,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 5,
     "min": 25.69,
     "avg": 27.5,
     "max": 30.67
    }
   },
   {
    "id": 3250,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 43.52,
     "avg": 61.43,
     "max": 79.85
    }
   }
  ]
 },
 {
  "id": 2278,
  "name": "Srednja škola \"Vladimir Gortan\" - Scuola media superiore \"Vladimir Gortan\"",
  "city": "Buje",
  "county": "Istarska",
  "programs": [
   {
    "id": 3954,
    "name": "Komercijalist / Komercijalistica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 19,
     "min": 38.19,
     "avg": 48,
     "max": 66.82
    }
   },
   {
    "id": 3955,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 19,
     "min": 46.01,
     "avg": 58.73,
     "max": 78.87
    }
   }
  ]
 },
 {
  "id": 2317,
  "name": "Talijanska srednja škola - Scuola media superiore italiana \"Leonardo da Vinci\" Buje - Buie",
  "city": "Buje",
  "county": "Istarska",
  "programs": [
   {
    "id": 4594,
    "name": "Automehatroničar/Automehatroničarka  (nastava na talijanskom jeziku) (014234-MT)",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 25.21,
     "avg": 33.69,
     "max": 42.01
    }
   },
   {
    "id": 4595,
    "name": "Komercijalist / Komercijalistica (nastava na talijanskom jeziku) (060305-MT)",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 5,
     "min": 49.46,
     "avg": 57.85,
     "max": 68.24
    }
   },
   {
    "id": 4596,
    "name": "Konobar/Konobarica  (nastava na talijanskom jeziku) (071304-MT)",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 2,
     "min": 38.63,
     "avg": 41.29,
     "max": 43.94
    }
   },
   {
    "id": 4597,
    "name": "Opća gimnazija (nastava na talijanskom jeziku) (320104-MT)",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 4,
     "min": 68.34,
     "avg": 73.81,
     "max": 79.92
    }
   },
   {
    "id": 4598,
    "name": "Prirodoslovno-matematička gimnazija (nastava na talijanskom jeziku) (320204-MT)",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 2,
     "min": 69.64,
     "avg": 69.79,
     "max": 70.94
    }
   },
   {
    "id": 4599,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo (nastava na talijanskom jeziku) (041625-MT)",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 9,
     "min": 44.09,
     "avg": 56.98,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 332,
  "name": "Srednja škola Buzet",
  "city": "Buzet",
  "county": "Istarska",
  "programs": [
   {
    "id": 4021,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 8,
     "min": 23.19,
     "avg": 26.31,
     "max": 34.64
    }
   },
   {
    "id": 4022,
    "name": "Elektromehaničar/Elektromehaničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 11,
     "upisani": 11,
     "min": 24.25,
     "avg": 27.28,
     "max": 33.46
    }
   },
   {
    "id": 4023,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 19,
     "min": 57.17,
     "avg": 70.6,
     "max": 78.78
    }
   },
   {
    "id": 4024,
    "name": "Tehničar za električne strojeve i elektroenergetiku / Tehničarka za električne strojeve i elektroenergetiku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 22,
     "min": 50.36,
     "avg": 62.55,
     "max": 78.41
    }
   }
  ]
 },
 {
  "id": 333,
  "name": "Srednja škola Mate Blažine Labin",
  "city": "Labin",
  "county": "Istarska",
  "programs": [
   {
    "id": 4239,
    "name": "Elektromehaničar/Elektromehaničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 14,
     "min": 26.31,
     "avg": 31.24,
     "max": 38.2
    }
   },
   {
    "id": 4240,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 11,
     "upisani": 6,
     "min": 22.81,
     "avg": 27.15,
     "max": 32.53
    }
   },
   {
    "id": 4241,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 7,
     "min": 22.01,
     "avg": 26.14,
     "max": 30.18
    }
   },
   {
    "id": 4242,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 14,
     "min": 23.46,
     "avg": 29.09,
     "max": 37.67
    }
   },
   {
    "id": 4243,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 44,
     "upisani": 40,
     "min": 52.82,
     "avg": 71.28,
     "max": 80.75
    }
   },
   {
    "id": 4244,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 51.6,
     "avg": 63.36,
     "max": 76.41
    }
   },
   {
    "id": 4245,
    "name": "Tehničar za električne strojeve i elektroenergetiku / Tehničarka za električne strojeve i elektroenergetiku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 25,
     "upisani": 25,
     "min": 58.84,
     "avg": 67.27,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 2274,
  "name": "Srednja škola \"Arboretum Opeka\"",
  "city": "Marčana",
  "county": "Istarska",
  "programs": [
   {
    "id": 3906,
    "name": "Agrotehničar / Agrotehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 3,
     "min": 46.46,
     "avg": 49.09,
     "max": 51.1
    }
   },
   {
    "id": 3907,
    "name": "Cvjećar/Cvjećarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 10,
     "min": 22.66,
     "avg": 28.66,
     "max": 36.75
    }
   },
   {
    "id": 3908,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 2,
     "min": 32.57,
     "avg": 31.91,
     "max": 32.57
    }
   },
   {
    "id": 3909,
    "name": "Poljoprivredni gospodarstvenik/Poljoprivredna gospodarstvenica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 4,
     "min": 23.62,
     "avg": 29.2,
     "max": 37.11
    }
   },
   {
    "id": 3910,
    "name": "Pomoćni kuhar/Pomoćna kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": 1,
     "min": 1.032,
     "avg": 32.19,
     "max": 32.19
    }
   },
   {
    "id": 3911,
    "name": "Pomoćni vrtlar/Pomoćna vrtlarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": 2,
     "min": 1.046,
     "avg": 48.11,
     "max": 49.34
    }
   },
   {
    "id": 3912,
    "name": "Veterinarski tehničar / Veterinarska tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 18,
     "upisani": 18,
     "min": 41.28,
     "avg": 54.49,
     "max": 71.88
    }
   }
  ]
 },
 {
  "id": 2205,
  "name": "Gimnazija i strukovna škola Jurja Dobrile",
  "city": "Pazin",
  "county": "Istarska",
  "programs": [
   {
    "id": 2950,
    "name": "Elektromehaničar/Elektromehaničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 32.5,
     "avg": 34.67,
     "max": 39.5
    }
   },
   {
    "id": 2951,
    "name": "Komercijalist / Komercijalistica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 58.14,
     "avg": 59.57,
     "max": 66.6
    }
   },
   {
    "id": 2952,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 47,
     "upisani": 47,
     "min": 63.23,
     "avg": 74.56,
     "max": 80
    }
   },
   {
    "id": 2953,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 16,
     "min": 71.15,
     "avg": 77.1,
     "max": 81
    }
   },
   {
    "id": 2954,
    "name": "Tehničar za elektroniku i komunikacije / Tehničarka za elektroniku i komunikacije",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 70.37,
     "avg": 74.41,
     "max": 80
    }
   },
   {
    "id": 2955,
    "name": "Upravno-poslovni referent / Upravno-poslovna referentica",
    "sector": "Pravo, politologija, sociologija, državna uprava i javni poslovi",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 62.64,
     "avg": 69.31,
     "max": 76.28
    }
   }
  ]
 },
 {
  "id": 2246,
  "name": "Pazinski kolegij - klasična gimnazija Pazin s pravom javnosti",
  "city": "Pazin",
  "county": "Istarska",
  "programs": [
   {
    "id": 3619,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 19,
     "min": 60.98,
     "avg": 72.06,
     "max": 81
    }
   },
   {
    "id": 3620,
    "name": "Klasična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 9,
     "min": 60.38,
     "avg": 71.05,
     "max": 81
    }
   }
  ]
 },
 {
  "id": 1575,
  "name": "Srednja škola Mate Balote",
  "city": "Poreč",
  "county": "Istarska",
  "programs": [
   {
    "id": 4235,
    "name": "Agrotehničar / Agrotehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 23,
     "min": 44.26,
     "avg": 55.75,
     "max": 70.75
    }
   },
   {
    "id": 4236,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 14,
     "min": 54.47,
     "avg": 66.79,
     "max": 78.25
    }
   },
   {
    "id": 4237,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 40,
     "upisani": 31,
     "min": 58.14,
     "avg": 72.23,
     "max": 81
    }
   },
   {
    "id": 4238,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 39,
     "upisani": 39,
     "min": 45.88,
     "avg": 59.64,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 337,
  "name": "Turističko-ugostiteljska škola Antona Štifanića Poreč",
  "city": "Poreč",
  "county": "Istarska",
  "programs": [
   {
    "id": 4772,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 4,
     "min": 23.52,
     "avg": 27.57,
     "max": 30.78
    }
   },
   {
    "id": 4773,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 6,
     "min": 22.81,
     "avg": 25.62,
     "max": 31.65
    }
   },
   {
    "id": 4774,
    "name": "Slastičar/Slastičarka",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 3,
     "min": 23.58,
     "avg": 31.02,
     "max": 38.38
    }
   },
   {
    "id": 4775,
    "name": "Tehničar za ugostiteljstvo / Tehničarka za ugostiteljstvo",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 28,
     "upisani": 28,
     "min": 39.91,
     "avg": 50.69,
     "max": 67.61
    }
   },
   {
    "id": 4776,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 28,
     "upisani": 25,
     "min": 44.26,
     "avg": 59.82,
     "max": 75.09
    }
   }
  ]
 },
 {
  "id": 344,
  "name": "Ekonomska škola Pula",
  "city": "Pula",
  "county": "Istarska",
  "programs": [
   {
    "id": 2831,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 48,
     "upisani": 47,
     "min": 49.06,
     "avg": 62.16,
     "max": 76.7
    }
   },
   {
    "id": 2832,
    "name": "Upravno-poslovni referent / Upravno-poslovna referentica",
    "sector": "Pravo, politologija, sociologija, državna uprava i javni poslovi",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 50.47,
     "avg": 63.13,
     "max": 79.75
    }
   }
  ]
 },
 {
  "id": 340,
  "name": "Gimnazija Pula",
  "city": "Pula",
  "county": "Istarska",
  "programs": [
   {
    "id": 2991,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 8,
     "min": 68.5,
     "avg": 72.95,
     "max": 78.84
    }
   },
   {
    "id": 2992,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 129,
     "upisani": 110,
     "min": 65.9,
     "avg": 76.39,
     "max": 81.63
    }
   },
   {
    "id": 2993,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 70.49,
     "avg": 77.94,
     "max": 81
    }
   }
  ]
 },
 {
  "id": 2212,
  "name": "Glazbena škola Ivana Matetića-Ronjgova Pula",
  "city": "Pula",
  "county": "Istarska",
  "programs": [
   {
    "id": 3121,
    "name": "Glazbenik - pripremno obrazovanje",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3122,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 28,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3123,
    "name": "Glazbenik - teorijski smjer",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": 2,
     "min": 226.96,
     "avg": 82.44,
     "max": 233.71
    }
   },
   {
    "id": 3124,
    "name": "Glazbenik gitarist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3125,
    "name": "Glazbenik klavirist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": 3,
     "min": 152.8,
     "avg": 75.05,
     "max": 260
    }
   },
   {
    "id": 3126,
    "name": "Glazbenik kornist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 241.3,
     "avg": 78.1,
     "max": 241.3
    }
   },
   {
    "id": 3127,
    "name": "Glazbenik pjevač",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": 1,
     "min": 225.9,
     "avg": 83.1,
     "max": 225.9
    }
   },
   {
    "id": 3128,
    "name": "Glazbenik udaraljkaš",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": 3,
     "min": 203.87,
     "avg": 74.97,
     "max": 258.6
    }
   },
   {
    "id": 3129,
    "name": "Glazbenik violinist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   }
  ]
 },
 {
  "id": 341,
  "name": "Industrijsko-obrtnička škola Pula",
  "city": "Pula",
  "county": "Istarska",
  "programs": [
   {
    "id": 3364,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 11,
     "upisani": 11,
     "min": 30.81,
     "avg": 32.32,
     "max": 34.22
    }
   },
   {
    "id": 3365,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 9,
     "min": 30.45,
     "avg": 33.87,
     "max": 38.03
    }
   },
   {
    "id": 3366,
    "name": "Elektromehaničar/Elektromehaničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 27.79,
     "avg": 30.23,
     "max": 34.41
    }
   },
   {
    "id": 3367,
    "name": "Elektroničar/Elektroničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 6,
     "min": 28.67,
     "avg": 29.47,
     "max": 30.3
    }
   },
   {
    "id": 3368,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 7,
     "min": 34.74,
     "avg": 36.79,
     "max": 40.78
    }
   },
   {
    "id": 3369,
    "name": "Oblagač podova i zidova/Oblagačica podova i zidova",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 7,
     "min": 31.86,
     "avg": 36.52,
     "max": 44.13
    }
   },
   {
    "id": 3370,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 7,
     "min": 27.94,
     "avg": 29.28,
     "max": 32.43
    }
   },
   {
    "id": 3371,
    "name": "Serviser karoserije motornih vozila/Serviserka karoserije motornih vozila",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 4,
     "upisani": 4,
     "min": 30.54,
     "avg": 35.22,
     "max": 43.18
    }
   },
   {
    "id": 3372,
    "name": "Soboslikar ličilac dekorater/Soboslikarica ličiteljica dekoraterka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 7,
     "min": 28.07,
     "avg": 32.76,
     "max": 45.26
    }
   }
  ]
 },
 {
  "id": 345,
  "name": "Medicinska škola Pula",
  "city": "Pula",
  "county": "Istarska",
  "programs": [
   {
    "id": 3454,
    "name": "Farmaceutski tehničar",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 25,
     "min": 65.69,
     "avg": 72.86,
     "max": 82.93
    }
   },
   {
    "id": 3455,
    "name": "Fizioterapeutski tehničar / fizioterapeutska tehničarka",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 66.38,
     "avg": 71.59,
     "max": 80
    }
   },
   {
    "id": 3456,
    "name": "Medicinska sestra opće njege/medicinski tehničar opće njege",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 42,
     "min": 55.18,
     "avg": 63.37,
     "max": 78.85
    }
   }
  ]
 },
 {
  "id": 347,
  "name": "Strukovna škola Pula",
  "city": "Pula",
  "county": "Istarska",
  "programs": [
   {
    "id": 4480,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 35,
     "upisani": 35,
     "min": 29.48,
     "avg": 34.37,
     "max": 47.47
    }
   },
   {
    "id": 4481,
    "name": "Kozmetičar / Kozmetičarka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 59.66,
     "avg": 64.45,
     "max": 77.72
    }
   },
   {
    "id": 4482,
    "name": "Mesar/Mesarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 25.42,
     "avg": 26.69,
     "max": 27.64
    }
   },
   {
    "id": 4483,
    "name": "Stolar/Stolarica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 11,
     "min": 25.66,
     "avg": 29.15,
     "max": 36.13
    }
   },
   {
    "id": 4484,
    "name": "Tehničar nutricionist / Tehničarka nutricionistica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 48,
     "upisani": 48,
     "min": 49.57,
     "avg": 57.38,
     "max": 75.63
    }
   }
  ]
 },
 {
  "id": 2305,
  "name": "Škola primijenjenih umjetnosti i dizajna - Pula",
  "city": "Pula",
  "county": "Istarska",
  "programs": [
   {
    "id": 4528,
    "name": "Likovna umjetnost i dizajn do izbora zanimanja",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 28,
     "upisani": 28,
     "min": 141.71,
     "avg": 70.01,
     "max": 190.07
    }
   }
  ]
 },
 {
  "id": 338,
  "name": "Škola za odgoj i obrazovanje - Pula",
  "city": "Pula",
  "county": "Istarska",
  "programs": [
   {
    "id": 4567,
    "name": "Pomoćni autolimar/Pomoćna autolimarica",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 4568,
    "name": "Pomoćni cvjećar/Pomoćna cvjećarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 4569,
    "name": "Pomoćni krojač/Pomoćna krojačica",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 4570,
    "name": "Pomoćni kuhar/Pomoćna kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 4571,
    "name": "Pomoćni vrtlar/Pomoćna vrtlarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 4,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   }
  ]
 },
 {
  "id": 1877,
  "name": "Škola za turizam, ugostiteljstvo i trgovinu",
  "city": "Pula",
  "county": "Istarska",
  "programs": [
   {
    "id": 4577,
    "name": "Komercijalist / Komercijalistica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 22,
     "min": 48.32,
     "avg": 52.42,
     "max": 60.9
    }
   },
   {
    "id": 4578,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 17,
     "min": 21.94,
     "avg": 26.37,
     "max": 33.07
    }
   },
   {
    "id": 4579,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 41,
     "upisani": 29,
     "min": 23.11,
     "avg": 28.67,
     "max": 35.36
    }
   },
   {
    "id": 4580,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 23,
     "avg": 28.27,
     "max": 48.17
    }
   },
   {
    "id": 4581,
    "name": "Slastičar/Slastičarka",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 27.36,
     "avg": 30.72,
     "max": 35.86
    }
   },
   {
    "id": 4582,
    "name": "Tehničar za ugostiteljstvo / Tehničarka za ugostiteljstvo",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 28,
     "upisani": 27,
     "min": 52.12,
     "avg": 58.09,
     "max": 65.33
    }
   },
   {
    "id": 4583,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 48,
     "upisani": 48,
     "min": 57.29,
     "avg": 65.5,
     "max": 80.03
    }
   }
  ]
 },
 {
  "id": 2319,
  "name": "Talijanska srednja škola Dante Alighieri, Pula - Scuola media superiore italiana Dante Alighieri",
  "city": "Pula",
  "county": "Istarska",
  "programs": [
   {
    "id": 4606,
    "name": "Automehatroničar/Automehatroničarka  (nastava na talijanskom jeziku) (014234-MT)",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 3,
     "min": 27.3,
     "avg": 32.77,
     "max": 41.25
    }
   },
   {
    "id": 4607,
    "name": "Jezična gimnazija (nastava na talijanskom jeziku) (320304-MT)",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 3,
     "min": 48.99,
     "avg": 51.71,
     "max": 55.27
    }
   },
   {
    "id": 4608,
    "name": "Opća gimnazija (nastava na talijanskom jeziku) (320104-MT)",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 4,
     "min": 69.07,
     "avg": 74.76,
     "max": 78.46
    }
   },
   {
    "id": 4609,
    "name": "Prirodoslovna gimnazija (nastava na talijanskom jeziku) (320804-MT)",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 6,
     "min": 65.39,
     "avg": 74.52,
     "max": 80.93
    }
   },
   {
    "id": 4610,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju (nastava na talijanskom jeziku) (060500-MT)",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 9,
     "min": 49.9,
     "avg": 64.08,
     "max": 77.52
    }
   },
   {
    "id": 4611,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo (nastava na talijanskom jeziku) (041625-MT)",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 7,
     "min": 47.98,
     "avg": 55.23,
     "max": 66.59
    }
   }
  ]
 },
 {
  "id": 346,
  "name": "Tehnička škola Pula",
  "city": "Pula",
  "county": "Istarska",
  "programs": [
   {
    "id": 4682,
    "name": "Arhitektonski tehničar / Arhitektonska tehničarka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 72.65,
     "avg": 76.64,
     "max": 80
    }
   },
   {
    "id": 4683,
    "name": "Tehničar geodezije i geoinformatike / Tehničarka geodezije i geoinformatike",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 67.9,
     "avg": 70.75,
     "max": 77.73
    }
   },
   {
    "id": 4684,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 58.7,
     "avg": 63.27,
     "max": 74.15
    }
   },
   {
    "id": 4685,
    "name": "Tehničar za električne strojeve i elektroenergetiku / Tehničarka za električne strojeve i elektroenergetiku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 65.27,
     "avg": 71.03,
     "max": 80
    }
   },
   {
    "id": 4686,
    "name": "Tehničar za mehatroniku / Tehničarka za mehatroniku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 65.46,
     "avg": 67.25,
     "max": 76.54
    }
   }
  ]
 },
 {
  "id": 2293,
  "name": "Srednja škola Zvane Črnje Rovinj",
  "city": "Rovinj",
  "county": "Istarska",
  "programs": [
   {
    "id": 4405,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 16,
     "min": 47.64,
     "avg": 67.13,
     "max": 76.58
    }
   },
   {
    "id": 4406,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 14,
     "min": 56.33,
     "avg": 72.01,
     "max": 80
    }
   },
   {
    "id": 4407,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 18,
     "min": 42.45,
     "avg": 59.48,
     "max": 77.25
    }
   },
   {
    "id": 4408,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 23,
     "min": 40.22,
     "avg": 60.35,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 2302,
  "name": "Strukovna škola Eugena Kumičića Rovinj - Scuola di formazione professionale Eugen Kumičić Rovigno",
  "city": "Rovinj",
  "county": "Istarska",
  "programs": [
   {
    "id": 4462,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 27.58,
     "avg": 30.17,
     "max": 35.59
    }
   },
   {
    "id": 4463,
    "name": "Dizajner grafičkih proizvoda / Dizajnerica grafičkih proizvoda",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 16,
     "min": 48.66,
     "avg": 60.1,
     "max": 69.62
    }
   },
   {
    "id": 4464,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 25.24,
     "avg": 28.03,
     "max": 38.51
    }
   },
   {
    "id": 4465,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 7,
     "min": 24.62,
     "avg": 27.59,
     "max": 37.44
    }
   },
   {
    "id": 4466,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 24.31,
     "avg": 26.86,
     "max": 33.56
    }
   },
   {
    "id": 4467,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 26.33,
     "avg": 28.92,
     "max": 33.19
    }
   },
   {
    "id": 4468,
    "name": "Slastičar/Slastičarka",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 6,
     "min": 26.49,
     "avg": 29.53,
     "max": 32.38
    }
   },
   {
    "id": 4469,
    "name": "Tehničar za ugostiteljstvo / Tehničarka za ugostiteljstvo",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 38.85,
     "avg": 47.73,
     "max": 73.72
    }
   }
  ]
 },
 {
  "id": 2318,
  "name": "Talijanska srednja škola - Scuola media superiore italiana Rovinj - Rovigno",
  "city": "Rovinj",
  "county": "Istarska",
  "programs": [
   {
    "id": 4600,
    "name": "Dentalna asistentica/asistent (nastava na talijanskom jeziku) (241204-MT)",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 7,
     "min": 42.79,
     "avg": 49.09,
     "max": 62.19
    }
   },
   {
    "id": 4601,
    "name": "Fizioterapeutski tehničar / fizioterapeutska tehničarka (nastava na talijanskom jeziku) (240704-MT)",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 54.01,
     "avg": 63.57,
     "max": 73.94
    }
   },
   {
    "id": 4602,
    "name": "Kozmetičar / Kozmetičarka (nastava na talijanskom jeziku) (250154-MT)",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 47.26,
     "avg": 52.11,
     "max": 58.02
    }
   },
   {
    "id": 4603,
    "name": "Opća gimnazija (nastava na talijanskom jeziku) (320104-MT)",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 6,
     "min": 67.84,
     "avg": 76.23,
     "max": 78.79
    }
   },
   {
    "id": 4604,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju (nastava na talijanskom jeziku) (060500-MT)",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 2,
     "min": 48.32,
     "avg": 52.48,
     "max": 56.64
    }
   },
   {
    "id": 4605,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacija (nastava na talijanskom jeziku) (070108-MT)",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 7,
     "min": 40.85,
     "avg": 55.99,
     "max": 76.97
    }
   }
  ]
 },
 {
  "id": 143,
  "name": "CENTAR ZA ODGOJ I OBRAZOVANJE DJECE I MLADEŽI",
  "city": "Karlovac",
  "county": "Karlovačka",
  "programs": [
   {
    "id": 2723,
    "name": "Pomoćni autolimar/Pomoćna autolimarica",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 1,
     "min": 1.025,
     "avg": 25.36,
     "max": 25.36
    }
   },
   {
    "id": 2724,
    "name": "Pomoćni konobar/Pomoćna konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": 1,
     "min": 1.037,
     "avg": 37.86,
     "max": 37.86
    }
   },
   {
    "id": 2725,
    "name": "Pomoćni kuhar/Pomoćna kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 6,
     "min": 1.047,
     "avg": 49,
     "max": 50
    }
   }
  ]
 },
 {
  "id": 2193,
  "name": "Ekonomsko-turistička škola",
  "city": "Karlovac",
  "county": "Karlovačka",
  "programs": [
   {
    "id": 2860,
    "name": "Administrator (prilagođeni program)",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 4,
     "min": 1.013,
     "avg": 16.51,
     "max": 18.19
    }
   },
   {
    "id": 2861,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 14,
     "min": 65.4,
     "avg": 69.15,
     "max": 78.57
    }
   },
   {
    "id": 2862,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 54.28,
     "avg": 64.3,
     "max": 75.49
    }
   },
   {
    "id": 2863,
    "name": "Upravno-poslovni referent / Upravno-poslovna referentica",
    "sector": "Pravo, politologija, sociologija, državna uprava i javni poslovi",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 14,
     "min": 57.81,
     "avg": 64.12,
     "max": 76.89
    }
   }
  ]
 },
 {
  "id": 106,
  "name": "Gimnazija Karlovac",
  "city": "Karlovac",
  "county": "Karlovačka",
  "programs": [
   {
    "id": 2963,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 13,
     "min": 70.13,
     "avg": 73.64,
     "max": 78.92
    }
   },
   {
    "id": 2964,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 78,
     "upisani": 57,
     "min": 70.57,
     "avg": 77.64,
     "max": 80
    }
   },
   {
    "id": 2965,
    "name": "Opća gimnazija uz skupinu predmeta na stranom jeziku",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 6,
     "min": 70.43,
     "avg": 75.25,
     "max": 80
    }
   },
   {
    "id": 2966,
    "name": "Prirodoslovna gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 70.47,
     "avg": 77.83,
     "max": 81
    }
   },
   {
    "id": 2967,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 22,
     "min": 70.66,
     "avg": 78.03,
     "max": 81
    }
   }
  ]
 },
 {
  "id": 1902,
  "name": "Glazbena škola Karlovac",
  "city": "Karlovac",
  "county": "Karlovačka",
  "programs": [
   {
    "id": 3154,
    "name": "Glazbenik - pripremno obrazovanje",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3155,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3156,
    "name": "Glazbenik - teorijski smjer",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": 2,
     "min": 209.76,
     "avg": 85.69,
     "max": 235.62
    }
   },
   {
    "id": 3157,
    "name": "Glazbenik klarinetist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 247.39,
     "avg": 83.39,
     "max": 247.39
    }
   },
   {
    "id": 3158,
    "name": "Glazbenik saksofonist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 221.61,
     "avg": 87.61,
     "max": 221.61
    }
   },
   {
    "id": 3159,
    "name": "Glazbenik udaraljkaš",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 252.14,
     "avg": 85.14,
     "max": 252.14
    }
   },
   {
    "id": 3160,
    "name": "Glazbenik violončelist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 244.37,
     "avg": 80.37,
     "max": 244.37
    }
   }
  ]
 },
 {
  "id": 105,
  "name": "Medicinska škola Karlovac",
  "city": "Karlovac",
  "county": "Karlovačka",
  "programs": [
   {
    "id": 3466,
    "name": "Fizioterapeutski tehničar / fizioterapeutska tehničarka",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 58.28,
     "avg": 68.16,
     "max": 80
    }
   },
   {
    "id": 4886,
    "name": "Medicinska sestra opće njege/medicinski tehničar opće njege",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 21,
     "upisani": 21,
     "min": 52.3,
     "avg": 63.93,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 2236,
  "name": "Mješovita industrijsko-obrtnička škola",
  "city": "Karlovac",
  "county": "Karlovačka",
  "programs": [
   {
    "id": 3472,
    "name": "Arhitektonski tehničar / Arhitektonska tehničarka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 72.32,
     "avg": 73.82,
     "max": 80
    }
   },
   {
    "id": 3473,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 14,
     "min": 31.98,
     "avg": 35.51,
     "max": 41.7
    }
   },
   {
    "id": 3474,
    "name": "Građevinski radnik u održivoj gradnji/Građevinska radnica u održivoj gradnji",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 4,
     "min": 24.35,
     "avg": 28.4,
     "max": 33.27
    }
   },
   {
    "id": 3475,
    "name": "Građevinski radnik u zgradarstvu/Građevinska radnica u zgradarstvu",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 3,
     "min": 29.82,
     "avg": 27.69,
     "max": 30.85
    }
   },
   {
    "id": 3476,
    "name": "Građevinski tehničar / Građevinska tehničarka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 68.61,
     "avg": 71.99,
     "max": 79.79
    }
   },
   {
    "id": 3477,
    "name": "Kozmetičar / Kozmetičarka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 55.38,
     "avg": 59.81,
     "max": 66.09
    }
   },
   {
    "id": 3478,
    "name": "Mesar/Mesarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 2,
     "min": 24.73,
     "avg": 24.77,
     "max": 24.8
    }
   },
   {
    "id": 3479,
    "name": "Oblagač podova i zidova/Oblagačica podova i zidova",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 7,
     "min": 28.34,
     "avg": 31.98,
     "max": 38.53
    }
   },
   {
    "id": 3480,
    "name": "Pekar-slastičar/Pekarica-slastičarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 5,
     "min": 25.17,
     "avg": 28.8,
     "max": 31.33
    }
   },
   {
    "id": 3481,
    "name": "Pomoćni pekar/Pomoćna pekarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 2,
     "min": 1.024,
     "avg": 25,
     "max": 25.73
    }
   },
   {
    "id": 3482,
    "name": "Rukovatelj građevinskim strojevima/Rukovateljica građevinskim strojevima",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 8,
     "min": 24.27,
     "avg": 27.76,
     "max": 32.24
    }
   },
   {
    "id": 3483,
    "name": "Serviser karoserije motornih vozila/Serviserka karoserije motornih vozila",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 24.47,
     "avg": 30.25,
     "max": 38.03
    }
   },
   {
    "id": 3484,
    "name": "Soboslikar ličilac dekorater/Soboslikarica ličiteljica dekoraterka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 24.99,
     "avg": 26.88,
     "max": 31.51
    }
   }
  ]
 },
 {
  "id": 98,
  "name": "Prirodoslovna škola Karlovac",
  "city": "Karlovac",
  "county": "Karlovačka",
  "programs": [
   {
    "id": 3669,
    "name": "Cvjećar/Cvjećarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 18,
     "upisani": 9,
     "min": 23.94,
     "avg": 27.68,
     "max": 33
    }
   },
   {
    "id": 3670,
    "name": "Poljoprivredni gospodarstvenik/Poljoprivredna gospodarstvenica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 4,
     "min": 25.08,
     "avg": 32.1,
     "max": 43.57
    }
   },
   {
    "id": 3671,
    "name": "Tehničar nutricionist / Tehničarka nutricionistica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 49.24,
     "avg": 57.91,
     "max": 67.57
    }
   },
   {
    "id": 3672,
    "name": "Veterinarski tehničar / Veterinarska tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 15,
     "min": 47.56,
     "avg": 60.67,
     "max": 75.26
    }
   }
  ]
 },
 {
  "id": 102,
  "name": "Srednja škola Duga Resa",
  "city": "Karlovac",
  "county": "Karlovačka",
  "programs": [
   {
    "id": 4067,
    "name": "Grafički dizajner",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 54.08,
     "avg": 65.34,
     "max": 77.27
    }
   },
   {
    "id": 4068,
    "name": "Modni tehničar / Modna tehničarka",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 19,
     "min": 44.49,
     "avg": 56.05,
     "max": 76.42
    }
   },
   {
    "id": 4069,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 16,
     "min": 65.13,
     "avg": 72.52,
     "max": 79.92
    }
   },
   {
    "id": 4070,
    "name": "Opća gimnazija (odjel za sportaše) (320104-S)",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 18,
     "min": 99.94,
     "avg": 59.65,
     "max": 143.03
    }
   }
  ]
 },
 {
  "id": 101,
  "name": "Šumarska i drvodjeljska škola Karlovac",
  "city": "Karlovac",
  "county": "Karlovačka",
  "programs": [
   {
    "id": 4590,
    "name": "Drvodjeljski tehničar i dizajner / Drvodjeljska tehničarka i dizajnerica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 59.82,
     "avg": 64.1,
     "max": 69.37
    }
   },
   {
    "id": 4591,
    "name": "Hidrometeorološki tehničar / Hidrometeorološka tehničarka",
    "sector": "Temeljne prirodne znanosti",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 44.14,
     "avg": 53.29,
     "max": 70.95
    }
   },
   {
    "id": 4592,
    "name": "Stolar/Stolarica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 24.69,
     "avg": 30.14,
     "max": 40.76
    }
   },
   {
    "id": 4593,
    "name": "Šumarski tehničar / Šumarska tehničarka",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 52.58,
     "avg": 59.2,
     "max": 72.61
    }
   }
  ]
 },
 {
  "id": 100,
  "name": "Tehnička škola Karlovac",
  "city": "Karlovac",
  "county": "Karlovačka",
  "programs": [
   {
    "id": 4649,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 16,
     "min": 34.22,
     "avg": 37.14,
     "max": 40.69
    }
   },
   {
    "id": 4650,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 11,
     "upisani": 11,
     "min": 33.97,
     "avg": 36.96,
     "max": 42.58
    }
   },
   {
    "id": 4651,
    "name": "Elektromehaničar/Elektromehaničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 11,
     "upisani": 11,
     "min": 31.07,
     "avg": 34.25,
     "max": 37.96
    }
   },
   {
    "id": 4652,
    "name": "Izrađivač-monter strojarskih konstrukcija/Izrađivačica-monterka strojarskih konstrukcija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 6,
     "min": 24.53,
     "avg": 27.08,
     "max": 30.44
    }
   },
   {
    "id": 4653,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 21,
     "upisani": 21,
     "min": 32.17,
     "avg": 34.97,
     "max": 42.86
    }
   },
   {
    "id": 4654,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 44,
     "upisani": 43,
     "min": 25.72,
     "avg": 30.31,
     "max": 43.25
    }
   },
   {
    "id": 4655,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 22,
     "min": 66.22,
     "avg": 69.54,
     "max": 74.72
    }
   },
   {
    "id": 4656,
    "name": "Tehničar za električne strojeve i elektroenergetiku / Tehničarka za električne strojeve i elektroenergetiku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 11,
     "upisani": 11,
     "min": 71.16,
     "avg": 74.48,
     "max": 78.8
    }
   },
   {
    "id": 4657,
    "name": "Tehničar za elektroniku i komunikacije / Tehničarka za elektroniku i komunikacije",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 11,
     "upisani": 11,
     "min": 72.27,
     "avg": 74.67,
     "max": 80
    }
   },
   {
    "id": 4658,
    "name": "Tehničar za mehatroniku / Tehničarka za mehatroniku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 22,
     "min": 69.09,
     "avg": 73.83,
     "max": 80
    }
   },
   {
    "id": 4659,
    "name": "Vozač motornog vozila/Vozačica motornog vozila",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 22,
     "min": 25.29,
     "avg": 29.22,
     "max": 36.23
    }
   }
  ]
 },
 {
  "id": 2327,
  "name": "Trgovačko-ugostiteljska škola",
  "city": "Karlovac",
  "county": "Karlovačka",
  "programs": [
   {
    "id": 4752,
    "name": "Komercijalist / Komercijalistica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 13,
     "min": 55.09,
     "avg": 60.79,
     "max": 76.7
    }
   },
   {
    "id": 4753,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 28,
     "upisani": 19,
     "min": 24.07,
     "avg": 28.85,
     "max": 41.54
    }
   },
   {
    "id": 4754,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 40,
     "upisani": 28,
     "min": 24.35,
     "avg": 31.62,
     "max": 50
    }
   },
   {
    "id": 4755,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 11,
     "min": 22.95,
     "avg": 28.36,
     "max": 34.85
    }
   },
   {
    "id": 4756,
    "name": "Slastičar/Slastičarka",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 23.95,
     "avg": 28.72,
     "max": 38.75
    }
   },
   {
    "id": 4757,
    "name": "Tehničar posluživanja / Tehničarka posluživanja",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 5,
     "min": 51.12,
     "avg": 53.98,
     "max": 58.95
    }
   }
  ]
 },
 {
  "id": 2204,
  "name": "Gimnazija i strukovna škola Bernardina Frankopana",
  "city": "Ogulin",
  "county": "Karlovačka",
  "programs": [
   {
    "id": 2946,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 17,
     "min": 64.93,
     "avg": 77.44,
     "max": 81
    }
   },
   {
    "id": 2947,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 68.37,
     "avg": 71.56,
     "max": 77.47
    }
   },
   {
    "id": 2948,
    "name": "Tehničar za razvoj i dizajn web sučelja / Tehničarka za razvoj i dizajn web sučelja",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 7,
     "min": 65.2,
     "avg": 67.21,
     "max": 74.77
    }
   },
   {
    "id": 2949,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 15,
     "upisani": 14,
     "min": 45.67,
     "avg": 57.9,
     "max": 72.81
    }
   }
  ]
 },
 {
  "id": 144,
  "name": "Obrtnička i tehnička škola Ogulin",
  "city": "Ogulin",
  "county": "Karlovačka",
  "programs": [
   {
    "id": 3517,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 25.35,
     "avg": 28.76,
     "max": 35.36
    }
   },
   {
    "id": 3518,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 15,
     "upisani": 10,
     "min": 32.98,
     "avg": 34.85,
     "max": 37.25
    }
   },
   {
    "id": 3519,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 7,
     "min": 26.44,
     "avg": 30.31,
     "max": 33.69
    }
   },
   {
    "id": 3520,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 15,
     "upisani": 12,
     "min": 24.08,
     "avg": 32.65,
     "max": 43.47
    }
   },
   {
    "id": 3521,
    "name": "Prometnik vlakova / Prometnica vlakova",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 15,
     "upisani": 10,
     "min": 58.04,
     "avg": 62.93,
     "max": 69.19
    }
   },
   {
    "id": 3522,
    "name": "Tehničar za električne strojeve i elektroenergetiku / Tehničarka za električne strojeve i elektroenergetiku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 64.02,
     "avg": 71.1,
     "max": 76.12
    }
   },
   {
    "id": 3523,
    "name": "Tehničar za elektroniku i komunikacije / Tehničarka za elektroniku i komunikacije",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 63,
     "avg": 67.06,
     "max": 74.43
    }
   },
   {
    "id": 3524,
    "name": "Vozač motornog vozila/Vozačica motornog vozila",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 15,
     "upisani": 13,
     "min": 24.5,
     "avg": 27.27,
     "max": 32.32
    }
   }
  ]
 },
 {
  "id": 145,
  "name": "Srednja škola Slunj",
  "city": "Slunj",
  "county": "Karlovačka",
  "programs": [
   {
    "id": 4334,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 6,
     "min": 23.71,
     "avg": 26.72,
     "max": 29.35
    }
   },
   {
    "id": 4335,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 5,
     "min": 25.5,
     "avg": 30.44,
     "max": 39.21
    }
   },
   {
    "id": 4336,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 15,
     "upisani": 9,
     "min": 66.54,
     "avg": 74.17,
     "max": 80
    }
   },
   {
    "id": 4337,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 2,
     "min": 24.5,
     "avg": 24.64,
     "max": 24.78
    }
   },
   {
    "id": 4338,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 9,
     "min": 53.51,
     "avg": 61.68,
     "max": 73.77
    }
   },
   {
    "id": 4339,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 9,
     "min": 50.36,
     "avg": 61.86,
     "max": 70.93
    }
   }
  ]
 },
 {
  "id": 159,
  "name": "Gimnazija dr. Ivana Kranjčeva Đurđevac",
  "city": "Đurđevac",
  "county": "Koprivničko-križevačka",
  "programs": [
   {
    "id": 2933,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 29,
     "min": 54.75,
     "avg": 72.93,
     "max": 81
    }
   }
  ]
 },
 {
  "id": 158,
  "name": "Strukovna škola Đurđevac",
  "city": "Đurđevac",
  "county": "Koprivničko-križevačka",
  "programs": [
   {
    "id": 4448,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 27.24,
     "avg": 30.38,
     "max": 37.63
    }
   },
   {
    "id": 4449,
    "name": "Elektroničar/Elektroničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 6,
     "min": 22.71,
     "avg": 26.73,
     "max": 38
    }
   },
   {
    "id": 4450,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 14,
     "min": 30.03,
     "avg": 33.65,
     "max": 42.71
    }
   },
   {
    "id": 4451,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 4,
     "min": 24.82,
     "avg": 26.62,
     "max": 33.62
    }
   },
   {
    "id": 4452,
    "name": "Kozmetičar / Kozmetičarka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 48.22,
     "avg": 53.64,
     "max": 61.83
    }
   },
   {
    "id": 4453,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 5,
     "min": 23.66,
     "avg": 26.81,
     "max": 36.21
    }
   },
   {
    "id": 4454,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 23.25,
     "avg": 29.15,
     "max": 39.48
    }
   },
   {
    "id": 4455,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 19,
     "min": 22.96,
     "avg": 25.88,
     "max": 34.5
    }
   },
   {
    "id": 4456,
    "name": "Pomoćni kuhar/Pomoćna kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 2,
     "min": 1.04,
     "avg": 44.85,
     "max": 49.45
    }
   },
   {
    "id": 4457,
    "name": "Stolar/Stolarica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 2,
     "min": 22.25,
     "avg": 30.24,
     "max": 38.23
    }
   },
   {
    "id": 4458,
    "name": "Tehničar za mehatroniku / Tehničarka za mehatroniku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 22,
     "min": 41.56,
     "avg": 60.31,
     "max": 79.51
    }
   },
   {
    "id": 4459,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 17,
     "upisani": 17,
     "min": 42.57,
     "avg": 62.06,
     "max": 78.79
    }
   },
   {
    "id": 4460,
    "name": "Tehničar za razvoj i dizajn web sučelja / Tehničarka za razvoj i dizajn web sučelja",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 44.89,
     "avg": 55.57,
     "max": 74.55
    }
   },
   {
    "id": 4461,
    "name": "Vozač motornog vozila/Vozačica motornog vozila",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 23,
     "min": 26.87,
     "avg": 30.92,
     "max": 35.97
    }
   }
  ]
 },
 {
  "id": 2200,
  "name": "Gimnazija \" Fran Galović\" Koprivnica",
  "city": "Koprivnica",
  "county": "Koprivničko-križevačka",
  "programs": [
   {
    "id": 2910,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 11,
     "min": 52.56,
     "avg": 63.17,
     "max": 68.92
    }
   },
   {
    "id": 2911,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 104,
     "upisani": 104,
     "min": 54.79,
     "avg": 73.91,
     "max": 80.93
    }
   },
   {
    "id": 2912,
    "name": "Opća gimnazija (odjel za sportaše) (320104-S)",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 15,
     "min": 103.68,
     "avg": 61.1,
     "max": 153
    }
   },
   {
    "id": 2913,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 73.93,
     "avg": 79.17,
     "max": 83
    }
   }
  ]
 },
 {
  "id": 161,
  "name": "Obrtnička škola Koprivnica",
  "city": "Koprivnica",
  "county": "Koprivničko-križevačka",
  "programs": [
   {
    "id": 3537,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 16,
     "min": 29.9,
     "avg": 32.53,
     "max": 45.83
    }
   },
   {
    "id": 3538,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 33.42,
     "avg": 34.34,
     "max": 41.57
    }
   },
   {
    "id": 3539,
    "name": "Elektromehaničar/Elektromehaničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 7,
     "min": 33.23,
     "avg": 34.72,
     "max": 35.87
    }
   },
   {
    "id": 3540,
    "name": "Elektroničar/Elektroničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 27.65,
     "avg": 31.69,
     "max": 38.4
    }
   },
   {
    "id": 3541,
    "name": "Građevinski radnik u održivoj gradnji/Građevinska radnica u održivoj gradnji",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 25.88,
     "avg": 27.73,
     "max": 32.53
    }
   },
   {
    "id": 3542,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 6,
     "min": 25.23,
     "avg": 27.5,
     "max": 32.27
    }
   },
   {
    "id": 3543,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 13,
     "min": 23.66,
     "avg": 28.16,
     "max": 39.59
    }
   },
   {
    "id": 3544,
    "name": "Mesar/Mesarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 5,
     "min": 23.14,
     "avg": 26.15,
     "max": 35.28
    }
   },
   {
    "id": 3545,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 15,
     "upisani": 15,
     "min": 32.95,
     "avg": 36.39,
     "max": 43.91
    }
   },
   {
    "id": 3546,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 7,
     "min": 26.51,
     "avg": 33.44,
     "max": 41.24
    }
   },
   {
    "id": 3547,
    "name": "Pekar-slastičar/Pekarica-slastičarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 4,
     "min": 22.85,
     "avg": 25.87,
     "max": 30.01
    }
   },
   {
    "id": 3548,
    "name": "Pomoćni cvjećar/Pomoćna cvjećarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 4,
     "upisani": 1,
     "min": 1.038,
     "avg": 38.33,
     "max": 38.33
    }
   },
   {
    "id": 3549,
    "name": "Pomoćni kuhar/Pomoćna kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": 1,
     "min": 1.028,
     "avg": 26.03,
     "max": 28.03
    }
   },
   {
    "id": 3550,
    "name": "Pomoćni radnik za uređenje interijera/Pomoćna radnica za uređenje interijera",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": 1,
     "min": 1.03,
     "avg": 30.97,
     "max": 30.97
    }
   },
   {
    "id": 3551,
    "name": "Serviser karoserije motornih vozila/Serviserka karoserije motornih vozila",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 6,
     "min": 23.94,
     "avg": 25.37,
     "max": 25.98
    }
   },
   {
    "id": 3552,
    "name": "Slastičar/Slastičarka",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 24.67,
     "avg": 28.81,
     "max": 32.15
    }
   },
   {
    "id": 3553,
    "name": "Soboslikar ličilac dekorater/Soboslikarica ličiteljica dekoraterka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 24.76,
     "avg": 27.58,
     "max": 34.51
    }
   },
   {
    "id": 3554,
    "name": "Stolar/Stolarica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 6,
     "min": 24.5,
     "avg": 31.01,
     "max": 38.03
    }
   },
   {
    "id": 3555,
    "name": "Tehničar za električne strojeve i elektroenergetiku / Tehničarka za električne strojeve i elektroenergetiku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 59.56,
     "avg": 70.17,
     "max": 80.42
    }
   },
   {
    "id": 3556,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 52.97,
     "avg": 66.98,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 162,
  "name": "Srednja škola Koprivnica",
  "city": "Koprivnica",
  "county": "Koprivničko-križevačka",
  "programs": [
   {
    "id": 4193,
    "name": "Farmaceutski tehničar",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 68.57,
     "avg": 73.28,
     "max": 79.85
    }
   },
   {
    "id": 4194,
    "name": "Fizioterapeutski tehničar / fizioterapeutska tehničarka",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 59.38,
     "avg": 65.59,
     "max": 74.45
    }
   },
   {
    "id": 4195,
    "name": "Kemijski tehničar / Kemijska tehničarka",
    "sector": "Geologija, rudarstvo, nafta i kemijska tehnologija",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 10,
     "min": 39.64,
     "avg": 56.93,
     "max": 79.54
    }
   },
   {
    "id": 4196,
    "name": "Medicinska sestra opće njege/medicinski tehničar opće njege",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 48,
     "upisani": 46,
     "min": 40.77,
     "avg": 55.74,
     "max": 75.71
    }
   },
   {
    "id": 4197,
    "name": "Prehrambeni tehničar / Prehrambena tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 23,
     "min": 48.9,
     "avg": 54.21,
     "max": 59.14
    }
   },
   {
    "id": 4198,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 20,
     "min": 23.09,
     "avg": 27.79,
     "max": 33.61
    }
   },
   {
    "id": 4199,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 21,
     "upisani": 21,
     "min": 57.28,
     "avg": 65.79,
     "max": 77.29
    }
   },
   {
    "id": 4200,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 22,
     "min": 58.23,
     "avg": 65.66,
     "max": 76.6
    }
   },
   {
    "id": 4201,
    "name": "Upravno-poslovni referent / Upravno-poslovna referentica",
    "sector": "Pravo, politologija, sociologija, državna uprava i javni poslovi",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 60.12,
     "avg": 67.77,
     "max": 77.06
    }
   }
  ]
 },
 {
  "id": 2331,
  "name": "Umjetnička škola Fortunat Pintarić",
  "city": "Koprivnica",
  "county": "Koprivničko-križevačka",
  "programs": [
   {
    "id": 4803,
    "name": "Glazbenik - pripremno obrazovanje",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 15,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 4804,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   }
  ]
 },
 {
  "id": 163,
  "name": "Gimnazija Ivana Zakmardija Dijankovečkoga Križevci",
  "city": "Križevci",
  "county": "Koprivničko-križevačka",
  "programs": [
   {
    "id": 2956,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 49,
     "min": 41.98,
     "avg": 69.37,
     "max": 80
    }
   },
   {
    "id": 2957,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 18,
     "min": 73.08,
     "avg": 78.31,
     "max": 81
    }
   }
  ]
 },
 {
  "id": 1913,
  "name": "Glazbena škola Alberta Štrige",
  "city": "Križevci",
  "county": "Koprivničko-križevačka",
  "programs": [
   {
    "id": 3012,
    "name": "Glazbenik - pripremno obrazovanje",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3013,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 15,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3014,
    "name": "Glazbenik pjevač",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   }
  ]
 },
 {
  "id": 165,
  "name": "Srednja gospodarska škola Križevci",
  "city": "Križevci",
  "county": "Koprivničko-križevačka",
  "programs": [
   {
    "id": 3767,
    "name": "Agrotehničar / Agrotehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 12,
     "min": 40.39,
     "avg": 53.41,
     "max": 68.98
    }
   },
   {
    "id": 3768,
    "name": "Agroturistički tehničar / Agroturistička tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 5,
     "min": 39.64,
     "avg": 50.62,
     "max": 57.3
    }
   },
   {
    "id": 3769,
    "name": "Cvjećar/Cvjećarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 2,
     "min": 28.59,
     "avg": 29.02,
     "max": 29.45
    }
   },
   {
    "id": 3770,
    "name": "Mehaničar poljoprivredne mehanizacije/Mehaničarka poljoprivredne mehanizacije",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 22,
     "min": 22.67,
     "avg": 27.31,
     "max": 41.53
    }
   },
   {
    "id": 3771,
    "name": "Poljoprivredni gospodarstvenik/Poljoprivredna gospodarstvenica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 5,
     "min": 22.24,
     "avg": 26.5,
     "max": 32.07
    }
   },
   {
    "id": 3772,
    "name": "Veterinarski tehničar / Veterinarska tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 42.77,
     "avg": 57.87,
     "max": 77.04
    }
   }
  ]
 },
 {
  "id": 164,
  "name": "Srednja škola \"Ivan Seljanec\" Križevci",
  "city": "Križevci",
  "county": "Koprivničko-križevačka",
  "programs": [
   {
    "id": 3930,
    "name": "Građevinski radnik u zgradarstvu/Građevinska radnica u zgradarstvu",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 22.94,
     "avg": 23.92,
     "max": 25.71
    }
   },
   {
    "id": 3931,
    "name": "Građevinski tehničar / Građevinska tehničarka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 23,
     "min": 56.61,
     "avg": 65.1,
     "max": 77.38
    }
   },
   {
    "id": 3932,
    "name": "Komercijalist / Komercijalistica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 11,
     "upisani": 11,
     "min": 62.25,
     "avg": 68.3,
     "max": 80
    }
   },
   {
    "id": 3933,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 6,
     "min": 25.57,
     "avg": 27.55,
     "max": 29.58
    }
   },
   {
    "id": 3934,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 24.09,
     "avg": 27.84,
     "max": 38.4
    }
   },
   {
    "id": 3935,
    "name": "Monter drvenih konstrukcija i krovova / Monterka drvenih konstrukcija i krovova",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 4,
     "min": 22.79,
     "avg": 25.12,
     "max": 30.8
    }
   },
   {
    "id": 3936,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 9,
     "min": 23.57,
     "avg": 26.84,
     "max": 32.55
    }
   },
   {
    "id": 3937,
    "name": "Pomoćni kuhar/Pomoćna kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 4,
     "min": 1.024,
     "avg": 37.77,
     "max": 50
    }
   },
   {
    "id": 3938,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 6,
     "min": 29.1,
     "avg": 32.37,
     "max": 34.17
    }
   },
   {
    "id": 3939,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 22,
     "min": 49.59,
     "avg": 61.47,
     "max": 76.54
    }
   },
   {
    "id": 3940,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 11,
     "upisani": 11,
     "min": 60.09,
     "avg": 68.71,
     "max": 80.37
    }
   }
  ]
 },
 {
  "id": 124,
  "name": "Srednja škola Bedekovčina",
  "city": "Bedekovčina",
  "county": "Krapinsko-zagorska",
  "programs": [
   {
    "id": 3988,
    "name": "Agrotehničar / Agrotehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 11,
     "min": 37.14,
     "avg": 53.16,
     "max": 64.29
    }
   },
   {
    "id": 3989,
    "name": "Arhitektonski tehničar / Arhitektonska tehničarka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 63.52,
     "avg": 72.64,
     "max": 81.79
    }
   },
   {
    "id": 3990,
    "name": "Cvjećar/Cvjećarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 5,
     "min": 24.19,
     "avg": 32.29,
     "max": 50
    }
   },
   {
    "id": 3991,
    "name": "Fizioterapeutski tehničar / fizioterapeutska tehničarka",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 57.14,
     "avg": 63.19,
     "max": 79.93
    }
   },
   {
    "id": 3992,
    "name": "Građevinski radnik u održivoj gradnji/Građevinska radnica u održivoj gradnji",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 23.82,
     "avg": 27.5,
     "max": 34.18
    }
   },
   {
    "id": 3993,
    "name": "Građevinski radnik u zgradarstvu/Građevinska radnica u zgradarstvu",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 3,
     "min": 24,
     "avg": 25,
     "max": 25.86
    }
   },
   {
    "id": 3994,
    "name": "Građevinski tehničar / Građevinska tehničarka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 53.4,
     "avg": 66.11,
     "max": 78
    }
   },
   {
    "id": 3995,
    "name": "Medicinska sestra opće njege/medicinski tehničar opće njege",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 28,
     "upisani": 28,
     "min": 49.51,
     "avg": 60.6,
     "max": 80
    }
   },
   {
    "id": 3996,
    "name": "Mehaničar poljoprivredne mehanizacije/Mehaničarka poljoprivredne mehanizacije",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 6,
     "min": 23.57,
     "avg": 25.9,
     "max": 32.42
    }
   },
   {
    "id": 3997,
    "name": "Monter drvenih konstrukcija i krovova / Monterka drvenih konstrukcija i krovova",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 3,
     "min": 25.23,
     "avg": 26.03,
     "max": 26.93
    }
   },
   {
    "id": 3998,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 22.87,
     "avg": 28.18,
     "max": 35.89
    }
   },
   {
    "id": 3999,
    "name": "Oblagač podova i zidova/Oblagačica podova i zidova",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 29.49,
     "avg": 33.16,
     "max": 40.48
    }
   },
   {
    "id": 4000,
    "name": "Poljoprivredni gospodarstvenik/Poljoprivredna gospodarstvenica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 4,
     "min": 26.96,
     "avg": 32.18,
     "max": 42.96
    }
   },
   {
    "id": 4001,
    "name": "Pomoćni proizvođač keramike/Pomoćna proizvođačica keramike",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 4,
     "min": 1.033,
     "avg": 42.85,
     "max": 50
    }
   },
   {
    "id": 4002,
    "name": "Rukovatelj građevinskim strojevima/Rukovateljica građevinskim strojevima",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 28.75,
     "avg": 31.88,
     "max": 36.82
    }
   },
   {
    "id": 4003,
    "name": "Soboslikar ličilac dekorater/Soboslikarica ličiteljica dekoraterka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 25.96,
     "avg": 30.35,
     "max": 44.4
    }
   },
   {
    "id": 4004,
    "name": "Staklar/Staklarica",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 2,
     "min": 21.9,
     "avg": 22.64,
     "max": 23.37
    }
   }
  ]
 },
 {
  "id": 125,
  "name": "Centar za odgoj i obrazovanje Zajezda",
  "city": "Budinščina",
  "county": "Krapinsko-zagorska",
  "programs": [
   {
    "id": 2755,
    "name": "Pomoćni krojač/Pomoćna krojačica",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 1,
     "min": 1.036,
     "avg": 36.34,
     "max": 36.34
    }
   },
   {
    "id": 2756,
    "name": "Pomoćni kuhar/Pomoćna kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 4,
     "min": 1.032,
     "avg": 36.88,
     "max": 44.69
    }
   },
   {
    "id": 2757,
    "name": "Pomoćni vrtlar/Pomoćna vrtlarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 1,
     "min": 1.027,
     "avg": 27.97,
     "max": 27.97
    }
   }
  ]
 },
 {
  "id": 126,
  "name": "Srednja škola Konjščina",
  "city": "Konjščina",
  "county": "Krapinsko-zagorska",
  "programs": [
   {
    "id": 4186,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 21,
     "upisani": 21,
     "min": 25.98,
     "avg": 30.28,
     "max": 36.7
    }
   },
   {
    "id": 4187,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 24.51,
     "avg": 26.56,
     "max": 29.36
    }
   },
   {
    "id": 4188,
    "name": "Komercijalist / Komercijalistica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 20,
     "min": 45.24,
     "avg": 51.77,
     "max": 66.15
    }
   },
   {
    "id": 4189,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 5,
     "min": 23.68,
     "avg": 25.3,
     "max": 30.99
    }
   },
   {
    "id": 4190,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 25.97,
     "avg": 31.32,
     "max": 37.15
    }
   },
   {
    "id": 4191,
    "name": "Tehničar za električne strojeve i elektroenergetiku / Tehničarka za električne strojeve i elektroenergetiku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 23,
     "min": 43.52,
     "avg": 61.14,
     "max": 76.28
    }
   },
   {
    "id": 4192,
    "name": "Vozač motornog vozila/Vozačica motornog vozila",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 21,
     "upisani": 21,
     "min": 25.55,
     "avg": 29.02,
     "max": 37.65
    }
   }
  ]
 },
 {
  "id": 119,
  "name": "Srednja škola Krapina",
  "city": "Krapina",
  "county": "Krapinsko-zagorska",
  "programs": [
   {
    "id": 4202,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 28.82,
     "avg": 32.99,
     "max": 38.82
    }
   },
   {
    "id": 4203,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 14,
     "min": 26.89,
     "avg": 35.05,
     "max": 41.62
    }
   },
   {
    "id": 4204,
    "name": "Elektromehaničar/Elektromehaničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 28.28,
     "avg": 32.38,
     "max": 37.57
    }
   },
   {
    "id": 4205,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 30.86,
     "avg": 32.34,
     "max": 37.72
    }
   },
   {
    "id": 4206,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 68.14,
     "avg": 72.78,
     "max": 78.51
    }
   },
   {
    "id": 4207,
    "name": "Komercijalist / Komercijalistica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 48.57,
     "avg": 57.65,
     "max": 68.21
    }
   },
   {
    "id": 4208,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 75.19,
     "avg": 78.19,
     "max": 81
    }
   },
   {
    "id": 4209,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 40,
     "upisani": 40,
     "min": 25.88,
     "avg": 30.62,
     "max": 45.45
    }
   },
   {
    "id": 4210,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 17,
     "min": 64.02,
     "avg": 74.97,
     "max": 80.92
    }
   },
   {
    "id": 4211,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 24.77,
     "avg": 29.56,
     "max": 35.59
    }
   },
   {
    "id": 4212,
    "name": "Tehničar za mehatroniku / Tehničarka za mehatroniku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 30,
     "upisani": 30,
     "min": 69.57,
     "avg": 74.27,
     "max": 80.85
    }
   },
   {
    "id": 4213,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 30,
     "upisani": 30,
     "min": 63.49,
     "avg": 69.54,
     "max": 79.92
    }
   },
   {
    "id": 4214,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 50.31,
     "avg": 57.02,
     "max": 70.64
    }
   }
  ]
 },
 {
  "id": 127,
  "name": "Srednja škola Oroslavje",
  "city": "Oroslavje",
  "county": "Krapinsko-zagorska",
  "programs": [
   {
    "id": 4278,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 31.37,
     "avg": 34.23,
     "max": 37.08
    }
   },
   {
    "id": 4279,
    "name": "Kozmetičar / Kozmetičarka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 55.04,
     "avg": 61.15,
     "max": 77.06
    }
   },
   {
    "id": 4280,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 23.23,
     "avg": 27.19,
     "max": 38.69
    }
   },
   {
    "id": 4281,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 32,
     "upisani": 32,
     "min": 24.03,
     "avg": 30.17,
     "max": 40.18
    }
   },
   {
    "id": 4282,
    "name": "Stolar/Stolarica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 23.24,
     "avg": 28.23,
     "max": 39.23
    }
   },
   {
    "id": 4283,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 55.39,
     "avg": 64.12,
     "max": 79.46
    }
   }
  ]
 },
 {
  "id": 2217,
  "name": "Glazbena škola Pregrada",
  "city": "Pregrada",
  "county": "Krapinsko-zagorska",
  "programs": [
   {
    "id": 3188,
    "name": "Glazbenik - pripremno obrazovanje",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 15,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3189,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 15,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   }
  ]
 },
 {
  "id": 123,
  "name": "Srednja škola Pregrada",
  "city": "Pregrada",
  "county": "Krapinsko-zagorska",
  "programs": [
   {
    "id": 4319,
    "name": "Dentalni tehničar/Dentalna tehničarka",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 63.27,
     "avg": 70.16,
     "max": 76.59
    }
   },
   {
    "id": 4320,
    "name": "Farmaceutski tehničar",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 67.73,
     "avg": 74.01,
     "max": 80
    }
   },
   {
    "id": 4321,
    "name": "Fizioterapeutski tehničar / fizioterapeutska tehničarka",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 56.05,
     "avg": 61.5,
     "max": 72.47
    }
   },
   {
    "id": 4322,
    "name": "Medicinska sestra opće njege/medicinski tehničar opće njege",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 40,
     "upisani": 40,
     "min": 42.78,
     "avg": 56.02,
     "max": 79.83
    }
   },
   {
    "id": 4323,
    "name": "Prirodoslovna gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 18,
     "min": 61.36,
     "avg": 73.36,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 1447,
  "name": "Gimnazija Antuna Gustava Matoša",
  "city": "Zabok",
  "county": "Krapinsko-zagorska",
  "programs": [
   {
    "id": 2918,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 64.98,
     "avg": 72.26,
     "max": 78.77
    }
   },
   {
    "id": 2917,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 52,
     "min": 68.94,
     "avg": 76.23,
     "max": 80
    }
   },
   {
    "id": 2919,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 78.64,
     "avg": 79.8,
     "max": 81
    }
   }
  ]
 },
 {
  "id": 120,
  "name": "Srednja škola Zabok",
  "city": "Zabok",
  "county": "Krapinsko-zagorska",
  "programs": [
   {
    "id": 4392,
    "name": "Komercijalist / Komercijalistica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 22,
     "min": 50.74,
     "avg": 55.42,
     "max": 64.25
    }
   },
   {
    "id": 4393,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 10,
     "min": 24.75,
     "avg": 28.08,
     "max": 34.65
    }
   },
   {
    "id": 4394,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 19,
     "min": 25.32,
     "avg": 31.05,
     "max": 36.73
    }
   },
   {
    "id": 4395,
    "name": "Pomoćni ugostitelj / Pomoćna ugostiteljica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 2,
     "min": 1.045,
     "avg": 46.01,
     "max": 46.45
    }
   },
   {
    "id": 4396,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 19,
     "min": 23.95,
     "avg": 27.8,
     "max": 35.06
    }
   },
   {
    "id": 4397,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 44,
     "upisani": 44,
     "min": 59.13,
     "avg": 68.18,
     "max": 81
    }
   },
   {
    "id": 4398,
    "name": "Slastičar/Slastičarka",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 27.71,
     "avg": 31.44,
     "max": 36.38
    }
   },
   {
    "id": 4399,
    "name": "Tehničar za ugostiteljstvo / Tehničarka za ugostiteljstvo",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 38,
     "upisani": 35,
     "min": 43.09,
     "avg": 52.85,
     "max": 73.2
    }
   },
   {
    "id": 4400,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 22,
     "min": 55.54,
     "avg": 62.64,
     "max": 72.19
    }
   }
  ]
 },
 {
  "id": 2315,
  "name": "Škola za umjetnost, dizajn",
  "city": "Zabok",
  "county": "Krapinsko-zagorska",
  "programs": [
   {
    "id": 4584,
    "name": "Dizajner grafičkih proizvoda / Dizajnerica grafičkih proizvoda",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 25,
     "min": 51.32,
     "avg": 60.16,
     "max": 78.8
    }
   },
   {
    "id": 4585,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 4586,
    "name": "Likovna umjetnost i dizajn do izbora zanimanja",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 134.46,
     "avg": 67.54,
     "max": 184.43
    }
   },
   {
    "id": 4587,
    "name": "Medijski tehničar / Medijska tehničarka",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 52.67,
     "avg": 65.23,
     "max": 78.63
    }
   },
   {
    "id": 4588,
    "name": "Tehničar za razvoj i dizajn web sučelja / Tehničarka za razvoj i dizajn web sučelja",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 50.67,
     "avg": 61.43,
     "max": 79.92
    }
   }
  ]
 },
 {
  "id": 128,
  "name": "Srednja škola Zlatar",
  "city": "Zlatar",
  "county": "Krapinsko-zagorska",
  "programs": [
   {
    "id": 4401,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 16,
     "min": 64.84,
     "avg": 75.14,
     "max": 81
    }
   },
   {
    "id": 4402,
    "name": "Tehničar prometne logistike / Tehničarka prometne logistike",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 19,
     "min": 40.07,
     "avg": 50.41,
     "max": 67.75
    }
   },
   {
    "id": 4403,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 23,
     "min": 53.49,
     "avg": 66.98,
     "max": 80
    }
   },
   {
    "id": 4404,
    "name": "Upravno-poslovni referent / Upravno-poslovna referentica",
    "sector": "Pravo, politologija, sociologija, državna uprava i javni poslovi",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 22,
     "min": 60.07,
     "avg": 65.59,
     "max": 74.01
    }
   }
  ]
 },
 {
  "id": 212,
  "name": "Gimnazija Gospić",
  "city": "Gospić",
  "county": "Ličko-senjska",
  "programs": [
   {
    "id": 2943,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 30,
     "min": 51.9,
     "avg": 70.81,
     "max": 80.7
    }
   }
  ]
 },
 {
  "id": 211,
  "name": "Strukovna škola Gospić",
  "city": "Gospić",
  "county": "Ličko-senjska",
  "programs": [
   {
    "id": 4470,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 11,
     "min": 23.71,
     "avg": 30.19,
     "max": 38.28
    }
   },
   {
    "id": 4471,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 6,
     "min": 22.56,
     "avg": 25.05,
     "max": 31.42
    }
   },
   {
    "id": 4472,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 7,
     "min": 24.68,
     "avg": 26.71,
     "max": 28.71
    }
   },
   {
    "id": 4473,
    "name": "Medicinska sestra opće njege/medicinski tehničar opće njege",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 19,
     "min": 50.29,
     "avg": 61.56,
     "max": 78.64
    }
   },
   {
    "id": 4474,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 23.88,
     "avg": 31.6,
     "max": 42.64
    }
   },
   {
    "id": 4475,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 47.8,
     "avg": 61.33,
     "max": 77.72
    }
   },
   {
    "id": 4476,
    "name": "Tehničar za električne strojeve i elektroenergetiku / Tehničarka za električne strojeve i elektroenergetiku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 59.65,
     "avg": 65.38,
     "max": 77.84
    }
   },
   {
    "id": 4477,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 9,
     "min": 50.05,
     "avg": 60.33,
     "max": 75.3
    }
   },
   {
    "id": 4478,
    "name": "Tehničar za ugostiteljstvo / Tehničarka za ugostiteljstvo",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 5,
     "min": 51.88,
     "avg": 54.99,
     "max": 59.98
    }
   },
   {
    "id": 4479,
    "name": "Vozač motornog vozila/Vozačica motornog vozila",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 23.87,
     "avg": 29.8,
     "max": 44.92
    }
   }
  ]
 },
 {
  "id": 245,
  "name": "Srednja škola Gračac",
  "city": "Gračac",
  "county": "Ličko-senjska",
  "programs": [
   {
    "id": 4089,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 2,
     "min": 36.6,
     "avg": 47.77,
     "max": 58.94
    }
   },
   {
    "id": 4090,
    "name": "Šumarski tehničar / Šumarska tehničarka",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 3,
     "min": 36.88,
     "avg": 46.3,
     "max": 61.6
    }
   }
  ]
 },
 {
  "id": 2290,
  "name": "Srednja škola Plitvička jezera",
  "city": "Korenica",
  "county": "Ličko-senjska",
  "programs": [
   {
    "id": 4315,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 4,
     "min": 23.32,
     "avg": 28.09,
     "max": 34.94
    }
   },
   {
    "id": 4316,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 6,
     "min": 23.26,
     "avg": 26.07,
     "max": 29.59
    }
   },
   {
    "id": 4317,
    "name": "Slastičar/Slastičarka",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 3,
     "min": 23.44,
     "avg": 25.28,
     "max": 26.36
    }
   },
   {
    "id": 4318,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 13,
     "min": 53.79,
     "avg": 62.67,
     "max": 73.77
    }
   }
  ]
 },
 {
  "id": 213,
  "name": "Srednja škola Otočac",
  "city": "Otočac",
  "county": "Ličko-senjska",
  "programs": [
   {
    "id": 4284,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 4,
     "min": 28.34,
     "avg": 29.96,
     "max": 31.06
    }
   },
   {
    "id": 4285,
    "name": "Elektromehaničar/Elektromehaničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 1,
     "min": 1.027,
     "avg": 27.57,
     "max": 27.57
    }
   },
   {
    "id": 4286,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 29.48,
     "avg": 34.12,
     "max": 43.27
    }
   },
   {
    "id": 4287,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 8,
     "min": 55.19,
     "avg": 74.14,
     "max": 80
    }
   },
   {
    "id": 4288,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 5,
     "min": 23.85,
     "avg": 25.51,
     "max": 27.35
    }
   },
   {
    "id": 4289,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 18,
     "min": 37.46,
     "avg": 54.49,
     "max": 74.98
    }
   },
   {
    "id": 4290,
    "name": "Šumarski tehničar / Šumarska tehničarka",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 19,
     "min": 37.62,
     "avg": 52.99,
     "max": 67.7
    }
   }
  ]
 },
 {
  "id": 1927,
  "name": "Srednja škola Bartula Kašića",
  "city": "Pag",
  "county": "Ličko-senjska",
  "programs": [
   {
    "id": 3985,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 2,
     "min": 28.31,
     "avg": 28.49,
     "max": 28.67
    }
   },
   {
    "id": 3986,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 4,
     "min": 30.76,
     "avg": 26.64,
     "max": 30.76
    }
   },
   {
    "id": 3987,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 14,
     "min": 60.87,
     "avg": 74.72,
     "max": 81
    }
   }
  ]
 },
 {
  "id": 214,
  "name": "Srednja škola Pavla Rittera Vitezovića u Senju",
  "city": "Senj",
  "county": "Ličko-senjska",
  "programs": [
   {
    "id": 4297,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 12,
     "min": 63.98,
     "avg": 72.07,
     "max": 80
    }
   },
   {
    "id": 4298,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 18,
     "upisani": 4,
     "min": 49.02,
     "avg": 56.08,
     "max": 59.13
    }
   },
   {
    "id": 4299,
    "name": "Tehničar za ugostiteljstvo / Tehničarka za ugostiteljstvo",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 8,
     "min": 36.79,
     "avg": 44.95,
     "max": 56.58
    }
   }
  ]
 },
 {
  "id": 2187,
  "name": "Ekonomska i trgovačka škola Čakovec",
  "city": "Čakovec",
  "county": "Međimurska",
  "programs": [
   {
    "id": 4868,
    "name": "Komercijalist / Komercijalistica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 48.68,
     "avg": 55.55,
     "max": 66.55
    }
   },
   {
    "id": 2804,
    "name": "Komercijalist / Komercijalistica (odjel za sportaše) (060305-S)",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 109.93,
     "avg": 61.99,
     "max": 145.56
    }
   },
   {
    "id": 4869,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 19,
     "min": 28.36,
     "avg": 31.01,
     "max": 39.95
    }
   },
   {
    "id": 4870,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 46,
     "upisani": 46,
     "min": 48.17,
     "avg": 67.74,
     "max": 80
    }
   },
   {
    "id": 2807,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 48,
     "upisani": 47,
     "min": 45.84,
     "avg": 59.66,
     "max": 75.87
    }
   },
   {
    "id": 4902,
    "name": "Upravno-poslovni referent / Upravno-poslovna referentica",
    "sector": "Pravo, politologija, sociologija, državna uprava i javni poslovi",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 55.54,
     "avg": 66.89,
     "max": 80.85
    }
   }
  ]
 },
 {
  "id": 367,
  "name": "Gimnazija Josipa Slavenskog Čakovec",
  "city": "Čakovec",
  "county": "Međimurska",
  "programs": [
   {
    "id": 2958,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 120,
     "upisani": 113,
     "min": 66.4,
     "avg": 75.94,
     "max": 81
    }
   },
   {
    "id": 2959,
    "name": "Prirodoslovna gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 17,
     "min": 74.16,
     "avg": 78.92,
     "max": 83
    }
   },
   {
    "id": 2960,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 76.32,
     "avg": 79.16,
     "max": 81
    }
   }
  ]
 },
 {
  "id": 2220,
  "name": "Gospodarska škola",
  "city": "Čakovec",
  "county": "Međimurska",
  "programs": [
   {
    "id": 3261,
    "name": "Agrotehničar / Agrotehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 3,
     "min": 49.52,
     "avg": 54.05,
     "max": 58.56
    }
   },
   {
    "id": 3262,
    "name": "Cvjećar/Cvjećarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 15,
     "min": 23.74,
     "avg": 29.76,
     "max": 38.79
    }
   },
   {
    "id": 3263,
    "name": "Dizajner cipela i modnih dodataka / Dizajnerica cipela i modnih dodataka",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 6,
     "min": 42.39,
     "avg": 53.3,
     "max": 59.41
    }
   },
   {
    "id": 3264,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 14,
     "min": 32.66,
     "avg": 36.04,
     "max": 42.52
    }
   },
   {
    "id": 3265,
    "name": "Kozmetičar / Kozmetičarka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 18,
     "upisani": 18,
     "min": 57.05,
     "avg": 63.81,
     "max": 78.56
    }
   },
   {
    "id": 3266,
    "name": "Modni krojač/Modna krojačica",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 24.26,
     "avg": 27.36,
     "max": 36.26
    }
   },
   {
    "id": 3267,
    "name": "Modni tehničar / Modna tehničarka",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 13,
     "min": 60.59,
     "avg": 66.71,
     "max": 79.92
    }
   },
   {
    "id": 3268,
    "name": "Pomoćni cvjećar/Pomoćna cvjećarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 5,
     "min": 1.026,
     "avg": 33.43,
     "max": 46.34
    }
   },
   {
    "id": 3269,
    "name": "Pomoćni krojač/Pomoćna krojačica",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 6,
     "min": 1.024,
     "avg": 23.52,
     "max": 26.67
    }
   },
   {
    "id": 3270,
    "name": "Tehničar cestovnog prometa / Tehničarka cestovnog prometa",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 17,
     "min": 40.23,
     "avg": 52.52,
     "max": 65.81
    }
   },
   {
    "id": 3271,
    "name": "Vozač motornog vozila/Vozačica motornog vozila",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 26.94,
     "avg": 31.77,
     "max": 45.8
    }
   }
  ]
 },
 {
  "id": 368,
  "name": "Graditeljska škola Čakovec",
  "city": "Čakovec",
  "county": "Međimurska",
  "programs": [
   {
    "id": 3272,
    "name": "Arhitektonski tehničar / Arhitektonska tehničarka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 23,
     "min": 57.92,
     "avg": 71.29,
     "max": 80.32
    }
   },
   {
    "id": 3273,
    "name": "Građevinski radnik u održivoj gradnji/Građevinska radnica u održivoj gradnji",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 23.39,
     "avg": 26.67,
     "max": 35.47
    }
   },
   {
    "id": 3274,
    "name": "Građevinski radnik u zgradarstvu/Građevinska radnica u zgradarstvu",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 7,
     "min": 23.58,
     "avg": 26.52,
     "max": 31.93
    }
   },
   {
    "id": 3275,
    "name": "Građevinski tehničar / Građevinska tehničarka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 18,
     "min": 45.7,
     "avg": 61.15,
     "max": 75.34
    }
   },
   {
    "id": 3276,
    "name": "Likovna umjetnost i dizajn do izbora zanimanja",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 137.09,
     "avg": 64.09,
     "max": 179.65
    }
   },
   {
    "id": 3277,
    "name": "Medijski tehničar / Medijska tehničarka",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 11,
     "min": 51.95,
     "avg": 63.29,
     "max": 75.19
    }
   },
   {
    "id": 3278,
    "name": "Monter drvenih konstrukcija i krovova / Monterka drvenih konstrukcija i krovova",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 2,
     "min": 29.81,
     "avg": 33.19,
     "max": 36.56
    }
   },
   {
    "id": 3279,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 27.14,
     "avg": 31.58,
     "max": 39.93
    }
   },
   {
    "id": 3280,
    "name": "Oblagač podova i zidova/Oblagačica podova i zidova",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 28.55,
     "avg": 32.47,
     "max": 38
    }
   },
   {
    "id": 3281,
    "name": "Pomoćni radnik za uređenje interijera/Pomoćna radnica za uređenje interijera",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 9,
     "min": 1.029,
     "avg": 41.71,
     "max": 50
    }
   },
   {
    "id": 3282,
    "name": "Rukovatelj građevinskim strojevima/Rukovateljica građevinskim strojevima",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 24.7,
     "avg": 29.31,
     "max": 36.48
    }
   },
   {
    "id": 3283,
    "name": "Serviser karoserije motornih vozila/Serviserka karoserije motornih vozila",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 9,
     "min": 22.9,
     "avg": 26.65,
     "max": 31.33
    }
   },
   {
    "id": 3284,
    "name": "Soboslikar ličilac dekorater/Soboslikarica ličiteljica dekoraterka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 24.55,
     "avg": 29.87,
     "max": 48.36
    }
   },
   {
    "id": 3285,
    "name": "Stolar/Stolarica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 12,
     "min": 23.78,
     "avg": 27.1,
     "max": 34.68
    }
   },
   {
    "id": 3286,
    "name": "Tehničar za razvoj i dizajn web sučelja / Tehničarka za razvoj i dizajn web sučelja",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 11,
     "min": 51.84,
     "avg": 62.48,
     "max": 76.94
    }
   }
  ]
 },
 {
  "id": 372,
  "name": "Srednja škola Čakovec",
  "city": "Čakovec",
  "county": "Međimurska",
  "programs": [
   {
    "id": 4025,
    "name": "Fizioterapeutski tehničar / fizioterapeutska tehničarka",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 19,
     "min": 68.68,
     "avg": 71.21,
     "max": 75.01
    }
   },
   {
    "id": 4026,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 4027,
    "name": "Glazbenik gitarist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 4028,
    "name": "Glazbenik klavirist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": 1,
     "min": 238.37,
     "avg": 68.37,
     "max": 238.37
    }
   },
   {
    "id": 4029,
    "name": "Glazbenik trubač",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 4030,
    "name": "Medicinska sestra opće njege/medicinski tehničar opće njege",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 24,
     "min": 69.53,
     "avg": 73.67,
     "max": 79.84
    }
   },
   {
    "id": 4031,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 49,
     "upisani": 49,
     "min": 72.76,
     "avg": 77.29,
     "max": 80
    }
   },
   {
    "id": 4032,
    "name": "Pomoćni njegovatelj/Pomoćna njegovateljica",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 7,
     "min": 1.023,
     "avg": 30.32,
     "max": 49.82
    }
   }
  ]
 },
 {
  "id": 369,
  "name": "Tehnička škola Čakovec",
  "city": "Čakovec",
  "county": "Međimurska",
  "programs": [
   {
    "id": 4625,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 31.94,
     "avg": 35.72,
     "max": 43.24
    }
   },
   {
    "id": 4626,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 13,
     "min": 27.68,
     "avg": 32.08,
     "max": 39.18
    }
   },
   {
    "id": 4627,
    "name": "Elektromehaničar/Elektromehaničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 12,
     "min": 23.85,
     "avg": 29.41,
     "max": 37.83
    }
   },
   {
    "id": 4628,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 80,
     "upisani": 79,
     "min": 24.24,
     "avg": 31.7,
     "max": 45.69
    }
   },
   {
    "id": 4629,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 67.09,
     "avg": 75.3,
     "max": 80
    }
   },
   {
    "id": 4630,
    "name": "Tehničar za elektroniku i komunikacije / Tehničarka za elektroniku i komunikacije",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 55.25,
     "avg": 64.77,
     "max": 76.77
    }
   },
   {
    "id": 4631,
    "name": "Tehničar za mehatroniku / Tehničarka za mehatroniku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 36,
     "upisani": 36,
     "min": 55.49,
     "avg": 67.47,
     "max": 80
    }
   },
   {
    "id": 4632,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 32,
     "upisani": 32,
     "min": 63.06,
     "avg": 72.46,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 373,
  "name": "Srednja škola Prelog",
  "city": "Prelog",
  "county": "Međimurska",
  "programs": [
   {
    "id": 4324,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 10,
     "min": 23.77,
     "avg": 26.8,
     "max": 37.04
    }
   },
   {
    "id": 4325,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 17,
     "upisani": 16,
     "min": 25.1,
     "avg": 28.21,
     "max": 34.51
    }
   },
   {
    "id": 4326,
    "name": "Mesar/Mesarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 11,
     "upisani": 2,
     "min": 25.14,
     "avg": 27.11,
     "max": 29.08
    }
   },
   {
    "id": 4327,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 7,
     "min": 41.63,
     "avg": 63.96,
     "max": 78.39
    }
   },
   {
    "id": 4328,
    "name": "Pekar-slastičar/Pekarica-slastičarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 11,
     "upisani": 4,
     "min": 25.9,
     "avg": 27.61,
     "max": 37.13
    }
   },
   {
    "id": 4329,
    "name": "Pomoćni konobar/Pomoćna konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 4,
     "upisani": 1,
     "min": 1.026,
     "avg": 24.67,
     "max": 26.67
    }
   },
   {
    "id": 4330,
    "name": "Pomoćni kuhar/Pomoćna kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 6,
     "min": 1.026,
     "avg": 37.13,
     "max": 47.58
    }
   },
   {
    "id": 4331,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 7,
     "min": 43.65,
     "avg": 56.01,
     "max": 65.48
    }
   },
   {
    "id": 4332,
    "name": "Slastičar/Slastičarka",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 10,
     "min": 25.06,
     "avg": 26.04,
     "max": 31.06
    }
   },
   {
    "id": 4333,
    "name": "Tehničar za ugostiteljstvo / Tehničarka za ugostiteljstvo",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 21,
     "upisani": 10,
     "min": 41.23,
     "avg": 51.91,
     "max": 68.1
    }
   }
  ]
 },
 {
  "id": 264,
  "name": "Druga srednja škola Beli Manastir",
  "city": "Beli Manastir",
  "county": "Osječko-baranjska",
  "programs": [
   {
    "id": 2777,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 23.93,
     "avg": 29.65,
     "max": 37.27
    }
   },
   {
    "id": 2778,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 4,
     "min": 22.55,
     "avg": 25.01,
     "max": 28.63
    }
   },
   {
    "id": 2779,
    "name": "Kozmetičar / Kozmetičarka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 49.22,
     "avg": 56.58,
     "max": 68.28
    }
   },
   {
    "id": 2780,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 4,
     "min": 26.65,
     "avg": 29.7,
     "max": 35.25
    }
   },
   {
    "id": 2781,
    "name": "Mesar/Mesarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 2,
     "min": 23.8,
     "avg": 25.17,
     "max": 26.54
    }
   },
   {
    "id": 2782,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 6,
     "min": 25.23,
     "avg": 29.43,
     "max": 35
    }
   },
   {
    "id": 2783,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 5,
     "min": 42.08,
     "avg": 51.58,
     "max": 63.54
    }
   },
   {
    "id": 2784,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 12,
     "min": 41.72,
     "avg": 57.75,
     "max": 75.18
    }
   },
   {
    "id": 2785,
    "name": "Upravno-poslovni referent / Upravno-poslovna referentica",
    "sector": "Pravo, politologija, sociologija, državna uprava i javni poslovi",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 6,
     "min": 46.78,
     "avg": 57.89,
     "max": 68.85
    }
   },
   {
    "id": 2786,
    "name": "Veterinarski tehničar / Veterinarska tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 3,
     "min": 52.41,
     "avg": 65.11,
     "max": 77.86
    }
   }
  ]
 },
 {
  "id": 262,
  "name": "Gimnazija Beli Manastir",
  "city": "Beli Manastir",
  "county": "Osječko-baranjska",
  "programs": [
   {
    "id": 2925,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 16,
     "min": 57.46,
     "avg": 73.34,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 263,
  "name": "Prva srednja škola Beli Manastir",
  "city": "Beli Manastir",
  "county": "Osječko-baranjska",
  "programs": [
   {
    "id": 3745,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 7,
     "min": 28.12,
     "avg": 30.69,
     "max": 37.43
    }
   },
   {
    "id": 3746,
    "name": "Mehaničar poljoprivredne mehanizacije/Mehaničarka poljoprivredne mehanizacije",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 5,
     "min": 24.07,
     "avg": 26.13,
     "max": 28.09
    }
   },
   {
    "id": 3747,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 6,
     "min": 23.7,
     "avg": 29.67,
     "max": 36.39
    }
   },
   {
    "id": 3748,
    "name": "Tehničar cestovnog prometa / Tehničarka cestovnog prometa",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 8,
     "min": 42.85,
     "avg": 54.97,
     "max": 74.12
    }
   },
   {
    "id": 3749,
    "name": "Tehničar za mehatroniku / Tehničarka za mehatroniku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 17,
     "upisani": 12,
     "min": 49.99,
     "avg": 67.64,
     "max": 78.74
    }
   },
   {
    "id": 3750,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 12,
     "min": 48.29,
     "avg": 64.22,
     "max": 78.65
    }
   },
   {
    "id": 3751,
    "name": "Vozač motornog vozila/Vozačica motornog vozila",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 17,
     "upisani": 10,
     "min": 23.91,
     "avg": 25.71,
     "max": 34.67
    }
   }
  ]
 },
 {
  "id": 275,
  "name": "Srednja škola Dalj",
  "city": "Dalj",
  "county": "Osječko-baranjska",
  "programs": [
   {
    "id": 4038,
    "name": "Agrotehničar / Agrotehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 2,
     "min": 40.02,
     "avg": 48.35,
     "max": 56.67
    }
   },
   {
    "id": 4039,
    "name": "Agroturistički tehničar / Agroturistička tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 7,
     "min": 41.11,
     "avg": 50.67,
     "max": 64.71
    }
   }
  ]
 },
 {
  "id": 265,
  "name": "Srednja škola Donji Miholjac",
  "city": "Donji Miholjac",
  "county": "Osječko-baranjska",
  "programs": [
   {
    "id": 4046,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 9,
     "min": 28.95,
     "avg": 31.92,
     "max": 38.37
    }
   },
   {
    "id": 4047,
    "name": "Cvjećar/Cvjećarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 4,
     "min": 24.71,
     "avg": 25.9,
     "max": 28.37
    }
   },
   {
    "id": 4048,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 14,
     "min": 60,
     "avg": 70.9,
     "max": 80.71
    }
   },
   {
    "id": 4049,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 9,
     "min": 24.64,
     "avg": 28.16,
     "max": 32.21
    }
   },
   {
    "id": 4050,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 11,
     "upisani": 7,
     "min": 25.25,
     "avg": 29.14,
     "max": 34.79
    }
   },
   {
    "id": 4051,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 16,
     "min": 44.75,
     "avg": 58.93,
     "max": 75.07
    }
   },
   {
    "id": 4052,
    "name": "Tehničar za ugostiteljstvo / Tehničarka za ugostiteljstvo",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 22,
     "min": 43.38,
     "avg": 50.5,
     "max": 64.21
    }
   }
  ]
 },
 {
  "id": 2189,
  "name": "Ekonomska škola Braća Radić",
  "city": "Đakovo",
  "county": "Osječko-baranjska",
  "programs": [
   {
    "id": 2821,
    "name": "Komercijalist / Komercijalistica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 11,
     "min": 42.74,
     "avg": 56.69,
     "max": 68.38
    }
   },
   {
    "id": 2822,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 10,
     "min": 22.01,
     "avg": 26.88,
     "max": 33.21
    }
   },
   {
    "id": 2823,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 19,
     "min": 51.71,
     "avg": 63.89,
     "max": 78.87
    }
   },
   {
    "id": 2824,
    "name": "Tehničar za razvoj i dizajn web sučelja / Tehničarka za razvoj i dizajn web sučelja",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 57.28,
     "avg": 63.68,
     "max": 77.37
    }
   },
   {
    "id": 2825,
    "name": "Upravno-poslovni referent / Upravno-poslovna referentica",
    "sector": "Pravo, politologija, sociologija, državna uprava i javni poslovi",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 16,
     "min": 42.42,
     "avg": 59.73,
     "max": 74.36
    }
   }
  ]
 },
 {
  "id": 2201,
  "name": "Gimnazija A.G.Matoša",
  "city": "Đakovo",
  "county": "Osječko-baranjska",
  "programs": [
   {
    "id": 2914,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 80,
     "upisani": 74,
     "min": 53.29,
     "avg": 72.11,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 2269,
  "name": "Srednja strukovna škola Antuna Horvata",
  "city": "Đakovo",
  "county": "Osječko-baranjska",
  "programs": [
   {
    "id": 3781,
    "name": "Agrotehničar / Agrotehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 10,
     "min": 38.77,
     "avg": 49.33,
     "max": 60.38
    }
   },
   {
    "id": 3782,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 28.92,
     "avg": 32.49,
     "max": 37.64
    }
   },
   {
    "id": 3783,
    "name": "Cvjećar/Cvjećarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 3,
     "min": 24.52,
     "avg": 27.11,
     "max": 28.83
    }
   },
   {
    "id": 3784,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 23.52,
     "avg": 28.63,
     "max": 37.99
    }
   },
   {
    "id": 3785,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 14,
     "min": 23.46,
     "avg": 32.07,
     "max": 42.54
    }
   },
   {
    "id": 3786,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 14,
     "min": 22.7,
     "avg": 30.53,
     "max": 47.01
    }
   },
   {
    "id": 3787,
    "name": "Mehaničar poljoprivredne mehanizacije/Mehaničarka poljoprivredne mehanizacije",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 6,
     "min": 24.09,
     "avg": 27.52,
     "max": 32.81
    }
   },
   {
    "id": 3788,
    "name": "Mesar/Mesarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 4,
     "min": 24.13,
     "avg": 25.38,
     "max": 28.81
    }
   },
   {
    "id": 3789,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 6,
     "min": 23.79,
     "avg": 26.97,
     "max": 35.44
    }
   },
   {
    "id": 3790,
    "name": "Oblagač podova i zidova/Oblagačica podova i zidova",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 26.05,
     "avg": 29.79,
     "max": 33.82
    }
   },
   {
    "id": 3791,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 6,
     "min": 22.61,
     "avg": 24.95,
     "max": 29.38
    }
   },
   {
    "id": 3792,
    "name": "Pekar-slastičar/Pekarica-slastičarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 5,
     "min": 26.38,
     "avg": 32.55,
     "max": 39.51
    }
   },
   {
    "id": 3793,
    "name": "Soboslikar ličilac dekorater/Soboslikarica ličiteljica dekoraterka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 6,
     "min": 24.54,
     "avg": 26.64,
     "max": 29.94
    }
   },
   {
    "id": 3794,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 17,
     "upisani": 15,
     "min": 45.6,
     "avg": 54.82,
     "max": 72.93
    }
   },
   {
    "id": 3795,
    "name": "Tehničar za mehatroniku / Tehničarka za mehatroniku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 9,
     "min": 49.71,
     "avg": 67.53,
     "max": 75.07
    }
   },
   {
    "id": 3796,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 52.98,
     "avg": 63.84,
     "max": 75.43
    }
   }
  ]
 },
 {
  "id": 274,
  "name": "Srednja škola Josipa Kozarca Đurđenovac",
  "city": "Đurđenovac",
  "county": "Osječko-baranjska",
  "programs": [
   {
    "id": 4163,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 8,
     "min": 24.87,
     "avg": 30.82,
     "max": 35.13
    }
   },
   {
    "id": 4164,
    "name": "Pomoćni stolar/Pomoćna stolarica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 3,
     "min": 1.025,
     "avg": 40.02,
     "max": 49.14
    }
   },
   {
    "id": 4165,
    "name": "Stolar/Stolarica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 2,
     "min": 24.8,
     "avg": 25.51,
     "max": 26.21
    }
   },
   {
    "id": 4166,
    "name": "Šumarski tehničar / Šumarska tehničarka",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 10,
     "min": 41.08,
     "avg": 53.78,
     "max": 68.07
    }
   }
  ]
 },
 {
  "id": 269,
  "name": "Srednja škola Isidora Kršnjavoga Našice",
  "city": "Našice",
  "county": "Osječko-baranjska",
  "programs": [
   {
    "id": 4108,
    "name": "Agrotehničar / Agrotehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 46.61,
     "avg": 52.22,
     "max": 65.4
    }
   },
   {
    "id": 4109,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 33.18,
     "avg": 34.67,
     "max": 40.11
    }
   },
   {
    "id": 4110,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 37.14,
     "avg": 36.65,
     "max": 40.51
    }
   },
   {
    "id": 4111,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 7,
     "min": 27.99,
     "avg": 31.11,
     "max": 40.65
    }
   },
   {
    "id": 4112,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 30.62,
     "avg": 33.13,
     "max": 39.38
    }
   },
   {
    "id": 4113,
    "name": "Medicinska sestra opće njege/medicinski tehničar opće njege",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 64.44,
     "avg": 71.77,
     "max": 79.84
    }
   },
   {
    "id": 4114,
    "name": "Mesar/Mesarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 1,
     "min": 34.11,
     "avg": 34.11,
     "max": 34.11
    }
   },
   {
    "id": 4115,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 31.56,
     "avg": 33.73,
     "max": 38.05
    }
   },
   {
    "id": 4116,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 38,
     "min": 38.42,
     "avg": 68.15,
     "max": 80
    }
   },
   {
    "id": 4117,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 25.85,
     "avg": 27.76,
     "max": 31.47
    }
   },
   {
    "id": 4118,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 22,
     "min": 61.4,
     "avg": 77.98,
     "max": 80
    }
   },
   {
    "id": 4119,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 41.94,
     "avg": 58.72,
     "max": 76.15
    }
   },
   {
    "id": 4120,
    "name": "Slastičar/Slastičarka",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 6,
     "min": 32.01,
     "avg": 33.18,
     "max": 35.98
    }
   },
   {
    "id": 4121,
    "name": "Soboslikar ličilac dekorater/Soboslikarica ličiteljica dekoraterka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 4,
     "min": 23.95,
     "avg": 26.22,
     "max": 29.22
    }
   },
   {
    "id": 4122,
    "name": "Tehničar za elektroniku i komunikacije / Tehničarka za elektroniku i komunikacije",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 59.42,
     "avg": 66.61,
     "max": 76.02
    }
   },
   {
    "id": 4123,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 54.92,
     "avg": 65.32,
     "max": 77.73
    }
   }
  ]
 },
 {
  "id": 2141,
  "name": "EDukOS-PRIVATNA SREDNJA ŠKOLA S PRAVOM JAVNOSTI",
  "city": "Osijek",
  "county": "Osječko-baranjska",
  "programs": [
   {
    "id": 2794,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 28,
     "upisani": 18,
     "min": 66.78,
     "avg": 75.27,
     "max": 80
    }
   },
   {
    "id": 2795,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 28,
     "upisani": 17,
     "min": 68.54,
     "avg": 78.25,
     "max": 81
    }
   }
  ]
 },
 {
  "id": 72,
  "name": "Ekonomska i upravna škola Osijek",
  "city": "Osijek",
  "county": "Osječko-baranjska",
  "programs": [
   {
    "id": 2816,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 60,
     "upisani": 51,
     "min": 41.51,
     "avg": 59.64,
     "max": 73.85
    }
   },
   {
    "id": 2817,
    "name": "Upravno-poslovni referent / Upravno-poslovna referentica",
    "sector": "Pravo, politologija, sociologija, državna uprava i javni poslovi",
    "prag": {
     "year": "2025/2026",
     "kvota": 42,
     "upisani": 42,
     "min": 40.98,
     "avg": 56.93,
     "max": 71.73
    }
   }
  ]
 },
 {
  "id": 58,
  "name": "Elektrotehnička i prometna škola Osijek",
  "city": "Osijek",
  "county": "Osječko-baranjska",
  "programs": [
   {
    "id": 2891,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 29.06,
     "avg": 33.72,
     "max": 37.86
    }
   },
   {
    "id": 2892,
    "name": "Elektromehaničar/Elektromehaničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 29.77,
     "avg": 33.24,
     "max": 37.79
    }
   },
   {
    "id": 2893,
    "name": "Tehničar cestovnog prometa / Tehničarka cestovnog prometa",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 52.55,
     "avg": 58.09,
     "max": 75.4
    }
   },
   {
    "id": 2894,
    "name": "Tehničar za električne strojeve i elektroenergetiku / Tehničarka za električne strojeve i elektroenergetiku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 22,
     "min": 61.2,
     "avg": 69.61,
     "max": 79.83
    }
   },
   {
    "id": 2895,
    "name": "Tehničar za elektroniku i komunikacije / Tehničarka za elektroniku i komunikacije",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 22,
     "min": 61.85,
     "avg": 66.05,
     "max": 74.41
    }
   },
   {
    "id": 2896,
    "name": "Tehničar za mehatroniku / Tehničarka za mehatroniku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 64.97,
     "avg": 70.93,
     "max": 80
    }
   },
   {
    "id": 2897,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 40,
     "upisani": 38,
     "min": 68.21,
     "avg": 74.27,
     "max": 80
    }
   },
   {
    "id": 2898,
    "name": "Vozač motornog vozila/Vozačica motornog vozila",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 22,
     "min": 26.32,
     "avg": 31.49,
     "max": 39.05
    }
   }
  ]
 },
 {
  "id": 2198,
  "name": "Gaudeamus, prva privatna srednja škola u Osijeku s pravom javnosti",
  "city": "Osijek",
  "county": "Osječko-baranjska",
  "programs": [
   {
    "id": 2908,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 28,
     "upisani": 10,
     "min": 46.3,
     "avg": 66.6,
     "max": 81
    }
   }
  ]
 },
 {
  "id": 1952,
  "name": "Glazbena škola Franje Kuhača Osijek",
  "city": "Osijek",
  "county": "Osječko-baranjska",
  "programs": [
   {
    "id": 3095,
    "name": "Glazbenik - pripremno obrazovanje",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3096,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3097,
    "name": "Glazbenik - teorijski smjer",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": 3,
     "min": 165.69,
     "avg": 81.09,
     "max": 243.58
    }
   },
   {
    "id": 3098,
    "name": "Glazbenik flautist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 253.13,
     "avg": 83.13,
     "max": 253.13
    }
   },
   {
    "id": 3099,
    "name": "Glazbenik gitarist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 230.31,
     "avg": 86.31,
     "max": 230.31
    }
   },
   {
    "id": 3100,
    "name": "Glazbenik klavirist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 228.12,
     "avg": 72.12,
     "max": 228.12
    }
   },
   {
    "id": 3101,
    "name": "Glazbenik pjevač",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 228.75,
     "avg": 84.75,
     "max": 228.75
    }
   },
   {
    "id": 3102,
    "name": "Glazbenik tamburaš",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3103,
    "name": "Glazbenik trubač",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 223.9,
     "avg": 79.9,
     "max": 223.9
    }
   },
   {
    "id": 3104,
    "name": "Glazbenik violinist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   }
  ]
 },
 {
  "id": 271,
  "name": "Graditeljsko-geodetska škola Osijek",
  "city": "Osijek",
  "county": "Osječko-baranjska",
  "programs": [
   {
    "id": 3305,
    "name": "Arhitektonski tehničar / Arhitektonska tehničarka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 68.83,
     "avg": 72.66,
     "max": 78.85
    }
   },
   {
    "id": 3306,
    "name": "Građevinski radnik u održivoj gradnji/Građevinska radnica u održivoj gradnji",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 8,
     "min": 23.31,
     "avg": 29.97,
     "max": 40.55
    }
   },
   {
    "id": 3307,
    "name": "Građevinski radnik u zgradarstvu/Građevinska radnica u zgradarstvu",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 4,
     "upisani": 2,
     "min": 26.22,
     "avg": 32.35,
     "max": 38.47
    }
   },
   {
    "id": 3308,
    "name": "Građevinski tehničar / Građevinska tehničarka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 64.52,
     "avg": 67.07,
     "max": 74.28
    }
   },
   {
    "id": 3309,
    "name": "Oblagač podova i zidova/Oblagačica podova i zidova",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 19,
     "min": 28.06,
     "avg": 33.09,
     "max": 38.55
    }
   },
   {
    "id": 3310,
    "name": "Soboslikar ličilac dekorater/Soboslikarica ličiteljica dekoraterka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 11,
     "upisani": 11,
     "min": 23.83,
     "avg": 27.94,
     "max": 35.31
    }
   },
   {
    "id": 3311,
    "name": "Tehničar geodezije i geoinformatike / Tehničarka geodezije i geoinformatike",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 19,
     "min": 61.15,
     "avg": 65.15,
     "max": 76.35
    }
   }
  ]
 },
 {
  "id": 60,
  "name": "I. gimnazija Osijek",
  "city": "Osijek",
  "county": "Osječko-baranjska",
  "programs": [
   {
    "id": 3331,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 156,
     "upisani": 156,
     "min": 60.15,
     "avg": 70.94,
     "max": 82
    }
   },
   {
    "id": 3332,
    "name": "Opća gimnazija (odjel za sportaše) (320104-S)",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 107.16,
     "avg": 63.46,
     "max": 156.93
    }
   }
  ]
 },
 {
  "id": 65,
  "name": "II. gimnazija Osijek",
  "city": "Osijek",
  "county": "Osječko-baranjska",
  "programs": [
   {
    "id": 3340,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 80,
     "upisani": 73,
     "min": 45.07,
     "avg": 64.85,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 54,
  "name": "III. gimnazija Osijek",
  "city": "Osijek",
  "county": "Osječko-baranjska",
  "programs": [
   {
    "id": 3343,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 156,
     "upisani": 156,
     "min": 68.02,
     "avg": 77.57,
     "max": 82
    }
   }
  ]
 },
 {
  "id": 2073,
  "name": "Isusovačka klasična gimnazija s pravom javnosti u Osijeku",
  "city": "Osijek",
  "county": "Osječko-baranjska",
  "programs": [
   {
    "id": 3418,
    "name": "Klasična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 47,
     "upisani": 43,
     "min": 46.35,
     "avg": 74.6,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 66,
  "name": "Medicinska škola Osijek",
  "city": "Osijek",
  "county": "Osječko-baranjska",
  "programs": [
   {
    "id": 3450,
    "name": "Dentalni tehničar/Dentalna tehničarka",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 68.11,
     "avg": 74.34,
     "max": 80
    }
   },
   {
    "id": 3451,
    "name": "Fizioterapeutski tehničar / fizioterapeutska tehničarka",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 69.06,
     "avg": 72.7,
     "max": 79.44
    }
   },
   {
    "id": 3452,
    "name": "Medicinska sestra opće njege/medicinski tehničar opće njege",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 71,
     "upisani": 69,
     "min": 62.05,
     "avg": 70.33,
     "max": 80
    }
   },
   {
    "id": 3453,
    "name": "Zdravstveno-laboratorijski tehničar",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 69.84,
     "avg": 75.84,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 74,
  "name": "Obrtnička škola Osijek",
  "city": "Osijek",
  "county": "Osječko-baranjska",
  "programs": [
   {
    "id": 3557,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 19,
     "min": 33.37,
     "avg": 36.8,
     "max": 46.86
    }
   },
   {
    "id": 3558,
    "name": "Kozmetičar / Kozmetičarka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 56.69,
     "avg": 62.38,
     "max": 69.16
    }
   },
   {
    "id": 3559,
    "name": "Mesar/Mesarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 4,
     "upisani": 1,
     "min": 27.38,
     "avg": 27.38,
     "max": 27.38
    }
   },
   {
    "id": 3560,
    "name": "Pekar-slastičar/Pekarica-slastičarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 6,
     "min": 25.2,
     "avg": 28.87,
     "max": 40.31
    }
   },
   {
    "id": 3561,
    "name": "Pomoćni autolakirer/Pomoćna autolakirerica",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": 3,
     "min": 1.027,
     "avg": 41.78,
     "max": 50
    }
   },
   {
    "id": 3562,
    "name": "Pomoćni bravar/Pomoćna bravarica",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": 1,
     "min": 1.045,
     "avg": 45.51,
     "max": 45.51
    }
   },
   {
    "id": 3563,
    "name": "Pomoćni cvjećar/Pomoćna cvjećarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 4,
     "upisani": 2,
     "min": 1.036,
     "avg": 43.28,
     "max": 49.8
    }
   },
   {
    "id": 3564,
    "name": "Pomoćni kuhar/Pomoćna kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 1.041,
     "avg": 45.12,
     "max": 47.85
    }
   },
   {
    "id": 3565,
    "name": "Pomoćni pekar/Pomoćna pekarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 4,
     "upisani": 2,
     "min": 1.04,
     "avg": 45.11,
     "max": 49.82
    }
   },
   {
    "id": 3566,
    "name": "Pomoćni vodoinstalater/Pomoćna vodoinstalaterka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 4,
     "upisani": 4,
     "min": 1.044,
     "avg": 47.19,
     "max": 49.75
    }
   },
   {
    "id": 3567,
    "name": "Stolar/Stolarica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 24.4,
     "avg": 28.12,
     "max": 37.06
    }
   }
  ]
 },
 {
  "id": 67,
  "name": "Poljoprivredna i veterinarska škola Osijek",
  "city": "Osijek",
  "county": "Osječko-baranjska",
  "programs": [
   {
    "id": 3621,
    "name": "Agrotehničar / Agrotehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 17,
     "min": 41.12,
     "avg": 53.05,
     "max": 65.52
    }
   },
   {
    "id": 3622,
    "name": "Cvjećar/Cvjećarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 4,
     "min": 31.58,
     "avg": 27.93,
     "max": 31.58
    }
   },
   {
    "id": 3623,
    "name": "Mehaničar poljoprivredne mehanizacije/Mehaničarka poljoprivredne mehanizacije",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 5,
     "min": 24.33,
     "avg": 26.49,
     "max": 31.47
    }
   },
   {
    "id": 3624,
    "name": "Veterinarski tehničar / Veterinarska tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 18,
     "min": 49.55,
     "avg": 62.33,
     "max": 71.5
    }
   }
  ]
 },
 {
  "id": 859,
  "name": "PROSVJETNO-KULTURNI CENTAR MAĐARA U REPUBLICI HRVATSKOJ",
  "city": "Osijek",
  "county": "Osječko-baranjska",
  "programs": [
   {
    "id": 3729,
    "name": "Kuhar/Kuharica  (nastava na mađarskom jeziku) (071204-MM)",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 1,
     "min": 1.026,
     "avg": 26.12,
     "max": 26.12
    }
   },
   {
    "id": 3730,
    "name": "Opća gimnazija (nastava na mađarskom jeziku) (320104-MM)",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 2,
     "min": 77.2,
     "avg": 77.48,
     "max": 77.75
    }
   },
   {
    "id": 3731,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju (nastava na mađarskom jeziku) (060500-MM)",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 6,
     "min": 47.05,
     "avg": 58.49,
     "max": 70.51
    }
   },
   {
    "id": 3732,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacija (nastava na mađarskom jeziku) (070108-MM)",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 2,
     "min": 56.48,
     "avg": 62.35,
     "max": 68.21
    }
   }
  ]
 },
 {
  "id": 59,
  "name": "Strojarska tehnička škola Osijek",
  "city": "Osijek",
  "county": "Osječko-baranjska",
  "programs": [
   {
    "id": 4441,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 34,
     "upisani": 34,
     "min": 27,
     "avg": 32.34,
     "max": 43.33
    }
   },
   {
    "id": 4442,
    "name": "Izrađivač-monter strojarskih konstrukcija/Izrađivačica-monterka strojarskih konstrukcija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 4,
     "upisani": 1,
     "min": 25.27,
     "avg": 25.27,
     "max": 25.27
    }
   },
   {
    "id": 4443,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 32,
     "upisani": 31,
     "min": 25.8,
     "avg": 31.21,
     "max": 39.4
    }
   },
   {
    "id": 4444,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 11,
     "min": 24.21,
     "avg": 28.37,
     "max": 36.6
    }
   },
   {
    "id": 4445,
    "name": "Serviser karoserije motornih vozila/Serviserka karoserije motornih vozila",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 5,
     "min": 30.56,
     "avg": 33.64,
     "max": 38.91
    }
   },
   {
    "id": 4446,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 30,
     "upisani": 30,
     "min": 46.86,
     "avg": 56.51,
     "max": 73.09
    }
   },
   {
    "id": 4447,
    "name": "Tehničar za vozila / Tehničarka za vozila",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 9,
     "min": 43.17,
     "avg": 55.67,
     "max": 67.85
    }
   }
  ]
 },
 {
  "id": 77,
  "name": "Škola primijenjene umjetnosti i dizajna Osijek",
  "city": "Osijek",
  "county": "Osječko-baranjska",
  "programs": [
   {
    "id": 4524,
    "name": "Likovna umjetnost i dizajn do izbora zanimanja",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 63,
     "upisani": 54,
     "min": 121.14,
     "avg": 64.11,
     "max": 195
    }
   }
  ]
 },
 {
  "id": 2320,
  "name": "Tehnička škola i prirodoslovna gimnazija Ruđera Boškovića",
  "city": "Osijek",
  "county": "Osječko-baranjska",
  "programs": [
   {
    "id": 4645,
    "name": "Dizajner grafičkih proizvoda / Dizajnerica grafičkih proizvoda",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 19,
     "min": 63.58,
     "avg": 70.02,
     "max": 80
    }
   },
   {
    "id": 4646,
    "name": "Kozmetičar / Kozmetičarka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 65.56,
     "avg": 68.02,
     "max": 76.91
    }
   },
   {
    "id": 4647,
    "name": "Prirodoslovna gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 23,
     "min": 55.55,
     "avg": 68.05,
     "max": 80
    }
   },
   {
    "id": 4648,
    "name": "Tehničar nutricionist / Tehničarka nutricionistica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 57.55,
     "avg": 63.28,
     "max": 78.93
    }
   }
  ]
 },
 {
  "id": 2325,
  "name": "Trgovačka i komercijalna škola Davor Milas",
  "city": "Osijek",
  "county": "Osječko-baranjska",
  "programs": [
   {
    "id": 4747,
    "name": "Administrator (prilagođeni program)",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 4,
     "min": 1.013,
     "avg": 15.1,
     "max": 18.71
    }
   },
   {
    "id": 4748,
    "name": "Komercijalist / Komercijalistica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 40,
     "upisani": 36,
     "min": 37.14,
     "avg": 50.93,
     "max": 62.83
    }
   },
   {
    "id": 4749,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 10,
     "min": 23.65,
     "avg": 28.43,
     "max": 38.36
    }
   }
  ]
 },
 {
  "id": 2329,
  "name": "Ugostiteljsko-turistička škola",
  "city": "Osijek",
  "county": "Osječko-baranjska",
  "programs": [
   {
    "id": 4793,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 21,
     "upisani": 13,
     "min": 23.41,
     "avg": 29.41,
     "max": 37.24
    }
   },
   {
    "id": 4794,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 35,
     "upisani": 29,
     "min": 23.86,
     "avg": 31.45,
     "max": 41.53
    }
   },
   {
    "id": 4795,
    "name": "Slastičar/Slastičarka",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 9,
     "min": 30.24,
     "avg": 32.64,
     "max": 37.59
    }
   },
   {
    "id": 4796,
    "name": "Tehničar za ugostiteljstvo / Tehničarka za ugostiteljstvo",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 39,
     "upisani": 38,
     "min": 47.08,
     "avg": 57.12,
     "max": 72.29
    }
   },
   {
    "id": 4797,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 21,
     "min": 53.53,
     "avg": 60.1,
     "max": 72.38
    }
   }
  ]
 },
 {
  "id": 273,
  "name": "Srednja škola Valpovo",
  "city": "Valpovo",
  "county": "Osječko-baranjska",
  "programs": [
   {
    "id": 4362,
    "name": "Elektromehaničar/Elektromehaničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 6,
     "min": 27.56,
     "avg": 31.34,
     "max": 37.14
    }
   },
   {
    "id": 4363,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 40,
     "upisani": 30,
     "min": 49.9,
     "avg": 70.8,
     "max": 80
    }
   },
   {
    "id": 4364,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 7,
     "min": 23.56,
     "avg": 28.8,
     "max": 33.63
    }
   },
   {
    "id": 4365,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 50.04,
     "avg": 64.88,
     "max": 80
    }
   },
   {
    "id": 4366,
    "name": "Tehničar za elektroniku i komunikacije / Tehničarka za elektroniku i komunikacije",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 65.82,
     "avg": 73.73,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 225,
  "name": "Srednja škola Pakrac",
  "city": "Pakrac",
  "county": "Požeško-slavonska",
  "programs": [
   {
    "id": 4291,
    "name": "Fizioterapeutski tehničar / fizioterapeutska tehničarka",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 19,
     "min": 56.5,
     "avg": 65.75,
     "max": 78.37
    }
   },
   {
    "id": 4292,
    "name": "Građevinski radnik u zgradarstvu/Građevinska radnica u zgradarstvu",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 2,
     "min": 23.98,
     "avg": 24.53,
     "max": 25.08
    }
   },
   {
    "id": 4293,
    "name": "Građevinski tehničar / Građevinska tehničarka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 42.67,
     "avg": 55.28,
     "max": 68.11
    }
   },
   {
    "id": 4294,
    "name": "Medicinska sestra opće njege/medicinski tehničar opće njege",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 40,
     "upisani": 40,
     "min": 55.6,
     "avg": 64.6,
     "max": 77.64
    }
   },
   {
    "id": 4295,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 19,
     "min": 50.62,
     "avg": 70.7,
     "max": 80
    }
   },
   {
    "id": 4296,
    "name": "Stolar/Stolarica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 3,
     "min": 28.17,
     "avg": 33.94,
     "max": 39.17
    }
   }
  ]
 },
 {
  "id": 227,
  "name": "Ekonomska škola Požega",
  "city": "Požega",
  "county": "Požeško-slavonska",
  "programs": [
   {
    "id": 2845,
    "name": "Komercijalist / Komercijalistica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 40.78,
     "avg": 53.39,
     "max": 67.12
    }
   },
   {
    "id": 2842,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 18,
     "min": 41.54,
     "avg": 60.12,
     "max": 77.34
    }
   },
   {
    "id": 2846,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 19,
     "min": 41.48,
     "avg": 56.67,
     "max": 76.24
    }
   },
   {
    "id": 2844,
    "name": "Upravno-poslovni referent / Upravno-poslovna referentica",
    "sector": "Pravo, politologija, sociologija, državna uprava i javni poslovi",
    "prag": {
     "year": "2025/2026",
     "kvota": 17,
     "upisani": 17,
     "min": 57.16,
     "avg": 65.33,
     "max": 78.49
    }
   }
  ]
 },
 {
  "id": 226,
  "name": "Gimnazija Požega",
  "city": "Požega",
  "county": "Požeško-slavonska",
  "programs": [
   {
    "id": 2989,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 50,
     "min": 58.9,
     "avg": 75.77,
     "max": 82.64
    }
   },
   {
    "id": 2990,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 45,
     "min": 67.31,
     "avg": 76.87,
     "max": 82.92
    }
   }
  ]
 },
 {
  "id": 1473,
  "name": "Glazbena škola Požega",
  "city": "Požega",
  "county": "Požeško-slavonska",
  "programs": [
   {
    "id": 3178,
    "name": "Glazbenik - eufonist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 251.04,
     "avg": 81.04,
     "max": 251.04
    }
   },
   {
    "id": 3179,
    "name": "Glazbenik - pripremno obrazovanje",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3180,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3181,
    "name": "Glazbenik - teorijski smjer",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 254.67,
     "avg": 84.67,
     "max": 254.67
    }
   },
   {
    "id": 3182,
    "name": "Glazbenik harmonikaš",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 223.18,
     "avg": 73.18,
     "max": 223.18
    }
   },
   {
    "id": 3183,
    "name": "Glazbenik klavirist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3184,
    "name": "Glazbenik pjevač",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": 1,
     "min": 242.37,
     "avg": 86.37,
     "max": 242.37
    }
   },
   {
    "id": 3185,
    "name": "Glazbenik tamburaš",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 5,
     "min": 211.22,
     "avg": 86.91,
     "max": 260
    }
   },
   {
    "id": 3186,
    "name": "Glazbenik udaraljkaš",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 165.7,
     "avg": 63.7,
     "max": 165.7
    }
   },
   {
    "id": 3187,
    "name": "Glazbenik violončelist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 221.43,
     "avg": 79.43,
     "max": 221.43
    }
   }
  ]
 },
 {
  "id": 2231,
  "name": "Katolička gimnazija s pravom javnosti",
  "city": "Požega",
  "county": "Požeško-slavonska",
  "programs": [
   {
    "id": 3429,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 40,
     "upisani": 28,
     "min": 50.58,
     "avg": 67.49,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 2118,
  "name": "Obrtnička škola Požega",
  "city": "Požega",
  "county": "Požeško-slavonska",
  "programs": [
   {
    "id": 3572,
    "name": "Arhitektonski tehničar / Arhitektonska tehničarka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 19,
     "min": 58.24,
     "avg": 66.14,
     "max": 79.53
    }
   },
   {
    "id": 3573,
    "name": "Građevinski radnik u zgradarstvu/Građevinska radnica u zgradarstvu",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 7,
     "min": 22.06,
     "avg": 26.06,
     "max": 32.76
    }
   },
   {
    "id": 3574,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 9,
     "min": 23.37,
     "avg": 25.93,
     "max": 28.8
    }
   },
   {
    "id": 3575,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 26.55,
     "avg": 32.17,
     "max": 38.36
    }
   },
   {
    "id": 4875,
    "name": "Modni tehničar / Modna tehničarka",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 7,
     "min": 55.49,
     "avg": 61.27,
     "max": 78.77
    }
   },
   {
    "id": 3577,
    "name": "Monter drvenih konstrukcija i krovova / Monterka drvenih konstrukcija i krovova",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 2,
     "min": 22.67,
     "avg": 25.91,
     "max": 29.14
    }
   },
   {
    "id": 3578,
    "name": "Soboslikar ličilac dekorater/Soboslikarica ličiteljica dekoraterka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 7,
     "min": 23.23,
     "avg": 24.69,
     "max": 27.31
    }
   },
   {
    "id": 3579,
    "name": "Stolar/Stolarica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 14,
     "min": 23.65,
     "avg": 27.28,
     "max": 38.64
    }
   },
   {
    "id": 3580,
    "name": "Tehničar za ugostiteljstvo / Tehničarka za ugostiteljstvo",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 16,
     "min": 46.08,
     "avg": 54.12,
     "max": 62.91
    }
   }
  ]
 },
 {
  "id": 2248,
  "name": "Poljoprivredno-prehrambena škola",
  "city": "Požega",
  "county": "Požeško-slavonska",
  "programs": [
   {
    "id": 3641,
    "name": "Agrotehničar / Agrotehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 8,
     "min": 40.92,
     "avg": 48.6,
     "max": 60.64
    }
   },
   {
    "id": 3642,
    "name": "Agroturistički tehničar / Agroturistička tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 17,
     "upisani": 5,
     "min": 42.94,
     "avg": 48.93,
     "max": 61.97
    }
   },
   {
    "id": 3643,
    "name": "Mehaničar poljoprivredne mehanizacije/Mehaničarka poljoprivredne mehanizacije",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 17,
     "min": 23.46,
     "avg": 26.32,
     "max": 30.47
    }
   },
   {
    "id": 3644,
    "name": "Mesar/Mesarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 4,
     "min": 23.5,
     "avg": 24.21,
     "max": 25.99
    }
   },
   {
    "id": 3645,
    "name": "Pekar-slastičar/Pekarica-slastičarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 8,
     "min": 23.91,
     "avg": 28.46,
     "max": 29.74
    }
   },
   {
    "id": 3646,
    "name": "Pomoćni pekar/Pomoćna pekarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 3,
     "min": 1.035,
     "avg": 40.15,
     "max": 43.96
    }
   },
   {
    "id": 3647,
    "name": "Prehrambeni tehničar / Prehrambena tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 4,
     "min": 40.55,
     "avg": 46.82,
     "max": 52.61
    }
   }
  ]
 },
 {
  "id": 229,
  "name": "Tehnička škola Požega",
  "city": "Požega",
  "county": "Požeško-slavonska",
  "programs": [
   {
    "id": 4729,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 29.38,
     "avg": 32.56,
     "max": 41.3
    }
   },
   {
    "id": 4915,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 29.48,
     "avg": 31.37,
     "max": 35.11
    }
   },
   {
    "id": 4731,
    "name": "Elektromehaničar/Elektromehaničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 27.55,
     "avg": 30.38,
     "max": 36.5
    }
   },
   {
    "id": 4732,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 28.33,
     "avg": 32.36,
     "max": 36.57
    }
   },
   {
    "id": 4733,
    "name": "Serviser karoserije motornih vozila/Serviserka karoserije motornih vozila",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 26.89,
     "avg": 27.8,
     "max": 30.75
    }
   },
   {
    "id": 4893,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 45.24,
     "avg": 53.36,
     "max": 64.21
    }
   },
   {
    "id": 4906,
    "name": "Tehničar za električne strojeve i elektroenergetiku / Tehničarka za električne strojeve i elektroenergetiku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 50.76,
     "avg": 59.86,
     "max": 78.85
    }
   },
   {
    "id": 4909,
    "name": "Tehničar za mehatroniku / Tehničarka za mehatroniku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 56.09,
     "avg": 64.67,
     "max": 79.6
    }
   },
   {
    "id": 4912,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 19,
     "min": 55.15,
     "avg": 66.78,
     "max": 77.72
    }
   }
  ]
 },
 {
  "id": 208,
  "name": "Pomorska škola Bakar",
  "city": "Bakar",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 4877,
    "name": "Pomorski nautičar / Pomorska nautičarka",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 48,
     "upisani": 33,
     "min": 39.34,
     "avg": 54.88,
     "max": 72.27
    }
   },
   {
    "id": 4876,
    "name": "Tehničar za brodostrojarstvo / Tehničarka za brodostrojarstvo",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 18,
     "min": 36.34,
     "avg": 51.88,
     "max": 66.84
    }
   }
  ]
 },
 {
  "id": 179,
  "name": "Srednja škola dr. Antuna Barca Crikvenica",
  "city": "Crikvenica",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 4053,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 4,
     "min": 24.3,
     "avg": 26.38,
     "max": 28.6
    }
   },
   {
    "id": 4054,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 6,
     "min": 26.92,
     "avg": 29.11,
     "max": 32.89
    }
   },
   {
    "id": 4055,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 31.79,
     "avg": 35.42,
     "max": 41.93
    }
   },
   {
    "id": 4056,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 23,
     "min": 55.41,
     "avg": 72.55,
     "max": 83
    }
   },
   {
    "id": 4057,
    "name": "Pomoćni kuhar/Pomoćna kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 4058,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 17,
     "upisani": 5,
     "min": 46.95,
     "avg": 60.92,
     "max": 70.21
    }
   },
   {
    "id": 4059,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 44.33,
     "avg": 59.64,
     "max": 71.92
    }
   }
  ]
 },
 {
  "id": 2292,
  "name": "Srednja škola Vladimir Nazor",
  "city": "Čabar",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 4378,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 4,
     "min": 51.57,
     "avg": 66.22,
     "max": 79.92
    }
   }
  ]
 },
 {
  "id": 181,
  "name": "Srednja škola Delnice",
  "city": "Delnice",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 4040,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 28.38,
     "avg": 31.1,
     "max": 40.3
    }
   },
   {
    "id": 4041,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 15,
     "min": 58.47,
     "avg": 75.44,
     "max": 80
    }
   },
   {
    "id": 4042,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 4,
     "min": 26.92,
     "avg": 31.06,
     "max": 34.47
    }
   },
   {
    "id": 4043,
    "name": "Šumarski tehničar / Šumarska tehničarka",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 17,
     "min": 46.48,
     "avg": 61.54,
     "max": 75.66
    }
   }
  ]
 },
 {
  "id": 1760,
  "name": "Srednja škola Hrvatski kralj Zvonimir",
  "city": "Krk",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 4091,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 9,
     "min": 24.02,
     "avg": 29.89,
     "max": 34.11
    }
   },
   {
    "id": 4092,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 6,
     "min": 24.1,
     "avg": 29.62,
     "max": 36.23
    }
   },
   {
    "id": 4093,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 8,
     "min": 25.84,
     "avg": 30.31,
     "max": 34.99
    }
   },
   {
    "id": 4094,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 25.6,
     "avg": 29.38,
     "max": 36.08
    }
   },
   {
    "id": 4095,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 42,
     "min": 54.9,
     "avg": 72.97,
     "max": 83
    }
   },
   {
    "id": 4096,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 48,
     "upisani": 48,
     "min": 42.07,
     "avg": 59.23,
     "max": 76.44
    }
   }
  ]
 },
 {
  "id": 2182,
  "name": "Centar za pružanje usluga u zajednici Mali Lošinj",
  "city": "Mali Lošinj",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 2767,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 2768,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 2769,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 1,
     "min": 29.14,
     "avg": 30.24,
     "max": 31.33
    }
   },
   {
    "id": 2770,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 2771,
    "name": "Stolar/Stolarica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   }
  ]
 },
 {
  "id": 1574,
  "name": "Srednja škola Ambroza Haračića",
  "city": "Mali Lošinj",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 3956,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 5,
     "min": 24.54,
     "avg": 26.4,
     "max": 29.18
    }
   },
   {
    "id": 3957,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 54.29,
     "avg": 71.33,
     "max": 79.61
    }
   },
   {
    "id": 4887,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 10,
     "min": 63.64,
     "avg": 72.04,
     "max": 80
    }
   },
   {
    "id": 3958,
    "name": "Pomoćni administrator/Pomoćna administratorica",
    "sector": "Pravo, politologija, sociologija, državna uprava i javni poslovi",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 1,
     "min": 47.7,
     "avg": 47.7,
     "max": 47.7
    }
   },
   {
    "id": 3959,
    "name": "Pomorski nautičar / Pomorska nautičarka",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 5,
     "min": 48.14,
     "avg": 61.1,
     "max": 79.58
    }
   },
   {
    "id": 3960,
    "name": "Tehničar za brodostrojarstvo / Tehničarka za brodostrojarstvo",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 7,
     "min": 48.65,
     "avg": 62.45,
     "max": 69.43
    }
   },
   {
    "id": 3961,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 19,
     "min": 48.23,
     "avg": 60.04,
     "max": 78.69
    }
   }
  ]
 },
 {
  "id": 207,
  "name": "Željeznička tehnička škola Moravice",
  "city": "Moravice",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 4863,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 9,
     "min": 25.54,
     "avg": 28.11,
     "max": 34.33
    }
   },
   {
    "id": 4864,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 6,
     "min": 43.79,
     "avg": 61.24,
     "max": 76.04
    }
   },
   {
    "id": 4865,
    "name": "Tehničar za mehatroniku / Tehničarka za mehatroniku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 51.04,
     "avg": 59.76,
     "max": 69.74
    }
   },
   {
    "id": 4866,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 50.39,
     "avg": 60.19,
     "max": 71.64
    }
   }
  ]
 },
 {
  "id": 184,
  "name": "Gimnazija Eugena Kumičića Opatija",
  "city": "Opatija",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 2939,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 6,
     "min": 52.33,
     "avg": 62.56,
     "max": 70.57
    }
   },
   {
    "id": 2940,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 23,
     "min": 53.14,
     "avg": 67.09,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 1306,
  "name": "Hotelijersko-turistička škola",
  "city": "Opatija",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 3329,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 71,
     "upisani": 71,
     "min": 47.17,
     "avg": 57.53,
     "max": 79.92
    }
   }
  ]
 },
 {
  "id": 2235,
  "name": "MEĐUNARODNA SREDNJA ŠKOLA ADRIA",
  "city": "Opatija",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 3471,
    "name": "Opća gimnazija uz skupinu predmeta na stranom jeziku",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 2,
     "min": 56.65,
     "avg": 57.03,
     "max": 57.41
    }
   }
  ]
 },
 {
  "id": 185,
  "name": "Obrtnička škola Opatija",
  "city": "Opatija",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 4897,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 71,
     "upisani": 68,
     "min": 23.21,
     "avg": 30.92,
     "max": 44.12
    }
   },
   {
    "id": 4874,
    "name": "Kozmetičar / Kozmetičarka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 23,
     "min": 54.15,
     "avg": 61.9,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 183,
  "name": "Ugostiteljska škola Opatija",
  "city": "Opatija",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 4788,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 9,
     "min": 23.69,
     "avg": 27.97,
     "max": 32.8
    }
   },
   {
    "id": 4789,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 46,
     "upisani": 27,
     "min": 21.64,
     "avg": 29.87,
     "max": 38.68
    }
   },
   {
    "id": 4790,
    "name": "Slastičar/Slastičarka",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 11,
     "min": 23.23,
     "avg": 31.39,
     "max": 45.44
    }
   },
   {
    "id": 4791,
    "name": "Tehničar posluživanja / Tehničarka posluživanja",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 21,
     "upisani": 13,
     "min": 41.7,
     "avg": 51.1,
     "max": 61.47
    }
   },
   {
    "id": 4792,
    "name": "Tehničar za ugostiteljstvo / Tehničarka za ugostiteljstvo",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 39.46,
     "avg": 50.46,
     "max": 63.56
    }
   }
  ]
 },
 {
  "id": 187,
  "name": "Srednja škola Markantuna de Dominisa Rab",
  "city": "Rab",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 4231,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 6,
     "min": 28.75,
     "avg": 29.51,
     "max": 33.88
    }
   },
   {
    "id": 4232,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 2,
     "min": 30.77,
     "avg": 35.01,
     "max": 39.25
    }
   },
   {
    "id": 4233,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 16,
     "min": 60,
     "avg": 73.35,
     "max": 79.92
    }
   },
   {
    "id": 4234,
    "name": "Tehničar za ugostiteljstvo / Tehničarka za ugostiteljstvo",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 15,
     "min": 50.05,
     "avg": 56.17,
     "max": 70.55
    }
   }
  ]
 },
 {
  "id": 188,
  "name": "CENTAR ZA ODGOJ I OBRAZOVANJE",
  "city": "Rijeka",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 2758,
    "name": "Pomoćni grafički radnik tiska / Pomoćna grafička radnica tiska",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": 2,
     "min": 1.047,
     "avg": 47.83,
     "max": 47.83
    }
   },
   {
    "id": 2759,
    "name": "Pomoćni krojač/Pomoćna krojačica",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": 1,
     "min": 1.038,
     "avg": 38.06,
     "max": 38.06
    }
   },
   {
    "id": 2760,
    "name": "Pomoćni kuhar/Pomoćna kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 4,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 2761,
    "name": "Pomoćni vodoinstalater/Pomoćna vodoinstalaterka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 2,
     "min": 1.039,
     "avg": 40.94,
     "max": 42.33
    }
   },
   {
    "id": 2762,
    "name": "Pomoćni vrtlar/Pomoćna vrtlarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 4,
     "upisani": 1,
     "min": 1.026,
     "avg": 35.43,
     "max": 43.87
    }
   }
  ]
 },
 {
  "id": 2185,
  "name": "Drvodjeljska i strojarska škola",
  "city": "Rijeka",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 2789,
    "name": "Brodograditelj/Brodograditeljica",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 4,
     "min": 25.94,
     "avg": 26.93,
     "max": 28.04
    }
   },
   {
    "id": 2790,
    "name": "Drvodjeljski tehničar i dizajner / Drvodjeljska tehničarka i dizajnerica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 20,
     "min": 44.08,
     "avg": 57.47,
     "max": 71.86
    }
   },
   {
    "id": 2791,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 25,
     "upisani": 25,
     "min": 24.14,
     "avg": 29.7,
     "max": 43.62
    }
   },
   {
    "id": 2792,
    "name": "Stolar/Stolarica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 11,
     "min": 23.14,
     "avg": 29.01,
     "max": 41.31
    }
   }
  ]
 },
 {
  "id": 68,
  "name": "Ekonomska škola Mije Mirkovića Rijeka",
  "city": "Rijeka",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 2826,
    "name": "Administrator (prilagođeni program)",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 4,
     "min": 1.015,
     "avg": 18.06,
     "max": 19.36
    }
   },
   {
    "id": 2827,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 47.47,
     "avg": 55.64,
     "max": 71.48
    }
   },
   {
    "id": 2828,
    "name": "Pomoćni administrator/Pomoćna administratorica",
    "sector": "Pravo, politologija, sociologija, državna uprava i javni poslovi",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 2,
     "min": 1.039,
     "avg": 40.58,
     "max": 41.28
    }
   },
   {
    "id": 2829,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 48,
     "upisani": 48,
     "min": 53.41,
     "avg": 61.92,
     "max": 75.47
    }
   },
   {
    "id": 2830,
    "name": "Upravno-poslovni referent / Upravno-poslovna referentica",
    "sector": "Pravo, politologija, sociologija, državna uprava i javni poslovi",
    "prag": {
     "year": "2025/2026",
     "kvota": 48,
     "upisani": 48,
     "min": 53.26,
     "avg": 62.76,
     "max": 78.85
    }
   }
  ]
 },
 {
  "id": 200,
  "name": "Elektroindustrijska i obrtnička škola Rijeka",
  "city": "Rijeka",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 2864,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 11,
     "min": 30.73,
     "avg": 34.08,
     "max": 40.29
    }
   },
   {
    "id": 2865,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 26.93,
     "avg": 31.88,
     "max": 36.54
    }
   },
   {
    "id": 2866,
    "name": "Elektromehaničar/Elektromehaničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 26.29,
     "avg": 28.42,
     "max": 34.08
    }
   },
   {
    "id": 2867,
    "name": "Elektroničar/Elektroničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 28.65,
     "avg": 30.79,
     "max": 35.25
    }
   },
   {
    "id": 2868,
    "name": "Tehničar za informacijske tehnologije / Tehničarka za informacijske tehnologije",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 50.9,
     "avg": 56.35,
     "max": 71.77
    }
   },
   {
    "id": 2869,
    "name": "Tehničar za mehatroniku / Tehničarka za mehatroniku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 59.75,
     "avg": 64.01,
     "max": 73.73
    }
   }
  ]
 },
 {
  "id": 197,
  "name": "Gimnazija Andrije Mohorovičića Rijeka",
  "city": "Rijeka",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 2915,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 68,
     "upisani": 68,
     "min": 63.86,
     "avg": 72.63,
     "max": 80
    }
   },
   {
    "id": 2916,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 48,
     "upisani": 49,
     "min": 65.89,
     "avg": 77.05,
     "max": 81
    }
   }
  ]
 },
 {
  "id": 2211,
  "name": "Glazbena škola Ivana Matetića Ronjgova Rijeka",
  "city": "Rijeka",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 3109,
    "name": "Glazbenik - pripremno obrazovanje",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3110,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 34,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3111,
    "name": "Glazbenik - teorijski smjer",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3112,
    "name": "Glazbenik flautist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": 2,
     "min": 227.93,
     "avg": 84.39,
     "max": 242.81
    }
   },
   {
    "id": 3113,
    "name": "Glazbenik gitarist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 231.32,
     "avg": 82.32,
     "max": 231.32
    }
   },
   {
    "id": 3114,
    "name": "Glazbenik harfist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 4,
     "upisani": 2,
     "min": 234.35,
     "avg": 83.18,
     "max": 259
    }
   },
   {
    "id": 3115,
    "name": "Glazbenik harmonikaš",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": 2,
     "min": 232.21,
     "avg": 80.17,
     "max": 244.03
    }
   },
   {
    "id": 3116,
    "name": "Glazbenik klavirist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": 3,
     "min": 205.9,
     "avg": 82.09,
     "max": 259.92
    }
   },
   {
    "id": 3117,
    "name": "Glazbenik saksofonist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 0,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3118,
    "name": "Glazbenik udaraljkaš",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 0,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3119,
    "name": "Glazbenik violinist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 210.95,
     "avg": 79.75,
     "max": 210.95
    }
   },
   {
    "id": 3120,
    "name": "Glazbenik violist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 216.7,
     "avg": 75.05,
     "max": 216.7
    }
   }
  ]
 },
 {
  "id": 2221,
  "name": "Graditeljska škola za industriju i obrt",
  "city": "Rijeka",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 3287,
    "name": "Cvjećar/Cvjećarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 5,
     "min": 28.77,
     "avg": 32.82,
     "max": 40.87
    }
   },
   {
    "id": 3288,
    "name": "Građevinski radnik u zgradarstvu/Građevinska radnica u zgradarstvu",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 3,
     "min": 25.63,
     "avg": 29.27,
     "max": 36.18
    }
   },
   {
    "id": 3289,
    "name": "Oblagač podova i zidova/Oblagačica podova i zidova",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 21,
     "min": 22.91,
     "avg": 30.05,
     "max": 38.18
    }
   },
   {
    "id": 3290,
    "name": "Soboslikar ličilac dekorater/Soboslikarica ličiteljica dekoraterka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 8,
     "min": 25.79,
     "avg": 31.59,
     "max": 43.53
    }
   },
   {
    "id": 3291,
    "name": "Uzgajivač cvijeća/Uzgajivačica cvijeća",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 3,
     "min": 44.15,
     "avg": 40.15,
     "max": 49.4
    }
   }
  ]
 },
 {
  "id": 2224,
  "name": "Građevinska tehnička škola",
  "city": "Rijeka",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 3315,
    "name": "Arhitektonski tehničar / Arhitektonska tehničarka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 73.22,
     "avg": 76.47,
     "max": 80.92
    }
   },
   {
    "id": 3316,
    "name": "Dizajner unutrašnje arhitekture",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 148.86,
     "avg": 70.65,
     "max": 187.86
    }
   },
   {
    "id": 3317,
    "name": "Građevinski tehničar / Građevinska tehničarka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 65.61,
     "avg": 70.92,
     "max": 76.81
    }
   },
   {
    "id": 3318,
    "name": "Tehničar geodezije i geoinformatike / Tehničarka geodezije i geoinformatike",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 61.62,
     "avg": 67.68,
     "max": 79.92
    }
   }
  ]
 },
 {
  "id": 202,
  "name": "Medicinska škola u Rijeci",
  "city": "Rijeka",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 3457,
    "name": "Dentalni tehničar/Dentalna tehničarka",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 23,
     "min": 69.16,
     "avg": 73.13,
     "max": 80
    }
   },
   {
    "id": 3458,
    "name": "Farmaceutski tehničar",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 23,
     "min": 70.96,
     "avg": 74.41,
     "max": 79.93
    }
   },
   {
    "id": 3459,
    "name": "Fizioterapeutski tehničar / fizioterapeutska tehničarka",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 23,
     "min": 70.4,
     "avg": 73.22,
     "max": 78.64
    }
   },
   {
    "id": 3460,
    "name": "Medicinska sestra opće njege/medicinski tehničar opće njege",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 77,
     "upisani": 76,
     "min": 53.37,
     "avg": 61.74,
     "max": 77.18
    }
   },
   {
    "id": 3461,
    "name": "Sanitarni tehničar",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 56.51,
     "avg": 63.36,
     "max": 73.34
    }
   },
   {
    "id": 3462,
    "name": "Tehničar nutricionist / Tehničarka nutricionistica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 58.07,
     "avg": 65.91,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 194,
  "name": "Prirodoslovna i grafička škola Rijeka",
  "city": "Rijeka",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 3663,
    "name": "Dizajner grafičkih proizvoda / Dizajnerica grafičkih proizvoda",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 53.51,
     "avg": 61.05,
     "max": 72.03
    }
   },
   {
    "id": 3664,
    "name": "Ekološki tehničar / Ekološka tehničarka",
    "sector": "Geologija, rudarstvo, nafta i kemijska tehnologija",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 47.36,
     "avg": 51.81,
     "max": 64.84
    }
   },
   {
    "id": 3665,
    "name": "Kemijski tehničar / Kemijska tehničarka",
    "sector": "Geologija, rudarstvo, nafta i kemijska tehnologija",
    "prag": {
     "year": "2025/2026",
     "kvota": 11,
     "upisani": 11,
     "min": 49.05,
     "avg": 61.38,
     "max": 75.09
    }
   },
   {
    "id": 3666,
    "name": "Medijski tehničar / Medijska tehničarka",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 63.57,
     "avg": 68.44,
     "max": 76.27
    }
   },
   {
    "id": 3667,
    "name": "Prirodoslovna gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 43.33,
     "avg": 63.81,
     "max": 80
    }
   },
   {
    "id": 3668,
    "name": "Tehničar za razvoj i dizajn web sučelja / Tehničarka za razvoj i dizajn web sučelja",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 23,
     "min": 55.57,
     "avg": 64.49,
     "max": 73.43
    }
   }
  ]
 },
 {
  "id": 2265,
  "name": "Prometna škola",
  "city": "Rijeka",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 3722,
    "name": "Tehničar cestovnog prometa / Tehničarka cestovnog prometa",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 23,
     "min": 42.36,
     "avg": 48.34,
     "max": 55.61
    }
   },
   {
    "id": 3723,
    "name": "Tehničar za poštu i poštansku logistiku  / Tehničarka za poštu i poštansku logistiku",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 11,
     "min": 40.17,
     "avg": 45.91,
     "max": 51.82
    }
   },
   {
    "id": 3724,
    "name": "Vozač motornog vozila/Vozačica motornog vozila",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 33,
     "upisani": 32,
     "min": 24.22,
     "avg": 29.02,
     "max": 37.92
    }
   }
  ]
 },
 {
  "id": 193,
  "name": "Prva riječka hrvatska gimnazija",
  "city": "Rijeka",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 3741,
    "name": "IBMYP program",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 13,
     "min": 65.82,
     "avg": 73.92,
     "max": 79.01
    }
   },
   {
    "id": 3742,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 51,
     "upisani": 51,
     "min": 64.23,
     "avg": 71.64,
     "max": 81
    }
   },
   {
    "id": 3743,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 52,
     "min": 68.25,
     "avg": 76.41,
     "max": 80
    }
   },
   {
    "id": 3744,
    "name": "Opća gimnazija (odjel za sportaše) (320104-S)",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 123.88,
     "avg": 75.36,
     "max": 152
    }
   }
  ]
 },
 {
  "id": 196,
  "name": "Prva sušačka hrvatska gimnazija u Rijeci",
  "city": "Rijeka",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 3760,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 69.58,
     "avg": 73.46,
     "max": 79.92
    }
   },
   {
    "id": 3761,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 104,
     "upisani": 104,
     "min": 73.82,
     "avg": 77.91,
     "max": 82
    }
   },
   {
    "id": 3762,
    "name": "Plesač klasičnog baleta",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 4,
     "upisani": 1,
     "min": 194.92,
     "avg": 84.92,
     "max": 194.92
    }
   },
   {
    "id": 3763,
    "name": "Plesač suvremenog plesa",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 5,
     "min": 156.57,
     "avg": 75.48,
     "max": 183.34
    }
   },
   {
    "id": 3764,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 52,
     "min": 69.13,
     "avg": 75.94,
     "max": 83
    }
   }
  ]
 },
 {
  "id": 2006,
  "name": "Salezijanska klasična gimnazija - s pravom javnosti",
  "city": "Rijeka",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 3765,
    "name": "Klasična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 67.89,
     "avg": 73.76,
     "max": 80
    }
   },
   {
    "id": 3766,
    "name": "Opća gimnazija (odjel za sportaše) (320104-S)",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 52,
     "min": 129.29,
     "avg": 76.37,
     "max": 149.65
    }
   }
  ]
 },
 {
  "id": 2279,
  "name": "Srednja škola Andrije Ljudevita Adamića",
  "city": "Rijeka",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 3962,
    "name": "Farmaceutski tehničar",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 8,
     "min": 56.16,
     "avg": 60.57,
     "max": 68.17
    }
   },
   {
    "id": 3963,
    "name": "Fizioterapeutski tehničar / fizioterapeutska tehničarka",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 50.65,
     "avg": 59.93,
     "max": 67.38
    }
   },
   {
    "id": 3964,
    "name": "Hrvatsko-europska gimnazija s usmjerenjima",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 60.27,
     "avg": 72.26,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 1430,
  "name": "Srednja škola za elektrotehniku i računalstvo",
  "city": "Rijeka",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 4389,
    "name": "Tehničar za električne strojeve i elektroenergetiku / Tehničarka za električne strojeve i elektroenergetiku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 60.71,
     "avg": 66.31,
     "max": 79.93
    }
   },
   {
    "id": 4390,
    "name": "Tehničar za elektroniku i komunikacije / Tehničarka za elektroniku i komunikacije",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 46,
     "upisani": 46,
     "min": 53.72,
     "avg": 63.57,
     "max": 78.93
    }
   },
   {
    "id": 4391,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 47,
     "upisani": 47,
     "min": 55.45,
     "avg": 65.91,
     "max": 78.84
    }
   }
  ]
 },
 {
  "id": 2294,
  "name": "Srednja talijanska škola - Rijeka Scuola media superiore Italiana - Fiume",
  "city": "Rijeka",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 4409,
    "name": "Jezična gimnazija (nastava na talijanskom jeziku) (320304-MT)",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 10,
     "min": 54,
     "avg": 62.31,
     "max": 74.75
    }
   },
   {
    "id": 4410,
    "name": "Opća gimnazija (nastava na talijanskom jeziku) (320104-MT)",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 18,
     "upisani": 16,
     "min": 61.13,
     "avg": 72.15,
     "max": 81
    }
   },
   {
    "id": 4411,
    "name": "Prirodoslovno-matematička gimnazija (nastava na talijanskom jeziku) (320204-MT)",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 5,
     "min": 60.6,
     "avg": 71.5,
     "max": 78.25
    }
   },
   {
    "id": 4412,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacija (nastava na talijanskom jeziku) (070108-MT)",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 8,
     "min": 49.57,
     "avg": 58.11,
     "max": 68.19
    }
   }
  ]
 },
 {
  "id": 2296,
  "name": "SREDNJA WALDORFSKA ŠKOLA U RIJECI",
  "city": "Rijeka",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 4417,
    "name": "Srednja škola - alternativni program waldorfske škole",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 7,
     "min": 61.56,
     "avg": 70.05,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 2300,
  "name": "Strojarska škola za industrijska i obrtnička zanimanja",
  "city": "Rijeka",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 4431,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 42,
     "upisani": 41,
     "min": 25.25,
     "avg": 29.67,
     "max": 46.41
    }
   },
   {
    "id": 4432,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 17,
     "upisani": 10,
     "min": 23.53,
     "avg": 26.41,
     "max": 31.56
    }
   },
   {
    "id": 4433,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 12,
     "min": 22.54,
     "avg": 26.09,
     "max": 32.14
    }
   },
   {
    "id": 4434,
    "name": "Serviser karoserije motornih vozila/Serviserka karoserije motornih vozila",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 5,
     "min": 25.19,
     "avg": 26.94,
     "max": 29.98
    }
   }
  ]
 },
 {
  "id": 205,
  "name": "Škola za primijenjenu umjetnost u Rijeci",
  "city": "Rijeka",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 4573,
    "name": "Likovna umjetnost i dizajn do izbora zanimanja",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 41,
     "upisani": 38,
     "min": 118.61,
     "avg": 64.35,
     "max": 184.8
    }
   }
  ]
 },
 {
  "id": 2314,
  "name": "Škola za trgovinu i modni dizajn Rijeka",
  "city": "Rijeka",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 4574,
    "name": "Dizajner odjeće",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 144.5,
     "avg": 59.07,
     "max": 178.81
    }
   },
   {
    "id": 4575,
    "name": "Komercijalist / Komercijalistica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 51.93,
     "avg": 58.6,
     "max": 75.64
    }
   },
   {
    "id": 4576,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 18,
     "min": 23.77,
     "avg": 27.39,
     "max": 33.58
    }
   }
  ]
 },
 {
  "id": 199,
  "name": "Tehnička škola Rijeka",
  "city": "Rijeka",
  "county": "Primorsko-goranska",
  "programs": [
   {
    "id": 4738,
    "name": "Brodograđevni tehničar / Brodograđevna tehničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 53.75,
     "avg": 58.18,
     "max": 78.29
    }
   },
   {
    "id": 4894,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 48,
     "upisani": 48,
     "min": 55.48,
     "avg": 62.69,
     "max": 77.07
    }
   },
   {
    "id": 4910,
    "name": "Tehničar za mehatroniku / Tehničarka za mehatroniku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 68.39,
     "avg": 71.47,
     "max": 78.93
    }
   }
  ]
 },
 {
  "id": 129,
  "name": "Srednja škola Glina",
  "city": "Glina",
  "county": "Sisačko-moslavačka",
  "programs": [
   {
    "id": 4086,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 10,
     "min": 24.97,
     "avg": 29.4,
     "max": 38.65
    }
   },
   {
    "id": 4087,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 11,
     "min": 48.5,
     "avg": 72.87,
     "max": 80
    }
   },
   {
    "id": 4088,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 10,
     "min": 48.36,
     "avg": 61.12,
     "max": 77.78
    }
   }
  ]
 },
 {
  "id": 2285,
  "name": "Srednja škola Ivana Trnskoga",
  "city": "Hrvatska Kostajnica",
  "county": "Sisačko-moslavačka",
  "programs": [
   {
    "id": 4144,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 5,
     "min": 57.28,
     "avg": 74.39,
     "max": 80
    }
   },
   {
    "id": 4145,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 5,
     "min": 43.81,
     "avg": 54.31,
     "max": 59.72
    }
   },
   {
    "id": 4146,
    "name": "Stolar/Stolarica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 4,
     "min": 24.39,
     "avg": 28.57,
     "max": 34.39
    }
   },
   {
    "id": 4147,
    "name": "Šumarski tehničar / Šumarska tehničarka",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 7,
     "min": 37.65,
     "avg": 53.43,
     "max": 63.42
    }
   }
  ]
 },
 {
  "id": 1433,
  "name": "Srednja škola Tina Ujevića",
  "city": "Kutina",
  "county": "Sisačko-moslavačka",
  "programs": [
   {
    "id": 4349,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 22,
     "min": 51.14,
     "avg": 76.07,
     "max": 83
    }
   },
   {
    "id": 4908,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 42,
     "upisani": 27,
     "min": 40.89,
     "avg": 59.93,
     "max": 78.92
    }
   }
  ]
 },
 {
  "id": 131,
  "name": "Srednja škola Tina Ujevića Kutina",
  "city": "Kutina",
  "county": "Sisačko-moslavačka",
  "programs": [
   {
    "id": 4890,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 48,
     "upisani": 48,
     "min": 72.93,
     "avg": 77.46,
     "max": 81.77
    }
   }
  ]
 },
 {
  "id": 132,
  "name": "Tehnička škola Kutina",
  "city": "Kutina",
  "county": "Sisačko-moslavačka",
  "programs": [
   {
    "id": 4660,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 9,
     "min": 30.36,
     "avg": 35.07,
     "max": 41.37
    }
   },
   {
    "id": 4661,
    "name": "Farmaceutski tehničar",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 68.08,
     "avg": 73.78,
     "max": 80
    }
   },
   {
    "id": 4662,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 7,
     "min": 33.92,
     "avg": 35.31,
     "max": 40.35
    }
   },
   {
    "id": 4663,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 9,
     "min": 27.75,
     "avg": 30.82,
     "max": 38.71
    }
   },
   {
    "id": 4664,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 45.14,
     "avg": 56.34,
     "max": 74.87
    }
   },
   {
    "id": 4665,
    "name": "Tehničar za električne strojeve i elektroenergetiku / Tehničarka za električne strojeve i elektroenergetiku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 58.17,
     "avg": 65.68,
     "max": 76.5
    }
   },
   {
    "id": 4666,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 22,
     "min": 47.36,
     "avg": 66.24,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 2030,
  "name": "Glazbena škola u Novskoj",
  "city": "Novska",
  "county": "Sisačko-moslavačka",
  "programs": [
   {
    "id": 3194,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3195,
    "name": "Glazbenik - teorijski smjer",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 235.36,
     "avg": 87.36,
     "max": 235.36
    }
   },
   {
    "id": 3196,
    "name": "Glazbenik tamburaš",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   }
  ]
 },
 {
  "id": 133,
  "name": "Srednja škola Novska",
  "city": "Novska",
  "county": "Sisačko-moslavačka",
  "programs": [
   {
    "id": 4267,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 27.98,
     "avg": 31.13,
     "max": 36.32
    }
   },
   {
    "id": 4268,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 46.69,
     "avg": 73.03,
     "max": 80
    }
   },
   {
    "id": 4269,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 8,
     "min": 23.25,
     "avg": 25.74,
     "max": 30.83
    }
   },
   {
    "id": 4270,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 3,
     "min": 31.36,
     "avg": 29.98,
     "max": 32.32
    }
   },
   {
    "id": 4271,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 52.47,
     "avg": 62.47,
     "max": 72.74
    }
   },
   {
    "id": 4272,
    "name": "Stolar/Stolarica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 2,
     "min": 23.3,
     "avg": 23.48,
     "max": 23.65
    }
   },
   {
    "id": 4273,
    "name": "Tehničar za razvoj video igara / Tehničarka za razvoj video igara",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 57.84,
     "avg": 68.26,
     "max": 81
    }
   }
  ]
 },
 {
  "id": 134,
  "name": "Srednja škola Petrinja",
  "city": "Petrinja",
  "county": "Sisačko-moslavačka",
  "programs": [
   {
    "id": 4309,
    "name": "Cvjećar/Cvjećarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 3,
     "min": 24,
     "avg": 26.74,
     "max": 29.64
    }
   },
   {
    "id": 4310,
    "name": "Mesar/Mesarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 5,
     "min": 25.04,
     "avg": 26.01,
     "max": 27.69
    }
   },
   {
    "id": 4311,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 41,
     "upisani": 20,
     "min": 57.64,
     "avg": 72.42,
     "max": 81.84
    }
   },
   {
    "id": 4312,
    "name": "Pomoćni proizvođač sadnog materijala/Pomoćna proizvođačica sadnog materijala",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 2,
     "min": 1.025,
     "avg": 25.94,
     "max": 26.56
    }
   },
   {
    "id": 4313,
    "name": "Prehrambeni tehničar / Prehrambena tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 5,
     "min": 38.42,
     "avg": 46.23,
     "max": 61.53
    }
   },
   {
    "id": 4314,
    "name": "Veterinarski tehničar / Veterinarska tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 17,
     "upisani": 12,
     "min": 39.9,
     "avg": 50.89,
     "max": 71.7
    }
   }
  ]
 },
 {
  "id": 2232,
  "name": "Katolička opća gimnazija",
  "city": "Popovača",
  "county": "Sisačko-moslavačka",
  "programs": [
   {
    "id": 3431,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 10,
     "min": 40.76,
     "avg": 67.58,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 140,
  "name": "Ekonomska škola Sisak",
  "city": "Sisak",
  "county": "Sisačko-moslavačka",
  "programs": [
   {
    "id": 2833,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 43,
     "upisani": 43,
     "min": 41.99,
     "avg": 57.49,
     "max": 79.14
    }
   },
   {
    "id": 2834,
    "name": "Upravno-poslovni referent / Upravno-poslovna referentica",
    "sector": "Pravo, politologija, sociologija, državna uprava i javni poslovi",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 21,
     "min": 46.29,
     "avg": 54.55,
     "max": 70.11
    }
   }
  ]
 },
 {
  "id": 135,
  "name": "Gimnazija Sisak",
  "city": "Sisak",
  "county": "Sisačko-moslavačka",
  "programs": [
   {
    "id": 2995,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 13,
     "min": 41.74,
     "avg": 63.2,
     "max": 78.79
    }
   },
   {
    "id": 2996,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 72,
     "upisani": 60,
     "min": 51.01,
     "avg": 72.37,
     "max": 82.92
    }
   },
   {
    "id": 2997,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 12,
     "min": 61.76,
     "avg": 76.28,
     "max": 82.92
    }
   }
  ]
 },
 {
  "id": 1919,
  "name": "Glazbena škola Frana Lhotke",
  "city": "Sisak",
  "county": "Sisačko-moslavačka",
  "programs": [
   {
    "id": 3093,
    "name": "Glazbenik - pripremno obrazovanje",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3094,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   }
  ]
 },
 {
  "id": 136,
  "name": "Industrijsko-obrtnička škola Sisak",
  "city": "Sisak",
  "county": "Sisačko-moslavačka",
  "programs": [
   {
    "id": 3373,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 21,
     "upisani": 21,
     "min": 24.18,
     "avg": 30.69,
     "max": 41.68
    }
   },
   {
    "id": 3374,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 12,
     "min": 25.66,
     "avg": 30.68,
     "max": 40.21
    }
   },
   {
    "id": 3375,
    "name": "Elektromehaničar/Elektromehaničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 4,
     "min": 22.77,
     "avg": 23.99,
     "max": 25.58
    }
   },
   {
    "id": 3376,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 31,
     "upisani": 30,
     "min": 23.67,
     "avg": 30.34,
     "max": 40.8
    }
   },
   {
    "id": 3377,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 21,
     "upisani": 13,
     "min": 23.13,
     "avg": 27.42,
     "max": 38.78
    }
   },
   {
    "id": 3378,
    "name": "Serviser karoserije motornih vozila/Serviserka karoserije motornih vozila",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 5,
     "min": 24.06,
     "avg": 24.89,
     "max": 26.48
    }
   }
  ]
 },
 {
  "id": 1715,
  "name": "Srednja škola Viktorovac",
  "city": "Sisak",
  "county": "Sisačko-moslavačka",
  "programs": [
   {
    "id": 4371,
    "name": "Farmaceutski tehničar",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 65.66,
     "avg": 71.8,
     "max": 79.92
    }
   },
   {
    "id": 4372,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 28.91,
     "avg": 33.59,
     "max": 42.65
    }
   },
   {
    "id": 4373,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 23.94,
     "avg": 27.57,
     "max": 37.24
    }
   },
   {
    "id": 4374,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 18,
     "upisani": 18,
     "min": 25.17,
     "avg": 30.49,
     "max": 38.86
    }
   },
   {
    "id": 4375,
    "name": "Medicinska sestra opće njege/medicinski tehničar opće njege",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 48,
     "upisani": 48,
     "min": 51.32,
     "avg": 61.99,
     "max": 80
    }
   },
   {
    "id": 4376,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 14,
     "min": 23.7,
     "avg": 27.92,
     "max": 37.46
    }
   },
   {
    "id": 4377,
    "name": "Slastičar/Slastičarka",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 24.7,
     "avg": 29.57,
     "max": 35.8
    }
   }
  ]
 },
 {
  "id": 1963,
  "name": "Strukovna škola Sisak",
  "city": "Sisak",
  "county": "Sisačko-moslavačka",
  "programs": [
   {
    "id": 4485,
    "name": "Arhitektonski tehničar / Arhitektonska tehničarka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 73.47,
     "avg": 75.17,
     "max": 80
    }
   },
   {
    "id": 4486,
    "name": "Građevinski radnik u održivoj gradnji/Građevinska radnica u održivoj gradnji",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 5,
     "min": 24.42,
     "avg": 27.73,
     "max": 31.51
    }
   },
   {
    "id": 4487,
    "name": "Građevinski radnik u zgradarstvu/Građevinska radnica u zgradarstvu",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 7,
     "min": 23.26,
     "avg": 26.12,
     "max": 38.2
    }
   },
   {
    "id": 4488,
    "name": "Građevinski tehničar / Građevinska tehničarka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 65.44,
     "avg": 70.25,
     "max": 77.38
    }
   },
   {
    "id": 4489,
    "name": "Modni krojač/Modna krojačica",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 6,
     "min": 24.3,
     "avg": 27.37,
     "max": 32.21
    }
   },
   {
    "id": 4490,
    "name": "Modni tehničar / Modna tehničarka",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 51.67,
     "avg": 56.84,
     "max": 68.73
    }
   },
   {
    "id": 4491,
    "name": "Oblagač podova i zidova/Oblagačica podova i zidova",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 26.64,
     "avg": 29.42,
     "max": 36.05
    }
   },
   {
    "id": 4492,
    "name": "Pomoćni cvjećar/Pomoćna cvjećarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 4,
     "upisani": 1,
     "min": 1.05,
     "avg": 50,
     "max": 50
    }
   },
   {
    "id": 4493,
    "name": "Pomoćni kuhar/Pomoćna kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 2,
     "min": 1.031,
     "avg": 31.79,
     "max": 32.17
    }
   },
   {
    "id": 4494,
    "name": "Pomoćni pekar/Pomoćna pekarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 3,
     "min": 1.036,
     "avg": 39.35,
     "max": 40.74
    }
   },
   {
    "id": 4495,
    "name": "Pomoćni stolar/Pomoćna stolarica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": 1,
     "min": 1.027,
     "avg": 27.3,
     "max": 27.3
    }
   },
   {
    "id": 4496,
    "name": "Rukovatelj građevinskim strojevima/Rukovateljica građevinskim strojevima",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 25.25,
     "avg": 25.75,
     "max": 27.94
    }
   },
   {
    "id": 4497,
    "name": "Soboslikar ličilac dekorater/Soboslikarica ličiteljica dekoraterka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 6,
     "min": 23.39,
     "avg": 27.21,
     "max": 42.23
    }
   },
   {
    "id": 4498,
    "name": "Stolar/Stolarica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 7,
     "min": 22.83,
     "avg": 24.48,
     "max": 27.43
    }
   },
   {
    "id": 4499,
    "name": "Tehničar cestovnog prometa / Tehničarka cestovnog prometa",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 55.86,
     "avg": 59.91,
     "max": 70.64
    }
   },
   {
    "id": 4500,
    "name": "Tehničar za razvoj i dizajn web sučelja / Tehničarka za razvoj i dizajn web sučelja",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 54.71,
     "avg": 61.44,
     "max": 76.55
    }
   },
   {
    "id": 4501,
    "name": "Vozač motornog vozila/Vozačica motornog vozila",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 26.13,
     "avg": 30.29,
     "max": 42.9
    }
   }
  ]
 },
 {
  "id": 139,
  "name": "Tehnička škola Sisak",
  "city": "Sisak",
  "county": "Sisačko-moslavačka",
  "programs": [
   {
    "id": 4703,
    "name": "Kemijski tehničar / Kemijska tehničarka",
    "sector": "Geologija, rudarstvo, nafta i kemijska tehnologija",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 7,
     "min": 37.3,
     "avg": 48.5,
     "max": 62.72
    }
   },
   {
    "id": 4704,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 22,
     "min": 49.71,
     "avg": 59.57,
     "max": 78.7
    }
   },
   {
    "id": 4705,
    "name": "Tehničar za mehatroniku / Tehničarka za mehatroniku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 49.48,
     "avg": 64.44,
     "max": 77.5
    }
   },
   {
    "id": 4706,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 28,
     "upisani": 27,
     "min": 57.47,
     "avg": 69.14,
     "max": 79.77
    }
   },
   {
    "id": 4707,
    "name": "Tehničar za razvoj video igara / Tehničarka za razvoj video igara",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 25,
     "upisani": 24,
     "min": 53,
     "avg": 65.11,
     "max": 79.62
    }
   },
   {
    "id": 4708,
    "name": "Tehničar za robotiku i automatizaciju / Tehničarka za robotiku i automatizaciju",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 19,
     "min": 41.12,
     "avg": 53.67,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 142,
  "name": "Srednja škola Topusko",
  "city": "Topusko",
  "county": "Sisačko-moslavačka",
  "programs": [
   {
    "id": 4355,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 7,
     "min": 23.04,
     "avg": 31.21,
     "max": 40.11
    }
   },
   {
    "id": 4356,
    "name": "Fizioterapeutski tehničar / fizioterapeutska tehničarka",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 41.12,
     "avg": 54.23,
     "max": 76.77
    }
   },
   {
    "id": 4357,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 2,
     "min": 25.2,
     "avg": 25.32,
     "max": 25.43
    }
   },
   {
    "id": 4358,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 5,
     "min": 23.2,
     "avg": 26.6,
     "max": 30.43
    }
   },
   {
    "id": 4359,
    "name": "Slastičar/Slastičarka",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 4,
     "min": 25.21,
     "avg": 28.59,
     "max": 30.25
    }
   }
  ]
 },
 {
  "id": 326,
  "name": "Srednja škola Bol",
  "city": "Bol",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 4012,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 12,
     "min": 25.58,
     "avg": 30.62,
     "max": 36.08
    }
   },
   {
    "id": 4013,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 2,
     "min": 70.98,
     "avg": 73.77,
     "max": 76.56
    }
   },
   {
    "id": 4014,
    "name": "Tehničar za ugostiteljstvo / Tehničarka za ugostiteljstvo",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 13,
     "min": 39.51,
     "avg": 54.66,
     "max": 67.18
    }
   }
  ]
 },
 {
  "id": 2261,
  "name": "Privatna srednja škola Aspalathos Međunarodna škola",
  "city": "Dugopolje",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 3709,
    "name": "IBMYP program",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 1,
     "min": 77.09,
     "avg": 77.78,
     "max": 78.46
    }
   }
  ]
 },
 {
  "id": 303,
  "name": "Srednja škola Hvar",
  "city": "Hvar",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 4097,
    "name": "Agroturistički tehničar / Agroturistička tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 6,
     "min": 45.89,
     "avg": 50.65,
     "max": 57.32
    }
   },
   {
    "id": 4098,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 5,
     "min": 27.02,
     "avg": 27.82,
     "max": 30.04
    }
   },
   {
    "id": 4099,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 5,
     "min": 75.47,
     "avg": 77.38,
     "max": 80
    }
   },
   {
    "id": 4888,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 18,
     "upisani": 11,
     "min": 60.31,
     "avg": 69.3,
     "max": 81
    }
   },
   {
    "id": 4100,
    "name": "Slastičar/Slastičarka",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 3,
     "min": 29.89,
     "avg": 30.87,
     "max": 31.57
    }
   },
   {
    "id": 4101,
    "name": "Tehničar za ugostiteljstvo / Tehničarka za ugostiteljstvo",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 15,
     "upisani": 12,
     "min": 56.79,
     "avg": 61.93,
     "max": 73.79
    }
   },
   {
    "id": 4102,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 18,
     "upisani": 10,
     "min": 54.33,
     "avg": 59.72,
     "max": 64.31
    }
   }
  ]
 },
 {
  "id": 305,
  "name": "Ekonomska škola Imotski",
  "city": "Imotski",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 2841,
    "name": "Pomoćni administrator/Pomoćna administratorica",
    "sector": "Pravo, politologija, sociologija, državna uprava i javni poslovi",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 1,
     "min": 1.048,
     "avg": 48.82,
     "max": 48.82
    }
   },
   {
    "id": 4871,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 6,
     "min": 55.54,
     "avg": 65.32,
     "max": 72.84
    }
   },
   {
    "id": 2843,
    "name": "Tehničar za ugostiteljstvo / Tehničarka za ugostiteljstvo",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 50.16,
     "avg": 61.59,
     "max": 73.93
    }
   },
   {
    "id": 4872,
    "name": "Upravno-poslovni referent / Upravno-poslovna referentica",
    "sector": "Pravo, politologija, sociologija, državna uprava i javni poslovi",
    "prag": {
     "year": "2025/2026",
     "kvota": 44,
     "upisani": 33,
     "min": 37.97,
     "avg": 52.45,
     "max": 68.15
    }
   }
  ]
 },
 {
  "id": 1568,
  "name": "Gimnazija dr. Mate Ujevića",
  "city": "Imotski",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 2934,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 71,
     "upisani": 45,
     "min": 51.53,
     "avg": 69.55,
     "max": 79.92
    }
   },
   {
    "id": 2935,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 73.58,
     "avg": 77.14,
     "max": 81
    }
   }
  ]
 },
 {
  "id": 2210,
  "name": "Glazbena škola Dr. fra Ivan Glibotić - Imotski",
  "city": "Imotski",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 3086,
    "name": "Glazbenik - pripremno obrazovanje",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3087,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 15,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3088,
    "name": "Glazbenik klavirist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3089,
    "name": "Glazbenik trubač",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 231.88,
     "avg": 73.88,
     "max": 231.88
    }
   }
  ]
 },
 {
  "id": 304,
  "name": "Obrtničko-industrijska škola u Imotskom",
  "city": "Imotski",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 3583,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 18,
     "upisani": 11,
     "min": 22.84,
     "avg": 27.16,
     "max": 40.93
    }
   },
   {
    "id": 3584,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 29.17,
     "avg": 33.25,
     "max": 39.92
    }
   },
   {
    "id": 3585,
    "name": "Elektromehaničar/Elektromehaničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 3,
     "min": 25,
     "avg": 27.01,
     "max": 28.31
    }
   },
   {
    "id": 3586,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 29.13,
     "avg": 33.49,
     "max": 43.57
    }
   },
   {
    "id": 3587,
    "name": "Kozmetičar / Kozmetičarka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 13,
     "min": 36.99,
     "avg": 48.82,
     "max": 57.77
    }
   },
   {
    "id": 3588,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 8,
     "min": 21.94,
     "avg": 29.71,
     "max": 32.16
    }
   },
   {
    "id": 3589,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 18,
     "upisani": 6,
     "min": 26.72,
     "avg": 29.88,
     "max": 33.53
    }
   },
   {
    "id": 3590,
    "name": "Pomoćni kuhar/Pomoćna kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 3,
     "min": 1.027,
     "avg": 38.61,
     "max": 47.67
    }
   },
   {
    "id": 3591,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 2,
     "min": 1.026,
     "avg": 29.28,
     "max": 32.07
    }
   },
   {
    "id": 3592,
    "name": "Vozač motornog vozila/Vozačica motornog vozila",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 19,
     "min": 23.84,
     "avg": 26.16,
     "max": 30.23
    }
   }
  ]
 },
 {
  "id": 306,
  "name": "Tehnička škola u Imotskom",
  "city": "Imotski",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 4709,
    "name": "Medicinska sestra opće njege/medicinski tehničar opće njege",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 38.54,
     "avg": 60.22,
     "max": 80
    }
   },
   {
    "id": 4710,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 7,
     "min": 43.92,
     "avg": 56.66,
     "max": 72.39
    }
   },
   {
    "id": 4711,
    "name": "Tehničar za elektroniku i komunikacije / Tehničarka za elektroniku i komunikacije",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 41.9,
     "avg": 65.53,
     "max": 79.86
    }
   }
  ]
 },
 {
  "id": 2275,
  "name": "Srednja škola \"Braća Radić\", Kaštel Štafilić - Nehaj",
  "city": "Kaštel Novi",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 3920,
    "name": "Agroturistički tehničar / Agroturistička tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 16,
     "min": 35.55,
     "avg": 44.57,
     "max": 58.78
    }
   },
   {
    "id": 3921,
    "name": "Cvjećar/Cvjećarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 3,
     "min": 24.13,
     "avg": 31.36,
     "max": 45.23
    }
   },
   {
    "id": 3922,
    "name": "Mesar/Mesarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 5,
     "min": 22.57,
     "avg": 24.62,
     "max": 31.88
    }
   },
   {
    "id": 3923,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 41,
     "upisani": 22,
     "min": 41.02,
     "avg": 60.51,
     "max": 80
    }
   },
   {
    "id": 3924,
    "name": "Pekar-slastičar/Pekarica-slastičarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 5,
     "min": 24.88,
     "avg": 27.8,
     "max": 31.48
    }
   },
   {
    "id": 3925,
    "name": "Pomoćni cvjećar/Pomoćna cvjećarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 4,
     "upisani": 2,
     "min": 1.033,
     "avg": 38.92,
     "max": 45.3
    }
   },
   {
    "id": 3926,
    "name": "Pomoćni pekar/Pomoćna pekarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": 1,
     "min": 1.046,
     "avg": 46.23,
     "max": 46.23
    }
   },
   {
    "id": 3927,
    "name": "Pomoćni vrtlar/Pomoćna vrtlarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": 1,
     "min": 1.044,
     "avg": 44.56,
     "max": 44.56
    }
   },
   {
    "id": 3928,
    "name": "Tehničar nutricionist / Tehničarka nutricionistica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 37.6,
     "avg": 44.13,
     "max": 55.55
    }
   },
   {
    "id": 3929,
    "name": "Veterinarski tehničar / Veterinarska tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 23,
     "min": 44.52,
     "avg": 53.75,
     "max": 79.25
    }
   }
  ]
 },
 {
  "id": 1471,
  "name": "Glazbena škola Makarska",
  "city": "Makarska",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 3168,
    "name": "Glazbenik - pripremno obrazovanje",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3169,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   }
  ]
 },
 {
  "id": 309,
  "name": "Srednja strukovna škola Makarska",
  "city": "Makarska",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 4903,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 6,
     "min": 24.29,
     "avg": 28.15,
     "max": 33.53
    }
   },
   {
    "id": 4882,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 25.78,
     "avg": 32.1,
     "max": 43.25
    }
   },
   {
    "id": 3869,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 3,
     "min": 22.99,
     "avg": 25.23,
     "max": 27.15
    }
   },
   {
    "id": 3870,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 11,
     "upisani": 3,
     "min": 29.29,
     "avg": 27.02,
     "max": 29.29
    }
   },
   {
    "id": 4904,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 7,
     "min": 30.1,
     "avg": 30.73,
     "max": 33.33
    }
   },
   {
    "id": 3872,
    "name": "Pomoćni kuhar/Pomoćna kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 1,
     "min": 1.046,
     "avg": 46.65,
     "max": 46.65
    }
   },
   {
    "id": 3873,
    "name": "Tehničar za elektroniku i komunikacije / Tehničarka za elektroniku i komunikacije",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 15,
     "min": 36.23,
     "avg": 55.22,
     "max": 71.75
    }
   },
   {
    "id": 3874,
    "name": "Tehničar za ugostiteljstvo / Tehničarka za ugostiteljstvo",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 9,
     "min": 43.87,
     "avg": 54.72,
     "max": 63.97
    }
   }
  ]
 },
 {
  "id": 308,
  "name": "Srednja škola fra Andrije Kačića Miošića Makarska",
  "city": "Makarska",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 4914,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 28,
     "upisani": 28,
     "min": 74.17,
     "avg": 77.8,
     "max": 81
    }
   }
  ]
 },
 {
  "id": 2105,
  "name": "Srednja škola fra Andrije Kačića Miošića, Makarska",
  "city": "Makarska",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 4079,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 43,
     "min": 58.67,
     "avg": 68.93,
     "max": 75.2
    }
   },
   {
    "id": 4878,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 28,
     "upisani": 28,
     "min": 74.17,
     "avg": 77.79,
     "max": 81
    }
   },
   {
    "id": 4081,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 50.79,
     "avg": 61.6,
     "max": 76.54
    }
   },
   {
    "id": 4879,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 60.4,
     "avg": 67.4,
     "max": 78.57
    }
   }
  ]
 },
 {
  "id": 2286,
  "name": "Srednja škola Jure Kaštelan",
  "city": "Omiš",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 4167,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 11,
     "min": 29.14,
     "avg": 31.87,
     "max": 35.79
    }
   },
   {
    "id": 4168,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 20,
     "min": 42.94,
     "avg": 62.79,
     "max": 78.72
    }
   },
   {
    "id": 4169,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 6,
     "min": 23.71,
     "avg": 25.24,
     "max": 29.96
    }
   },
   {
    "id": 4170,
    "name": "Kozmetičar / Kozmetičarka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 56.75,
     "avg": 60.19,
     "max": 75.04
    }
   },
   {
    "id": 4171,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 15,
     "upisani": 14,
     "min": 24.78,
     "avg": 29.18,
     "max": 36.1
    }
   },
   {
    "id": 4172,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 27,
     "avg": 30.73,
     "max": 39.07
    }
   },
   {
    "id": 4173,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 28,
     "upisani": 26,
     "min": 70.83,
     "avg": 75.73,
     "max": 81.71
    }
   },
   {
    "id": 4174,
    "name": "Pomoćni konobar/Pomoćna konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 1,
     "min": 1.044,
     "avg": 44.19,
     "max": 44.19
    }
   },
   {
    "id": 4175,
    "name": "Tehničar za elektroniku i komunikacije / Tehničarka za elektroniku i komunikacije",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 25,
     "min": 55.09,
     "avg": 63.23,
     "max": 77.39
    }
   },
   {
    "id": 4176,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 18,
     "upisani": 18,
     "min": 56.28,
     "avg": 63.93,
     "max": 73.66
    }
   }
  ]
 },
 {
  "id": 327,
  "name": "Klesarska škola Pučišća",
  "city": "Pučišća",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 3436,
    "name": "Klesar/Klesarica",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 5,
     "min": 23.05,
     "avg": 29.17,
     "max": 37.56
    }
   },
   {
    "id": 3437,
    "name": "Klesarski tehničar / Klesarska tehničarka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 8,
     "min": 47.56,
     "avg": 54.08,
     "max": 64.79
    }
   }
  ]
 },
 {
  "id": 2197,
  "name": "Franjevačka klasična gimnazija i strukovna škola u Sinju s pravom javnosti",
  "city": "Sinj",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 2906,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 8,
     "min": 43.69,
     "avg": 54.36,
     "max": 67.49
    }
   },
   {
    "id": 2907,
    "name": "Medicinska sestra opće njege/medicinski tehničar opće njege",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 6,
     "min": 50.34,
     "avg": 52.84,
     "max": 57.45
    }
   }
  ]
 },
 {
  "id": 312,
  "name": "Gimnazija Dinka Šimunovića u Sinju",
  "city": "Sinj",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 2932,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 72,
     "upisani": 61,
     "min": 62.73,
     "avg": 73.82,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 2213,
  "name": "Glazbena škola Jakova Gotovca",
  "city": "Sinj",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 3130,
    "name": "Glazbenik - pripremno obrazovanje",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3131,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3132,
    "name": "Glazbenik flautist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 184.67,
     "avg": 69.67,
     "max": 184.67
    }
   },
   {
    "id": 3133,
    "name": "Glazbenik klavirist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 238,
     "avg": 90,
     "max": 238
    }
   }
  ]
 },
 {
  "id": 2270,
  "name": "Srednja strukovna škola bana Josipa Jelačića",
  "city": "Sinj",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 3797,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 13,
     "min": 27.32,
     "avg": 29.52,
     "max": 35.27
    }
   },
   {
    "id": 3798,
    "name": "Komercijalist / Komercijalistica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 44,
     "upisani": 44,
     "min": 37.54,
     "avg": 46.96,
     "max": 58.71
    }
   },
   {
    "id": 3799,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 12,
     "min": 23.23,
     "avg": 23.92,
     "max": 24.92
    }
   },
   {
    "id": 3800,
    "name": "Kozmetičar / Kozmetičarka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 43.92,
     "avg": 50.21,
     "max": 65.72
    }
   },
   {
    "id": 3801,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 13,
     "min": 24.68,
     "avg": 29.11,
     "max": 38.79
    }
   },
   {
    "id": 3802,
    "name": "Medicinska sestra opće njege/medicinski tehničar opće njege",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 27,
     "upisani": 27,
     "min": 52.85,
     "avg": 64.22,
     "max": 78.2
    }
   },
   {
    "id": 3803,
    "name": "Pomoćni administrator/Pomoćna administratorica",
    "sector": "Pravo, politologija, sociologija, državna uprava i javni poslovi",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 2,
     "min": 1.035,
     "avg": 37.51,
     "max": 39.49
    }
   },
   {
    "id": 3804,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 13,
     "min": 22.71,
     "avg": 24.07,
     "max": 27.14
    }
   },
   {
    "id": 3805,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 22,
     "min": 59.53,
     "avg": 68.05,
     "max": 79.93
    }
   },
   {
    "id": 3806,
    "name": "Tehničar za ugostiteljstvo / Tehničarka za ugostiteljstvo",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 55.02,
     "avg": 62.52,
     "max": 73.67
    }
   }
  ]
 },
 {
  "id": 313,
  "name": "Tehnička i industrijska škola Ruđera Boškovića u Sinju",
  "city": "Sinj",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 4612,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 25.44,
     "avg": 28.67,
     "max": 36.36
    }
   },
   {
    "id": 4613,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 7,
     "min": 34.89,
     "avg": 37.21,
     "max": 42.87
    }
   },
   {
    "id": 4614,
    "name": "Elektromehaničar/Elektromehaničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 6,
     "min": 25.02,
     "avg": 26.88,
     "max": 30.49
    }
   },
   {
    "id": 4615,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 28.96,
     "avg": 31.16,
     "max": 36.75
    }
   },
   {
    "id": 4616,
    "name": "Stolar/Stolarica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 24.44,
     "avg": 24.47,
     "max": 25.4
    }
   },
   {
    "id": 4617,
    "name": "Tehničar cestovnog prometa / Tehničarka cestovnog prometa",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 22,
     "min": 49.85,
     "avg": 55.36,
     "max": 69.29
    }
   },
   {
    "id": 4618,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 23,
     "min": 56.58,
     "avg": 62.12,
     "max": 68.02
    }
   },
   {
    "id": 4619,
    "name": "Tehničar za električne strojeve i elektroenergetiku / Tehničarka za električne strojeve i elektroenergetiku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 22,
     "min": 68.21,
     "avg": 73.96,
     "max": 80
    }
   },
   {
    "id": 4620,
    "name": "Vozač motornog vozila/Vozačica motornog vozila",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 24.69,
     "avg": 28.26,
     "max": 35.58
    }
   }
  ]
 },
 {
  "id": 325,
  "name": "Centar za odgoj i obrazovanje JURAJ BONAČI",
  "city": "Split",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 2736,
    "name": "Pomoćni grafički radnik dorade/Pomoćna grafička radnica dorade",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": 0,
     "min": 1.042,
     "avg": 42.32,
     "max": 42.32
    }
   },
   {
    "id": 2737,
    "name": "Pomoćni kuhar/Pomoćna kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 2738,
    "name": "Pomoćni radnik za uređenje interijera/Pomoćna radnica za uređenje interijera",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": 0,
     "min": 1.039,
     "avg": 39.26,
     "max": 39.26
    }
   }
  ]
 },
 {
  "id": 2188,
  "name": "Ekonomska i upravna škola Split",
  "city": "Split",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 2818,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 96,
     "upisani": 96,
     "min": 46.59,
     "avg": 56.89,
     "max": 66.66
    }
   },
   {
    "id": 2819,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju (odjel za sportaše) (060500-S)",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 23,
     "min": 99.2,
     "avg": 58.52,
     "max": 131.71
    }
   },
   {
    "id": 2820,
    "name": "Upravno-poslovni referent / Upravno-poslovna referentica",
    "sector": "Pravo, politologija, sociologija, državna uprava i javni poslovi",
    "prag": {
     "year": "2025/2026",
     "kvota": 92,
     "upisani": 91,
     "min": 47.27,
     "avg": 56.35,
     "max": 75.41
    }
   }
  ]
 },
 {
  "id": 81,
  "name": "Elektrotehnička škola - Split",
  "city": "Split",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 2899,
    "name": "Tehničar za električne strojeve i elektroenergetiku / Tehničarka za električne strojeve i elektroenergetiku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 48,
     "upisani": 48,
     "min": 64.71,
     "avg": 68.47,
     "max": 75.06
    }
   },
   {
    "id": 2900,
    "name": "Tehničar za elektroniku i komunikacije / Tehničarka za elektroniku i komunikacije",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 69.32,
     "avg": 73.79,
     "max": 80
    }
   },
   {
    "id": 2901,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 48,
     "upisani": 48,
     "min": 67.81,
     "avg": 73.21,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 2207,
  "name": "Gimnazijski kolegij Kraljica Jelena s pravom javnosti",
  "city": "Split",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 3011,
    "name": "Hrvatsko-europska gimnazija s usmjerenjima",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 17,
     "min": 45.49,
     "avg": 59.11,
     "max": 71.1
    }
   }
  ]
 },
 {
  "id": 1916,
  "name": "Glazbena škola Josipa Hatzea",
  "city": "Split",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 3141,
    "name": "Glazbenik - pripremno obrazovanje",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3142,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 44,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3143,
    "name": "Glazbenik - teorijski smjer",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": 1,
     "min": 216.52,
     "avg": 73.52,
     "max": 216.52
    }
   },
   {
    "id": 3144,
    "name": "Glazbenik flautist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 210.88,
     "avg": 75.88,
     "max": 210.88
    }
   },
   {
    "id": 3145,
    "name": "Glazbenik klavirist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": 2,
     "min": 211,
     "avg": 80.15,
     "max": 239.29
    }
   },
   {
    "id": 3146,
    "name": "Glazbenik pjevač",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 216.18,
     "avg": 76.18,
     "max": 216.18
    }
   },
   {
    "id": 3147,
    "name": "Glazbenik violinist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 231.05,
     "avg": 73.05,
     "max": 231.05
    }
   },
   {
    "id": 3148,
    "name": "Plesač klasičnog baleta",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": 1,
     "min": 197.14,
     "avg": 83.84,
     "max": 197.14
    }
   }
  ]
 },
 {
  "id": 1528,
  "name": "Graditeljsko-geodetska tehnička škola",
  "city": "Split",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 3312,
    "name": "Arhitektonski tehničar / Arhitektonska tehničarka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 46,
     "upisani": 46,
     "min": 72.69,
     "avg": 75.32,
     "max": 80
    }
   },
   {
    "id": 3313,
    "name": "Građevinski tehničar / Građevinska tehničarka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 49,
     "min": 65.75,
     "avg": 68.8,
     "max": 77.74
    }
   },
   {
    "id": 3314,
    "name": "Tehničar geodezije i geoinformatike / Tehničarka geodezije i geoinformatike",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 23,
     "min": 67.96,
     "avg": 71.21,
     "max": 79.76
    }
   }
  ]
 },
 {
  "id": 84,
  "name": "I. gimnazija Split",
  "city": "Split",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 3333,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 130,
     "upisani": 130,
     "min": 68.54,
     "avg": 73.06,
     "max": 80
    }
   },
   {
    "id": 3334,
    "name": "Klasična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 27,
     "min": 59.28,
     "avg": 62.97,
     "max": 75.66
    }
   }
  ]
 },
 {
  "id": 1984,
  "name": "II. gimnazija",
  "city": "Split",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 3341,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 155,
     "upisani": 155,
     "min": 63.96,
     "avg": 69.09,
     "max": 80.92
    }
   }
  ]
 },
 {
  "id": 80,
  "name": "III. gimnazija Split",
  "city": "Split",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 4881,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 156,
     "upisani": 156,
     "min": 65.36,
     "avg": 76.25,
     "max": 82
    }
   }
  ]
 },
 {
  "id": 2227,
  "name": "Industrijska škola",
  "city": "Split",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 3350,
    "name": "Brodograditelj/Brodograditeljica",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 13,
     "min": 24.19,
     "avg": 27.68,
     "max": 36.57
    }
   },
   {
    "id": 3351,
    "name": "Elektromehaničar/Elektromehaničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 14,
     "min": 23.88,
     "avg": 25.72,
     "max": 30.06
    }
   },
   {
    "id": 3352,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 14,
     "min": 28.84,
     "avg": 29.58,
     "max": 37.59
    }
   },
   {
    "id": 3353,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 14,
     "min": 25.65,
     "avg": 30.49,
     "max": 43.19
    }
   }
  ]
 },
 {
  "id": 1479,
  "name": "IV. gimnazija Marko Marulić",
  "city": "Split",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 3419,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 154,
     "upisani": 154,
     "min": 72.68,
     "avg": 76.13,
     "max": 80.85
    }
   }
  ]
 },
 {
  "id": 89,
  "name": "Komercijalno-trgovačka škola Split",
  "city": "Split",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 3440,
    "name": "Administrator (prilagođeni program)",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 1,
     "min": 1.019,
     "avg": 19.52,
     "max": 19.52
    }
   },
   {
    "id": 3441,
    "name": "Komercijalist / Komercijalistica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 60,
     "upisani": 58,
     "min": 46.03,
     "avg": 52.61,
     "max": 75.54
    }
   },
   {
    "id": 3442,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 26.21,
     "avg": 29.18,
     "max": 39.73
    }
   }
  ]
 },
 {
  "id": 2237,
  "name": "Nadbiskupijska klasična gimnazija Don Frane Bulić - s pravom javnosti",
  "city": "Split",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 3485,
    "name": "Klasična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 47,
     "upisani": 36,
     "min": 42.58,
     "avg": 59.21,
     "max": 78.71
    }
   }
  ]
 },
 {
  "id": 2239,
  "name": "Obrtna tehnička škola",
  "city": "Split",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 3487,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 47,
     "upisani": 47,
     "min": 27.2,
     "avg": 30.85,
     "max": 41.32
    }
   },
   {
    "id": 3488,
    "name": "Drvodjeljski tehničar i dizajner / Drvodjeljska tehničarka i dizajnerica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 19,
     "min": 45.9,
     "avg": 55.62,
     "max": 62.04
    }
   },
   {
    "id": 3489,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 23,
     "min": 28.74,
     "avg": 32.2,
     "max": 45.22
    }
   },
   {
    "id": 3490,
    "name": "Elektromehaničar/Elektromehaničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 28.26,
     "avg": 32.23,
     "max": 41.88
    }
   },
   {
    "id": 3491,
    "name": "Elektroničar/Elektroničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 25.16,
     "avg": 28.61,
     "max": 34.7
    }
   },
   {
    "id": 3492,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 31,
     "upisani": 30,
     "min": 29.9,
     "avg": 33.37,
     "max": 40.91
    }
   },
   {
    "id": 3493,
    "name": "Pomoćni stolar/Pomoćna stolarica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 2,
     "min": 1.036,
     "avg": 43.08,
     "max": 49.64
    }
   },
   {
    "id": 3494,
    "name": "Serviser karoserije motornih vozila/Serviserka karoserije motornih vozila",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 26.1,
     "avg": 27.94,
     "max": 32.38
    }
   },
   {
    "id": 3495,
    "name": "Stolar/Stolarica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 21,
     "min": 24.08,
     "avg": 29.39,
     "max": 38.23
    }
   },
   {
    "id": 3496,
    "name": "Tehničar za električne strojeve i elektroenergetiku / Tehničarka za električne strojeve i elektroenergetiku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 61.85,
     "avg": 63.91,
     "max": 69.51
    }
   },
   {
    "id": 3497,
    "name": "Tehničar za vozila / Tehničarka za vozila",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 23,
     "min": 50.01,
     "avg": 54.89,
     "max": 62.28
    }
   }
  ]
 },
 {
  "id": 91,
  "name": "Obrtnička škola Split",
  "city": "Split",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 3570,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 59,
     "upisani": 59,
     "min": 30.81,
     "avg": 34.37,
     "max": 42.38
    }
   },
   {
    "id": 3571,
    "name": "Kozmetičar / Kozmetičarka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 40,
     "upisani": 40,
     "min": 61.09,
     "avg": 64.12,
     "max": 72.61
    }
   },
   {
    "id": 3576,
    "name": "Modni tehničar / Modna tehničarka",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 53.13,
     "avg": 57.88,
     "max": 67.64
    }
   }
  ]
 },
 {
  "id": 321,
  "name": "Pomorska škola Split",
  "city": "Split",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 3650,
    "name": "Pomorski nautičar / Pomorska nautičarka",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 72,
     "upisani": 71,
     "min": 50.38,
     "avg": 59.33,
     "max": 80
    }
   },
   {
    "id": 3652,
    "name": "Tehničar prometne logistike / Tehničarka prometne logistike",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 18,
     "upisani": 18,
     "min": 44.15,
     "avg": 48.09,
     "max": 58.34
    }
   },
   {
    "id": 3651,
    "name": "Tehničar za brodostrojarstvo / Tehničarka za brodostrojarstvo",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 48,
     "upisani": 48,
     "min": 46.47,
     "avg": 53.32,
     "max": 68.28
    }
   },
   {
    "id": 3653,
    "name": "Tehničar za marine i jahte / Tehničarka za marine i jahte",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 21,
     "upisani": 21,
     "min": 48.34,
     "avg": 50.6,
     "max": 54.91
    }
   }
  ]
 },
 {
  "id": 93,
  "name": "Prirodoslovna škola Split",
  "city": "Split",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 3673,
    "name": "Hidrometeorološki tehničar / Hidrometeorološka tehničarka",
    "sector": "Temeljne prirodne znanosti",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 54.89,
     "avg": 59.96,
     "max": 69.62
    }
   },
   {
    "id": 3674,
    "name": "Kemijski tehničar / Kemijska tehničarka",
    "sector": "Geologija, rudarstvo, nafta i kemijska tehnologija",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 59.35,
     "avg": 64.54,
     "max": 73.98
    }
   },
   {
    "id": 3675,
    "name": "Prehrambeni tehničar / Prehrambena tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 56.36,
     "avg": 59.03,
     "max": 66.05
    }
   },
   {
    "id": 3676,
    "name": "Prirodoslovna gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 78,
     "upisani": 79,
     "min": 67.24,
     "avg": 76.81,
     "max": 81
    }
   }
  ]
 },
 {
  "id": 2257,
  "name": "Privatna jezična gimnazija Pitagora, srednja škola s pravom javnosti",
  "city": "Split",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 3703,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3704,
    "name": "Tehničar za računalstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   }
  ]
 },
 {
  "id": 2262,
  "name": "Privatna srednja škola Marko Antun de Dominis, s pravom javnosti",
  "city": "Split",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 3710,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 11,
     "min": 50.4,
     "avg": 60.84,
     "max": 72.88
    }
   },
   {
    "id": 3711,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 13,
     "min": 48.64,
     "avg": 57.4,
     "max": 65.35
    }
   },
   {
    "id": 3712,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 16,
     "min": 49.55,
     "avg": 57.72,
     "max": 71.43
    }
   }
  ]
 },
 {
  "id": 2263,
  "name": "Privatna srednja škola Wallner",
  "city": "Split",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 3713,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 1,
     "min": 22.89,
     "avg": 22.89,
     "max": 22.89
    }
   },
   {
    "id": 3714,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 9,
     "min": 24.04,
     "avg": 28.02,
     "max": 34.6
    }
   },
   {
    "id": 3715,
    "name": "Slastičar/Slastičarka",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 1,
     "min": 28.86,
     "avg": 28.86,
     "max": 28.86
    }
   },
   {
    "id": 3716,
    "name": "Tehničar za ugostiteljstvo / Tehničarka za ugostiteljstvo",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 12,
     "min": 43.1,
     "avg": 56.22,
     "max": 62.08
    }
   }
  ]
 },
 {
  "id": 2282,
  "name": "Srednja škola Dental centar Marušić",
  "city": "Split",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 4044,
    "name": "Dentalni tehničar/Dentalna tehničarka",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 24,
     "min": 40.14,
     "avg": 56.14,
     "max": 76.52
    }
   },
   {
    "id": 4045,
    "name": "Fizioterapeutski tehničar / fizioterapeutska tehničarka",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 21,
     "upisani": 19,
     "min": 43.04,
     "avg": 53.1,
     "max": 66.38
    }
   }
  ]
 },
 {
  "id": 2295,
  "name": "Srednja tehnička prometna škola",
  "city": "Split",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 4413,
    "name": "Tehničar cestovnog prometa / Tehničarka cestovnog prometa",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 45.42,
     "avg": 50.21,
     "max": 58.02
    }
   },
   {
    "id": 4414,
    "name": "Tehničar za poštu i poštansku logistiku  / Tehničarka za poštu i poštansku logistiku",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 21,
     "upisani": 21,
     "min": 41.27,
     "avg": 44.23,
     "max": 54.95
    }
   },
   {
    "id": 4415,
    "name": "Tehničar za zračni promet / Tehničarka za zračni promet",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 23,
     "min": 49.76,
     "avg": 56.16,
     "max": 71.33
    }
   },
   {
    "id": 4416,
    "name": "Vozač motornog vozila/Vozačica motornog vozila",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 70,
     "upisani": 64,
     "min": 23.85,
     "avg": 25.79,
     "max": 32.66
    }
   }
  ]
 },
 {
  "id": 1468,
  "name": "Škola likovnih umjetnosti",
  "city": "Split",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 4523,
    "name": "Likovna umjetnost i dizajn do izbora zanimanja",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 51,
     "upisani": 51,
     "min": 147.26,
     "avg": 58.97,
     "max": 193.77
    }
   }
  ]
 },
 {
  "id": 2306,
  "name": "Škola za dizajn, grafiku i održivu gradnju",
  "city": "Split",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 4533,
    "name": "Dizajner grafičkih proizvoda / Dizajnerica grafičkih proizvoda",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 61.12,
     "avg": 64.37,
     "max": 74.47
    }
   },
   {
    "id": 4534,
    "name": "Građevinski radnik u održivoj gradnji/Građevinska radnica u održivoj gradnji",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 7,
     "min": 24.72,
     "avg": 25.62,
     "max": 26.92
    }
   },
   {
    "id": 4535,
    "name": "Građevinski radnik u zgradarstvu/Građevinska radnica u zgradarstvu",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 7,
     "min": 23.37,
     "avg": 26.11,
     "max": 36.82
    }
   },
   {
    "id": 4536,
    "name": "Grafički tehničar dorade / Grafička tehničarka dorade",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 11,
     "upisani": 11,
     "min": 51.2,
     "avg": 54.42,
     "max": 58.76
    }
   },
   {
    "id": 4537,
    "name": "Grafički tehničar tiska / Grafička tehničarka tiska",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 9,
     "min": 52.64,
     "avg": 56.88,
     "max": 61.7
    }
   },
   {
    "id": 4538,
    "name": "Likovna umjetnost i dizajn do izbora zanimanja",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 46,
     "upisani": 46,
     "min": 136.17,
     "avg": 61.52,
     "max": 183.69
    }
   },
   {
    "id": 4539,
    "name": "Medijski tehničar / Medijska tehničarka",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 63.67,
     "avg": 68.99,
     "max": 79.13
    }
   },
   {
    "id": 4540,
    "name": "Oblagač podova i zidova/Oblagačica podova i zidova",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 29.58,
     "avg": 32.74,
     "max": 44.8
    }
   },
   {
    "id": 4541,
    "name": "Rukovatelj građevinskim strojevima/Rukovateljica građevinskim strojevima",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 7,
     "min": 24.17,
     "avg": 25.6,
     "max": 28.06
    }
   },
   {
    "id": 4542,
    "name": "Soboslikar ličilac dekorater/Soboslikarica ličiteljica dekoraterka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 7,
     "min": 26.4,
     "avg": 27.5,
     "max": 34.55
    }
   },
   {
    "id": 4543,
    "name": "Tehničar za programiranje / Tehničarka za programiranje",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 62.69,
     "avg": 66.39,
     "max": 76.27
    }
   },
   {
    "id": 4544,
    "name": "Tehničar za razvoj i dizajn web sučelja / Tehničarka za razvoj i dizajn web sučelja",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 19,
     "min": 63.85,
     "avg": 66.4,
     "max": 75.08
    }
   }
  ]
 },
 {
  "id": 2324,
  "name": "Tehnička škola za strojarstvo i mehatroniku",
  "city": "Split",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 4720,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 70,
     "upisani": 69,
     "min": 51.25,
     "avg": 57.95,
     "max": 80
    }
   },
   {
    "id": 4721,
    "name": "Tehničar za mehatroniku / Tehničarka za mehatroniku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 63.45,
     "avg": 66.59,
     "max": 74.34
    }
   }
  ]
 },
 {
  "id": 2328,
  "name": "Turističko-ugostiteljska škola",
  "city": "Split",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 4781,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 19,
     "min": 25.93,
     "avg": 28.27,
     "max": 35.08
    }
   },
   {
    "id": 4782,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 50,
     "upisani": 51,
     "min": 28.95,
     "avg": 33.53,
     "max": 45.28
    }
   },
   {
    "id": 4783,
    "name": "Pomoćni konobar/Pomoćna konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": 1,
     "min": 1.04,
     "avg": 40.49,
     "max": 40.49
    }
   },
   {
    "id": 4784,
    "name": "Pomoćni kuhar/Pomoćna kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 3,
     "min": 1.033,
     "avg": 39.56,
     "max": 44.45
    }
   },
   {
    "id": 4785,
    "name": "Slastičar/Slastičarka",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 30.96,
     "avg": 34.52,
     "max": 45.09
    }
   },
   {
    "id": 4786,
    "name": "Tehničar za ugostiteljstvo / Tehničarka za ugostiteljstvo",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 65.09,
     "avg": 66.46,
     "max": 71.5
    }
   },
   {
    "id": 4787,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 72,
     "upisani": 72,
     "min": 66.27,
     "avg": 70.34,
     "max": 79.84
    }
   }
  ]
 },
 {
  "id": 95,
  "name": "V. gimnazija Vladimir Nazor Split",
  "city": "Split",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 4824,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 130,
     "upisani": 130,
     "min": 76.13,
     "avg": 78.96,
     "max": 82
    }
   },
   {
    "id": 4825,
    "name": "Opća gimnazija (odjel za sportaše) (320104-S)",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 131.3,
     "avg": 74.91,
     "max": 153.19
    }
   }
  ]
 },
 {
  "id": 2336,
  "name": "Zdravstvena škola",
  "city": "Split",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 4849,
    "name": "Dentalna asistentica/asistent",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 63.86,
     "avg": 66.26,
     "max": 71.13
    }
   },
   {
    "id": 4850,
    "name": "Farmaceutski tehničar",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 71.97,
     "avg": 76.59,
     "max": 80.92
    }
   },
   {
    "id": 4851,
    "name": "Fizioterapeutski tehničar / fizioterapeutska tehničarka",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 69.57,
     "avg": 74.02,
     "max": 80
    }
   },
   {
    "id": 4852,
    "name": "Medicinska sestra opće njege/medicinski tehničar opće njege",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 77,
     "upisani": 77,
     "min": 60.08,
     "avg": 65.64,
     "max": 77.41
    }
   },
   {
    "id": 4853,
    "name": "Sanitarni tehničar",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 56.73,
     "avg": 59.82,
     "max": 64.48
    }
   },
   {
    "id": 4854,
    "name": "Zdravstveno-laboratorijski tehničar",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 66.94,
     "avg": 70.78,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 1337,
  "name": "Srednja škola Brač",
  "city": "Supetar",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 4015,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 1,
     "min": 22.9,
     "avg": 22.9,
     "max": 22.9
    }
   },
   {
    "id": 4016,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 6,
     "min": 22.92,
     "avg": 27.89,
     "max": 39.02
    }
   },
   {
    "id": 4017,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 3,
     "min": 29.67,
     "avg": 27.92,
     "max": 29.67
    }
   },
   {
    "id": 4018,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 10,
     "min": 57.39,
     "avg": 69.14,
     "max": 78.92
    }
   },
   {
    "id": 4019,
    "name": "Pomoćni ugostitelj / Pomoćna ugostiteljica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 1,
     "min": 1.045,
     "avg": 45.8,
     "max": 45.8
    }
   },
   {
    "id": 4020,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 17,
     "min": 37.26,
     "avg": 51.9,
     "max": 73.06
    }
   }
  ]
 },
 {
  "id": 1824,
  "name": "Srednja strukovna škola Blaž Jurjev Trogiranin",
  "city": "Trogir",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 3807,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 28.04,
     "avg": 30.06,
     "max": 38.27
    }
   },
   {
    "id": 3808,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 11,
     "upisani": 6,
     "min": 22.99,
     "avg": 28.9,
     "max": 39.19
    }
   },
   {
    "id": 3809,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 25,
     "upisani": 25,
     "min": 24.9,
     "avg": 27.68,
     "max": 38.09
    }
   },
   {
    "id": 3810,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 16,
     "min": 28.32,
     "avg": 32.75,
     "max": 41.58
    }
   },
   {
    "id": 3811,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 44.35,
     "avg": 50.31,
     "max": 58.33
    }
   },
   {
    "id": 3812,
    "name": "Tehničar za električne strojeve i elektroenergetiku / Tehničarka za električne strojeve i elektroenergetiku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 22,
     "min": 54.81,
     "avg": 65.77,
     "max": 80
    }
   },
   {
    "id": 3813,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 48,
     "upisani": 48,
     "min": 58.25,
     "avg": 63.76,
     "max": 79.49
    }
   }
  ]
 },
 {
  "id": 315,
  "name": "Srednja škola Ivana Lucića - Trogir",
  "city": "Trogir",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 4135,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 19,
     "min": 46.39,
     "avg": 56.43,
     "max": 72.66
    }
   },
   {
    "id": 4136,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 48,
     "upisani": 48,
     "min": 55.34,
     "avg": 70.67,
     "max": 80
    }
   },
   {
    "id": 4137,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 21,
     "min": 49.9,
     "avg": 61.11,
     "max": 69.77
    }
   }
  ]
 },
 {
  "id": 2280,
  "name": "Srednja škola Antun Matijašević - Karamaneo",
  "city": "Vis",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 3965,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 1,
     "min": 78.49,
     "avg": 78.49,
     "max": 78.49
    }
   },
   {
    "id": 3966,
    "name": "Pomoćni kuhar/Pomoćna kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 1,
     "min": 1.049,
     "avg": 49.65,
     "max": 49.65
    }
   },
   {
    "id": 3967,
    "name": "Tehničar za ugostiteljstvo / Tehničarka za ugostiteljstvo",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 7,
     "min": 45.16,
     "avg": 53.92,
     "max": 60.85
    }
   },
   {
    "id": 3968,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 2,
     "min": 63.54,
     "avg": 70.88,
     "max": 78.21
    }
   }
  ]
 },
 {
  "id": 318,
  "name": "Srednja škola Tina Ujevića Vrgorac",
  "city": "Vrgorac",
  "county": "Splitsko-dalmatinska",
  "programs": [
   {
    "id": 4351,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 7,
     "min": 22.81,
     "avg": 27.35,
     "max": 37.79
    }
   },
   {
    "id": 4352,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 2,
     "min": 22.9,
     "avg": 27.86,
     "max": 32.81
    }
   },
   {
    "id": 4353,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 13,
     "min": 22.59,
     "avg": 26.16,
     "max": 32.96
    }
   },
   {
    "id": 4348,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 13,
     "min": 40.16,
     "avg": 65.68,
     "max": 80
    }
   },
   {
    "id": 4354,
    "name": "Pomoćni kuhar/Pomoćna kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 4350,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 12,
     "min": 39.24,
     "avg": 56.29,
     "max": 71.38
    }
   }
  ]
 },
 {
  "id": 276,
  "name": "Srednja škola Ivana Meštrovića Drniš",
  "city": "Drniš",
  "county": "Šibensko-kninska",
  "programs": [
   {
    "id": 4138,
    "name": "Administrator (prilagođeni program)",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 1,
     "min": 1.013,
     "avg": 13.19,
     "max": 13.19
    }
   },
   {
    "id": 4139,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 9,
     "min": 24.21,
     "avg": 29.22,
     "max": 34.75
    }
   },
   {
    "id": 4140,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 4,
     "min": 21.5,
     "avg": 24.6,
     "max": 29.66
    }
   },
   {
    "id": 4141,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 18,
     "upisani": 11,
     "min": 42.33,
     "avg": 66.51,
     "max": 80
    }
   },
   {
    "id": 4142,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 18,
     "upisani": 11,
     "min": 39.45,
     "avg": 53.41,
     "max": 71.58
    }
   },
   {
    "id": 4143,
    "name": "Tehničar za električne strojeve i elektroenergetiku / Tehničarka za električne strojeve i elektroenergetiku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 18,
     "upisani": 8,
     "min": 46.29,
     "avg": 61.73,
     "max": 76.57
    }
   }
  ]
 },
 {
  "id": 2271,
  "name": "Srednja strukovna škola kralja Zvonimira",
  "city": "Knin",
  "county": "Šibensko-kninska",
  "programs": [
   {
    "id": 3814,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 6,
     "min": 25.16,
     "avg": 26.43,
     "max": 31.19
    }
   },
   {
    "id": 3815,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 6,
     "min": 26.21,
     "avg": 27.38,
     "max": 30.18
    }
   },
   {
    "id": 3816,
    "name": "Elektromehaničar/Elektromehaničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 6,
     "min": 24.32,
     "avg": 25.74,
     "max": 27.73
    }
   },
   {
    "id": 3817,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 30.5,
     "avg": 32.3,
     "max": 37.4
    }
   },
   {
    "id": 3818,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 3,
     "min": 21.97,
     "avg": 23.11,
     "max": 23.95
    }
   },
   {
    "id": 3819,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 6,
     "min": 23.67,
     "avg": 26.08,
     "max": 31.33
    }
   },
   {
    "id": 3820,
    "name": "Pomoćni kuhar/Pomoćna kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3821,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 9,
     "min": 43.98,
     "avg": 55.39,
     "max": 78.5
    }
   },
   {
    "id": 3822,
    "name": "Tehničar za elektroniku i komunikacije / Tehničarka za elektroniku i komunikacije",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 13,
     "min": 40.08,
     "avg": 56.33,
     "max": 77.05
    }
   }
  ]
 },
 {
  "id": 2288,
  "name": "Srednja škola Lovre Montija",
  "city": "Knin",
  "county": "Šibensko-kninska",
  "programs": [
   {
    "id": 4215,
    "name": "Agrotehničar / Agrotehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 14,
     "min": 36.79,
     "avg": 42.9,
     "max": 56.57
    }
   },
   {
    "id": 4216,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 15,
     "upisani": 11,
     "min": 50.3,
     "avg": 63.42,
     "max": 71.61
    }
   },
   {
    "id": 4217,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 16,
     "min": 62.46,
     "avg": 76.26,
     "max": 80
    }
   },
   {
    "id": 4218,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 16,
     "min": 44.03,
     "avg": 57.34,
     "max": 73.99
    }
   }
  ]
 },
 {
  "id": 279,
  "name": "CENTAR ZA ODGOJ I OBRAZOVANJE ŠUBIĆEVAC",
  "city": "Šibenik",
  "county": "Šibensko-kninska",
  "programs": [
   {
    "id": 2747,
    "name": "Pomoćni administrator/Pomoćna administratorica",
    "sector": "Pravo, politologija, sociologija, državna uprava i javni poslovi",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": 2,
     "min": 1.047,
     "avg": 47.75,
     "max": 47.9
    }
   },
   {
    "id": 2748,
    "name": "Pomoćni kuhar/Pomoćna kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 4,
     "upisani": 1,
     "min": 1.045,
     "avg": 45.61,
     "max": 45.61
    }
   },
   {
    "id": 2749,
    "name": "Pomoćni vrtlar/Pomoćna vrtlarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 4,
     "upisani": 1,
     "min": 1.043,
     "avg": 43.36,
     "max": 43.36
    }
   }
  ]
 },
 {
  "id": 280,
  "name": "Ekonomska škola Šibenik",
  "city": "Šibenik",
  "county": "Šibensko-kninska",
  "programs": [
   {
    "id": 2835,
    "name": "Administrator (prilagođeni program)",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 5,
     "min": 1.011,
     "avg": 14.6,
     "max": 19.84
    }
   },
   {
    "id": 2836,
    "name": "Komercijalist / Komercijalistica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 21,
     "upisani": 21,
     "min": 51.13,
     "avg": 55.94,
     "max": 69.55
    }
   },
   {
    "id": 2837,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 22,
     "min": 54.84,
     "avg": 61.25,
     "max": 75.07
    }
   },
   {
    "id": 2838,
    "name": "Upravno-poslovni referent / Upravno-poslovna referentica",
    "sector": "Pravo, politologija, sociologija, državna uprava i javni poslovi",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 50.69,
     "avg": 59.64,
     "max": 79.85
    }
   }
  ]
 },
 {
  "id": 2202,
  "name": "Gimnazija Antuna Vrančića",
  "city": "Šibenik",
  "county": "Šibensko-kninska",
  "programs": [
   {
    "id": 2920,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 38,
     "upisani": 27,
     "min": 60.52,
     "avg": 71.42,
     "max": 80
    }
   },
   {
    "id": 2921,
    "name": "Klasična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 5,
     "min": 60.34,
     "avg": 64.64,
     "max": 73.55
    }
   },
   {
    "id": 2922,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 51,
     "min": 61.62,
     "avg": 72.97,
     "max": 83
    }
   },
   {
    "id": 2923,
    "name": "Prirodoslovna gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 62.55,
     "avg": 75.54,
     "max": 80
    }
   },
   {
    "id": 2924,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 15,
     "min": 66.15,
     "avg": 74.53,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 2052,
  "name": "Glazbena škola Ivana Lukačića",
  "city": "Šibenik",
  "county": "Šibensko-kninska",
  "programs": [
   {
    "id": 3105,
    "name": "Glazbenik - pripremno obrazovanje",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 15,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3106,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 25,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3107,
    "name": "Glazbenik orguljaš",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3108,
    "name": "Glazbenik trombonist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   }
  ]
 },
 {
  "id": 286,
  "name": "Industrijsko-obrtnička škola Šibenik",
  "city": "Šibenik",
  "county": "Šibensko-kninska",
  "programs": [
   {
    "id": 3390,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 11,
     "upisani": 11,
     "min": 27.48,
     "avg": 28.36,
     "max": 32.4
    }
   },
   {
    "id": 3391,
    "name": "Brodski električar / Brodska električarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 23,
     "min": 51.64,
     "avg": 57.49,
     "max": 65.59
    }
   },
   {
    "id": 3392,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 27.98,
     "avg": 30.86,
     "max": 36.21
    }
   },
   {
    "id": 3393,
    "name": "Izrađivač-monter strojarskih konstrukcija/Izrađivačica-monterka strojarskih konstrukcija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 23.48,
     "avg": 24.89,
     "max": 27.83
    }
   },
   {
    "id": 3394,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 28.88,
     "avg": 31.65,
     "max": 37.89
    }
   },
   {
    "id": 3395,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 24.28,
     "avg": 27.77,
     "max": 36.71
    }
   },
   {
    "id": 3396,
    "name": "Serviser karoserije motornih vozila/Serviserka karoserije motornih vozila",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 24.84,
     "avg": 26.96,
     "max": 32
    }
   }
  ]
 },
 {
  "id": 282,
  "name": "Medicinska škola Šibenik",
  "city": "Šibenik",
  "county": "Šibensko-kninska",
  "programs": [
   {
    "id": 3468,
    "name": "Farmaceutski tehničar",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 27,
     "upisani": 27,
     "min": 67.66,
     "avg": 72.65,
     "max": 81.84
    }
   },
   {
    "id": 3467,
    "name": "Medicinska sestra opće njege/medicinski tehničar opće njege",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 55.28,
     "avg": 62.88,
     "max": 73.71
    }
   },
   {
    "id": 3469,
    "name": "Zdravstveno-laboratorijski tehničar",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 53.35,
     "avg": 59.59,
     "max": 78.42
    }
   }
  ]
 },
 {
  "id": 281,
  "name": "Prometno-tehnička škola Šibenik",
  "city": "Šibenik",
  "county": "Šibensko-kninska",
  "programs": [
   {
    "id": 3725,
    "name": "Pomorski nautičar / Pomorska nautičarka",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 39.92,
     "avg": 50.16,
     "max": 64.05
    }
   },
   {
    "id": 3726,
    "name": "Tehničar cestovnog prometa / Tehničarka cestovnog prometa",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 22,
     "min": 39.72,
     "avg": 47.66,
     "max": 63.28
    }
   },
   {
    "id": 3727,
    "name": "Tehničar za marine i jahte / Tehničarka za marine i jahte",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 47.27,
     "avg": 53.79,
     "max": 69.4
    }
   },
   {
    "id": 3728,
    "name": "Vozač motornog vozila/Vozačica motornog vozila",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 23,
     "min": 23.53,
     "avg": 25.5,
     "max": 30.67
    }
   }
  ]
 },
 {
  "id": 287,
  "name": "Srednja strukovna škola Šibenik",
  "city": "Šibenik",
  "county": "Šibensko-kninska",
  "programs": [
   {
    "id": 3836,
    "name": "Agroturistički tehničar / Agroturistička tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 16,
     "min": 41.84,
     "avg": 48.16,
     "max": 55.43
    }
   },
   {
    "id": 3837,
    "name": "Fitomedicinski tehničar / Fitomedicinska tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 3,
     "min": 39.69,
     "avg": 42.61,
     "max": 47.79
    }
   },
   {
    "id": 3838,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 17,
     "upisani": 17,
     "min": 27.54,
     "avg": 32.24,
     "max": 43.45
    }
   },
   {
    "id": 3839,
    "name": "Kozmetičar / Kozmetičarka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 52.35,
     "avg": 57.76,
     "max": 74.2
    }
   },
   {
    "id": 3840,
    "name": "Mesar/Mesarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 4,
     "min": 23.2,
     "avg": 23.61,
     "max": 24.17
    }
   },
   {
    "id": 3841,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 13,
     "min": 23.39,
     "avg": 25.69,
     "max": 32.46
    }
   },
   {
    "id": 3842,
    "name": "Stolar/Stolarica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 24.62,
     "avg": 28.3,
     "max": 40.89
    }
   }
  ]
 },
 {
  "id": 285,
  "name": "Tehnička škola Šibenik",
  "city": "Šibenik",
  "county": "Šibensko-kninska",
  "programs": [
   {
    "id": 4899,
    "name": "Arhitektonski tehničar / Arhitektonska tehničarka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 60.75,
     "avg": 70.15,
     "max": 79.86
    }
   },
   {
    "id": 4734,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 78.57,
     "avg": 64.94,
     "max": 78.54
    }
   },
   {
    "id": 4742,
    "name": "Tehničar za brodostrojarstvo / Tehničarka za brodostrojarstvo",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 22,
     "min": 42.33,
     "avg": 48.98,
     "max": 56.63
    }
   },
   {
    "id": 4735,
    "name": "Tehničar za električne strojeve i elektroenergetiku / Tehničarka za električne strojeve i elektroenergetiku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 69.41,
     "avg": 73.81,
     "max": 79.92
    }
   },
   {
    "id": 4913,
    "name": "Tehničar za elektroniku i komunikacije / Tehničarka za elektroniku i komunikacije",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 65.31,
     "avg": 71.13,
     "max": 79.79
    }
   }
  ]
 },
 {
  "id": 283,
  "name": "Turističko-ugostiteljska škola Šibenik",
  "city": "Šibenik",
  "county": "Šibensko-kninska",
  "programs": [
   {
    "id": 4777,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 11,
     "min": 22.81,
     "avg": 24.91,
     "max": 31.87
    }
   },
   {
    "id": 4778,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 25.51,
     "avg": 28.21,
     "max": 39.11
    }
   },
   {
    "id": 4779,
    "name": "Tehničar za ugostiteljstvo / Tehničarka za ugostiteljstvo",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 59.8,
     "avg": 62.47,
     "max": 73.28
    }
   },
   {
    "id": 4780,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 63.42,
     "avg": 69.12,
     "max": 77.44
    }
   }
  ]
 },
 {
  "id": 2181,
  "name": "CENTAR ZA PRUŽANJE USLUGA U ZAJEDNICI IVANEC",
  "city": "Ivanec",
  "county": "Varaždinska",
  "programs": [
   {
    "id": 2765,
    "name": "Izrađivač-monter strojarskih konstrukcija/Izrađivačica-monterka strojarskih konstrukcija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 1,
     "min": 21.61,
     "avg": 21.61,
     "max": 21.61
    }
   },
   {
    "id": 2766,
    "name": "Oblagač podova i zidova/Oblagačica podova i zidova",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   }
  ]
 },
 {
  "id": 146,
  "name": "Srednja škola Ivanec",
  "city": "Ivanec",
  "county": "Varaždinska",
  "programs": [
   {
    "id": 4148,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 29.65,
     "avg": 31.74,
     "max": 36.07
    }
   },
   {
    "id": 4149,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 40,
     "upisani": 37,
     "min": 61.68,
     "avg": 74.28,
     "max": 82.92
    }
   },
   {
    "id": 4150,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 19,
     "min": 25.1,
     "avg": 30.44,
     "max": 40.27
    }
   },
   {
    "id": 4151,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 5,
     "min": 22.98,
     "avg": 28.45,
     "max": 32.44
    }
   },
   {
    "id": 4152,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 47.58,
     "avg": 61.33,
     "max": 79.78
    }
   },
   {
    "id": 4153,
    "name": "Stolar/Stolarica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 6,
     "min": 24.73,
     "avg": 29.43,
     "max": 32.81
    }
   },
   {
    "id": 4154,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 17,
     "upisani": 8,
     "min": 52.29,
     "avg": 59.23,
     "max": 65.3
    }
   }
  ]
 },
 {
  "id": 379,
  "name": "Srednja škola Ludbreg",
  "city": "Ludbreg",
  "county": "Varaždinska",
  "programs": [
   {
    "id": 4219,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 6,
     "min": 23.81,
     "avg": 27.9,
     "max": 33.78
    }
   },
   {
    "id": 4220,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 25.24,
     "avg": 31.36,
     "max": 41.44
    }
   },
   {
    "id": 4221,
    "name": "Pomoćni bravar/Pomoćna bravarica",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": 2,
     "min": 1.032,
     "avg": 39.87,
     "max": 46.85
    }
   },
   {
    "id": 4222,
    "name": "Pomoćni kuhar/Pomoćna kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 6,
     "min": 1.027,
     "avg": 39.07,
     "max": 48.46
    }
   },
   {
    "id": 4223,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 5,
     "min": 23.46,
     "avg": 27.04,
     "max": 33.52
    }
   },
   {
    "id": 4224,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 12,
     "min": 48.52,
     "avg": 59.87,
     "max": 75.46
    }
   },
   {
    "id": 4225,
    "name": "Tehničar za mehatroniku / Tehničarka za mehatroniku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 13,
     "min": 47.98,
     "avg": 61.38,
     "max": 75.58
    }
   }
  ]
 },
 {
  "id": 2085,
  "name": "Srednja škola u Maruševcu s pravom javnosti",
  "city": "Maruševec",
  "county": "Varaždinska",
  "programs": [
   {
    "id": 4360,
    "name": "Fizioterapeutski tehničar / fizioterapeutska tehničarka",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 23,
     "min": 46,
     "avg": 55.72,
     "max": 72.72
    }
   },
   {
    "id": 4361,
    "name": "Medicinska sestra opće njege/medicinski tehničar opće njege",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 23,
     "min": 41.9,
     "avg": 55.82,
     "max": 68.91
    }
   }
  ]
 },
 {
  "id": 1962,
  "name": "Srednja škola Novi Marof",
  "city": "Novi Marof",
  "county": "Varaždinska",
  "programs": [
   {
    "id": 4264,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 9,
     "min": 41.6,
     "avg": 65.19,
     "max": 80
    }
   },
   {
    "id": 4265,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 19,
     "min": 51.4,
     "avg": 59.28,
     "max": 72.02
    }
   },
   {
    "id": 4266,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 51.56,
     "avg": 62.98,
     "max": 76.65
    }
   }
  ]
 },
 {
  "id": 571,
  "name": "Centar za odgoj i obrazovanje Tomislav Špoljar",
  "city": "Varaždin",
  "county": "Varaždinska",
  "programs": [
   {
    "id": 2750,
    "name": "Pomoćni cvjećar/Pomoćna cvjećarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 5,
     "min": 1.04,
     "avg": 47.49,
     "max": 50
    }
   },
   {
    "id": 2751,
    "name": "Pomoćni kuhar/Pomoćna kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 1,
     "min": 1.041,
     "avg": 41.68,
     "max": 41.68
    }
   }
  ]
 },
 {
  "id": 150,
  "name": "Druga gimnazija Varaždin",
  "city": "Varaždin",
  "county": "Varaždinska",
  "programs": [
   {
    "id": 2775,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 120,
     "upisani": 112,
     "min": 40.62,
     "avg": 68.17,
     "max": 81
    }
   },
   {
    "id": 2776,
    "name": "Opća gimnazija (odjel za sportaše) (320104-S)",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 110.97,
     "avg": 67.66,
     "max": 152.1
    }
   }
  ]
 },
 {
  "id": 1365,
  "name": "Elektrostrojarska škola",
  "city": "Varaždin",
  "county": "Varaždinska",
  "programs": [
   {
    "id": 2876,
    "name": "Dizajner grafičkih proizvoda / Dizajnerica grafičkih proizvoda",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 59.67,
     "avg": 65.91,
     "max": 73.49
    }
   },
   {
    "id": 2877,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 34.19,
     "avg": 38.2,
     "max": 46.26
    }
   },
   {
    "id": 2878,
    "name": "Elektromehaničar/Elektromehaničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 33.85,
     "avg": 36.63,
     "max": 43.53
    }
   },
   {
    "id": 2879,
    "name": "Elektroničar/Elektroničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 31.99,
     "avg": 35.27,
     "max": 49.51
    }
   },
   {
    "id": 2880,
    "name": "Medijski tehničar / Medijska tehničarka",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 70.15,
     "avg": 74.03,
     "max": 80
    }
   },
   {
    "id": 2881,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 18,
     "min": 26.15,
     "avg": 30.3,
     "max": 40.2
    }
   },
   {
    "id": 2882,
    "name": "Tehničar za električne strojeve i elektroenergetiku / Tehničarka za električne strojeve i elektroenergetiku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 67.19,
     "avg": 72.94,
     "max": 79.79
    }
   },
   {
    "id": 2883,
    "name": "Tehničar za elektroniku i komunikacije / Tehničarka za elektroniku i komunikacije",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 65.03,
     "avg": 67.65,
     "max": 72.13
    }
   },
   {
    "id": 2884,
    "name": "Tehničar za mehatroniku / Tehničarka za mehatroniku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 40,
     "upisani": 40,
     "min": 68.41,
     "avg": 75.28,
     "max": 83.84
    }
   },
   {
    "id": 2885,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 40,
     "upisani": 40,
     "min": 66.55,
     "avg": 74.49,
     "max": 81
    }
   },
   {
    "id": 2886,
    "name": "Tehničar za razvoj i dizajn web sučelja / Tehničarka za razvoj i dizajn web sučelja",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 62.75,
     "avg": 70.35,
     "max": 79.86
    }
   }
  ]
 },
 {
  "id": 1470,
  "name": "Glazbena škola u Varaždinu",
  "city": "Varaždin",
  "county": "Varaždinska",
  "programs": [
   {
    "id": 3197,
    "name": "Glazbenik - pripremno obrazovanje",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 25,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3198,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 51,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3199,
    "name": "Glazbenik - teorijski smjer",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 227.97,
     "avg": 81.37,
     "max": 227.97
    }
   },
   {
    "id": 3200,
    "name": "Glazbenik flautist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 246.98,
     "avg": 80.98,
     "max": 246.98
    }
   },
   {
    "id": 3201,
    "name": "Glazbenik gitarist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 244.24,
     "avg": 87.44,
     "max": 244.24
    }
   },
   {
    "id": 3202,
    "name": "Glazbenik harmonikaš",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 196.74,
     "avg": 77.64,
     "max": 196.74
    }
   },
   {
    "id": 3203,
    "name": "Glazbenik klarinetist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 221.99,
     "avg": 85.39,
     "max": 221.99
    }
   },
   {
    "id": 3204,
    "name": "Glazbenik klavirist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": 3,
     "min": 225.92,
     "avg": 80.94,
     "max": 250.4
    }
   },
   {
    "id": 3205,
    "name": "Glazbenik pjevač",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": 3,
     "min": 221.95,
     "avg": 85.83,
     "max": 236.38
    }
   },
   {
    "id": 3206,
    "name": "Glazbenik saksofonist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 218.44,
     "avg": 79.84,
     "max": 218.44
    }
   },
   {
    "id": 3207,
    "name": "Glazbenik tamburaš",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": 3,
     "min": 189.43,
     "avg": 77.38,
     "max": 243.27
    }
   },
   {
    "id": 3208,
    "name": "Glazbenik trubač",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 202.72,
     "avg": 80.42,
     "max": 202.72
    }
   },
   {
    "id": 3209,
    "name": "Glazbenik tubist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": 2,
     "min": 212.22,
     "avg": 71.48,
     "max": 216.53
    }
   },
   {
    "id": 3210,
    "name": "Glazbenik violinist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": 2,
     "min": 214.87,
     "avg": 85.92,
     "max": 234.97
    }
   },
   {
    "id": 3211,
    "name": "Glazbenik violončelist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 189.13,
     "avg": 72.13,
     "max": 189.13
    }
   }
  ]
 },
 {
  "id": 153,
  "name": "Gospodarska škola Varaždin",
  "city": "Varaždin",
  "county": "Varaždinska",
  "programs": [
   {
    "id": 3251,
    "name": "Administrator (prilagođeni program)",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 3,
     "min": 1.013,
     "avg": 16.96,
     "max": 19.15
    }
   },
   {
    "id": 3252,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 17,
     "min": 46.36,
     "avg": 66.63,
     "max": 78.86
    }
   },
   {
    "id": 3253,
    "name": "Komercijalist / Komercijalistica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 58.88,
     "avg": 62.42,
     "max": 73.84
    }
   },
   {
    "id": 3254,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 23.04,
     "avg": 30.27,
     "max": 39.33
    }
   },
   {
    "id": 3255,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 19,
     "min": 26.3,
     "avg": 31.6,
     "max": 35.92
    }
   },
   {
    "id": 3256,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 25.5,
     "avg": 29.76,
     "max": 35.7
    }
   },
   {
    "id": 3257,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 67.52,
     "avg": 74.34,
     "max": 80
    }
   },
   {
    "id": 3258,
    "name": "Tehničar za ugostiteljstvo / Tehničarka za ugostiteljstvo",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 55.32,
     "avg": 62.65,
     "max": 74.07
    }
   },
   {
    "id": 3259,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 63.97,
     "avg": 67.53,
     "max": 77.64
    }
   },
   {
    "id": 3260,
    "name": "Upravno-poslovni referent / Upravno-poslovna referentica",
    "sector": "Pravo, politologija, sociologija, državna uprava i javni poslovi",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 66.5,
     "avg": 71.78,
     "max": 79.92
    }
   }
  ]
 },
 {
  "id": 2223,
  "name": "Graditeljska, prirodoslovna i rudarska škola",
  "city": "Varaždin",
  "county": "Varaždinska",
  "programs": [
   {
    "id": 3294,
    "name": "Arhitektonski tehničar / Arhitektonska tehničarka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 28,
     "upisani": 28,
     "min": 75.6,
     "avg": 78.15,
     "max": 81
    }
   },
   {
    "id": 3295,
    "name": "Ekološki tehničar / Ekološka tehničarka",
    "sector": "Geologija, rudarstvo, nafta i kemijska tehnologija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 49.33,
     "avg": 57.89,
     "max": 76.59
    }
   },
   {
    "id": 3296,
    "name": "Građevinski radnik u održivoj gradnji/Građevinska radnica u održivoj gradnji",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 14,
     "min": 23.58,
     "avg": 28.8,
     "max": 38.63
    }
   },
   {
    "id": 3297,
    "name": "Građevinski radnik u zgradarstvu/Građevinska radnica u zgradarstvu",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3298,
    "name": "Građevinski tehničar / Građevinska tehničarka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 48,
     "upisani": 43,
     "min": 52.69,
     "avg": 69.42,
     "max": 80
    }
   },
   {
    "id": 3299,
    "name": "Kemijski tehničar / Kemijska tehničarka",
    "sector": "Geologija, rudarstvo, nafta i kemijska tehnologija",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 10,
     "min": 64.76,
     "avg": 70.73,
     "max": 80
    }
   },
   {
    "id": 3300,
    "name": "Monter drvenih konstrukcija i krovova / Monterka drvenih konstrukcija i krovova",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 5,
     "min": 22.96,
     "avg": 24.58,
     "max": 25.77
    }
   },
   {
    "id": 3301,
    "name": "Oblagač podova i zidova/Oblagačica podova i zidova",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 24.03,
     "avg": 30.03,
     "max": 35.61
    }
   },
   {
    "id": 3302,
    "name": "Prehrambeni tehničar / Prehrambena tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 45.91,
     "avg": 55.91,
     "max": 75.04
    }
   },
   {
    "id": 3303,
    "name": "Rukovatelj građevinskim strojevima/Rukovateljica građevinskim strojevima",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 18,
     "min": 28.13,
     "avg": 32.81,
     "max": 39.62
    }
   },
   {
    "id": 3304,
    "name": "Tehničar nutricionist / Tehničarka nutricionistica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 54.57,
     "avg": 61.56,
     "max": 68.72
    }
   }
  ]
 },
 {
  "id": 152,
  "name": "Medicinska škola Varaždin",
  "city": "Varaždin",
  "county": "Varaždinska",
  "programs": [
   {
    "id": 3463,
    "name": "Dentalni tehničar/Dentalna tehničarka",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 63.85,
     "avg": 73.53,
     "max": 80
    }
   },
   {
    "id": 3464,
    "name": "Farmaceutski tehničar",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 76.57,
     "avg": 78.73,
     "max": 80
    }
   },
   {
    "id": 3465,
    "name": "Medicinska sestra opće njege/medicinski tehničar opće njege",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 48,
     "upisani": 48,
     "min": 56.07,
     "avg": 70.13,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 149,
  "name": "Prva gimnazija Varaždin",
  "city": "Varaždin",
  "county": "Varaždinska",
  "programs": [
   {
    "id": 3735,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 72,
     "upisani": 72,
     "min": 72.95,
     "avg": 78.56,
     "max": 83
    }
   },
   {
    "id": 3736,
    "name": "Opća gimnazija uz skupinu predmeta na stranom jeziku",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 71.88,
     "avg": 76.34,
     "max": 80
    }
   },
   {
    "id": 3737,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 104,
     "upisani": 104,
     "min": 67.65,
     "avg": 78.28,
     "max": 84
    }
   }
  ]
 },
 {
  "id": 2266,
  "name": "Prva privatna gimnazija s pravom javnosti Varaždin",
  "city": "Varaždin",
  "county": "Varaždinska",
  "programs": [
   {
    "id": 3738,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 40,
     "upisani": 17,
     "min": 48.43,
     "avg": 63.89,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 155,
  "name": "Srednja strukovna škola Varaždin",
  "city": "Varaždin",
  "county": "Varaždinska",
  "programs": [
   {
    "id": 3883,
    "name": "Drvodjeljski tehničar i dizajner / Drvodjeljska tehničarka i dizajnerica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 17,
     "min": 46.61,
     "avg": 58.56,
     "max": 77.14
    }
   },
   {
    "id": 3868,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 18,
     "upisani": 18,
     "min": 37.31,
     "avg": 40.35,
     "max": 44.96
    }
   },
   {
    "id": 3877,
    "name": "Kozmetičar / Kozmetičarka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 67.5,
     "avg": 71.39,
     "max": 78.93
    }
   },
   {
    "id": 3884,
    "name": "Likovna umjetnost i dizajn do izbora zanimanja (program B) (300100-B)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 144.04,
     "avg": 69.62,
     "max": 198.93
    }
   },
   {
    "id": 3888,
    "name": "Modni tehničar / Modna tehničarka",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 14,
     "min": 56,
     "avg": 65.02,
     "max": 76.17
    }
   },
   {
    "id": 3889,
    "name": "Pekar-slastičar/Pekarica-slastičarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 14,
     "min": 25.24,
     "avg": 30.84,
     "max": 38.62
    }
   },
   {
    "id": 3890,
    "name": "Pomoćni krojač/Pomoćna krojačica",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": 1,
     "min": 1.025,
     "avg": 23.37,
     "max": 25.37
    }
   },
   {
    "id": 3891,
    "name": "Pomoćni pekar/Pomoćna pekarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": 2,
     "min": 1.031,
     "avg": 34.03,
     "max": 38.85
    }
   },
   {
    "id": 3893,
    "name": "Soboslikar ličilac dekorater/Soboslikarica ličiteljica dekoraterka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 13,
     "min": 23.54,
     "avg": 26.49,
     "max": 31.24
    }
   },
   {
    "id": 3894,
    "name": "Staklar/Staklarica",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 6,
     "min": 23.62,
     "avg": 26.47,
     "max": 28.55
    }
   },
   {
    "id": 3896,
    "name": "Tapetar/Tapetarka",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 4,
     "min": 23.62,
     "avg": 28.04,
     "max": 37.59
    }
   }
  ]
 },
 {
  "id": 2299,
  "name": "Strojarska i prometna škola",
  "city": "Varaždin",
  "county": "Varaždinska",
  "programs": [
   {
    "id": 4420,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 34.84,
     "avg": 36.79,
     "max": 40.89
    }
   },
   {
    "id": 4421,
    "name": "Izrađivač-monter strojarskih konstrukcija/Izrađivačica-monterka strojarskih konstrukcija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 7,
     "min": 23.12,
     "avg": 24.69,
     "max": 25.8
    }
   },
   {
    "id": 4422,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 36.67,
     "avg": 38.69,
     "max": 46.04
    }
   },
   {
    "id": 4423,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 33.32,
     "avg": 36.96,
     "max": 47.37
    }
   },
   {
    "id": 4424,
    "name": "Serviser karoserije motornih vozila/Serviserka karoserije motornih vozila",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 25.52,
     "avg": 29.41,
     "max": 35.46
    }
   },
   {
    "id": 4425,
    "name": "Tehničar cestovnog prometa / Tehničarka cestovnog prometa",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 56.13,
     "avg": 62.9,
     "max": 80
    }
   },
   {
    "id": 4426,
    "name": "Tehničar prometne logistike / Tehničarka prometne logistike",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 15,
     "min": 56.61,
     "avg": 63.2,
     "max": 71.79
    }
   },
   {
    "id": 4427,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 30,
     "upisani": 30,
     "min": 54.92,
     "avg": 64.89,
     "max": 78.85
    }
   },
   {
    "id": 4428,
    "name": "Tehničar za poštu i poštansku logistiku  / Tehničarka za poštu i poštansku logistiku",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 49.74,
     "avg": 54.97,
     "max": 63.55
    }
   },
   {
    "id": 4429,
    "name": "Tehničar za vozila / Tehničarka za vozila",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 56.05,
     "avg": 63.11,
     "max": 74.63
    }
   },
   {
    "id": 4430,
    "name": "Vozač motornog vozila/Vozačica motornog vozila",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 39,
     "upisani": 39,
     "min": 27.2,
     "avg": 33.14,
     "max": 45.59
    }
   }
  ]
 },
 {
  "id": 2277,
  "name": "Srednja škola \"Stjepan Ivšić\"",
  "city": "Orahovica",
  "county": "Virovitičko-podravska",
  "programs": [
   {
    "id": 3946,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 24.95,
     "avg": 31.1,
     "max": 42.03
    }
   },
   {
    "id": 3947,
    "name": "Cvjećar/Cvjećarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 2,
     "min": 30.89,
     "avg": 29.09,
     "max": 30.89
    }
   },
   {
    "id": 3948,
    "name": "Fizioterapeutski tehničar / fizioterapeutska tehničarka",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 47.06,
     "avg": 55.43,
     "max": 71
    }
   },
   {
    "id": 3949,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 2,
     "min": 30.33,
     "avg": 34.2,
     "max": 38.06
    }
   },
   {
    "id": 3950,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 5,
     "min": 24.75,
     "avg": 30.3,
     "max": 34.74
    }
   },
   {
    "id": 3951,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 6,
     "min": 26.31,
     "avg": 30.06,
     "max": 34.16
    }
   },
   {
    "id": 3952,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 18,
     "min": 43.81,
     "avg": 69.36,
     "max": 80
    }
   },
   {
    "id": 3953,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 24.14,
     "avg": 26.42,
     "max": 29.86
    }
   }
  ]
 },
 {
  "id": 2291,
  "name": "Srednja škola Stjepana Sulimanca",
  "city": "Pitomača",
  "county": "Virovitičko-podravska",
  "programs": [
   {
    "id": 4340,
    "name": "Agroturistički tehničar / Agroturistička tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 6,
     "min": 42.51,
     "avg": 49.88,
     "max": 60.59
    }
   },
   {
    "id": 4341,
    "name": "Farmaceutski tehničar",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 49.37,
     "avg": 61.17,
     "max": 76.63
    }
   },
   {
    "id": 4342,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 6,
     "min": 22.25,
     "avg": 27.77,
     "max": 34.86
    }
   },
   {
    "id": 4343,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 4,
     "min": 24.67,
     "avg": 25.41,
     "max": 28.44
    }
   },
   {
    "id": 4344,
    "name": "Mehaničar poljoprivredne mehanizacije/Mehaničarka poljoprivredne mehanizacije",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 7,
     "min": 28.27,
     "avg": 30.9,
     "max": 35.14
    }
   },
   {
    "id": 4345,
    "name": "Poljoprivredni gospodarstvenik/Poljoprivredna gospodarstvenica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 6,
     "min": 22.98,
     "avg": 26.26,
     "max": 34.79
    }
   },
   {
    "id": 4346,
    "name": "Slastičar/Slastičarka",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 4,
     "min": 23.93,
     "avg": 27.61,
     "max": 31.74
    }
   },
   {
    "id": 4347,
    "name": "Upravno-poslovni referent / Upravno-poslovna referentica",
    "sector": "Pravo, politologija, sociologija, državna uprava i javni poslovi",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 49.8,
     "avg": 64.53,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 218,
  "name": "Industrijsko-obrtnička škola Slatina",
  "city": "Slatina",
  "county": "Virovitičko-podravska",
  "programs": [
   {
    "id": 3379,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 25.67,
     "avg": 29.03,
     "max": 36.37
    }
   },
   {
    "id": 3380,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 28.99,
     "avg": 32.89,
     "max": 38.16
    }
   },
   {
    "id": 3381,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 25.12,
     "avg": 28.34,
     "max": 32.98
    }
   },
   {
    "id": 3382,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 22.93,
     "avg": 27.85,
     "max": 36.73
    }
   },
   {
    "id": 3383,
    "name": "Modni krojač/Modna krojačica",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 2,
     "min": 1.028,
     "avg": 32.58,
     "max": 37.04
    }
   },
   {
    "id": 3384,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 30.28,
     "avg": 32.96,
     "max": 37.9
    }
   },
   {
    "id": 3385,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 25.81,
     "avg": 27.81,
     "max": 32.7
    }
   },
   {
    "id": 3386,
    "name": "Pomoćni krojač/Pomoćna krojačica",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": 1,
     "min": 1.037,
     "avg": 37.51,
     "max": 37.51
    }
   },
   {
    "id": 3387,
    "name": "Pomoćni stolar/Pomoćna stolarica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": 3,
     "min": 1.028,
     "avg": 37.14,
     "max": 42.74
    }
   },
   {
    "id": 3388,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 6,
     "min": 24.77,
     "avg": 28.02,
     "max": 31.93
    }
   },
   {
    "id": 3389,
    "name": "Stolar/Stolarica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 4,
     "min": 24.42,
     "avg": 25.65,
     "max": 28.45
    }
   }
  ]
 },
 {
  "id": 217,
  "name": "Srednja škola Marka Marulića Slatina",
  "city": "Slatina",
  "county": "Virovitičko-podravska",
  "programs": [
   {
    "id": 4226,
    "name": "Agrotehničar / Agrotehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 7,
     "min": 40.27,
     "avg": 48.4,
     "max": 63.79
    }
   },
   {
    "id": 4227,
    "name": "Agroturistički tehničar / Agroturistička tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 9,
     "min": 43.4,
     "avg": 50.58,
     "max": 54.06
    }
   },
   {
    "id": 4228,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 40,
     "upisani": 31,
     "min": 47.13,
     "avg": 67.89,
     "max": 80
    }
   },
   {
    "id": 4229,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 63.74,
     "avg": 68.63,
     "max": 79.93
    }
   },
   {
    "id": 4230,
    "name": "Tehničar za elektroniku i komunikacije / Tehničarka za elektroniku i komunikacije",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 51.52,
     "avg": 66.99,
     "max": 78.79
    }
   }
  ]
 },
 {
  "id": 2180,
  "name": "Centar za odgoj, obrazovanje i razvojnu podršku dr. Terezija Salaj Rakić",
  "city": "Virovitica",
  "county": "Virovitičko-podravska",
  "programs": [
   {
    "id": 2763,
    "name": "Pomoćni grafički radnik dorade/Pomoćna grafička radnica dorade",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 5,
     "min": 1.033,
     "avg": 43.18,
     "max": 48.58
    }
   },
   {
    "id": 2764,
    "name": "Pomoćni krojač/Pomoćna krojačica",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 2,
     "min": 1.04,
     "avg": 40.68,
     "max": 40.76
    }
   }
  ]
 },
 {
  "id": 219,
  "name": "Gimnazija Petra Preradovića Virovitica",
  "city": "Virovitica",
  "county": "Virovitičko-podravska",
  "programs": [
   {
    "id": 2986,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 22,
     "min": 57.74,
     "avg": 68.42,
     "max": 81
    }
   },
   {
    "id": 2987,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 52,
     "min": 64.39,
     "avg": 74.77,
     "max": 83
    }
   },
   {
    "id": 2988,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 24,
     "min": 58.56,
     "avg": 76.26,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 2214,
  "name": "Glazbena škola Jan Vlašimsky Virovitica",
  "city": "Virovitica",
  "county": "Virovitičko-podravska",
  "programs": [
   {
    "id": 3134,
    "name": "Glazbenik - pripremno obrazovanje",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 15,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3135,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3136,
    "name": "Glazbenik - teorijski smjer",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 152.51,
     "avg": 82.51,
     "max": 152.51
    }
   },
   {
    "id": 3137,
    "name": "Glazbenik gitarist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3138,
    "name": "Glazbenik klavirist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 237.52,
     "avg": 80.52,
     "max": 237.52
    }
   },
   {
    "id": 3139,
    "name": "Glazbenik pjevač",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3140,
    "name": "Glazbenik tamburaš",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": 1,
     "min": 205.5,
     "avg": 87.5,
     "max": 205.5
    }
   }
  ]
 },
 {
  "id": 221,
  "name": "Industrijsko-obrtnička škola Virovitica",
  "city": "Virovitica",
  "county": "Virovitičko-podravska",
  "programs": [
   {
    "id": 3397,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 13,
     "min": 27.9,
     "avg": 30.76,
     "max": 35.96
    }
   },
   {
    "id": 3398,
    "name": "Cvjećar/Cvjećarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 3,
     "min": 25.11,
     "avg": 35.47,
     "max": 46.24
    }
   },
   {
    "id": 3399,
    "name": "Elektromehaničar/Elektromehaničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 6,
     "min": 26.83,
     "avg": 30.61,
     "max": 35.23
    }
   },
   {
    "id": 3400,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 18,
     "min": 31.37,
     "avg": 36.54,
     "max": 45.28
    }
   },
   {
    "id": 3401,
    "name": "Kozmetičar / Kozmetičarka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 56.73,
     "avg": 60.91,
     "max": 77.28
    }
   },
   {
    "id": 3402,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 25.62,
     "avg": 31.21,
     "max": 40.68
    }
   },
   {
    "id": 3403,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 9,
     "min": 22.93,
     "avg": 29.9,
     "max": 37.93
    }
   },
   {
    "id": 3404,
    "name": "Serviser karoserije motornih vozila/Serviserka karoserije motornih vozila",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 4,
     "min": 22.35,
     "avg": 23.99,
     "max": 25.92
    }
   },
   {
    "id": 3405,
    "name": "Stolar/Stolarica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 11,
     "min": 23.85,
     "avg": 26.31,
     "max": 31.31
    }
   }
  ]
 },
 {
  "id": 223,
  "name": "KATOLIČKA KLASIČNA GIMNAZIJA S PRAVOM JAVNOSTI U VIROVITICI",
  "city": "Virovitica",
  "county": "Virovitičko-podravska",
  "programs": [
   {
    "id": 3430,
    "name": "Klasična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 18,
     "min": 46.29,
     "avg": 64.44,
     "max": 79.84
    }
   }
  ]
 },
 {
  "id": 222,
  "name": "Strukovna škola Virovitica",
  "city": "Virovitica",
  "county": "Virovitičko-podravska",
  "programs": [
   {
    "id": 4515,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 5,
     "min": 23.05,
     "avg": 27.79,
     "max": 39.16
    }
   },
   {
    "id": 4516,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 7,
     "min": 28.25,
     "avg": 31.19,
     "max": 35.02
    }
   },
   {
    "id": 4517,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 39,
     "upisani": 35,
     "min": 38.13,
     "avg": 57.85,
     "max": 82
    }
   },
   {
    "id": 4518,
    "name": "Slastičar/Slastičarka",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 8,
     "min": 23.88,
     "avg": 27.57,
     "max": 31.38
    }
   },
   {
    "id": 4519,
    "name": "Tehničar za ugostiteljstvo / Tehničarka za ugostiteljstvo",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 42.54,
     "avg": 55.48,
     "max": 73.5
    }
   }
  ]
 },
 {
  "id": 220,
  "name": "Tehnička škola Virovitica",
  "city": "Virovitica",
  "county": "Virovitičko-podravska",
  "programs": [
   {
    "id": 4712,
    "name": "Drvodjeljski tehničar i dizajner / Drvodjeljska tehničarka i dizajnerica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 5,
     "min": 47.7,
     "avg": 55.54,
     "max": 65.43
    }
   },
   {
    "id": 4713,
    "name": "Medicinska sestra opće njege/medicinski tehničar opće njege",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 61.09,
     "avg": 68.64,
     "max": 76.02
    }
   },
   {
    "id": 4714,
    "name": "Šumarski tehničar / Šumarska tehničarka",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 39.61,
     "avg": 57.81,
     "max": 72.31
    }
   },
   {
    "id": 4715,
    "name": "Tehničar za električne strojeve i elektroenergetiku / Tehničarka za električne strojeve i elektroenergetiku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 64.86,
     "avg": 71.45,
     "max": 80
    }
   },
   {
    "id": 4716,
    "name": "Tehničar za mehatroniku / Tehničarka za mehatroniku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 48.95,
     "avg": 58.27,
     "max": 70.32
    }
   }
  ]
 },
 {
  "id": 302,
  "name": "Srednja škola Ilok",
  "city": "Ilok",
  "county": "Vukovarsko-srijemska",
  "programs": [
   {
    "id": 4103,
    "name": "Agrotehničar / Agrotehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 5,
     "min": 44.61,
     "avg": 49.86,
     "max": 53.95
    }
   },
   {
    "id": 4104,
    "name": "Agroturistički tehničar / Agroturistička tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 6,
     "min": 36.44,
     "avg": 52.83,
     "max": 68.18
    }
   },
   {
    "id": 4105,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 6,
     "min": 62.82,
     "avg": 72.64,
     "max": 80
    }
   },
   {
    "id": 4106,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 12,
     "min": 42.64,
     "avg": 58.95,
     "max": 80
    }
   },
   {
    "id": 4107,
    "name": "Tehničar za voćarstvo, vinogradarstvo i vinarstvo / Tehničarka za voćarstvo, vinogradarstvo i vinarstvo",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 3,
     "min": 38.29,
     "avg": 44.68,
     "max": 51.22
    }
   }
  ]
 },
 {
  "id": 2184,
  "name": "Drvodjelska tehnička škola",
  "city": "Vinkovci",
  "county": "Vukovarsko-srijemska",
  "programs": [
   {
    "id": 2787,
    "name": "Drvodjeljski tehničar i dizajner / Drvodjeljska tehničarka i dizajnerica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 15,
     "min": 43.47,
     "avg": 54.34,
     "max": 66.16
    }
   },
   {
    "id": 2788,
    "name": "Stolar/Stolarica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 17,
     "upisani": 13,
     "min": 23.26,
     "avg": 29.23,
     "max": 41.93
    }
   }
  ]
 },
 {
  "id": 2186,
  "name": "Ekonomska i trgovačka škola Ivana Domca",
  "city": "Vinkovci",
  "county": "Vukovarsko-srijemska",
  "programs": [
   {
    "id": 2798,
    "name": "Pomoćni administrator/Pomoćna administratorica",
    "sector": "Pravo, politologija, sociologija, državna uprava i javni poslovi",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 4,
     "min": 1.033,
     "avg": 41.66,
     "max": 49.48
    }
   },
   {
    "id": 2799,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 17,
     "min": 24.26,
     "avg": 29.2,
     "max": 45.57
    }
   },
   {
    "id": 2800,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 54,
     "upisani": 54,
     "min": 45.46,
     "avg": 55.51,
     "max": 77.63
    }
   },
   {
    "id": 2801,
    "name": "Tehničar za razvoj i dizajn web sučelja / Tehničarka za razvoj i dizajn web sučelja",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 58.78,
     "avg": 65.88,
     "max": 77.79
    }
   },
   {
    "id": 2802,
    "name": "Upravno-poslovni referent / Upravno-poslovna referentica",
    "sector": "Pravo, politologija, sociologija, državna uprava i javni poslovi",
    "prag": {
     "year": "2025/2026",
     "kvota": 39,
     "upisani": 39,
     "min": 46,
     "avg": 57.56,
     "max": 78.65
    }
   }
  ]
 },
 {
  "id": 1682,
  "name": "Gimnazija Matije Antuna Reljkovića",
  "city": "Vinkovci",
  "county": "Vukovarsko-srijemska",
  "programs": [
   {
    "id": 2976,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 16,
     "min": 45.74,
     "avg": 66.64,
     "max": 80
    }
   },
   {
    "id": 2977,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 59,
     "upisani": 58,
     "min": 51.83,
     "avg": 71.97,
     "max": 81
    }
   },
   {
    "id": 2978,
    "name": "Prirodoslovna gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 63.04,
     "avg": 75.91,
     "max": 80
    }
   },
   {
    "id": 2979,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 44,
     "upisani": 42,
     "min": 64.03,
     "avg": 76.85,
     "max": 81
    }
   }
  ]
 },
 {
  "id": 2215,
  "name": "Glazbena škola Josipa Runjanina",
  "city": "Vinkovci",
  "county": "Vukovarsko-srijemska",
  "programs": [
   {
    "id": 3149,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3150,
    "name": "Glazbenik - teorijski smjer",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 4,
     "upisani": 2,
     "min": 201.25,
     "avg": 80.59,
     "max": 242.92
    }
   },
   {
    "id": 3151,
    "name": "Glazbenik harmonikaš",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": 2,
     "min": 184.36,
     "avg": 75.52,
     "max": 215.67
    }
   },
   {
    "id": 3152,
    "name": "Glazbenik tamburaš",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": 2,
     "min": 165.51,
     "avg": 71.8,
     "max": 234.08
    }
   },
   {
    "id": 3153,
    "name": "Glazbenik violinist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": 1,
     "min": 241.27,
     "avg": 82.27,
     "max": 241.27
    }
   }
  ]
 },
 {
  "id": 294,
  "name": "Poljoprivredno šumarska škola Vinkovci",
  "city": "Vinkovci",
  "county": "Vukovarsko-srijemska",
  "programs": [
   {
    "id": 3634,
    "name": "Agrotehničar / Agrotehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 18,
     "upisani": 14,
     "min": 38.66,
     "avg": 53.72,
     "max": 72.09
    }
   },
   {
    "id": 3635,
    "name": "Cvjećar/Cvjećarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 5,
     "min": 26.96,
     "avg": 26.93,
     "max": 30.08
    }
   },
   {
    "id": 3636,
    "name": "Fitomedicinski tehničar / Fitomedicinska tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 13,
     "min": 38.53,
     "avg": 48.9,
     "max": 61.19
    }
   },
   {
    "id": 3637,
    "name": "Mehaničar poljoprivredne mehanizacije/Mehaničarka poljoprivredne mehanizacije",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 19,
     "min": 23.11,
     "avg": 26.4,
     "max": 41.95
    }
   },
   {
    "id": 3638,
    "name": "Mesar/Mesarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 4,
     "min": 22.5,
     "avg": 24.9,
     "max": 27.56
    }
   },
   {
    "id": 3639,
    "name": "Poljoprivredni gospodarstvenik/Poljoprivredna gospodarstvenica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 6,
     "min": 23.51,
     "avg": 26.13,
     "max": 32.08
    }
   },
   {
    "id": 3640,
    "name": "Šumarski tehničar / Šumarska tehničarka",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 42.33,
     "avg": 52.56,
     "max": 64.17
    }
   }
  ]
 },
 {
  "id": 292,
  "name": "Srednja strukovna škola Vinkovci",
  "city": "Vinkovci",
  "county": "Vukovarsko-srijemska",
  "programs": [
   {
    "id": 3855,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 32.07,
     "avg": 34,
     "max": 39.54
    }
   },
   {
    "id": 3856,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 7,
     "min": 22.15,
     "avg": 25.78,
     "max": 30.58
    }
   },
   {
    "id": 3857,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 14,
     "min": 23.04,
     "avg": 28.05,
     "max": 39.48
    }
   },
   {
    "id": 3858,
    "name": "Modni krojač/Modna krojačica",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 3,
     "min": 28.78,
     "avg": 27.87,
     "max": 29.48
    }
   },
   {
    "id": 3859,
    "name": "Modni tehničar / Modna tehničarka",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 14,
     "min": 43.43,
     "avg": 55.42,
     "max": 72.58
    }
   },
   {
    "id": 3860,
    "name": "Pomoćni kuhar/Pomoćna kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 4,
     "upisani": 3,
     "min": 1.043,
     "avg": 46.15,
     "max": 50
    }
   },
   {
    "id": 3861,
    "name": "Pomoćni radnik za uređenje interijera/Pomoćna radnica za uređenje interijera",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 4,
     "upisani": 3,
     "min": 1.026,
     "avg": 33.82,
     "max": 39.37
    }
   },
   {
    "id": 3862,
    "name": "Serviser karoserije motornih vozila/Serviserka karoserije motornih vozila",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 6,
     "min": 26.5,
     "avg": 30.06,
     "max": 41.27
    }
   },
   {
    "id": 3863,
    "name": "Slastičar/Slastičarka",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 7,
     "min": 27.83,
     "avg": 30.02,
     "max": 37.08
    }
   },
   {
    "id": 3864,
    "name": "Soboslikar ličilac dekorater/Soboslikarica ličiteljica dekoraterka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 7,
     "min": 23.61,
     "avg": 25.78,
     "max": 28.66
    }
   },
   {
    "id": 3865,
    "name": "Tehničar za ugostiteljstvo / Tehničarka za ugostiteljstvo",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 17,
     "min": 37.91,
     "avg": 48.61,
     "max": 60.05
    }
   },
   {
    "id": 3866,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 17,
     "min": 39.69,
     "avg": 52.24,
     "max": 71.37
    }
   }
  ]
 },
 {
  "id": 288,
  "name": "Tehnička škola Ruđera Boškovića Vinkovci",
  "city": "Vinkovci",
  "county": "Vukovarsko-srijemska",
  "programs": [
   {
    "id": 4687,
    "name": "Arhitektonski tehničar / Arhitektonska tehničarka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 53.71,
     "avg": 70.91,
     "max": 80
    }
   },
   {
    "id": 4688,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 28.83,
     "avg": 33.83,
     "max": 45.58
    }
   },
   {
    "id": 4689,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 11,
     "upisani": 11,
     "min": 28.42,
     "avg": 31.44,
     "max": 39.87
    }
   },
   {
    "id": 4690,
    "name": "Elektroničar/Elektroničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 9,
     "min": 24.26,
     "avg": 28.03,
     "max": 34.12
    }
   },
   {
    "id": 4691,
    "name": "Građevinski radnik u održivoj gradnji/Građevinska radnica u održivoj gradnji",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 9,
     "min": 23.12,
     "avg": 27.1,
     "max": 32.81
    }
   },
   {
    "id": 4692,
    "name": "Građevinski tehničar / Građevinska tehničarka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 51.06,
     "avg": 62.07,
     "max": 80.92
    }
   },
   {
    "id": 4693,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 33.38,
     "avg": 37.49,
     "max": 42.29
    }
   },
   {
    "id": 4694,
    "name": "Oblagač podova i zidova/Oblagačica podova i zidova",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 32.5,
     "avg": 31.67,
     "max": 37.86
    }
   },
   {
    "id": 4695,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 14,
     "min": 24.13,
     "avg": 30.76,
     "max": 42.62
    }
   },
   {
    "id": 4696,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 39.33,
     "avg": 57.61,
     "max": 77.47
    }
   },
   {
    "id": 4697,
    "name": "Tehničar za električne strojeve i elektroenergetiku / Tehničarka za električne strojeve i elektroenergetiku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 61.37,
     "avg": 70.53,
     "max": 80
    }
   },
   {
    "id": 4698,
    "name": "Tehničar za mehatroniku / Tehničarka za mehatroniku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 40,
     "upisani": 37,
     "min": 41.11,
     "avg": 60.74,
     "max": 79.69
    }
   }
  ]
 },
 {
  "id": 293,
  "name": "Zdravstvena i veterinarska škola dr. Andrije Štampara Vinkovci",
  "city": "Vinkovci",
  "county": "Vukovarsko-srijemska",
  "programs": [
   {
    "id": 4846,
    "name": "Fizioterapeutski tehničar / fizioterapeutska tehničarka",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 59.81,
     "avg": 67.88,
     "max": 79.92
    }
   },
   {
    "id": 4847,
    "name": "Medicinska sestra opće njege/medicinski tehničar opće njege",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 60,
     "upisani": 60,
     "min": 61.15,
     "avg": 68.75,
     "max": 79.92
    }
   },
   {
    "id": 4848,
    "name": "Veterinarski tehničar / Veterinarska tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 16,
     "min": 41.64,
     "avg": 53.94,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 295,
  "name": "Gimnazija Vukovar",
  "city": "Vukovar",
  "county": "Vukovarsko-srijemska",
  "programs": [
   {
    "id": 3003,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 10,
     "min": 51.68,
     "avg": 58.92,
     "max": 71.77
    }
   },
   {
    "id": 3004,
    "name": "Jezična gimnazija (nastava na srpskom jeziku) (320304-MS)",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 3,
     "min": 69.52,
     "avg": 73.88,
     "max": 80
    }
   },
   {
    "id": 3005,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 22,
     "min": 64.04,
     "avg": 72.69,
     "max": 79.92
    }
   },
   {
    "id": 3006,
    "name": "Opća gimnazija (nastava na srpskom jeziku) (320104-MS)",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 2,
     "min": 76.69,
     "avg": 78.35,
     "max": 80
    }
   },
   {
    "id": 3007,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 18,
     "min": 65.94,
     "avg": 77.33,
     "max": 80
    }
   },
   {
    "id": 3008,
    "name": "Prirodoslovno-matematička gimnazija (nastava na srpskom jeziku) (320204-MS)",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 8,
     "min": 63.55,
     "avg": 74.74,
     "max": 78.8
    }
   }
  ]
 },
 {
  "id": 2267,
  "name": "Prva srednja škola Vukovar",
  "city": "Vukovar",
  "county": "Vukovarsko-srijemska",
  "programs": [
   {
    "id": 3752,
    "name": "Farmaceutski tehničar",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 22,
     "min": 52.65,
     "avg": 63.86,
     "max": 80
    }
   },
   {
    "id": 3753,
    "name": "Farmaceutski tehničar (nastava na srpskom jeziku) (240404-MS)",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 22,
     "min": 60.11,
     "avg": 70.52,
     "max": 80
    }
   },
   {
    "id": 3754,
    "name": "Komercijalist / Komercijalistica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 9,
     "min": 39.7,
     "avg": 49.44,
     "max": 58.22
    }
   },
   {
    "id": 3755,
    "name": "Komercijalist / Komercijalistica (nastava na srpskom jeziku) (060305-MS)",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 3,
     "min": 41.52,
     "avg": 56.01,
     "max": 61.71
    }
   },
   {
    "id": 3756,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 10,
     "min": 45.27,
     "avg": 58.02,
     "max": 70.64
    }
   },
   {
    "id": 3757,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju (nastava na srpskom jeziku) (060500-MS)",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 9,
     "min": 48.72,
     "avg": 60,
     "max": 70.55
    }
   },
   {
    "id": 3758,
    "name": "Upravno-poslovni referent / Upravno-poslovna referentica",
    "sector": "Pravo, politologija, sociologija, državna uprava i javni poslovi",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 10,
     "min": 43.89,
     "avg": 54.04,
     "max": 65.72
    }
   },
   {
    "id": 3759,
    "name": "Upravno-poslovni referent / Upravno-poslovna referentica (nastava na srpskom jeziku) (060405-MS)",
    "sector": "Pravo, politologija, sociologija, državna uprava i javni poslovi",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 14,
     "min": 51.43,
     "avg": 61.41,
     "max": 74.23
    }
   }
  ]
 },
 {
  "id": 2272,
  "name": "Srednja strukovna škola Marko Babić",
  "city": "Vukovar",
  "county": "Vukovarsko-srijemska",
  "programs": [
   {
    "id": 3823,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 25.11,
     "avg": 28.04,
     "max": 34.6
    }
   },
   {
    "id": 3824,
    "name": "Frizer/Frizerka (nastava na srpskom jeziku) (250334-MS)",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 6,
     "min": 27.86,
     "avg": 32.85,
     "max": 45.68
    }
   },
   {
    "id": 3825,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 1,
     "min": 27.71,
     "avg": 27.71,
     "max": 27.71
    }
   },
   {
    "id": 3826,
    "name": "Konobar/Konobarica  (nastava na srpskom jeziku) (071304-MS)",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 4,
     "min": 26.54,
     "avg": 25.48,
     "max": 26.74
    }
   },
   {
    "id": 3827,
    "name": "Kozmetičar / Kozmetičarka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 13,
     "min": 47.41,
     "avg": 50.97,
     "max": 63
    }
   },
   {
    "id": 3828,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 5,
     "min": 23.36,
     "avg": 30.32,
     "max": 39.81
    }
   },
   {
    "id": 3829,
    "name": "Kuhar/Kuharica  (nastava na srpskom jeziku) (071204-MS)",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 3,
     "min": 28.66,
     "avg": 33.88,
     "max": 39.6
    }
   },
   {
    "id": 3830,
    "name": "Pomoćni kuhar/Pomoćna kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 7,
     "min": 43.59,
     "avg": 47.53,
     "max": 50
    }
   },
   {
    "id": 3831,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 6,
     "min": 23.69,
     "avg": 26.53,
     "max": 29.12
    }
   },
   {
    "id": 3832,
    "name": "Slastičar/Slastičarka",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 3,
     "min": 24.22,
     "avg": 25.08,
     "max": 26.51
    }
   },
   {
    "id": 3833,
    "name": "Slastičar/Slastičarka (nastava na srpskom jeziku) (071404-MS)",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 1,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3834,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacija (nastava na srpskom jeziku) (070108-MS)",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 3,
     "min": 50.12,
     "avg": 53.29,
     "max": 54.93
    }
   },
   {
    "id": 3835,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 6,
     "min": 43.09,
     "avg": 59.36,
     "max": 74.47
    }
   }
  ]
 },
 {
  "id": 2321,
  "name": "Tehnička škola Nikole Tesle",
  "city": "Vukovar",
  "county": "Vukovarsko-srijemska",
  "programs": [
   {
    "id": 4667,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 8,
     "min": 26.08,
     "avg": 29.12,
     "max": 36.02
    }
   },
   {
    "id": 4668,
    "name": "Automehatroničar/Automehatroničarka  (nastava na srpskom jeziku) (014234-MS)",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 6,
     "min": 28.83,
     "avg": 32.35,
     "max": 37.87
    }
   },
   {
    "id": 4669,
    "name": "Ekološki tehničar / Ekološka tehničarka (nastava na srpskom jeziku) (050506-MS)",
    "sector": "Geologija, rudarstvo, nafta i kemijska tehnologija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 3,
     "min": 43.42,
     "avg": 59.87,
     "max": 77.32
    }
   },
   {
    "id": 4670,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 8,
     "min": 25.33,
     "avg": 27.82,
     "max": 32.09
    }
   },
   {
    "id": 4671,
    "name": "Elektroinstalater/Elektroinstalaterka (nastava na srpskom jeziku) (042134-MS)",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 3,
     "min": 24.82,
     "avg": 31.9,
     "max": 36.77
    }
   },
   {
    "id": 4672,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 11,
     "upisani": 9,
     "min": 23,
     "avg": 27.78,
     "max": 34.48
    }
   },
   {
    "id": 4673,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija (nastava na srpskom jeziku) (015203-MS)",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 4,
     "min": 23.1,
     "avg": 26.69,
     "max": 30.48
    }
   },
   {
    "id": 4674,
    "name": "Serviser karoserije motornih vozila/Serviserka karoserije motornih vozila",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 4,
     "min": 23.77,
     "avg": 25.92,
     "max": 31.52
    }
   },
   {
    "id": 4675,
    "name": "Serviser karoserije motornih vozila/Serviserka karoserije motornih vozila (nastava na srpskom jeziku) (011805-MS)",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 4,
     "min": 24.88,
     "avg": 29.26,
     "max": 33.97
    }
   },
   {
    "id": 4676,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 4,
     "min": 42.04,
     "avg": 52.72,
     "max": 64.84
    }
   },
   {
    "id": 4677,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu (nastava na srpskom jeziku) (010105-MS)",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 1,
     "min": 56.93,
     "avg": 56.93,
     "max": 56.93
    }
   },
   {
    "id": 4678,
    "name": "Tehničar za električne strojeve i elektroenergetiku / Tehničarka za električne strojeve i elektroenergetiku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 12,
     "min": 41.17,
     "avg": 57.12,
     "max": 79.84
    }
   },
   {
    "id": 4679,
    "name": "Tehničar za električne strojeve i elektroenergetiku / Tehničarka za električne strojeve i elektroenergetiku (nastava na srpskom jeziku) (041105-MS)",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 9,
     "min": 54.02,
     "avg": 66.23,
     "max": 79.92
    }
   },
   {
    "id": 4680,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 14,
     "min": 41.43,
     "avg": 54.25,
     "max": 64.5
    }
   },
   {
    "id": 4681,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo (nastava na srpskom jeziku) (041625-MS)",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 14,
     "min": 53.58,
     "avg": 66.83,
     "max": 76.74
    }
   }
  ]
 },
 {
  "id": 300,
  "name": "Gimnazija Županja",
  "city": "Županja",
  "county": "Vukovarsko-srijemska",
  "programs": [
   {
    "id": 3009,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 40,
     "upisani": 37,
     "min": 40.59,
     "avg": 73,
     "max": 81.63
    }
   },
   {
    "id": 3010,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 13,
     "min": 66.83,
     "avg": 75.54,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 2243,
  "name": "Obrtničko-industrijska škola",
  "city": "Županja",
  "county": "Vukovarsko-srijemska",
  "programs": [
   {
    "id": 3593,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 8,
     "min": 23.52,
     "avg": 27.7,
     "max": 33.92
    }
   },
   {
    "id": 3594,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 9,
     "min": 25.15,
     "avg": 28.79,
     "max": 32.93
    }
   },
   {
    "id": 3595,
    "name": "Elektromehaničar/Elektromehaničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 2,
     "min": 26.79,
     "avg": 29.4,
     "max": 32.01
    }
   },
   {
    "id": 3596,
    "name": "Fitomedicinski tehničar / Fitomedicinska tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 39.83,
     "avg": 52.43,
     "max": 63.63
    }
   },
   {
    "id": 3597,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 25.76,
     "avg": 29.65,
     "max": 36.45
    }
   },
   {
    "id": 3598,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 5,
     "min": 28.83,
     "avg": 32.12,
     "max": 35.55
    }
   },
   {
    "id": 3599,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 11,
     "min": 24.33,
     "avg": 30.31,
     "max": 38.79
    }
   },
   {
    "id": 3600,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 6,
     "min": 24.6,
     "avg": 30.78,
     "max": 36.6
    }
   },
   {
    "id": 3601,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 10,
     "min": 23.46,
     "avg": 28.37,
     "max": 34.57
    }
   },
   {
    "id": 3602,
    "name": "Pomoćni cvjećar/Pomoćna cvjećarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 4,
     "upisani": 2,
     "min": 1.039,
     "avg": 39.86,
     "max": 40.4
    }
   },
   {
    "id": 3603,
    "name": "Pomoćni kuhar/Pomoćna kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": 1,
     "min": 1.043,
     "avg": 43.33,
     "max": 43.33
    }
   },
   {
    "id": 3604,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 58.41,
     "avg": 66.48,
     "max": 77.18
    }
   }
  ]
 },
 {
  "id": 301,
  "name": "Tehnička škola Županja",
  "city": "Županja",
  "county": "Vukovarsko-srijemska",
  "programs": [
   {
    "id": 4727,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 18,
     "min": 49.46,
     "avg": 62.11,
     "max": 77.79
    }
   },
   {
    "id": 4728,
    "name": "Tehničar za električne strojeve i elektroenergetiku / Tehničarka za električne strojeve i elektroenergetiku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 55.76,
     "avg": 66.38,
     "max": 73.71
    }
   }
  ]
 },
 {
  "id": 2287,
  "name": "Srednja škola Kneza Branimira",
  "city": "Benkovac",
  "county": "Zadarska",
  "programs": [
   {
    "id": 4177,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 13,
     "min": 23.55,
     "avg": 25.46,
     "max": 31.42
    }
   },
   {
    "id": 4178,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 16,
     "min": 23.94,
     "avg": 27.08,
     "max": 35.43
    }
   },
   {
    "id": 4179,
    "name": "Oblagač podova i zidova/Oblagačica podova i zidova",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 10,
     "min": 22.98,
     "avg": 28.49,
     "max": 37.65
    }
   },
   {
    "id": 4180,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 4,
     "min": 61.33,
     "avg": 65.64,
     "max": 72.33
    }
   },
   {
    "id": 4181,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 3,
     "min": 22.85,
     "avg": 23.69,
     "max": 24.8
    }
   },
   {
    "id": 4182,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 4,
     "min": 22.68,
     "avg": 26.98,
     "max": 32.73
    }
   },
   {
    "id": 4183,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 11,
     "min": 44.08,
     "avg": 48.62,
     "max": 57.88
    }
   },
   {
    "id": 4184,
    "name": "Serviser karoserije motornih vozila/Serviserka karoserije motornih vozila",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 9,
     "min": 22.49,
     "avg": 23.29,
     "max": 25.97
    }
   },
   {
    "id": 4185,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 7,
     "min": 46.45,
     "avg": 54.14,
     "max": 60.77
    }
   }
  ]
 },
 {
  "id": 244,
  "name": "Srednja škola Biograd na Moru",
  "city": "Biograd na Moru",
  "county": "Zadarska",
  "programs": [
   {
    "id": 4005,
    "name": "Brodograditelj/Brodograditeljica",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 6,
     "min": 23.77,
     "avg": 24.5,
     "max": 25.45
    }
   },
   {
    "id": 4006,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 6,
     "min": 25.02,
     "avg": 26.41,
     "max": 29.01
    }
   },
   {
    "id": 4007,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 26.32,
     "avg": 31.51,
     "max": 38.58
    }
   },
   {
    "id": 4008,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 15,
     "min": 24.46,
     "avg": 28.52,
     "max": 40.9
    }
   },
   {
    "id": 4009,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 4,
     "min": 67.27,
     "avg": 72.15,
     "max": 74.88
    }
   },
   {
    "id": 4010,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 5,
     "min": 23.55,
     "avg": 27.94,
     "max": 35.71
    }
   },
   {
    "id": 4011,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 14,
     "min": 54.54,
     "avg": 62.92,
     "max": 78.54
    }
   }
  ]
 },
 {
  "id": 246,
  "name": "Srednja škola Obrovac",
  "city": "Obrovac",
  "county": "Zadarska",
  "programs": [
   {
    "id": 4274,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 7,
     "min": 23.63,
     "avg": 28.97,
     "max": 37.03
    }
   },
   {
    "id": 4275,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 6,
     "min": 70.59,
     "avg": 76.29,
     "max": 80
    }
   },
   {
    "id": 4276,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 7,
     "min": 23.21,
     "avg": 28.02,
     "max": 45.71
    }
   },
   {
    "id": 4277,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 8,
     "min": 36.83,
     "avg": 44.01,
     "max": 50.95
    }
   }
  ]
 },
 {
  "id": 2192,
  "name": "Ekonomsko-birotehnička i trgovačka škola",
  "city": "Zadar",
  "county": "Zadarska",
  "programs": [
   {
    "id": 2851,
    "name": "Komercijalist / Komercijalistica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 54.82,
     "avg": 58.5,
     "max": 63.57
    }
   },
   {
    "id": 2852,
    "name": "Opća gimnazija (odjel za sportaše) (320104-S)",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 119.46,
     "avg": 67.77,
     "max": 160.77
    }
   },
   {
    "id": 2853,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 23,
     "min": 24.39,
     "avg": 29.09,
     "max": 48.89
    }
   },
   {
    "id": 2854,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 48,
     "upisani": 48,
     "min": 57.69,
     "avg": 64.37,
     "max": 74.98
    }
   },
   {
    "id": 2855,
    "name": "Upravno-poslovni referent / Upravno-poslovna referentica",
    "sector": "Pravo, politologija, sociologija, državna uprava i javni poslovi",
    "prag": {
     "year": "2025/2026",
     "kvota": 48,
     "upisani": 47,
     "min": 49.49,
     "avg": 58.05,
     "max": 77.57
    }
   }
  ]
 },
 {
  "id": 248,
  "name": "Gimnazija Franje Petrića Zadar",
  "city": "Zadar",
  "county": "Zadarska",
  "programs": [
   {
    "id": 2941,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 42,
     "min": 65.48,
     "avg": 73.92,
     "max": 80
    }
   },
   {
    "id": 2942,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 52,
     "min": 76.64,
     "avg": 79.21,
     "max": 82
    }
   }
  ]
 },
 {
  "id": 2206,
  "name": "Gimnazija Jurja Barakovića",
  "city": "Zadar",
  "county": "Zadarska",
  "programs": [
   {
    "id": 2961,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 104,
     "upisani": 104,
     "min": 75.2,
     "avg": 77.76,
     "max": 80
    }
   },
   {
    "id": 2962,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 23,
     "min": 78.85,
     "avg": 79.39,
     "max": 81
    }
   }
  ]
 },
 {
  "id": 1740,
  "name": "Gimnazija Vladimira Nazora",
  "city": "Zadar",
  "county": "Zadarska",
  "programs": [
   {
    "id": 3001,
    "name": "Jezična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 35,
     "min": 65.09,
     "avg": 71.06,
     "max": 79.84
    }
   },
   {
    "id": 3002,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 78,
     "upisani": 78,
     "min": 67.95,
     "avg": 73.66,
     "max": 81.72
    }
   }
  ]
 },
 {
  "id": 2208,
  "name": "Glazbena škola Blagoje Bersa Zadar",
  "city": "Zadar",
  "county": "Zadarska",
  "programs": [
   {
    "id": 3018,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   }
  ]
 },
 {
  "id": 1494,
  "name": "Hotelijersko-turistička i ugostiteljska škola",
  "city": "Zadar",
  "county": "Zadarska",
  "programs": [
   {
    "id": 3319,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 19,
     "min": 25.84,
     "avg": 28.24,
     "max": 31.67
    }
   },
   {
    "id": 3320,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 39,
     "upisani": 39,
     "min": 25.25,
     "avg": 30.06,
     "max": 37.77
    }
   },
   {
    "id": 3321,
    "name": "Pomoćni konobar/Pomoćna konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": 1,
     "min": 1.036,
     "avg": 36.14,
     "max": 36.14
    }
   },
   {
    "id": 3322,
    "name": "Pomoćni kuhar/Pomoćna kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 3,
     "min": 1.034,
     "avg": 40.73,
     "max": 44.45
    }
   },
   {
    "id": 3323,
    "name": "Slastičar/Slastičarka",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 19,
     "min": 27.06,
     "avg": 30.26,
     "max": 33.24
    }
   },
   {
    "id": 3324,
    "name": "Tehničar za ugostiteljstvo / Tehničarka za ugostiteljstvo",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 38,
     "upisani": 38,
     "min": 51.05,
     "avg": 56.79,
     "max": 78.51
    }
   },
   {
    "id": 3325,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 40,
     "upisani": 40,
     "min": 52.97,
     "avg": 59.84,
     "max": 78.76
    }
   }
  ]
 },
 {
  "id": 2230,
  "name": "Katolička gimnazija Ivana Pavla II.",
  "city": "Zadar",
  "county": "Zadarska",
  "programs": [
   {
    "id": 3426,
    "name": "Klasična gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 23,
     "min": 64.21,
     "avg": 67.51,
     "max": 72.39
    }
   },
   {
    "id": 3427,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 19,
     "upisani": 19,
     "min": 73.14,
     "avg": 75.57,
     "max": 80.41
    }
   },
   {
    "id": 3428,
    "name": "Prirodoslovna gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 60.08,
     "avg": 69.97,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 1761,
  "name": "Medicinska škola Ante Kuzmanića - Zadar",
  "city": "Zadar",
  "county": "Zadarska",
  "programs": [
   {
    "id": 3444,
    "name": "Dentalna asistentica/asistent",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 69.66,
     "avg": 71.47,
     "max": 77.78
    }
   },
   {
    "id": 3445,
    "name": "Medicinska sestra opće njege/medicinski tehničar opće njege",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 56,
     "upisani": 44,
     "min": 56.07,
     "avg": 63.11,
     "max": 76.04
    }
   },
   {
    "id": 3446,
    "name": "Zdravstveno-laboratorijski tehničar",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 65.19,
     "avg": 69.92,
     "max": 79.6
    }
   }
  ]
 },
 {
  "id": 254,
  "name": "Obrtnička škola Gojka Matuline Zadar",
  "city": "Zadar",
  "county": "Zadarska",
  "programs": [
   {
    "id": 3535,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 48,
     "upisani": 48,
     "min": 30.83,
     "avg": 35.19,
     "max": 47.3
    }
   },
   {
    "id": 3536,
    "name": "Kozmetičar / Kozmetičarka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 61.65,
     "avg": 67.04,
     "max": 77.11
    }
   }
  ]
 },
 {
  "id": 2247,
  "name": "Poljoprivredna, prehrambena i veterinarska škola Stanka Ožanića",
  "city": "Zadar",
  "county": "Zadarska",
  "programs": [
   {
    "id": 3625,
    "name": "Agroturistički tehničar / Agroturistička tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 47.6,
     "avg": 52.91,
     "max": 76.69
    }
   },
   {
    "id": 3626,
    "name": "Cvjećar/Cvjećarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 22.5,
     "avg": 26.45,
     "max": 32.73
    }
   },
   {
    "id": 3627,
    "name": "Fitomedicinski tehničar / Fitomedicinska tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 11,
     "min": 45.7,
     "avg": 49.56,
     "max": 52.79
    }
   },
   {
    "id": 3628,
    "name": "Mesar/Mesarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 8,
     "min": 22.85,
     "avg": 25.63,
     "max": 28.71
    }
   },
   {
    "id": 3629,
    "name": "Pekar-slastičar/Pekarica-slastičarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 22.98,
     "avg": 27.2,
     "max": 40.99
    }
   },
   {
    "id": 3630,
    "name": "Pomoćni cvjećar/Pomoćna cvjećarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 5,
     "min": 1.038,
     "avg": 45.26,
     "max": 50
    }
   },
   {
    "id": 3631,
    "name": "Pomoćni pekar/Pomoćna pekarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 3,
     "min": 1.024,
     "avg": 32.08,
     "max": 42.63
    }
   },
   {
    "id": 3632,
    "name": "Tehničar nutricionist / Tehničarka nutricionistica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 23,
     "min": 57.17,
     "avg": 63.2,
     "max": 79.93
    }
   },
   {
    "id": 3633,
    "name": "Veterinarski tehničar / Veterinarska tehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 49.23,
     "avg": 57.22,
     "max": 77.78
    }
   }
  ]
 },
 {
  "id": 252,
  "name": "Pomorska škola Zadar",
  "city": "Zadar",
  "county": "Zadarska",
  "programs": [
   {
    "id": 3648,
    "name": "Pomorski nautičar / Pomorska nautičarka",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 45,
     "upisani": 45,
     "min": 46.3,
     "avg": 61,
     "max": 77.4
    }
   },
   {
    "id": 3649,
    "name": "Tehničar za brodostrojarstvo / Tehničarka za brodostrojarstvo",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 45,
     "upisani": 35,
     "min": 46.62,
     "avg": 53.47,
     "max": 68.46
    }
   }
  ]
 },
 {
  "id": 2251,
  "name": "Prirodoslovno-grafička škola",
  "city": "Zadar",
  "county": "Zadarska",
  "programs": [
   {
    "id": 3682,
    "name": "Dizajner grafičkih proizvoda / Dizajnerica grafičkih proizvoda",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 60.77,
     "avg": 67.17,
     "max": 79.23
    }
   },
   {
    "id": 3683,
    "name": "Medijski tehničar / Medijska tehničarka",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 62.76,
     "avg": 68,
     "max": 74.83
    }
   },
   {
    "id": 3684,
    "name": "Prirodoslovna gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 31,
     "min": 34.84,
     "avg": 53.7,
     "max": 77.59
    }
   },
   {
    "id": 3685,
    "name": "Tehničar za razvoj i dizajn web sučelja / Tehničarka za razvoj i dizajn web sučelja",
    "sector": "Grafička tehnologija i audio - vizualno oblikovanje",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 63.64,
     "avg": 68.73,
     "max": 76.44
    }
   }
  ]
 },
 {
  "id": 2255,
  "name": "Privatna gimnazija NOVA s pravom javnosti",
  "city": "Zadar",
  "county": "Zadarska",
  "programs": [
   {
    "id": 3700,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 48,
     "upisani": 22,
     "min": 38.59,
     "avg": 58.06,
     "max": 78.18
    }
   }
  ]
 },
 {
  "id": 1834,
  "name": "Strukovna škola Vice Vlatkovića",
  "city": "Zadar",
  "county": "Zadarska",
  "programs": [
   {
    "id": 4502,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 35,
     "upisani": 35,
     "min": 29.08,
     "avg": 33.59,
     "max": 41.03
    }
   },
   {
    "id": 4503,
    "name": "Drvodjeljski tehničar i dizajner / Drvodjeljska tehničarka i dizajnerica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 54.63,
     "avg": 57.6,
     "max": 61.26
    }
   },
   {
    "id": 4504,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 15,
     "upisani": 15,
     "min": 34.79,
     "avg": 35.86,
     "max": 40.42
    }
   },
   {
    "id": 4505,
    "name": "Elektromehaničar/Elektromehaničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 9,
     "min": 30.83,
     "avg": 32.29,
     "max": 35.43
    }
   },
   {
    "id": 4506,
    "name": "Izrađivač-monter strojarskih konstrukcija/Izrađivačica-monterka strojarskih konstrukcija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 13,
     "min": 24.58,
     "avg": 26.74,
     "max": 30.4
    }
   },
   {
    "id": 4507,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 32.21,
     "avg": 35.85,
     "max": 45.25
    }
   },
   {
    "id": 4508,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 27.56,
     "avg": 29.94,
     "max": 36.01
    }
   },
   {
    "id": 4509,
    "name": "Serviser karoserije motornih vozila/Serviserka karoserije motornih vozila",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 11,
     "upisani": 11,
     "min": 25.29,
     "avg": 28.19,
     "max": 31.69
    }
   },
   {
    "id": 4510,
    "name": "Soboslikar ličilac dekorater/Soboslikarica ličiteljica dekoraterka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 26.23,
     "avg": 28.39,
     "max": 33.91
    }
   },
   {
    "id": 4511,
    "name": "Stolar/Stolarica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 13,
     "min": 27.86,
     "avg": 31.58,
     "max": 40.06
    }
   },
   {
    "id": 4512,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 64.35,
     "avg": 72.8,
     "max": 80
    }
   },
   {
    "id": 4513,
    "name": "Tehničar za vozila / Tehničarka za vozila",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 60.83,
     "avg": 61.63,
     "max": 64.42
    }
   },
   {
    "id": 4514,
    "name": "Vozač motornog vozila/Vozačica motornog vozila",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 26.82,
     "avg": 29.24,
     "max": 34.94
    }
   }
  ]
 },
 {
  "id": 259,
  "name": "Škola primijenjene umjetnosti i dizajna Zadar",
  "city": "Zadar",
  "county": "Zadarska",
  "programs": [
   {
    "id": 4880,
    "name": "Likovna umjetnost i dizajn do izbora zanimanja (program A) (300100-A)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 18,
     "min": 111.36,
     "avg": 53.52,
     "max": 184.26
    }
   },
   {
    "id": 4526,
    "name": "Likovna umjetnost i dizajn do izbora zanimanja (program B) (300100-B)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 40,
     "upisani": 34,
     "min": 119.28,
     "avg": 59.02,
     "max": 200
    }
   },
   {
    "id": 4527,
    "name": "Modni krojač/Modna krojačica",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 13,
     "min": 21.94,
     "avg": 26.08,
     "max": 33.13
    }
   }
  ]
 },
 {
  "id": 255,
  "name": "Tehnička škola Zadar",
  "city": "Zadar",
  "county": "Zadarska",
  "programs": [
   {
    "id": 4898,
    "name": "Arhitektonski tehničar / Arhitektonska tehničarka",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 76.37,
     "avg": 78.48,
     "max": 80.63
    }
   },
   {
    "id": 4896,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 64.6,
     "avg": 68.66,
     "max": 78.63
    }
   },
   {
    "id": 4743,
    "name": "Tehničar za elektroniku i komunikacije / Tehničarka za elektroniku i komunikacije",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 66.71,
     "avg": 69.83,
     "max": 80
    }
   },
   {
    "id": 4736,
    "name": "Tehničar za mehatroniku / Tehničarka za mehatroniku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 23,
     "min": 70.86,
     "avg": 72.77,
     "max": 79.72
    }
   },
   {
    "id": 4744,
    "name": "Zrakoplovni tehničar / Zrakoplovna tehničarka",
    "sector": "Zrakoplovstvo, raketna i svemirska tehnika",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 67.37,
     "avg": 71.49,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 112,
  "name": "CENTAR ZA ODGOJ I OBRAZOVANJE LUG",
  "city": "Bregana",
  "county": "Zagrebačka",
  "programs": [
   {
    "id": 2739,
    "name": "Pomoćni radnik za uređenje interijera/Pomoćna radnica za uređenje interijera",
    "sector": "Graditeljstvo i geodezija",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 3,
     "min": 30.04,
     "avg": 30.04,
     "max": 30.04
    }
   }
  ]
 },
 {
  "id": 2158,
  "name": "Glazbena škola Dugo Selo",
  "city": "Dugo Selo",
  "county": "Zagrebačka",
  "programs": [
   {
    "id": 3090,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 15,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   }
  ]
 },
 {
  "id": 45,
  "name": "Srednja škola Dugo Selo",
  "city": "Dugo Selo",
  "county": "Zagrebačka",
  "programs": [
   {
    "id": 4071,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 11,
     "upisani": 11,
     "min": 32.19,
     "avg": 35.11,
     "max": 41.02
    }
   },
   {
    "id": 4072,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 23,
     "min": 28.96,
     "avg": 32.58,
     "max": 40.37
    }
   },
   {
    "id": 4073,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 31.13,
     "avg": 33.31,
     "max": 40.97
    }
   },
   {
    "id": 4074,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 32.15,
     "avg": 34.17,
     "max": 36.12
    }
   },
   {
    "id": 4075,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 51,
     "upisani": 27,
     "min": 61.01,
     "avg": 71.58,
     "max": 80
    }
   },
   {
    "id": 4076,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 64.24,
     "avg": 71.46,
     "max": 80
    }
   },
   {
    "id": 4077,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 16,
     "min": 56.54,
     "avg": 63.22,
     "max": 76.27
    }
   },
   {
    "id": 4078,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 48,
     "upisani": 35,
     "min": 55.01,
     "avg": 62.61,
     "max": 78.68
    }
   }
  ]
 },
 {
  "id": 107,
  "name": "Srednja škola Ivan Švear Ivanić-Grad",
  "city": "Ivanić-Grad",
  "county": "Zagrebačka",
  "programs": [
   {
    "id": 4124,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 26.42,
     "avg": 29.99,
     "max": 36.41
    }
   },
   {
    "id": 4125,
    "name": "Elektromehaničar/Elektromehaničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 9,
     "min": 24.11,
     "avg": 27.76,
     "max": 30.61
    }
   },
   {
    "id": 4126,
    "name": "Fizioterapeutski tehničar / fizioterapeutska tehničarka",
    "sector": "Zdravstvo i socijalna skrb",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 62.15,
     "avg": 66.57,
     "max": 75.47
    }
   },
   {
    "id": 4127,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 19,
     "min": 30.39,
     "avg": 33.84,
     "max": 41.54
    }
   },
   {
    "id": 4128,
    "name": "Komercijalist / Komercijalistica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 51.66,
     "avg": 57.64,
     "max": 73
    }
   },
   {
    "id": 4129,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 13,
     "min": 65.5,
     "avg": 73.54,
     "max": 80
    }
   },
   {
    "id": 4889,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 41,
     "min": 53.29,
     "avg": 71.9,
     "max": 83
    }
   },
   {
    "id": 4130,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 14,
     "min": 24.06,
     "avg": 28.61,
     "max": 34.14
    }
   },
   {
    "id": 4131,
    "name": "Pomoćni administrator/Pomoćna administratorica",
    "sector": "Pravo, politologija, sociologija, državna uprava i javni poslovi",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 5,
     "min": 1.027,
     "avg": 43.28,
     "max": 49.65
    }
   },
   {
    "id": 4132,
    "name": "Pomoćni bravar/Pomoćna bravarica",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 2,
     "min": 1.038,
     "avg": 39.44,
     "max": 40.44
    }
   },
   {
    "id": 4133,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 23,
     "upisani": 23,
     "min": 60.49,
     "avg": 68.96,
     "max": 78.64
    }
   },
   {
    "id": 4134,
    "name": "Tehničar za električne strojeve i elektroenergetiku / Tehničarka za električne strojeve i elektroenergetiku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 20,
     "min": 61.47,
     "avg": 65.64,
     "max": 75.73
    }
   }
  ]
 },
 {
  "id": 108,
  "name": "Srednja škola Jastrebarsko",
  "city": "Jastrebarsko",
  "county": "Zagrebačka",
  "programs": [
   {
    "id": 4155,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 26.66,
     "avg": 32.63,
     "max": 42.08
    }
   },
   {
    "id": 4156,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 25.33,
     "avg": 27.63,
     "max": 31.69
    }
   },
   {
    "id": 4157,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 49,
     "upisani": 27,
     "min": 56.26,
     "avg": 70.45,
     "max": 80.68
    }
   },
   {
    "id": 4158,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 25,
     "upisani": 25,
     "min": 46.72,
     "avg": 60.49,
     "max": 72.77
    }
   },
   {
    "id": 4159,
    "name": "Tehničar prometne logistike / Tehničarka prometne logistike",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 35.06,
     "avg": 52.61,
     "max": 68.01
    }
   }
  ]
 },
 {
  "id": 2191,
  "name": "Ekonomska, trgovačka i ugostiteljska škola",
  "city": "Samobor",
  "county": "Zagrebačka",
  "programs": [
   {
    "id": 2847,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 15,
     "min": 27.5,
     "avg": 30.36,
     "max": 37.83
    }
   },
   {
    "id": 2848,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 52,
     "min": 58.95,
     "avg": 65.73,
     "max": 78.74
    }
   },
   {
    "id": 2849,
    "name": "Slastičar/Slastičarka",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 29.64,
     "avg": 34.42,
     "max": 44.5
    }
   },
   {
    "id": 2850,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 52,
     "min": 56.51,
     "avg": 61.15,
     "max": 72.37
    }
   }
  ]
 },
 {
  "id": 110,
  "name": "Gimnazija Antuna Gustava Matoša Samobor",
  "city": "Samobor",
  "county": "Zagrebačka",
  "programs": [
   {
    "id": 4891,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 82,
     "upisani": 57,
     "min": 70.34,
     "avg": 75.68,
     "max": 80.86
    }
   }
  ]
 },
 {
  "id": 1955,
  "name": "Glazbena škola Ferdo Livadić",
  "city": "Samobor",
  "county": "Zagrebačka",
  "programs": [
   {
    "id": 3091,
    "name": "Glazbenik - pripremno obrazovanje",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3092,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   }
  ]
 },
 {
  "id": 111,
  "name": "Srednja strukovna škola",
  "city": "Samobor",
  "county": "Zagrebačka",
  "programs": [
   {
    "id": 3867,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 13,
     "min": 31.58,
     "avg": 35.52,
     "max": 48.03
    }
   },
   {
    "id": 3882,
    "name": "Dizajner cipela i modnih dodataka / Dizajnerica cipela i modnih dodataka",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 5,
     "min": 46.01,
     "avg": 52.4,
     "max": 58.29
    }
   },
   {
    "id": 3875,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 13,
     "min": 28.78,
     "avg": 33.3,
     "max": 41.69
    }
   },
   {
    "id": 3876,
    "name": "Elektromehaničar/Elektromehaničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 11,
     "min": 26.98,
     "avg": 30.5,
     "max": 38.04
    }
   },
   {
    "id": 3885,
    "name": "Mesar/Mesarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 4,
     "min": 24.51,
     "avg": 28.29,
     "max": 35.13
    }
   },
   {
    "id": 3886,
    "name": "Modni galanterist/Modna galanteristica",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 5,
     "upisani": 5,
     "min": 28.63,
     "avg": 32.73,
     "max": 39.2
    }
   },
   {
    "id": 3887,
    "name": "Modni krojač/Modna krojačica",
    "sector": "Tekstil i koža",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 5,
     "min": 23.29,
     "avg": 30.02,
     "max": 35.46
    }
   },
   {
    "id": 3871,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 13,
     "min": 27.73,
     "avg": 32.96,
     "max": 49.64
    }
   },
   {
    "id": 3878,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 13,
     "min": 26.66,
     "avg": 30.22,
     "max": 35.13
    }
   },
   {
    "id": 3892,
    "name": "Pomoćni stolar/Pomoćna stolarica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 3,
     "upisani": 3,
     "min": 1.022,
     "avg": 25.01,
     "max": 26.08
    }
   },
   {
    "id": 3895,
    "name": "Stolar/Stolarica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 11,
     "min": 23.37,
     "avg": 28.45,
     "max": 40.4
    }
   },
   {
    "id": 3879,
    "name": "Tehničar za mehatroniku / Tehničarka za mehatroniku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 70.54,
     "avg": 73.32,
     "max": 80
    }
   },
   {
    "id": 3880,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 39,
     "upisani": 30,
     "min": 64.69,
     "avg": 70.19,
     "max": 76.5
    }
   },
   {
    "id": 3881,
    "name": "Vozač motornog vozila/Vozačica motornog vozila",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 27.79,
     "avg": 32.11,
     "max": 40.01
    }
   }
  ]
 },
 {
  "id": 2177,
  "name": "Srednja strukovna škola Samobor",
  "city": "Samobor",
  "county": "Zagrebačka",
  "programs": [
   {
    "id": 4883,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 13,
     "min": 31.77,
     "avg": 35.31,
     "max": 40.19
    }
   },
   {
    "id": 4905,
    "name": "Kozmetičar / Kozmetičarka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 3,
     "min": 64.41,
     "avg": 66.78,
     "max": 69
    }
   }
  ]
 },
 {
  "id": 2283,
  "name": "Srednja škola Dragutina Stražimira",
  "city": "Sveti Ivan Zelina",
  "county": "Zagrebačka",
  "programs": [
   {
    "id": 4060,
    "name": "Agrotehničar / Agrotehničarka",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 15,
     "min": 43.68,
     "avg": 51.9,
     "max": 66.65
    }
   },
   {
    "id": 4061,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 9,
     "min": 27.79,
     "avg": 31.89,
     "max": 46.81
    }
   },
   {
    "id": 4062,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 24.9,
     "avg": 27.81,
     "max": 36.03
    }
   },
   {
    "id": 4063,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 12,
     "min": 29.38,
     "avg": 32.56,
     "max": 45.64
    }
   },
   {
    "id": 4064,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 24.1,
     "avg": 28.25,
     "max": 33.84
    }
   },
   {
    "id": 4065,
    "name": "Stolar/Stolarica",
    "sector": "Šumarstvo, prerada i obrada drva",
    "prag": {
     "year": "2025/2026",
     "kvota": 9,
     "upisani": 5,
     "min": 23.42,
     "avg": 29.8,
     "max": 38.07
    }
   },
   {
    "id": 4066,
    "name": "Tehničar za električne strojeve i elektroenergetiku / Tehničarka za električne strojeve i elektroenergetiku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 12,
     "min": 49.32,
     "avg": 56.96,
     "max": 74.52
    }
   }
  ]
 },
 {
  "id": 113,
  "name": "Ekonomska škola Velika Gorica",
  "city": "Velika Gorica",
  "county": "Zagrebačka",
  "programs": [
   {
    "id": 2839,
    "name": "Komercijalist / Komercijalistica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 57.49,
     "avg": 60.47,
     "max": 71.85
    }
   },
   {
    "id": 2840,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 78,
     "upisani": 76,
     "min": 58.87,
     "avg": 66.29,
     "max": 79.66
    }
   }
  ]
 },
 {
  "id": 114,
  "name": "Gimnazija Velika Gorica",
  "city": "Velika Gorica",
  "county": "Zagrebačka",
  "programs": [
   {
    "id": 2999,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 112,
     "upisani": 112,
     "min": 50.27,
     "avg": 68.5,
     "max": 81
    }
   },
   {
    "id": 3000,
    "name": "Prirodoslovno-matematička gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 28,
     "upisani": 28,
     "min": 73.77,
     "avg": 77.54,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 115,
  "name": "Srednja strukovna škola Velika Gorica",
  "city": "Velika Gorica",
  "county": "Zagrebačka",
  "programs": [
   {
    "id": 3843,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 39,
     "upisani": 38,
     "min": 22.81,
     "avg": 32.1,
     "max": 46.76
    }
   },
   {
    "id": 3844,
    "name": "Elektroinstalater/Elektroinstalaterka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 13,
     "min": 25.66,
     "avg": 29.23,
     "max": 33.81
    }
   },
   {
    "id": 3845,
    "name": "Elektromehaničar/Elektromehaničarka",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 13,
     "min": 26.76,
     "avg": 29.35,
     "max": 34.83
    }
   },
   {
    "id": 3846,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 13,
     "min": 32.23,
     "avg": 35.5,
     "max": 42.35
    }
   },
   {
    "id": 3847,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 12,
     "min": 25.89,
     "avg": 27.68,
     "max": 34.5
    }
   },
   {
    "id": 3848,
    "name": "Kozmetičar / Kozmetičarka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 5,
     "min": 62.4,
     "avg": 63.67,
     "max": 66.5
    }
   },
   {
    "id": 3849,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 11,
     "min": 29.18,
     "avg": 33.89,
     "max": 47.61
    }
   },
   {
    "id": 3850,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 25,
     "min": 24.12,
     "avg": 32.24,
     "max": 40.33
    }
   },
   {
    "id": 3851,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 27.76,
     "avg": 31.63,
     "max": 40.91
    }
   },
   {
    "id": 3852,
    "name": "Pomoćni kuhar/Pomoćna kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 7,
     "min": 1.027,
     "avg": 35.92,
     "max": 47.9
    }
   },
   {
    "id": 3853,
    "name": "Tehničar u strojarstvu / Tehničarka u strojarstvu",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 39,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 3854,
    "name": "Tehničar za mehatroniku / Tehničarka za mehatroniku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 39,
     "upisani": 28,
     "min": 62.15,
     "avg": 67.46,
     "max": 74.17
    }
   }
  ]
 },
 {
  "id": 2032,
  "name": "Umjetnička škola Franje Lučića",
  "city": "Velika Gorica",
  "county": "Zagrebačka",
  "programs": [
   {
    "id": 4805,
    "name": "Glazbenik - pripremno obrazovanje",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 15,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 4806,
    "name": "Glazbenik - program srednje škole (X290004)",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 25,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 4807,
    "name": "Glazbenik - teorijski smjer",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 2,
     "upisani": 1,
     "min": 1.221,
     "avg": 69.48,
     "max": 221.48
    }
   },
   {
    "id": 4808,
    "name": "Glazbenik klavirist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 4809,
    "name": "Glazbenik oboist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 4810,
    "name": "Glazbenik saksofonist",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 4811,
    "name": "Glazbenik tamburaš",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   },
   {
    "id": 4812,
    "name": "Scenski plesač",
    "sector": "Umjetnost",
    "prag": {
     "year": "2025/2026",
     "kvota": 1,
     "upisani": null,
     "min": 0,
     "avg": 0,
     "max": 0
    }
   }
  ]
 },
 {
  "id": 2338,
  "name": "Zrakoplovna tehnička škola Rudolfa Perešina",
  "city": "Velika Gorica",
  "county": "Zagrebačka",
  "programs": [
   {
    "id": 4861,
    "name": "Tehničar za zračni promet / Tehničarka za zračni promet",
    "sector": "Promet i logistika",
    "prag": {
     "year": "2025/2026",
     "kvota": 28,
     "upisani": 28,
     "min": 62.53,
     "avg": 67.41,
     "max": 75.94
    }
   },
   {
    "id": 4862,
    "name": "Zrakoplovni tehničar / Zrakoplovna tehničarka",
    "sector": "Zrakoplovstvo, raketna i svemirska tehnika",
    "prag": {
     "year": "2025/2026",
     "kvota": 55,
     "upisani": 55,
     "min": 68.22,
     "avg": 71.51,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 116,
  "name": "Srednja škola Vrbovec",
  "city": "Vrbovec",
  "county": "Zagrebačka",
  "programs": [
   {
    "id": 4379,
    "name": "Automehatroničar/Automehatroničarka",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 31,
     "avg": 33.92,
     "max": 39.52
    }
   },
   {
    "id": 4380,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 7,
     "upisani": 7,
     "min": 23.99,
     "avg": 27.25,
     "max": 34.93
    }
   },
   {
    "id": 4381,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 14,
     "upisani": 14,
     "min": 24.39,
     "avg": 29.06,
     "max": 37.16
    }
   },
   {
    "id": 4382,
    "name": "Mesar/Mesarica",
    "sector": "Poljoprivreda, prehrana i veterina",
    "prag": {
     "year": "2025/2026",
     "kvota": 6,
     "upisani": 5,
     "min": 23.77,
     "avg": 26.57,
     "max": 34.04
    }
   },
   {
    "id": 4383,
    "name": "Monter strojarskih instalacija/Monterka strojarskih instalacija",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 12,
     "upisani": 12,
     "min": 28.24,
     "avg": 32.37,
     "max": 43.89
    }
   },
   {
    "id": 4384,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 22,
     "min": 47.78,
     "avg": 65.2,
     "max": 80
    }
   },
   {
    "id": 4385,
    "name": "Operater za strojne obrade/Operaterka za strojne obrade",
    "sector": "Strojarstvo, brodogradnja i metalurgija",
    "prag": {
     "year": "2025/2026",
     "kvota": 20,
     "upisani": 19,
     "min": 24.54,
     "avg": 29.46,
     "max": 38.18
    }
   },
   {
    "id": 4386,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 16,
     "upisani": 16,
     "min": 24.54,
     "avg": 28.74,
     "max": 33.39
    }
   },
   {
    "id": 4387,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 22,
     "upisani": 22,
     "min": 51.61,
     "avg": 61.26,
     "max": 78.79
    }
   },
   {
    "id": 4388,
    "name": "Tehničar za mehatroniku / Tehničarka za mehatroniku",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 24,
     "upisani": 24,
     "min": 45.14,
     "avg": 57.59,
     "max": 80
    }
   }
  ]
 },
 {
  "id": 2281,
  "name": "Srednja škola Ban Josip Jelačić",
  "city": "Zaprešić",
  "county": "Zagrebačka",
  "programs": [
   {
    "id": 3969,
    "name": "Frizer/Frizerka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 13,
     "min": 31.54,
     "avg": 35.24,
     "max": 42.48
    }
   },
   {
    "id": 3970,
    "name": "Konobar/Konobarica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 27,
     "avg": 30.28,
     "max": 40.14
    }
   },
   {
    "id": 3971,
    "name": "Kozmetičar / Kozmetičarka",
    "sector": "Osobne, usluge zaštite i druge usluge",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 57.9,
     "avg": 62.31,
     "max": 71.9
    }
   },
   {
    "id": 3972,
    "name": "Kuhar/Kuharica",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 10,
     "upisani": 10,
     "min": 32.79,
     "avg": 36.53,
     "max": 42.81
    }
   },
   {
    "id": 3973,
    "name": "Opća gimnazija",
    "sector": "Nema sektora",
    "prag": {
     "year": "2025/2026",
     "kvota": 52,
     "upisani": 52,
     "min": 67.04,
     "avg": 73.5,
     "max": 80
    }
   },
   {
    "id": 3974,
    "name": "Prodavač/Prodavačica",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 13,
     "upisani": 13,
     "min": 27.77,
     "avg": 34.21,
     "max": 45.04
    }
   },
   {
    "id": 3975,
    "name": "Referent za poslovnu ekonomiju / Referentica za poslovnu ekonomiju",
    "sector": "Ekonomija, trgovina i poslovna administracija",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 63.55,
     "avg": 71.24,
     "max": 80
    }
   },
   {
    "id": 3976,
    "name": "Slastičar/Slastičarka",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 8,
     "upisani": 8,
     "min": 29.58,
     "avg": 37.58,
     "max": 47.41
    }
   },
   {
    "id": 3977,
    "name": "Tehničar za računarstvo / Tehničarka za računarstvo",
    "sector": "Elektrotehnika i računalstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 24,
     "min": 65.86,
     "avg": 71.16,
     "max": 80
    }
   },
   {
    "id": 3978,
    "name": "Turistički tehničar destinacije / Turistička tehničarka destinacije",
    "sector": "Turizam i ugostiteljstvo",
    "prag": {
     "year": "2025/2026",
     "kvota": 26,
     "upisani": 26,
     "min": 60.22,
     "avg": 64.9,
     "max": 77.23
    }
   }
  ]
 }
];
