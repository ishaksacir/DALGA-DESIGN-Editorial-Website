/** English interface copy. Keep keys in sync with `bs.js`. Product and news text lives in `src/data`. */
export const en = {
  meta: {
    title: 'DALGA DESIGN — Clothing from Bihać, one sample of each',
    description:
      'DALGA DESIGN — clothing from Bihać, Bosnia, carrying the historical motifs of our region. Every design is made as a single sample, then made again in your size.',
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
    menu: 'Menu',
  },
  site: {
    commissionsOpen: 'Commissions open · Autumn 2026',
  },
  footer: {
    tagline: ['One sample of each.', 'Made again in your size.'],
    intro:
      'A small atelier in Bihać, Bosnia, where the historical motifs of our region are carried into clothing — one sample at a time.',
    explore: 'Explore',
    follow: 'Follow',
    atelier: 'Atelier',
    everyPiece: 'Every design a single sample',
    backToTop: 'Back to top',
  },
  home: {
    hero: {
      noteLeft: ['One sample of each.', 'Made again in your size.'],
      noteRight: ['Motifs from the history', 'of Bihać, worn today.'],
    },
    news: {
      heading: 'New at the atelier',
      allNews: 'All news',
      justIn: 'Just in',
      readMore: 'Read more',
      onInstagram: 'On Instagram',
      showPost: 'Show post',
    },
    showcase: {
      title: 'Selected work',
      meta: '2024 — 2026 · Each made as one sample',
      previous: 'Show previous creations',
      next: 'Show next creations',
      view: 'View →',
    },
    statement: {
      label: 'The atelier',
      lead: 'We don’t make collections. Every design is made once, as a single sample —',
      aside: 'and you can have that same piece made in your size.',
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
            'You write to us about a sample from the catalogue, or an idea of your own, and what you would change. No commitment yet.',
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
            'We agree the changes with you, choose the cloth together, and price it plainly before a single cut.',
          alt: 'Line drawing of a hand holding a cloth swatch beside a gown on a dress form',
          details: [
            ['You see', 'Drawings of the agreed changes'],
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
          title: 'Yours',
          description:
            'The piece goes home with you, made in your size and finished the way we agreed.',
          alt: 'Line drawing of a woman in a flowing gown looking over her shoulder',
          details: [
            ['Delivered', 'Pressed and finished, with a care card'],
            ['Pattern', 'Kept, so the design can be made again'],
            ['Aftercare', 'Alterations on request'],
          ],
        },
      ],
    },
    maker: {
      imageAlt: 'Sabiha Šaćirbegović at her cutting table',
      eyebrow: 'Two pairs of hands',
      quote: '“I want the person to recognise themselves in it before they’ve even tried it on.”',
      credit: 'Sabiha Šaćirbegović · Founder, Dalga Design',
      notes: [
        'Everything is cut and sewn on one table, in a small atelier in Bihać, by the same two people from start to finish.',
        'Motifs from the history of our town and region, reworked by hand into every piece.',
      ],
    },
    cta: {
      open: 'Commissions open',
      season: 'Autumn 2026',
      title: 'Get your',
      titleAccent: 'piece.',
      steps: [
        { label: 'Write', text: 'Pick a sample, or tell us what it’s for, and when.' },
        { label: 'Talk', text: 'We reply personally and set a first conversation.' },
        {
          label: 'Try it on',
          text: 'Come to the atelier for a fitting — you pay only when the piece is finished and fits you.',
        },
      ],
    },
  },
  catalogue: {
    cover: {
      archive: 'The archive',
      onTheCover: 'On the cover',
      lead: 'Every design here was made once, as a single sample. Any of them can be made again in your size — and changed, in agreement with the maker.',
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
      'Pick a sample from the catalogue and we’ll make it in your size, with any changes we agree on — or start from nothing. We reply within two working days.',
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
    oneOfOne: 'Single sample',
    care: 'How to wash',
    ctaNote: 'We answer every letter personally, within a week.',
    showImage: (index, name) => `Show image ${index} of ${name}`,
  },
  oneOfOne: {
    hero: {
      title: 'One of one.',
      lead: 'Each design is made once, as a single sample. Choose one, and we make it again in your size — changed, if you like, in agreement with the maker.',
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
            'You write about a sample you like, or the occasion and story the piece should carry. We reply personally. No commitment yet.',
          alt: 'Line drawing of two women talking over a sketch at a table',
        },
        {
          title: 'Concept & quote',
          timing: 'Weeks 2—3',
          description:
            'We agree the changes with you, choose the cloth, and price it plainly. Nothing is agreed until you’ve seen it drawn.',
          alt: 'Line drawing of a hand holding a cloth swatch beside a gown on a dress form',
        },
        {
          title: 'Fittings',
          timing: 'Weeks 4—9',
          description:
            'Two to three fittings at the atelier shape the garment directly around you.',
          alt: 'Line drawing of hands pinning drape on a dress form, with scissors and a tape measure',
        },
        {
          title: 'Hand-off',
          timing: 'Week 10',
          description: 'The piece goes home with you, in your size, finished the way we agreed.',
          alt: 'Line drawing of a woman in a flowing gown looking over her shoulder',
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
          title: '6–10 weeks',
          description: 'Occasion garments should be commissioned at least three months ahead.',
        },
        {
          label: 'Investment',
          title: 'Quoted for you',
          description:
            'Priced after the first conversation — on fabric, construction and hours of handwork.',
        },
        {
          label: 'Materials',
          title: 'Chosen together',
          description:
            'We pick the cloth with you for each piece — or work with a fabric that already means something to you.',
        },
        {
          label: 'The sample',
          title: 'Made in your size',
          description:
            'Any design in the catalogue can be made again to your measurements — and changed, in agreement with the maker.',
        },
      ],
    },
    faq: {
      eyebrow: 'Questions',
      title: 'Asked often.',
      more: 'Something else on your mind?',
      write: 'Write to the atelier',
      items: [
        {
          question: 'Can I order a piece exactly as it is in the catalogue?',
          answer:
            'Yes. Every design exists as a single sample, and we make it again in your size — in the same cloth, or as close to it as we can find.',
        },
        {
          question: 'What can I change?',
          answer:
            'Cloth, colour, length, sleeves and details — whatever we agree on with the maker before the first cut. If a change would lose what makes the design work, we will say so plainly.',
        },
        {
          question: 'Do I need to visit the atelier?',
          answer:
            'Yes. Fittings take place at the atelier in Bihać, so the piece is shaped directly on you.',
        },
        {
          question: 'How many fittings will there be?',
          answer:
            'Usually two to three, about two weeks apart. A piece made from a sample in your size often needs fewer.',
        },
        {
          question: 'Can I bring my own drawing or reference?',
          answer:
            'Of course. Start from a sample, a sketch, a photograph — or a fabric that already means something to you.',
        },
        {
          question: 'Can I commission a piece as a gift?',
          answer:
            'Yes. Write to us first and we will find a discreet way to get the measurements, or plan a fitting together after it is given.',
        },
        {
          question: 'How does payment work?',
          answer:
            'You pay when the piece is finished — after you have tried it on at the atelier and it fits.',
        },
        {
          question: 'What if it needs adjusting later?',
          answer:
            'Bring it back. We make alterations on request, so the piece keeps fitting as the years go on.',
        },
      ],
    },
  },
  about: {
    eyebrow: 'About the atelier',
    title: 'Dalga means',
    titleAccent: 'wave.',
    imageAlt: 'Sabiha Šaćirbegović, founder of DALGA DESIGN, at her cutting table',
    caption: 'Sabiha Šaćirbegović, at the cutting table',
    facts: [
      ['Where', 'A small atelier in Bihać, Bosnia — one cutting table.'],
      ['Who', 'The same two people, from first sketch to last stitch.'],
      ['Motifs', 'Historical motifs of Bihać and our region, carried into everything we make.'],
    ],
  },
  aboutMaker: {
    eyebrow: 'The maker',
    name: 'Sabiha',
    surname: 'Šaćirbegović',
    role: 'Founder · Bihać',
    motto:
      'Every piece writes its own history — the way each of us writes the history of our own style.',
    notes: [
      [
        'Authentic',
        'For Sabiha, what matters most, in clothing as in people, is being authentic. Turning a vision into something you can wear has always felt special to her, and each piece is meant to meet halfway between chic and art.',
      ],
      [
        'The Japodes',
        'Her work sits where avant-garde and wearable art cross. She draws the Japodes, the ancient people of the Una valley around Bihać, onto her pieces, bringing the history of our town into what we wear today.',
      ],
    ],
  },
  loadError: {
    eyebrow: 'Catalogue',
    status: 'Briefly unavailable',
    title: 'The archive',
    titleAccent: 'is resting.',
    text: 'We couldn’t load the pieces just now. The atelier is working as always — try again in a moment.',
    retry: 'Try again',
    write: 'Or write to us at',
  },
  notFound: {
    title: 'Page not found',
    text: 'That page doesn’t exist.',
    link: 'Return home →',
  },
  phone: {
    nav: {
      home: 'Home',
      catalogue: 'Catalogue',
      process: 'Process',
      about: 'About',
      inquire: 'Inquire',
    },
    hero: { name: 'Dalga Design', line: 'Made in Bihać' },
    work: { title: 'Selected work', all: 'All pieces →' },
    rule: {
      before: 'We don’t make collections. Each design is made',
      accent: 'once, as a single sample —',
      after: 'then made again, in your size.',
      label: 'The atelier’s rule',
    },
    process: {
      link: 'How it works →',
      lead: 'About ten weeks from first letter to last stitch.',
      start: 'Start step one',
    },
    about: {
      title: 'Dalga means wave.',
      credit: 'Sabiha Šaćirbegović, founder of Dalga Design',
      link: 'About →',
    },
    steps: {
      eyebrow: 'The process · Ten weeks',
      intro:
        'From the first letter to the day it goes home, every piece is made by hand in our atelier in Bihać, in your size.',
      cta: 'See the full process',
    },
    cta: {
      status: 'Commissions open for autumn',
      title: 'Get your piece.',
      text: 'Pick a sample, or tell us what it’s for and when. You pay only when the piece is finished.',
    },
    catalogue: {
      title: 'One sample of each.',
      lead: 'Tap a piece to have it made in your size — with any changes we agree on.',
      filter: 'Filter by type',
      types: {
        all: 'All',
        dresses: 'Dresses',
        skirts: 'Skirts',
        tops: 'Tops',
        jackets: 'Jackets',
        coats: 'Coats',
      },
    },
    piece: {
      madeOnce: (no) => `No. ${no} · Single sample`,
      intro:
        'This is the one sample of this design. We can make it again in your size — and change the cloth or details, in agreement with the maker.',
      details: {
        type: 'Type',
        year: 'Year',
        cloth: 'Cloth',
        made: 'Made',
        pattern: 'Pattern',
        timeline: 'Timeline',
      },
      made: 'Once as a sample, by hand, in Bihać',
      pattern: 'Kept — made again in your size',
      timeline: 'About ten weeks for yours',
      hint: 'Swipe for more · pull down to close',
      next: (no) => `Next · No. ${no}`,
      previous: 'Previous piece',
      nextPiece: 'Next piece',
      close: 'Close',
      start: 'Start from this piece',
      view: (index, name) => `${name}, view ${index}`,
    },
    failed: {
      label: 'No connection',
      title: 'A thread came loose.',
      text: 'We couldn’t reach the atelier. Check your connection and try again — anything you’ve written is kept.',
      retry: 'Try again',
      retrying: 'Trying again…',
      email: 'Email us instead',
    },
  },
}
