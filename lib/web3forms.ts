/**
 * The RFQ form's backend: Web3Forms' hosted submission endpoint.
 *
 * There is no route handler and no mail dependency in this project — Web3Forms
 * receives the POST directly from the browser and forwards it to the mailbox
 * registered against the access key. That is why this module is the whole
 * server side of the enquiry flow, and why it is written to fail loudly: the
 * form may only claim an enquiry was sent when Web3Forms says it accepted one.
 */

const ENDPOINT = 'https://api.web3forms.com/submit';

/**
 * Access keys are public by design — they name the destination mailbox, not the
 * sender, and every Web3Forms integration ships one in client-side code. The
 * env var lets a staging deploy point at a different mailbox without a code
 * change; the literal keeps the form working on a fresh clone, where this repo
 * has no `.env` file to read (`.env*` is git-ignored).
 */
const ACCESS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ??
  '67b6f404-2a3e-4c58-a3a4-0dd54bad3ca7';

/**
 * A buyer on packhouse wifi should not watch a spinner forever. `fetch` has no
 * timeout of its own, so without this an unreachable API leaves the form stuck
 * in `sending` with no way back.
 */
const TIMEOUT_MS = 15_000;

/** What the subject line and sender name read as in the company's inbox. */
const SUBJECT = 'New Export Inquiry — El Molouk Website';
const FROM_NAME = 'El Molouk Website';

/** The enquiry, already trimmed by the form. */
export type RfqFields = {
  name: string;
  company: string;
  email: string;
  phone: string;
  destination_port: string;
  quantity: string;
  product: string;
  incoterm: string;
  message: string;
  /** Honeypot. Empty for a human; Web3Forms drops the submission if it is not. */
  botcheck: string;
};

/**
 * POSTs the enquiry and resolves only when Web3Forms confirms it was accepted.
 *
 * Throws on every other outcome — network failure, timeout, non-2xx, a body
 * that is not JSON, and a 200 whose payload reports `success: false`. The last
 * one is the reason this cannot be a bare `res.ok` check: Web3Forms answers an
 * invalid access key with HTTP 200 and `{"success": false}`, so trusting the
 * status code alone would report a delivered enquiry that never left.
 */
export async function submitRfq(fields: RfqFields): Promise<void> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: ACCESS_KEY,
        subject: SUBJECT,
        from_name: FROM_NAME,
        /* So the export desk can answer the buyer by hitting Reply, rather than
           copying the address out of the message body. */
        replyto: fields.email,
        ...fields,
      }),
      signal: controller.signal,
    });

    /* A non-JSON body means something other than the API answered — a captive
       portal, a proxy error page. Treated as a failure, never as a send. */
    const data: unknown = await res.json().catch(() => null);
    const accepted =
      res.ok &&
      typeof data === 'object' &&
      data !== null &&
      (data as {success?: unknown}).success === true;

    if (!accepted) {
      const reason =
        typeof data === 'object' && data !== null
          ? String((data as {message?: unknown}).message ?? res.status)
          : String(res.status);
      throw new Error(`Web3Forms rejected the submission: ${reason}`);
    }
  } finally {
    clearTimeout(timer);
  }
}
