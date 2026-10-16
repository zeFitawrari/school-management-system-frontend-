import { useId, type SelectHTMLAttributes } from 'react';

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export function Select({ label, hint, error, id, className, children, ...props }: SelectProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const descriptionId = `${fieldId}-description`;
  const hasDescription = Boolean(hint || error);

  return (
    <div className="space-y-1">
      {label ? (
        <label htmlFor={fieldId} className="block text-sm font-medium text-foreground">
          {label}
        </label>
      ) : null}
      <select
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={hasDescription ? descriptionId : undefined}
        className={[
          'min-h-11 w-full rounded-md border bg-background px-3 py-2 text-base text-foreground outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring',
          error ? 'border-danger' : 'border-input',
          className ?? '',
        ].join(' ')}
        {...props}
      >
        {children}
      </select>
      {hasDescription ? (
        <p
          id={descriptionId}
          className={error ? 'text-sm text-danger' : 'text-sm text-muted-foreground'}
          role={error ? 'alert' : undefined}
        >
          {error ?? hint}
        </p>
      ) : null}
    </div>
  );
}
