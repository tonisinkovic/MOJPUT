/**
 * HRV IK-1 D-S073 — samo zadaci I. Čitanje (1–30), šk. god. 2024/2025., 1. rok.
 * Polazni tekstovi i pitanja prema ispitnoj knjižici; točni odgovori iz ključa NCVVO.
 * (Zadaci 31–58 — književnost i hrvatski jezik — rješavaju se iz PDF-a.)
 */

export type HrvCitankaLetter = "A" | "B" | "C" | "D";

export type HrvCitankaPassage = {
  firstQ: number;
  lastQ: number;
  title: string;
  subtitle?: string;
  body: string;
};

export type HrvCitankaQuestion = {
  label: string;
  stem: string;
  options: Record<HrvCitankaLetter, string>;
};

const P_KRANJCEVIC = `Gospodskomu Kastoru

Prostite, sjeni, lutajuće tihe na Letinu žalu,
Što${"\u0107"}u pozajmit klasičnu strofu!
Majčica Gaea nešto je drukča, neg’li je bila
Drukčiji danas treba Apolo.
Prostite i vi, Kastore dragi, gospodski psiću!
Drijemajte samo mekom na sagu.
Vani je zima (ne znam vam toga reći na pasja,
Al vi ste uvijek istoga mnijenja!),
Sipa po vrašku! Kako li samo žmirkate važno!
Očito, da se čudite nešto,
Kud li se trgom vucare trome, prostačke psine
Podvita repa, kičme ko britva.
Skitnice jedne! gotove uvijek željno zavirit
Poganom njuškom u svaku tricu!
Peče vas, reko bih, ta zaboravnost, ali izvin’te,
Kastore dragi. Tempora! Mores!

Glete, na primjer, toga se nađe baš i u ljudi;
Što su to ljudi – sigurno znate;
Vidi se, vidi; uopće psić ste moderan posve,
Sve vam je jasno, način korektan.
Bah – il je čudo: s vremena duhom pođoste naprijed.
Sve je uzálud: odlična kuća,
Gdje vas je časna predala nekad na svijet majka,
Ne da se tako lako zatajit.
I kad su ljuske pale sa vašeg slijepoga vida,
Željeli nijeste pogledat u zrak;
Prvi vam korak bješe da svojoj gospođi bajnoj
Laznete skromno gospodsku petu.
Zlatna metoda! Cjelovom tijem shvatiste život!
Meka vas ruka uze u krilo;
Cijela obitelj, odlična kuća i ekcelenca
U vas je slavne vidjela dare.
Kad vas je koji majčin miljenik razmićen nešto
Obijesnim prstom ščepo za uho,
Vi ste mu odmah, psiću vanredni, gotovo, nježno,
Pružili drugo, repić podvinuv!
Zato ste tako legnuli meko, zato vam danas
Prolazi starost kao u loju,
U kut iz kuta, kako vam reknu, ali se zato
Ne pruža vaša šapa badava!
Eto, što znači biti psetancem odlična gazde!
Najlakše k cilju podvita repa!
Pitoma njuško, cjeluješ petu, al se i za te
Mirisno peče masna kobasa!
I ja sam, evo, kreposti vašoj savio pjesmu,
Polažem lovor preda vas;
Slab je to darak, jestive više volite stvari,
Odlike više praktične vrsti!

Ipak vam – ne htjeli uditi daljem napretku vašem –
U uho nešto šapnuti moram:
Sve mi se čini, da ste – uglavnom – svojom metodom,
Kastore, malko slijedili – ljude!

Silvije Strahimir Kranjčević

[Napomene uz tekst u knjižici: Kastor — Zeusov sin i brat blizanac Polideuka; Letin žal — rijeka zaborava; Gaea — Majka Zemlja; Tempora! Mores! — „Vremena! Običaji!”; ekcelenca — počasna titula; razmićen — razmažen.]`;

const P_CAMUS = `Albert Camus, Stranac

Tužilac ga upita jesam li mu redovito plaćao hranu. Céleste se nasmija i izjavi: – To su bile sitnice među nama. – Upitaše ga još što misli o mom zločinu. On se tada uhvati rukama za ogradu, vidjelo se da je nešto smislio. Reče: – Za mene je to nesreća. A svi znaju što je nesreća. Od nesreće se čovjek ne može obraniti. E, pa za mene je to nesreća! – htio je nastaviti, ali mu predsjednik reče da je dosta i da mu zahvaljuje. Céleste se malko zbuni, ali doda da bi htio još nešto reći. Upozoriše ga neka bude kratak. On opet ponovi da je to nesreća, a predsjednik mu reče: – Jest, to se razumije, ali mi smo ovdje da sudimo o takvim nesrećama. Hvala vam. – Tada, kao da je iscrpao sve svoje znanje i dobru volju, Céleste se okrenu meni. Učini mi se da mu se oči cakle, a usne dršću. Kao da me je pitao kako bi mi još mogao pomoći. Ja ništa ne rekoh, ne učinih nijedne kretnje, ali prvi put otkako znam za sebe poželjeh da zagrlim jednog čovjeka. Predsjednik mu još dobaci neka napusti mjesto za svjedoke. Céleste se vrati na svoje mjesto. Tu ostade do kraja rasprave, malko sagnut, nalakćen na koljena, s panama-šeširom u rukama, slušajući sve što se govori. Uđe Marie. Na glavi je imala šešir i bila je opet lijepa, iako mi se više sviđala gologlava. S mjesta na kojem sam sjedio nazrijevao sam njene sitne dojke i razabirao donju usnu koja joj je uvijek bila malko ispupčena. Činilo mi se da je vrlo nervozna. Prvo je zapitaše otkad me poznaje. Ona navede vrijeme kad je kod nas radila. Predsjednik je htio da zna u kakvim je odnosima sa mnom. Ona reče da mi je prijateljica. Na jedno drugo pitanje odgovori da je istina da je trebalo da se uda za mene. Javni tužilac, koji je prelistavao spise, iznenada je upita otkad traje naša veza. Ona navede datum. Tužilac ravnodušno pripomenu da mu se čini da je to bilo dan nakon mamine smrti. Zatim pomalo podrugljivo reče da se ne bi htio dulje zadržavati na tom škakljivom pitanju, da dobro shvaća Marijine obzire, ali (tu mu glas postade trpkiji) da mu dužnost nalaže da se izdigne iznad društvenih obzira. Zamoli Marie da ukratko opiše onaj dan kad sam se zbližio s njom. Marie nije htjela odgovarati, ali na navaljivanje tužiočevo ispripovjedi kako smo se kupali, kako smo išli u kino i otišli na kraju u moj stan. Tužilac reče da je, pročitavši Marijin iskaz u istrazi, pregledao program kino-predstava toga dana. Doda da \u0107e i sama Marie re\u0107i koji smo film tada gledali. I zaista, gotovo bezbojnim glasom, ona navede da je to bio jedan film s Fernandelom. Kad je to rekla, u sudnici je nastao tajac. Tada tužilac ustade i, vrlo ozbiljno, glasom koji mi se učini zaista potresenim, upre prstom u mene i izusti polagano:
– Gospodo porotnici, sutradan nakon smrti svoje majke, ovaj je čovjek otišao na kupanje, upustio se u nedopušten odnos i smijao se gledajući jednu filmsku komediju. Nemam više što da vam kažem.
– Kad je sjeo, u sudnici je svejednako vladao muk. Ali odjednom Marie zajeca, reče da nije bilo baš tako, da je tu bilo i koječega drugog, da su je natjerali da kaže suprotno od onoga što misli, da me dobro poznaje i da nisam učinio nikakvo zlo. Ali, na predsjednikov znak, podvornik je odvede i rasprava se nastavi.`;

const P_MIDA = `Gustav Schwab, Mida

Jednom je moćni bog Dioniz odlutao sa svojim bakhanticama i satirima prijeko u Malu Aziju. Ondje je vrludao po visovima brda Tmola, obraslim vinovom lozom, a pratila ga njegova družina. Samo Silena, stare pijanice, nije bilo s njima. Njega je svladalo vino pa je zaspao i tako zaostao. Zaspala starca našli su frigijski seljaci, svezali ga vijencima od cvijeća i poveli ga pred svoga kralja Midu. Kralj s poštovanjem pozdravi prijatelja svetog boga, primi ga srdačno i gostio ga deset dana i deset noći. Jedanaesto jutro izvede kralj svoga gosta na lidijska polja, gdje ga preda Dionizu. Obradovan što je ponovno uz njega stari drug, Dioniz nagovori kralja neka zatraži od njega bilo kakav dar. Tada Mida reče:
– Ako smijem birati, veliki bože Bakho, onda učini da se sve čega se dotaknem pretvori u sjajno zlato.
Bog požali što Mida nije pogodio bolje izabrati, ali mu ipak dade da mu se želja ispuniti. Radujući se kobnom daru, pohrli Mida natrag i odmah pokuša da li se obećanje obistinjuje. I gle, zelena grana koju je otkinuo s jednoga hrasta pretvori se u zlato. Brzo podigne kamen sa zemlje, a kamen se stvori sjajnim grumenom zlata. Kidao je zrelo klasje s vlatova, a žeo je zlato. Voće što ga je ubirao sa stabla svijetlilo se kao zlatne jabuke Hesperida. Sav ushićen potrči u svoju palaču. Ali tek što se prstom dotakao dovratka, već su se stupovi sjajili kao vatra. Dapače, i voda u koju je umočio ruke pretvorila se u zlatnu tekućinu.
Izvan sebe od radosti, zapovjedi slugama da mu prirede obilan ručak. Začas je stajao spremljen stol, krcat izvrsna pečenja i bijela kruha. Kralj posegne za kruhom – i sveti dar Demetrin pretvori se u tvrdu kovinu. Stavi komad mesa u usta – i sjajni mu lim zazveči među zubima. Uzme pehar da srkne mirisava vina – a grlom kao da mu kliznu tekuće zlato. Sada mu sine kakvo je strahovito dobro izmolio za dar. Tako bogat, a ipak tako siromašan, proklinjao je svoju ludost, jer nije mogao da utaži glada ni žeđe, užasna smrt bila je neizbježna. U očaju udari se pesnicom po čelu – o, užasa! i lice mu se zasja i zaiskri kao zlato. Tada u strahu podiže ruke k nebu i pomoli se:
– Milost, milost, oče Dionize! Oprosti meni slaboumnom grešniku i oduzmi od mene ovo blještavo zlo! Bakho, milostivi bog, usliši molbu raskajana luđaka, skine s njega čaroliju i naloži mu:
– Pođi do rijeke Paktola i idi uz nju dok ne dođeš do njezina izvora u gorama. Ondje gdje pjenušava voda izbija iz stijene zagnjuri glavu u hladni mlaz, da se oslobodiš zlatnoga sjaja. Sa zlatom speri zajedno i svoj grijeh!
Mida se pokori božjoj zapovijedi, i, gle, istoga časa ostavi ga čarolija, ali zlatotvorna snaga prijeđe na rijeku, koja otada nosi sa sobom dragocjenu kovinu u velikoj količini.
Od toga vremena mrzio je Mida svako bogatstvo, napustio je svoju veličanstvenu palaču i rado je vrludao po poljima i šumama poštujući poljskoga boga Pana čija su omiljela boravišta bile hladovite pećine u gorama.`;

const P_GOLDONI = `Carlo Goldoni, Gostioničarka Mirandolina

GROF: Mirandolino, tražio sam Vas.
MIRANDOLINA: Tu sam, s ovim plemenitašicama.
GROF: Plemenitašicama? Ponizno se klanjam.
ORTENSIA: Vaša odana službenica. (tiho Dejaniri) (Ovaj plemić imućniji je od onog drugog.)
DEJANIRA (tiho Ortensiji): (Ali ja ne znam kako se iskamči dar.)
MARKIZ (tiho Mirandolini): (Hej! Pokažite grofu rupčić.)
MIRANDOLINA: Pogledajte, gospodine grofe, kakav sam lijep dar dobila od gospodina markiza. (pokaže rupčić grofu)
GROF: Oh, to me veseli! Sjajno, gospodine markiže.
MARKIZ: Eh, ništa, ništa. Trice. Odnesite ga, neću da to govorite. Nije potrebno da se zna što činim.
MIRANDOLINA (za sebe): (Nije potrebno da se zna, a tjera me da ga pokažem. Siromaštvu oholost ne priliči.)
GROF (Mirandolini): Ako dopuštaju ove gospođe, htio bih Vam nešto reći.
ORTENSIA: Slobodno izvolite.
MARKIZ (tiho Mirandolini): (Taj \u0107ete rup\u010Dis\u0107 u d\u017eepu uni\u0161titi.)
MIRANDOLINA: Eh, odlo\u017eit \u0107u ga u pamuk, da se ne zgu\u017eva!
GROF (Mirandolini): Pogledajte ovaj mali ukras od dijamanata.
MIRANDOLINA: Vrlo je lijep.
GROF: Pristaje uz naušnice što sam Vam ih darovao. (Ortensia i Dejanira gledaju, pa tiho razgovaraju jedna s drugom)
MIRANDOLINA: Dakako da pristaje, samo je još ljepši.
MARKIZ (za sebe): (Proklet da je grof, njegovi dijamanti, njegov novac i vrazi ga njegovi odnijeli.)
GROF (Mirandolini): Zato Vam ja evo darujem ukras, da biste imali nakit koji pristaje uz onaj koji imate.
MIRANDOLINA: Nipošto ga neću uzeti.
GROF: Nećete valjda biti tako neuljudni.
MIRANDOLINA: Oh! Ja neuljudna nisam nikada. Da Vas ne uvrijedim, uze\u0107u ga.
(Ortensia i Dejanira razgovaraju kao gore, gledajući kako je grof velikodušan)
MIRANDOLINA: Ha? Što kažete na to, gospodine markiže? Zar nije lijep ovaj ukras?
MARKIZ: U svojoj vrsti rupčić je ukusniji.
GROF: Jest, ali od vrste do vrste priličan je razmak.
MARKIZ: Divota! Javno se hvaliti velikim troškom.
GROF: Da, da, Vi svoje darove dajete tajno.
MIRANDOLINA (za sebe): (Ovaj put uistinu mogu reći da dok se dvojica svađaju, treći likuje.)
MARKIZ: Hoću, slatke gospođe, ručati s vama.
ORTENSIA (grofu): Tko je ovaj drugi gospodin?
GROF: Ja sam grof od Albafiorite, vama na usluzi.
DEJANIRA: Borati! To je ugledna obitelj, poznajem je. (i ona pristupi grofu)

[U ispitnoj knjižici slijedi skraćeni odlomak označen s (…).]

GROF: Stojim vam na usluzi, gospođe. Jeste li same? Zar uza se nemate muškaraca?
MARKIZ: Ja sam tu, gospodine, pa im niste potrebni Vi.
ORTENSIA: Same smo, gospodine grofe. Re\u0107i \u0107emo Vam za\u0161to.
GROF: Mirandolino.
MIRANDOLINA: Gospodine.
GROF: Naložite da se u mojoj sobi prostre za troje. (Ortensiji i Dejaniri) Hoćete li se udostojati i ukazati mi čast?
ORTENSIA: Primimo Vaš ljubazni poziv.
MARKIZ: Ali te su gospođe pozvale mene.
GROF: One mogu slobodno odlučiti da izvole učiniti kako im se prohtije, ali za mojom malom trpezom više od troje ne stane.
MARKIZ: I to bih htio vidjeti…
ORTENSIA: Pođimo, pođimo, gospodine grofe. Gospodin markiže nas društvom udostojiti drugi put. (ode)`;

const P_PHARMA = `Sandra Krstev Barać, Kako smanjiti svakodnevni umor (inPharma, br. 86, srpanj/kolovoz 2024.)

Nema sumnje da bi većina nas voljela imati više energije i vitalnosti jer smo tada produktivniji na poslu, boljega smo raspoloženja i pozitivnije doživljavamo svijet. No činjenica je da su neke od najčešćih svakodnevnih boljki suvremenoga čovjeka manjak energije i umor.
Dobra je vijest da se razina energije može podići, i to posve prirodno. Prvi je korak odabir pravih namirnica bogatih hranjivim tvarima kojima se tijelo opskrbljuje elementima potrebnim za proizvodnju energije. Ako se prehrana temelji na pekarskim proizvodima i rafiniranim ugljikohidratima, tijelo \u0107e dobiti brz izvor energije, ali tu energiju jo\u0161 br\u017ee izgubiti. Zato je za dugotrajan izvor energije najbolje birati uravnotežene obroke kojima se uz kompleksne ugljikohidrate i vlakna unose i proteini i zdrave masnoće. Oni zahtijevaju dulju probavu, pa pomažu stabilizirati razinu glukoze u krvi te osigurati stalnu opskrbu energijom. Cjelovite žitarice poput kvinoje, prosa i smeđe riže u kombinaciji s mesom peradi, ribom ili jajima, uz dodatak povrća i nezaobilaznoga maslinova ulja, optimalna su kombinacija uz koju neće doći do nagloga pada energije.

Vitamini i minerali bitni za energiju
Da bi se uspješno proizvela energija, potrebni su mikronutrijenti. Među njima su najpoznatiji vitamini B-kompleksa koji imaju važnu ulogu u oslobađanju energije, a ujedno imaju i pozitivan učinak na raspoloženje i ublažavanje stresa. Osim toga, bitno je unijeti i dovoljno vitamina C jer je on poznat imunostimulans i snažan antioksidans, a potreban je i za iskorištavanje masti kao izvora energije. U borbi protiv umora i u stimulaciji energije važnu ulogu ima i željezo. Njegov nedostatak narušava tjelesnu aktivnost uzrokujući umor i letargiju, smanjuje radnu sposobnost i usporava misaone procese, stoga je u prehranu poželjno uključiti namirnice bogate željezom (meso, ribe, mahunarke, ali i tamnozeleno lisnato povrće).
Ipak, ponekad ni uz najbolju volju nije moguće samo prehranom osigurati dovoljno vitamina i minerala, već je važno u prehranu unijeti pripravke koji sadrže biljke koje se tradicionalno upotrebljavaju za prevladavanje umora, a tu sigurno možemo izdvojiti macu i guaranu.

Crna maca kao pomoć za mentalni fokus i izdržljivost
Tko je ikad tražio prirodnu pomoć u slučaju hormonskoga disbalansa, velika je vjerojatnost da se upoznao s macom, biljkom peruanskih Anda. No, maca (Lepidium meyenii) ima znatno dalekosežniju primjenu – tradicionalna upotreba veže se upravo uz povećanje energije i smanjenje umora. Energizirajući učinak mace potvrđuje i znanost. Prema studiji objavljenoj 2005. godine u časopisu Anales de la Facultad de la Medicina članovi jednoga nogometnog tima uzimali su 1500 mg mace tijekom 60 dana. Istraživački tim pratio je brzinu i potrošnju kisika, i to prije i nakon dvomjesečne primjene mace. Rezultati su pokazali povećanje tjelesnih performansi, posebice povećanje potrošnje kisika za čak 33 %. Na temelju rezultata autori su zaključili da maca može poboljšati razinu energije, i to ne samo kod sportaša, već i kod svih ljudi.

Guarana za energetski boost
Guarana je biljka amazonskoga područja s dugom tradicijom upotrebe. Autohtono stanovništvo izuzetno je cijeni zbog stimulirajućega učinka pa tako postoje zapisi da su pili guaranu kako bi mogli loviti dulji period bez umaranja. Danas znamo da je za energetski boost koji pruža guarana zaslužan kofein koji ona sadrži u značajnoj količini, no najpoznatiji stimulans središnjega živčanog sustava nije jedina aktivna tvar zaslužna za blagodati biljke.
Da je riječ o uistinu čudesnoj biljci koja povećava pamćenje, dokazuje i analiza objavljena ove godine u časopisu Nutrients. Dodatno, još su Mattei i autori davne 1998. otkrili da guarana može zaštititi od tjelesnih i psiholoških posljedica stresa.

Trebate dodatnu energiju?
U današnjoj užurbanoj radnoj i privatnoj svakodnevici većini nam treba dodatna energija. Pravi je izbor pomoć u vidu posebno formuliranih pripravaka namijenjenih povećanju razine energije i smanjenju umora. Tu se ističe novi pripravak E-Power kvalitetnoga domaćeg proizvođača Energodina. Uz vitamine B-kompleksa E-Power sadrži željezo, krom i vitamin D, ali i cijenjenu crnu macu, kao i tjelesni i mentalni stimulans guaranu. Formulacija je dodatno pojačana supervoćem camu camu, najbogatijim prirodnim izvorom vitamina C. E-Power sadrži i L-citrulin. Riječ je o neesencijalnoj aminokiselini koju naše tijelo sintetizira, a nalazimo je primjerice i u lubenici. Djeluje u sinergiji s ostalim sastojcima E-Powera pružajući prirodni stimulans energije svima kojima je to potrebno.` + `
I savjet za kraj, za dodatnu energiju i borbu protiv umora ne zaboravite piti dovoljno teku\u0107ine, ali i boraviti u prirodi. Sudjelujte u na\u0161oj nagradnoj igri u kojoj \u0107e sretni dobitnici po\u010detkom sljede\u0107e godine otputovati u domovinu guarane!

Prilagođeno prema: www.pharmeria.hr`;

const P_SONATA = `Zrinka Matić, Dvije sonate

Krećući se preko granica vremena i prostora, glazbenih stilova i razdoblja, sonata kao žanr i kao forma započinje svoju epopeju kao predah od pjeva u vidu sviračke igre, a razvija se u intrigantan šah glazbenih poteza, apstraktnu tvorbu formiranu u nekoliko stavaka, sročenih u nizu vremenom prokušanih pravila, upravo onoliko fleksibilnih da im se rado priklanjaju i najveći buntovnici i inovatori glazbene povijesti.
Sonatnost Sonate za violinu i klavir u A-duru Césara Francka (1822. – 1890.) uočljiva je ponajprije u tome što sadrži temeljni sonatni princip, koji se očituje u opoziciji (obično harmonijskoj), izloženoj gotovo na samome početku djela, koja se produbljuje, definira i na kraju razrješuje i pomiruje. Taj sonatni pristup funkcionira od sonata 18. stoljeća nadalje, a očituje se i u Franckovoj. Radi se o jednome od najvažnijih djela u opusu ovoga francuskog skladatelja (rođenoga u Liègeu, koji je danas dio Belgije, a 1822. bio je dijelom Ujedinjenoga Kraljevstva Nizozemske).
Bogatom harmonijskom paletom Franck nadograđuje sonatna pravila već od prvih taktova. U mekome Alegrettu, prvome stavku Sonate, predstavljaju se suprotstavljene teme, prva gotovo isključivo na violini, a druga na klaviru. Te teme vratit \u0107e se u narednim stavcima, preobražene tehnikom transformacije motiva, koju Franck usvaja od njezina tvorca Franza Liszta, njegova dobrog prijatelja. Drugi je stavak dramatični scherzo u d-molu, u kojemu se klavir i violina isprepliću u turbulentnome tkanju, ispresijecanome refleksivnim interludijima, sve do konačnoga trijumfa u D-duru. Čežnja izražena kromatskim uzlaznim gestama, prizivajući ne tako dalek odjek Tristan-akorda, provlači se prvim taktovima trećega stavka, čiji naziv Recitativo-Fantasia naznačuje otvorenost forme stavka, u kojemu violina praćena klavirom izlazi daleko na pučinu udaljavajući se i povremeno se osvrćući prema osnovnim glazbenim mislima prvih dvaju stavaka. Posljednji stavak vraća se u sigurnu lagunu optimistične teme, iznesene u kanonu, ali i unutar ovih kontura rađa se mala oluja, reminiscencija na onu iz drugoga stavka, naginjući se opasno iz tonaliteta s pet snizilica prema onome sa šest povisilica. A-dur označava povratak vedrine u radosnome i ushićenome završetku.
Violinistički virtuoz Eugène Ysaye nije od Francka mogao dobiti ljepši dar za svoje vjenčanje 1866. godine u Arlonu u blizini luksemburške granice. Sonatu je tad voljenoj izveo zajedno sa sestrom zajedničkoga prijatelja, pijanisticom Marie-Léontine Bordes-Pène, a Sonata ostaje na njegovu repertoaru sljedećih četrdesetak godina.
Ne\u0161to kasnije, osje\u0107aju\u0107i se zarobljeno u antitezi izme\u0111u poetskoga sadr\u017eaja i formalne strukture, Richard Strauss (1864. \u2013 1949.) svoj \u0107e razvoj u postromanti\u010darskome modernisti\u010dkom smjeru zapo\u010deti vrlo rano. Ipak, njegova su mladena\u010dka djela uronjena u tradiciju. Sonatni oblik dominira ve\u0107inom njih, pa tako i njegovom jedinom Sonatom za violinu i klavir u Es-duru, op. 18, nastalom 1887. \u2013 1888., kojom \u0107e se oprostiti od sonatne forme. Njome Strauss iskazuje romanti\u010dne osje\u0107aje prema budu\u0107oj supruzi Pauline de Ahna, ali i anticipira gusto tkanje simfonijskih pjesama, koje \u0107e uskoro skladati: s lako\u0107om, kao vje\u0161t pijanist i violinist, gradi briljantne, plemenite teme herojskoga karaktera skladaju\u0107i Sonatu u tonalitetu Es-dura, u kojemu je skladana Beethovenova Eroica, a u kojemu \u0107e on sam skladati simfonijsku poemu Ein Heldenleben (\u017divot heroja).`;

export const HRV_CITANKA_PASSAGES: readonly HrvCitankaPassage[] = [
  { firstQ: 0, lastQ: 4, title: "Polazni tekst — pjesma", subtitle: "Silvije Strahimir Kranjčević", body: P_KRANJCEVIC },
  { firstQ: 5, lastQ: 9, title: "Polazni tekst — odlomak iz romana", subtitle: "Albert Camus, Stranac", body: P_CAMUS },
  { firstQ: 10, lastQ: 14, title: "Polazni tekst — mit", subtitle: "Gustav Schwab, Mida", body: P_MIDA },
  { firstQ: 15, lastQ: 19, title: "Polazni tekst — drama", subtitle: "Carlo Goldoni, Gostioničarka Mirandolina", body: P_GOLDONI },
  { firstQ: 20, lastQ: 24, title: "Polazni tekst — članak", subtitle: "Sandra Krstev Barać", body: P_PHARMA },
  { firstQ: 25, lastQ: 29, title: "Polazni tekst — glazba", subtitle: "Zrinka Matić, Dvije sonate", body: P_SONATA },
];

/** Točni odgovori 1–30 (čitanje) prema NCVVO. */
export const HRV_CITANKA_CORRECT: readonly HrvCitankaLetter[] = [
  "D",
  "C",
  "A",
  "D",
  "A",
  "B",
  "B",
  "A",
  "B",
  "B",
  "A",
  "C",
  "D",
  "C",
  "D",
  "A",
  "A",
  "D",
  "C",
  "C",
  "A",
  "C",
  "C",
  "D",
  "C",
  "B",
  "D",
  "D",
  "B",
  "C",
];

export const HRV_CITANKA_QUESTIONS: readonly HrvCitankaQuestion[] = [
  {
    label: "1.",
    stem: "Kakvim je tonom napisana pjesma?",
    options: { A: "baladičnim", B: "elegičnim", C: "idiličnim", D: "ironičnim" },
  },
  {
    label: "2.",
    stem: "Koji su od sljedećih motiva u oprečnome odnosu u pjesmi?",
    options: {
      A: "psić – ljudi",
      B: "ruka – peta",
      C: "Kastor – psine",
      D: "pjesma – lovor",
    },
  },
  {
    label: "3.",
    stem: "O kojoj metodi govori lirski subjekt u sljedećemu stihu?\nZlatna metoda! Cjelovom tijem shvatiste život!",
    options: {
      A: "o dodvoravanju drugima",
      B: "o suosjećanju s drugima",
      C: "o skromnome načinu života",
      D: "o spoznaji moralnih vrijednosti",
    },
  },
  {
    label: "4.",
    stem: "Koja se od sljedećih tvrdnja odnosi na lirski subjekt?",
    options: {
      A: "Pohvaljuje suživot čovjeka i psa.",
      B: "Teži visokomu društvenom položaju.",
      C: "Kudi pse lutalice i njihov način života.",
      D: "Osuđuje ponašanje svojih suvremenika.",
    },
  },
  {
    label: "5.",
    stem: "Koja se od sljedećih tvrdnja ne odnosi na pjesmu?",
    options: {
      A: "Napisana je u dijaloškome obliku.",
      B: "Antički su motivi u kontrastu s njezinom temom.",
      C: "Deminutivi su upotrijebljeni u pejorativnome značenju.",
      D: "U pjesničkome jeziku upotrebljavaju se kolokvijalizmi i žargonizmi.",
    },
  },
  {
    label: "6.",
    stem: "Koje mišljenje o pripovjedaču ima Céleste?",
    options: {
      A: "da je pripovjedač hladnokrvni ubojica",
      B: "da je pripovjedač nehotice počinio zločin",
      C: "da je pripovjedač zahvalan na njegovu iskazu",
      D: "da je pripovjedač iskorištavao njegovu velikodušnost",
    },
  },
  {
    label: "7.",
    stem: "Zbog kojega je razloga u sudnici nastupila tišina?",
    options: {
      A: "Prisutni su htjeli čuti što slijedi.",
      B: "Prisutni su bili zgranuti Marijinim odgovorom.",
      C: "Prisutni su se iznenadili zbog optuženikova ponašanja u sudnici.",
      D: "Prisutni su bili impresionirani tužiteljevim ispitivačkim sposobnostima.",
    },
  },
  {
    label: "8.",
    stem: "S kojim ciljem tužitelj ispituje Marie o danu kad se zbližila s pripovjedačem?",
    options: {
      A: "da prikaže pripovjedača kao bezosjećajnoga čovjeka",
      B: "da se naruga Marie zbog njezine veze s pripovjedačem",
      C: "da otkrije kako pripovjedač provodi svoje slobodne dane",
      D: "da bi naveo Marie da poroti otkrije sve što zna o pripovjedačevu zločinu",
    },
  },
  {
    label: "9.",
    stem: "Koje se od sljedećih stilskih obilježja odnosi na polazni tekst?",
    options: {
      A: "lirizam",
      B: "impersonalnost",
      C: "načelo tipičnosti",
      D: "estetika ružnoće",
    },
  },
  {
    label: "10.",
    stem: "Kojom je pripovjednom tehnikom napisano djelo kojemu pripada polazni tekst?",
    options: {
      A: "strujom svijesti",
      B: "pripovijedanjem u 1. licu",
      C: "pripovijedanjem u 3. licu",
      D: "slobodnim neupravnim govorom",
    },
  },
  {
    label: "11.",
    stem: "Zbog kojega je razloga Dioniz odlučio ispuniti Midi svaku želju?",
    options: {
      A: "Mida je bio gostoljubiv.",
      B: "Mida mu je bio stari prijatelj.",
      C: "Htio je Midi pokazati svoju moć.",
      D: "Htio je provjeriti Midinu inteligenciju.",
    },
  },
  {
    label: "12.",
    stem: "Zbog kojega je razloga Mida poželio da se skine s njega čarolija?",
    options: {
      A: "Shvatio je da je lud.",
      B: "Shvatio je da je previše bogat.",
      C: "Shvatit \u0107e da \u0107e umrijeti od gladi.",
      D: "Shvatit \u0107e da \u0107e ga bogovi kazniti.",
    },
  },
  {
    label: "13.",
    stem: "Kojom se od sljedećih rečenica iskazuje da je Mida svjestan da je njegova želja loša?",
    options: {
      A: "Kidao je zrelo klasje s vlatova, a žeo je zlato.",
      B: "Ali tek što se prstom dotakao dovratka, već su se stupovi sjajili kao vatra.",
      C: "Izvan sebe od radosti, zapovjedi slugama da mu prirede obilan ručak.",
      D: "Sada mu sine kakvo je strahovito dobro izmolio za dar.",
    },
  },
  {
    label: "14.",
    stem: "Koja se od sljedećih mitoloških tema odnosi na polazni tekst?",
    options: {
      A: "traganje za besmrtnosti",
      B: "panteistički doživljaj svijeta",
      C: "moralno utemeljenje čovjeka",
      D: "razumijevanje civilizacijskih promjena",
    },
  },
  {
    label: "15.",
    stem: "Koje je od sljedećih obilježja pripovjednoga teksta prisutno u polaznome tekstu?",
    options: {
      A: "retardacija",
      B: "retrospekcija",
      C: "slobodni neupravni govor",
      D: "kronološko pripovijedanje",
    },
  },
  {
    label: "16.",
    stem: "Kako se osjeća markiz nakon što je Mirandolina primila poklone od grofa?",
    options: {
      A: "Uznemiren je jer je svjestan da je grofov poklon skuplji od njegova.",
      B: "Nezadovoljan je jer nije uspio svoj poklon Mirandolini dati u tajnosti.",
      C: "Siguran je u sebe jer je uvjeren da je njegov poklon vredniji od grofova.",
      D: "Sretan je jer je Mirandolina grofov poklon prihvatila samo iz pristojnosti.",
    },
  },
  {
    label: "17.",
    stem: "Zbog kojega razloga Ortensia i Dejanira prihvaćaju grofov poziv na zajednički ručak?",
    options: {
      A: "jer je grof darežljiviji od markiza",
      B: "jer je grof Dejanirin obiteljski prijatelj",
      C: "jer mu žele objasniti zašto su same u gostionici",
      D: "jer su ljubomorne na to što je markiz darovao Mirandolini rupčić",
    },
  },
  {
    label: "18.",
    stem: "Koje je značenje sljedeće rečenice u polaznome tekstu?\nSiromaštvu oholost ne priliči.",
    options: {
      A: "Ortensia se drži uzvišeno jer je plemkinja.",
      B: "Grof se nepotrebno hvali svojim bogatstvom.",
      C: "Mirandolina je skromna jer je pučkoga podrijetla.",
      D: "Markiz se razmeće svojim poklonom iako nema novca.",
    },
  },
  {
    label: "19.",
    stem: "Koja je uloga teksta u zagradama koji je napisan neukošenim slovima?",
    options: {
      A: "Navode se neverbalni elementi dramske radnje.",
      B: "Prikazuje se tekst koji se ne izgovara na pozornici.",
      C: "Ukazuje se na stvarne motive i reakcije dramskih lica.",
      D: "Objašnjava se u kojim se uvjetima događa scena ili prizor.",
    },
  },
  {
    label: "20.",
    stem: "U kojoj je od sljedećih rečenica upotrijebljena ironija?",
    options: {
      A: "Vaša odana službenica.",
      B: "Nije potrebno da se zna što činim.",
      C: "Da, da, Vi svoje darove dajete tajno.",
      D: "To je ugledna obitelj, poznajem je.",
    },
  },
  {
    label: "21.",
    stem: "Koja je glavna namjena polaznoga teksta?",
    options: {
      A: "potaknuti čitatelje na kupnju novoga energetskog pripravka",
      B: "uputiti čitatelje na postupke pripreme uravnoteženih obroka",
      C: "educirati čitatelje o tome kako prirodnim putem povećati energiju",
      D: "predstaviti rezultate znanstvenih studija objavljenih u časopisima",
    },
  },
  {
    label: "22.",
    stem: "Koje se od sljedećih obilježja odnosi na polazni tekst?",
    options: {
      A: "Prema obliku tekst je isprekidan.",
      B: "Prema sadržaju tekst je raspravljački.",
      C: "Tekst je napisan popularno-znanstvenim stilom.",
      D: "Pojmovi napisani ukošenim slovima u tekstu imaju funkciju poveznice.",
    },
  },
  {
    label: "23.",
    stem: "Za koju je od sljedećih tvrdnja u polaznome tekstu iskazano da je znanstveno dokazana?",
    options: {
      A: "Željezo ima važnu ulogu u borbi protiv umora.",
      B: "Camu camu najbogatiji je prirodni izvor vitamina C.",
      C: "Uzimanje mace omogućuje povećanje fizičke izdržljivosti svih ljudi.",
      D: "Samo prehranom nemoguće je unijeti dovoljno vitamina i minerala.",
    },
  },
  {
    label: "24.",
    stem: "Za koji je od sljedećih sastojaka iskazano da potiče rad živčanoga sustava?",
    options: { A: "za glukozu", B: "za vitamin C", C: "za željezo", D: "za kofein" },
  },
  {
    label: "25.",
    stem: "Koje je godine objavljena analiza u časopisu Nutrients?",
    options: {
      A: "1998. godine",
      B: "2005. godine",
      C: "2024. godine",
      D: "2025. godine",
    },
  },
  {
    label: "26.",
    stem: "Kojoj tekstnoj vrsti pripada polazni tekst?",
    options: { A: "izvještaju", B: "prikazu", C: "reportaži", D: "životopisu" },
  },
  {
    label: "27.",
    stem: "Koje je od sljedećih stilskih obilježja naglašeno u polaznome tekstu?",
    options: {
      A: "aforističnost",
      B: "alegoričnost",
      C: "objektivnost",
      D: "slikovitost",
    },
  },
  {
    label: "28.",
    stem: "Što je od sljedećega César Franck, prema polaznome tekstu, usvojio od Franza Liszta?",
    options: {
      A: "dramatičnost",
      B: "sonatna pravila",
      C: "suprotstavljenost tema",
      D: "tehniku transformacije motiva",
    },
  },
  {
    label: "29.",
    stem: "Koja je osoba svirala violinu na vjenčanju u Arlonu?",
    options: {
      A: "Franz Liszt",
      B: "Eugène Ysaye",
      C: "César Franck",
      D: "Marie-Léontine Bordes-Pène",
    },
  },
  {
    label: "30.",
    stem: "Koja od sljedećih tvrdnja o Richardu Straussu nije iskazana u polaznome tekstu?",
    options: {
      A: "Posvetio je sonatu voljenoj ženi.",
      B: "Skladao je sonate samo u mladosti.",
      C: "S Beethovenom je skladao simfoniju Život heroja.",
      D: "Udaljava se od tradicije tijekom svojega umjetničkog razvoja.",
    },
  },
];

export function passageForCitankaIndex(qIndex: number): HrvCitankaPassage | null {
  return HRV_CITANKA_PASSAGES.find((p) => qIndex >= p.firstQ && qIndex <= p.lastQ) ?? null;
}
