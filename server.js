const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Kompletna lista fakulteta Hrvatske (iz dostupnih izvora)
const croatianUniversities = [
  // SVEUČILIŠTA
  {
    name: 'Sveučilište u Zagrebu',
    type: 'javno sveučilište',
    city: 'Zagreb',
    website: 'https://www.unizg.hr',
    faculties: [
      { name: 'Fakultet elektrotehnike i računarstva (FER)', url: 'https://www.fer.unizg.hr' },
      { name: 'Fakultet strojarstva i brodogradnje', url: 'https://www.fsb.unizg.hr' },
      { name: 'Građevinski fakultet', url: 'https://www.grad.unizg.hr' },
      { name: 'Medicinski fakultet', url: 'https://www.mef.unizg.hr' },
      { name: 'Pravni fakultet', url: 'https://www.pravo.unizg.hr' },
      { name: 'Ekonomski fakultet', url: 'https://www.efzg.unizg.hr' },
      { name: 'Filozofski fakultet', url: 'https://www.ffzg.unizg.hr' },
      { name: 'Prirodoslovno-matematički fakultet', url: 'https://www.pmf.unizg.hr' },
      { name: 'Agronomski fakultet', url: 'https://www.agr.unizg.hr' },
      { name: 'Veterinarski fakultet', url: 'https://www.vef.unizg.hr' },
      { name: 'Farmaceutsko-biokemijski fakultet', url: 'https://www.pharmahem.unizg.hr' },
      { name: 'Fakultet kemijskog inženjerstva i tehnologije', url: 'https://www.fkit.unizg.hr' },
      { name: 'Fakultet organizacije i informatike', url: 'https://www.foi.unizg.hr' },
      { name: 'Arhitektonski fakultet', url: 'https://www.arhitekt.unizg.hr' },
      { name: 'Učiteljski fakultet', url: 'https://www.ufzg.unizg.hr' },
      { name: 'Edukacijsko-rehabilitacijski fakultet', url: 'https://www.erf.unizg.hr' },
      { name: 'Fakultet prometnih znanosti', url: 'https://www.fpz.unizg.hr' },
      { name: 'Geodetski fakultet', url: 'https://www.geof.unizg.hr' },
      { name: 'Tekstilno-tehnološki fakultet', url: 'https://www.ttf.unizg.hr' },
      { name: 'Grafički fakultet', url: 'https://www.grf.unizg.hr' },
      { name: 'Metalurški fakultet', url: 'https://www.msf.unizg.hr' },
      { name: 'Rudarsko-geološko-naftni fakultet', url: 'https://www.rgn.unizg.hr' }
    ]
  },
  {
    name: 'Sveučilište u Osijeku',
    type: 'javno sveučilište',
    city: 'Osijek',
    website: 'https://www.unios.hr',
    faculties: [
      { name: 'Fakultet elektrotehnike, računarstva i informacijskih tehnologija', url: 'https://ferit.unios.hr' },
      { name: 'Medicinski fakultet', url: 'https://mef.unios.hr' },
      { name: 'Ekonomski fakultet', url: 'https://ef.unios.hr' },
      { name: 'Fakultet agrobiotehničkih znanosti', url: 'https://fazos.unios.hr' },
      { name: 'Prehrambeno-tehnološki fakultet', url: 'https://ptfos.unios.hr' },
      { name: 'Građevinski i arhitektonski fakultet', url: 'https://gaf.unios.hr' },
      { name: 'Filozofski fakultet', url: 'https://ff.unios.hr' },
      { name: 'Kineziološki fakultet', url: 'https://kif.unios.hr' },
      { name: 'Fakultet za odgojne i obrazovne znanosti', url: 'https://foozos.unios.hr' },
      { name: 'Pravni fakultet', url: 'https://pf.unios.hr' }
    ]
  },
  {
    name: 'Sveučilište u Splitu',
    type: 'javno sveučilište',
    city: 'Split',
    website: 'https://www.unist.hr',
    faculties: [
      { name: 'Fakultet elektrotehnike, strojarstva i brodogradnje', url: 'https://www.fesb.unist.hr' },
      { name: 'Medicinski fakultet', url: 'https://mefst.unist.hr' },
      { name: 'Kemijsko-tehnološki fakultet', url: 'https://ktf-split.unist.hr' },
      { name: 'Prirodoslovno-matematički fakultet', url: 'https://www.pmfst.unist.hr' },
      { name: 'Fakultet građevinarstva, arhitekture i geodezije', url: 'https://www.gradst.unist.hr' },
      { name: 'Kineziološki fakultet', url: 'https://www.kifst.unist.hr' },
      { name: 'Fakultet zdravstvenih znanosti', url: 'https://fzz.unist.hr' },
      { name: 'Pravni fakultet', url: 'https://www.pravst.unist.hr' },
      { name: 'Ekonomski fakultet', url: 'https://www.efst.unist.hr' },
      { name: 'Fakultet humanističkih studija', url: 'https://www.fhzg.unizg.hr' }
    ]
  },
  {
    name: 'Sveučilište u Rijeci',
    type: 'javno sveučilište',
    city: 'Rijeka',
    website: 'https://www.uniri.hr',
    faculties: [
      { name: 'Medicinski fakultet', url: 'https://mef.uniri.hr' },
      { name: 'Filozofski fakultet', url: 'https://ff.uniri.hr' },
      { name: 'Fakultet informatike i digitalnih tehnologija', url: 'https://fidit.uniri.hr' },
      { name: 'Tehnički fakultet', url: 'https://tf.uniri.hr' },
      { name: 'Fakultet za edukaciju', url: 'https://fpe.uniri.hr' },
      { name: 'Fakultet zdravstvenih studija', url: 'https://fzs.uniri.hr' },
      { name: 'Fakultet za menadžment u turizmu i ugostiteljstvu', url: 'https://fmtu.uniri.hr' },
      { name: 'Fakultet biotehnologije i razvoja lijekova', url: 'https://fbrl.uniri.hr' },
      { name: 'Fakultet dentalne medicine', url: 'https://fdm.uniri.hr' },
      { name: 'Pedagogijski fakultet', url: 'https://ufzg.unizg.hr' }
    ]
  },
  {
    name: 'Sveučilište u Zadar',
    type: 'javno sveučilište',
    city: 'Zadar',
    website: 'https://www.unizd.hr',
    faculties: [
      { name: 'Odjel za informacijske znanosti i tehnologije', url: 'https://www.unizd.hr' },
      { name: 'Odjel za lingvistiku', url: 'https://www.unizd.hr' },
      { name: 'Odjel za matematiku', url: 'https://www.unizd.hr' },
      { name: 'Odjel za fiziku', url: 'https://www.unizd.hr' },
      { name: 'Odjel za kemiju', url: 'https://www.unizd.hr' },
      { name: 'Odjel za biologiju', url: 'https://www.unizd.hr' }
    ]
  },
  {
    name: 'Sveučilište Jurja Dobrile u Puli',
    type: 'javno sveučilište',
    city: 'Pula',
    website: 'https://www.unipu.hr',
    faculties: [
      { name: 'Fakultet ekonomije i turizma', url: 'https://www.unipu.hr' },
      { name: 'Tehnički fakultet', url: 'https://www.unipu.hr' },
      { name: 'Fakultet prirodnih znanosti', url: 'https://www.unipu.hr' }
    ]
  },
  {
    name: 'Sveučilište Josipa Jurja Strossmayera u Osijeku',
    type: 'javno sveučilište',
    city: 'Osijek',
    website: 'https://www.unios.hr',
    faculties: [
      { name: 'Akademija za umjetnost i kulturu', url: 'https://aaku.unios.hr' }
    ]
  },
  {
    name: 'Sveučilište u Dubrovniku',
    type: 'javno sveučilište',
    city: 'Dubrovnik',
    website: 'https://www.unidu.hr',
    faculties: [
      { name: 'Fakultet za medije i odnose s javnošću', url: 'https://www.unidu.hr' },
      { name: 'Odjel za primijenjenu ekologiju', url: 'https://www.unidu.hr' },
      { name: 'Odjel za zdravstvene studije', url: 'https://www.unidu.hr' }
    ]
  },
  {
    name: 'Sveučilište u Slavonskom Brodu',
    type: 'javno sveučilište',
    city: 'Slavonski Brod',
    website: 'https://www.unisb.hr',
    faculties: [
      { name: 'Odjel za stručne studije', url: 'https://www.unisb.hr' }
    ]
  },
  {
    name: 'Sveučilište Sjever',
    type: 'javno sveučilište',
    city: 'Varaždin',
    website: 'https://www.unin.hr',
    faculties: [
      { name: 'Fakultet organizacije i informatike', url: 'https://www.foi.unin.hr' }
    ]
  },

  // PRIVATNA SVEUČILIŠTA
  {
    name: 'Hrvatsko katoličko sveučilište u Zagrebu',
    type: 'privatno sveučilište',
    city: 'Zagreb',
    website: 'https://www.hks.hr',
    faculties: [
      { name: 'Teološki fakultet', url: 'https://www.hks.hr' },
      { name: 'Fakultet za obrazovne, komunikacijske i orijentacijske studije', url: 'https://www.hks.hr' }
    ]
  },
  {
    name: 'Sveučilište VERN',
    type: 'privatno sveučilište',
    city: 'Zagreb',
    website: 'https://www.vern.hr',
    faculties: [
      { name: 'Fakultet za poslovanje i menadžment', url: 'https://www.vern.hr' }
    ]
  },
  {
    name: 'Libertas Međunarodno sveučilište',
    type: 'privatno sveučilište',
    city: 'Zagreb',
    website: 'https://www.libertas.hr',
    faculties: [
      { name: 'Fakultet za menadžment', url: 'https://www.libertas.hr' }
    ]
  }
];

// Funkcija za učitavanje fakulteta iz baze ili kreiranja nove
async function loadUniversitiesData() {
  const dataFile = path.join(__dirname, 'universities_data.json');
  
  if (fs.existsSync(dataFile)) {
    return JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  } else {
    // Kreiraj novu datoteku sa svim podatcima
    fs.writeFileSync(dataFile, JSON.stringify(croatianUniversities, null, 2));
    console.log('✅ Kreirani lokalni podaci u universities_data.json');
    return croatianUniversities;
  }
}

// Express server - vraća podatke kao API
function startApiServer(universities) {
  const express = require('express');
  const app = express();
  
  // CORS
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  // Ruta: Sve sveučilišta
  app.get('/api/universities', (req, res) => {
    res.json({
      success: true,
      count: universities.length,
      data: universities
    });
  });

  // Ruta: Specifično sveučilište
  app.get('/api/universities/:id', (req, res) => {
    const uni = universities.find(u => u.name.toLowerCase() === req.params.id.toLowerCase());
    if (uni) {
      res.json({ success: true, data: uni });
    } else {
      res.json({ success: false, message: 'Sveučilište nije pronađeno' });
    }
  });

  // Ruta: Fakulteti specifičnog sveučilišta
  app.get('/api/universities/:id/faculties', (req, res) => {
    const uni = universities.find(u => u.name.toLowerCase() === req.params.id.toLowerCase());
    if (uni) {
      res.json({ success: true, count: uni.faculties.length, data: uni.faculties });
    } else {
      res.json({ success: false, message: 'Sveučilište nije pronađeno' });
    }
  });

  // Ruta: Pretraga
  app.get('/api/search', (req, res) => {
    const { q } = req.query;
    if (!q) {
      res.json({ success: false, message: 'Potreban je parametar q' });
      return;
    }

    const results = universities.filter(uni => 
      uni.name.toLowerCase().includes(q.toLowerCase()) ||
      uni.city.toLowerCase().includes(q.toLowerCase()) ||
      uni.faculties.some(f => f.name.toLowerCase().includes(q.toLowerCase()))
    );

    res.json({
      success: true,
      count: results.length,
      data: results
    });
  });

  // Ruta: Fakulteti po gradu
  app.get('/api/by-city/:city', (req, res) => {
    const results = universities.filter(u => 
      u.city.toLowerCase() === req.params.city.toLowerCase()
    );

    res.json({
      success: true,
      count: results.length,
      data: results
    });
  });

  // Ruta: Fakulteti po tipu
  app.get('/api/by-type/:type', (req, res) => {
    const results = universities.filter(u => 
      u.type.toLowerCase() === req.params.type.toLowerCase()
    );

    res.json({
      success: true,
      count: results.length,
      data: results
    });
  });

  // JSON export
  app.get('/api/export', (req, res) => {
    res.header('Content-Type', 'application/json');
    res.send(JSON.stringify(universities, null, 2));
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`\n🚀 API server pokrenut na http://localhost:${PORT}`);
    console.log(`\n📚 Dostupne rute:`);
    console.log(`  GET /api/universities - Sva sveučilišta`);
    console.log(`  GET /api/universities/:id - Specifično sveučilište`);
    console.log(`  GET /api/universities/:id/faculties - Fakulteti sveučilišta`);
    console.log(`  GET /api/search?q=naziv - Pretraga`);
    console.log(`  GET /api/by-city/:grad - Fakulteti po gradu`);
    console.log(`  GET /api/by-type/:tip - Fakulteti po tipu`);
    console.log(`  GET /api/export - Preuzmi sve kao JSON\n`);
  });
}

// Pokreni
async function main() {
  console.log('📚 Učitavanje podataka o fakultetima...\n');
  const universities = await loadUniversitiesData();
  console.log(`✅ Učitano ${universities.length} sveučilišta`);
  
  startApiServer(universities);
}

main().catch(console.error);