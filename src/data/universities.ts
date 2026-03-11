export type Faculty = {
  name: string;
  url: string;
  levels?: string[];
};

export type University = {
  name: string;
  type: string;
  city: string;
  website: string;
  faculties: Faculty[];
};

// Kompletna lista institucija i fakulteta (na temelju postani-student.hr)
export const croatianUniversities: University[] = [
  {
    name: "Sveučilište u Zagrebu",
    type: "Javno sveučilište",
    city: "Zagreb",
    website: "https://www.unizg.hr",
    faculties: [
      {
        name: "Fakultet elektrotehnike i računarstva (FER)",
        url: "https://www.fer.unizg.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Fakultet strojarstva i brodogradnje",
        url: "https://www.fsb.unizg.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Građevinski fakultet",
        url: "https://www.grad.unizg.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Medicinski fakultet",
        url: "https://www.mef.unizg.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Pravni fakultet",
        url: "https://www.pravo.unizg.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Ekonomski fakultet",
        url: "https://www.efzg.unizg.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Filozofski fakultet",
        url: "https://www.ffzg.unizg.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Prirodoslovno-matematički fakultet",
        url: "https://www.pmf.unizg.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Agronomski fakultet",
        url: "https://www.agr.unizg.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Veterinarski fakultet",
        url: "https://www.vef.unizg.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Farmaceutsko-biokemijski fakultet",
        url: "https://www.pharma.unizg.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Fakultet kemijskog inženjerstva i tehnologije",
        url: "https://www.fkit.unizg.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Fakultet organizacije i informatike",
        url: "https://www.foi.unizg.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Arhitektonski fakultet",
        url: "https://www.arhitekt.unizg.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Učiteljski fakultet",
        url: "https://www.ufzg.unizg.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Edukacijsko-rehabilitacijski fakultet",
        url: "https://www.erf.unizg.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Fakultet prometnih znanosti",
        url: "https://www.fpz.unizg.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Geodetski fakultet",
        url: "https://www.geof.unizg.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Tekstilno-tehnološki fakultet",
        url: "https://www.ttf.unizg.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Grafički fakultet",
        url: "https://www.grf.unizg.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Metalurški fakultet",
        url: "https://www.msf.unizg.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Rudarsko-geološko-naftni fakultet",
        url: "https://www.rgn.unizg.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Akademija dramske umjetnosti",
        url: "https://www.adu.unizg.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Akademija likovnih umjetnosti",
        url: "https://www.alu.unizg.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Muzička akademija",
        url: "https://www.muza.unizg.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Stomatološki fakultet",
        url: "https://www.sfzg.unizg.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Geotehnički fakultet",
        url: "https://www.unizg.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Fakultet hrvatskih studija",
        url: "https://www.unizg.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Fakultet političkih znanosti",
        url: "https://www.fpzg.unizg.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Prehrambeno-biotehnološki fakultet",
        url: "https://www.pbf.unizg.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
    ],
  },
  {
    name: "Sveučilište Josipa Jurja Strossmayera u Osijeku",
    type: "Javno sveučilište",
    city: "Osijek",
    website: "https://www.unios.hr",
    faculties: [
      {
        name: "Fakultet elektrotehnike, računarstva i informacijskih tehnologija",
        url: "https://www.ferit.unios.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Medicinski fakultet",
        url: "https://www.mefos.unios.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Ekonomski fakultet",
        url: "https://www.efos.unios.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Fakultet agrobiotehničkih znanosti",
        url: "https://www.fazos.unios.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Prehrambeno-tehnološki fakultet",
        url: "https://www.ptfos.unios.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Građevinski i arhitektonski fakultet",
        url: "https://www.gaf.unios.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Filozofski fakultet",
        url: "https://www.ffos.unios.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Kineziološki fakultet",
        url: "https://www.kifos.unios.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Fakultet za odgojne i obrazovne znanosti",
        url: "https://www.foozos.unios.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Pravni fakultet",
        url: "https://www.pravos.unios.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Akademija za umjetnost i kulturu u Osijeku",
        url: "https://www.aauk.unios.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
    ],
  },
  {
    name: "Sveučilište u Splitu",
    type: "Javno sveučilište",
    city: "Split",
    website: "https://www.unist.hr",
    faculties: [
      {
        name: "Fakultet elektrotehnike, strojarstva i brodogradnje",
        url: "https://www.fesb.unist.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Medicinski fakultet",
        url: "https://www.mefst.unist.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Kemijsko-tehnološki fakultet",
        url: "https://www.ktf.unist.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Prirodoslovno-matematički fakultet",
        url: "https://www.pmfst.unist.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Fakultet građevinarstva, arhitekture i geodezije",
        url: "https://www.gradst.unist.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Kineziološki fakultet",
        url: "https://www.kifst.unist.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Fakultet zdravstvenih znanosti",
        url: "https://fzs.unist.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Pravni fakultet",
        url: "https://www.pravst.unist.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Ekonomski fakultet",
        url: "https://www.efst.unist.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Filozofski fakultet",
        url: "https://www.ffst.unist.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Učiteljski fakultet",
        url: "https://www.unist.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Katolički bogoslovni fakultet",
        url: "https://www.kbf.unist.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Pomorski fakultet",
        url: "https://www.pfst.unist.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Umjetnička akademija",
        url: "https://www.umas.unist.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
    ],
  },
  {
    name: "Sveučilište u Rijeci",
    type: "Javno sveučilište",
    city: "Rijeka",
    website: "https://www.uniri.hr",
    faculties: [
      {
        name: "Medicinski fakultet",
        url: "https://www.medri.uniri.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Filozofski fakultet",
        url: "https://www.ffri.uniri.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Fakultet informatike i digitalnih tehnologija",
        url: "https://www.fidit.uniri.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Tehnički fakultet",
        url: "https://www.riteh.uniri.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Fakultet za edukaciju",
        url: "https://www.uniri.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Fakultet zdravstvenih studija",
        url: "https://www.fzsri.uniri.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Fakultet za menadžment u turizmu i ugostiteljstvu",
        url: "https://www.fthm.uniri.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Fakultet biotehnologije i razvoja lijekova",
        url: "https://www.uniri.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Fakultet dentalne medicine",
        url: "https://www.fdmri.uniri.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Pomorski fakultet",
        url: "https://www.pfri.uniri.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Učiteljski fakultet",
        url: "https://www.ufri.uniri.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Fakultet za fiziku",
        url: "https://www.phy.uniri.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Fakultet za matematiku",
        url: "https://www.math.uniri.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
    ],
  },
  {
    name: "Sveučilište u Zadru",
    type: "Javno sveučilište",
    city: "Zadar",
    website: "https://www.unizd.hr",
    faculties: [
      {
        name: "Odjel za informacijske znanosti i tehnologije",
        url: "https://www.unizd.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      { name: "Odjel za lingvistiku", url: "https://www.unizd.hr", levels: ["Preddiplomski", "Diplomski", "Doktorski"] },
      { name: "Odjel za matematiku", url: "https://www.unizd.hr", levels: ["Preddiplomski", "Diplomski", "Doktorski"] },
      { name: "Odjel za fiziku", url: "https://www.unizd.hr", levels: ["Preddiplomski", "Diplomski", "Doktorski"] },
      { name: "Odjel za kemiju", url: "https://www.unizd.hr", levels: ["Preddiplomski", "Diplomski", "Doktorski"] },
      { name: "Odjel za biologiju", url: "https://www.unizd.hr", levels: ["Preddiplomski", "Diplomski", "Doktorski"] },
      { name: "Odjel za kroatistiku", url: "https://www.unizd.hr", levels: ["Preddiplomski", "Diplomski", "Doktorski"] },
      { name: "Odjel za anglistiku", url: "https://www.unizd.hr", levels: ["Preddiplomski", "Diplomski", "Doktorski"] },
      { name: "Odjel za germanistiku", url: "https://www.unizd.hr", levels: ["Preddiplomski", "Diplomski", "Doktorski"] },
      {
        name: "Odjel za francuske i frankofonske studije",
        url: "https://www.unizd.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      { name: "Odjel za povijest", url: "https://www.unizd.hr", levels: ["Preddiplomski", "Diplomski", "Doktorski"] },
      { name: "Odjel za psihologiju", url: "https://www.unizd.hr", levels: ["Preddiplomski", "Diplomski", "Doktorski"] },
      { name: "Odjel za sociologiju", url: "https://www.unizd.hr", levels: ["Preddiplomski", "Diplomski", "Doktorski"] },
      { name: "Odjel za pedagogiju", url: "https://www.unizd.hr", levels: ["Preddiplomski", "Diplomski", "Doktorski"] },
    ],
  },
  {
    name: "Sveučilište Jurja Dobrile u Puli",
    type: "Javno sveučilište",
    city: "Pula",
    website: "https://www.unipu.hr",
    faculties: [
      {
        name: "Fakultet ekonomije i turizma",
        url: "https://fthm.unipu.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      { name: "Tehnički fakultet", url: "https://www.unipu.hr", levels: ["Preddiplomski", "Diplomski", "Doktorski"] },
      {
        name: "Fakultet prirodnih znanosti",
        url: "https://www.unipu.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      {
        name: "Filozofski fakultet",
        url: "https://www.unipu.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      { name: "Fakultet informatike", url: "https://www.unipu.hr", levels: ["Preddiplomski", "Diplomski", "Doktorski"] },
    ],
  },
  {
    name: "Sveučilište u Dubrovniku",
    type: "Javno sveučilište",
    city: "Dubrovnik",
    website: "https://www.unidu.hr",
    faculties: [
      {
        name: "Fakultet za medije i odnose s javnošću",
        url: "https://www.unidu.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      { name: "Odjel za primijenjenu ekologiju", url: "https://www.unidu.hr", levels: ["Preddiplomski", "Diplomski", "Doktorski"] },
      { name: "Odjel za zdravstvene studije", url: "https://www.unidu.hr", levels: ["Preddiplomski", "Diplomski", "Doktorski"] },
      { name: "Odjel za humanističke znanosti", url: "https://www.unidu.hr", levels: ["Preddiplomski", "Diplomski", "Doktorski"] },
      {
        name: "Odjel za umjetnost i restauraciju",
        url: "https://www.unidu.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      { name: "Pomorski fakultet", url: "https://www.unidu.hr", levels: ["Preddiplomski", "Diplomski", "Doktorski"] },
    ],
  },
  {
    name: "Sveučilište u Slavonskom Brodu",
    type: "Javno sveučilište",
    city: "Slavonski Brod",
    website: "https://www.unisb.hr",
    faculties: [
      { name: "Odjel za stručne studije", url: "https://www.unisb.hr", levels: ["Preddiplomski", "Diplomski"] },
      {
        name: "Biotehnički odjel",
        url: "https://www.unisb.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      { name: "Tehnički odjel", url: "https://www.unisb.hr", levels: ["Preddiplomski", "Diplomski", "Doktorski"] },
      {
        name: "Odjel društveno-humanističkih znanosti",
        url: "https://www.unisb.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
    ],
  },
  {
    name: "Sveučilište Sjever",
    type: "Javno sveučilište",
    city: "Varaždin",
    website: "https://www.unin.hr",
    faculties: [
      {
        name: "Fakultet organizacije i informatike",
        url: "https://www.foi.unin.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
    ],
  },
  {
    name: "Hrvatsko katoličko sveučilište u Zagrebu",
    type: "Privatno sveučilište",
    city: "Zagreb",
    website: "https://www.hks.hr",
    faculties: [
      { name: "Teološki fakultet", url: "https://www.hks.hr", levels: ["Preddiplomski", "Diplomski", "Doktorski"] },
      {
        name: "Fakultet za obrazovne, komunikacijske i orijentacijske studije",
        url: "https://www.hks.hr",
        levels: ["Preddiplomski", "Diplomski", "Doktorski"],
      },
      { name: "Fakultet za filozofiju", url: "https://www.hks.hr", levels: ["Preddiplomski", "Diplomski", "Doktorski"] },
    ],
  },
  {
    name: "Sveučilište VERN",
    type: "Privatno sveučilište",
    city: "Zagreb",
    website: "https://www.vern.hr",
    faculties: [
      {
        name: "Fakultet za poslovanje i menadžment",
        url: "https://www.vern.hr",
        levels: ["Preddiplomski", "Diplomski"],
      },
    ],
  },
  {
    name: "Libertas Međunarodno sveučilište",
    type: "Privatno sveučilište",
    city: "Zagreb",
    website: "https://www.libertas.hr",
    faculties: [
      {
        name: "Fakultet za menadžment",
        url: "https://www.libertas.hr",
        levels: ["Preddiplomski", "Diplomski"],
      },
    ],
  },
  {
    name: "Sveučilište Algebra Bernays",
    type: "Privatno sveučilište",
    city: "Zagreb",
    website: "https://www.algebra.hr",
    faculties: [
      {
        name: "Fakultet za računarstvo i informatiku",
        url: "https://www.algebra.hr",
        levels: ["Preddiplomski", "Diplomski"],
      },
    ],
  },
  // Veleučilišta
  {
    name: "Tehničko veleučilište u Zagrebu",
    type: "Javno veleučilište",
    city: "Zagreb",
    website: "https://www.tvz.hr",
    faculties: [
      { name: "Studiji elektrotehnike", url: "https://www.tvz.hr", levels: ["Preddiplomski"] },
      { name: "Studiji strojarstva", url: "https://www.tvz.hr", levels: ["Preddiplomski"] },
      { name: "Studiji građevinarstva", url: "https://www.tvz.hr", levels: ["Preddiplomski"] },
      { name: "Studiji računarstva", url: "https://www.tvz.hr", levels: ["Preddiplomski"] },
    ],
  },
  {
    name: "Veleučilište u Rijeci",
    type: "Javno veleučilište",
    city: "Rijeka",
    website: "https://www.veleri.hr",
    faculties: [
      {
        name: "Odjel za informacijske tehnologije",
        url: "https://www.veleri.hr",
        levels: ["Preddiplomski"],
      },
      {
        name: "Odjel za turizmo-hotelsku struku",
        url: "https://www.veleri.hr",
        levels: ["Preddiplomski"],
      },
      {
        name: "Odjel za pomorstvo i promet",
        url: "https://www.veleri.hr",
        levels: ["Preddiplomski"],
      },
    ],
  },
  {
    name: "Međimursko veleučilište u Čakovcu",
    type: "Javno veleučilište",
    city: "Čakovec",
    website: "https://www.mev.hr",
    faculties: [
      {
        name: "Odjel za ekonomiju i menadžment",
        url: "https://www.mev.hr",
        levels: ["Preddiplomski"],
      },
      {
        name: "Odjel za poljoprivredu i prehrambenu tehnologiju",
        url: "https://www.mev.hr",
        levels: ["Preddiplomski"],
      },
    ],
  },
  {
    name: "Veleučilište u Bjelovaru",
    type: "Javno veleučilište",
    city: "Bjelovar",
    website: "https://www.vub.hr",
    faculties: [
      {
        name: "Odjel za usluge gostinstva i turizma",
        url: "https://www.vub.hr",
        levels: ["Preddiplomski"],
      },
      { name: "Odjel za mehaničku tehniku", url: "https://www.vub.hr", levels: ["Preddiplomski"] },
    ],
  },
  {
    name: "Veleučilište u Karlovcu",
    type: "Javno veleučilište",
    city: "Karlovac",
    website: "https://www.vuka.hr",
    faculties: [
      {
        name: "Odjel za tehniku i inženjerstvo",
        url: "https://www.vuka.hr",
        levels: ["Preddiplomski"],
      },
      {
        name: "Odjel za poslovanje i menadžment",
        url: "https://www.vuka.hr",
        levels: ["Preddiplomski"],
      },
    ],
  },
  {
    name: 'Veleučilište "Lavoslav Ružička" u Vukovaru',
    type: "Javno veleučilište",
    city: "Vukovar",
    website: "https://www.vevu.hr",
    faculties: [
      { name: "Odjel za poljoprivredu", url: "https://www.vevu.hr", levels: ["Preddiplomski"] },
      { name: "Odjel za učiteljstvo", url: "https://www.vevu.hr", levels: ["Preddiplomski"] },
    ],
  },
  {
    name: 'Veleučilište "Marko Marulić" u Kninu',
    type: "Javno veleučilište",
    city: "Knin",
    website: "https://www.veleknin.hr",
    faculties: [
      {
        name: "Odjel za poljoprivredu i prehrambenu tehnologiju",
        url: "https://www.veleknin.hr",
        levels: ["Preddiplomski"],
      },
      {
        name: "Odjel za turizmo-hotelsku struku",
        url: "https://www.veleknin.hr",
        levels: ["Preddiplomski"],
      },
    ],
  },
  {
    name: "EFFECTUS veleučilište",
    type: "Privatno veleučilište",
    city: "Zagreb",
    website: "https://www.effectus.hr",
    faculties: [
      {
        name: "Studiji poslovanja i menadžmenta",
        url: "https://www.effectus.hr",
        levels: ["Preddiplomski"],
      },
      { name: "Studiji računarstva", url: "https://www.effectus.hr", levels: ["Preddiplomski"] },
    ],
  },
  {
    name: "Poslovno veleučilište Zagreb",
    type: "Privatno veleučilište",
    city: "Zagreb",
    website: "https://www.pvz.hr",
    faculties: [
      {
        name: "Studiji poslovanja i financija",
        url: "https://www.pvz.hr",
        levels: ["Preddiplomski"],
      },
    ],
  },
  {
    name: "Zdravstveno veleučilište u Zagrebu",
    type: "Privatno veleučilište",
    city: "Zagreb",
    website: "https://www.zvu.hr",
    faculties: [
      { name: "Studiji zdravstvene njege", url: "https://www.zvu.hr", levels: ["Preddiplomski"] },
      { name: "Studiji fizioterapije", url: "https://www.zvu.hr", levels: ["Preddiplomski"] },
    ],
  },
  {
    name: "Istarsko veleučilište",
    type: "Javno veleučilište",
    city: "Pula",
    website: "https://www.istarsko-veleuciliste.hr",
    faculties: [
      {
        name: "Odjel za turizmo-hotelsku struku",
        url: "https://www.istarsko-veleuciliste.hr",
        levels: ["Preddiplomski"],
      },
      {
        name: "Odjel za trgovinu i logistiku",
        url: "https://www.istarsko-veleuciliste.hr",
        levels: ["Preddiplomski"],
      },
    ],
  },
  {
    name: "Veleučilište Hrvatsko zagorje Krapina",
    type: "Privatno veleučilište",
    city: "Krapina",
    website: "https://www.vhz.hr",
    faculties: [
      { name: "Odjel za poljoprivredu", url: "https://www.vhz.hr", levels: ["Preddiplomski"] },
      { name: "Odjel za turizam", url: "https://www.vhz.hr", levels: ["Preddiplomski"] },
    ],
  },
];

