import { useId, type InputHTMLAttributes } from 'react';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export function Input({ label, hint, error, id, className, ...props }: InputProps) {
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
      <input
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={hasDescription ? descriptionId : undefined}
        className={[
          'min-h-11 w-full rounded-md border bg-background px-3 py-2 text-base text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring',
          error ? 'border-danger' : 'border-input',
          className ?? '',
        ].join(' ')}
        {...props}
      />
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
