# 00 — Project Brief

**Project:** El Molouk — B2B agricultural export website
**Prepared:** 2026-07-21 · **Rev:** 2 (post Phase-3 review) · **Phase:** 2 (Planning) · **Status:** For approval
**Grounded in:** [`research-findings.md`](research-findings.md)

---

## 1. The brand in one line

**El Molouk (الملوك — "The Kings")** is an Egyptian exporter of premium **orange-fleshed sweet potatoes**, selling B2B to importers, wholesalers, and retail-chain buyers in Western Europe. The name is a strategic asset: *"The Kings"* invites a restrained, premium, heritage-led identity — expressed through a whisper of gold, not literal crowns.

---

## 2. Primary objective — a Google-Ads-first lead engine

The website's #1 job is to **convert qualified RFQs** from European buyers, most of whom arrive via **Google Ads**. It is treated as a **high-converting Ads destination, not a corporate brochure** — every section must earn its place by lifting **Quality Score, trust, or conversion**.

- **Primary conversion:** a **qualified RFQ** — qualified because the form captures *destination port* + *volume*, so sales can triage real importers instantly.
- **Secondary conversions:** WhatsApp chat · gated **export spec-sheet PDF** · sample request.
- **Two conversion surfaces:** the **homepage** (full nav, organic/brand) *and* a **dedicated `/rfq` paid landing page** (stripped nav, single goal) that ads point to — dedicated LPs convert paid traffic 2–5× better (research §8).
- **Not a goal for MVP:** online pricing, e-commerce/checkout, buyer login portal.

---

## 3. Target audience

Three overlapping B2B personas — procurement-minded, risk-averse, and increasingly researching via AI tools:

| Persona | What they need to act | Primary channel |
|---|---|---|
| **Importer / trader** (NL, DE) — buys by the container, resells across the EU | Volumes, container loading, Incoterms/ports, year-round availability, value vs USA/Spain | RFQ, WhatsApp |
| **Wholesaler / distributor** (DE, FR, IT) — supplies regional food service/retail | Consistent calibers, packaging flexibility, reliability, cold-chain proof | RFQ, spec sheet |
| **Retail-chain procurement** (DE, NL) — supermarket programmes | Certifications (GLOBALG.A.P. + BRCGS/IFS + GRASP/SMETA), traceability, private label, social compliance | Quality page → RFQ |

**Shared mindset:** they verify certifications *before* they talk to you, judge operational competence by site quality/speed, and expect a fast reply. Trust is earned with evidence (certs, real photos, hard specs), not adjectives.

---

## 4. Positioning & value proposition

**Positioning statement (approved):**
> **A premium Egyptian agricultural exporter built to meet European buyer expectations.**
> Proud of its Egyptian origin, presented with world-class quality, reliability, and professionalism — international without hiding its identity.

**Governing design principle:** **The product is always the hero.** The interface exists to build trust *around* the product — sweet potatoes, packaging, export quality, the farming process, freshness. The UI supports the product; it never competes with it.

**Proof pillars (the "why El Molouk"):**
1. **Certified & compliant** — GLOBALG.A.P. + GFSI food safety + social audits `[[CONFIRM CERTIFICATION]]`.
2. **Origin credibility** — Egyptian orange-fleshed sweet potato; *Egypt is Germany's #1 supplier (2025)*.
3. **Year-round reliability** — Aug–Jan harvest extended by curing + cold storage.
4. **Grower-to-port control** — own farms + packhouse, traceability, cold chain `[[CONFIRM]]`.
5. **Best value vs USA/Spain** — competitive landed cost at comparable Class-I quality.

**Tagline shortlist (finalise in `01`):** *"The Kings of Egyptian Sweet Potatoes."* · *"Grown in Egypt. Trusted across Europe."* · *"Royal roots. European standards."*

---

## 5. Scope (lean MVP)

**Lean rule (applies everywhere):** every page and every section must justify its existence by improving **Trust, Clarity, or Conversion.** No decorative sections. Avoid enterprise complexity.

**In scope (MVP):**
- Single hero product line: **orange-fleshed sweet potatoes** (Beauregard/Bellevue).
- **Lean IA:** Home · Sweet Potatoes (product) · Quality & Certifications · About · Contact · **`/rfq`** (paid landing). *Sustainability/social compliance folded into Quality; a News/blog is deferred.* (Full IA in `02`.)
- **Six languages live at launch** — EN, DE, NL, FR, ES, IT — via **next-intl** (multilingual SEO from day one).
- SEO, performance, and accessibility foundations built in from day one.

**Out of scope (MVP — later phases):**
- Additional crops / multi-product catalogue.
- News/blog content engine (Phase 2 — architecture stays ready).
- Authenticated **buyer portal**; e-commerce / online pricing.

---

## 6. Language plan (revised & confirmed)

Launch with **six locales, all live at day one**: **English, German, Dutch, French, Spanish, Italian** (all Latin-script — Arabic and Portuguese removed, so **no RTL**).

- **Implementation (day one):** **next-intl** — localized routing (`/en/ /de/ /nl/ /fr/ /es/ /it/`), `hreflang`, `x-default`, canonical URLs, localized metadata, localized Open Graph.
- **Layout rule:** design every component so **longer translated strings (especially German) never break the layout.**
- **Translation rule (non-negotiable):** **never hardcode visible text** — every string comes from the translation system. No exceptions.
- **Dependency:** human-quality translations per locale. Machine translation is forbidden (it suppresses rankings across *all* locales — research §5.2).

---

## 7. Assumptions & open items (confirm before Design sign-off / launch)

Marked `[[CONFIRM]]` / `[[CONFIRM CERTIFICATION]]` throughout the docs:

- **Certifications:** *never displayed until client-verified.* Use `[[CONFIRM CERTIFICATION]]` placeholders; **never fabricate or assume** a certification on the live site. *(Assumed set for planning only: GLOBALG.A.P., GRASP, BRCGS/IFS, ISO 22000/HACCP, SMETA, phytosanitary.)*
- **Company facts for the stat band / About:** year founded / "exporting since", hectares farmed, packhouse capacity, tonnes or containers/year, number of markets, team size.
- **Operations:** departure ports (Damietta/Alexandria/Port Said?), Incoterms handled, transit times to key EU ports, MOQ.
- **Photography:** **no professional shoot is assumed.** Design uses **documented high-quality placeholders**, each replaced by real company assets before launch (list & rules in `01` §6).
- **Identity & setup:** legal company name & registration, physical address, WhatsApp number, contact email, domain; any client/retailer references permitted to name.

---

## 8. Success metrics (KPIs)

| Layer | Metric | Target (first 90 days) |
|---|---|---|
| **Primary** | Qualified RFQs / month · cost per qualified lead (CPL) | Establish baseline, improve MoM |
| **Ads** | `/rfq` landing conversion rate · Google **Quality Score** · speed-to-lead | LP conv ≥ 5 % · QS "above average" · reply **< 5 min** |
| **Secondary** | WhatsApp chats · spec-sheet downloads · sample requests | Track as micro-conversions/events |
| **SEO** | Indexed pages/locale, pillar-keyword rankings, organic sessions | Rank the `Egyptian sweet potato exporter` cluster |
| **Quality** | Core Web Vitals (p75) | LCP ≤ 2.5 s · INP ≤ 200 ms · CLS ≤ 0.1 — **all pass** |
| **Accessibility** | WCAG 2.2 AA | No violations on core flows |

---

## 9. Guiding principles

Performance-first · SEO-first · Accessibility-first · **Conversions over visual effects** · **the product is always the hero** · **Google-Ads-first** · **lean MVP — every section justified by Trust/Clarity/Conversion** · never hardcode strings · never fabricate certifications · justify every major decision · avoid over-engineering.

---

## 10. Risks & mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Certifications unconfirmed / weaker than assumed | Undermines the #1 trust lever | Confirm early (§7); `[[CONFIRM CERTIFICATION]]` placeholders; Quality page degrades gracefully if a cert is absent |
| Only placeholder photography at launch | Weakens E-E-A-T + "we own the supply chain" | Documented placeholders; prioritise replacing **hero + supply-chain** shots with real assets first (research §9) |
| Six languages launched thin / machine-translated | SEO penalty across **all** locales | Human-quality translation only; `never hardcode` so swapping copy is trivial |
| Slow/heavy build | Higher CPC + lower Quality Score + lost conversions | Static-first stack + image discipline + CI performance budget (see `02`) |
| Over-building (portal, extra crops, decorative sections) | Delays MVP, dilutes focus | Strict lean scope (§5); each section must justify itself |

---

## 11. Phase roadmap

1. **Research** ✅ → [`research-findings.md`](research-findings.md) *(incl. final focused pass, §8–§9)*
2. **Planning** ⬅ *you are here (Rev 2)* → this brief + [`01-brand-system.md`](01-brand-system.md) + [`02-website-plan.md`](02-website-plan.md)
3. **Validation** — your approval of the revised docs (+ answers to §7). **No design or code before this gate.**
4. **Design** — **high-fidelity desktop + mobile** for the key screens, strictly on the approved brand system.
5. **Development** — static-first build, SEO/perf/a11y baked in, six-language launch. *Begins only after the designs are approved.*
