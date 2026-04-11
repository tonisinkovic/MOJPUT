/**
 * HRV IK-2 D-S073 — samo prikaz uputa (bez unosa i ocjenjivanja).
 * Šk. god. 2024/2025., 1. rok. Punu ispitnu knjižicu i polazne tekstove preuzmi s NCVVO-a (PDF D-S073).
 */

export type HrvPismenoBlock = {
  title: string;
  body: string;
};

/** Upute i očekivanja tipična za ispitni zadatak sažetka; dopuni prema svom primjerku knjižice. */
export const HRV_D073_SAZETAK: HrvPismenoBlock = {
  title: "Sažetak",
  body: [
    "Na temelju polaznoga teksta (u ispitnoj knjižici) napiši sažetak u kojem ",
    "\u0107eš istaknuti glavne informacije i sačuvati smisao izvornika.\n\n",
    "• Piši svojim riječima; izravan prepis rečenica nije prihvatljiv.\n",
    "• Poštuj ograničenje obujma navedeno u knjižici (broj riječi / normostranica).\n",
    "• Sažetak treba biti koherentan: uvodna usmjerenost, logičan slijed, završetak u skladu s uputom.",
  ].join(""),
};

/** Smjernice za esejski zadatak; dopuni točnim formulacijama iz D-S073 kad ih imaš pod rukom. */
export const HRV_D073_ESEJ: HrvPismenoBlock = {
  title: "Esejski zadatak",
  body: [
    "Na zadanu temu / pitanje iz ispitne knjižice napiši strukturirani esej.\n\n",
    "• Razradi tezu jasnom strukturom (uvod — razrada — zaključak).\n",
    "• Koristi primjere iz lektire ili općeg znanja samo ako to zadatak traži.\n",
    "• Pazi na jezik, stil i obujam prema uputama u knjižici.",
  ].join(""),
};
