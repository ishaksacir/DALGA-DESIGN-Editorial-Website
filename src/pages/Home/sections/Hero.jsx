import { LineBreaks } from '@/components/ui/LineBreaks'
import { asset } from '@/constants/site'
import { useI18n } from '@/i18n/context'

/**
 * Full-bleed hero: photo, DALGA, the model cut-out, then DESIGN, layered in one SVG so text and
 * images share a coordinate system. On load the words fall in from 8× and settle with a small
 * bounce, then stay put (see hero.css); the images never move.
 */
export function Hero() {
  const { t } = useI18n()

  return (
    <header className="hero">
      <h1 className="sr-only">Dalga Design</h1>
      <svg className="hero-svg" aria-hidden="true">
        {/* An SVG filter rather than CSS drop-shadow(): Safari ignores CSS filters on SVG text. */}
        <defs>
          <filter id="hero-word-shadow" x="-10%" y="-30%" width="120%" height="160%">
            <feDropShadow
              dx="0"
              dy="4"
              stdDeviation="14"
              floodColor="#140f08"
              floodOpacity="0.28"
            />
          </filter>
        </defs>
        {/* Photo and cut-out share one transform so the model stays pixel-aligned. */}
        <g className="hero-zoom">
          <image
            href={asset('home/hero-background.webp')}
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
          />
        </g>
        <text className="hero-word" filter="url(#hero-word-shadow)" x="50%" y="50%" dy="-0.43em">
          DALGA
        </text>
        <g className="hero-zoom">
          <image
            href={asset('home/hero-cutout.webp')}
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
          />
        </g>
        <text className="hero-word" filter="url(#hero-word-shadow)" x="50%" y="50%" dy="0.43em">
          DESIGN
        </text>
      </svg>
      <p className="hero-note left">
        <LineBreaks lines={t.home.hero.noteLeft} />
      </p>
      <p className="hero-note right">
        <LineBreaks lines={t.home.hero.noteRight} />
      </p>
    </header>
  )
}
