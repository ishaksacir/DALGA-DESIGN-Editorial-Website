import { asset } from '@/constants/site'

/**
 * Atelier news shown on the home page. The first entry is the featured story;
 * the rest fill the row of cards beneath it. An entry without `img` renders as
 * an empty image slot until a photo is added. Text fields are `{ bs, en }`.
 */
export const news = [
  {
    id: 'chocolate-pinstripe-gauze',
    category: { bs: 'Novi uzorak', en: 'New pattern' },
    date: { bs: '06. okt. 2026.', en: '06 Oct 2026' },
    title: {
      bs: 'Stigla je čokoladna gaza s tankim prugama.',
      en: 'Chocolate pinstripe gauze has arrived.',
    },
    excerpt: {
      bs: 'Mekani dvostruki pamuk za košulje i široke hlače. Zatražite da je vidite na sljedećoj probi.',
      en: 'A soft double cotton for shirts and loose trousers. Ask to see it at your next fitting.',
    },
    img: asset('news-chocolate-pinstripe.jpg'),
    alt: {
      bs: 'Čokoladna pamučna gaza s finim krem prugama, labavo presavijena',
      en: 'Chocolate cotton gauze with a fine cream pinstripe, loosely folded',
    },
  },
  {
    id: 'autumn-winter-suiting-wools',
    category: { bs: 'Nova kolekcija', en: 'New collection' },
    date: { bs: '22. sep. 2026.', en: '22 Sep 2026' },
    title: { bs: 'Vunene tkanine za odijela, jesen–zima', en: 'Autumn–winter suiting wools' },
    img: asset('news-suiting-wools.jpg'),
    alt: {
      bs: 'Lepeza uzoraka vune za odijela — karo, pepito i tanke pruge',
      en: 'Fanned swatches of check, houndstooth and pinstripe suiting wool',
    },
  },
  {
    id: 'washed-linen-charcoal',
    category: { bs: 'Nova boja', en: 'New colour' },
    date: { bs: '09. sep. 2026.', en: '09 Sep 2026' },
    title: { bs: 'Prani lan, sada u antracit boji', en: 'Washed linen, now in charcoal' },
    img: asset('news-charcoal-linen.jpg'),
    alt: { bs: 'Draperirani prani lan u antracit boji', en: 'Draped charcoal washed linen' },
  },
  {
    id: 'next-update',
    category: { bs: 'Atelje', en: 'Atelier' },
    date: { bs: 'Datum', en: 'Date' },
    title: { bs: 'Ovdje ide vaša sljedeća novost', en: 'Your next update goes here' },
  },
]
