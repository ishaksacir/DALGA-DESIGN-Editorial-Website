import { asset } from '@/constants/site'

/**
 * Every visible text field is `{ bs, en }`; components resolve it with `tr()` from `useI18n`.
 * The `category.en` value doubles as the stable key for catalogue filtering.
 */

/** Care instructions, grouped by cloth so pieces cut from the same fabric read the same. */
const CARE = {
  cotton: [
    {
      bs: 'Mašinsko pranje na 30°, nježan program, naopako',
      en: 'Machine wash at 30°, gentle cycle, inside out',
    },
    {
      bs: 'Ne sušiti u sušilici — sušiti na konopcu u hladu',
      en: 'Do not tumble dry — line dry in the shade',
    },
    {
      bs: 'Peglati na srednjoj temperaturi dok je još blago vlažno',
      en: 'Iron on medium while still slightly damp',
    },
  ],
  rawCotton: [
    {
      bs: 'Ručno pranje u hladnoj vodi ili na 30° nježnim programom',
      en: 'Hand wash cold, or 30° on a gentle cycle',
    },
    {
      bs: 'Odvežite mašnu od tafta i operite je zasebno, ručno',
      en: 'Untie the taffeta bow and wash it separately by hand',
    },
    {
      bs: 'Sušiti položeno u hladu; peglati na srednjoj temperaturi dok je vlažno',
      en: 'Dry flat in the shade; iron on medium while damp',
    },
  ],
  cottonTaffeta: [
    {
      bs: 'Samo hemijsko čišćenje — ručno tkani umetak se ne smije natapati',
      en: 'Dry clean only — the hand-woven inset must not be soaked',
    },
    {
      bs: 'Nabore uklonite parom; nikada ne peglajte direktno preko umetka',
      en: 'Steam to release creases; never press the inset directly',
    },
    {
      bs: 'Čuvati okačeno u prozračnoj pamučnoj navlaci',
      en: 'Store hanging in a breathable cotton cover',
    },
  ],
  linen: [
    {
      bs: 'Ručno ili mašinsko pranje na 30°, nježan program',
      en: 'Hand wash or machine wash at 30°, gentle cycle',
    },
    {
      bs: 'Ne sušiti u sušilici — oblikovati i sušiti položeno u hladu',
      en: 'Do not tumble dry — reshape and dry flat in the shade',
    },
    {
      bs: 'Peglati dok je vlažno ili ostaviti mekano i izgužvano',
      en: 'Iron while damp, or leave it soft and creased',
    },
  ],
  mixed: [
    {
      bs: 'Gornji dio: mašinsko pranje na 30°, nježan program',
      en: 'Top: machine wash at 30°, gentle cycle',
    },
    {
      bs: 'Suknja: samo hemijsko čišćenje, da plisei ostanu oštri',
      en: 'Skirt: dry clean only, to keep the pleats sharp',
    },
    {
      bs: 'Osvježiti parom između nošenja; suknju čuvati okačenu o struk',
      en: 'Steam between wears; store the skirt hanging by its waist',
    },
  ],
  wool: [
    { bs: 'Samo hemijsko čišćenje', en: 'Dry clean only' },
    {
      bs: 'Nakon svakog nošenja očetkati mekom četkom za odjeću',
      en: 'Brush with a soft clothes brush after each wear',
    },
    {
      bs: 'Osvježiti parom umjesto peglanja; čuvati na oblikovanoj vješalici',
      en: 'Steam rather than press; store on a shaped hanger',
    },
  ],
  tweedShearling: [
    {
      bs: 'Samo specijalizovano hemijsko čišćenje — janjeće krzno traži čišćenje za kožu',
      en: 'Specialist dry clean only — shearling needs a leather cleaner',
    },
    {
      bs: 'Bouclé nježno četkati; obrub držati dalje od direktne toplote',
      en: 'Brush the bouclé gently; keep the trim away from direct heat',
    },
    {
      bs: 'Čuvati na oblikovanoj vješalici u prozračnoj navlaci',
      en: 'Store on a shaped hanger in a breathable cover',
    },
  ],
  cottonJacquard: [
    { bs: 'Preporučuje se hemijsko čišćenje', en: 'Dry clean recommended' },
    {
      bs: 'Mrlje čistiti hladnom vodom i mekom krpom',
      en: 'Spot clean with cold water and a soft cloth',
    },
    {
      bs: 'Peglati na niskoj temperaturi, samo s naličja',
      en: 'Iron on low, on the reverse only',
    },
  ],
}

/** Spec labels shared across pieces. */
const SPEC = {
  fabric: { bs: 'Tkanina', en: 'Fabric' },
  waist: { bs: 'Struk', en: 'Waist' },
  neckline: { bs: 'Izrez', en: 'Neckline' },
  inset: { bs: 'Umetak', en: 'Inset' },
  skirt: { bs: 'Suknja', en: 'Skirt' },
  closure: { bs: 'Zatvaranje', en: 'Closure' },
  wornWith: { bs: 'Nosi se uz', en: 'Worn with' },
  finish: { bs: 'Završna obrada', en: 'Finish' },
  hem: { bs: 'Rub', en: 'Hem' },
  sleeve: { bs: 'Rukav', en: 'Sleeve' },
  pockets: { bs: 'Džepovi', en: 'Pockets' },
  trim: { bs: 'Obrub', en: 'Trim' },
  collar: { bs: 'Ovratnik', en: 'Collar' },
  silhouette: { bs: 'Silueta', en: 'Silhouette' },
  detail: { bs: 'Detalj', en: 'Detail' },
}

const CATEGORY = {
  blouseSkirt: { bs: 'Bluza i suknja', en: 'Blouse & skirt' },
  eveningGown: { bs: 'Večernja haljina', en: 'Evening gown' },
  jacketSkirt: { bs: 'Jakna i suknja', en: 'Jacket & skirt' },
  dayDress: { bs: 'Dnevna haljina', en: 'Day dress' },
  dress: { bs: 'Haljina', en: 'Dress' },
  topSkirt: { bs: 'Top i suknja', en: 'Top & skirt' },
  coat: { bs: 'Kaput', en: 'Coat' },
}

const commission = (number) => ({ bs: `Narudžba ${number}`, en: `Commission ${number}` })

export const products = [
  {
    id: 'raw-cotton-set',
    number: '01',
    name: { bs: 'Komplet od sirovog pamuka', en: 'Raw cotton set' },
    category: CATEGORY.blouseSkirt,
    collection: commission('01'),
    year: '2026',
    img: asset('collection-1.jpg'),
    alt: {
      bs: 'Bluza od sirovog pamuka sa suknjom vezanom mašnom od tafta',
      en: 'Raw cotton blouse with a taffeta bow-tied skirt',
    },
    intro: {
      bs: 'Radna odjeća u kojoj bi se keramičarka mogla vjenčati — skrojena od tkanine ostavljene tačno onakvom kakva je sišla s razboja.',
      en: 'Workwear a ceramicist could marry in — cut from cloth left exactly as it came off the loom.',
    },
    description: {
      bs: 'Bluza je od nebijeljenog pamuka, s tkanjem i neravninama ostavljenim netaknutim, tako da tkanina čuva sjećanje na razboj. Suknja je nabrana na mekani pojas i zatvara se jednom mašnom od tafta koju ona svaki put veže drugačije — nikad sasvim ista silueta dvaput.',
      en: 'The blouse is unbleached cotton, its weave and slubs left untouched so the fabric keeps the memory of the loom. The skirt gathers onto a soft waistband and closes with a single taffeta bow that she reties differently every time she wears it — never quite the same silhouette twice.',
    },
    composition: { bs: '100% pamuk', en: '100% cotton' },
    care: CARE.rawCotton,
    creation: {
      bs: 'Skrojeno na ravno, pričvršćeno pribadačama na lutki, a zatim oblikovano na klijentici kroz tri probe. Rub je ostavljen sirov i ručno uvijen samo tamo gdje dodiruje tijelo.',
      en: 'Cut flat, pinned on the mannequin, then shaped on the client across three fittings. The hem is left raw and hand-rolled only where it meets the body.',
    },
    specs: [
      [SPEC.fabric, { bs: 'Nebijeljeni pamuk', en: 'Unbleached cotton' }],
      [SPEC.waist, { bs: 'Mašna od tafta', en: 'Taffeta bow tie' }],
      [SPEC.neckline, { bs: 'Vezica s perlicama', en: 'Drawstring bead tie' }],
    ],
  },
  {
    id: 'umber-gown',
    number: '02',
    name: { bs: 'Haljina boje umbre, tkani umetak', en: 'Umber gown, woven inset' },
    category: CATEGORY.eveningGown,
    collection: commission('02'),
    year: '2025',
    img: asset('collection-2.jpg'),
    alt: {
      bs: 'Haljina od tafta boje umbre s ručno tkanim bočnim panelom',
      en: 'Umber taffeta gown with a hand-woven side panel',
    },
    intro: {
      bs: 'Haljina do poda građena oko jednog ručno tkanog panela naslijeđenog od klijentičine bake.',
      en: 'A full-length gown built around a single hand-woven panel carried down from the client’s grandmother.',
    },
    description: {
      bs: 'Gornji dio se otvara u mekani portretni ovratnik i zatvara širokom mašnom od iste tkanine. Niz jednu stranu proteže se uska traka istkana od niti naslijeđenog šala. Ispod, puna kružna suknja zahtijevala je jedanaest metara tafta i tri probe da bi pala kako treba.',
      en: 'The bodice folds open at a soft portrait collar and wraps closed with a wide self-tie bow. Running down one side is a narrow band woven from the threads of an inherited scarf. Below, a full-circle skirt took eleven metres of taffeta and three fittings to hang true.',
    },
    composition: { bs: '100% pamučni taft', en: '100% cotton taffeta' },
    care: CARE.cottonTaffeta,
    creation: {
      bs: 'Tkana traka postavljena je prva; sve ostalo nacrtano je oko nje, tako da se kroj nikada ne bi mogao ponoviti u drugom komadu.',
      en: 'The woven band was set first; everything else was drafted around it, so the pattern could never repeat in another piece.',
    },
    specs: [
      [SPEC.fabric, { bs: 'Pamučni taft', en: 'Cotton taffeta' }],
      [SPEC.inset, { bs: 'Ručno tkani ikat', en: 'Hand-woven ikat' }],
      [SPEC.skirt, { bs: 'Puni krug', en: 'Full circle' }],
    ],
  },
  {
    id: 'paisley-jacket',
    number: '03',
    name: { bs: 'Vunena jakna s paisley uzorkom', en: 'Paisley wool jacket' },
    category: CATEGORY.jacketSkirt,
    collection: commission('03'),
    year: '2025',
    img: asset('collection-3.jpg'),
    alt: {
      bs: 'Jakna od žakard vune s paisley uzorkom preko crne kružne suknje',
      en: 'Paisley jacquard wool jacket over a black circle skirt',
    },
    intro: {
      bs: 'Asimetrična preklopna jakna zatvorena jednim koštanim dugmetom, nošena preko crne kružne suknje iz iste narudžbe.',
      en: 'An asymmetric wrap jacket closed by one bone button, worn over a black circle skirt from the same commission.',
    },
    description: {
      bs: 'Skrojena od guste žakard vune tako da se paisley uzorak susreće tačno na pregibu ovratnika. Jedno koštano dugme postavljeno je visoko, pa prednji dio pada otvoren u mekanom luku. Pripadajuća suknja namjerno je bez ukrasa — sav uzorak živi iznad struka.',
      en: 'Cut from a dense jacquard wool so the paisley meets exactly at the collar fold. The single bone button sits high, letting the front fall open in a soft curve. The matching skirt is unadorned on purpose — all the pattern lives above the waist.',
    },
    composition: { bs: '100% žakard vuna', en: '100% jacquard wool' },
    care: CARE.wool,
    creation: {
      bs: 'Uzorak je ručno usklađen preko svakog šava kako se motiv nikada ne bi prekinuo, a zatim skrojen u jednom dugom zahvatu na stolu ateljea.',
      en: 'Pattern-matched by hand across every seam so the motif never breaks, then cut in one long session on the atelier table.',
    },
    specs: [
      [SPEC.fabric, { bs: 'Žakard vuna', en: 'Jacquard wool' }],
      [SPEC.closure, { bs: 'Jedno koštano dugme', en: 'Single bone button' }],
      [SPEC.wornWith, { bs: 'Crna kružna suknja', en: 'Black circle skirt' }],
    ],
  },
  {
    id: 'sage-linen-dress',
    number: '04',
    name: { bs: 'Lanena haljina boje žalfije', en: 'Sage linen dress' },
    category: CATEGORY.dayDress,
    collection: commission('04'),
    year: '2026',
    img: asset('craftsmanship.jpg'),
    alt: {
      bs: 'Lanena haljina boje žalfije s četvrtastim izrezom i puf rukavima',
      en: 'Sage linen dress with a square neckline and puff sleeves',
    },
    intro: {
      bs: 'Ljetna haljina od lana opranog sedam puta prije krojenja, da bi se već pri prvom nošenju činila godinama starom.',
      en: 'A summer dress in linen washed seven times before cutting, so it would feel years old on the first wearing.',
    },
    description: {
      bs: 'Četvrtasti izrez, kratki puf rukavi i nabrani struk pričvršćen direktno na klijentici tokom jedne duge probe. Lan je mekano opran i bez postave, namijenjen da se gužva i omekšava sa svakim nošenjem.',
      en: 'A square neckline, short puffed sleeves and a gathered waist that was pinned directly on the client during one long fitting. The linen is soft-washed and left unlined, meant to crease and soften further with every wear.',
    },
    composition: { bs: '100% prani lan', en: '100% washed linen' },
    care: CARE.linen,
    creation: {
      bs: 'Opran, osušen i ponovo opran prije prvog reza, a zatim ručno nabran na gornji dio.',
      en: 'Washed, dried and washed again before a single cut, then gathered by hand onto the bodice.',
    },
    specs: [
      [SPEC.fabric, { bs: 'Prani lan', en: 'Washed linen' }],
      [SPEC.neckline, { bs: 'Četvrtasti, puf rukav', en: 'Square, puff sleeve' }],
      [SPEC.finish, { bs: 'Bez postave, mekano opran', en: 'Unlined, soft-washed' }],
    ],
  },
  {
    id: 'darigo-dress',
    number: '05',
    name: { bs: 'Darigo asimetrična haljina', en: 'Darigo asymmetric dress' },
    category: CATEGORY.dress,
    collection: commission('05'),
    year: '2026',
    img: asset('darigo-dress-front.png'),
    images: [
      asset('darigo-dress-front.png'),
      asset('darigo-dress-back.png'),
      asset('darigo-dress-detail.png'),
    ],
    alt: {
      bs: 'Pamučna haljina boje senfa s asimetričnim rubom u obliku maramice i ručno oslikanim panelom na ramenu',
      en: 'Mustard cotton dress with an asymmetric handkerchief hem and hand-painted shoulder panel',
    },
    intro: {
      bs: 'Jedna bala pamuka boje senfa, skrojena da namjerno pada neravnomjerno — rub pronalazi drugačiju liniju na svakome ko je nosi.',
      en: 'A single bolt of mustard cotton, cut to fall unevenly on purpose — the hem finds a different line on everyone who wears it.',
    },
    description: {
      bs: 'Haljina visi sa širokog čamac-izreza na dolman rukavima skrojenim iz jednog dijela s gornjim dijelom, tako da ništa ne vuče na ramenu. Jedna strana nosi ručno oslikan crveni motiv koji se proteže od rukava do ruba; suprotni ugao spušta se u dugi asimetrični vrh. Završena je malom tkanom etiketom sa znakom talasa ateljea, prišivenom nisko pri rubu, gdje je prva primijeti samo ona koja je nosi.',
      en: 'The dress hangs from a wide boat neckline on dolman sleeves cut in one piece with the bodice, so nothing pulls at the shoulder. One side carries a hand-painted red motif that runs from the sleeve to the hem; the opposite corner dips into a long asymmetric point. Finished with a small woven patch bearing the atelier’s wave mark, stitched low near the hem where only the wearer notices it first.',
    },
    composition: { bs: '100% pamuk', en: '100% cotton' },
    care: CARE.cotton,
    creation: {
      bs: 'Asimetrični rub izrezan je slobodnom rukom na lutki, a zatim je motiv na ramenu ručno oslikan prateći pad tkanine umjesto fiksnog uzorka, tako da nijedna haljina ovog kroja nikada ne bi bila oslikana na isti način.',
      en: 'The asymmetric hem was cut freehand on the mannequin, then the shoulder motif was hand-painted to follow the drape rather than a fixed pattern, so no two dresses from this cut would ever paint the same way twice.',
    },
    specs: [
      [SPEC.fabric, { bs: 'Pamuk', en: 'Cotton' }],
      [SPEC.neckline, { bs: 'Široki čamac, dolman rukav', en: 'Wide boat, dolman sleeve' }],
      [SPEC.hem, { bs: 'Asimetrični, u obliku maramice', en: 'Asymmetric handkerchief' }],
    ],
  },
  {
    id: 'ink-wrap-top',
    number: '06',
    name: {
      bs: 'Preklopna bluza boje tinte, plisirana suknja',
      en: 'Ink wrap top, pleated skirt',
    },
    category: CATEGORY.topSkirt,
    collection: commission('06'),
    year: '2026',
    img: asset('navy-wrap-front.png'),
    images: [
      asset('navy-wrap-front.png'),
      asset('navy-wrap-back.png'),
      asset('navy-wrap-front-close.png'),
      asset('navy-wrap-back-close.png'),
    ],
    alt: {
      bs: 'Teget pamučna preklopna bluza s dolman rukavima preko crne plisirane suknje',
      en: 'Navy cotton wrap top with dolman sleeves over a black pleated skirt',
    },
    intro: {
      bs: 'Preklopna bluza skrojena od pamuka boje tamnoplave tinte, zatvorena jednim pojasom od iste tkanine i nošena slobodno preko crne plisirane suknje.',
      en: 'A wrap top cut from ink-navy cotton, closed by a single self-tie belt and worn loose over a black pleated skirt.',
    },
    description: {
      bs: 'Duboki dolman rukavi sužavaju se u usku manžetu, a prednji dio se zatvara u mekani V, pridržan tankim pojasom koji se dvaput obavija oko struka prije nego što se zaveže na leđima. Blijedi otisak znaka talasa sjedi nisko na boku — potpis ateljea utisnut, a ne prišiven. Ispod, ravna crna suknja pada s plisiranog pojasa od teže tkanine, ostavljena jednostavnom kako bi bluza nosila cijeli komad.',
      en: 'Deep dolman sleeves taper to a narrow cuff, and the front folds closed in a soft V, held by a slim self-tie that wraps twice around the waist before knotting at the back. A pale wave-mark print sits low on the hip, the atelier’s signature pressed rather than sewn on. Underneath, a straight black skirt falls from a pleated waistband in a heavier cloth, left plain so the top carries the whole piece.',
    },
    composition: {
      bs: '100% pamučni poplin, suknja od mješavine vune',
      en: '100% cotton poplin, wool-blend skirt',
    },
    care: CARE.mixed,
    creation: {
      bs: 'Preklop je draperiran i ponovo vezan na klijentici na svakoj probi, dok prednji pregib nije stajao potpuno isto, bilo da je vezan labavo ili čvrsto.',
      en: 'The wrap was draped and re-tied on the client at every fitting until the front fold sat exactly the same way whether tied loose or close.',
    },
    specs: [
      [
        SPEC.fabric,
        {
          bs: 'Pamučni poplin, suknja od mješavine vune',
          en: 'Cotton poplin, wool-blend skirt',
        },
      ],
      [SPEC.closure, { bs: 'Preklopni pojas za vezanje', en: 'Self-tie wrap belt' }],
      [SPEC.sleeve, { bs: 'Dolman, s manžetom', en: 'Dolman, cuffed' }],
    ],
  },
  {
    id: 'oat-cropped-jacket',
    number: '07',
    name: {
      bs: 'Kratka jakna boje zobi, plisirana suknja',
      en: 'Oat cropped jacket, pleated skirt',
    },
    category: CATEGORY.jacketSkirt,
    collection: commission('07'),
    year: '2025',
    img: asset('beige-jacket-front.png'),
    images: [
      asset('beige-jacket-front.png'),
      asset('beige-jacket-back.png'),
      asset('beige-jacket-front-close.png'),
    ],
    alt: {
      bs: 'Kratka vunena jakna boje zobi s našivenim džepovima preko crne plisirane suknje',
      en: 'Oat wool cropped jacket with patch pockets over a black pleated skirt',
    },
    intro: {
      bs: 'Kratka radna jakna od vune boje zobi, skrojena tačno toliko kratko da sjedi na pojasu suknje ispod nje.',
      en: 'A cropped workwear jacket in oatmeal wool, cut short enough to sit right at the waistband of the skirt beneath it.',
    },
    description: {
      bs: 'Četiri crna dugmeta zatvaraju široki rever, a dva džepa s poklopcem sjede nisko preko grudi, jedan s malom ručno ispisanom etiketom od dana kada je jakna završena. Manžete se jednom preklapaju i zakopčavaju jednim dugmetom, pa se rukav može produžiti ili skratiti za dva-tri centimetra. Namjerno kratka i četvrtasta, da sjedi iznad ravne crne plisirane suknje od teže, tiše tkanine.',
      en: 'Four black buttons close a wide notch collar, and two flap pockets sit low across the chest, one holding a small hand-lettered label from the day it was finished. The cuffs turn back once and fasten on a single button, so the sleeve can lengthen or shorten by an inch either way. Cut cropped and boxy on purpose, to sit above a straight black pleated skirt in a heavier, quieter cloth.',
    },
    composition: { bs: '100% vuna, suknja od mješavine vune', en: '100% wool, wool-blend skirt' },
    care: CARE.wool,
    creation: {
      bs: 'Krojena prema starom kroju radne jakne, a zatim skraćena i ponovo prilagođena kroz tri probe dok dužina nije pala tačno na kost kuka.',
      en: 'Patterned from a vintage workwear block, then shortened and re-fitted across three sessions until the crop landed exactly at the hip bone.',
    },
    specs: [
      [SPEC.fabric, { bs: 'Vuna, suknja od mješavine vune', en: 'Wool, wool-blend skirt' }],
      [SPEC.closure, { bs: 'Četiri dugmeta, rever', en: 'Four-button, notch collar' }],
      [SPEC.pockets, { bs: 'Dva, s poklopcem, na grudima', en: 'Twin flap, chest-set' }],
    ],
  },
  {
    id: 'emerald-tweed-jacket',
    number: '08',
    name: {
      bs: 'Smaragdna jakna od tvida, obrub od janjećeg krzna',
      en: 'Emerald tweed jacket, shearling trim',
    },
    category: CATEGORY.jacketSkirt,
    collection: commission('08'),
    year: '2025',
    img: asset('teal-tweed-jacket-front.png'),
    images: [
      asset('teal-tweed-jacket-front.png'),
      asset('teal-tweed-jacket-back.png'),
      asset('teal-tweed-jacket-front-close.png'),
    ],
    alt: {
      bs: 'Jakna od tirkizno-crnog bouclé tvida s crnim ovratnikom i manžetama od janjećeg krzna, preko crne suknje',
      en: 'Teal and black bouclé tweed jacket with black shearling collar and cuffs, over a black skirt',
    },
    intro: {
      bs: 'Četvrtasta večernja jakna od bouclé tkanine s tirkiznim nitima, završena dubokim ovratnikom od janjećeg krzna i istim takvim manžetama.',
      en: 'A boxy evening jacket in teal-flecked bouclé, finished with a deep shearling collar and matching cuffs.',
    },
    description: {
      bs: 'Bouclé je tkan sa sitnim crno-tirkiznim karom, skrojen u kratku siluetu zaobljenih ramena koja se zatvara rub uz rub s tri crna dugmeta. Puni ovratnik od janjećeg krzna uzdiže se oko vrata, a isto krzno obavija svaku manžetu širokom trakom — jedina dva mjesta koja jakna traži da se dodirnu. Nosi se otvorena preko jednostavne crne suknje, kako ništa ne bi konkurisalo teksturi.',
      en: 'The bouclé is woven with a fine black-and-teal check, cut into a short, round-shouldered silhouette that closes edge to edge with three black buttons. A full shearling collar stands up around the neck, and the same fur wraps each cuff in a wide band, the only two places the jacket asks to be touched. Worn open over a plain black skirt so nothing competes with the texture.',
    },
    composition: {
      bs: 'Vuneni bouclé, obrub od janjećeg krzna',
      en: 'Wool bouclé, shearling trim',
    },
    care: CARE.tweedShearling,
    creation: {
      bs: 'Krzno je postavljeno posljednje, ručno prišiveno oko ovratnika i manžeta nakon što je bouclé osnova potpuno završena, tako da krzno stoji iznad šava, a ne utonulo u njega.',
      en: 'The shearling was set last, hand-stitched around the collar and cuffs after the bouclé shell was fully finished, so the fur sits proud of the seam rather than sunk into it.',
    },
    specs: [
      [SPEC.fabric, { bs: 'Vuneni bouclé tvid', en: 'Wool bouclé tweed' }],
      [SPEC.trim, { bs: 'Ovratnik i manžete od janjećeg krzna', en: 'Shearling collar and cuffs' }],
      [SPEC.closure, { bs: 'Tri dugmeta, okrugli ovratnik', en: 'Three-button, round collar' }],
    ],
  },
  {
    id: 'ash-cocoon-coat',
    number: '09',
    name: { bs: 'Vuneni kaput kokon boje pepela', en: 'Ash wool cocoon coat' },
    category: CATEGORY.coat,
    collection: commission('09'),
    year: '2025',
    img: asset('grey-cocoon-coat-front.png'),
    images: [asset('grey-cocoon-coat-front.png'), asset('grey-cocoon-coat-back.png')],
    alt: {
      bs: 'Široki vuneni kaput kokon boje pepela s čipkanom trakom na rubu, nošen preko crne haljine',
      en: 'Oversized ash grey wool cocoon coat with a lace hem band, worn over a black dress',
    },
    intro: {
      bs: 'Kaput kokon s jednim dugmetom, skrojen širok kroz tijelo i skupljen samo vlastitom težinom.',
      en: 'A single-button cocoon coat, cut wide through the body and gathered in only by its own weight.',
    },
    description: {
      bs: 'Duboki našiveni džepovi sjede nisko na boku, a široki rever se otvara iznad jednog dugmeta. Traka fine čipke umetnuta je u rub s unutrašnje strane vune i vidi se samo u pregibu kada se kaput pomjeri. Nošen otvoren preko jednostavne crne haljine, napravljen je da se prebaci, a ne da se prilagođava — jedini komad u garderobi koji ne traži ništa od onoga što je ispod.',
      en: 'Deep patch pockets sit low on the hip, and a wide notch lapel folds open over one closing button. A band of fine lace is worked into the hem on the inside face of the wool, showing only in the fold when the coat moves. Worn open over a plain black dress, it is built to be thrown on rather than fitted, the one piece in the wardrobe that asks nothing of what is underneath.',
    },
    composition: { bs: '100% vuna', en: '100% wool' },
    care: CARE.wool,
    creation: {
      bs: 'Skrojen iz jednog širokog kroja bez bočnog šava na kuku, tako da oblik kokona dolazi iz pada tkanine, a ne iz ikakve pense ili nabora.',
      en: 'Cut from a single wide pattern with no side seam at the hip, so the cocoon shape comes from the drape of the cloth rather than any dart or tuck.',
    },
    specs: [
      [SPEC.fabric, { bs: 'Vuna', en: 'Wool' }],
      [SPEC.closure, { bs: 'Jedno dugme', en: 'Single button' }],
      [SPEC.hem, { bs: 'Umetnuta čipkana traka', en: 'Lace inset band' }],
    ],
  },
  {
    id: 'relic-patchwork-coat',
    number: '10',
    name: { bs: 'Patchwork kaput Relikvija', en: 'Relic patchwork coat' },
    category: CATEGORY.coat,
    collection: commission('10'),
    year: '2024',
    img: asset('patchwork-coat-front.png'),
    images: [
      asset('patchwork-coat-front.png'),
      asset('patchwork-coat-back.png'),
      asset('patchwork-coat-front-close.png'),
    ],
    alt: {
      bs: 'Sivo-zlatni kaput s patchwork printom i stojećim ovratnikom, nošen preko crne haljine',
      en: 'Grey and gold patchwork-print coat with a stand collar, worn over a black dress',
    },
    intro: {
      bs: 'Zvonasti kaput otisnut fragmentima starih tekstila — čipkanim bordurama, istrošenim ikatom, ručno ispisanim etiketama — složenim u jedno gusto polje uzoraka.',
      en: 'A swing coat printed with fragments of old textiles, lace borders, worn ikat, hand-lettered labels, pieced into one dense field of pattern.',
    },
    description: {
      bs: 'Visoki stojeći ovratnik zatvara se jednim dugmetom pri grlu, a tijelo pada u labavoj A-liniji od ramena, skrojeno dovoljno dugo da pređe koljeno. Sam print sastavljen je od desetina skeniranih fragmenata — antikne čipke, ikat tkanja, komadića rukopisa — raspoređenih u trake preko tkanine tako da se nijedan motiv ne ponavlja dvaput na istom mjestu. Nosi se preko jednostavne crne haljine, kako bi kaput govorio sam.',
      en: 'A high stand collar closes with a single button at the throat, and the body falls in a loose A-line from the shoulder, cut long enough to clear the knee. The print itself is built from dozens of scanned fragments, antique lace, ikat weave, a scrap of handwriting, arranged into bands across the cloth so no single motif repeats twice in the same place. Worn over a simple black dress to let the coat do all the talking.',
    },
    composition: { bs: '100% pamučni žakard', en: '100% cotton jacquard' },
    care: CARE.cottonJacquard,
    creation: {
      bs: 'Print je sastavljen iz vlastite arhive tekstilnih fragmenata ateljea prije nego što je tkanina uopće istkana, a zatim skrojen tako da se trake uzorka poklapaju preko svakog šava.',
      en: 'The print was composed from the atelier’s own archive of textile fragments before the cloth was ever woven, then cut so the pattern bands align across every seam.',
    },
    specs: [
      [SPEC.fabric, { bs: 'Pamučni žakard', en: 'Cotton jacquard' }],
      [SPEC.collar, { bs: 'Stojeći, jedno dugme', en: 'Stand, single button' }],
      [SPEC.silhouette, { bs: 'Labava zvonasta A-linija', en: 'Loose A-line swing' }],
    ],
  },
  {
    id: 'carnival-dot-coat',
    number: '11',
    name: { bs: 'Karnevalski kaput s tačkicama', en: 'Carnival dot coat' },
    category: CATEGORY.coat,
    collection: commission('11'),
    year: '2024',
    img: asset('dot-coat-front.png'),
    images: [
      asset('dot-coat-front.png'),
      asset('dot-coat-back.png'),
      asset('dot-coat-front-close.png'),
      asset('dot-coat-back-close.png'),
    ],
    alt: {
      bs: 'Vuneni kaput boje senfa sa šarenim aplikacijama tačkica od filca i odgovarajućim dugmadima, preko crne haljine',
      en: 'Mustard wool coat with colourful felt dot appliqués and matching buttons, over a black dress',
    },
    intro: {
      bs: 'Kaput kokon od vune boje senfa, posut ručno izrezanim tačkicama od filca, svaka u drugoj boji.',
      en: 'A cocoon coat in mustard wool, scattered with hand-cut felt dots in a different colour for every one.',
    },
    description: {
      bs: 'Tri dugmeta zatvaraju rever — crveno, žuto i zeleno — svako od drugog filca nego tačkice ispod. Same tačkice ručno su aplicirane preko oba ugla ruba, sprijeda i straga, nijedna iste veličine ili nijanse, izrezane iz vrećice ostataka filca čuvane upravo za ovo. Dva duboka našivena džepa i preklopljene manžete, zakopčane s još po jednim crvenim dugmetom, ostatak kaputa drže jednostavnim.',
      en: 'Three buttons close the notch collar, red, yellow and green, each a different felt from the dots below. The dots themselves are appliquéd by hand across both hem corners, front and back, no two the same size or shade, cut from an offcut bag of felt kept for exactly this. Two deep patch pockets and turned-back cuffs, fastened with one more red button each, keep the rest of the coat plain.',
    },
    composition: { bs: '100% vuna, aplikacije od filca', en: '100% wool, felt appliqué' },
    care: CARE.wool,
    creation: {
      bs: 'Svaka tačkica izrezana je i postavljena odoka direktno na gotov kaput, a zatim ručno prišivena jedna po jedna — istim postupkom kao i dugmad — tako da se nijedna sasvim ne poklapa.',
      en: 'Every dot was cut and placed by eye directly on the finished coat, then hand-stitched one at a time, the same process used for the buttons, so none of them quite match.',
    },
    specs: [
      [SPEC.fabric, { bs: 'Vuna', en: 'Wool' }],
      [
        SPEC.detail,
        { bs: 'Ručno izrezane aplikacije tačkica od filca', en: 'Hand-cut felt dot appliqué' },
      ],
      [SPEC.closure, { bs: 'Tri dugmeta, rever', en: 'Three-button, notch collar' }],
    ],
  },
]

export const getProductById = (id) => products.find((product) => product.id === id)
