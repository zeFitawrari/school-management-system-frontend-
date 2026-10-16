import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingLabel?: string;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-800',
  secondary: 'border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground',
  ghost: 'text-foreground hover:bg-accent hover:text-accent-foreground',
  danger: 'bg-danger text-white hover:bg-red-700',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-3 py-1.5 text-sm',
  md: 'min-h-11 px-4 py-2 text-sm',
  lg: 'min-h-12 px-5 py-2.5 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingLabel = 'Loading',
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={props.type ?? 'button'}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-disabled={disabled || loading || undefined}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className ?? '',
      ].join(' ')}
      {...props}
    >
      {loading ? (
        <>
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
          <span>{loadingLabel}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

export type ButtonIconProps = Omit<ButtonProps, 'children'> & { children: ReactNode };
