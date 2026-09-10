/**
 * SsoButton — an outline Button carrying an identity provider's brand mark.
 *
 *   <SsoButton provider="google" onClick={signIn} />
 *   <SsoButtonGroup onProviderSelect={signIn} />
 *
 * The marks are inline SVG on purpose: a registry component must install with
 * no icon dependency of its own. GitHub draws in `currentColor` so it follows
 * the theme; Google and Microsoft keep their brand colours, which are legible
 * on both the light and the dark surface.
 */

import { cn } from '@/lib/utils';
import { Button, TButtonProps } from '@/registry/default/ui/button';

export const SSO_PROVIDERS = ['google', 'github', 'microsoft'] as const;

export type TSsoProvider = (typeof SSO_PROVIDERS)[number];

const PROVIDER_NAMES: Record<TSsoProvider, string> = {
  google: 'Google',
  github: 'GitHub',
  microsoft: 'Microsoft',
};

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.15-4.53H2.17v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.85 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.17a11 11 0 0 0 0 9.9l3.68-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.83 6.05l3.68 2.84c.86-2.6 3.29-4.51 6.15-4.51Z"
      />
    </svg>
  );
}

function GithubMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7 0-.7 0-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.2-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.7.3 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1.1.9 2.3v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z" />
    </svg>
  );
}

function MicrosoftMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 23 23" aria-hidden="true">
      <path fill="#F25022" d="M1 1h10v10H1z" />
      <path fill="#7FBA00" d="M12 1h10v10H12z" />
      <path fill="#00A4EF" d="M1 12h10v10H1z" />
      <path fill="#FFB900" d="M12 12h10v10H12z" />
    </svg>
  );
}

const PROVIDER_MARKS: Record<
  TSsoProvider,
  (props: { className?: string }) => React.ReactElement
> = {
  google: GoogleMark,
  github: GithubMark,
  microsoft: MicrosoftMark,
};

export type TSsoButtonProps = {
  provider: TSsoProvider;
  /** Defaults to `Continue with <provider>`. */
  label?: string;
} & Omit<TButtonProps, 'children'>;

/*
 * `type` defaults to 'button', not the native 'submit': a sign-in card wraps
 * its email field in a <form>, and a submitting provider button would run the
 * email path on the way to the redirect. A caller can still pass 'submit'.
 */

export function SsoButton({
  provider,
  label,
  className,
  variant = 'outline',
  type = 'button',
  ...buttonProps
}: TSsoButtonProps) {
  const Mark = PROVIDER_MARKS[provider];

  return (
    <Button
      type={type}
      variant={variant}
      className={cn('w-full gap-2', className)}
      {...buttonProps}
    >
      <Mark className="size-4 shrink-0" />
      {label ?? `Continue with ${PROVIDER_NAMES[provider]}`}
    </Button>
  );
}

export type TSsoButtonGroupProps = {
  providers?: readonly TSsoProvider[];
  onProviderSelect?: (provider: TSsoProvider) => void;
  /** Applies to every button; a provider still gets its own label via `labels`. */
  labels?: Partial<Record<TSsoProvider, string>>;
  disabled?: boolean;
  /** Marks one button as busy while its redirect is in flight. */
  loadingProvider?: TSsoProvider;
} & Omit<React.ComponentProps<'div'>, 'onSelect'>;

export function SsoButtonGroup({
  providers = SSO_PROVIDERS,
  onProviderSelect,
  labels,
  disabled,
  loadingProvider,
  className,
  ...divProps
}: TSsoButtonGroupProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)} {...divProps}>
      {providers.map((provider) => (
        <SsoButton
          key={provider}
          provider={provider}
          label={labels?.[provider]}
          disabled={disabled}
          loading={loadingProvider === provider}
          onClick={() => onProviderSelect?.(provider)}
        />
      ))}
    </div>
  );
}
