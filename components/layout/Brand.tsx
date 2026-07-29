import {Link} from '@/i18n/navigation';
import {BrandLogo} from './BrandLogo';
import {cn} from '@/lib/utils';

/**
 * Home link. The artwork is the whole of it — the name lives in the lockup, in
 * the script the current locale reads, so there is no text wordmark to keep in
 * sync and nothing to announce twice to a screen reader.
 *
 * `group` is here so the mark can respond to a hover anywhere on the link.
 */
export function Brand({className}: {className?: string}) {
  return (
    <Link href="/" className={cn('group inline-flex shrink-0 items-center', className)}>
      <BrandLogo />
    </Link>
  );
}
