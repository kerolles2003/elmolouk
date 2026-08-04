'use client';

import {useState, type FormEvent, type ReactNode} from 'react';
import {useTranslations} from 'next-intl';
import {ArrowRight, CircleAlert, CircleCheck, Mail, MessageCircle} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {Select} from '@/components/ui/select';
import {Textarea} from '@/components/ui/textarea';
import {Button, buttonVariants} from '@/components/ui/button';
import {siteConfig} from '@/lib/site';
import {cn} from '@/lib/utils';

/**
 * RFQ form. Frontend-only: there is no server endpoint behind it, so it never
 * claims the enquiry was *sent*. On submit it composes the message, opens a
 * pre-filled WhatsApp thread (the conversion path in the approved design) and
 * says the request is *ready to send* — then hands over both the WhatsApp link
 * and a pre-filled mailto as real, clickable fallbacks.
 *
 * That branch matters more than it looks: `window.open` returns null under a
 * popup blocker, and a corporate procurement desk is exactly where popups are
 * blocked. Claiming success there would lose the enquiry silently.
 */

/** The three answers a container cannot be priced without. */
type RequiredField = 'port' | 'volume' | 'email';

/**
 * Deliberately permissive. This is a courtesy check against a typo, not a gate:
 * a buyer whose address it rejects has no way to argue back, so it asks for no
 * more than something@something.tld.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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
  /** The composed request, kept so the confirmation can offer it again. */
  const [sent, setSent] = useState<{whatsapp: string; email: string} | null>(null);
  /** Which required fields came back wrong, and what to say about each. */
  const [errors, setErrors] = useState<Partial<Record<RequiredField, string>>>({});
  const incoterms = t.raw('incotermOptions') as string[];

  /** `undefined` rather than `false`, so the attribute is absent when valid. */
  const invalid = (field: RequiredField) => (errors[field] ? true : undefined);
  const describedBy = (field: RequiredField) =>
    errors[field] ? `rfq-${field}-error` : undefined;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const port = String(data.get('port') ?? '').trim();
    const volume = String(data.get('volume') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();

    // Insertion order is document order, so the first key is the first field.
    const found: Partial<Record<RequiredField, string>> = {};
    if (!port) found.port = t('errorPort');
    if (!volume) found.volume = t('errorVolume');
    if (!email) found.email = t('errorEmail');
    else if (!EMAIL.test(email)) found.email = t('errorEmailFormat');

    const gaps = Object.keys(found) as RequiredField[];
    if (gaps.length) {
      setErrors(found);
      /*
        Send focus to the first field that needs work. On a phone the form is
        often taller than the viewport, so a message alone can sit off-screen
        and leave the buyer guessing which field it means. Focus also makes a
        screen reader announce that field's message, which is what the
        aria-describedby wiring is for.
      */
      form.querySelector<HTMLInputElement>(`[name="${gaps[0]}"]`)?.focus();
      return;
    }

    setErrors({});
    const subject = 'RFQ — El Molouk';
    const lines = [
      subject,
      `Product: ${data.get('product') ?? 'Sweet potato'}`,
      `Port: ${port}`,
      `Volume: ${volume}`,
      data.get('incoterm') ? `Incoterm: ${data.get('incoterm')}` : '',
      `Email: ${email}`,
      data.get('message') ? `Message: ${data.get('message')}` : '',
    ].filter(Boolean);
    const body = lines.join('\n');
    setSent({
      whatsapp: `${siteConfig.whatsapp}?text=${encodeURIComponent(body)}`,
      email: `${siteConfig.emailHref}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    });
    window.open(`${siteConfig.whatsapp}?text=${encodeURIComponent(body)}`, '_blank', 'noopener');
  }

  if (sent) {
    return (
      <div className={cn('rounded-3xl border border-leaf/25 bg-leaf/8 p-6 text-center', className)}>
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-leaf/15 text-leaf-deep">
          <CircleCheck className="h-6 w-6" aria-hidden />
        </span>
        <p className="mt-4 text-[19px] font-bold">{t('success')}</p>
        <p className="mx-auto mt-2 max-w-[46ch] text-[14px] leading-relaxed text-ink-soft">
          {t('successNote')}
        </p>
        {/* Both routes stay open. If the popup was blocked the buyer has lost
            nothing — the same composed message is one click away here. */}
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <a
            href={sent.whatsapp}
            target="_blank"
            rel="noopener"
            className={cn(buttonVariants({size: 'sm'}), 'min-h-11')}
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            {t('openWhatsApp')}
          </a>
          <a
            href={sent.email}
            className={cn(buttonVariants({variant: 'outline', size: 'sm'}), 'min-h-11')}
          >
            <Mail className="h-4 w-4" aria-hidden />
            {t('sendEmail')}
          </a>
        </div>
      </div>
    );
  }

  const hasErrors = Object.keys(errors).length > 0;

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
              name="port"
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
              name="volume"
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
        <div className="grid gap-4">
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
              <Label htmlFor="rfq-message">
                {t('message')}
                <span className="font-normal text-ink-soft"> · {t('optional')}</span>
              </Label>
              <Textarea id="rfq-message" name="message" placeholder={t('messagePlaceholder')} />
            </div>
          )}
        </div>
      </Group>

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

        <Button type="submit" block size={compact ? 'default' : 'lg'}>
          {t('submit')}
          <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden />
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
