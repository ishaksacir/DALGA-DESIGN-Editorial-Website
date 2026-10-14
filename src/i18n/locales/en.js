/** English interface copy. Keep keys in sync with `bs.js`. Product and news text lives in `src/data`. */
export const en = {
  meta: {
    title: 'DALGA DESIGN — Custom garments, made for one',
    description: 'DALGA DESIGN — one-of-one custom garments.',
  },
  language: {
    label: 'Choose language',
  },
  nav: {
    catalogue: 'Catalogue',
    oneOfOne: 'One of one',
    about: 'About',
    homeAlt: 'Dalga Design — home',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
  site: {
    commissionsOpen: 'Commissions open · Autumn 2026',
  },
  footer: {
    tagline: ['Made for one.', 'Repeated for no one.'],
    intro:
      'A small atelier where garments are not produced, but grown around one person at a time.',
    explore: 'Explore',
    follow: 'Follow',
    atelier: 'Atelier',
    everyPiece: 'Every piece one of one',
  },
  home: {
    hero: {
      noteLeft: ['Made for one.', 'Repeated for no one.'],
      noteRight: ['Custom garments designed', 'around your story.'],
    },
    news: {
      heading: 'New at the atelier',
      allNews: 'All news',
      justIn: 'Just in',
      readMore: 'Read more',
    },
    showcase: {
      title: 'Selected work',
      meta: '2024 — 2026 · Each made once',
      previous: 'Show previous creations',
      next: 'Show next creations',
      view: 'View →',
    },
    statement: {
      label: 'The atelier',
      lead: 'We don’t make collections. We make one garment, for one person —',
      aside: 'and then we close the pattern for good.',
    },
    process: {
      eyebrow: 'How a piece is made',
      title: ['Four steps.', 'One original.'],
      lead: 'About ten weeks from first letter to last stitch. Nothing is cut until you have seen it drawn.',
      stages: [
        {
          timing: 'Week 1',
          title: 'Conversation',
          description:
            'You write to us about the occasion and the story the piece should carry. No commitment yet.',
          alt: 'Line drawing of two women talking over a sketch at a table',
          details: [
            ['You bring', 'The occasion, a date, any references'],
            ['We reply', 'Within two working days'],
            ['Cost', 'Nothing at this stage'],
          ],
        },
        {
          timing: 'Weeks 2 — 3',
          title: 'Concept & quote',
          description:
            'We draw it, choose the cloth with you, and price it plainly before a single cut.',
          alt: 'Line drawing of a hand holding a cloth swatch beside a gown on a dress form',
          details: [
            ['You see', 'Drawings in two or three directions'],
            ['Cloth', 'Swatches posted or seen at the atelier'],
            ['Quote', 'One fixed price, in writing'],
          ],
        },
        {
          timing: 'Weeks 4 — 9',
          title: 'Cut & fittings',
          description:
            'Chalked, cut and shaped on you across three fittings, until it moves the way you do.',
          alt: 'Line drawing of hands pinning drape on a dress form, with scissors and a tape measure',
          details: [
            ['Fittings', 'Three, about two weeks apart'],
            ['We adjust', 'Length, ease, drape, closures'],
            ['Where', 'At the atelier, by appointment'],
          ],
        },
        {
          timing: 'Week 10',
          title: 'Yours alone',
          description: 'The piece goes home with you. The pattern is closed that same day.',
          alt: 'Line drawing of a woman in a flowing gown looking over her shoulder',
          details: [
            ['Delivered', 'Pressed and finished, with a care card'],
            ['Pattern', 'Closed the same day, never re-cut'],
            ['Aftercare', 'Alterations on request'],
          ],
        },
      ],
    },
    maker: {
      imageAlt: 'The founder at her cutting table',
      eyebrow: 'Two pairs of hands',
      quote: '“I want the person to recognise themselves in it before they’ve even tried it on.”',
      credit: 'Founder · Dalga Design',
      notes: [
        'Everything is cut and sewn on one table, in a small atelier, by the same two people from start to finish.',
        'Wool, linen and raw cotton — fabrics that age with the person wearing them.',
      ],
    },
    cta: {
      open: 'Commissions open',
      season: 'Autumn 2026',
      title: 'Get your',
      titleAccent: 'piece.',
      steps: [
        { label: 'Write', text: 'Tell us what it’s for, and when.' },
        { label: 'Talk', text: 'We reply personally and set a first conversation.' },
        { label: 'Decide', text: 'Nothing is agreed until you’ve seen it drawn.' },
      ],
    },
  },
  catalogue: {
    cover: {
      archive: 'The archive',
      onTheCover: 'On the cover',
      lead: 'Finished commissions, each cut once. The pattern was closed the day the garment left the table — nothing here can be ordered twice, only begun again, differently.',
      title: 'Catalogue',
    },
    filter: 'Filter',
    allPieces: 'All pieces',
    showMore: (count) => `Show ${count} more`,
  },
  contact: {
    trigger: 'Get your piece',
    triggerAction: 'Write to the atelier',
    close: 'Close',
    heading: 'Write to the atelier.',
    intro:
      'Point us to a piece you like and tell us what to change — or start from nothing. We reply within two working days.',
    tagLabel: 'Tag a piece from the catalogue',
    optional: 'Optional',
    remove: 'Remove',
    notePlaceholder: 'What would you change? e.g. this, but in red linen',
    noteLabel: (name) => `What would you change about ${name}?`,
    name: 'Name',
    surname: 'Surname',
    phone: 'Phone number',
    message: 'Message',
    messagePlaceholder: 'What it’s for, sizes, and when you need it.',
    submit: 'Send message →',
    sending: 'Sending…',
    errors: {
      phone: 'Please check your phone number.',
      message: 'Tag a piece or write a short message.',
      generic: 'Please fill in the highlighted fields.',
      failed: 'Your message didn’t send. Please try again.',
    },
    sentLabel: 'Message received',
    sentText: (name, phone) => `Thank you, ${name}. We’ll call or message you on ${phone} soon.`,
    done: 'Done',
    another: 'Send another',
    askAbout: 'Ask about this piece',
  },
  product: {
    back: '← Catalogue',
    notFoundEyebrow: 'Catalogue',
    notFoundTitle: 'Piece not found',
    notFoundText: 'That commission isn’t in the archive.',
    notFoundLink: 'Return to the catalogue →',
    composition: 'Composition',
    piece: 'Piece',
    oneOfOne: 'One of one',
    care: 'How to wash',
    ctaNote: 'We answer every letter personally, within a week.',
    showImage: (index, name) => `Show image ${index} of ${name}`,
  },
  oneOfOne: {
    hero: {
      imageAlt: 'Screen-printing the DALGA figure motif onto raw cotton',
      meta: 'Ten weeks · Four stages',
      title: ['One', 'of one.'],
      lead: 'A garment drawn, cut and sewn around one person — and a pattern that is closed the day it goes home.',
    },
    statement: {
      label: 'The commission',
      lead: 'It begins with a letter about you, and ends with a piece nobody else will own —',
      aside: 'not in another size, not in another fabric.',
    },
    unfolds: {
      heading: 'How it unfolds',
      meta: 'First letter → last stitch',
      stage: 'Stage',
      stages: [
        {
          title: 'Conversation',
          timing: 'Week 1',
          description:
            'You write about the occasion and the story the piece should carry. We reply personally. No commitment yet.',
          alt: 'A letter with a pencil in an open envelope',
        },
        {
          title: 'Concept & quote',
          timing: 'Weeks 2—3',
          description:
            'We draw it, choose the cloth with you, and price it plainly. Nothing is agreed until you’ve seen it drawn.',
          alt: 'Line drawing of a pleated dress beside a cloth swatch',
        },
        {
          title: 'Fittings',
          timing: 'Weeks 4—9',
          description:
            'Two to three sessions shape the garment directly around you. Remote fittings when needed.',
          alt: 'A dress form with pins and a tape measure',
        },
        {
          title: 'Hand-off',
          timing: 'Week 10',
          description: 'The piece goes home with you. The pattern is closed that same day.',
          alt: 'A finished coat on a hanger with a tag',
        },
      ],
    },
    goodToKnow: {
      eyebrow: 'Before we begin',
      title: 'Good to know.',
      lead: 'Four plain answers to what most people ask in their first letter.',
      answers: [
        {
          label: 'Timeline',
          title: 'Six to ten weeks.',
          description: 'Occasion garments should be commissioned at least three months ahead.',
        },
        {
          label: 'Investment',
          title: 'Quoted for you alone.',
          description:
            'Priced after the first conversation — on fabric, construction and hours of handwork.',
        },
        {
          label: 'Materials',
          title: 'Wool, linen, raw cotton.',
          description:
            'Or a fabric that already means something to you — an heirloom, a remnant, a gift.',
        },
        {
          label: 'The promise',
          title: 'Never repeated.',
          description:
            'Your pattern is never reused — not in another size, not in another fabric, not for anyone else.',
        },
      ],
    },
    cta: {
      imageAlt: 'Raw linen embossed with the DALGA DESIGN mark',
      eyebrow: 'Begin your commission',
      title: ['Tell us', 'the story it'],
      titleAccent: 'should carry.',
      text: 'A few lines about you, the occasion and what you imagine. Photos, sketches and half-formed ideas are welcome — every letter is answered personally, within a week.',
      link: 'Write to the atelier',
    },
  },
  about: {
    hero: {
      label: 'The atelier',
      number: 'Dalga Design',
      title: 'About us',
    },
    story: {
      imageAlt: 'The founder of DALGA DESIGN at her cutting table',
      caption: 'The founder · At the cutting table',
      captionEnd: 'The atelier',
      title: 'A movement that keeps its shape while never standing still.',
      titleAside: 'That is how we think about clothing.',
      notes: [
        'DALGA is a small independent atelier making garments for one person at a time. We begin with a story, not a trend, and build slowly around the body that will wear it.',
        'Everything is cut and sewn on one table, by the same two people from first line to last stitch.',
      ],
    },
  },
  notFound: {
    title: 'Page not found',
    text: 'That page doesn’t exist.',
    link: 'Return home →',
  },
}
