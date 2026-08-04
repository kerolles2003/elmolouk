import { routing } from "@/i18n/routing";
import { contact, siteConfig, OG_CARDS } from "@/lib/site";
import { absoluteUrl } from "@/lib/seo";

/**
 * Structured data for the site.
 *
 * Two rules hold everything here together.
 *
 * One identity per entity. The company and the website each get a
 * locale-independent `@id` on the bare domain, and every other node — product,
 * breadcrumb, the website's publisher — points at that `@id` instead of
 * restating the name and the logo. Seven locales across four pages is
 * twenty-eight chances for a hand-copied company name to drift; with a single
 * node to drift from, there are none.
 *
 * And nothing unverified. `docs/03-launch-dependencies.md` governs: a fact the
 * client has not confirmed is omitted, never guessed. That is why there is no
 * `LocalBusiness` node (see below), no `foundingDate`, no `numberOfEmployees`,
 * and no certification scheme in `knowsAbout` — every scheme named on the site
 * is still marked ``, and a crawler cannot see the dashed
 * placeholder chip the page draws around it.
 */

const ORG_ID = `${siteConfig.domain}/#organization`;
const SITE_ID = `${siteConfig.domain}/#website`;

/** The full lockup, not the favicon crop: `Organization.logo` is shown at size. */
const LOGO = {
  url: `${siteConfig.domain}/images/logo_english.png`,
  width: 533,
  height: 468,
};

export function organizationJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    alternateName: siteConfig.alternateNames,
    url: absoluteUrl(locale, "/"),
    logo: {
      "@type": "ImageObject",
      "@id": `${siteConfig.domain}/#logo`,
      ...LOGO,
      caption: siteConfig.name,
    },
    image: {
      "@type": "ImageObject",
      url: `${siteConfig.domain}${OG_CARDS.default.url}`,
    },
    description:
      "Egyptian exporter of orange-fleshed sweet potatoes — Beauregard and Bellevue — in bulk export packaging for European importers.",
    /* Contact details come from lib/site.ts, so the schema can never drift from
       what the pages print. Telephone is the E.164 form Google expects. */
    telephone: contact.phoneE164,
    email: contact.email,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: contact.phoneE164,
        email: contact.email,
        areaServed: ["EU", "GB", "EG"],
        // The languages the export desk answers in — exactly the set the site
        // is published in, so adding a locale to routing keeps this honest.
        availableLanguage: [...routing.locales],
      },
      {
        // The click-to-chat link identifies the same desk, but it is a deep
        // link into a conversation, not a profile page — so it is a contact
        // point, not a `sameAs`.
        "@type": "ContactPoint",
        contactType: "customer support",
        url: contact.whatsapp,
        availableLanguage: [...routing.locales],
      },
    ],
    address: {
      "@type": "PostalAddress",
      // Latin script, not the Arabic line: this node is read by crawlers that
      // index one canonical form of the company, not by a locale's visitors.
      streetAddress: siteConfig.addressParts.street,
      addressLocality: siteConfig.addressParts.locality,
      addressRegion: siteConfig.addressParts.region,
      addressCountry: siteConfig.country,
    },
    areaServed: [
      { "@type": "Place", name: "Europe" },
      { "@type": "Place", name: "United Kingdom" },
    ],
    knowsAbout: [
      "Sweet potato export",
      "Orange-fleshed sweet potato",
      "Beauregard sweet potato",
      "Bellevue sweet potato",
      "Cold chain logistics",
      "Fresh produce packing",
    ],
    // Only real, client-verified profiles. Omitted entirely until they are
    // supplied — pointing a crawler at an account that may not be theirs is
    // worse than pointing it nowhere.
    ...(siteConfig.social.length > 0 ? { sameAs: siteConfig.social } : {}),
  };
}

/**
 * `LocalBusiness` is still not emitted, but no longer for want of an address —
 * that one landed and now fills the Organization's `PostalAddress` above. What
 * the node would still be guessing at is `openingHours` — the office hours are
 * an unconfirmed placeholder in the dictionaries — and `geo`. Add it once those
 * land: same `@id`, same logo, same name, rendered beside the Organization on
 * the contact page.
 *
 * @see docs/03-launch-dependencies.md §6
 */

export function websiteJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    url: absoluteUrl(locale, "/"),
    name: siteConfig.name,
    alternateName: siteConfig.legalName,
    description:
      "Bulk Egyptian orange-fleshed sweet potatoes for European importers — varieties, export packaging, cold chain and quality control.",
    inLanguage: locale,
    publisher: { "@id": ORG_ID },
  };
}

export function productJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${absoluteUrl(locale, "/sweet-potatoes")}#product`,
    name: "Egyptian Orange-Fleshed Sweet Potato",
    category: "Fresh produce",
    description:
      "Beauregard and Bellevue orange-fleshed sweet potatoes, Class I, cured and cold-chain monitored, in bulk export cartons of 3, 6 and 10 kg. Minimum order 5 metric tons.",
    image: `${siteConfig.domain}${OG_CARDS.product.url}`,
    brand: { "@type": "Brand", name: siteConfig.name, logo: LOGO.url },
    manufacturer: { "@id": ORG_ID },
    countryOfOrigin: { "@type": "Country", name: "Egypt" },
    url: absoluteUrl(locale, "/sweet-potatoes"),
    // No `offers`: pricing is per enquiry and no price is published anywhere on
    // the site. An Offer without a price is an invalid one.
  };
}

export function breadcrumbJsonLd(
  locale: string,
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(locale, items[items.length - 1]?.path ?? "/")}#breadcrumb`,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(locale, it.path),
    })),
  };
}
