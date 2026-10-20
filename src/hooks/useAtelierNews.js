import { useEffect, useState } from 'react'

import { SITE } from '@/constants/site'
import { news } from '@/data/news'
import { useI18n } from '@/i18n/context'
import { loadInstagramFeed } from '@/services/instagramFeed'

// Spelled out rather than Intl: some browsers lack Bosnian month names and print "2026 M09 27".
const MONTHS = {
  bs: [
    'jan.',
    'feb.',
    'mar.',
    'apr.',
    'maj',
    'jun.',
    'jul.',
    'aug.',
    'sep.',
    'okt.',
    'nov.',
    'dec.',
  ],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
}

/** Same style as the hand-written dates in `news.js`: "06. okt. 2026." / "06 Oct 2026". */
function formatDate(iso, lang) {
  const date = new Date(iso)
  const day = String(date.getDate()).padStart(2, '0')
  const month = MONTHS[lang][date.getMonth()]
  const year = date.getFullYear()
  return lang === 'bs' ? `${day}. ${month} ${year}.` : `${day} ${month} ${year}`
}

/** Instagram posts and `news.js` entries in one shape: plain strings for the active language. */
export function useAtelierNews() {
  const { t, tr, lang } = useI18n()
  const [posts, setPosts] = useState([])

  useEffect(() => {
    loadInstagramFeed().then(setPosts)
  }, [])

  if (posts.length === 0) {
    return news.map((item) => ({
      id: item.id,
      img: item.img,
      alt: tr(item.alt),
      category: tr(item.category),
      date: tr(item.date),
      title: tr(item.title),
      excerpt: item.excerpt ? tr(item.excerpt) : '',
      href: SITE.instagram,
    }))
  }

  return posts.map((post) => ({
    ...post,
    alt: post.title,
    category: t.home.news.onInstagram,
    date: formatDate(post.date, lang),
    title: post.title || t.home.news.onInstagram,
  }))
}
