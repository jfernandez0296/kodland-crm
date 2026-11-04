# Kodland Design System

Source: [kodland.org](https://www.kodland.org/) (public marketing site) — pages read: home, `/about`, `/courses/coding`, `/courses/design`. No codebase, Figma file, or slide deck was attached to this project; everything here is reconstructed from the live marketing site's copy, structure, and the one official brand image (`og:image`) that was fetchable (`assets/brand/kodland-brand-image.png`). **No logo file was accessible** (Kodland's CDN, `cdn.kodland.org`, blocks cross-origin fetches, so its SVG/PNG logo assets could not be downloaded) — see CAVEATS at the end.

## Company

Kodland is an international online school teaching kids and teens ages 8–17 coding, design, drawing/digital art, and math through live, mentor-led group or 1:1 classes. Founded 2018, operated by Kodland Pte. Ltd. (Singapore). Four course tracks:

- **Coding** — Scratch, Roblox/Lua, Minecraft/MakeCode, Python, JavaScript
- **Design** — graphic design, 3D modeling (Blender), animation
- **Drawing & Digital Art** — traditional + digital drawing, digital creativity
- **Math & Logic** — school math + logical thinking

Students build real projects (games, bots, websites, animations, 3D scenes) from lesson one rather than doing abstract exercises. Classes are live, small-group or 1:1, with a dedicated mentor; everything (lessons, tasks, projects, progress) lives on one learning platform.

## Index

- `styles.css` — root stylesheet, `@import`s everything in `tokens/`
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `effects.css` (shadows/radius/motion)
- `guidelines/` — foundation specimen cards (Design System tab: Colors, Type, Spacing, Brand groups)
- `components/` — reusable primitives, grouped `core/`, `forms/`, `navigation/`, `feedback/`
- `ui_kits/marketing-site/` — click-through recreation of the Kodland marketing homepage
- `assets/brand/` — the one real brand image recovered (radial lime rings + "kodland" wordmark)
- `SKILL.md` — Claude Code / Agent Skill wrapper for this design system

## CONTENT FUNDAMENTALS

**Voice:** warm, encouraging, parent-reassuring. Copy addresses the parent as "you" and the child as "your kid" — never "the student" or "the user." Example: *"We turn casual interests into skills for the future. We teach critical thinking and creativity."*

**We > I:** the brand speaks as a collective "we" ("We believe the best results come from genuine passion," "We don't believe in 'right' or 'wrong'"). Kid/parent testimonials are first-person ("I got onto my course and since then I've been able to develop about three games").

**Sentence rhythm:** short, declarative, confident. Headlines are plainspoken, not clever — "Online school for kids ages 8-17," "Find your course," "Why Learn to Code?" Sub-copy expands with one reassuring clause, often built on contrast: *"No abstract exercises. From their very first class, kids are building games..."*

**Casing:** sentence case almost everywhere (buttons, headlines, nav), Title Case reserved for course/proper names (Python Start, Roblox Game Developer) and a few evergreen H2s ("Why Learn to Code?"). Em dashes are a signature punctuation habit, used constantly to add a reassuring aside — *"Where kids don't just learn to use technology — they learn to build it."*

**Reassurance over hype:** copy leans on emotional safety and low pressure rather than urgency/hard-sell — "mistake-friendly environment," "no pressure and no judgement," "safe to explore." The one hype lever used is scarcity banners ("3 seats left") for course enrollment deadlines — an isolated promo pattern, not the base tone.

**No emoji.** Tone is achieved through word choice and photography/video, not emoji or exclamation-heavy copy. Occasional single exclamation points for warmth ("Smart call!").

**Kid quotes are kept unpolished** — first-person, age noted, colloquial and honest (including small grammar quirks left in), which builds authenticity: *"I love programming. I like gaming."*

## VISUAL FOUNDATIONS

**Color:** the brand color is a saturated yellow-green **lime** (`--lime-300 #d6ff66`, ranging to a punchier `--lime-500 #b8ef2e`), used as the dominant background/brand fill — confirmed by pixel-sampling the one official brand image recovered. Near-black text (`#262626`) sits directly on lime for maximum, high-energy contrast — no gradients or tints softening it. Surfaces otherwise are plain white/off-white paper. **Pink, orange and blue accents are used** across the site (promo banners, callout bubbles, checkmarks) to color-code the four course tracks and add playfulness — their exact hex values could not be pixel-verified (CORS-blocked assets), so the values in `tokens/colors.css` are informed estimates; flagged for the user to confirm/replace.

**Type:** the wordmark and headings use a bold, geometric, rounded lowercase sans (confirmed from the brand image). Poppins is used as the closest Google Fonts match (see FONT SUBSTITUTION below) for both display and body — a single confident geometric family rather than a display/body pairing, echoing the brand's plainspoken one-voice copy style.

**Backgrounds:** full-bleed color fields (lime) rather than photography for hero/brand moments; product/course photography elsewhere is real kids at consoles/desks, warm and candid, not stock-posed. The one recovered brand asset uses a soft radial "ripple" motif (concentric fading rings) — a wonderland/portal visual metaphor matching the "new digital Wonderland" tagline. No hand-drawn illustration or repeating pattern/texture was observed; no grain/noise.

**Imagery color vibe:** warm, natural skin tones, indoor lighting — not cool/desaturated, not black & white.

**Shape language:** soft, rounded — pill-shaped buttons/badges and generously rounded (16–32px) cards are the default; nothing sharp-cornered. Encoded as `--radius-md 14px` / `--radius-lg 24px` / `--radius-pill 999px`.

**Shadows:** soft, low-contrast ambient shadows for elevation (cards, floating CTAs) rather than hard drop shadows or borders; a lime-tinted glow shadow (`--shadow-brand`) for primary CTA emphasis.

**Motion:** implied to be gentle/springy given the playful, kid-first tone rather than snappy/linear — modeled here as a short, standard ease for most transitions (`--dur-normal` 200ms, `--ease-standard`) plus a bouncier ease (`--ease-bounce`) reserved for small delight moments (badges, success states). No motion could be captured directly from the live site (JS-driven interactions aren't visible to a text fetch); treat as a reasonable default, not a confirmed spec.

**Hover / press states:** modeled as a slight darken + lift on hover (`translateY(-1px)`, shadow increase) and a slight scale-down on press (`scale(0.97)`) — standard, friendly patterns consistent with the pill/rounded shape language. Not directly observed; flagged as inferred.

**Borders:** thin, light neutral borders (`--border-default`) used sparingly on inputs/secondary buttons; brand-strong outlines use near-black (`--border-strong`), never lime (lime is a fill, not an outline color).

**Transparency & blur:** none observed; the brand favors solid, confident color fields over glass/blur effects.

**Layout:** centered container (`--container-max 1200px`), generous whitespace, single-column mobile-first stacking implied by section-by-section marketing structure (hero → feature grid → testimonial carousel → teacher grid → FAQ accordion → footer). No sticky/fixed chrome beyond a standard top nav bar with a promo strip above it.

**Corner radii:** see Shape language above — no sharp corners anywhere in the observed content.

**Cards:** white surface, no border, soft shadow, large radius (24px), portrait-oriented for course/teacher cards, generous internal padding.

## ICONOGRAPHY

No icon font, SVG sprite, or icon files could be downloaded from Kodland's CDN (cross-origin fetches were blocked). The site references its own custom SVG icon set (arrows, checkmarks, category glyphs) purely by filename — content not visually inspectable. **No emoji or Unicode-glyph icons were observed** in the fetched copy.

Per the "don't hand-draw icons" rule, this design system substitutes **[Lucide](https://lucide.dev)** (MIT-licensed, CDN-friendly, rounded-stroke default that suits Kodland's soft/rounded shape language) for all icon needs in components and the UI kit. This is a flagged substitution — swap in Kodland's real icon set if/when it becomes accessible.

## FONT SUBSTITUTION (flagged)

Kodland's real webfont could not be downloaded (same CORS issue). Based on the bold, geometric, rounded-terminal lowercase wordmark visible in the recovered brand image, **Poppins** (Google Fonts) is used as the nearest match, loaded via Google Fonts CDN in `tokens/typography.css`. **Please share the actual brand font files (or a Figma/codebase link) so this can be replaced with the real webfont.**

## Intentional additions (components without a source-defined inventory)

No Figma file or codebase was attached, so per design-system guidance a standard primitive set was authored, sized to a course-marketing site's actual needs: `Button`, `IconButton`, `Badge`, `Tag`, `Card`, `Input`, `Select`, `Checkbox`, `Radio`, `Switch`, `Tabs`, `Accordion` (FAQ pattern seen on every page), `Dialog`, `Toast`, `Tooltip`.

## CAVEATS — please help iterate

1. **No real logo file.** `cdn.kodland.org` blocked every cross-origin asset fetch attempted (logo PNG/SVG, icons, illustrations, photography) — only one image on a different subdomain (`video.kodland.org`, the `og:image`) was fetchable. The wordmark is rendered as plain styled text everywhere in this system, never a reconstructed logo mark. **Please re-attach the codebase, a Figma link, or export/upload the logo, icon set, and photography directly** so real assets can replace the placeholders.
2. **Accent colors (pink/orange/blue) and all motion/hover/press specs are informed estimates**, not pixel- or code-verified — flagged inline above.
3. **Font is a substitution** (Poppins) — real font files needed to finish this correctly.
4. Only 4 of the site's pages were read (home, about, coding, design courses); drawing/math course pages, FAQ answers, and the learning platform (app.kodland / learn.kodland.org) product were not explored — say the word if you'd like those covered too.
