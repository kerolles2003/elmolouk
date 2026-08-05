'use client';

import {useEffect, useRef, useState, type FormEvent, type ReactNode} from 'react';
import {useTranslations} from 'next-intl';
import {
  ArrowRight,
  CircleAlert,
  CircleCheck,
  LoaderCircle,
  Mail,
  MessageCircle,
} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {Select} from '@/components/ui/select';
import {Textarea} from '@/components/ui/textarea';
import {Button, buttonVariants} from '@/components/ui/button';
import {siteConfig} from '@/lib/site';
import {submitRfq} from '@/lib/web3forms';
import {cn} from '@/lib/utils';

/**
 * RFQ form. Posts to Web3Forms (see `lib/web3forms.ts`), which forwards the
 * enquiry to the company mailbox.
 *
 * The form stays mounted through every outcome and reports what actually
 * happened: it only says an enquiry was *sent* once the API has confirmed it
 * accepted one, and on failure it hands back the two direct channels rather
 * than swallowing the enquiry. WhatsApp is no longer opened on submit — it
 * remains a channel the buyer chooses, not a step the form takes for them.
 */

/** The four answers a container cannot be priced or quoted without. */
type RequiredField = 'port' | 'volume' | 'name' | 'email';

/** Where a submission is in its lifecycle. Drives the button and the panel. */
type Status = 'idle' | 'sending' | 'success' | 'error';

/**
 * Deliberately permissive. This is a courtesy check against a typo, not a gate:
 * a buyer whose address it rejects has no way to argue back, so it asks for no
 * more than something@something.tld.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Reads a field and strips surrounding whitespace in one step. */
const field = (data: FormData, key: string) => String(data.get(key) ?? '').trim();

/** Named set of fields. Six inputs in a row read as a wall; two sets don't. */
function Group({legend, children}: {legend?: string; children: ReactNode}) {
  return (
    <fieldset className="min-w-0 border-0 p-0">
      {legend && (
        <legend className="mb-3 text-[12px] font-bold uppercase tracking-[0.1em] text-ink-soft">
          {legend}
        </legend>
      )}
      {children}
    </fieldset>
  );
}

/** Field-level message, tied to its input through `aria-describedby`. */
function FieldError({id, children}: {id: string; children: string}) {
  return (
    <p id={id} className="flex items-start gap-1.5 text-[12.5px] font-semibold text-danger">
      <CircleAlert className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden />
      {children}
    </p>
  );
}

export function RfqForm({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const t = useTranslations('rfqForm');
  const tf = useTranslations('footer');
  const tc = useTranslations('common');
  const [status, setStatus] = useState<Status>('idle');
  /** Which required fields came back wrong, and what to say about each. */
  const [errors, setErrors] = useState<Partial<Record<RequiredField, string>>>({});
  const panelRef = useRef<HTMLDivElement>(null);
  /*
    The double-submit latch. `status` cannot do this job on its own: it is read
    from the render closure, so two submits dispatched before React re-renders
    both see `idle` and both post. A ref is written and read in the same tick,
    which is the only thing that closes that window.
  */
  const inFlight = useRef(false);
  const incoterms = t.raw('incotermOptions') as string[];

  /** `undefined` rather than `false`, so the attribute is absent when valid. */
  const invalid = (name: RequiredField) => (errors[name] ? true : undefined);
  const describedBy = (name: RequiredField) =>
    errors[name] ? `rfq-${name}-error` : undefined;

  /*
    Send focus to the outcome once there is one. The live region announces it to
    a screen reader, but focus is what moves a keyboard user — and a phone
    viewport — to a panel that would otherwise sit off-screen below the fold.
  */
  useEffect(() => {
    if (status === 'success' || status === 'error') panelRef.current?.focus();
  }, [status]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;

    const form = event.currentTarget;
    const data = new FormData(form);

    /* Insertion order is document order, so the first key is the first field
       on the page — which is the one that gets focus. */
    const found: Partial<Record<RequiredField, string>> = {};
    const port = field(data, 'destination_port');
    const volume = field(data, 'quantity');
    const name = field(data, 'name');
    const email = field(data, 'email');

    if (!port) found.port = t('errorPort');
    if (!volume) found.volume = t('errorVolume');
    if (!name) found.name = t('errorName');
    if (!email) found.email = t('errorEmail');
    else if (!EMAIL.test(email)) found.email = t('errorEmailFormat');

    const gaps = Object.keys(found) as RequiredField[];
    if (gaps.length) {
      setErrors(found);
      setStatus('idle');
      /* The DOM name differs from the error key for the two renamed fields, so
         the focus target is looked up rather than derived from the key. */
      const domName = {port: 'destination_port', volume: 'quantity', name: 'name', email: 'email'}[
        gaps[0]
      ];
      form.querySelector<HTMLInputElement>(`[name="${domName}"]`)?.focus();
      return;
    }

    setErrors({});

    /* Honeypot. A human cannot reach this checkbox — it is display-none, out of
       the tab order and hidden from assistive tech — so a tick means a bot.
       Drop the submission without a request; Web3Forms also rejects it server
       side from the same field, which is why it is still sent below. */
    const botcheck = field(data, 'botcheck');
    if (botcheck) return;

    inFlight.current = true;
    setStatus('sending');
    try {
      await submitRfq({
        name,
        company: field(data, 'company'),
        email,
        phone: field(data, 'phone'),
        destination_port: port,
        quantity: volume,
        product: field(data, 'product'),
        incoterm: field(data, 'incoterm'),
        message: field(data, 'message'),
        botcheck,
      });
      /* Only reached when Web3Forms confirmed it accepted the enquiry. */
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    } finally {
      inFlight.current = false;
    }
  }

  const hasErrors = Object.keys(errors).length > 0;
  const sending = status === 'sending';

  return (
    <form onSubmit={onSubmit} noValidate className={cn('grid gap-6', className)}>
      <Group legend={compact ? undefined : t('legendNeed')}>
        <div className={cn('grid gap-4', !compact && 'sm:grid-cols-2')}>
          {!compact && (
            <div className="grid gap-1.5 sm:col-span-2">
              <Label htmlFor="rfq-product">{t('product')}</Label>
              {/* The two varieties El Molouk grows, plus an escape hatch. A
                  selector that lists something we do not export sends the buyer
                  a quote request we cannot fill. */}
              <Select id="rfq-product" name="product" defaultValue={t('productBeauregard')}>
                <option>{t('productBeauregard')}</option>
                <option>{t('productBellevue')}</option>
                <option>{t('productOther')}</option>
              </Select>
            </div>
          )}

          <div className="grid gap-1.5">
            <Label htmlFor="rfq-port" required>
              {t('destinationPort')}
            </Label>
            <Input
              id="rfq-port"
              name="destination_port"
              placeholder={t('destinationPortPlaceholder')}
              required
              aria-required="true"
              aria-invalid={invalid('port')}
              aria-describedby={describedBy('port')}
              autoComplete="off"
              autoCapitalize="words"
              enterKeyHint="next"
            />
            {errors.port && <FieldError id="rfq-port-error">{errors.port}</FieldError>}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="rfq-volume" required>
              {t('volume')}
            </Label>
            <Input
              id="rfq-volume"
              name="quantity"
              placeholder={t('volumePlaceholder')}
              required
              aria-required="true"
              aria-invalid={invalid('volume')}
              aria-describedby={describedBy('volume')}
              /* Volumes read like "2 × 40ft reefer", so this wants the ordinary
                 keyboard, not the digits-only pad. */
              autoComplete="off"
              enterKeyHint="next"
            />
            {errors.volume && <FieldError id="rfq-volume-error">{errors.volume}</FieldError>}
            {/* The minimum order belongs next to the field it constrains, not
                only in the FAQ — a buyer who types 2 t here should learn it
                before they submit, not in the reply. */}
            <p className="text-[12px] text-ink-soft">{t('moqNote')}</p>
          </div>

          {!compact && (
            <div className="grid gap-1.5">
              <Label htmlFor="rfq-incoterm">
                {t('incoterm')}
                <span className="font-normal text-ink-soft"> · {t('optional')}</span>
              </Label>
              <Select id="rfq-incoterm" name="incoterm">
                {incoterms.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </Select>
            </div>
          )}
        </div>
      </Group>

      <Group legend={compact ? undefined : t('legendReach')}>
        {/* Same two-column rhythm as the group above, so the added contact
            fields sit on the existing grid rather than introducing a new one. */}
        <div className={cn('grid gap-4', !compact && 'sm:grid-cols-2')}>
          <div className="grid gap-1.5">
            <Label htmlFor="rfq-name" required>
              {t('name')}
            </Label>
            <Input
              id="rfq-name"
              name="name"
              placeholder={t('namePlaceholder')}
              required
              aria-required="true"
              aria-invalid={invalid('name')}
              aria-describedby={describedBy('name')}
              autoComplete="name"
              autoCapitalize="words"
              enterKeyHint="next"
            />
            {errors.name && <FieldError id="rfq-name-error">{errors.name}</FieldError>}
          </div>

          {!compact && (
            <div className="grid gap-1.5">
              <Label htmlFor="rfq-company">
                {t('company')}
                <span className="font-normal text-ink-soft"> · {t('optional')}</span>
              </Label>
              <Input
                id="rfq-company"
                name="company"
                placeholder={t('companyPlaceholder')}
                autoComplete="organization"
                autoCapitalize="words"
                enterKeyHint="next"
              />
            </div>
          )}

          <div className="grid gap-1.5">
            <Label htmlFor="rfq-email" required>
              {t('email')}
            </Label>
            <Input
              id="rfq-email"
              name="email"
              type="email"
              placeholder={t('emailPlaceholder')}
              required
              aria-required="true"
              aria-invalid={invalid('email')}
              aria-describedby={describedBy('email')}
              /* `type=email` already picks the @-bearing keyboard; these stop iOS
                 capitalising the first letter and offer the saved work address. */
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              inputMode="email"
              enterKeyHint={compact ? 'send' : 'next'}
            />
            {errors.email && <FieldError id="rfq-email-error">{errors.email}</FieldError>}
          </div>

          {!compact && (
            <div className="grid gap-1.5">
              <Label htmlFor="rfq-phone">
                {t('phone')}
                <span className="font-normal text-ink-soft"> · {t('optional')}</span>
              </Label>
              {/* `dir="ltr"` so a leading `+` keeps its place on the Arabic page,
                  the same isolation the printed numbers get elsewhere. */}
              <Input
                id="rfq-phone"
                name="phone"
                type="tel"
                dir="ltr"
                placeholder={t('phonePlaceholder')}
                autoComplete="tel"
                inputMode="tel"
                enterKeyHint="next"
              />
            </div>
          )}

          {!compact && (
            <div className="grid gap-1.5 sm:col-span-2">
              <Label htmlFor="rfq-message">
                {t('message')}
                <span className="font-normal text-ink-soft"> · {t('optional')}</span>
              </Label>
              <Textarea id="rfq-message" name="message" placeholder={t('messagePlaceholder')} />
            </div>
          )}
        </div>
      </Group>

      {/* Honeypot. Hidden from sight, from the tab order and from assistive
          tech, so only an indiscriminate bot ever ticks it. */}
      <input
        type="checkbox"
        name="botcheck"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="grid gap-3">
        {hasErrors && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-2xl border border-danger/30 bg-danger/8 px-4 py-3 text-[13px] font-semibold text-danger"
          >
            <CircleAlert className="mt-px h-4 w-4 shrink-0" aria-hidden />
            {t('errorRequired')}
          </p>
        )}

        {/*
          The live region is mounted for the life of the form, empty until there
          is something to say. A region that appears at the same moment as its
          text is announced unreliably — screen readers watch regions that were
          already there.
        */}
        <div aria-live="polite" aria-atomic="true">
          {status === 'success' && (
            <div
              ref={panelRef}
              tabIndex={-1}
              className="rounded-3xl border border-leaf/25 bg-leaf/8 p-6 text-center outline-none"
            >
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-leaf/15 text-leaf-deep">
                <CircleCheck className="h-6 w-6" aria-hidden />
              </span>
              <p className="mt-4 text-[19px] font-bold">{t('success')}</p>
              <p className="mx-auto mt-2 max-w-[46ch] text-[14px] leading-relaxed text-ink-soft">
                {t('successNote')}
              </p>
            </div>
          )}

          {status === 'error' && (
            <div
              ref={panelRef}
              tabIndex={-1}
              className="rounded-3xl border border-danger/30 bg-danger/8 p-6 text-center outline-none"
            >
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-danger/15 text-danger">
                <CircleAlert className="h-6 w-6" aria-hidden />
              </span>
              <p className="mt-4 text-[19px] font-bold">{t('error')}</p>
              <p className="mx-auto mt-2 max-w-[46ch] text-[14px] leading-relaxed text-ink-soft">
                {t('errorNote')}
              </p>
              {/* The enquiry is still in the fields above — nothing was cleared —
                  and these two reach the same desk without it. */}
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <a
                  href={siteConfig.whatsapp}
                  target="_blank"
                  rel="noopener"
                  className={cn(buttonVariants({size: 'sm'}), 'min-h-11')}
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  {t('openWhatsApp')}
                </a>
                <a
                  href={siteConfig.emailHref}
                  className={cn(buttonVariants({variant: 'outline', size: 'sm'}), 'min-h-11')}
                >
                  <Mail className="h-4 w-4" aria-hidden />
                  {t('sendEmail')}
                </a>
              </div>
            </div>
          )}
        </div>

        <Button type="submit" block size={compact ? 'default' : 'lg'} disabled={sending}>
          {sending ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
              {t('sending')}
            </>
          ) : (
            <>
              {t('submit')}
              <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden />
            </>
          )}
        </Button>

        <p className="flex items-center gap-2 border-t border-line pt-3 text-[12px] text-ink-soft">
          <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-wa" />
          {t('trust')}
        </p>

        {/* The two documents, at the point where the buyer parts with an
            e-mail address. Labels come from the footer namespace so the same
            document is called the same thing wherever it is linked. */}
        <p className="text-[12px] leading-relaxed text-ink-soft">
          {t('legalNote')}{' '}
          <Link href="/terms" className="font-semibold underline-offset-2 hover:underline">
            {tf('terms')}
          </Link>
          {' · '}
          <Link href="/privacy" className="font-semibold underline-offset-2 hover:underline">
            {tf('privacy')}
          </Link>
        </p>
      </div>
    </form>
  );
}
