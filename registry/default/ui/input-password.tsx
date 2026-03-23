'use client';

import * as React from 'react';

import { EyeIcon, EyeOffIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from '@/registry/default/ui/button';
import { Input } from '@/registry/default/ui/input';

type InputPasswordProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
>;

function InputPassword({ className, ...props }: InputPasswordProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const disabled =
    props.value === '' || props.value === undefined || props.disabled;

  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        className={cn('hide-password-toggle pr-10 font-mono', className)}
        {...props}
      />
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        className="absolute right-1.5 top-1/2 -translate-y-1/2"
        onClick={() => setShowPassword((prev) => !prev)}
        disabled={disabled}
      >
        {showPassword && !disabled ? (
          <EyeIcon className="h-4 w-4" aria-hidden="true" />
        ) : (
          <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
        )}
        <span className="sr-only">
          {showPassword ? 'Hide password' : 'Show password'}
        </span>
      </Button>

      {/* hides browsers password toggles */}
      <style>{`
        .hide-password-toggle::-ms-reveal,
        .hide-password-toggle::-ms-clear {
          visibility: hidden;
          pointer-events: none;
          display: none;
        }
      `}</style>
    </div>
  );
}

export { InputPassword };
