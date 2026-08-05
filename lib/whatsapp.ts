/**
 * The one place a WhatsApp deep link is assembled.
 *
 * The site's primary conversion path is a WhatsApp chat, not a form, so every
 * headline button on every page ends up here. Two rules hold it together:
 *
 *  - The digits are never written down twice. They are derived from
 *    `contact.phoneE164` in lib/site.ts — the number the client verified — so a
 *    corrected phone number corrects every button, `tel:` link and piece of
 *    structured data in one edit.
 *  - The pre-filled text is a translation, not a literal. A buyer reading the
 *    Dutch page opens a chat already written in Dutch (see `common.whatsappMessage`
 *    in messages/), which is what turns "start a conversation" from a blank box
 *    into a brief the export desk can price.
 */
import {contact} from './site';

/** `wa.me` wants bare digits — no `+`, no spaces. */
export const WHATSAPP_NUMBER = contact.phoneE164.replace(/\D/g, '');

/**
 * Percent-encodes a query value, including the five characters
 * `encodeURIComponent` leaves alone.
 *
 * `!'()*` are legal in a URL, so the browser and WhatsApp would both cope — but
 * an apostrophe reaches the page as `&#x27;` inside the `href` attribute, and
 * "I'm interested in importing…" is a sentence that has one. Encoding them here
 * keeps the query opaque: what ships in the HTML is what WhatsApp receives, with
 * nothing in between deciding how to read a quote mark.
 */
function encodeQuery(value: string): string {
  return encodeURIComponent(value).replace(
    /[!'()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

/**
 * A chat link, optionally opening with the enquiry already typed.
 *
 * The encoding is what makes a multi-line message survive the trip: the
 * newlines that separate "Destination port:" from "Estimated quantity:" travel
 * as `%0A`, and WhatsApp restores them in the composer.
 */
export function whatsappHref(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeQuery(message)}` : base;
}

/**
 * What every WhatsApp anchor on the site carries.
 *
 * A new tab, always: on desktop `wa.me` hands off to WhatsApp Web or the native
 * client, and doing that in the current tab throws away the page the buyer was
 * reading — including the specification they were about to ask about. `noopener`
 * is the standard companion, and costs nothing.
 */
export const WHATSAPP_LINK_PROPS = {
  target: '_blank',
  rel: 'noopener',
} as const;
