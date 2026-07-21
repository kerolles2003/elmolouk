# 01 — Brand System

**Project:** El Molouk (الملوك للتصدير) · **Rev:** 2 (post Phase-3 review) · **Phase:** 2 (Planning) · **Status:** For approval
**Grounded in:** [`research-findings.md`](research-findings.md) §6, §9 · Built **from scratch** (no pre-existing assets)

> This is a *specification*, not production code. The design tokens below are the source of truth the eventual build implements (as a Tailwind theme + shadcn/ui primitives), keeping Design and Development honest to one system.

---

## 1. Brand strategy

- **Positioning:** *A premium Egyptian agricultural exporter built to meet European buyer expectations* — proud origin, world-class execution; international without hiding its Egyptian identity.
- **Essence:** *Royal roots, European standards.*
- **Personality:** confident · grounded · precise · warm · understated-premium. (Not: loud, playful, "discount", or corporate-cold.)
- **Promise to the buyer:** *certified, consistent, year-round, and easy to verify.*

**Tagline shortlist** (recommend the first):
1. **"The Kings of Egyptian Sweet Potatoes."** — owns the category + the name.
2. "Grown in Egypt. Trusted across Europe."
3. "Royal roots. European standards."

**Voice & tone:** plain, specific, evidence-led. Prefer numbers to adjectives ("30,000 tonnes / season", not "huge capacity"). Short sentences, never hype. Identical voice across all six languages — translated by humans, not machines.

---

## 2. The governing principle — **the product is always the hero**

Every visual and layout decision serves the product. Attention should fall on **sweet potatoes, packaging, export quality, the farming process, and freshness** — never on interface ornament.

**Implications (binding on Design):**
- The interface is a **quiet frame**: generous whitespace, restrained type, muted UI, so the product photography carries the emotion.
- **~80 % of the brand's emotional impact is photography** (§6) — the UI's job is to present it cleanly and put a clear CTA beside it.
- No decorative sections, no effect-for-effect's-sake motion. If an element doesn't lift **Trust, Clarity, or Conversion**, it's cut (lean rule, `00` §5).

---

## 3. Logo direction (concept brief for the designer)

Built from scratch. Direction, not final art:

- **Concept:** a **wordmark-led** identity — "El Molouk" set in a refined type — paired with a **minimal mark** that fuses *crown + sweet-potato leaf/root* into one restrained glyph (a subtle crown silhouette whose points read as leaves, or a monogram "M" with a single gold accent). No literal cartoon crowns.
- **Primary script is Latin** (the site's six locales are all Latin). The **Arabic wordmark (الملوك)** is retained as an **optional heritage lockup** for letterhead/packaging/company identity — designed with equal care, but not required on the website UI.
- **Gold usage:** the royal cue is carried by a *single* muted-gold accent, never a fully gold logo (gold fields read cheap; a whisper reads premium).
- **Tests it must pass:** legible at 24 px favicon; works single-colour (ink) and reversed (on dark/terracotta); no gradient required to read.

*(Logo artwork is a Design-phase deliverable, produced after this system is approved.)*

---

## 4. Colour system — palette "Nile Harvest"

Drawn from the sweet potato itself (terracotta flesh, earthy skin, cream) — deliberately **not** default produce-green, to stand out and to sit *analogous* with the product photography. Ratio target on any screen: **~60 % neutral / 30 % dark anchor / 10 % terracotta / <5 % gold**.

### 4.1 Core tokens

| Token | Role | Hex |
|---|---|---|
| `--c-ink` | Primary text, dark anchor | `#2A2018` |
| `--c-ink-soft` | Secondary text | `#5B4E3F` |
| `--c-terracotta` | Primary brand accent (headings, UI) | `#C25B2C` |
| `--c-terracotta-deep` | Interactive fill (buttons, links) | `#A5471F` |
| `--c-forest` | Dark hero ground / alt anchor | `#1E2A22` |
| `--c-olive` | Secondary accent, "freshness" | `#56613C` |
| `--c-gold` | Metallic whisper (`<5 %` use) | `#B08D57` |
| `--c-sand` | Section background | `#F2E9DB` |
| `--c-ivory` | Base page background | `#FBF7EF` |
| `--c-line` | Borders / hairlines | `#E4D8C5` |
| `--c-white` | On-dark text / cards | `#FFFFFF` |
| `--c-whatsapp` | WhatsApp CTA only | `#25D366` |

### 4.2 Verified contrast (WCAG 2.2) — accessibility-first, computed not guessed

| Pairing | Ratio | Verdict |
|---|---|---|
| `ink #2A2018` on `ivory #FBF7EF` | **≈ 14.9 : 1** | ✅ AAA — default body text |
| `olive #56613C` on `ivory` | **≈ 6.2 : 1** | ✅ AA — secondary text/labels OK |
| `terracotta-deep #A5471F` + white text (button) | **≈ 5.9 : 1** | ✅ AA — **use this shade for buttons** |
| `terracotta #C25B2C` + white text | **≈ 4.3 : 1** | ⚠️ large text / UI only (fails 4.5 for body) |
| white on `forest #1E2A22` | high | ✅ AAA — dark hero text |

**Binding rules:**
- **Never set body copy in terracotta.** Body = `ink` on `ivory`/`sand`. Terracotta is for large headings, small accents, and *behind* dark/white text.
- **Interactive elements use `terracotta-deep` (`#A5471F`)** with white text to guarantee AA.
- Verify any *new* pairing in the [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/).
- **Never rely on colour alone** (e.g. the season calendar needs a label/pattern, not just fill).

### 4.3 Dark sections
Use `forest #1E2A22` grounds (hero, footer, "why us" band) with `ivory`/`white` text + terracotta/gold accents — where the palette looks most premium.

---

## 5. Typography

**Goals:** premium-editorial feel, superb legibility at spec-table density, full **Latin-Extended** coverage (DE ä/ö/ü/ß, FR é/è/ç/à, ES ñ/á, IT à/ò…), and performance (variable, self-hosted, subsetted). Both picks are open-source (SIL OFL).

| Role | Typeface | Why |
|---|---|---|
| **Display / headings** | **Fraunces** (variable serif) | Warm, characterful serif with optical sizing — the editorial, premium-food feel; escapes templated-sans sameness |
| **Body / UI / tables** | **Inter** (variable sans) | Neutral, exceptionally legible small and in dense spec tables; complete Latin-Extended coverage for all six locales |

*Alternative (all-sans) route if serif reads too soft in mockups:* headings in a warm grotesque (e.g. **Hanken Grotesk**), body in Inter. Decide during Design against real screens.

**Type scale (1.25 major-third, rem):** `--fs-display 3.815` · `--fs-h1 3.052` · `--fs-h2 2.441` · `--fs-h3 1.953` · `--fs-h4 1.563` · `--fs-lg 1.25` · `--fs-base 1 (16px)` · `--fs-sm 0.8`.

**Rules:** headings Fraunces 400–600, tight leading, space *around*; body Inter 400/500, line-height 1.6, measure ≤ 70ch; **tabular numerals** in spec tables; fluid type via `clamp()`; **German-length resilience** — test headings/buttons/labels with the longest German strings (compound words); allow wrapping, avoid fixed-width text containers, never truncate meaning. Performance: `font-display: swap`, preload the two primary weights, subset to used glyphs.

---

## 6. Art direction & photography (the heart of the brand)

Photography *is* the brand (§2). It is also a **placeholder-first** workstream: high-quality authentic placeholders during design, each **documented** and replaced with real company assets before launch.

### 6.1 Product as hero
- **Signature shot: cut-to-reveal.** The glowing **orange cross-section** against earthy skin is the brand's colour story → the **homepage hero**, headline/CTA in the **negative space**. (Practical: wipe the cut face, shoot within ~30 min before it oxidises.)
- **Three deliberate angles:** 45° appetite hero · top-down grading flat-lay · tight texture macro (touchable skin/grain/soil).
- **Lighting:** **directional natural side light** (warm, farm-honest) as the workhorse; occasional dark-and-moody for statement heroes. **No flat frontal light, no flash.**
- **Props & palette:** matte earthy surfaces (weathered wood, linen, jute, terracotta, slate); hard-limited palette so the orange flesh is the single saturated accent — analogous with "Nile Harvest".

### 6.2 Documentary supply chain (trust)
Real hands/dirt/tools; **environmental portraits, not posed grins**; one consistent warm natural-light grade across field → curing → sorting → packing → cold store → container, so the set reads *art-directed, not stock*. Pair **scale** (wide operation) with **care** (single tuber in hand) = capability + quality.

### 6.3 Placeholder rules (design phase)
Choose authentic, palette-matched, textured images; **confirm a commercial licence for each**; **document every placeholder** (path + intended real shot) so it can be swapped later. **Avoid clichés:** businessman-in-field-with-tablet, HDR blemish-free produce on white, costumed "farmers", globe/logistics clip-art, emoji-as-icons. Sources: **Stocksy**, **RealAgStock**, Getty/iStock, Adobe/Shutterstock (filter hard by light/colour); Unsplash/Pexels as free fallback.

### 6.4 Shot list (mapped to placement)
- **Product:** cross-section hero *(home hero)* · macro texture *(quality band bg)* · whole tuber 45° *(product card)* · graded flat-lay *(caliber/grading section)* · roasted end-use with steam *(application/retail-ready)* · retail punnet/carton *(packaging section)*.
- **Supply chain:** field/golden-hour *(About)* · harvest hands *(process 1)* · **curing room** *(process 2 — a differentiator; most competitors skip it)* · sorting/grading line *(process 3)* · packing hands *(process 4)* · cold store *(logistics)* · container loading *(export/logistics)*.
- **Team & proof:** founder/agronomist environmental portrait *(About)* · candid packhouse team *(human trust band)* · certificate/QC detail or clean badge lockup `[[CONFIRM CERTIFICATION]]` *(trust strip, repeated near CTAs)*.

---

## 7. UI foundations (tokens)

- **Component base:** build on **shadcn/ui** primitives (accessible Radix underpinnings), **themed with the Nile Harvest tokens** — not shadcn's default look. Add **Framer Motion for minimal, purposeful motion only.**
- **Spacing:** 8-pt grid — `4, 8, 12, 16, 24, 32, 48, 64, 96`. Generous whitespace is the primary premium signal.
- **Radius:** restrained — `--r-sm 4px`, `--r-md 8px`, `--r-lg 12px` (avoid pill/heavy rounding; premium reads crisp).
- **Elevation:** soft, low shadows on warm neutral (`0 1px 2px rgba(42,32,24,.06)`, `0 8px 24px rgba(42,32,24,.10)`); prefer hairline `--c-line` borders over heavy shadow.
- **Layout:** 12-col grid, max content ~1200–1280px, comfortable gutters; card/grid blocks with clear separation. **All components must survive German-length content** (flexible widths, wrapping, no clipped labels).
- **Motion (Framer Motion, minimal):** 150–300 ms `ease-out`; subtle scroll reveals, calm hover/focus states, optionally one **scrollytelling** field-to-container sequence. **No heavy/decorative animation.** Honour `prefers-reduced-motion`.
- **Iconography:** simple consistent line icons — never emoji.

---

## 8. Component intent (visual spec, not code)

- **Buttons:** primary = `terracotta-deep` fill + white ("Request a Quote" / "Get My Export Quote"); secondary = `ink` outline on ivory; WhatsApp = its own green. Visible focus ring (`terracotta-deep`, 2px offset).
- **Trust strip:** certification badges `[[CONFIRM CERTIFICATION]]` + **concrete metrics** (tonnes, hectares, countries, years) — repeated near CTAs, not buried. Generic claims ("trusted by thousands") are banned; use real numbers.
- **Spec table:** bordered, scannable, zebra rows in `sand`, tabular numerals, sticky header on long tables.
- **Season calendar:** 12-cell month strip; availability by fill **+ label/pattern** (never colour alone).
- **RFQ form:** single column, labels above, **3–5 qualifying fields** (product [prefilled], destination port, volume/containers, Incoterm, work email+company; optional message), inline validation on blur, value-led submit, trust elements + "we reply within X" beside it. (Full behaviour in `02` §6.)

---

## 9. Accessibility commitments (WCAG 2.2 AA)

Verified contrast (§4.2) · visible focus states · full keyboard operability · semantic landmarks & heading order · alt text on all imagery (localized) · labelled forms with clear errors · `prefers-reduced-motion` respected · colour never the sole information carrier · all six locales meet AA (mind contrast on any localized imagery/overlays).

---

## 10. Open items to confirm before Design

- Final tagline (§1) and whether the Arabic heritage lockup appears anywhere on-site (§3).
- Serif (Fraunces) vs all-sans headline route (§5) — decided against real mockups.
- Placeholder image selections signed off (§6) and the real-photography replacement plan/owner.
- Any brand-colour preference to weigh against "Nile Harvest" (Palettes B "Deep Field" / C "Sun & Soil" are documented in `research-findings.md` if a different mood is wanted).
