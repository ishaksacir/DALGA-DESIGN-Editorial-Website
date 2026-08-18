# DALGA DESIGN — Editorial Website Handoff

## Project
High-fashion editorial site for **DALGA DESIGN**, a custom clothing atelier making one-of-one garments. NOT ecommerce — no shop, cart, catalogue, or checkout. Feels like a luxury fashion magazine + designer portfolio + commission experience. "Dalga" means wave; the brand promise is "Made for one. Repeated for no one."

## Deliverable
Single Design Component: **`DALGA Design.dc.html`** — a client-side multi-page site with 4 pages switched via internal state (`home`, `about`, `creations`, `oneofone`). Nav/footer links call `navigate(page)`; scrolls to top and re-inits animations on switch.

## Design direction
- Gen Z-ish, bold, minimal, slightly experimental/chaotic; luxurious and expensive-feeling.
- Exactly 2 fonts: **Bodoni Moda SC** (headers, big editorial text) + **Manrope** (nav, body, captions, UI). Loaded from Google Fonts.
- Palette: warm off-white `#f7f5f1`, ink `#17140f`/`#16130e`, muted taupe `#6b5f4d`, secondary bg `#ece8e0`, dark band `#17140f`.
- No rounded buttons, heavy shadows, gradients, carousels, or template styling. Thin hairlines, generous whitespace, overlapping images (no borders/outlines between them).
- Restrained animations: scroll reveals (IntersectionObserver, fade + 28px rise), hero text keyframe entrance, marquee loop.

## Pages
1. **Home**: full-screen hero; seamless japodi marquee; overlapping 4-image gallery with black "We don't do collections." statement crossing images; "How a piece is built" (sewing.jpg beside 4 steps: Conversation / Concept / Fitting / Creation); dark "Get your piece" CTA band → One of one.
2. **About**: "Dalga means wave." headline, brand story, founder.jpg, "A signature, not a label" band (atelier-linen.jpg) on #ece8e0.
3. **Selected creations**: 5 staggered alternating articles (image ↔ text with giant ghost numerals 01–05 at 7% opacity), minimal background art (3 faint rotated japod figures ~5% opacity + center hairline), each with commission metadata + story.
4. **One of one** (ordering page): hero, 4-step commission process recap, "Good to know" grid (Timeline / Investment / Materials / The promise) on #ece8e0, "Begin a conversation" mailto CTA (atelier@dalgadesign.com).

## Hero (most important)
- Full-screen `uploads/mainbg.webp`, model centered.
- Layered 3D depth: "DALGA" (huge Bodoni) at z2 BEHIND model; `uploads/image-Photoroom.png` (model cutout, same framing) at z3; "DESIGN" at z4 IN FRONT of model.
- Both words animate in via `@keyframes dalga-hero-in` (fade, letter-spacing tighten, rise; DESIGN delayed 0.35s).
- Transparent minimal navbar (no logo on home — empty span left side; japod logo appears only on other pages' solid navbar, 58px, no hover effect).
- Bottom-left small text (Manrope uppercase): "Made for one. / Repeated for no one." Bottom-right: "Custom garments designed around your story." Center scroll hairline.

## Signature interactions
- **Needle buttons**: rectangular bordered buttons; on hover bg inverts (black on light pages, white on dark band), label fades out, a needle image slides into center (`uploads/needle-black.png` on light-turned-black... note: dark-band button uses needle-black.png, light-page buttons use needle-white.png). Wired in logic via `initNeedleButtons()` with `data-needle-btn="light|dark"`, `data-needle-label`, `data-needle-img`.
- **Marquee** under hero: 36 connected copies of `uploads/japodi-t.png` (44px tall, no gaps) in a strip animated `translateX(0 → -50%)` 60s linear infinite — seamless loop.
- **Scroll reveals**: `[data-reveal]` elements observed; only animated if initially below 90% viewport.

## Assets (uploads/)
- `mainbg.webp` — hero photo; `image-Photoroom.png` — model cutout for depth effect.
- `japod-t.png`, `japodi-t.png`, `logo-t.png` — background-removed (canvas luminance→alpha) versions of japod.png / japodi.png / logo-Photoroom.png. Use the `-t` versions.
- `needle-black.png`, `needle-white.png` — generated needle icons (tapered shaft + eye).
- Gallery/creations: `collection-1.jpg` (raw cotton set), `collection-2.jpg` (taupe gown), `collection-3.jpg` (paisley jacket), `craftsmanship.jpg` (sage linen dress), `dalga-wallpaper.jpg` (tulip wrap skirt — note: NOT the atelier image).
- `atelier-linen.jpg` — DALGA mark on linen; `founder.jpg` — About image; `sewing.jpg` — process section; `about.jpg` — unused now.

## Footer (all pages)
4-column grid: logo-t.png (92px) + tagline / Explore (About, Selected creations, One of one) / Follow (Instagram: https://www.instagram.com/dalga.design/, Facebook: https://www.facebook.com/dalgadesign) / Atelier (mailto + "Commissions open · Autumn 2026"). Hairline bottom row: © 2026 + "Every piece one of one".

## Tweakable props
- `heroDepth` (boolean): toggles the model-cutout depth layer.
- `revealAnimations` (boolean): toggles scroll reveals.

## User preferences learned
- Wants bold overlapping type/images, few colors, lots of subtle animation.
- Liked the blend-mode color-changing statement text, but final choice was solid black.
- Dislikes cheap/cluttered layouts; footer was redesigned once for this reason.
- Small hero taglines must be Manrope (not Bodoni).

## Status
All requested work complete and verified. Last change: Selected creations layout rebuild + background art (was pending final user review).
