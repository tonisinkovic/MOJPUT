import type { HighSchoolProgram, HighSchoolProgramType } from "@/lib/juniorQuizEngine";

export type TypicalDay = {
  morning: string;
  rhythm: string;
  subjects: string;
  after: string;
};

const BY_TYPE: Record<HighSchoolProgramType, TypicalDay> = {
  gimnazija: {
    morning: "Prvo sat u učionici (npr. matematika ili hrvatski), onda sljedeći predmet — ista klupa.",
    rhythm: "Sjediš, slušaš, pišeš. Poslije škole ima zadaće.",
    subjects: "Opći predmeti — matematika, hrvatski, jezici i još ponešto.",
    after: "Nakon 4 godine polažeš maturu i možeš na fakultet.",
  },
  tehnicka: {
    morning: "Prvo sat u učionici, onda vježba, labos ili praksa.",
    rhythm: "Pola dana knjiga, pola dana radiš rukama ili za računalom.",
    subjects: "Uz opće predmete učiš i struku tog smjera.",
    after: "Nakon 4 godine možeš raditi ili ići na maturu i fakultet.",
  },
  umjetnicka: {
    morning: "Prvo vježba — crtanje, instrument ili nastup — onda opći predmeti.",
    rhythm: "Ruke i vježba cijeli dan. Manje sjedenja nego u gimnaziji.",
    subjects: "Stručni sati plus opći predmeti.",
    after: "Nakon škole ideš prema akademiji ili kreativnom poslu.",
  },
  obrtnicka: {
    morning: "Prvo kratka teorija, onda radionica, kuhinja ili salon.",
    rhythm: "Stojiš i radiš rukama. Knjiga ima manje.",
    subjects: "Zanat i praksa, uz manje teorije.",
    after: "Nakon 3 godine možeš raditi. Za fakultet treba još školovanja.",
  },
};

const BY_ID: Partial<Record<number, TypicalDay>> = {
  1: {
    morning: "Prvo sat matematike ili hrvatskog, onda sljedeći predmet u istoj učionici.",
    rhythm: "Sjediš, slušaš, pišeš. Zadaća ide kući za više predmeta.",
    subjects: "Matematika, hrvatski, jezici, povijest, priroda — široko.",
    after: "Matura i vrata prema skoro svakom fakultetu.",
  },
  2: {
    morning: "Prvo zadatak ili sat matematike i fizike, onda ponekad labos.",
    rhythm: "Sjediš nad zadacima. Pokus je pauza, ne cijeli dan.",
    subjects: "Pojačana matematika, fizika, često informatika.",
    after: "Jaka podloga za tehničke i prirodne fakultete.",
  },
  3: {
    morning: "Prvo čitanje ili jezik, onda pisanje i razgovor.",
    rhythm: "Tekst, riječi, pričanje. Manje brojki nego u matematičkoj.",
    subjects: "Hrvatski, strani jezici, književnost.",
    after: "Matura i studiji jezika, komunikacije ili društvenih predmeta.",
  },
  4: {
    morning: "Prvo stariji tekst ili latinski, onda povijest ili jezik.",
    rhythm: "Čitaš i pamtiš. Tempo je mirniji, ali treba preciznost.",
    subjects: "Latinski ili grčki, povijest, jezici, književnost.",
    after: "Matura i društveni ili humanistički fakulteti.",
  },
  5: {
    morning: "Prvo biologija ili kemija, onda sat u laboratoriju.",
    rhythm: "Pola činjenica iz knjige, pola pokus i zapis.",
    subjects: "Biologija i kemija više nego u općoj gimnaziji.",
    after: "Dobra podloga za medicinu, farmaciju ili biologiju.",
  },
  6: {
    morning: "Prvo sat ili trening — ovisi o rasporedu — onda drugi dio dana.",
    rhythm: "Škola i sport se smjenjuju. Učenje ostaje, samo je raspored drugačiji.",
    subjects: "Gimnazijski predmeti, uz raspored prilagođen sportu.",
    after: "Matura — kineziologija ili neki drugi fakultet.",
  },
  7: {
    morning: "Prvo sat informatike ili matematike, onda kod, mreža ili zadatak za računalom.",
    rhythm: "Veći dio dana gledaš u ekran i rješavaš problem.",
    subjects: "Informatika, matematika, tehnički predmeti.",
    after: "Posao u IT-u ili matura prema tehničkom fakultetu.",
  },
  8: {
    morning: "Prvo shema ili mjerenje, onda slaganje sklopa.",
    rhythm: "Učionica, pa laboratorij, pa opet crtanje.",
    subjects: "Struja, elektronika, matematika i fizika.",
    after: "Posao tehničara ili nastavak na elektrotehniku.",
  },
  9: {
    morning: "Prvo nacrt, onda radionica uz strojeve.",
    rhythm: "Crtanje, pa ruke, pa opet matematika.",
    subjects: "Strojarstvo, nacrti, materijali, matematika.",
    after: "Posao u industriji ili matura i strojarski fakultet.",
  },
  10: {
    morning: "Prvo nacrt ili računanje, onda teren ili radionica.",
    rhythm: "Papir i brojke, pa vani pogledati kako to izgleda uživo.",
    subjects: "Građevina, nacrti, materijali.",
    after: "Posao na građevini ili nastavak školovanja.",
  },
  11: {
    morning: "Prvo tlocrt ili model, onda crtanje prostora.",
    rhythm: "Crtanje i preciznost. Matematika nije cijeli dan, ali je tu.",
    subjects: "Nacrti, oblikovanje prostora, tehnički predmeti.",
    after: "Posao u birou ili put prema arhitekturi.",
  },
  12: {
    morning: "Prvo sat o tijelu i njezi, onda praksa s ljudima.",
    rhythm: "Knjiga, pa hodnici / odjel. Dan može biti naporan.",
    subjects: "Anatomija, njega, higijena, praksa u zdravstvu.",
    after: "Posao u zdravstvu ili nastavak na sestrinstvo / medicinu.",
  },
  13: {
    morning: "Prvo sat o lijekovima i dozama, onda labos ili vježba točnosti.",
    rhythm: "Mirnije nego u bolnici. Sve mora sjesti na broj.",
    subjects: "Kemija, lijekovi, laboratorij ili ljekarna.",
    after: "Posao u ljekarni / laboratoriju ili nastavak studija.",
  },
  14: {
    morning: "Prvo sat o tijelu, onda vježba s ljudima — kretanje, istezanje.",
    rhythm: "Nisi cijeli dan za klupom. Ima i teorije.",
    subjects: "Anatomija, vježbanje, oporavak.",
    after: "Posao uz rehabilitaciju ili nastavak studija.",
  },
  15: {
    morning: "Prvo sat o životinjama, onda pomoć u praksi.",
    rhythm: "Učionica, pa štale / ambulanta. Treba mirne ruke.",
    subjects: "Biologija, njega životinja, praksa.",
    after: "Posao u veterini ili nastavak prema veterini.",
  },
  16: {
    morning: "Prvo kratki sat, onda polje, staklenik ili farma.",
    rhythm: "Više si vani nego u klupi. Ruke i vremenske prilike.",
    subjects: "Biljke, životinje, praksa na otvorenom.",
    after: "Posao u poljoprivredi ili nastavak školovanja.",
  },
  17: {
    morning: "Prvo sat ili mjerenje, onda šuma i teren.",
    rhythm: "Hodaš, mjeriš, zapisuješ. Učionica je samo dio dana.",
    subjects: "Šuma, priroda, teren.",
    after: "Posao u šumarstvu ili sličan smjer dalje.",
  },
  18: {
    morning: "Prvo sat o novcu ili tvrtki, onda zadatak, tablica ili prezentacija.",
    rhythm: "Uredski ritam — sjediš, računaš, slagaš plan.",
    subjects: "Poslovanje, računovodstvo, matematika, informatika.",
    after: "Posao u uredu / banci ili ekonomski fakultet.",
  },
  19: {
    morning: "Prvo pravila ili dokument, onda točno slaganje papira na računalu.",
    rhythm: "Mirniji ured. Treba red, ne žurba kao u kuhinji.",
    subjects: "Uprava, dokumenti, hrvatski, informatika.",
    after: "Posao u uredu / upravi ili studij prava / uprave.",
  },
  20: {
    morning: "Prvo jezik ili prijem gostiju, onda praksa u hotelu / agenciji.",
    rhythm: "Pričaš i hodaš. Ljeta mogu biti puna smjena.",
    subjects: "Jezici, turizam, rad s gostima.",
    after: "Posao u turizmu ili studij turizma / ekonomije.",
  },
  21: {
    morning: "Prvo raspored ili rute, onda skladište / teren.",
    rhythm: "Pola ureda, pola 'gdje je roba sad'. Treba organizacija.",
    subjects: "Promet, logistika, organizacija.",
    after: "Posao u prijevozu / logistici ili prometni fakultet.",
  },
  22: {
    morning: "Prvo zadatak na računalu — slika, video ili web — onda dorada do roka.",
    rhythm: "Ekran i rok. Kreativno, ali treba predati na vrijeme.",
    subjects: "Dizajn, mediji, informatika, likovni.",
    after: "Posao u dizajnu / medijima ili nastavak studija.",
  },
  23: {
    morning: "Prvo pokus ili mjerenje, onda zapis i pravila.",
    rhythm: "Labos, kuta, točnost. Nema puno buke.",
    subjects: "Kemija, laboratorij, analitika.",
    after: "Posao u laboratoriju / industriji ili kemija / farmacija.",
  },
  24: {
    morning: "Prvo sat o hrani i higijeni, onda pogon ili labos.",
    rhythm: "Recept, mjerenje, čistoća. Ruke i pravila.",
    subjects: "Prehrana, kemija, praksa.",
    after: "Posao u prehrambenoj industriji ili nastavak školovanja.",
  },
  25: {
    morning: "Prvo vježba na instrumentu, onda teorija ili sat slušanja.",
    rhythm: "Svaki dan treba svirati. To nije hobi uz školu.",
    subjects: "Instrument, teorija, nastup.",
    after: "Put prema akademiji ili glazbenom poslu. Često treba prijemni.",
  },
  26: {
    morning: "Prvo crtanje ili mapa radova, onda radionica.",
    rhythm: "Oko i ruka cijeli dan. Opći predmeti su uz to.",
    subjects: "Crtanje, dizajn, umjetnički predmeti.",
    after: "Akademija ili kreativni posao. Za upis često treba mapa radova.",
  },
  27: {
    morning: "Prvo kratki sat, onda salon — frizura, njega, gost.",
    rhythm: "Stojiš, radiš rukama i pričaš. Smjene mogu biti popodne.",
    subjects: "Tehnike njege, praksa, rad s klijentima.",
    after: "Brže na posao ili svoj salon. Nema mature nakon 3 godine.",
  },
  28: {
    morning: "Prvo priprema i nož, onda štednjak — tempo odmah krene.",
    rhythm: "Stojiš, žuri se, vruće je. Sat teorije je kratak.",
    subjects: "Kuhinja, slastice, higijena, praksa.",
    after: "Posao u kuhinji ili vlastiti obrt. Za faks treba još škole.",
  },
  29: {
    morning: "Prvo sat o posluživanju, onda rad s gostima za stolom.",
    rhythm: "Hodaš i pričaš. Smjene često idu navečer.",
    subjects: "Ugostiteljstvo, gosti, praksa.",
    after: "Posao u ugostiteljstvu. Za fakultet treba doškolovanje.",
  },
  30: {
    morning: "Prvo hauba ili kvar, onda alat i slaganje dijela.",
    rhythm: "Ruke, ulje, ponekad prljav posao. Učiš i zašto se pokvarilo.",
    subjects: "Auti, motori, popravci.",
    after: "Posao u servisu ili obrt. Matura nije u ova 3 godine.",
  },
  31: {
    morning: "Prvo sat o struji i sigurnosti, onda instalacije na terenu ili u radionici.",
    rhythm: "Pravila, pa kablovi. Ne radiš 'odokativno'.",
    subjects: "Struja, instalacije, siguran rad.",
    after: "Posao električara. Za faks treba još školovanja.",
  },
  32: {
    morning: "Prvo mjera i crtež, onda pila i slaganje komada.",
    rhythm: "Radionica, prašina, precizne ruke.",
    subjects: "Drvo, izrada, nacrti u praksi.",
    after: "Zanat i posao ili vlastita radionica.",
  },
  33: {
    morning: "Prvo proizvodi i cijene, onda vježba prodaje s ljudima.",
    rhythm: "Stojiš i pričaš s kupcima. Teorija je kratka.",
    subjects: "Prodaja, robe, rad s ljudima.",
    after: "Posao u trgovini ili komercijali. Za faks treba još škole.",
  },
};

export const typicalDayFor = (program: HighSchoolProgram): TypicalDay => {
  const custom = BY_ID[program.id];
  if (custom) return { ...custom, after: custom.after || program.afterSchool };
  const fallback = BY_TYPE[program.type];
  return { ...fallback, after: program.afterSchool || fallback.after };
};
