import type {ReactNode} from 'react';
import {WHATSAPP_LINK_PROPS, whatsappHref} from '@/lib/whatsapp';

/**
 * A button or link that opens a WhatsApp chat with the enquiry already written.
 *
 * Deliberately unstyled: every conversion button on the site keeps the exact
 * classes it had when it pointed at the contact page, and this only takes over
 * the destination. It holds no hooks and no state, so the same component serves
 * the server-rendered pages and the client-side header menu.
 */
export function WhatsAppCta({
  message,
  className,
  ariaLabel,
  onClick,
  children,
}: {
  /** The pre-filled text, already translated. Omit for a bare chat link. */
  message?: string;
  className?: string;
  /** For icon-only buttons, where the visible label is an SVG. */
  ariaLabel?: string;
  /** For callers with a panel to dismiss — the chat opens in a new tab, so
      this page stays exactly where it was and an open menu would stay open. */
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <a
      href={whatsappHref(message)}
      aria-label={ariaLabel}
      onClick={onClick}
      className={className}
      {...WHATSAPP_LINK_PROPS}
    >
      {children}
    </a>
  );
}
