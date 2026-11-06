import { asset } from '@/constants/site'

/**
 * Seed data for the catalogue database (`npm run db:seed`). The site reads pieces from the API,
 * not from this file, so edits here only reach the site once they are seeded.
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
  meshCotton: [
    {
      bs: 'Rolka: ručno pranje u hladnoj vodi, sušiti položeno',
      en: 'Top: hand wash cold, dry flat',
    },
    {
      bs: 'Šorc: mašinsko pranje na 30°, nježan program, naopako',
      en: 'Shorts: machine wash at 30°, gentle cycle, inside out',
    },
    {
      bs: 'Mrežu ne peglati; šorc peglati na srednjoj temperaturi',
      en: 'Do not iron the mesh; iron the shorts on medium',
    },
  ],
  topShorts: [
    {
      bs: 'Bluza: mašinsko pranje na 30°, nježan program, naopako',
      en: 'Top: machine wash at 30°, gentle cycle, inside out',
    },
    {
      bs: 'Šorc: samo hemijsko čišćenje',
      en: 'Shorts: dry clean only',
    },
    {
      bs: 'Šorc osvježiti parom između nošenja; čuvati okačen o struk',
      en: 'Steam the shorts between wears; store them hanging by the waist',
    },
  ],
  shirtDenim: [
    {
      bs: 'Bluza: mašinsko pranje na 30°, nježan program; peglati dok je vlažna',
      en: 'Shirt: machine wash at 30°, gentle cycle; iron while damp',
    },
    {
      bs: 'Suknja: prati hladno, naopako i odvojeno — teksas može pustiti boju',
      en: 'Skirt: wash cold, inside out and separately, as the denim may bleed',
    },
    {
      bs: 'Ne sušiti u sušilici; čipku na rubu ne peglati direktno',
      en: 'Do not tumble dry; never press the lace hem directly',
    },
  ],
  shirtTrousers: [
    {
      bs: 'Bluza: mašinsko pranje na 30°, nježan program; peglati dok je vlažna',
      en: 'Shirt: machine wash at 30°, gentle cycle; iron while damp',
    },
    {
      bs: 'Pantalone: samo hemijsko čišćenje',
      en: 'Trousers: dry clean only',
    },
    {
      bs: 'Pantalone osvježiti parom između nošenja; čuvati okačene o struk',
      en: 'Steam the trousers between wears; store them hanging by the waist',
    },
  ],
  topSkirt: [
    {
      bs: 'Bluza: ručno pranje u hladnoj vodi, sušiti položeno',
      en: 'Top: hand wash cold, dry flat',
    },
    {
      bs: 'Suknja: samo hemijsko čišćenje',
      en: 'Skirt: dry clean only',
    },
    {
      bs: 'Suknju osvježiti parom između nošenja; čuvati okačenu o struk',
      en: 'Steam the skirt between wears; store it hanging by the waist',
    },
  ],
  jersey: [
    {
      bs: 'Mašinsko pranje na 30°, nježan program, naopako',
      en: 'Machine wash at 30°, gentle cycle, inside out',
    },
    {
      bs: 'Ne sušiti u sušilici — oblikovati i sušiti položeno',
      en: 'Do not tumble dry — reshape and dry flat',
    },
    {
      bs: 'Peglati na niskoj temperaturi s naličja, nikada preko printa',
      en: 'Iron on low on the reverse, never over the print',
    },
  ],
  sweatshirt: [
    {
      bs: 'Mašinsko pranje na 30°, naopako, s tamnim rubljem',
      en: 'Machine wash at 30°, inside out, with darks',
    },
    {
      bs: 'Ne sušiti u sušilici — sušiti položeno',
      en: 'Do not tumble dry — dry flat',
    },
    {
      bs: 'Ne peglati preko printa ni etikete',
      en: 'Do not iron over the print or the label',
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
  shorts: { bs: 'Šorc', en: 'Shorts' },
  trousers: { bs: 'Pantalone', en: 'Trousers' },
}

const CATEGORY = {
  blouseSkirt: { bs: 'Bluza i suknja', en: 'Blouse & skirt' },
  eveningGown: { bs: 'Večernja haljina', en: 'Evening gown' },
  jacketSkirt: { bs: 'Jakna i suknja', en: 'Jacket & skirt' },
  dayDress: { bs: 'Dnevna haljina', en: 'Day dress' },
  dress: { bs: 'Haljina', en: 'Dress' },
  topSkirt: { bs: 'Top i suknja', en: 'Top & skirt' },
  coat: { bs: 'Kaput', en: 'Coat' },
  topShorts: { bs: 'Top i šorc', en: 'Top & shorts' },
  jacket: { bs: 'Jakna', en: 'Jacket' },
  topTrousers: { bs: 'Bluza i pantalone', en: 'Shirt & trousers' },
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
    img: asset('products/raw-cotton-set/cover.webp'),
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
    img: asset('products/umber-gown/cover.webp'),
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
    img: asset('products/paisley-jacket/cover.webp'),
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
    img: asset('products/sage-linen-dress/cover.webp'),
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
    img: asset('products/darigo-dress/front.webp'),
    images: [
      asset('products/darigo-dress/front.webp'),
      asset('products/darigo-dress/back.webp'),
      asset('products/darigo-dress/detail.webp'),
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
    img: asset('products/ink-wrap-top/front.webp'),
    images: [
      asset('products/ink-wrap-top/front.webp'),
      asset('products/ink-wrap-top/back.webp'),
      asset('products/ink-wrap-top/front-close.webp'),
      asset('products/ink-wrap-top/back-close.webp'),
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
    img: asset('products/oat-cropped-jacket/front.webp'),
    images: [
      asset('products/oat-cropped-jacket/front.webp'),
      asset('products/oat-cropped-jacket/back.webp'),
      asset('products/oat-cropped-jacket/front-close.webp'),
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
    img: asset('products/emerald-tweed-jacket/front.webp'),
    images: [
      asset('products/emerald-tweed-jacket/front.webp'),
      asset('products/emerald-tweed-jacket/back.webp'),
      asset('products/emerald-tweed-jacket/front-close.webp'),
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
    img: asset('products/ash-cocoon-coat/front.webp'),
    images: [
      asset('products/ash-cocoon-coat/front.webp'),
      asset('products/ash-cocoon-coat/back.webp'),
    ],
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
    img: asset('products/relic-patchwork-coat/front.webp'),
    images: [
      asset('products/relic-patchwork-coat/front.webp'),
      asset('products/relic-patchwork-coat/back.webp'),
      asset('products/relic-patchwork-coat/front-close.webp'),
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
    img: asset('products/carnival-dot-coat/front.webp'),
    images: [
      asset('products/carnival-dot-coat/front.webp'),
      asset('products/carnival-dot-coat/back.webp'),
      asset('products/carnival-dot-coat/front-close.webp'),
      asset('products/carnival-dot-coat/back-close.webp'),
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
  {
    id: 'print-mesh-turtleneck',
    number: '12',
    name: {
      bs: 'Mrežasta rolka s printom, maslinasti šorc',
      en: 'Print mesh turtleneck, olive shorts',
    },
    category: CATEGORY.topShorts,
    collection: commission('12'),
    year: '2026',
    img: asset('products/print-mesh-turtleneck/front.webp'),
    images: [
      asset('products/print-mesh-turtleneck/front.webp'),
      asset('products/print-mesh-turtleneck/back.webp'),
      asset('products/print-mesh-turtleneck/front-close.webp'),
      asset('products/print-mesh-turtleneck/back-close.webp'),
      asset('products/print-mesh-turtleneck/top-detail.webp'),
      asset('products/print-mesh-turtleneck/shorts-detail.webp'),
    ],
    alt: {
      bs: 'Prozirna rolka od mreže s patchwork printom u smeđim i pješčanim tonovima, uvučena u maslinasti pamučni šorc visokog struka s faltama i podvijenim rubom',
      en: 'Sheer mesh turtleneck in a brown and sand patchwork print, tucked into high-waisted olive cotton shorts with pleats and turned-up cuffs',
    },
    intro: {
      bs: 'Prozirna rolka od elastične mreže s printom, uvučena u maslinasti šorc visokog struka s dubokim faltama.',
      en: 'A sheer turtleneck in printed stretch mesh, tucked into high-waisted olive shorts with deep front pleats.',
    },
    description: {
      bs: 'Mreža je otisnuta kao patchwork — cvjetovi, paisley, tačkice i rukopis u tonovima umbre, pijeska i ugljena — i krojena tijesno uz tijelo, s dugim rukavima koji prelaze preko zgloba. Šorc sjedi visoko na struku, sa širokim pojasom, jednim presvučenim dugmetom i dvije duboke falte, a završava se širokim podvijenim rubom. Tkana etiketa ateljea prišivena je na pojas pored dugmeta.',
      en: 'The mesh is printed as a patchwork of florals, paisley, dots and handwritten script in umber, sand and charcoal, and cut close through the body with long sleeves that run past the wrist. The shorts sit high on the waist with a wide waistband, a single covered button and two deep pleats, finishing in broad turned-up cuffs. The atelier’s woven label is stitched to the waistband beside the button.',
    },
    composition: {
      bs: 'Rolka od elastične mreže, šorc od pamučnog kepera',
      en: 'Stretch-mesh top, cotton twill shorts',
    },
    care: CARE.meshCotton,
    specs: [
      [SPEC.fabric, { bs: 'Elastična mreža, pamučni keper', en: 'Stretch mesh, cotton twill' }],
      [
        SPEC.shorts,
        {
          bs: 'Visok struk, dvije falte, podvijen rub',
          en: 'High waist, double pleat, turned-up cuff',
        },
      ],
      [SPEC.closure, { bs: 'Presvučeno dugme i šlic', en: 'Covered button and fly' }],
    ],
  },
  {
    id: 'cornflower-jacket',
    number: '13',
    name: { bs: 'Kratka jakna boje različka', en: 'Cornflower cropped jacket' },
    category: CATEGORY.jacket,
    collection: commission('13'),
    year: '2026',
    img: asset('products/cornflower-jacket/front.webp'),
    images: [
      asset('products/cornflower-jacket/front.webp'),
      asset('products/cornflower-jacket/back-close.webp'),
      asset('products/cornflower-jacket/front-close.webp'),
      asset('products/cornflower-jacket/jacket-detail.webp'),
    ],
    alt: {
      bs: 'Kratka jakna boje različka s niskim stojećim ovratnikom, raglan rukavima i podvijenim manžetama, nošena otvorena',
      en: 'Cropped cornflower-blue jacket with a low stand collar, raglan sleeves and turned-back cuffs, worn open',
    },
    intro: {
      bs: 'Kratka jakna boje različka sa širokim raglan rukavima, krojena da se nosi otvorena.',
      en: 'A cropped cornflower-blue jacket with wide raglan sleeves, cut to be worn open.',
    },
    description: {
      bs: 'Nizak stojeći ovratnik ima mali urez na prednjem dijelu, a rubovi su opšiveni istom tkaninom. Široki raglan rukavi završavaju se dubokim podvijenim manžetama. Jakna se zatvara jednim ukrasnim metalnim dugmetom u obliku cvijeta.',
      en: 'The low stand collar has a small notch at the front, and the edges are bound in the same cloth. Wide raglan sleeves end in deep turned-back cuffs. The jacket closes with a single decorative metal flower button.',
    },
    composition: { bs: 'Vuneni keper', en: 'Wool twill' },
    care: CARE.wool,
    specs: [
      [SPEC.fabric, { bs: 'Vuneni keper', en: 'Wool twill' }],
      [SPEC.collar, { bs: 'Nizak stojeći, s urezom', en: 'Low stand collar, notched' }],
      [SPEC.sleeve, { bs: 'Raglan, s podvijenom manžetom', en: 'Raglan, turned-back cuff' }],
    ],
  },
  {
    id: 'white-top-check-shorts',
    number: '14',
    name: { bs: 'Bijela rolka, karirani šorc', en: 'White mock-neck, check shorts' },
    category: CATEGORY.topShorts,
    collection: commission('14'),
    year: '2026',
    img: asset('products/white-top-check-shorts/front.webp'),
    images: [
      asset('products/white-top-check-shorts/front.webp'),
      asset('products/white-top-check-shorts/back.webp'),
      asset('products/white-top-check-shorts/top-detail.webp'),
      asset('products/white-top-check-shorts/shorts-detail.webp'),
    ],
    alt: {
      bs: 'Bijela rolka od džersija uvučena u sivi karirani šorc do koljena, visokog struka, s faltama i podvijenim rubom',
      en: 'White jersey mock-neck top tucked into grey check knee-length shorts with a high waist, pleats and a turned-up hem',
    },
    intro: {
      bs: 'Bijela rolka od džersija, uvučena u širok karirani šorc visokog struka.',
      en: 'A white jersey mock-neck, tucked into wide high-waisted check shorts.',
    },
    description: {
      bs: 'Rolka je jednostavna, s dugim rukavima i visokim ovratnikom koji drži liniju čistom. Šorc od karirane tkanine sjedi visoko na struku, s dvije falte, trakom za kaiš na leđima i podvijenim rubom. Tkana etiketa ateljea prišivena je na pojas.',
      en: 'The top is simple, with long sleeves and a high neck that keeps the line clean. The check shorts sit high on the waist with two pleats, a back belt tab and a turned-up hem. The atelier’s woven label is stitched to the waistband.',
    },
    composition: {
      bs: 'Rolka od džersija, šorc od karirane tkanine',
      en: 'Jersey top, check suiting shorts',
    },
    care: CARE.topShorts,
    specs: [
      [SPEC.fabric, { bs: 'Džersi, karirana tkanina', en: 'Jersey, check suiting' }],
      [
        SPEC.shorts,
        {
          bs: 'Visok struk, dvije falte, podvijen rub',
          en: 'High waist, double pleat, turned-up hem',
        },
      ],
    ],
  },
  {
    id: 'mustard-wrap-jacket',
    number: '15',
    name: { bs: 'Jakna boje senfa s visokim ovratnikom', en: 'Mustard wrap jacket' },
    category: CATEGORY.jacket,
    collection: commission('15'),
    year: '2026',
    img: asset('products/mustard-wrap-jacket/front.webp'),
    images: [
      asset('products/mustard-wrap-jacket/front.webp'),
      asset('products/mustard-wrap-jacket/back-close.webp'),
      asset('products/mustard-wrap-jacket/front-close.webp'),
      asset('products/mustard-wrap-jacket/jacket-detail.webp'),
    ],
    alt: {
      bs: 'Kratka jakna boje senfa s visokim ovratnikom, asimetričnim kopčanjem na tri dugmeta i širokim zvonastim rukavima',
      en: 'Cropped mustard jacket with a high collar, asymmetric three-button fastening and wide bell sleeves',
    },
    intro: {
      bs: 'Kratka jakna boje senfa s visokim ovratnikom i asimetričnim kopčanjem.',
      en: 'A cropped mustard jacket with a high collar and an asymmetric fastening.',
    },
    description: {
      bs: 'Jakna se kopča asimetrično, s tri tamna metalna dugmeta duž kosog prednjeg ruba, a visoki ovratnik stoji uz vrat. Široki zvonasti rukavi padaju ispod lakta, a jedan džep s preklopom sjedi nisko na boku. Tkana etiketa ateljea prišivena je na stražnji dio ovratnika.',
      en: 'The jacket fastens asymmetrically, with three dark metal buttons along a slanted front edge, and the high collar stands close to the neck. Wide bell sleeves fall below the elbow, and a single flap pocket sits low on the hip. The atelier’s woven label is stitched to the back of the collar.',
    },
    composition: { bs: 'Vuneni štof', en: 'Wool cloth' },
    care: CARE.wool,
    specs: [
      [SPEC.fabric, { bs: 'Vuneni štof', en: 'Wool cloth' }],
      [
        SPEC.closure,
        { bs: 'Asimetrično, tri metalna dugmeta', en: 'Asymmetric, three metal buttons' },
      ],
      [SPEC.sleeve, { bs: 'Široki zvonasti', en: 'Wide bell' }],
    ],
  },
  {
    id: 'floral-top-wool-shorts',
    number: '16',
    name: { bs: 'Cvjetna bluza, tamni šorc', en: 'Floral jersey top, dark shorts' },
    category: CATEGORY.topShorts,
    collection: commission('16'),
    year: '2026',
    img: asset('products/floral-top-wool-shorts/front.webp'),
    images: [
      asset('products/floral-top-wool-shorts/front.webp'),
      asset('products/floral-top-wool-shorts/back.webp'),
      asset('products/floral-top-wool-shorts/front-close.webp'),
      asset('products/floral-top-wool-shorts/top-detail.webp'),
      asset('products/floral-top-wool-shorts/shorts-detail.webp'),
    ],
    alt: {
      bs: 'Bluza od džersija s akvarelnim cvjetnim printom na tamnoljubičastoj podlozi, uvučena u tamni široki šorc visokog struka s pojasom',
      en: 'Jersey top with a watercolour floral print on a plum ground, tucked into dark wide high-waisted shorts with a belt',
    },
    intro: {
      bs: 'Cvjetna bluza od džersija s draperiranim izrezom, uvučena u tamni široki šorc visokog struka.',
      en: 'A floral jersey top with a draped neckline, tucked into dark wide shorts with a high waist.',
    },
    description: {
      bs: 'Bluza ima mekani draperirani izrez i rukave do tri četvrtine, a akvarelni cvjetni print nosi se na tamnoljubičastoj podlozi. Šorc je taman, visokog struka, s faltama, širokim nogavicama do koljena i pojasom s metalnom kopčom ateljea.',
      en: 'The top has a soft draped neckline and three-quarter sleeves, with a watercolour floral print on a plum ground. The shorts are dark and high-waisted, with pleats, wide knee-length legs and a self belt closed by the atelier’s metal buckle.',
    },
    composition: { bs: 'Bluza od džersija, šorc od vunene tkanine', en: 'Jersey top, wool shorts' },
    care: CARE.topShorts,
    specs: [
      [SPEC.fabric, { bs: 'Džersi, vunena tkanina', en: 'Jersey, wool suiting' }],
      [SPEC.sleeve, { bs: 'Tri četvrtine', en: 'Three-quarter' }],
      [
        SPEC.shorts,
        {
          bs: 'Visok struk, falte, pojas s kopčom',
          en: 'High waist, pleated, buckled belt',
        },
      ],
    ],
  },
  {
    id: 'bow-collar-shirt-grey',
    number: '17',
    name: {
      bs: 'Siva bluza s mašnom, suknja od teksasa',
      en: 'Grey bow-collar shirt, denim skirt',
    },
    category: CATEGORY.topSkirt,
    collection: commission('17'),
    year: '2026',
    img: asset('products/bow-collar-shirt-grey/front.webp'),
    images: [
      asset('products/bow-collar-shirt-grey/front.webp'),
      asset('products/bow-collar-shirt-grey/front-close.webp'),
      asset('products/bow-collar-shirt-grey/collar-detail.webp'),
      asset('products/bow-collar-shirt-grey/skirt-detail.webp'),
    ],
    alt: {
      bs: 'Grey bluza s visokim ovratnikom vezanim u mašnu, preko duge suknje od tamnog teksasa s dugmadima sprijeda i čipkom na rubu',
      en: 'Siva shirt with a high collar folded into a bow, over a long dark denim skirt with a button front and a lace hem',
    },
    intro: {
      bs: 'Siva bluza širokog kroja s visokim ovratnikom vezanim u mašnu, nošena preko duge suknje od teksasa.',
      en: 'A wide grey shirt with a high collar folded into a bow, worn over a long denim skirt.',
    },
    description: {
      bs: 'Visoki ovratnik preklapa se preko sebe i zatvara sprijeda ispod male plisirane trake. Bluza je krojena široko, sa spuštenim ramenima i dugim širokim rukavima, i zatvara se dugmetom na leđima. Ispod, duga A-linija suknja od sirovog teksasa kopča se dugmadima cijelom dužinom sprijeda i završava trakom čipke na rubu.',
      en: 'The high collar folds over itself and closes at the front under a small pleated tab. The shirt is cut wide, with dropped shoulders and long wide sleeves, and fastens with a button at the back. Underneath, a long A-line skirt in raw denim buttons all the way down the front and finishes in a band of lace at the hem.',
    },
    composition: {
      bs: 'Bluza od pamučnog kepera, suknja od sirovog teksasa',
      en: 'Cotton twill shirt, raw denim skirt',
    },
    care: CARE.shirtDenim,
    specs: [
      [SPEC.fabric, { bs: 'Pamučni keper, sirovi teksas', en: 'Cotton twill, raw denim' }],
      [SPEC.collar, { bs: 'Visok, vezan u mašnu', en: 'High, folded into a bow' }],
      [
        SPEC.skirt,
        {
          bs: 'Duga A-linija, dugmad sprijeda, čipka na rubu',
          en: 'Long A-line, button front, lace hem',
        },
      ],
    ],
  },
  {
    id: 'bow-collar-shirt-black',
    number: '18',
    name: {
      bs: 'Crna bluza s mašnom, suknja od teksasa',
      en: 'Black bow-collar shirt, denim skirt',
    },
    category: CATEGORY.topSkirt,
    collection: commission('18'),
    year: '2026',
    img: asset('products/bow-collar-shirt-black/front.webp'),
    images: [
      asset('products/bow-collar-shirt-black/front.webp'),
      asset('products/bow-collar-shirt-black/back.webp'),
      asset('products/bow-collar-shirt-black/front-close.webp'),
      asset('products/bow-collar-shirt-black/collar-detail.webp'),
      asset('products/bow-collar-shirt-black/skirt-detail.webp'),
    ],
    alt: {
      bs: 'Black bluza s visokim ovratnikom vezanim u mašnu, preko duge suknje od tamnog teksasa s dugmadima sprijeda i čipkom na rubu',
      en: 'Crna shirt with a high collar folded into a bow, over a long dark denim skirt with a button front and a lace hem',
    },
    intro: {
      bs: 'Crna bluza širokog kroja s visokim ovratnikom vezanim u mašnu, nošena preko duge suknje od teksasa.',
      en: 'A wide black shirt with a high collar folded into a bow, worn over a long denim skirt.',
    },
    description: {
      bs: 'Visoki ovratnik skuplja se u punu plisiranu mašnu koja sjedi sa strane vrata. Bluza je krojena široko, sa spuštenim ramenima i dugim širokim rukavima, i zatvara se dugmetom na leđima. Ispod, duga A-linija suknja od sirovog teksasa kopča se dugmadima cijelom dužinom sprijeda i završava trakom čipke na rubu.',
      en: 'The high collar gathers into a full pleated bow that sits to one side of the neck. The shirt is cut wide, with dropped shoulders and long wide sleeves, and fastens with a button at the back. Underneath, a long A-line skirt in raw denim buttons all the way down the front and finishes in a band of lace at the hem.',
    },
    composition: {
      bs: 'Bluza od pamučnog poplina, suknja od sirovog teksasa',
      en: 'Cotton poplin shirt, raw denim skirt',
    },
    care: CARE.shirtDenim,
    specs: [
      [SPEC.fabric, { bs: 'Pamučni poplin, sirovi teksas', en: 'Cotton poplin, raw denim' }],
      [SPEC.collar, { bs: 'Visok, vezan u mašnu', en: 'High, folded into a bow' }],
      [
        SPEC.skirt,
        {
          bs: 'Duga A-linija, dugmad sprijeda, čipka na rubu',
          en: 'Long A-line, button front, lace hem',
        },
      ],
    ],
  },
  {
    id: 'bow-collar-shirt-white',
    number: '19',
    name: {
      bs: 'Bijela bluza s mašnom, suknja od teksasa',
      en: 'White bow-collar shirt, denim skirt',
    },
    category: CATEGORY.topSkirt,
    collection: commission('19'),
    year: '2026',
    img: asset('products/bow-collar-shirt-white/front.webp'),
    images: [
      asset('products/bow-collar-shirt-white/front.webp'),
      asset('products/bow-collar-shirt-white/front-close.webp'),
      asset('products/bow-collar-shirt-white/collar-detail.webp'),
      asset('products/bow-collar-shirt-white/skirt-detail.webp'),
    ],
    alt: {
      bs: 'White bluza s visokim ovratnikom vezanim u mašnu, preko duge suknje od tamnog teksasa s dugmadima sprijeda i čipkom na rubu',
      en: 'Bijela shirt with a high collar folded into a bow, over a long dark denim skirt with a button front and a lace hem',
    },
    intro: {
      bs: 'Bijela bluza širokog kroja s visokim ovratnikom vezanim u mašnu, nošena preko duge suknje od teksasa.',
      en: 'A wide white shirt with a high collar folded into a bow, worn over a long denim skirt.',
    },
    description: {
      bs: 'Visoki ovratnik preklapa se u ravnu, šiljastu kravatu koja pada na jednu stranu. Bluza je krojena široko, sa spuštenim ramenima i dugim širokim rukavima, i zatvara se dugmetom na leđima. Ispod, duga A-linija suknja od sirovog teksasa kopča se dugmadima cijelom dužinom sprijeda i završava trakom čipke na rubu.',
      en: 'The high collar folds into a flat, pointed tie that falls to one side. The shirt is cut wide, with dropped shoulders and long wide sleeves, and fastens with a button at the back. Underneath, a long A-line skirt in raw denim buttons all the way down the front and finishes in a band of lace at the hem.',
    },
    composition: {
      bs: 'Bluza od lana, suknja od sirovog teksasa',
      en: 'Linen shirt, raw denim skirt',
    },
    care: CARE.shirtDenim,
    specs: [
      [SPEC.fabric, { bs: 'Lan, sirovi teksas', en: 'Linen, raw denim' }],
      [SPEC.collar, { bs: 'Visok, vezan u mašnu', en: 'High, folded into a bow' }],
      [
        SPEC.skirt,
        {
          bs: 'Duga A-linija, dugmad sprijeda, čipka na rubu',
          en: 'Long A-line, button front, lace hem',
        },
      ],
    ],
  },
  {
    id: 'camel-wrap-shirt',
    number: '20',
    name: {
      bs: 'Preklopna bluza boje kamile, široke pantalone',
      en: 'Camel wrap shirt, wide trousers',
    },
    category: CATEGORY.topTrousers,
    collection: commission('20'),
    year: '2026',
    img: asset('products/camel-wrap-shirt/front.webp'),
    images: [
      asset('products/camel-wrap-shirt/front.webp'),
      asset('products/camel-wrap-shirt/front-close.webp'),
      asset('products/camel-wrap-shirt/back-close.webp'),
      asset('products/camel-wrap-shirt/back.webp'),
    ],
    alt: {
      bs: 'Preklopna bluza boje kamile s šiljastim ovratnikom, V-izrezom i pojasom vezanim u mašnu, preko širokih maslinastozelenih pantalona',
      en: 'Camel wrap shirt with a pointed collar, V-neck and tied belt, over wide olive-green trousers',
    },
    intro: {
      bs: 'Preklopna bluza boje kamile s pojasom, nošena preko širokih maslinastih pantalona.',
      en: 'A belted camel wrap shirt, worn over wide olive trousers.',
    },
    description: {
      bs: 'Bluza ima oštar šiljasti ovratnik i dubok V-izrez, a prednji dijelovi se preklapaju i vežu pojasom u mašnu sa strane struka. Raglan rukavi do tri četvrtine šire se prema rubu, a asimetrični donji rub pada u dva šiljka. Na leđima pojas skuplja tkaninu u meke nabore. Ispod, pantalone visokog struka padaju široko i pune do poda; tkana etiketa ateljea prišivena je nisko na nogavici.',
      en: 'The shirt has a sharp pointed collar and a deep V-neck, and the fronts cross over and tie at the side of the waist. Raglan three-quarter sleeves widen towards the cuff, and the asymmetric hem falls in two points. At the back, the belt gathers the cloth into soft folds. Underneath, high-waisted trousers fall wide and full to the floor; the atelier’s woven label is stitched low on the leg.',
    },
    composition: {
      bs: 'Bluza od pamučnog satena, pantalone od vunene tkanine',
      en: 'Cotton sateen shirt, wool suiting trousers',
    },
    care: CARE.shirtTrousers,
    specs: [
      [SPEC.fabric, { bs: 'Pamučni saten, vunena tkanina', en: 'Cotton sateen, wool suiting' }],
      [SPEC.closure, { bs: 'Preklop, pojas vezan u mašnu', en: 'Wrap front, tied belt' }],
      [SPEC.sleeve, { bs: 'Raglan, tri četvrtine', en: 'Raglan, three-quarter' }],
      [SPEC.trousers, { bs: 'Visok struk, široke, do poda', en: 'High waist, wide, floor length' }],
    ],
  },
  {
    id: 'print-top-pencil-skirt',
    number: '21',
    name: {
      bs: 'Bluza sa životinjskim printom, suknja boje cikle',
      en: 'Animal-print top, magenta pencil skirt',
    },
    category: CATEGORY.topSkirt,
    collection: commission('21'),
    year: '2026',
    img: asset('products/print-top-pencil-skirt/front.webp'),
    images: [
      asset('products/print-top-pencil-skirt/front.webp'),
      asset('products/print-top-pencil-skirt/front-close.webp'),
      asset('products/print-top-pencil-skirt/back-close.webp'),
      asset('products/print-top-pencil-skirt/back.webp'),
    ],
    alt: {
      bs: 'Crno-bijela bluza sa životinjskim printom i visokim ovratnikom, uvučena u usku suknju boje cikle visokog struka s prorezom sprijeda',
      en: 'Black and white animal-print top with a high neck, tucked into a high-waisted magenta pencil skirt with a front slit',
    },
    intro: {
      bs: 'Bluza sa životinjskim printom i visokim ovratnikom, uvučena u usku suknju boje cikle.',
      en: 'A high-neck animal-print top, tucked into a magenta pencil skirt.',
    },
    description: {
      bs: 'Bluza je krojena blizu tijela, s visokim ovratnikom i dugim rukavima, a crno-bijeli print miješa pruge i pjege u jedan nemiran uzorak. Suknja sjedi visoko iznad struka, uska kroz bokove, i pada do sredine lista. Dugi prorez sprijeda daje joj korak, a na leđima se zatvara skrivenim patentnim zatvaračem.',
      en: 'The top is cut close to the body, with a high neck and long sleeves, and its black and white print mixes stripes and spots into one restless pattern. The skirt sits high above the waist, narrow through the hips, and falls to mid-calf. A long front slit gives it a stride, and it closes at the back with a concealed zip.',
    },
    composition: {
      bs: 'Bluza od džersija, suknja od vunene tkanine',
      en: 'Jersey top, wool suiting skirt',
    },
    care: CARE.topSkirt,
    specs: [
      [SPEC.fabric, { bs: 'Džersi, vunena tkanina', en: 'Jersey, wool suiting' }],
      [SPEC.neckline, { bs: 'Visok ovratnik', en: 'High neck' }],
      [
        SPEC.skirt,
        {
          bs: 'Visok struk, uska, prorez sprijeda',
          en: 'High waist, pencil, front slit',
        },
      ],
      [SPEC.closure, { bs: 'Skriveni patent na leđima', en: 'Concealed back zip' }],
    ],
  },
  {
    id: 'grey-funnel-dress',
    number: '22',
    name: { bs: 'Siva haljina s visokim ovratnikom', en: 'Grey funnel-neck dress' },
    category: CATEGORY.dress,
    collection: commission('22'),
    year: '2026',
    img: asset('products/grey-funnel-dress/front.webp'),
    images: [
      asset('products/grey-funnel-dress/front.webp'),
      asset('products/grey-funnel-dress/back.webp'),
    ],
    alt: {
      bs: 'Duga siva haljina od džersija s visokim ovratnikom, spuštenim ramenima i tri bijele figure iscrtane pri rubu',
      en: 'Long grey jersey dress with a funnel neck, dropped shoulders and three white outlined figures near the hem',
    },
    intro: {
      bs: 'Duga siva haljina s visokim ovratnikom i tri male figure iscrtane pri rubu.',
      en: 'A long grey dress with a funnel neck and three small figures drawn near the hem.',
    },
    description: {
      bs: 'Visoki ovratnik stoji uz vrat i blago se nabire sprijeda, a ramena su spuštena u duge, ravne rukave. Haljina pada ravno i široko do lista, bez šavova u struku. Pri rubu su bijelom linijom iscrtane tri male figure, a na leđima, između lopatica, nosi okrugli znak ateljea.',
      en: 'The funnel neck stands close and folds softly at the front, and the shoulders drop into long, straight sleeves. The dress falls straight and loose to the calf, with no seam at the waist. Three small figures are drawn in white line near the hem, and the atelier’s round emblem sits at the back, between the shoulder blades.',
    },
    composition: { bs: 'Melirani džersi', en: 'Marled jersey' },
    care: CARE.jersey,
    specs: [
      [SPEC.fabric, { bs: 'Melirani džersi', en: 'Marled jersey' }],
      [SPEC.collar, { bs: 'Visok, ljevkast', en: 'Funnel neck' }],
      [SPEC.silhouette, { bs: 'Ravna, do lista', en: 'Straight, calf length' }],
      [
        SPEC.detail,
        {
          bs: 'Figure pri rubu, znak ateljea na leđima',
          en: 'Figures at the hem, atelier emblem at the back',
        },
      ],
    ],
  },
  {
    id: 'red-funnel-jacket',
    number: '23',
    name: { bs: 'Crvena kratka jakna, siva haljina', en: 'Red cropped jacket, grey dress' },
    category: CATEGORY.jacket,
    collection: commission('23'),
    year: '2026',
    img: asset('products/red-funnel-jacket/front.webp'),
    images: [
      asset('products/red-funnel-jacket/front.webp'),
      asset('products/red-funnel-jacket/front-close.webp'),
      asset('products/red-funnel-jacket/back-close.webp'),
      asset('products/red-funnel-jacket/back.webp'),
    ],
    alt: {
      bs: 'Kratka crvena vunena jakna s visokim ovratnikom, asimetričnim kopčanjem i širokim manžetama, preko duge sive haljine s figurama pri rubu',
      en: 'Cropped red wool jacket with a funnel collar, asymmetric fastening and deep cuffs, over a long grey dress with figures at the hem',
    },
    intro: {
      bs: 'Kratka crvena jakna s visokim ovratnikom, nošena preko duge sive haljine.',
      en: 'A cropped red jacket with a funnel collar, worn over a long grey dress.',
    },
    description: {
      bs: 'Jakna od guste vune kopča se asimetrično, s tri metalna dugmeta s reljefom duž pomaknutog prednjeg ruba, a visoki ovratnik stoji uz vrat. Ramena su zaobljena i spuštena, rukavi široki i završavaju dubokim manžetama, a jedan koso postavljen džep s preklopom sjedi na grudima. Na leđima, na ovratniku, prišivena je crna traka s figurom ateljea. Ispod se nosi duga siva haljina od džersija s tri figure iscrtane pri rubu.',
      en: 'The jacket, in dense wool, fastens asymmetrically with three embossed metal buttons along an offset front edge, and the funnel collar stands close to the neck. The shoulders are rounded and dropped, the sleeves wide and finished in deep cuffs, and a single slanted flap pocket sits on the chest. A black tab with the atelier’s figure is stitched to the back of the collar. Underneath is a long grey jersey dress with three figures drawn at the hem.',
    },
    composition: {
      bs: 'Jakna od vunenog štofa, haljina od džersija',
      en: 'Wool cloth jacket, jersey dress',
    },
    care: CARE.wool,
    specs: [
      [SPEC.fabric, { bs: 'Vuneni štof, džersi', en: 'Wool cloth, jersey' }],
      [SPEC.collar, { bs: 'Visok, ljevkast', en: 'Funnel collar' }],
      [
        SPEC.closure,
        { bs: 'Asimetrično, tri metalna dugmeta', en: 'Asymmetric, three metal buttons' },
      ],
      [SPEC.sleeve, { bs: 'Široki, duboke manžete', en: 'Wide, deep cuffs' }],
    ],
  },
  {
    id: 'black-funnel-jacket',
    number: '24',
    name: { bs: 'Crna kratka jakna, siva haljina', en: 'Black cropped jacket, grey dress' },
    category: CATEGORY.jacket,
    collection: commission('24'),
    year: '2026',
    img: asset('products/black-funnel-jacket/front.webp'),
    images: [
      asset('products/black-funnel-jacket/front.webp'),
      asset('products/black-funnel-jacket/front-close.webp'),
      asset('products/black-funnel-jacket/back-close.webp'),
      asset('products/black-funnel-jacket/back.webp'),
    ],
    alt: {
      bs: 'Kratka crna vunena jakna s visokim ovratnikom, asimetričnim kopčanjem i zvonastim rukavima, preko duge sive haljine s figurama pri rubu',
      en: 'Cropped black wool jacket with a funnel collar, asymmetric fastening and bell sleeves, over a long grey dress with figures at the hem',
    },
    intro: {
      bs: 'Kratka crna jakna s visokim ovratnikom i zvonastim rukavima, nošena preko duge sive haljine.',
      en: 'A cropped black jacket with a funnel collar and bell sleeves, worn over a long grey dress.',
    },
    description: {
      bs: 'Jakna od guste vune kopča se asimetrično, s tri metalna dugmeta s reljefom duž pomaknutog prednjeg ruba, a visoki ovratnik stoji uz vrat. Ramena su zaobljena i spuštena, a rukavi se šire prema dolje u meka zvona. Jedan koso postavljen džep s preklopom sjedi na grudima, a na leđima, na ovratniku, prišivena je bijela traka s figurom ateljea. Ispod se nosi duga siva haljina od džersija s tri figure iscrtane pri rubu.',
      en: 'The jacket, in dense wool, fastens asymmetrically with three embossed metal buttons along an offset front edge, and the funnel collar stands close to the neck. The shoulders are rounded and dropped, and the sleeves widen into soft bells. A single slanted flap pocket sits on the chest, and a white tab with the atelier’s figure is stitched to the back of the collar. Underneath is a long grey jersey dress with three figures drawn at the hem.',
    },
    composition: {
      bs: 'Jakna od vunenog štofa, haljina od džersija',
      en: 'Wool cloth jacket, jersey dress',
    },
    care: CARE.wool,
    specs: [
      [SPEC.fabric, { bs: 'Vuneni štof, džersi', en: 'Wool cloth, jersey' }],
      [SPEC.collar, { bs: 'Visok, ljevkast', en: 'Funnel collar' }],
      [
        SPEC.closure,
        { bs: 'Asimetrično, tri metalna dugmeta', en: 'Asymmetric, three metal buttons' },
      ],
      [SPEC.sleeve, { bs: 'Zvonasti', en: 'Bell' }],
    ],
  },
  {
    id: 'black-figure-sweatdress',
    number: '25',
    name: { bs: 'Crna haljina-duks s figurama', en: 'Black figure sweatshirt dress' },
    category: CATEGORY.dress,
    collection: commission('25'),
    year: '2026',
    img: asset('products/black-figure-sweatdress/front.webp'),
    images: [
      asset('products/black-figure-sweatdress/front.webp'),
      asset('products/black-figure-sweatdress/front-close.webp'),
      asset('products/black-figure-sweatdress/back-close.webp'),
      asset('products/black-figure-sweatdress/back.webp'),
    ],
    alt: {
      bs: 'Široka crna haljina-duks s visokim ovratnikom, velikim džepom sprijeda i četiri tamne figure otisnute preko grudi',
      en: 'Oversized black sweatshirt dress with a roll neck, a large front pocket and four tonal figures printed across the chest',
    },
    intro: {
      bs: 'Široka crna haljina-duks s visokim ovratnikom i četiri figure otisnute ton u ton.',
      en: 'An oversized black sweatshirt dress with a roll neck and four figures printed tone on tone.',
    },
    description: {
      bs: 'Mekani visoki ovratnik pada u labave nabore oko vrata, a ramena su spuštena u duge rukave s rebrastim manžetama. Preko grudi su ton u ton otisnute četiri figure, vidljive tek kad uhvate svjetlo, a ispod njih sjedi veliki džep s kosim otvorima. Rebrasti rub ima kratke proreze sa strane, a tkana etiketa ateljea prišivena je nisko na leđima, preko bočnog šava.',
      en: 'A soft roll neck falls in loose folds around the throat, and the shoulders drop into long sleeves with ribbed cuffs. Four figures are printed tone on tone across the chest, showing only when they catch the light, with a large pouch pocket with slanted openings beneath them. The ribbed hem is split at the sides, and the atelier’s woven label is stitched low on the back, across the side seam.',
    },
    composition: { bs: 'Pamučni frotir', en: 'Cotton French terry' },
    care: CARE.sweatshirt,
    specs: [
      [SPEC.fabric, { bs: 'Pamučni frotir', en: 'Cotton French terry' }],
      [SPEC.collar, { bs: 'Visok, mekano preklopljen', en: 'Soft roll neck' }],
      [SPEC.pockets, { bs: 'Veliki džep sprijeda', en: 'Front pouch pocket' }],
      [SPEC.detail, { bs: 'Figure otisnute ton u ton', en: 'Tone-on-tone figure print' }],
    ],
  },
  {
    id: 'charcoal-funnel-dress',
    number: '26',
    name: { bs: 'Tamnosiva haljina s visokim ovratnikom', en: 'Charcoal funnel-neck dress' },
    category: CATEGORY.dress,
    collection: commission('26'),
    year: '2026',
    img: asset('products/charcoal-funnel-dress/front.webp'),
    images: [
      asset('products/charcoal-funnel-dress/front.webp'),
      asset('products/charcoal-funnel-dress/front-close.webp'),
      asset('products/charcoal-funnel-dress/back-close.webp'),
      asset('products/charcoal-funnel-dress/back.webp'),
    ],
    alt: {
      bs: 'Duga tamnosiva haljina od džersija s visokim ovratnikom, spuštenim ramenima i dvije bijele figure iscrtane pri rubu',
      en: 'Long charcoal jersey dress with a funnel neck, dropped shoulders and two white outlined figures near the hem',
    },
    intro: {
      bs: 'Duga tamnosiva haljina s visokim ovratnikom i dvije male figure iscrtane pri rubu.',
      en: 'A long charcoal dress with a funnel neck and two small figures drawn near the hem.',
    },
    description: {
      bs: 'Visoki ovratnik stoji uz vrat i preklapa se sprijeda u mekan nabor, a ramena su spuštena u duge, uske rukave. Haljina pada ravno i široko do lista, bez šavova u struku. Pri rubu su bijelom linijom iscrtane dvije male figure okrenute jedna prema drugoj, a na leđima je ton u ton otisnut znak ateljea.',
      en: 'The funnel neck stands close and folds over itself at the front, and the shoulders drop into long, narrow sleeves. The dress falls straight and loose to the calf, with no seam at the waist. Two small figures facing each other are drawn in white line near the hem, and the atelier’s emblem is printed tone on tone at the back.',
    },
    composition: { bs: 'Melirani džersi', en: 'Marled jersey' },
    care: CARE.jersey,
    specs: [
      [SPEC.fabric, { bs: 'Melirani džersi', en: 'Marled jersey' }],
      [SPEC.collar, { bs: 'Visok, ljevkast', en: 'Funnel neck' }],
      [SPEC.silhouette, { bs: 'Ravna, do lista', en: 'Straight, calf length' }],
      [
        SPEC.detail,
        {
          bs: 'Dvije figure pri rubu, znak ateljea na leđima',
          en: 'Two figures at the hem, atelier emblem at the back',
        },
      ],
    ],
  },
  {
    id: 'black-line-dress',
    number: '27',
    name: { bs: 'Crna haljina s bijelim linijama', en: 'Black line-seam dress' },
    category: CATEGORY.dress,
    collection: commission('27'),
    year: '2026',
    img: asset('products/black-line-dress/front.webp'),
    images: [
      asset('products/black-line-dress/front.webp'),
      asset('products/black-line-dress/side.webp'),
      asset('products/black-line-dress/back.webp'),
      asset('products/black-line-dress/neck-detail.webp'),
      asset('products/black-line-dress/line-detail.webp'),
    ],
    alt: {
      bs: 'Duga crna haljina od džersija sa širokim preklopljenim izrezom i zakrivljenim šavovima istaknutim bijelim bodom preko suknje i rukava',
      en: 'Long black jersey dress with a wide rolled neckline and curving seams picked out in white stitching across the skirt and sleeve',
    },
    intro: {
      bs: 'Duga crna haljina sa širokim izrezom i zakrivljenim šavovima istaknutim bijelim bodom.',
      en: 'A long black dress with a wide neckline and curving seams picked out in white.',
    },
    description: {
      bs: 'Široki izrez preklopljen je u mekanu traku koja leži nisko preko ključne kosti. Ramena su spuštena u duge rukave, a haljina pada široko do lista. Zakrivljeni šavovi, istaknuti bijelim bodom, sijeku suknju sprijeda i nastavljaju se na leđima, dok se na jednom rukavu ponavljaju kao snop kraćih linija pri zapešću. Tkana etiketa ateljea prišivena je pri rubu.',
      en: 'The wide neckline folds over into a soft band that sits low across the collarbone. The shoulders drop into long sleeves, and the dress falls loose to the calf. Curving seams, picked out in white stitching, sweep across the front of the skirt and continue round the back, and repeat on one sleeve as a cluster of short lines at the wrist. The atelier’s woven label is stitched at the hem.',
    },
    composition: { bs: 'Džersi', en: 'Jersey' },
    care: CARE.jersey,
    specs: [
      [SPEC.fabric, { bs: 'Džersi', en: 'Jersey' }],
      [SPEC.neckline, { bs: 'Širok, preklopljen', en: 'Wide, rolled' }],
      [SPEC.silhouette, { bs: 'Široka, do lista', en: 'Loose, calf length' }],
      [
        SPEC.detail,
        {
          bs: 'Zakrivljeni šavovi s bijelim bodom',
          en: 'Curved seams in white stitching',
        },
      ],
    ],
  },
  {
    id: 'navy-sash-skirt',
    number: '28',
    name: {
      bs: 'Siva rolka, plisirana suknja s pojasom',
      en: 'Grey mock-neck, pleated sash skirt',
    },
    category: CATEGORY.topSkirt,
    collection: commission('28'),
    year: '2026',
    img: asset('products/navy-sash-skirt/front.webp'),
    images: [
      asset('products/navy-sash-skirt/front.webp'),
      asset('products/navy-sash-skirt/back.webp'),
      asset('products/navy-sash-skirt/back-close.webp'),
      asset('products/navy-sash-skirt/top-detail.webp'),
      asset('products/navy-sash-skirt/sash-detail.webp'),
    ],
    alt: {
      bs: 'Siva rolka od džersija uvučena u dugu tamnoplavu plisiranu suknju sa širokim pojasom vezanim u mašnu i mesinganom figurom na kraju pojasa',
      en: 'Grey jersey mock-neck tucked into a long navy pleated skirt with a wide sash tied in a bow and a brass figure on the sash end',
    },
    intro: {
      bs: 'Siva rolka od džersija, uvučena u dugu tamnoplavu suknju s faltama i pojasom vezanim u mašnu.',
      en: 'A grey jersey mock-neck, tucked into a long navy pleated skirt with a sash tied in a bow.',
    },
    description: {
      bs: 'Rolka ima mekani ovratnik koji se blago nabire uz vrat i duge rukave koji se skupljaju u balon pri zapešću. Suknja je duga i puna, s dubokim faltama koje se otvaraju od širokog pojasa. Pojas se veže u mašnu sa strane, a jedan kraj pada niz suknju i nosi malu mesinganu figuru ateljea.',
      en: 'The top has a soft collar that folds gently at the neck and long sleeves that gather into a balloon at the wrist. The skirt is long and full, with deep pleats opening from a wide waistband. A sash ties in a bow at the side, one end falling down the skirt and carrying the atelier’s small brass figure.',
    },
    composition: {
      bs: 'Rolka od džersija, suknja od pamučnog satena',
      en: 'Jersey top, cotton sateen skirt',
    },
    care: CARE.topSkirt,
    specs: [
      [SPEC.fabric, { bs: 'Džersi, pamučni saten', en: 'Jersey, cotton sateen' }],
      [SPEC.sleeve, { bs: 'Dugi, balon pri zapešću', en: 'Long, balloon cuff' }],
      [
        SPEC.skirt,
        {
          bs: 'Duga, duboke falte, pojas vezan u mašnu',
          en: 'Long, deep pleats, sash tied in a bow',
        },
      ],
      [SPEC.detail, { bs: 'Mesingana figura na pojasu', en: 'Brass figure on the sash' }],
    ],
  },
]

export const getProductById = (id) => products.find((product) => product.id === id)
