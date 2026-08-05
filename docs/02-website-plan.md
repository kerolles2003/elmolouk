# 02 — Website Plan

**Project:** El Molouk (الملوك للتصدير) · **Rev:** 2 (post Phase-3 review) · **Phase:** 2 (Planning) · **Status:** For approval
**Grounded in:** [`research-findings.md`](research-findings.md) · [`00-project-brief.md`](00-project-brief.md) · [`01-brand-system.md`](01-brand-system.md)

---

## 1. Information architecture (lean)

Every page justifies itself by **Trust, Clarity, or Conversion** (`00` §5). Sustainability/social compliance folds into **Quality**; a News/blog is deferred to Phase 2.

```
/ (Home)                         ← organic + brand; full nav; product-hero
/sweet-potatoes                  ← the hero product: full procurement spec kit
/quality                         ← certifications, food safety, traceability, responsibility (trust gate)
/about                           ← heritage, farms, packhouse, team, stat band
/contact                         ← RFQ form, WhatsApp, address, ports/Incoterms
/rfq                             ← DEDICATED GOOGLE ADS LANDING PAGE (stripped nav, single goal, noindex)
(each localized: /en/… /de/… /nl/… /fr/… /es/… /it/)
```

**Primary nav (site):** Sweet Potatoes · Quality · About · Contact + **[Request a Quote]** + language switcher.
**Footer:** named contact + email + WhatsApp + address · ports & Incoterms · certification logos `[[CONFIRM CERTIFICATION]]` · language links · legal · LinkedIn.
**Structure stays ready** for `/products/{crop}` and `/news` later without redesign — but neither is built for MVP.

---

## 2. Homepage — section-by-section (product is the hero)

1. **Full-bleed hero — the cut-to-reveal shot.** Glowing orange cross-section on an earthy ground; headline/CTA sit in the negative space. Keyword-aware `H1` (*"Premium Egyptian Orange-Fleshed Sweet Potatoes"*) + credibility subline (*"Certified grower-exporter · Germany's #1 sweet-potato origin, 2025"* ``). CTAs: **[Request a Quote]** + **[WhatsApp]**. This image is the LCP element (eager-loaded, sized).
2. **Certification + metrics trust strip** — GLOBALG.A.P. · BRCGS/IFS · GRASP `[[CONFIRM CERTIFICATION]]` + concrete numbers (tonnes · hectares · countries · years) → links to `/quality`. *(The trust gate, above the fold.)*
3. **Positioning line** — one sentence: premium Egyptian exporter, European standards.
4. **Product card** — Beauregard/Bellevue/Covington, macro flesh photo → `/sweet-potatoes`.
5. **"Why El Molouk" proof band** (`forest` ground) — own farms + packhouse · traceability · cold chain · year-round availability · value vs USA/Spain.
6. **Process / scrollytelling teaser** — field → curing → sorting → packing → container (real supply-chain shots; curing highlighted as a differentiator).
7. **Season calendar teaser** — 12-month strip → "year-round reliability."
8. **Closing RFQ block** — *"Become a distribution partner"* + form entry + WhatsApp.

*Lean check:* no section here exists for decoration — each is trust or conversion. Client logos/case studies are added *when real ones exist* (``), not fabricated.

---

## 3. Product page — `/sweet-potatoes` (the substance)

A **procurement-ready spec kit** *and* ≥1,000 words unique for SEO. Basic specs **ungated** on-page; detailed export spec-sheet PDF **gated** (§6). Sections:

1. Hero: variety, deep-orange-flesh macro, one-line sensory descriptor, **[Request a Quote]** + **[Download Spec Sheet]**.
2. **Varieties** — Beauregard, Bellevue, Covington (flesh/skin/sensory).
3. **Caliber table** — S/M/L1/L2/XL/G gram ranges; Class I + uniformity.
4. **Packaging** — 6 kg carton, 8/10 kg boxes, bulk bins, retail punnet/pre-pack, private label.
5. **Container loading** — 20′ / 40′ reefer: pallets, cases, net weight.
6. **Season calendar** — 12-month availability (fill + label).
7. **Post-harvest & cold chain** — curing, 12–14 °C storage, chilling-injury note, shelf life, data-logger monitoring.
8. **Comparison** — Egypt vs USA vs Spain (flesh, shelf life, value).
9. **Certifications** (inline) `[[CONFIRM CERTIFICATION]]` → `/quality`.
10. **FAQ** — MOQ, Incoterms, lead times, private label, documentation, MRLs (feeds FAQ schema + AI extraction).
11. Sticky RFQ / spec-download rail.

---

## 4. Other pages (brief)

- **/quality** — the trust gate. Each certification: logo, scheme number, validity, body, downloadable scan — **only when client-verified** (`[[CONFIRM CERTIFICATION]]` until then; never fabricate). Includes traceability, cold-chain, MRL compliance, and the **responsibility/social-compliance** content (GRASP/SMETA) folded in. Organization + LocalBusiness schema.
- **/about** — heritage/"exporting since", own farms + packhouse (hectares/capacity), named leadership + team photos, stat band, ports. Core E-E-A-T page.
- **/contact** — RFQ (primary), WhatsApp, named contact + direct email, physical address, ports & Incoterms, map.

---

## 5. Dedicated Google Ads landing page — `/rfq`

Because ads are the primary channel, a **conversion-only** page (research §8), separate from the homepage:

- **Stripped nav** — no header menu/footer link-farm; the only actions are RFQ + WhatsApp. Single goal.
- **Message match** — `H1` mirrors the ad group's keyword (e.g. *"Buy Egyptian Sweet Potatoes — Bulk Export to Europe"*); maintain a small set of variant headlines per ad group (or DKI) to keep ad-scent tight → lifts **Quality Score**, lowers CPC.
- **Above-the-fold anatomy:** keyword `H1` → qualifier subhead (variety, grades, Incoterms/ports, volume, year-round) → **single** sticky **[Request a Quote]** → trust strip (concrete metrics + cert badges) → real product/packhouse/container photo.
- **Below fold (short):** 3–4 proof points, mini spec snapshot, certifications, RFQ form, WhatsApp. No distractions, no carousels.
- **Technical:** `noindex` (avoid competing with the SEO site), fast (§8), mobile-first; conversion tracked via the thank-you page event (§6).

---

## 6. Conversion strategy (the core deliverable)

**RFQ form (primary) — 3–5 qualifying fields** (research §8):
- Fields: *Name* · *Company + work email* · *Destination country/port* · *Volume (containers/season)* · *Incoterm* (dropdown) — *Product* prefilled, *message* optional. Drop phone (offer WhatsApp instead), job title, "how did you hear".
- **Multi-step** option for deeper qualification (identity → request → scope) with conditional logic; **inline validation on blur**; value-led CTA (*"Get My Export Quote"*).
- **Trust beside the form:** certifications `[[CONFIRM CERTIFICATION]]`, "We reply within X hours", named contact.

**WhatsApp (co-primary):** floating button every page + header/footer; ideally **form submit pre-fills a WhatsApp thread**. Deep link, no backend.

**Speed-to-lead:** wire instant email/WhatsApp alerts on submit — replying **< 5 min** is the single biggest qualification multiplier.

**Thank-you page** (not just inline): confirms receipt, states response-time promise, offers **one** next step (download spec sheet / chat on WhatsApp). Fires the **Google Ads conversion event**.

**Spec-sheet — hybrid gate:** basic specs visible on `/sweet-potatoes`; the detailed **export spec-sheet/packing-list PDF** gated behind a **3-field** form and delivered **on-page immediately**.

**Sample request:** lighter, high-intent flow on the product page.

**MVP form backend:** Next.js route handler → transactional email (e.g. Resend) + honeypot/Turnstile; no CRM required for MVP.

---

## 7. Internationalisation plan (next-intl, six locales)

- **Implementation:** **next-intl** with the App Router — localized routing (`/en/ /de/ /nl/ /fr/ /es/ /it/`), typed message catalogues, and **no hardcoded strings** (every visible string from the catalogue — enforced in review).
- **SEO wiring:** `hreflang` on every page referencing **all** variants **including itself** + **`x-default` → English**; per-locale **canonical**, **title/meta**, and **Open Graph**; per-locale `<html lang>`.
- **Localized slugs** (e.g. `/de/suesskartoffeln`) via next-intl pathnames — *nice-to-have;* MVP may ship consistent slugs and add localized ones later.
- **All six live at launch** (per approval) — **dependency: human-quality translations** for each (machine translation forbidden; SEO risk across all locales).
- **Layout:** every component designed for **German-length** content — no clipping/truncation (`01` §5, §7). All locales are LTR (no RTL).

---

## 8. SEO plan

- **Keyword architecture** (research §5.3) → pages: Product pillar → `/sweet-potatoes`; Spec/logistics → product sections + spec sheet; Trust/compliance → `/quality`; Informational → deferred `/news` (Phase 2).
- **On-page:** unique per-page/locale title (front-loaded transactional phrase + "El Molouk") & meta description (benefit + CTA); one `H1`; `H2/H3` around buyer questions; hub-and-spoke internal links (product ↔ quality ↔ contact); image SEO (descriptive WebP/AVIF filenames + localized alt, explicit dimensions).
- **Structured data (JSON-LD):** Organization (sitewide) · Product (`/sweet-potatoes`) · BreadcrumbList · LocalBusiness (`/quality`,`/contact`) · FAQPage (mark up; no rich result) · **omit price** (quote-based). Validate with the Rich Results Test.
- **Technical:** per-locale XML sitemap, robots.txt, canonicals, clean URLs, HTTPS, mobile-first. The `/rfq` ads page is **`noindex`**.
- **AI-search extractability:** tables, clear headings, explicit facts, FAQs.
- **Measurement:** Google Search Console + privacy-friendly analytics with RFQ/WhatsApp/download/thank-you as tracked events.

---

## 9. Performance budget (a real Ads + SEO edge)

- **Targets (p75):** LCP ≤ 2.5 s · INP ≤ 200 ms · CLS ≤ 0.1 — **all pass.** (Poor speed → higher CPC + lower Quality Score, research §8.)
- **Tactics:** static-first (pre-rendered) + CDN; hero image WebP/AVIF, eager, explicit dimensions; below-fold lazy-loaded; variable fonts subset + preloaded; **minimal JS** (ship interactivity only where needed — form, switcher, WhatsApp, one motion sequence); Framer Motion used sparingly.
- **Guardrail:** Lighthouse CI budget in the pipeline so performance can't silently regress.

---

## 10. Accessibility plan (WCAG 2.2 AA)

Verified contrast (`01` §4.2) · visible focus rings · full keyboard paths · semantic HTML + landmarks + heading order · localized alt text · labelled forms + clear errors · `prefers-reduced-motion` · colour never the sole signal · AA across all six locales. Test with axe + manual keyboard/screen-reader pass on core flows (home, product, quality, RFQ, `/rfq`).

---

## 11. Tech stack (approved)

**Next.js (App Router, static-first) · TypeScript · Tailwind CSS · next-intl · shadcn/ui · Framer Motion (minimal).**

| Requirement | Served by |
|---|---|
| Multilingual SEO (6 locales, hreflang, x-default, localized metadata/OG) | **next-intl** + App Router + Metadata API |
| Performance / CWV (WebP/AVIF, no-CLS images) | Next.js + `next/image`; static export + CDN |
| Accessible, consistent components themed to the brand | **shadcn/ui** (Radix a11y) themed with Nile Harvest tokens |
| Purposeful, minimal motion | **Framer Motion**, used sparingly |
| RFQ handling without a separate backend | Next.js route handlers → transactional email |
| Long-term maintainability + future portal | Typed, mainstream ecosystem; portal can be added without re-platform |

**Content model:** MVP content (specs, copy) in typed local/MDX files + next-intl message catalogues — **no CMS to launch** (avoid over-engineering). Add a headless CMS only if non-technical editors later manage `/news` + translations.

---

## 12. MVP scope & roadmap

**MVP (launch):**
- Pages: Home · Sweet Potatoes · Quality · About · Contact · **/rfq**.
- **Six languages live** (EN/DE/NL/FR/ES/IT) — pending human translations.
- RFQ + WhatsApp + gated spec-sheet + thank-you/conversion event.
- Full SEO/perf/a11y foundations; schema; analytics; documented placeholder imagery.

**Phase 2 (post-launch):** News/blog SEO engine; case studies & client logos (real); sample-request polish; localized slugs; real photography swapped in.

**Phase 3 (deferred):** buyer portal; additional crops; headless CMS; CRM integration.

---

## 13. What we need from you to build (dependencies)

From `00` §7 — build can start on structure; **launch needs:**
- **Confirmed certifications** (+ scans, numbers, dates) — nothing displayed until verified.
- **Company facts** (founded, hectares, capacity, tonnes, countries, team) for the stat band/About.
- **Operations:** ports, Incoterms, transit times, MOQ.
- **Real photography** to replace documented placeholders (prioritise hero + supply chain).
- **Human translations** for DE/NL/FR/ES/IT.
- Legal name, address, WhatsApp, email, domain; any nameable client references.

---

## 14. Approval gate (Phase 3 — Validation)

Please confirm (or edit) the revised plan:
1. ✅/✏️ Positioning + **product-is-hero** principle (`00` §4, `01` §2).
2. ✅/✏️ Palette "Nile Harvest" + type direction (`01`).
3. ✅/✏️ **Lean IA** + homepage order + **dedicated `/rfq` landing** (§1, §2, §5).
4. ✅/✏️ **RFQ form spec** + conversion flow (§6).
5. ✅/✏️ **Six languages at launch** via next-intl (§7) — and the human-translation dependency.
6. ✅/✏️ Tech stack (§11).
7. 📋 Provide / schedule the **dependencies** (§13) — especially certifications, company facts, and real photography.

**On your sign-off, the next deliverable is Phase 4 — Design: high-fidelity _desktop and mobile_ designs** of the key screens (Home, Sweet Potatoes, Quality, `/rfq`, Contact), strictly following the approved Brand System. **Development begins only after the designs are reviewed and approved.**
